import { GunRelay } from './api/relay'
// @ts-ignore
import * as astroModule from '../dist/_worker.js/index.js'

export { GunRelay }

export default {
    async fetch(request: Request, env: any, ctx: any) {
        const url = new URL(request.url)
        console.log('[Entry] Path:', url.pathname, 'Env keys:', Object.keys(env || {}))
        
        // Handle Gun.js relay directly via Durable Object
        if (url.pathname === '/gun') {
            if (!env.GUN_RELAY) {
                console.error('[Entry] GUN_RELAY binding missing')
                return new Response('GUN_RELAY binding missing', { status: 500 })
            }
            const id = env.GUN_RELAY.idFromName('global')
            const obj = env.GUN_RELAY.get(id)
            return obj.fetch(request)
        }

        // Delegate everything else to Astro
        try {
            const astro = (astroModule as any).default || astroModule
            
            // Mock ASSETS if missing to prevent 404 crashes in some environments
            if (!env.ASSETS) {
                env.ASSETS = {
                    fetch: async () => new Response('Asset Not Found', { status: 404 })
                }
            }

            if (typeof astro?.fetch !== 'function') {
                console.error('[Entry] Astro fetch not found or not a function. Keys:', Object.keys(astroModule))
                return new Response('Astro fetch missing', { status: 500 })
            }
            return await astro.fetch(request, env, ctx)
        } catch (e: any) {
            console.error('[Entry] Astro fetch error:', e.message, e.stack)
            return new Response(`Worker Error: ${e.message}`, { status: 500 })
        }
    }
}
