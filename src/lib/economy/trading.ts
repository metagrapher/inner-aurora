import { POCKET_LIMIT, ENCAMPMENT_SETUP_COST } from '../constants'

export const getInventorySize =
    (inventory: Record<string, number>
    ) => Object.values(inventory).reduce((acc, count) => acc + count, 0)

export const handleBuy =
    (player: any
        , resourceId: string
        , quantity: number
        , totalCost: number
    ) => {
        const stats = player.gameData?.drugwars || player
        if (stats.cash >= totalCost || stats.cheatsEnabled) {
            const currentSize = getInventorySize(stats.inventory)
            if (currentSize + quantity > POCKET_LIMIT) {
                return { success: false, error: `Pocket limit reached! (${currentSize}/${POCKET_LIMIT})` }
            }
            if (!stats.cheatsEnabled) stats.cash -= totalCost
            stats.inventory[resourceId] = (stats.inventory[resourceId] || 0) + quantity
            return { success: true, player }
        }
        return { success: false, error: "Insufficient liquidity!" }
    }

export const handleSell =
    (player: any
        , resourceId: string
        , quantity: number
        , totalValue: number
    ) => {
        const stats = player.gameData?.drugwars || player
        if ((stats.inventory[resourceId] || 0) >= quantity) {
            stats.cash += totalValue
            stats.inventory[resourceId] -= quantity
            return { success: true, player }
        }
        return { success: false, error: "Insufficient inventory!" }
    }

export const handleStashTransition =
    (player: any
        , resourceId: string
        , quantity: number
        , toStash: boolean
    ) => {
        const stats = player.gameData?.drugwars || player
        if (toStash) {
            if ((stats.inventory[resourceId] || 0) >= quantity) {
                stats.inventory[resourceId] -= quantity
                if (stats.inventory[resourceId] === 0) delete stats.inventory[resourceId]
                stats.stash[resourceId] = (stats.stash[resourceId] || 0) + quantity
                return { success: true }
            }
        } else {
            if ((stats.stash[resourceId] || 0) >= quantity) {
                stats.stash[resourceId] -= quantity
                if (stats.stash[resourceId] === 0) delete stats.stash[resourceId]
                stats.inventory[resourceId] = (stats.inventory[resourceId] || 0) + quantity
                return { success: true }
            }
        }
        return { success: false, error: "INSUFFICIENT_QUANTITY" }
    }

export const handleEstablishEncampment = (player: any) => {
    const stats = player.gameData?.drugwars || player
    if (stats.cash < ENCAMPMENT_SETUP_COST) {
        return { success: false, error: "INSUFFICIENT_FUNDS", message: `Need $${ENCAMPMENT_SETUP_COST} to establish an encampment.` }
    }

    stats.cash -= ENCAMPMENT_SETUP_COST
    const encampment = {
        id: "enc_" + Math.random().toString(36).slice(2, 7)
        , location: stats.location
        , ownerId: player.id
        , rentAmount: 0 // No rent for encampments
        , isForRent: false
        , type: 'ENCAMPMENT'
    }

    stats.safehouses = stats.safehouses || []
    stats.safehouses.push(encampment)

    return { success: true, message: "Encampment established! You now have a local stash.", encampment }
}
