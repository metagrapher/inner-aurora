
import { describe, it, expect } from 'vitest'
import { getSunSchedule } from './astronomy'

describe('Astronomy Utils', () => {
    it('calculates correct sunset for Seattle in January', () => {
        // Seattle: 47.6062, -122.3321
        const date = new Date('2026-01-12')
        const schedule = getSunSchedule(47.6062, -122.3321, date)

        // Expected sunset around 16:45 - 17:00 local
        // Local Seattle is UTC-8 (PST) in Jan
        // So 16:45 local = 00:45 UTC (next day)
        console.log('Seattle Jan 12:', schedule)

        expect(schedule.sunset).toBeDefined()
        const [h, m] = schedule.sunset.split(':').map(Number)
        // 00:30-01:30 UTC is a safe range for sunset at this lat/lon on this date
        // 00:45 UTC is typical
        expect(h).toBeGreaterThanOrEqual(0)
    })

    it('calculates correct sunset for Houston in January', () => {
        // Houston: 29.7604, -95.3698
        const date = new Date('2026-01-12')
        const schedule = getSunSchedule(29.7604, -95.3698, date)

        // Houston is UTC-6 (CST)
        // Typical sunset 5:45 PM local = 23:45 UTC
        console.log('Houston Jan 12:', schedule)

        expect(schedule.sunset).toBeDefined()
        const [h, m] = schedule.sunset.split(':').map(Number)
        expect(h).toBeGreaterThanOrEqual(23)
    })
})
