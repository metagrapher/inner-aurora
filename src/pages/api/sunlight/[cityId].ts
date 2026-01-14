
import type { APIRoute } from 'astro';
import { CITIES } from '../../../lib/cities';
import { getSunSchedule } from '../../../lib/time/astronomy';

export const GET: APIRoute = async ({ params, locals }) => {
    const cityId = params.cityId;
    const city = CITIES.find(city => city.id === cityId);
    
    if (!city) {
        return new Response(JSON.stringify({ error: 'City not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // Check Cache (using locals.runtime.env if available in Cloudflare)
    const today = new Date().toISOString().split('T')[0];
    const cacheKey = `sunlight:${cityId}:${today}`;
    const env = (locals as any).runtime?.env;

    if (env?.ADDRESS_CACHE) {
        try {
            const cached = await env.ADDRESS_CACHE.get(cacheKey);
            if (cached) {
                return new Response(cached, {
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        } catch (e) {
            console.error('[Sunlight API] Cache read failed', e);
        }
    }

    const schedule = getSunSchedule(city.coords.lat, city.coords.lon);

    const localize = (timeStr: string) => {
        const [h, m] = timeStr.split(':').map(Number);
        let localH = (h + city.timezone) % 24;
        if (localH < 0) localH += 24;
        return `${localH.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    };

    const localized = {
        sunrise: localize(schedule.sunrise),
        sunset: localize(schedule.sunset),
        astronomicalTwilightStart: localize(schedule.astronomicalTwilightStart),
        astronomicalTwilightEnd: localize(schedule.astronomicalTwilightEnd),
        date: schedule.date
    };

    const json = JSON.stringify(localized);

    if (env?.ADDRESS_CACHE) {
        try {
            await env.ADDRESS_CACHE.put(cacheKey, json, { expirationTtl: 86400 });
        } catch (e) {
            console.error('[Sunlight API] Cache write failed', e);
        }
    }

    return new Response(json, {
        headers: { 'Content-Type': 'application/json' }
    });
};
