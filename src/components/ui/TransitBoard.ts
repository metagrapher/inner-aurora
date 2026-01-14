
import { html, css } from 'lit'
import type { TemplateResult } from 'lit'
import { commonStyles } from './Common'

/* For ease of themeing, I want us to be defining colorways up front and then using variables in the CSS
    This also allows us to define colorways in separate files and import them in.
 */

export const transitBoardStyles = css`
  ${commonStyles}

  .transit-board-container {
    background: var(--border-bright); /* Border color */
    padding: 1px;
    clip-path: polygon(
      0% 0%, 
      calc(100% - 25px) 0%, 100% 25px, 
      100% 100%, 
      25px 100%, 0% calc(100% - 25px)
    );
    position: relative;
    user-select: none;
    box-shadow: 0 40px 100px rgba(0, 0, 0, 0.5);
  }

  .transit-board-inner {
    background: var(--bg-deep);
    width: 100%;
    height: 100%;
    position: relative;
    clip-path: polygon(
      -1px -1px, 
      calc(100% - 24.5px) -1px, calc(100% + 1px) 24.5px, 
      calc(100% + 1px) calc(100% + 1px), 
      24.5px calc(100% + 1px), -1px calc(100% - 24.5px)
    );
    display: flex;
    flex-direction: column;
  }

  .transit-board-container::after {
    content: " ";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: linear-gradient(rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.02) 50%);
    z-index: 2;
    background-size: 100% 4px;
    pointer-events: none;
  }

  .board-header {
    background: rgba(255, 255, 255, 0.03);
    padding: 1.5rem 2.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid var(--runner);
    color: white;
    font-size: 1.25rem;
    font-weight: 900;
    letter-spacing: 0.4em;
    text-transform: uppercase;
    position: relative;
    z-index: 3;
    font-family: 'Orbitron', sans-serif;
  }

  .board-th {
    padding: 1.25rem 2.5rem;
    text-align: left;
    color: rgba(255, 255, 255, 0.3);
    font-size: 0.7rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.25em;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  .board-row {
    border-bottom: 1px solid rgba(255, 255, 255, 0.02);
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .board-row:hover {
    background: rgba(255, 255, 255, 0.03);
  }

  .board-row:hover .flap-char {
    color: var(--runner);
    border-color: var(--runner);
    box-shadow: 0 0 10px rgba(239, 68, 68, 0.2);
  }

  .board-td {
    padding: 1.25rem 2.5rem;
    color: white;
    font-size: 1.2rem;
    font-weight: 800;
    vertical-align: middle;
  }

  .flap-char {
    display: inline-block;
    background: var(--bg-surface);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    min-width: 0.8rem;
    padding: 0 0.3rem;
    height: 1.5em;
    line-height: 1.5em;
    text-align: center;
    position: relative;
    overflow: hidden;
    color: white;
    font-weight: 900;
    transition: all 0.2s ease;
    text-shadow: 0 0 5px rgba(255, 255, 255, 0.3);
  }

  .flap-char::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 1px;
    background: rgba(0, 0, 0, 0.3);
    z-index: 5;
  }

  .text-yellow { color: var(--amber); }
  .text-red { color: var(--runner); }
  .text-green { color: var(--emerald); }
  .text-blue { color: var(--sky); }

  .blinking-cursor {
    animation: blink 1s step-end infinite;
    color: var(--runner);
    font-weight: 900;
  }

  @keyframes blink { 
    50% { opacity: 0; } 
  }

  @keyframes flip {
    0% { transform: scaleY(1); }
    50% { transform: scaleY(0); }
    100% { transform: scaleY(1); }
  }

  .flap-animate {
    animation: flip 0.3s ease-in-out;
  }
`

export interface TransitColumn {
  key: string
  label: string
  width?: string
  align?: 'left' | 'right' | 'center'
}

export interface TransitRow {
  id: string
  [key: string]: any
  disabled?: boolean
}

/**
 * Renders text as a series of split-flap characters
 */
const renderFlapText = (text: string) => {
  return html`
        <div class="flap-text">
            ${text.split('').map((char, i) => html`
                <span class="flap-char" style="animation-delay: ${i * 0.05}s">
                    ${char}
                </span>
            `)}
        </div>
    `
}

export const renderTransitBoard =
  ({ title
    , columns
    , data
    , onRowClick
    , activeId
  }: {
    title: string
    , columns: TransitColumn[]
    , data: TransitRow[]
    , onRowClick?: (row: TransitRow) => void
    , activeId?: string
  }
  ) => {
    return html`
    <div class="transit-board-container">
        <div class="transit-board-inner">
            <div class="board-header">
                <span>${title}</span>
                <span class="blinking-cursor">_</span>
            </div>
            
            <table class="board-table">
                <thead class="board-thead">
                    <tr>
                        ${columns.map(col => html`
                            <th class="board-th" style="width: ${col.width || 'auto'}; text-align: ${col.align || 'left'}">
                                ${col.label}
                            </th>
                        `)}
                    </tr>
                </thead>
                <tbody>
                    ${data.map(row => html`
                        <tr class="board-row ${row.id === activeId || row.disabled ? 'active' : ''}" 
                            @click="${() => !row.disabled && row.id !== activeId && onRowClick?.(row)}">
                            ${columns.map(col => {
      const val = row[col.key]
      if (val && typeof val === 'object' && '_$litType$' in val) {
        return html`
                        <td class="board-td" style="text-align: ${col.align || 'left'}">
                            ${val}
                        </td>
                    `
      }
      const strVal = String(val)
      return html`
                    <td class="board-td" style="text-align: ${col.align || 'left'}">
                        ${renderFlapText(strVal.toUpperCase())}
                    </td>
                `
    })}
                        </tr>
                    `)}
                </tbody>
            </table>
        </div>
    </div>
  `
  }
