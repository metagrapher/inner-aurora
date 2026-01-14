import { describe, it, expect, beforeEach } from 'vitest'
import { calculateTravelCost, handleTravel, completeTravel } from './transit'
import { createPlayer } from './player'
import { CITIES } from './cities'

describe('Travel System Harmonization', () => {
    let player: any

    beforeEach(() => {
        player = createPlayer('p1', 'Test Player')
        player.cash = 10000
        player.cityId = 'nyc'
        player.location = 'Manhattan'
    })

    describe('calculateTravelCost', () => {
        it('should correctly calculate inter-city travel (Plane)', () => {
            const costData = calculateTravelCost(player, 'PLANE', {
                isIntraCity: false,
                targetCityId: 'lax'
            })
            expect(costData.financialCost).toBeGreaterThan(0)
            expect(costData.gameHours).toBeGreaterThan(0)
            expect(costData.risk).toBe(0.10)
        })

        it('should correctly calculate intra-city travel (Subway)', () => {
            const costData = calculateTravelCost(player, 'SUBWAY', {
                isIntraCity: true,
                targetDistrict: 'Brooklyn'
            })
            expect(costData.financialCost).toBeGreaterThan(0)
            expect(costData.gameHours).toBeGreaterThan(0)
        })

        it('should apply NIMBY surcharge for inter-city travel', () => {
            player.role = 'NIMBY'
            const baseCost = calculateTravelCost(player, 'BUS', {
                isIntraCity: false,
                targetCityId: 'lax'
            }).financialCost

            player.role = 'Entrepreneur'
            const entCost = calculateTravelCost(player, 'BUS', {
                isIntraCity: false,
                targetCityId: 'lax'
            }).financialCost

            expect(baseCost).toBeGreaterThan(entCost)
        })
    })

    describe('handleTravel', () => {
        it('should initialize travel activity correctly', () => {
            const now = Date.now()
            const result = handleTravel(player, 'BUS', {
                isIntraCity: false,
                targetCityId: 'chi'
            }, now)

            expect(result.success).toBe(true)
            const stats = player
            expect(stats.activity).toBeDefined()
            expect(stats.activity.type).toBe('TRAVEL')
            expect(stats.activity.rewards.targetCityId).toBe('chi')
            expect(stats.activityEnd).toBeGreaterThan(now)
            expect(result.travelData.durationRealMs).toBeDefined()
        })

        it('should fail if insufficient funds', () => {
            player.cash = 0
            const result = handleTravel(player, 'PLANE', {
                isIntraCity: false,
                targetCityId: 'lax'
            })
            expect(result.success).toBe(false)
            expect(result.error).toBe('INSUFFICIENT_FUNDS')
        })
    })

    describe('completeTravel', () => {
        it('should update location for intra-city travel', () => {
            handleTravel(player, 'SUBWAY', {
                isIntraCity: true,
                targetDistrict: 'Queens'
            })

            const result = completeTravel(player)
            expect(result.success).toBe(true)
            expect(player.location).toBe('Queens')
            expect(player.activity).toBeNull()
        })

        it('should update city and location for inter-city travel', () => {
            handleTravel(player, 'PLANE', {
                isIntraCity: false,
                targetCityId: 'sfo',
                targetDistrict: 'The Mission'
            })

            completeTravel(player)
            expect(player.cityId).toBe('sfo')
            expect(player.location).toBe('The Mission')
        })

        it('should fallback to city-hub if no district provided for inter-city', () => {
            handleTravel(player, 'BUS', {
                isIntraCity: false,
                targetCityId: 'sea'
            })

            completeTravel(player)
            expect(player.cityId).toBe('sea')
            expect(player.location).toBe('sea-hub')
        })
    })
})
