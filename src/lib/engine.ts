import type { Safehouse } from './types'
import { getCity } from './housing/locations'
import { RENT_INTERVAL_MS, EVICTION_GRACE_PERIOD_MS, RENTAL_BAN_PERIOD_MS, GLOBAL_EPOCH, HOTEL_COST, HOTEL_INTERVAL_MS } from './constants'
import { getGameTimeOfDay } from './time'

// Re-exports for backward compatibility
export * from './types'
export * from './constants'
export * from './time'
export * from './cities'
export * from './housing/locations'
export * from './housing/property'
export * from './transit'
export * from './economy'
export * from './player/actions'
export * from './role/police'
export * from './role/nimby'
export * from './role/orchestration'

/**
 * processTimePassage is the core heart-beat for time-based events.
 * It remains in the engine as it orchestrates multiple domains 
 * (Housing, Player Status, Wellness).
 */
export const processTimePassage = (
    player: any,
    isTraveling: boolean = false,
    now: number = Date.now()
) => {
    const result: any = { charged: false, sleepingRough: false }

    // 1. Forced Sleep Check
    const timeSinceSleep = now - (player.lastSleepTime || GLOBAL_EPOCH)
    const threeDaysMs = 72 * 60000

    const isCurrentlySleeping = player.activity?.type === 'SLEEP'

    if (timeSinceSleep > threeDaysMs && !isCurrentlySleeping) {
        result.forceSleep = true
    }

    // 2. Real Estate Logic (Rent Payments & Collections)
    const safehouses = player.safehouses as Safehouse[]
    if (safehouses) {
        safehouses.forEach(sh => {
            if (sh.ownerId !== player.id && sh.rentDueAt) {
                if (now >= sh.rentDueAt) {
                    if (player.bank >= sh.rentAmount) {
                        player.bank -= sh.rentAmount
                        sh.rentDueAt = now + RENT_INTERVAL_MS
                        sh.pastDueAt = undefined
                    } else if (player.cash >= sh.rentAmount) {
                        player.cash -= sh.rentAmount
                        sh.rentDueAt = now + RENT_INTERVAL_MS
                        sh.pastDueAt = undefined
                    } else {
                        if (!sh.pastDueAt) sh.pastDueAt = now
                    }
                }

                if (sh.pastDueAt) {
                    const elapsedGrace = now - sh.pastDueAt
                    if (elapsedGrace > EVICTION_GRACE_PERIOD_MS) {
                        player.safehouses = (player.safehouses || []).filter((s: Safehouse) => s.id !== sh.id)
                        player.evictions = player.evictions || {}
                        player.evictions[sh.location] = now + RENTAL_BAN_PERIOD_MS
                    }
                }
            }

            if (sh.ownerId === player.id && !!sh.renterId && sh.renterId !== player.id) {
                if (now >= (sh.rentDueAt || 0)) {
                    const gross = sh.rentAmount || 0
                    const net = Math.floor(gross * 0.9)
                    player.bank = (player.bank || 0) + net
                    sh.rentDueAt = now + RENT_INTERVAL_MS
                }
            }
        })
    }

    if (player.role === 'Police' || isTraveling) {
        player.sleepingRough = false
        result.charged = false
        result.sleepingRough = false
        return result
    }

    const city = getCity(player.location)
    const { hours: gameHour, minutes: gameMins } = getGameTimeOfDay(now, city?.timezone)

    const currentSafehouse = (safehouses || []).find(sh => sh.location === player.location)
    if (currentSafehouse) {
        player.lastHotelPayment = now
        player.sleepingRough = false
        return { ...result, charged: false, sleepingRough: false }
    }

    // Hoteling logic
    let isNight = gameHour >= 22 || gameHour < 5
    if (player.sunlight) {
        const [riseH, riseM] = player.sunlight.sunrise.split(':').map(Number)
        const [setH, setM] = player.sunlight.sunset.split(':').map(Number)
        const current = gameHour + (gameMins / 60)
        isNight = current >= (setH + setM / 60) || current < (riseH + riseM / 60)
    }

    if (city) {
        // Hoteling logic
        if (isNight) {
            const timeSinceHotel = now - (player.lastHotelPayment || 0)
            if (timeSinceHotel >= HOTEL_INTERVAL_MS) {
                if (player.cash >= HOTEL_COST) {
                    player.cash -= HOTEL_COST
                    player.lastHotelPayment = now
                    result.charged = true
                    player.sleepingRough = false
                } else {
                    player.sleepingRough = true
                    result.sleepingRough = true
                    isSafe = false
                }
            }
        } else {
            player.sleepingRough = false
        }

        // Apply health penalty if sleeping rough
        if (player.sleepingRough && !isCurrentlySleeping) {
            player.health = Math.max(0, (player.health || 100) - 1)
        }
    }

    return result
}
