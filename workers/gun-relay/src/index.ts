import { Hono } from 'hono'
import { upgradeWebSocket } from 'hono/cloudflare-workers'

type Bindings = {
    RELAY: DurableObjectNamespace
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/', (c) => c.text('GunDB Relay Active'))

app.get('/gun', upgradeWebSocket(async (c) => {
    const id = c.req.query('id') || 'default'
    const idObj = c.env.RELAY.idFromName(id)
    const stub = c.env.RELAY.get(idObj)
    return await stub.fetch(c.req.raw)
}))

export class Relay {
    state: DurableObjectState
    sessions: WebSocket[] = []

    constructor(state: DurableObjectState, env: Bindings) {
        this.state = state
    }

    async fetch(request: Request) {
        const upgradeHeader = request.headers.get('Upgrade')
        if (!upgradeHeader || upgradeHeader !== 'websocket') {
            return new Response('Expected Upgrade: websocket', { status: 426 })
        }

        const { 0: client, 1: server } = new WebSocketPair()

        // Accept the connection
        this.handleSession(server)

        return new Response(null, {
            status: 101,
            webSocket: client,
        })
    }

    handleSession(webSocket: WebSocket) {
        // 1. Accept the socket
        webSocket.accept()

        // 2. Add to session list
        this.sessions.push(webSocket)

        // 3. Set up event listeners
        webSocket.addEventListener('message', async (event) => {
            try {
                const msg = event.data
                // Broadcast to all OTHER sessions
                this.sessions = this.sessions.filter(s => {
                    try {
                        if (s !== webSocket) {
                            s.send(msg)
                        }
                        return true
                    } catch (err) {
                        // Remove closed sessions
                        return false
                    }
                })
            } catch (err) {
                console.error("Relay error:", err)
            }
        })

        webSocket.addEventListener('close', () => {
            this.sessions = this.sessions.filter(s => s !== webSocket)
        })

        webSocket.addEventListener('error', () => {
            this.sessions = this.sessions.filter(s => s !== webSocket)
        })
    }
}

export default app
