import { RESOURCES, NEWS_EVENTS } from '../constants'
import { getCity, getLocationWealthFactor } from '../housing/locations'
import type { Resource, NewsEvent } from '../types'

export const getActiveEvents =
    (gameTimeHours: number
        , cityId?: string
    ) => {
        // Deterministic selection based on game hours
        const seed = Math.floor(gameTimeHours / 12)
        const eventIndex = (seed + (cityId ? cityId.length : 0)) % NEWS_EVENTS.length
        return [NEWS_EVENTS[eventIndex]]
    }

export const calculatePrice =
    (resource: Resource
        , location: string
        , gameTime: any
        , demandFactor: number = 0
        , isBuy: boolean = true
    ) => {
        const city = getCity(location)
        const locationSeed = location.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
        const resourceSeed = resource.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
        const totalHours = gameTime.hours + (gameTime.days * 24)
        const seed = locationSeed + resourceSeed + totalHours

        const fluctuation = Math.sin(seed) * resource.volatility
        const scarcity = Math.cos(seed * 0.5) * (resource.volatility * 0.5)

        let multiplier = 1.0

        // Apply News modifiers
        const activeEvents = getActiveEvents(totalHours, city?.id)
        activeEvents.forEach(event => {
            if (!event.resourceId || event.resourceId === resource.id) {
                if (!event.cityId || event.cityId === city?.id) {
                    if (event.type === 'BOOM') multiplier += (0.5 * event.intensity)
                    if (event.type === 'BUST') multiplier -= (0.4 * event.intensity)
                    if (event.type === 'SHORTAGE') multiplier += (0.8 * event.intensity)
                    if (event.type === 'CRACKDOWN') multiplier += (0.3 * event.intensity)
                }
            }
        })

        const wealthFactor = getLocationWealthFactor(location)
        const totalDemand = 1 + (demandFactor * 0.1)
        const baseCalculated = Math.floor(resource.basePrice * (1 + fluctuation + scarcity) * multiplier * totalDemand * wealthFactor)

        // Buy/Sell Spread: Sell price is ~90% of buy price
        return isBuy ? baseCalculated : Math.floor(baseCalculated * 0.9)
    }

export const calculateMarketItem =
    (resource: Resource
        , location: string
        , gameTime: any
        , demandFactor: number
        , playerInventory: Record<string, number> = {}
    ) => {
        const city = getCity(location)
        const districtData = city?.districtData?.[location]
        const availableHere = districtData?.availableResources ?? city?.availableResources ?? []

        const wealthFactor = getLocationWealthFactor(location)
        const lowClassDrugs = ['fent', 'heroin', 'crack', 'meth', 'k2', 'pcp']
        let isNormallyAvailable = availableHere.includes(resource.id)

        if (wealthFactor > 1.8 && lowClassDrugs.includes(resource.id)) {
            // 80% chance it's NOT available in high wealth areas unless you know a guy (volume > 5)
            if (Math.random() > 0.2 && demandFactor < 5) {
                isNormallyAvailable = false
            }
        }

        const playerHasIt = (playerInventory[resource.id] || 0) > 0
        const isVisible = isNormallyAvailable || playerHasIt
        const isAvailableToBuy = isNormallyAvailable

        const buyPrice = calculatePrice(resource, location, gameTime, demandFactor, true)
        const sellPrice = calculatePrice(resource, location, gameTime, demandFactor, false)

        return ({
            resource
            , buyPrice
            , sellPrice
            , isNormallyAvailable
            , isVisible
            , isAvailableToBuy
            , playerHasIt
        }
        )
    }

export const calculateBulkPrice =
    (resource: Resource
        , location: string
        , gameTime: any
        , demandFactor: number
        , quantity: number
        , isBuy: boolean = true
    ) => {
        const unitPrice = calculatePrice(resource, location, gameTime, demandFactor, isBuy)

        let discount = 0
        if (quantity > 1) {
            discount = Math.min(0.85, Math.log10(quantity) * 0.40)
        }

        const total = Math.floor(unitPrice * quantity * (1 - discount))
        return ({
            total
            , unitPrice: Math.floor(total / quantity)
        }
        )
    }
