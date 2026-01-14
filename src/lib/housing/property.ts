import type { Safehouse } from '../types'
import { DISTRICT_BASE_RENTS, RENT_INTERVAL_MS } from '../constants'
import { getCity, getLocationWealthFactor } from './locations'

export const calculateMonthlyRent =
    (location: string
    ) => {
        const baseRent = DISTRICT_BASE_RENTS[location] || 1500
        const wealthFactor = getLocationWealthFactor(location)
        return Math.floor(baseRent * wealthFactor)
    }

export const calculatePurchasePrice =
    (location: string
    ) => {
        const monthlyRent = calculateMonthlyRent(location)
        return monthlyRent * 120 // 10-year valuation
    }

export const handleRealEstateAction =
    (player: any
        , location: string
        , type: 'RENT' | 'BUY'
        , now: number = Date.now()
    ) => {
        const city = getCity(location)
        if (city?.hub === location) {
            return { error: "INVALID_LOCATION", message: "Can't establish a base at the transit hub." }
        }

        // Check for existing safehouse in this location
        const existing = (player.safehouses || []).find((sh: Safehouse) => sh.location === location)
        if (existing) {
            return { error: "ALREADY_OWNED", message: "You already have a node here." }
        }

        // Check for ban
        if ((player.evictions?.[location] || 0) > Date.now()) {
            return { error: "BANNED", message: "Banned from leasing in this district." }
        }

        const rentPrice = calculateMonthlyRent(location)
        const buyPrice = calculatePurchasePrice(location)
        const cost = type === 'BUY' ? buyPrice : rentPrice

        if (player.cash < cost) {
            return { error: "INSUFFICIENT_FUNDS", message: `You need $${cost.toLocaleString()} cash to ${type.toLowerCase()} here.` }
        }

        player.cash -= cost

        const newSafehouse: Safehouse =
            ({
                id: `sh_${Math.random().toString(36).slice(2, 9)}`
                , location
                , ownerId: type === 'BUY' ? player.id : 'system'
                , renterId: type === 'RENT' ? player.id : undefined
                , rentAmount: rentPrice
                , rentDueAt: type === 'RENT' ? now + RENT_INTERVAL_MS : undefined
                , isForRent: false
            }
            )

        if (!player.safehouses) player.safehouses = []
        player.safehouses.push(newSafehouse)

        return ({
            success: true
            , message: `${type === 'BUY' ? 'Acquired asset' : 'Initial lease active'} in ${location}.`
            , safehouse: newSafehouse
        }
        )
    }

export const handleEstablishSafehouse =
    (player: any
    ) => {
        // Legacy support for onboarding/forced starts
        // Defaults to RENT for non-Police roles
        return handleRealEstateAction(player, player.location, 'RENT')
    }
