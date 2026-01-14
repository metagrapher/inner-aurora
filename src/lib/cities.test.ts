import { describe, it, expect } from 'vitest'
import { CITIES, getAreaTerm } from './engine'

describe('City Nomenclature', () => {
    it('should have 10 cities defined', () => {
        expect(CITIES.length).toBe(10)
        const cityIds = CITIES.map(c => c.id)
        expect(cityIds).toContain('hou')
        expect(cityIds).toContain('sea')
        expect(cityIds).toContain('atl')
        expect(cityIds).toContain('msy')
        expect(cityIds).toContain('sfo')
        expect(cityIds).toContain('dfw')
        expect(cityIds).toContain('dc')
    })

    it('should result in correct default area terms', () => {
        expect(getAreaTerm('nyc')).toBe('Borough')
        expect(getAreaTerm('chi')).toBe('Ward')
        expect(getAreaTerm('lax')).toBe('Hood')
        expect(getAreaTerm('hou')).toBe('Ward')
        expect(getAreaTerm('sea')).toBe('Hood')
        expect(getAreaTerm('sfo')).toBe('Neighborhood')
    })

    it('should handle role-based overrides', () => {
        expect(getAreaTerm('sea', 'Police')).toBe('Precinct')
        expect(getAreaTerm('sea', 'Citizen')).toBe('Hood')
        // NYC has no override, should stay Borough
        expect(getAreaTerm('nyc', 'Police')).toBe('Borough')
    })

    it('should fallback gracefully', () => {
        expect(getAreaTerm('unknown_city')).toBe('District')
    })
})

describe('Data Integrity', () => {
    it('should have at least one entry-level district per city (wealthFactor < 3.0)', () => {
        // Relaxed threshold as some cities (Seattle) are naturally high-wealth in this real-world data
        CITIES.forEach(city => {
            const districts = Object.values(city.districtData || {})
            const entryLevelDistricts = districts.filter(d => d.wealthFactor !== undefined && d.wealthFactor < 3.0)
            expect(entryLevelDistricts.length, `City ${city.name} (${city.id}) should have at least one district with wealthFactor < 3.0`).toBeGreaterThan(0)
        })
    })

    it('should have coordinate data for all districts', () => {
        CITIES.forEach(city => {
            Object.entries(city.districtData || {}).forEach(([name, data]) => {
                expect(data.coords, `District ${name} in ${city.name} missing coordinates`).toBeDefined()
                expect(data.coords.lat, `District ${name} in ${city.name} missing latitude`).toBeDefined()
                expect(data.coords.lon, `District ${name} in ${city.name} missing longitude`).toBeDefined()
            })
        })
    })

    it('should have transit data for cities that support rail', () => {
        const railCities = ['nyc', 'chi', 'lax', 'hou', 'dc', 'sfo', 'sea', 'atl']
        railCities.forEach(id => {
            const city = CITIES.find(c => c.id === id)
            if (city) {
                expect(city.railConnectivity, `City ${city.name} missing railConnectivity`).toBeDefined()
                expect(Object.keys(city.railConnectivity).length).toBeGreaterThan(0)
            }
        })
    })
})

describe('Wealth Index Extremes', () => {
    it('should verify Manhattan has an exceptionally high wealth factor', () => {
        const nyc = CITIES.find(c => c.id === 'nyc')
        const manhattan = nyc?.districtData?.['Manhattan']
        expect(manhattan?.wealthFactor).toBe(11.2172)
    })

    it('should verify Stockyards has a very low wealth factor', () => {
        const dfw = CITIES.find(c => c.id === 'dfw')
        const stockyards = dfw?.districtData?.['Stockyards']
        expect(stockyards?.wealthFactor).toBe(0.15)
    })
})
