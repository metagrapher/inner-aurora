
import { describe, it, expect, beforeAll } from 'vitest'
import { createGenerator, type UnoGenerator } from '@unocss/core'
import config from '../../uno.config.ts'

describe('UnoCSS Configuration', () => {
    let uno: UnoGenerator

    beforeAll(async () => {
        // @ts-ignore - createGenerator might return a promise
        uno = await createGenerator(config)
    })

    it('should generate correct CSS for btn-runner shortcut', async () => {
        const result = await uno.generate('btn-runner')
        // result.css contains rgb values or variables like --un-bg-opacity
        expect(result.css).toContain('rgb(239 68 68')
        expect(result.css).toContain('clip-path: polygon')
    })

    it('should generate correct CSS for card-terminal shortcut', async () => {
        const result = await uno.generate('card-terminal')
        // Check for border-left-width in a more flexible way
        expect(result.css).toMatch(/border-left-width:\s*6px/)
        expect(result.css).toContain('rgb(239 68 68')
    })

    it('should verify theme colors', async () => {
        const result = await uno.generate('text-runner')
        expect(result.css).toContain('rgb(239 68 68')
    })
})
