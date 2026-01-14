/**
 * Astronomical utilities for calculating sunrise/sunset times based on
 * latitude, longitude, and date.
 */

const D2R = Math.PI / 180
const R2D = 180 / Math.PI

/**
 * Calculates sunrise and sunset for a given coordinate and date.
 * Returns times in UTC format (HH:MM).
 */
export const getSunSchedule =
    (lat: number
        , lon: number
        , date: Date = new Date()
    ) => {
        const d = new Date(date)
        d.setUTCHours(12, 0, 0, 0) // Anchor to noon UTC for JD calculation

        const jd = (d.getTime() / 86400000) + 2440587.5
        const times = calculateSunTimes(jd, lat, lon)

        return (
            {
                sunrise: formatTime(times.sunrise)
                , sunset: formatTime(times.sunset)
                , astronomicalTwilightStart: formatTime(times.astroStart)
                , astronomicalTwilightEnd: formatTime(times.astroEnd)
                , date: d.toISOString().split('T')[0]
            }
        )
    }

const calculateSunTimes =
    (jd: number
        , lat: number
        , lon: number
    ) => {
        // n = days since Jan 1, 2000 12:00 UTC
        const n = jd - 2451545.0 + 0.0008

        // jstar is mean solar noon at the longitude
        const jstar = n - (lon / 360)

        let M = (357.5291 + 0.98560028 * jstar) % 360
        if (M < 0) M += 360

        const C = 1.9148 * Math.sin(M * D2R) + 0.02 * Math.sin(2 * M * D2R) + 0.0003 * Math.sin(3 * M * D2R)
        let lambda = (M + C + 180 + 102.9372) % 360
        if (lambda < 0) lambda += 360

        const Jtransit = 2451545.0 + jstar + 0.0053 * Math.sin(M * D2R) - 0.0069 * Math.sin(2 * lambda * D2R)

        const sinDelta = Math.sin(lambda * D2R) * Math.sin(23.44 * D2R)
        const cosDelta = Math.sqrt(1 - sinDelta * sinDelta)

        const calculateHourAngle = (h0: number) => {
            const cosOmega = (Math.sin(h0 * D2R) - Math.sin(lat * D2R) * sinDelta) /
                (Math.cos(lat * D2R) * cosDelta)

            if (cosOmega > 1) return null
            if (cosOmega < -1) return "all-day"

            return Math.acos(cosOmega) * R2D
        }

        const omegaStandard = calculateHourAngle(-0.833)
        const omegaAstro = calculateHourAngle(-18)

        const getTimes = (omega: number | string | null) => {
            if (typeof omega === 'string' || omega === null) return { rise: null, set: null }
            const diff = omega / 360
            // JD to Unix conversion needs to account for the 0.5 day offset
            return (
                {
                    rise: (Jtransit - diff - 2440587.5) * 86400000
                    , set: (Jtransit + diff - 2440587.5) * 86400000
                }
            )
        }

        const standard = getTimes(omegaStandard)
        const astro = getTimes(omegaAstro)

        return (
            {
                sunrise: standard.rise
                , sunset: standard.set
                , astroStart: astro.rise
                , astroEnd: astro.set
            }
        )
    }

const formatTime = (ms: number | null) => {
    if (ms === null) return "00:00"
    const d = new Date(ms)
    const h = d.getUTCHours().toString().padStart(2, '0')
    const m = d.getUTCMinutes().toString().padStart(2, '0')
    return `${h}:${m}`
}
