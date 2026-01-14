import { TRAVEL_COSTS } from '../constants'
import { CITIES } from '../cities'
import type { IntraCityMethod } from '../types'

export const calculateIntraCityTravel =
    (player: any
        , method: IntraCityMethod
        , originDistrict?: string
        , targetDistrict?: string
    ) => {
        const details = TRAVEL_COSTS.intra_ways[method] || TRAVEL_COSTS.intra_ways.SUBWAY
        const cityObj = CITIES.find(c => c.id === player.cityId)

        // Try to look up specific transit time
        let mins = 15 // default
        if (cityObj && originDistrict && targetDistrict) {
            const timeData = cityObj.transitTimes[originDistrict]?.[targetDistrict] || cityObj.transitTimes[targetDistrict]?.[originDistrict]
            if (timeData) {
                if (method === 'SUBWAY' && timeData.rail) mins = timeData.rail
                else if (method === 'WALK' && timeData.walk) mins = timeData.walk
                // Bus is usually 1.5x rail or fallback
                else if (method === 'BUS') mins = (timeData.rail ? timeData.rail * 1.5 : 30)
            } else if (originDistrict === targetDistrict) {
                mins = 5
            } else {
                // Fallback estimate based on speed
                mins = Math.floor(5 / details.speed * 60)
            }
        }

        let financialCost = details.cost
        if (method === 'BUS' && cityObj) financialCost = cityObj.busFare
        if (method === 'SUBWAY' && cityObj) {
            if (typeof cityObj.railFare === 'number') {
                financialCost = cityObj.railFare
            } else if (cityObj.railFare === 'distance') {
                // Approximate distance-based fare: $2 base + $0.50 per 5 mins of travel
                financialCost = 2.00 + Math.floor(mins / 5) * 0.50
            }
        }

        const gameHours = mins / 60
        let risk = details.risk

        if (method === 'CAR') {
            const quality = player.carQuality || 50
            risk = details.risk * (1.5 - (quality / 100))
        }

        return { financialCost, gameHours, risk }
    }
