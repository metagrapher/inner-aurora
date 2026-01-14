import type { TravelMethod, IntraCityMethod } from '../types'
import { TRAVEL_COSTS } from '../constants'

export const getTravelMethodDetails =
    (method: TravelMethod
    ) => TRAVEL_COSTS.ways[method] || TRAVEL_COSTS.ways.BUS

export const getIntraCityMethodDetails =
    (method: IntraCityMethod
    ) => TRAVEL_COSTS.intra_ways[method] || TRAVEL_COSTS.intra_ways.SUBWAY

// This space is reserved for common transit functions like risk multipliers,
// payload capacity checks, and condition degradation logic in future updates.
