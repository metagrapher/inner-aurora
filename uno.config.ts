import {
    defineConfig,
    presetUno,
    presetAttributify,
    presetTypography,
} from 'unocss'

export default defineConfig({
    presets: [
        presetUno()
        , presetAttributify()
        , presetTypography()
    ]
    , theme: {
        colors: {
            runner: '#ef4444' // red
            , runnerBlue: '#0ea5e9' // sky
            , runnerYellow: '#f59e0b' // amber
            , surface: '#ffffff'
            , slate: {
                50: '#f8fafc'
                , 900: '#0f172a'
                , 950: '#020617'
            }
            , dark: '#020617'
        },
        fontFamily: {
            heading: 'Orbitron, sans-serif'
            , body: 'Outfit, sans-serif'
            , mono: 'JetBrains Mono, monospace'
        },
        animation: {
            keyframes: {
                scanline: '{ 0% { bottom: 100% } 100% { bottom: -100px } }',
                pulse: '{ 0%, 100% { opacity: 1 } 50% { opacity: 0.5 } }'
            },
            durations: {
                scanline: '8s',
                pulse: '2s'
            },
            timingFns: {
                scanline: 'linear'
            },
            counts: {
                scanline: 'infinite',
                pulse: 'infinite'
            }
        }
    }
    , shortcuts: [
        {
            'btn-runner': 'px-8 py-3 bg-runner text-white font-heading uppercase tracking-[0.2em] font-bold hover:bg-runner/90 hover:scale-[1.02] transition-all relative clip-path-[polygon(12px_0,100%_0,100%_calc(100%-12px),calc(100%-12px)_100%,0_100%,0_12px)]'
            , 'card-terminal': 'bg-slate-900/90 border-1 border-white/5 backdrop-blur-md relative p-6 border-l-6 border-l-runner solid-chamfer'
            , 'solid-chamfer': 'clip-path-[polygon(20px_0,calc(100%-20px)_0,100%_20px,100%_calc(100%-20px),calc(100%-20px)_100%,20px_100%,0_calc(100%-20px),0_20px)]'
            , 'text-crt': 'text-white shadow-[0_0_8px_rgba(255,255,255,0.3)] tracking-wider'
        }
    ]
    , rules: [
        ['shadow-terminal', { 'text-shadow': '0 0 5px rgba(255, 255, 255, 0.5)' }]
        , ['shadow-runner', { 'text-shadow': '0 0 10px #ef4444' }]
        , [/^clip-path-\[([\s\S]+)\]$/, ([, d]) => ({ 'clip-path': d.replace(/_/g, ' ') })]
    ]
})
