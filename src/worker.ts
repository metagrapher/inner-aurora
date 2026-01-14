
import { manifest } from 'astro:ssr-manifest'
import { createExports } from '@astrojs/cloudflare/entrypoint'
export { GunRelay } from './api/relay'

const exports = createExports(manifest)

export default {
    async fetch(request: Request, env: any, context: any) {
        return exports.default.fetch(request, env, context)
    }
}
