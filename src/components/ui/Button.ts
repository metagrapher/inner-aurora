
import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { themeStyles } from '../../lib/theme'

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'ghost'

/**
 * ArButton - Standardized Cyber-Retro button with diametrical chamfers.
 * Follows Designer's preferences: light text on dark, unbroken border,
 * chamfered corners (top-right, bottom-left).
 */
@customElement('ar-button')
export class ArButton extends LitElement {
    @property({ type: String }) variant: ButtonVariant = 'primary'
    @property({ type: Boolean }) disabled = false
    @property({ type: String }) type: 'button' | 'submit' | 'reset' = 'button'

    static styles = [
        themeStyles
        , css`
            :host {
                display: inline-block;
                cursor: pointer;
            }

            :host([disabled]) {
                cursor: not-allowed;
                pointer-events: none;
            }

            .btn-outer {
                background: var(--border-bright);
                padding: 1px;
                /* Diametrically opposed chamfers: Top-Right and Bottom-Left */
                clip-path: polygon(
                    0% 0%                    /* Top-Left */
                    , calc(100% - 12px) 0%   /* Top-Right Start */
                    , 100% 12px              /* Top-Right End */
                    , 100% 100%              /* Bottom-Right */
                    , 12px 100%              /* Bottom-Left Start */
                    , 0% calc(100% - 12px)   /* Bottom-Left End */
                );
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .btn-inner {
                background: var(--bg-deep);
                color: var(--text-bright);
                padding: 0.75rem 1.5rem;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
                font-family: 'Orbitron', sans-serif;
                font-size: 0.75rem;
                font-weight: 800;
                text-transform: uppercase;
                letter-spacing: 0.2em;
                clip-path: polygon(
                    0% 0%
                    , calc(100% - 11.5px) 0%
                    , 100% 11.5px
                    , 100% 100%
                    , 11.5px 100%
                    , 0% calc(100% - 11.5px)
                );
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            }

            /* Hover states - The "Snazzy" Inversion */
            :host(:hover:not([disabled])) .btn-outer {
                background: var(--text-bright);
                transform: translateY(-1px);
                box-shadow: 0 5px 15px var(--border-ghost);
            }

            :host(:hover:not([disabled])) .btn-inner {
                background: var(--text-bright);
                color: var(--bg-deep);
            }

            :host(:active:not([disabled])) {
                transform: translateY(0);
            }

            /* Variants */
            :host([variant="danger"]) .btn-outer { background: var(--runner); }
            :host([variant="danger"]) .btn-inner { color: var(--runner); }
            :host([variant="danger"]:hover:not([disabled])) .btn-inner { 
                background: var(--runner); 
                color: var(--text-bright); 
            }

            :host([variant="success"]) .btn-outer { background: var(--emerald); }
            :host([variant="success"]) .btn-inner { color: var(--emerald); }
            :host([variant="success"]:hover:not([disabled])) .btn-inner { 
                background: var(--emerald); 
                color: var(--text-bright); 
            }

            :host([variant="warning"]) .btn-outer { background: var(--amber); }
            :host([variant="warning"]) .btn-inner { color: var(--amber); }
            :host([variant="warning"]:hover:not([disabled])) .btn-inner { 
                background: var(--amber); 
                color: var(--bg-deep); 
            }

            :host([disabled]) {
                opacity: 0.3;
                filter: grayscale(0.8);
            }

            ::slotted(*) {
                display: flex;
                align-items: center;
            }
        `
    ]

    render() {
        return html`
            <div class="btn-outer">
                <div class="btn-inner">
                    <slot name="icon"></slot>
                    <slot></slot>
                </div>
            </div>
        `
    }
}
