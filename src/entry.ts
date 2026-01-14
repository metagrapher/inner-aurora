import { GunRelay } from './api/relay'
// @ts-ignore
import astro from '../dist/_worker.js/index.js'

export { GunRelay }

export default {
    async fetch(request: Request, env: any, ctx: any) {
        const url = new URL(request.url)
        
        // Handle Gun.js relay directly via Durable Object
        if (url.pathname === '/gun') {
            const id = env.GUN_RELAY.idFromName('global')
            const obj = env.GUN_RELAY.get(id)
            return obj.fetch(request)
        }

        // Delegate everything else to Astro
        return astro.fetch(request, env, ctx)
    }
}
