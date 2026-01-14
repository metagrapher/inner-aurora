
import { html, css } from 'lit'
import { commonStyles, renderActionButton, renderBadge } from './Common'
import { RESOURCES } from '../../lib/engine'

export const blotterStyles = css`
  ${commonStyles}
`

export const renderPatrol =
    ({ persona
        , blotterEvents
        , monitoredLocations
        , onAction
        , onToggleMonitor
    }: {
        persona: any
        , blotterEvents: any[]
        , monitoredLocations: Set<string>
        , onAction: (action: string) => void
        , onToggleMonitor: (loc: string) => void
    }
    ) => html`
    <div class="space-y-6">
        <div class="flex justify-between items-center border-b border-white/10 pb-4">
            <h2 class="text-2xl font-bold font-heading text-blue-400">PATROL: ${persona.gameData.drugwars.location}</h2>
            <div class="flex gap-2">
                ${renderBadge({ label: 'LIVE FEED', variant: 'danger', className: 'animate-pulse px-2 py-1' })}
            </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
            ${renderActionButton({
        label: html`<span class="text-xl">🚓</span><span class="text-[10px] font-bold tracking-widest">PATROL</span>`,
        onClick: () => onAction('PATROL'),
        variant: 'indigo',
        className: 'flex-col p-4 rounded-xl gap-2'
    })}
            ${renderActionButton({
        label: html`<span class="text-xl">🍔</span><span class="text-[10px] font-bold tracking-widest">EAT</span>`,
        onClick: () => onAction('EAT'),
        variant: 'success',
        className: 'flex-col p-4 rounded-xl gap-2'
    })}
            ${renderActionButton({
        label: html`<span class="text-xl">💪</span><span class="text-[10px] font-bold tracking-widest">GYM</span>`,
        onClick: () => onAction('GYM'),
        variant: 'danger',
        className: 'flex-col p-4 rounded-xl gap-2'
    })}
             ${renderActionButton({
        label: html`<span class="text-xl">💤</span><span class="text-[10px] font-bold tracking-widest">SLEEP</span>`,
        onClick: () => onAction('SLEEP'),
        variant: 'primary',
        className: 'flex-col p-4 rounded-xl gap-2'
    })}
        </div>

        ${renderBlotter({ persona, blotterEvents, monitoredLocations, onToggleMonitor })}
    </div>
  `

export const renderBlotter =
    ({ persona
        , blotterEvents
        , monitoredLocations
        , onToggleMonitor
    }: {
        persona: any
        , blotterEvents: any[]
        , monitoredLocations: Set<string>
        , onToggleMonitor: (loc: string) => void
    }
    ) => html`
    <div class="glass border-blue-500/20">
        <h3 class="font-heading text-sm font-bold mb-4 opacity-60">POLICE BLOTTER (ACTIVE REGION)</h3>
        <div class="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            ${blotterEvents.length === 0 ? html`<p class="text-xs opacity-30 italic">No recent activity logged...</p>` : ''}
            ${blotterEvents.map(event => html`
                <div class="text-[10px] p-2 border-l-2 ${event.role === 'Police' || event.reporterRole === 'Police' ? 'border-blue-500 bg-blue-500/5' : 'border-indigo-500 bg-indigo-500/5'} flex justify-between items-center group">
                    <div class="flex flex-col gap-0.5">
                        <span class="opacity-40 font-mono">${new Date(event.timestamp).toLocaleTimeString()}</span>
                        <span class="font-bold opacity-80">${event.message}</span>
                        <span class="opacity-40 uppercase tracking-tighter">${event.location}</span>
                    </div>
                    ${event.reportType === 'ENCAMPMENT' || event.type === 'ENCAMPMENT_SWEPT' ? renderActionButton(
        {
            label: monitoredLocations.has(event.location) ? '📡 MONITORING' : '🔭 MONITOR'
            , onClick: () => onToggleMonitor(event.location)
            , variant: monitoredLocations.has(event.location) ? 'primary' : 'ghost'
            , className: 'text-[8px] px-2 py-1 h-fit'
        }
    ) : ''}
                </div>
            `)}
        </div>
    </div>
  `
