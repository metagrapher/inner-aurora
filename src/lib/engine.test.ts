import { describe, it, expect, beforeEach } from 'vitest'
import {
    processTimePassage,
    getGameTimeOfDay,
    getPlayerAgeInDays,
    handleUseItem,
    handleSleep,
    HOTEL_INTERVAL_MS,
    RENT_INTERVAL_MS,
    EVICTION_GRACE_PERIOD_MS,
    RENTAL_BAN_PERIOD_MS,
    GLOBAL_EPOCH,
    Safehouse
} from './engine'
import { createPlayer } from './player'

describe('Game Engine Mechanics', () => {
    let player: any

    beforeEach(() => {
        player = createPlayer('p1', 'Test Player')
        player.cash = 1000
        player.bank = 5000
        player.health = 50
        player.energy = 50
        // Anchor player to Epoch
        player.lastSleepTime = GLOBAL_EPOCH
        player.lastHotelPayment = GLOBAL_EPOCH - (HOTEL_INTERVAL_MS + 1000)
        player.createdAt = GLOBAL_EPOCH
        player.startAgeInDays = 6570 // 18 years
    })

    describe('getGameTimeOfDay', () => {
        it('returns 1:00 AM at exact epoch', () => {
            const { hours, minutes } = getGameTimeOfDay(GLOBAL_EPOCH)
            expect(hours).toBe(1)
            expect(minutes).toBe(0)
        })

        it('returns 1:01 AM after 1 real second', () => {
            const { hours, minutes } = getGameTimeOfDay(GLOBAL_EPOCH + 1000)
            expect(hours).toBe(1)
            expect(minutes).toBe(1)
        })

        it('returns 2:00 AM after 60 real seconds', () => {
            const { hours, minutes } = getGameTimeOfDay(GLOBAL_EPOCH + 60000)
            expect(hours).toBe(2)
            expect(minutes).toBe(0)
        })

        it('returns 12:00 PM after 11 real minutes', () => {
            const { hours, minutes } = getGameTimeOfDay(GLOBAL_EPOCH + (11 * 60 * 1000))
            expect(hours).toBe(12)
            expect(minutes).toBe(0)
        })

        it('ticks minutes precisely with seconds', () => {
            for (let i = 0; i < 60; i++) {
                const { minutes } = getGameTimeOfDay(GLOBAL_EPOCH + (i * 1000))
                expect(minutes).toBe(i)
            }
        })
    })

    describe('getPlayerAgeInDays', () => {
        it('starts at DAY 1 at epoch', () => {
            const age = getPlayerAgeInDays(player, GLOBAL_EPOCH)
            expect(age).toBe(1)
        })

        it('increments after world midnight', () => {
            // Epoch is 1:00 AM. 
            // 23 game hours later is midnight (23 real minutes).
            const twentyThreeHoursLater = GLOBAL_EPOCH + (23 * 60 * 1000)
            const ageBefore = getPlayerAgeInDays(player, twentyThreeHoursLater - 1000)
            const ageAfter = getPlayerAgeInDays(player, twentyThreeHoursLater)

            expect(ageBefore).toBe(1)
            expect(ageAfter).toBe(2)
        })

        it('stays at DAY 1 if created after epoch but before next midnight', () => {
            player.createdAt = GLOBAL_EPOCH + (5 * 60 * 1000) // created at 6:00 AM
            const now = GLOBAL_EPOCH + (10 * 60 * 1000) // 11:00 AM
            const age = getPlayerAgeInDays(player, now)
            expect(age).toBe(1)
        })
    })

    describe('processTimePassage', () => {
        it('should NOT charge hotel if player is traveling', () => {
            const now = GLOBAL_EPOCH
            const result = processTimePassage(player, true, now)
            expect(result.charged).toBe(false)
        })

        it('should NOT force sleep if awake < 72 hours', () => {
            const now = GLOBAL_EPOCH + 1000
            player.lastSleepTime = now - 1000
            const result = processTimePassage(player, false, now)
            expect(result.forceSleep).toBeFalsy()
        })

        it('should force sleep if awake > 72 hours (72 mins real time)', () => {
            const now = GLOBAL_EPOCH + (72 * 60 * 1000 + 5000)
            player.lastSleepTime = GLOBAL_EPOCH
            const result = processTimePassage(player, false, now)
            expect(result.forceSleep).toBe(true)
        })

        it('should apply sleeping rough penalties during curfew if no safehouse', () => {
            // GLOBAL_EPOCH(22:00) + 3 mins = 01:00 AM.
            // +1 real minute = +1 hour game time = 23:00.
            // +2 real minutes = 00:00.
            // +3 real minutes = 01:00 AM. (Curfew starts at 01:00 AM for away)
            const now = GLOBAL_EPOCH + (3 * 60 * 1000)
            player.cash = 10
            player.location = 'Manhattan'
            player.safehouses = []
            player.lastHotelPayment = now - (HOTEL_INTERVAL_MS + 1000)

            const result = processTimePassage(player, false, now)
            expect(result.sleepingRough).toBe(true)
            expect(player.sleepingRough).toBe(true)
        })

        it('should NOT apply sleeping rough if in time but has safehouse in city', () => {
            const now = GLOBAL_EPOCH + (60 * 1000) // 23:00
            player.safehouses = [{ id: 'sh1', location: 'Brooklyn', ownerId: 'player1', rentAmount: 1000, isForRent: false }]
            player.location = 'Brooklyn'
            player.lastHotelPayment = now - 1000

            const result = processTimePassage(player, false, now)
            expect(result.sleepingRough).toBeFalsy()
            expect(player.sleepingRough).toBeFalsy()
        })
    })

    describe('handleUseItem', () => {
        it('should reset sleep timer when using stimulant (coke)', () => {
            player.inventory['coke'] = 1
            const result = handleUseItem(player, 'coke')
            expect(result.success).toBe(true)
            expect(result.usedStimulant).toBe(true)
            expect(player.lastSleepTime).toBeGreaterThan(GLOBAL_EPOCH - 1000)
        })

        it('should fail if item not owned', () => {
            player.inventory = {}
            const result = handleUseItem(player, 'coke')
            expect(result.success).toBe(false)
        })
    })

    describe('handleSleep', () => {
        it('should support forced sleep', () => {
            const result = handleSleep(player, true)
            expect(result.activity.type).toBe('SLEEP')
            // Forced sleep is 12 hours game time = 12 minutes real = 720 real seconds
            expect(result.activity.duration).toBe(12 * 60000)
        })

        it('should default to normal sleep', () => {
            const result = handleSleep(player, false)
            expect(result.activity.type).toBe('SLEEP')
            // Normal sleep is 8 hours game time = 8 minutes real = 480 real seconds
            expect(result.activity.duration).toBe(8 * 60000)
        })
    })

    describe('Real Estate Mechanics', () => {
        it('should handle rent payment and eviction logic', () => {
            const now = GLOBAL_EPOCH
            player.id = 'p1'
            player.bank = 5000
            player.cash = 10

            const sh: Safehouse = {
                id: 'sh1',
                location: 'Manhattan',
                ownerId: 'system',
                renterId: 'p1',
                rentAmount: 3500,
                rentDueAt: now - 1000,
                isForRent: false
            }
            player.safehouses = [sh]

            // 1. Auto-pay from bank
            processTimePassage(player, false, now)
            expect(player.bank).toBe(1500)

            // 2. Fail to pay (low funds)
            sh.rentDueAt = now - 1000
            player.bank = 0
            processTimePassage(player, false, now)
            expect(sh.pastDueAt).toBe(now)

            // 3. Eviction after grace period
            processTimePassage(player, false, now + EVICTION_GRACE_PERIOD_MS + 1000)
            expect(player.safehouses).toHaveLength(0)
        })

        it('should handle landlord collections', () => {
            const now = GLOBAL_EPOCH
            player.id = 'p1'
            player.bank = 0

            const sh: Safehouse = {
                id: 'sh2',
                location: 'Brooklyn',
                ownerId: 'p1', // Player owns it
                renterId: 'system', // Rented to system/target
                rentAmount: 2000,
                rentDueAt: now - 1000,
                isForRent: false
            }
            player.safehouses = [sh]

            processTimePassage(player, false, now)
            // 2000 * 0.9 = 1800
            expect(player.bank).toBe(1800)
            expect(sh.rentDueAt).toBeGreaterThan(now)
        })
    })
})
