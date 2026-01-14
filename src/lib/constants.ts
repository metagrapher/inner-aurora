import type { Resource, TravelMethod, IntraCityMethod, NewsEvent } from './types'

// --- Game World Constants ---
// 1 second real = 1 minute game (60s real = 1h game)
export const TIME_SCALE = 1
export const POCKET_LIMIT = 20
export const ENCAMPMENT_SETUP_COST = 5000

/**
 * ARCHITECTURE: Absolute Time (Global Epoch)
 * To prevent clock stalling and synchronization conflicts:
 * 1. All game-time calculations derive from GLOBAL_EPOCH.
 * 2. NO 'startTime' parameters should be passed into core timing functions.
 * 3. All real-millisecond intervals use the _MS suffix (e.g., RENT_INTERVAL_MS).
 */
export const GLOBAL_EPOCH = 1768168800000 // Jan 11, 2026, 22:00 UTC
export const HOTEL_COST = 150
export const HOTEL_INTERVAL_MS = 60000 // 1 hour game time = 1 minute real
export const RENT_INTERVAL_MS = 30 * 24 * 60 * 1000 // 30 game days
export const EVICTION_GRACE_PERIOD_MS = 14 * 24 * 60 * 1000 // 14 game days
export const RENTAL_BAN_PERIOD_MS = 90 * 24 * 60 * 1000 // 90 game days
export const REAL_MS_PER_GAME_DAY = 24 * 60 * 1000 // 1 real second = 1 game minute => 1440s real = 1 game day

export const RESOURCES: Resource[] =
    [{ id: "weed", name: "Weed", basePrice: 60, volatility: 0.5 }
        , { id: "acid", name: "Acid", basePrice: 500, volatility: 0.4 }
        , { id: "coke", name: "Coke", basePrice: 1500, volatility: 0.6 }
        , { id: "meth", name: "Meth", basePrice: 800, volatility: 0.5 }
        , { id: "fent", name: "Fentanyl", basePrice: 2000, volatility: 0.7 }
        , { id: "heroin", name: "Heroin", basePrice: 1200, volatility: 0.5 }
        , { id: "lean", name: "Lean (Codeine)", basePrice: 600, volatility: 0.3 }
        , { id: "alcohol", name: "Alcohol", basePrice: 50, volatility: 0.1 }
        , { id: "pills", name: "Prescription Pills", basePrice: 300, volatility: 0.3 }
        , { id: "pcp", name: "PCP", basePrice: 700, volatility: 0.6 }
        , { id: "k2", name: "K2 (Synthetic)", basePrice: 200, volatility: 0.4 }
    ]

export const CITY_DISTANCES: Record<string, Record<string, number>> =
{
    nyc: { chi: 790, lax: 2790, hou: 1630, msy: 1300, atl: 860, sfo: 2900, dfw: 1550, dc: 225, sea: 2850 }
    , chi: { nyc: 790, lax: 2015, hou: 1080, msy: 925, atl: 715, sfo: 2130, dfw: 925, dc: 700, sea: 2060 }
    , lax: { nyc: 2790, chi: 2015, hou: 1550, msy: 1900, atl: 2175, sfo: 380, dfw: 1435, dc: 2660, sea: 1135 }
    , hou: { nyc: 1630, chi: 1080, lax: 1550, msy: 350, atl: 800, sfo: 1930, dfw: 240, dc: 1400, sea: 2300 }
    , msy: { nyc: 1300, chi: 925, lax: 1900, hou: 350, atl: 470, sfo: 2260, dfw: 500, dc: 1080, sea: 2580 }
    , atl: { nyc: 860, chi: 715, lax: 2175, hou: 800, msy: 470, sfo: 2470, dfw: 780, dc: 640, sea: 2620 }
    , sfo: { nyc: 2900, chi: 2130, lax: 380, hou: 1930, msy: 2260, atl: 2470, dfw: 1750, dc: 2800, sea: 808 }
    , dfw: { nyc: 1550, chi: 925, lax: 1435, hou: 240, msy: 500, atl: 780, sfo: 1750, dc: 1320, sea: 2070 }
    , dc: { nyc: 225, chi: 700, lax: 2660, hou: 1400, msy: 1080, atl: 640, sfo: 2800, dfw: 1320, sea: 2750 }
    , sea: { nyc: 2850, chi: 2060, lax: 1135, hou: 2300, msy: 2580, atl: 2620, sfo: 808, dfw: 2070, dc: 2750 }
}

