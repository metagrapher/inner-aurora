import { describe, it, expect } from 'vitest'
import { handleCitizenReport, handleBust } from './engine'

describe('NIMBY/Cop Logic', () => {
    it('should generate granular reports', () => {
        const nimby = { id: 'n1', nimbyCred: 0, nimbyStatus: 0, role: 'NIMBY' }
        const { event, reporter: updatedNimby } = handleCitizenReport(nimby, 'Brooklyn', "ENCAMPMENT", 'GOOD')

        expect(event.quality).toBe('GOOD')
        expect(event.isOccupied).toBe(true)
        expect(updatedNimby.nimbyCred).toBe(10)
    })

    it('should scale bribe probability by NIMBY cred', () => {
        const cop = { role: 'Police', strength: 10, inventory: {} }
        const t1 = { role: 'NIMBY', nimbyCred: 0 }
        const t2 = { role: 'NIMBY', nimbyCred: 100 }

        const b1 = handleBust(cop, 'weed', 10, 0, t1)
        const b2 = handleBust(cop, 'weed', 10, 0, t2)

        expect(b1.bribeProbability).toBe(0.5)
        expect(b2.bribeProbability).toBe(0.9)
    })
})
