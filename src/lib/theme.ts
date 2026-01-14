
import { css, unsafeCSS } from 'lit'

/**
 * Cyber-Retro Theme Colors
 * Centralized color definitions for JS and CSS usage.
 * JS values are used for logic/interpolation, while CSS variables
 * facilitate runtime theming and consistency.
 */
export const theme =
{
    colors:
    {
        runner: '#ef4444'     // Primary red accent
        , sky: '#0ea5e9'      // Cyber blue / info
        , amber: '#f59e0b'    // Warning / gold
        , emerald: '#10b981'  // Success / green
        , slate:
        {
            50: '#f8fafc'
            , 100: '#f1f5f9'
            , 200: '#e2e8f0'
            , 300: '#cbd5e1'
            , 900: '#0f172a'  // Surface background
            , 950: '#020617'  // Deep background
        }
        , white: '#ffffff'
        , black: '#000000'
    }
}

/**
 * CSS Variable definitions for the theme.
 * Inject this into commonStyles or :host/:root.
 */
export const themeStyles = css`
    :host, :root {
        --runner: ${unsafeCSS(theme.colors.runner)};
        --runner-rgb: 239, 68, 68;
        --sky: ${unsafeCSS(theme.colors.sky)};
        --sky-rgb: 14, 165, 233;
        --amber: ${unsafeCSS(theme.colors.amber)};
        --amber-rgb: 245, 158, 11;
        --emerald: ${unsafeCSS(theme.colors.emerald)};
        --emerald-rgb: 16, 185, 129;
        
        --bg-deep: ${unsafeCSS(theme.colors.slate[950])};
        --bg-deep-rgb: 2, 6, 23;
        --bg-surface: ${unsafeCSS(theme.colors.slate[900])};
        --bg-surface-rgb: 15, 23, 42;
        
        --text-ghost: rgba(255, 255, 255, 0.3);
        --text-ghost-rgb: 255, 255, 255;
        --text-dim: rgba(255, 255, 255, 0.6);
        --text-dim-rgb: 255, 255, 255;
        --text-bright: #ffffff;
        --text-bright-rgb: 255, 255, 255;
        
        --border-ghost: rgba(255, 255, 255, 0.05);
        --border-dim: rgba(255, 255, 255, 0.1);
        --border-bright: rgba(255, 255, 255, 0.2);
    }

    /* Light Theme Overrides */
    :host([data-theme="light"]), [data-theme="light"] {
        --bg-deep: ${unsafeCSS(theme.colors.slate[100])};
        --bg-deep-rgb: 241, 245, 249;
        --bg-surface: ${unsafeCSS(theme.colors.slate[200])};
        --bg-surface-rgb: 226, 232, 240;
        
        --text-ghost: rgba(15, 23, 42, 0.3);
        --text-dim: rgba(15, 23, 42, 0.6);
        --text-bright: #0f172a;
        --text-bright-rgb: 15, 23, 42;
        
        --border-ghost: rgba(15, 23, 42, 0.05);
        --border-dim: rgba(15, 23, 42, 0.1);
        --border-bright: rgba(15, 23, 42, 0.2);
    }

    /* Standardized color utility classes */
    .text-runner { color: var(--runner); }
    .text-sky { color: var(--sky); }
    .text-amber { color: var(--amber); }
    .text-emerald { color: var(--emerald); }
`
