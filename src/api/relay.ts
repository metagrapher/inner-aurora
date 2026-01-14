import { DurableObject } from "cloudflare:workers"

/**
 * GunRelay Durable Object
 * Acts as a lightweight relay for Gun.js mesh network.
 * Handles WebSocket connections and broadcasts messages to all peers.
 */
export class GunRelay extends DurableObject {
    private sessions: Set<WebSocket> = new Set()

    constructor(state: DurableObjectState, env: any) {
        super(state, env)
    }

    async fetch(request: Request) {
        const upgradeHeader = request.headers.get("Upgrade")
        if (!upgradeHeader || upgradeHeader !== "websocket") {
            return new Response("Expected Upgrade: websocket", { status: 426 })
        }

        const [client, server] = new WebSocketPair()

        await this.handleSession(server)

        return new Response(null, {
            status: 101,
            webSocket: client,
        })
    }

    async handleSession(ws: WebSocket) {
        ws.accept()
        this.sessions.add(ws)

        ws.addEventListener("message", (msg) => {
            // Broadcast Gun.js message to all other peers
            this.broadcast(msg.data, ws)
        })

        ws.addEventListener("close", () => {
            this.sessions.delete(ws)
        })

        ws.addEventListener("error", () => {
            this.sessions.delete(ws)
        })
    }

    private broadcast(message: string | ArrayBuffer, sender: WebSocket) {
        for (const session of this.sessions) {
            if (session !== sender && session.readyState === WebSocket.OPEN) {
                try {
                    session.send(message)
                } catch (e) {
                    console.error("Broadcast failed for a session", e)
                    this.sessions.delete(session)
                }
            }
        }
    }
}
