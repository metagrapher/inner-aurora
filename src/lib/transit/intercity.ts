import { CITY_DISTANCES, TRAVEL_COSTS, FLIGHT_DATA } from '../constants'
import type { TravelMethod } from '../types'

export const calculateInterCityTravel =
    (originCityId: string
        , targetCityId: string
        , method: TravelMethod
        , player: any
    ) => {
        const stats = player.gameData?.drugwars || player
        const distance = (CITY_DISTANCES[originCityId]?.[targetCityId]) || 1000
        let financialCost = 0
        let gameHours = 0
        let risk = 0

        if (method === 'PLANE') {
            const key = `${originCityId}-${targetCityId}`
            const reverseKey = `${targetCityId}-${originCityId}`
            const flight = FLIGHT_DATA[key] || FLIGHT_DATA[reverseKey]

            if (flight) {
                gameHours = flight.duration
                financialCost = flight.price
            } else {
                gameHours = (distance / 500) + 1.0
                financialCost = Math.floor(distance * 0.25) + 100
            }
            risk = 0.10
        } else {
            const details = TRAVEL_COSTS.ways[method] || TRAVEL_COSTS.ways.BUS
            const speed = (method === 'CAR' && stats.driveSpeed) ? stats.driveSpeed : details.speed
            const effectiveDistance = distance * 1.2
            const stops = Math.floor(distance / 300)
            const stopDelayHours = (stops * 15) / 60

            gameHours = (effectiveDistance / speed) + stopDelayHours
            financialCost = Math.floor(distance * details.costPerMile)
            risk = details.risk

            if (method === 'CAR') {
                const carStops = Math.floor(distance / 400)
                const carStopDelay = (carStops * 10) / 60
                gameHours = (distance * 1.15) / speed + carStopDelay

                // Car Quality Risk Reduction: higher quality = lower risk
                // Base risk is 0.15. Quality is 0-100.
                // Logic: risk = baseRisk * (1.5 - (quality / 100))
                const quality = stats.carQuality || 50
                risk = details.risk * (1.5 - (quality / 100))

                if (stats.driveSpeed && stats.driveSpeed > 65) {
                    risk += (stats.driveSpeed - 65) * 0.02
                }
            }
        }

        if (stats.role === "NIMBY") {
            financialCost += TRAVEL_COSTS.moving_cost
        }

        return { financialCost, gameHours, risk }
    }
