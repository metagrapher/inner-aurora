export type Safehouse = {
    id: string
    location: string
    ownerId: string         // "system" or player.id
    renterId?: string       // if rented out
    rentAmount: number
    rentDueAt?: number      // Real MS timestamp (for renter)
    pastDueAt?: number     // Real MS timestamp (for renter)
    isForRent: boolean      // Landlord flag
    type?: 'SAFEHOUSE' | 'ENCAMPMENT'
}

export type Resource = {
    id: string
    name: string
    basePrice: number
    volatility: number
}

export type Coords =
    {
        lat: number
        , lon: number
    }

export type City<D extends string = string> = {
    id: string
    name: string
    districts: D[]
    areaTerm: string
    hub: D
    coords: Coords
    timezone: number
    wealthFactor?: number
    availableResources?: string[]
    districtData?: Partial<Record<D, { wealthFactor?: number, availableResources?: string[], coords?: Coords }>>
    areaTermMap?: Record<string, string>
    railFare?: number | 'distance'
    busFare?: number
    railConnectivity?: Partial<Record<D, boolean>>
    transitTimes?: Partial<Record<D, Partial<Record<D, { rail?: number, walk?: number }>>>>
}

export type TravelMethod = 'PLANE' | 'TRAIN' | 'BUS' | 'CAR'
export type IntraCityMethod = 'SUBWAY' | 'TAXI' | 'BUS' | 'WALK'

export type NewsEvent = {
    id: string
    title: string
    description: string
    intensity: number // 0 to 1
    type: 'BOOM' | 'BUST' | 'CRACKDOWN' | 'SHORTAGE'
    resourceId?: string
    cityId?: string
}

