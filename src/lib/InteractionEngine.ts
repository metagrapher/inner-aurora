
import { gunController } from './GunController'

export type InteractionRequest = {
    id?: string
    fromId: string
    fromName: string
    targetId: string
    type: 'TRADE' | 'ROB' | 'BUST' | 'CHAT'
    payload: any
}

export class InteractionEngine {

    sendDirectMessage(fromPlayer: any, targetId: string, text: string) {
        gunController.sendInteraction(targetId, 'CHAT', {
            fromId: fromPlayer.id,
            fromName: fromPlayer.displayName,
            text,
            timestamp: Date.now()
        })
    }

    sendTradeOffer(fromPlayer: any, targetId: string, resourceId: string, quantity: number, price: number) {
        gunController.sendInteraction(targetId, 'TRADE_OFFER', {
            fromId: fromPlayer.id,
            fromName: fromPlayer.displayName,
            resourceId,
            quantity,
            price
        })
    }

    sendRobAttempt(fromPlayer: any, targetId: string) {
        // Rob is more "instant" or "forced" in some games, 
        // but here we can make it a notification to the victim
        // OR a purely chance-based thing recorded in blotter.
        gunController.sendInteraction(targetId, 'ROB_ATTEMPT', {
            fromId: fromPlayer.id,
            fromName: fromPlayer.displayName,
            power: fromPlayer.gameData.drugwars.strength || 10
        })
    }

    sendBustAttempt(fromPlayer: any, targetId: string) {
        gunController.sendInteraction(targetId, 'BUST_ATTEMPT', {
            fromId: fromPlayer.id,
            fromName: fromPlayer.displayName,
            power: fromPlayer.gameData.drugwars.strength || 10
        })
    }

    handleTradeAccept(player: any, interaction: any) {
        const stats = player.gameData.drugwars
        const { resourceId, quantity, price, fromId } = interaction.payload

        if (stats.bank < price && stats.cash < price) {
            return { success: false, message: "Insufficient funds." }
        }

        // Deduct items from SENDER (this is called on the receiver's side, wait...)
        // Actually, the receiver calls this to ACCEPT the trade.
        // The sender already has the items. 
        // We need to notify the sender to deduct them.

        // Let's use the helpers from multiplayerActions
    }

    handleTradeResponse(player: any, response: any) {
        const stats = player.gameData.drugwars
        if (response.type === 'TRADE_ACCEPTED') {
            const { resourceId, quantity, price, toName } = response.payload
            stats.inventory[resourceId] -= quantity
            if (stats.inventory[resourceId] <= 0) delete stats.inventory[resourceId]
            stats.cash += price
            return `Trade with ${toName} completed! Gained $${price}.`
        }
    }

    handleRobResponse(player: any, response: any) {
        const stats = player.gameData.drugwars
        if (response.type === 'ROB_SUCCESS') {
            const { cash, item, fromName } = response.payload
            stats.cash += cash
            if (item) {
                stats.inventory[item.id] = (stats.inventory[item.id] || 0) + item.qty
            }
            return `Successfully robbed ${fromName}! Gained $${cash}${item ? ` and ${item.qty} ${item.id}` : ''}.`
        } else {
            return `Robbery attempt on ${response.payload.fromName} failed.`
        }
    }

    handleBustResponse(player: any, response: any) {
        const stats = player.gameData.drugwars
        if (response.type === 'BUST_SUCCESS') {
            const { confiscatedCount, fromName } = response.payload
            return `Successfully busted ${fromName}! Confiscated ${confiscatedCount} units.`
        } else {
            const { damage, fromName } = response.payload
            stats.health -= damage
            return `${fromName} resisted arrest! You took ${damage} damage.`
        }
    }
}

export const interactionEngine = new InteractionEngine()
