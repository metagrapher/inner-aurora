import { CITIES } from '../cities'

export const getCity =
    (location: string
    ) => CITIES.find(c => c.districts.includes(location) || c.hub === location)

export const getLocationWealthFactor =
    (location: string
    ) => {
        const city = getCity(location)
        if (!city) return 1.0
        return city.districtData?.[location]?.wealthFactor ?? city.wealthFactor ?? 1.0
    }

export const getAreaTerm =
    (cityId: string
        , role?: string
    ) => {
        const city = CITIES.find(c => c.id === cityId)
        if (!city) return "District"

        if (role && city.areaTermMap && city.areaTermMap[role]) {
            return city.areaTermMap[role]
        }
        return city.areaTerm
    }
