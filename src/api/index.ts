import { CITIES } from '../lib/cities'
import { getSunSchedule } from '../lib/time/astronomy'

type Bindings = {
    GUN_RELAY: DurableObjectNamespace
    ADDRESS_CACHE: KVNamespace
}

const app = new Hono<{ Bindings: Bindings }>()

// Route Gun.js requests to the Durable Object
app.all('/gun', async (c) => {
    // Use a single "global" instance for the relay for now to maximize peering
    const id = c.env.GUN_RELAY.idFromName('global')
    const obj = c.env.GUN_RELAY.get(id)
    return obj.fetch(c.req.raw)
})

/**
 * Astronomical Sunrise/Sunset API
 * Returns the localized sun schedule for a city.
 */
app.get('/api/sunlight/:cityId', async (c) => {
    const cityId = c.req.param('cityId')
    const city = CITIES.find(city => city.id === cityId)
    if (!city) return c.json({ error: 'City not found' }, 404)

    // Check Cache
    const today = new Date().toISOString().split('T')[0]
    const cacheKey = `sunlight:${cityId}:${today}`

    // We try to use the KV cache if available
    try {
        const cached = await c.env.ADDRESS_CACHE.get(cacheKey)
        if (cached) return c.json(JSON.parse(cached))
    } catch (e) {
        // Fallback to calculation if KV fails
    }

    const schedule = getSunSchedule(city.coords.lat, city.coords.lon)

    // Convert to localized hours for the game clock
    // Game clock is UTC-based but we want to display sunrise/sunset 
    // relative to the "Normal" hours in that city.
    // However, since we defined the Game Clock as shared, 
    // we'll just return the UTC times and let the frontend handle the display.

    // Actually, to make it exactly as requested:
    // "sets sometime around 6pm in Houston"
    // Since Houston is UTC-6, 18:00 Local is 00:00 UTC.
    // So we should return the "Wall Clock" time.

    const localize = (timeStr: string) => {
        const [h, m] = timeStr.split(':').map(Number)
        let localH = (h + city.timezone) % 24
        if (localH < 0) localH += 24
        return `${localH.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
    }

    const localized = (
        {
            sunrise: localize(schedule.sunrise)
            , sunset: localize(schedule.sunset)
            , astronomicalTwilightStart: localize(schedule.astronomicalTwilightStart)
            , astronomicalTwilightEnd: localize(schedule.astronomicalTwilightEnd)
            , date: schedule.date
        }
    )

    try {
        await c.env.ADDRESS_CACHE.put(cacheKey, JSON.stringify(localized), { expirationTtl: 86400 })
    } catch (e) { }

    return c.json(localized)
})

export default app
