import { RESOURCES, HOTEL_COST, HOTEL_INTERVAL_MS, TIME_SCALE, TRAVEL_COSTS } from '../constants'
import { getCity, getLocationWealthFactor } from '../housing/locations'

export const handleSleep =
    (player: any
        , typeOrForced: boolean | "FORCED" | "DEFAULT" = false
        , now: number = Date.now()
    ) => {
        const stats = player.gameData?.drugwars || player
        const forced = (typeOrForced === true || typeOrForced === "FORCED")

        const durationMs = forced ? 720000 : 480000

        let energyReward = 100
        let healthReward = 20

        // Sleeping Rough Penalty
        if (stats.sleepingRough && !(stats.safehouses || []).includes(stats.location)) {
            energyReward = 50
            healthReward = 5
        }

        stats.activity =
            ({
                type: 'SLEEP'
                , startTime: now
                , duration: durationMs
                , rewards:
                {
                    energy: energyReward
                    , health: healthReward
                    , gameTime: forced ? 12 * 60 * 60 * 1000 : 8 * 60 * 60 * 1000
                }
            }
            )
        stats.activityEnd = now + durationMs
        stats.lastSleepTime = now

        // If at home, reset hoteling timer
        if ((stats.safehouses || []).includes(stats.location)) {
            stats.lastHotelPayment = Date.now()
        }

        return player
    }

export const handleWellness =
    (player: any
        , type: "GYM" | "FOOD"
        , now: number = Date.now()
    ) => {
        const stats = player.gameData?.drugwars || player
        if (type === "FOOD") {
            const cost = 50
            if (stats.cash >= cost || stats.cheatsEnabled) {
                if (!stats.cheatsEnabled) stats.cash -= cost
                const duration = Math.floor(Math.random() * (55000 - 30000 + 1) + 30000)
                stats.activity =
                    ({
                        type: 'FOOD'
                        , startTime: now
                        , duration
                        , rewards:
                        {
                            health: 10
                            , energy: 15
                            , gameTime: 1800000 // 30m
                        }
                    }
                    )
                stats.activityEnd = now + duration
                stats.lastActionTime = now
            }
        } else if (type === "GYM") {
            if (!stats.gymMembershipActive || now > (stats.nextGymPayment || 0)) {
                stats.gymMembershipActive = false
                return { player, error: "MEMBERSHIP_EXPIRED" }
            }

            if ((stats.energy || 100) >= 30 || stats.cheatsEnabled) {
                if (!stats.cheatsEnabled) stats.energy -= 30
                const duration = 30000
                stats.activity =
                    ({
                        type: 'GYM'
                        , startTime: now
                        , duration
                        , rewards:
                        {
                            strength: 2
                            , health: 5
                            , gameTime: 7200000 // 2h workout
                        }
                    }
                    )
                stats.activityEnd = now + duration
                stats.lastActionTime = now
            } else {
                return { player, error: "TOO_TIRED" }
            }
        }
        return { player }
    }

export const handleGymMembership = (player: any) => {
    const stats = player.gameData?.drugwars || player
    const cost = 200
    if (stats.cash >= cost || stats.cheatsEnabled) {
        if (!stats.cheatsEnabled) stats.cash -= cost
        stats.gymMembershipActive = true
        stats.nextGymPayment = Date.now() + (7 * 24 * 60 * 60 * 1000) // 1 week
        return { success: true, message: "Training membership renewed for 1 week." }
    }
    return { success: false, message: "Insufficient funds for membership." }
}

export const handleUseItem = (player: any, resourceId: string, now: number = Date.now()) => {
    const stats = player.gameData?.drugwars || player
    const stimulants = ['coke', 'meth', 'pills']

    if ((stats.inventory[resourceId] || 0) < 1) {
        return { success: false, message: "You don't have any." }
    }

    stats.inventory[resourceId] -= 1
    if (stats.inventory[resourceId] === 0) delete stats.inventory[resourceId]

    let message = `Used ${resourceId}.`
    let usedStimulant = false

    if (stimulants.includes(resourceId)) {
        stats.lastSleepTime = now
        stats.energy = Math.min(100, (stats.energy || 0) + 20)
        message += " You feel wide awake!"
        usedStimulant = true
    } else if (resourceId === 'alcohol' || resourceId === 'lean') {
        stats.energy = Math.max(0, (stats.energy || 0) - 10)
        stats.health = Math.min(100, (stats.health || 0) + 5)
        message += " You feel a bit woozy."
    }

    return { success: true, message, usedStimulant }
}

export const applyProportionalRewards = (player: any, ratio: number) => {
    const stats = player.gameData?.drugwars || player
    if (!stats.activity) return player
    const { rewards } = stats.activity

    if (rewards.health) stats.health = Math.min(100, (stats.health || 0) + Math.floor(rewards.health * ratio))
    if (rewards.energy) stats.energy = Math.min(100, (stats.energy || 0) + Math.floor(rewards.energy * ratio))
    if (rewards.strength) stats.strength = (stats.strength || 10) + Math.floor(rewards.strength * ratio)

    return player
}

export const processActivityCompletion = (player: any) => {
    const stats = player.gameData?.drugwars || player
    if (!stats.activity) return player
    applyProportionalRewards(player, 1.0)
    stats.activity = null
    stats.activityEnd = null
    return player
}

export const interruptActivity = (player: any) => {
    const stats = player.gameData?.drugwars || player
    if (!stats.activity) return player
    if (stats.activity.type === 'SLEEP') return player

    const elapsed = Date.now() - stats.activity.startTime
    const ratio = Math.min(1.0, elapsed / stats.activity.duration)

    applyProportionalRewards(player, ratio)
    stats.activity = null
    stats.activityEnd = null
    return player
}

export const processInsurance = (player: any) => {
    const stats = player.gameData?.drugwars || player
    if (!stats.hasCar) return { charged: false }

    const now = Date.now()
    const elapsedRealMs = now - (stats.lastInsurancePayment || now)
    const elapsedGameMinutes = Math.floor((elapsedRealMs * TIME_SCALE) / 1000)

    const billingIntervalMinutes = 24 * 60 * 30 // 30 game days

    if (elapsedGameMinutes >= billingIntervalMinutes) {
        const quality = stats.carQuality || 0
        const cost = Math.floor(TRAVEL_COSTS.base_insurance_rate * (quality / 100))

        if (stats.cash >= cost) {
            stats.cash -= cost
            stats.lastInsurancePayment = now
            return { charged: true, cost, message: `AUTOPAY: $${cost} deducted for car insurance (${quality}% quality coverage).` }
        } else {
            stats.cash -= cost
            stats.lastInsurancePayment = now
            return { charged: true, cost, message: `INSURANCE LAPSE: $${cost} deducted. Your account is overdrawn!` }
        }
    }
    return { charged: false }
}
