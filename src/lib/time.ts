import { GLOBAL_EPOCH, REAL_MS_PER_GAME_DAY } from './constants'

export const getGameTimeOfDay =
    (now: number = Date.now()
        , cityTimezone: number = -5 // Default to East Coast
    ) => {
        // 1 real second = 1 game minute.
        // Derived from the absolute Global Epoch.
        const elapsedSeconds = Math.floor((now - GLOBAL_EPOCH) / 1000)

        // Game starts at DAY 1, 1:00 AM local time by default
        const startHour = 1

        // We include the timezone offset (relative to NYC -5) 
        // to make the clock jump when traveling
        const tzDiff = (cityTimezone - (-5)) * 60 // difference in minutes

        const totalMinutes = (startHour * 60) + elapsedSeconds + tzDiff
        const dailyMinutes = 1440

        // Handle negative minutes for wrap-around
        const wrappedMins = ((totalMinutes % dailyMinutes) + dailyMinutes) % dailyMinutes

        const days = Math.floor(totalMinutes / dailyMinutes)
        const hours = Math.floor(wrappedMins / 60)
        const minutes = wrappedMins % 60

        return { days, hours, minutes }
    }

export const getGameTime =
    (now: number = Date.now()
    ) => {
        const { days, hours, minutes } = getGameTimeOfDay(now)
        return {
            minutes: (days * 24 * 60) + (hours * 60) + minutes
            , hours
            , days
        }
    }

/**
 * Calculates the "Life Day" count since the player's 18th birthday/creation.
 * This is aligned with the world clock's midnight rollover.
 * Day 1 is the day of creation.
 */
export const getPlayerAgeInDays =
    (player: any
        , now: number = Date.now()
    ) => {
        const { days: currentWorldDay } = getGameTimeOfDay(now)
        const { days: startWorldDay } = getGameTimeOfDay(player.createdAt || GLOBAL_EPOCH)

        // Days since 18th birthday (Day 1, Day 2, ...)
        return currentWorldDay - startWorldDay + 1
    }
