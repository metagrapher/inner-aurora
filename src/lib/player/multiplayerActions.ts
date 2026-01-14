
import { gunController } from '../GunController'
import { RESOURCES } from '../constants'

export type InteractionResult = {
    success: boolean
    message: string
    payload?: any
}

export const handleIncomingTrade = (player: any, interaction: any): InteractionResult => {
    const stats = player.gameData.drugwars
    const { resourceId, quantity, price, fromId } = interaction.payload

    if (stats.bank < price && stats.cash < price) {
        return { success: false, message: "Insufficient funds to accept trade." }
    }

    // Deduct price
    if (stats.bank >= price) {
        stats.bank -= price
    } else {
        stats.cash -= price
    }

    // Add items
    stats.inventory[resourceId] = (stats.inventory[resourceId] || 0) + quantity

    // Notify sender that it was accepted so they can deduct their items
    gunController.sendInteraction(fromId, 'TRADE_ACCEPTED', {
        originalInteractionId: interaction.id,
        resourceId,
        quantity,
        price,
        toName: player.displayName
    })

    return { success: true, message: `Trade accepted. Paid $${price} for ${quantity} ${resourceId}.` }
}

export const handleIncomingRob = (player: any, interaction: any): InteractionResult => {
    const stats = player.gameData.drugwars
    const { fromId, fromName, power } = interaction.payload

    const myPower = stats.strength || 10
    const chance = Math.min(0.8, (power / (power + myPower)))

    if (Math.random() < chance) {
        // Robbery successful
        const cashStolen = Math.floor(stats.cash * 0.2) // Steal 20% of on-hand cash
        stats.cash -= cashStolen

        const resId = Object.keys(stats.inventory)[0]
        let itemStolen = null
        if (resId) {
            itemStolen = { id: resId, qty: Math.min(stats.inventory[resId], 2) }
            stats.inventory[resId] -= itemStolen.qty
            if (stats.inventory[resId] <= 0) delete stats.inventory[resId]
        }

        gunController.sendInteraction(fromId, 'ROB_SUCCESS', {
            cash: cashStolen,
            item: itemStolen,
            fromName: player.displayName
        })

        return {
            success: true,
            message: `YOU WERE ROBBED by ${fromName}! Lost $${cashStolen}${itemStolen ? ` and ${itemStolen.qty} ${itemStolen.id}` : ''}.`
        }
    } else {
        // Robbery failed
        gunController.sendInteraction(fromId, 'ROB_FAILED', {
            fromName: player.displayName
        })
        return { success: false, message: `${fromName} tried to rob you but failed!` }
    }
}

export const handleIncomingBust = (player: any, interaction: any): InteractionResult => {
    const stats = player.gameData.drugwars
    const { fromId, fromName, power } = interaction.payload

    // Bust is similar to Rob but for Police
    const myPower = stats.strength || 10
    const chance = Math.min(0.9, (power / (power + myPower)) + 0.2) // Police have a bonus

    if (Math.random() < chance) {
        // Bust successful
        let confiscatedCount = 0
        Object.keys(stats.inventory).forEach(resId => {
            confiscatedCount += stats.inventory[resId]
            delete stats.inventory[resId]
        })

        gunController.sendInteraction(fromId, 'BUST_SUCCESS', {
            confiscatedCount,
            fromName: player.displayName
        })

        return {
            success: true,
            message: `YOU WERE BUSTED by Officer ${fromName}! All inventory confiscated.`
        }
    } else {
        // Resistance!
        const damage = Math.floor(Math.random() * 20)
        stats.health -= damage

        gunController.sendInteraction(fromId, 'BUST_FAILED', {
            damage,
            fromName: player.displayName
        })

        return { success: false, message: `You resisted Officer ${fromName}'s bust attempt but took ${damage} damage!` }
    }
}
