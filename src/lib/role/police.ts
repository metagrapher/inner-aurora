import { RESOURCES } from '../constants'
import { getLocationWealthFactor } from '../housing/locations'

export const handleCopPatrol = (player: any) => {
    const stats = player.gameData?.drugwars || player
    if (stats.role !== "Police") return { error: "NOT_POLICE" }

    const roll = Math.random()
    const wealthFactor = getLocationWealthFactor(stats.location)

    let bustChance = 0.4
    let sweepChance = 0.3

    if (wealthFactor > 1.5) {
        bustChance = 0.2
        sweepChance = 0.6
    } else if (wealthFactor < 1.0) {
        bustChance = 0.6
        sweepChance = 0.1
    }

    if (roll < bustChance) {
        const resource = RESOURCES[Math.floor(Math.random() * RESOURCES.length)]
        return ({
            type: "DRUG_BUST"
            , resource
            , quantity: Math.floor(Math.random() * 20) + 1
            , opponent:
            {
                role: "Entrepreneur"
                , strength: 10 + Math.floor(Math.random() * 10)
                , partners: Math.random() > 0.8 ? Math.floor(Math.random() * 2) : 0
            }
        }
        )
    }
    else if (roll < (bustChance + sweepChance)) {
        return ({
            type: "NIMBY_SWEEP"
            , opponent:
            {
                role: "NIMBY"
                , strength: 15 + Math.floor(Math.random() * 10)
                , partners: Math.floor(Math.random() * 3)
            }
        }
        )
    }
    else {
        return { type: "NOTHING_SIGNIFICANT", message: "The streets are quiet. Maybe too quiet." }
    }
}

export const handleBust =
    (player: any
        , resourceId: string
        , quantity: number = 5
        , partnerCount: number = 0
        , target?: { role: string, nimbyCred?: number }
        , opponent?: { strength: number, bond?: number, partners?: number, role?: string }
    ) => {
        const stats = player.gameData?.drugwars || player
        if (stats.role !== "Police") return { player, error: "NOT_POLICE" }

        if ((stats.stamina || 100) < 25 && !stats.cheatsEnabled) {
            return { player, error: "TOO_TIRED" }
        }

        const resource = RESOURCES.find(r => r.id === resourceId)
        const estimatedValue = (resource?.basePrice || 100) * quantity

        let resistanceChance = 0.10
        resistanceChance += (estimatedValue / 10000)
        if (opponent?.role === "Entrepreneur") resistanceChance += 0.20
        if ((opponent?.partners || 0) > 0) resistanceChance += 0.30

        resistanceChance = Math.min(0.8, resistanceChance)
        const fought = Math.random() < resistanceChance

        if (fought && opponent) {
            const playerPower = (stats.strength || 10) + (partnerCount * 5)
            const opponentPower = (opponent.strength || 10) + ((opponent.partners || 0) * 5)
            const totalPower = playerPower + opponentPower
            const winChance = playerPower / totalPower
            const wonFight = Math.random() < winChance

            if (!wonFight) {
                const damage = 15 + Math.floor(Math.random() * 10)
                stats.health = Math.max(0, (stats.health || 100) - damage)
                stats.stamina = Math.max(0, (stats.stamina || 100) - 10)
                stats.lastActionTime = Date.now()
                return { player, success: false, fought: true, won: false, message: "Suspect fought back and escaped!", damage }
            } else {
                const damage = 5 + Math.floor(Math.random() * 5)
                stats.health = Math.max(0, (stats.health || 100) - damage)
            }
        }

        const effectiveStrength = (stats.strength || 10) + (partnerCount * 5)
        const share = Math.ceil(quantity / (partnerCount + 1))
        stats.inventory[resourceId] = (stats.inventory[resourceId] || 0) + share

        if (!stats.cheatsEnabled) {
            stats.stamina = Math.max(0, (stats.stamina || 100) - 25)
            stats.energy = Math.max(0, (stats.energy || 100) - 10)
        }
        stats.lastActionTime = Date.now()

        const bribeOffer = quantity * 150
        let bribeProbability = 0.5
        if (target?.role === "NIMBY") {
            bribeProbability = Math.min(0.9, 0.5 + ((target.nimbyCred || 0) / 100))
        }

        return { player, bribeOffer, effectiveStrength, bribeProbability, success: true, fought, won: true, damage: fought ? 5 : 0 }
    }

export const handleFence =
    (player: any
        , resourceId: string
        , quantity: number
    ) => {
        const stats = player.gameData?.drugwars || player
        if (stats.role !== "Police") return player
        const pricePerUnit = 200
        if ((stats.inventory[resourceId] || 0) >= quantity) {
            stats.inventory[resourceId] -= quantity
            stats.cash += quantity * pricePerUnit
            stats.corruption = Math.min(100, (stats.corruption || 0) + (quantity * 2))
            stats.energy = Math.max(0, (stats.energy || 100) - 5)
            stats.lastActionTime = Date.now()
        }
        return player
    }

export const handleSolicitBribe =
    (player: any
        , magnitude: number = 1
        , partnerCount: number = 0
        , split: boolean = true
    ) => {
        const stats = player.gameData?.drugwars || player
        if (stats.role !== "Police") return player
        const baseBribe = 500
        let bribeAmount = baseBribe * magnitude

        if (split && partnerCount > 0) {
            bribeAmount = Math.floor(bribeAmount / (partnerCount + 1))
        }

        stats.cash += bribeAmount
        if (!stats.cheatsEnabled) {
            stats.corruption = Math.min(100, (stats.corruption || 0) + 10)
            stats.energy = Math.max(0, (stats.energy || 100) - 5)
        }
        stats.lastActionTime = Date.now()
        return player
    }

export const handleBetrayal =
    (player: any
        , betrayedPartnerId: string
        , bribeAmount: number
    ) => {
        const stats = player.gameData?.drugwars || player
        if (stats.role !== "Police") return player
        stats.cash += bribeAmount
        stats.corruption = Math.min(100, (stats.corruption || 0) + 5)
        stats.blockedPartners = [...(stats.blockedPartners || []), betrayedPartnerId]
        stats.partners = (stats.partners || []).filter((id: string) => id !== betrayedPartnerId)
        stats.lastActionTime = Date.now()
        return player
    }

export const canChangeBeat = (
    player: any,
    targetDistrict: string,
    totalPlayersInDistrict: number,
    totalCopsInDistrict: number
) => {
    const targetCapacity = Math.max(1, Math.ceil(totalPlayersInDistrict / 10))
    if (totalCopsInDistrict >= targetCapacity) {
        return { allowed: false, reason: "Needs of the Force: Target beat is currently fully staffed." }
    }
    return { allowed: true }
}
