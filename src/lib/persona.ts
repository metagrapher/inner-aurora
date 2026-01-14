import { createPlayer } from './player'
import { CITIES, calculateMonthlyRent, RENT_INTERVAL_MS } from './engine'
import type { Safehouse } from './engine'
import { getGun } from './gun'

const ARCA_AUTH_URL = "https://arca.de.com/api/auth/session"

export const getArcaSession = async () => {
    try {
        const res = await fetch(ARCA_AUTH_URL)
        if (res.ok) return await res.json()
    } catch (e) {
        console.warn("Arca Auth Bridge: Session check failed", e)
    }
    return null
}


export const createPersona =
    (id: string
        , displayName: string
        , role: "Entrepreneur" | "Police" | "NIMBY" = "Entrepreneur"
        , startingCityId?: string
        , homeBase?: string
    ) => {
        const isInitialized = false
        const player = createPlayer(id, displayName)
        player.role = role
        if (role === "NIMBY") {
            player.hasCar = true
            player.carQuality = 100
            player.carLocation = player.location
            player.lastInsurancePayment = Date.now()
        }

        if (startingCityId) {
            player.cityId = startingCityId
            const city = CITIES.find(c => c.id === startingCityId)
            if (homeBase && city?.districts.includes(homeBase)) {
                // Initialize first safehouse as rented at start
                const rent = calculateMonthlyRent(homeBase)
                const sh: Safehouse = {
                    id: Math.random().toString(36).substring(7)
                    , location: homeBase
                    , ownerId: 'system'
                    , rentAmount: rent
                    , rentDueAt: Date.now() + RENT_INTERVAL_MS
                    , isForRent: false // Not for rent to others yet
                }
                player.safehouses = [sh]
                player.location = homeBase
                player.hasStarted = true // Welcome to the workforce... I mean, life.
            } else if (city) {
                // Default to hub or random if not specified correctly
                player.location = city.hub
            }
        } else if (role === "Entrepreneur") {
            const city = CITIES[Math.floor(Math.random() * CITIES.length)]
            player.cityId = city.id
            player.location = city.hub
        }

        return {
            id
            , displayName
            , role
            , badges: []
            , isInitialized
            , gameData: {
                drugwars: player
            }
        }
    }

export const loadPersona =
    async () => {
        const raw = localStorage.getItem("arca.de.persona")
        let persona = raw ? JSON.parse(raw) : null

        // Attempt Arca.de.com Auth Bridge
        const arcaSession = await getArcaSession()
        if (arcaSession?.user) {
            if (!persona || persona.id !== arcaSession.user.id) {
                console.log("Arca Auth Bridge: Syncing persona for", arcaSession.user.name)
                persona = createPersona(
                    arcaSession.user.id
                    , arcaSession.user.name
                    , persona?.role || "Entrepreneur"
                )
                savePersona(persona)
            }
        }

        return persona
    }

export const savePersona =
    (persona: any
    ) => {
        localStorage.setItem("arca.de.persona", JSON.stringify(persona))
    }
