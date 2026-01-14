export * from './methods'
export * from './intercity'
export * from './intracity'

// Orchestration
import { calculateInterCityTravel } from './intercity'
import { calculateIntraCityTravel } from './intracity'
import { getTravelMethodDetails, getIntraCityMethodDetails } from './methods'
import { TRAVEL_COSTS } from '../constants'
import type { TravelMethod, IntraCityMethod } from '../types'

export const calculateTravelCost =
    (player: any
        , method: TravelMethod | IntraCityMethod
        , options: {
            isIntraCity?: boolean
            , targetCityId?: string
            , targetDistrict?: string
        } = {}
    ) => {
        const { isIntraCity = false, targetCityId, targetDistrict } = options
        if (isIntraCity) {
            return calculateIntraCityTravel(player, method as IntraCityMethod, player.location, targetDistrict)
        } else {
            return calculateInterCityTravel(player.cityId, targetCityId || 'nyc', method as TravelMethod, player)
        }
    }

export const handleTravel =
    (player: any
        , method: TravelMethod | IntraCityMethod
        , options: {
            isIntraCity?: boolean
            , targetCityId?: string
            , targetDistrict?: string
        } = {}
        , now: number = Date.now()
    ) => {
        const costData = calculateTravelCost(player, method, options)
        const stats = player.gameData?.drugwars || player

        if (stats.cash >= costData.financialCost || stats.cheatsEnabled) {
            if (!stats.cheatsEnabled) stats.cash -= costData.financialCost

            const durationRealMs = (costData.gameHours * 60 * 1000) / (TRAVEL_COSTS.intra_city || 1)

            stats.activity =
                ({
                    type: 'TRAVEL'
                    , startTime: now
                    , duration: durationRealMs
                    , rewards:
                    {
                        gameTime: costData.gameHours * 60 * 60 * 1000
                        , risk: costData.risk
                        , targetCityId: options.targetCityId
                        , targetDistrict: options.targetDistrict
                        , isIntraCity: options.isIntraCity
                    }
                }
                )
            stats.activityEnd = now + durationRealMs
            stats.lastActionTime = now
            return { success: true, travelData: { ...costData, durationRealMs, message: `Entering transit loop: ${method}...` } }
        }
        return { success: false, error: "INSUFFICIENT_FUNDS" }
    }

export const completeTravel = (player: any) => {
    const stats = player.gameData?.drugwars || player
    if (!stats.activity || stats.activity.type !== 'TRAVEL') return { message: "No active travel found." }

    const { targetCityId, targetDistrict, isIntraCity } = stats.activity.rewards

    if (isIntraCity) {
        stats.location = targetDistrict
    } else {
        stats.cityId = targetCityId
        // Update location to the Hub or provided district
        stats.location = targetDistrict || `${targetCityId}-hub`
    }

    stats.activity = null
    stats.activityEnd = null

    return { success: true, message: `Arrived at ${stats.location}.` }
}

export const handleBuyCar = (player: any) => {
    const stats = player.gameData?.drugwars || player
    const cost = TRAVEL_COSTS.car_cost
    if (stats.cash >= cost) {
        stats.cash -= cost
        stats.hasCar = true
        stats.carQuality = 50
        stats.carLocation = stats.location
        stats.lastInsurancePayment = Date.now()
        return { success: true }
    }
    return { success: false, error: "INSUFFICIENT_FUNDS" }
}
