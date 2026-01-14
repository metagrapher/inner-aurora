import type { Safehouse } from './engine'

export const createPlayer =
    (id: string
        , name: string
    ) =>
    ({
        id
        , name
        , cash: 2000
        , bank: 0
        , debt: 5000
        , health: 100
        , stamina: 100
        , energy: 100
        , strength: 10
        , corruption: 0
        , inventory: {}
        , location: "Brooklyn"
        , primaryBeat: "Brooklyn"
        , cityId: "nyc"
        , createdAt: Date.now()
        , startAgeInDays: 18 * 365 // 6570 days
        , lastActionTime: Date.now()
        , lastSleepTime: Date.now()
        , hasStarted: false // Track if player finished onboarding
        , lastHotelPayment: Date.now()
        , nextGymPayment: Date.now() + (7 * 24 * 60 * 60 * 1000) // 1 week
        , gymMembershipActive: false
        , blockedPartners: []
        , partners: []
        , role: "Entrepreneur"
        , teamId: null
        , nimbyCred: 0
        , nimbyStatus: 0
        , hasCar: false
        , carQuality: 0
        , carLocation: null as string | null
        , lastInsurancePayment: Date.now()
        , safehouses: [] as Safehouse[]
        , evictions: {} as Record<string, number>
        , stash: {} as Record<string, number>
        , cheatsEnabled: false
        , activeReports: [] as { location: string, occupantHome: boolean, monitored: boolean }[]
        , activity: null as {
            type: 'SLEEP' | 'GYM' | 'FOOD'
            startTime: number
            duration: number
            rewards: {
                health?: number
                energy?: number
                strength?: number
                gameTime?: number
            }
        } | null
    }
    )

export type Player = ReturnType<typeof createPlayer>
