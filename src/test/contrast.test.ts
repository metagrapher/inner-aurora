
import { describe, it, expect } from 'vitest'
import { getContrastRatio, checkContrast } from './a11y-utils'

describe('A11y Contrast Tests', () => {
    // Current project theme values (extracted from uno.config.ts)
    const colors = {
        white: '#ffffff',
        black: '#000000',
        runner: '#ef4444',
        slate900: '#0f172a'
    }

    it('Primary Button (White on Black) should meet AA contrast', () => {
        const ratio = getContrastRatio(colors.white, colors.black)
        expect(ratio).toBeGreaterThanOrEqual(4.5)
        expect(checkContrast(colors.white, colors.black)).toBe(true)
    })

    it('Runner Red on Slate 900 should meet AA contrast', () => {
        // Red (#ef4444) on Dark Slate (#0f172a)
        const ratio = getContrastRatio(colors.runner, colors.slate900)
        // Red on dark is often borderline (~4.1:1). This might fail if seeking strict AA (4.5:1)
        expect(ratio).toBeGreaterThanOrEqual(4.5)
    })
})
