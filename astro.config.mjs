import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import lit from '@astrojs/lit';
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
        lit(),
        UnoCSS({
            injectReset: true,
        }),
    ],
});
