import { html, css } from 'lit'
import type { TemplateResult } from 'lit'
import { themeStyles } from '../../lib/theme'

import './Button'

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost'

export const commonStyles = css`
  ${themeStyles}
  .chamfered-card {
    background: var(--border-bright); /* Border color */
    padding: 1px;
    clip-path: polygon(
      0% 0%, 
      calc(100% - 20px) 0%, 100% 20px, 
      100% 100%, 
      20px 100%, 0% calc(100% - 20px)
    );
    position: relative;
    display: flex;
  }
  .chamfered-card-inner {
    background: var(--bg-deep);
    width: 100%;
    position: relative;
    clip-path: polygon(
      -1px -1px, 
      calc(100% - 19.5px) -1px, calc(100% + 1px) 19.5px, 
      calc(100% + 1px) calc(100% + 1px), 
      19.5px calc(100% + 1px), -1px calc(100% - 19.5px)
    );
    padding: 2rem;
  }
  .chamfered-card.has-red-bar .chamfered-card-inner {
    border-left: 6px solid var(--runner);
  }
  .text-crt {
    color: var(--text-bright) !important;
    text-shadow: 0 0 10px rgba(var(--text-bright-rgb), 0.6), 0 0 20px rgba(var(--text-bright-rgb), 0.2);
    position: relative;
    display: inline-block;
  }
  .text-crt::after {
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
    background-size: 100% 2px, 3px 100%;
    pointer-events: none;
    z-index: 1;
    opacity: 0.3;
  }
  .action-log {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.75rem;
    line-height: 1.4;
    color: var(--text-dim);
  }
  .log-entry {
    border-left: 2px solid var(--border-dim);
    padding-left: 1rem;
    margin-bottom: 0.5rem;
  }
  .pulse {
    animation: pulse-red 2s infinite;
  }
  @keyframes pulse-red {
    0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
    70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
    100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
  }

  /* Reusable Item Patterns */
  .ar-item {
      background: var(--border-ghost);
      padding: 1px;
      margin-bottom: 0.75rem;
      position: relative;
      clip-path: polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px));
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  }
  .ar-item-inner {
      background: var(--bg-deep);
      padding: 0.75rem;
      width: 100%;
      height: 100%;
      clip-path: polygon(
        -1px -1px, 
        calc(100% - 14.5px) -1px, calc(100% + 1px) 14.5px, 
        calc(100% + 1px) calc(100% + 1px), 
        14.5px calc(100% + 1px), -1px calc(100% - 14.5px)
      );
  }
  .ar-item:hover {
      background: var(--runner);
      transform: translateY(-1px);
      box-shadow: 0 4px 20px rgba(239, 68, 68, 0.15);
  }
  .ar-item.disabled {
      opacity: 0.2;
      filter: grayscale(1);
      pointer-events: none;
  }

  .ar-row {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      gap: 1.5rem;
      width: 100%;
  }
  .ar-row-info {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 1.5rem;
      flex: 0 1 auto;
      min-width: 0;
  }
  .ar-row-actions {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 1.5rem;
      flex-shrink: 0;
  }
  .ar-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
  }
  @media (min-width: 768px) {
      .ar-grid.cols-2 { grid-template-columns: repeat(2, 1fr); }
      .ar-grid.cols-3 { grid-template-columns: repeat(3, 1fr); }
  }
  @media (min-width: 1024px) {
      .ar-grid.cols-4 { grid-template-columns: repeat(4, 1fr); }
  }
`
export const renderActionButton = (
  { label, onClick, variant = 'primary', className = '', icon, disabled = false }:
    { label: string | TemplateResult, onClick: (e?: any) => void, variant?: ButtonVariant, className?: string, icon?: string | TemplateResult, disabled?: boolean }
) => html`
  <ar-button
    variant="${variant}"
    class="${className}"
    ?disabled="${disabled}"
    @click="${(e: Event) => { e.stopPropagation(); onClick(e); }}"
  >
    ${icon ? html`<span slot="icon">${icon}</span>` : ''}
    ${label}
  </ar-button>
`


export const renderStatItem = (
  { label, value, icon, className = '' }:
    { label: string, value: string | number | TemplateResult, icon?: string, className?: string }
) => html`
  <div class="flex flex-col ${className}">
    <span class="text-[8px] font-black uppercase tracking-[0.3em] text-white/30 mb-1">${label}</span>
    <div class="flex items-center gap-2">
      ${icon ? html`<span class="text-xs opacity-50">${icon}</span>` : ''}
      <span class="font-black text-lg text-white tracking-widest uppercase">${value}</span>
    </div>
  </div>
`

export const renderBadge = (
  { label, variant = 'default', className = '' }:
    { label: string, variant?: ButtonVariant, className?: string }
) => {
  const variants = {
    'default': 'bg-white/5 text-white/60 border-white/10'
    , 'primary': 'bg-white text-black border-white'
    , 'success': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    , 'warning': 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    , 'danger': 'bg-runner text-white border-runner'
    , 'ghost': 'bg-transparent text-white/40 border-white/5'
    , 'indigo': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
  }

  return html`
    <span class="px-2 py-0.5 text-[8px] font-black tracking-widest border uppercase ${variants[variant]} ${className}">
      ${label}
    </span>
  `
}

export const renderNimbyAction = ({ label, action, onAction, type = 'primary' }: { label: string, action: any, onAction: (a: any) => void, type?: string }) => {
  return renderActionButton({
    label,
    onClick: () => onAction(action),
    variant: type as any,
    className: 'text-xs'
  })
}

/**
 * Reusable Card for Grid views
 */
export const renderGridItem = (
  { content, className = '', disabled = false }:
    { content: TemplateResult | string, className?: string, disabled?: boolean }
) => html`
  <div class="ar-item grid-mode ${disabled ? 'disabled' : ''} ${className}">
    <div class="ar-item-inner">
      ${content}
    </div>
  </div>
`

/**
 * Reusable Row for List views (Tightened Layout)
 */
export const renderListRow = (
  { info, actions, controls, className = '', disabled = false }:
    { info: TemplateResult | string, actions: TemplateResult | string, controls?: TemplateResult | string, className?: string, disabled?: boolean }
) => html`
  <div class="ar-item list-mode ${disabled ? 'disabled' : ''} ${className}">
    <div class="ar-item-inner !py-1 !px-3">
      <div class="ar-row">
        <div class="ar-row-info">
          ${info}
        </div>
        <div class="ar-row-actions">
          ${controls ? html`
            <div class="flex items-center gap-4">
              ${controls}
            </div>
          ` : ''}
          <div class="flex items-center gap-2">
            ${actions}
          </div>
        </div>
      </div>
    </div>
  </div>
`
