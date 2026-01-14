import { initGun } from './gun'

export type InteractionType =
    'TRADE_OFFER' | 'TRADE_ACCEPTED' | 'TRADE_REJECTED' |
    'ROB_ATTEMPT' | 'ROB_SUCCESS' | 'ROB_FAILED' |
    'BUST_ATTEMPT' | 'BUST_SUCCESS' | 'BUST_FAILED' |
    'CHAT'

export class GunController {
    private gun: any
    private subscriptions: Function[] = []

    constructor() {
        this.gun = initGun()
    }

    syncPlayer(player: any) {
        if (!player) return
        const stats = player.gameData.drugwars
        const area = this.gun.get("regions").get(stats.location)

        // Publish location
        area.get(player.id).put({
            name: player.displayName,
            role: player.role,
            updated: Date.now()
        })

        // Global Leaderboard Sync
        const netWorth = stats.cash + (stats.bank || 0)
        this.gun.get("leaderboard").get(player.id).put({
            name: player.displayName,
            role: player.role,
            netWorth,
            city: stats.cityId,
            updated: Date.now()
        })
    }

    sendChatMessage(sectorId: string, message: any) {
        this.gun.get("regions").get(sectorId).get("chat").set({
            ...message,
            timestamp: Date.now()
        })
    }

    subscribeToChat(sectorId: string, callback: (msg: any) => void) {
        this.gun.get("regions").get(sectorId).get("chat").map().on((msg: any, id: string) => {
            if (msg) callback({ ...msg, id })
        })
    }

    sendInteraction(targetId: string, type: InteractionType, payload: any) {
        this.gun.get("inbox").get(targetId).set({
            type,
            payload,
            from: payload.fromId,
            fromName: payload.fromName,
            timestamp: Date.now(),
            status: 'PENDING'
        })
    }

    subscribeToInbox(myId: string, callback: (interaction: any) => void) {
        this.gun.get("inbox").get(myId).map().on((interaction: any, id: string) => {
            if (interaction && interaction.status === 'PENDING') {
                callback({ ...interaction, id })
            }
        })
    }

    updateInteractionStatus(myId: string, interactionId: string, status: 'ACCEPTED' | 'REJECTED' | 'COMPLETED') {
        this.gun.get("inbox").get(myId).get(interactionId).get("status").put(status)
    }

    syncEncampment(player: any) {
        if (!player) return
        const stats = player.gameData.drugwars
        if (!stats.stash || Object.keys(stats.stash).length === 0) return

        const area = this.gun.get("regions").get(stats.location)
        area.get("encampments").get(player.id).put({
            ownerId: player.id,
            ownerName: player.displayName,
            location: stats.location,
            stash: stats.stash,
            updated: Date.now(),
            isOccupied: true // Placeholder: we'd ideally check online status
        })
    }

    subscribeToEncampments(location: string, callback: (encampments: any[]) => void) {
        const area = this.gun.get("regions").get(location).get("encampments")
        let encampments: any[] = []

        area.map().on((data: any, id: string) => {
            if (!data) {
                encampments = encampments.filter(e => e.id !== id)
            } else {
                const existing = encampments.findIndex(e => e.id === id)
                if (existing >= 0) {
                    encampments[existing] = { ...data, id }
                } else {
                    encampments.push({ ...data, id })
                }
            }
            callback([...encampments])
        })
    }

    leaveLocation(location: string, playerId: string) {
        this.gun.get("regions").get(location).get(playerId).put(null)
    }

    subscribeToPeers(location: string, myId: string, callback: (peers: any[]) => void) {
        const area = this.gun.get("regions").get(location)
        let peers: any[] = []

        area.map().on((peer: any, id: string) => {
            if (id === myId || id === 'tradeVolume' || id === 'encampments') return
            if (!peer) {
                peers = peers.filter(p => p.id !== id)
            } else {
                const existing = peers.findIndex(p => p.id === id)
                if (existing >= 0) {
                    peers[existing] = { ...peer, id }
                } else {
                    peers.push({ ...peer, id })
                }
            }
            callback([...peers])
        })
    }

    subscribeToLeaderboard(callback: (board: any[]) => void) {
        let board: any[] = []
        this.gun.get("leaderboard").map().on((entry: any, id: string) => {
            if (!entry) {
                board = board.filter(b => b.id !== id)
            } else {
                const existing = board.findIndex(b => b.id === id)
                if (existing >= 0) {
                    board[existing] = { ...entry, id }
                } else {
                    board.push({ ...entry, id })
                }
            }
            // Sort by net worth descending, take top 10
            const sorted = [...board].sort((a, b) => (b.netWorth || 0) - (a.netWorth || 0)).slice(0, 10)
            callback(sorted)
        })
    }

    subscribeToTradeVolume(location: string, callback: (volume: number, resourceId: string) => void) {
        let volume = 0
        const sub = this.gun.get("regions").get(location).get("tradeVolume").map().on((vol: number, key: string) => {
            if (vol > 0) volume++
            callback(vol, key)
        })
    }

    subscribeToBlotter(callback: (event: any) => void) {
        this.gun.get("blotter").map().on((event: any, id: string) => {
            if (event) callback({ ...event, id })
        })
    }

    syncBlotterEvent(event: any) {
        this.gun.get("blotter").set(event)
    }

    recordTrade(location: string, resourceId: string, quantity: number) {
        const node = this.gun.get("regions").get(location).get("tradeVolume").get(resourceId)
        node.once((v: number) => {
            node.put((v || 0) + quantity)
        })
    }
}

export const gunController = new GunController()
