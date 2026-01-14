import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

import UnoCSS from 'unocss/astro';

// https://astro.build/config
export default defineConfig({
    output: 'server',
    adapter: cloudflare({
        platformProxy: {
            enabled: true,
        },
    }),
    server: {
        port: 6969
    },
    integrations: [
        UnoCSS({
            injectReset: true,
        }),
    ],
});