export const TRAVEL_COSTS =
    ({
        intra_city: 1 // default game hours if not specified
        , transit_fare: 25
        , moving_cost: 5000
        , car_cost: 15000
        , base_insurance_rate: 500
        , ways:
            {
                PLANE: { speed: 500, costPerMile: 0.30, risk: 0.40, name: "Plane" }
                , TRAIN: { speed: 70, costPerMile: 0.15, risk: 0.10, name: "Train" }
                , BUS: { speed: 50, costPerMile: 0.10, risk: 0.25, name: "Bus" }
                , CAR: { speed: 65, costPerMile: 0.20, risk: 0.15, name: "Car" }
            } as Record<TravelMethod, { speed: number, costPerMile: number, risk: number, name: string }>
        , intra_ways:
            {
                SUBWAY: { speed: 30, cost: 25, risk: 0.05, name: "Subway", energy: 5 }
                , TAXI: { speed: 45, cost: 150, risk: 0.02, name: "Taxi", energy: 2 }
                , BUS: { speed: 15, cost: 10, risk: 0.08, name: "Bus", energy: 5 }
                , WALK: { speed: 3, cost: 0, risk: 0.20, name: "Walk", energy: 25 }
                , CAR: { speed: 65, cost: 0, risk: 0.10, name: "Private Car", energy: 5 }
            } as Record<IntraCityMethod, { speed: number, cost: number, risk: number, name: string, energy: number }>
    }
    )

export const PROPERTY_TAX: Record<string, number> =
    ({
        nyc: 300
        , lax: 200
        , chi: 150
    }
    )

export const DISTRICT_BASE_RENTS: Record<string, number> =
{ // NYC
    "Manhattan": 4500, "Brooklyn": 3500, "Queens": 2800, "Bronx": 2400, "Staten Island": 2200
    , // Houston
    "River Oaks": 2800, "Third Ward": 1100, "Fifth Ward": 1200, "Montrose": 1900, "The Heights": 1800, "Memorial": 2200
    , // Chicago
    "The Loop": 2400, "South Side": 1000, "Wicker Park": 2200, "Logan Square": 1900, "Lincoln Park": 2000
    , // LA
    "Hollywood": 2600, "Venice Beach": 3400, "South Central": 1500, "Silver Lake": 2100, "Compton": 1800
    , // Atlanta
    "Buckhead": 1900, "Midtown": 2100, "Little Five Points": 2200, "Old Fourth Ward": 2000, "Bankhead": 900
    , // New Orleans
    "French Quarter": 2400, "Garden District": 2200, "Tremé": 1200, "Marigny": 1500, "Uptown": 1800
    , // Seattle
    "Capitol Hill": 1800, "Ballard": 2200, "Belltown": 2400, "Pioneer Square": 2600, "Fremont": 2100
    , // SF / Oakland
    "The Mission": 3800, "Haight-Ashbury": 3600, "Tenderloin": 1700, "West Oakland": 2400, "Fruitvale": 1600
    , // Dallas
    "Deep Ellum": 2000, "Bishop Arts": 1600, "Stockyards": 1500, "Arlington": 1300
    , // DC
    "Georgetown": 2600, "Adams Morgan": 2100, "Anacostia": 1600, "Dupont Circle": 2400
}

export const FLIGHT_DATA: Record<string, { duration: number, price: number }> =
{
    "nyc-chi": { duration: 2.5, price: 180 }
    , "nyc-lax": { duration: 6.0, price: 450 }
    , "nyc-hou": { duration: 4.0, price: 320 }
    , "nyc-msy": { duration: 3.5, price: 280 }
    , "nyc-atl": { duration: 2.5, price: 210 }
    , "nyc-sfo": { duration: 6.5, price: 480 }
    , "nyc-dfw": { duration: 4.0, price: 300 }
    , "nyc-dc": { duration: 1.2, price: 120 }
    , "nyc-sea": { duration: 6.0, price: 440 }
    , "hou-msy": { duration: 1.2, price: 150 }
    , "hou-nyc": { duration: 3.8, price: 320 }
    , "hou-lax": { duration: 3.5, price: 280 }
    , "hou-chi": { duration: 2.5, price: 240 }
    , "hou-atl": { duration: 2.0, price: 190 }
    , "hou-dfw": { duration: 1.0, price: 120 }
    , "hou-sfo": { duration: 4.2, price: 360 }
    , "hou-sea": { duration: 4.8, price: 380 }
    , "hou-dc": { duration: 3.0, price: 260 }
}

export const NEWS_EVENTS: NewsEvent[] =
    [{ id: 'dea_crackdown', title: 'DEA Operations Ramp Up', description: 'Federal agents are swarming the streets. Risk is high, supply is low.', intensity: 0.8, type: 'CRACKDOWN' }
        , { id: 'music_fest', title: 'Lollapalooza Weekend', description: 'Massive influx of tourists. Everything is in high demand.', intensity: 0.6, type: 'BOOM', resourceId: 'weed' }
        , { id: 'bad_batch', title: 'Bad Batch Warning', description: 'Local supply tainted. Prices plummeting as users shy away.', intensity: 0.7, type: 'BUST', resourceId: 'meth' }
        , { id: 'border_closure', title: 'Strict Border Controls', description: 'Supply chain disrupted. Major shortages reported.', intensity: 0.9, type: 'SHORTAGE' }
    ]

export type Encampment =
    ({
        id: string
        , ownerId: string
        , location: string
        , stash: Record<string, number>
        , lastSwept: number
        , isHidden: boolean
    })

export type SweepResult =
    ({
        success: boolean
        , loot: Record<string, number>
        , encounter: boolean
        , message: string
    })
