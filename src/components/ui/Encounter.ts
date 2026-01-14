
import { html, css } from 'lit'
import { commonStyles, renderActionButton, renderBadge, renderStatItem } from './Common'

export const encounterStyles = css`
  ${commonStyles}
  .encounter-anim {
    animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
  }
  @keyframes shake {
    10%, 90% { transform: translate3d(-1px, 0, 0); }
    20%, 80% { transform: translate3d(2px, 0, 0); }
    30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
    40%, 60% { transform: translate3d(4px, 0, 0); }
  }
`

export const renderEncounter =
  ({ message
    , onResolve
  }: {
    message: string
    , onResolve: (action: string) => void
  }
  ) => html`
    <div class="chamfered-card has-red-bar !max-w-xl mx-auto encounter-anim">
      <div class="chamfered-card-inner !p-12 text-center">
        <h2 class="text-3xl font-black text-crt !text-runner mb-6 font-heading tracking-[0.3em]">STREET_ENCOUNTER</h2>
        <div class="text-7xl mb-8 grayscale brightness-200 contrast-150">⚠️</div>
        <p class="text-xl mb-12 font-bold text-white tracking-tight">${message}</p>
        <div class="flex justify-center gap-6">
          ${renderActionButton(
    {
      label: 'FIGHT'
      , onClick: () => onResolve('Fight')
      , variant: 'danger'
      , className: 'px-12 py-4'
    }
  )}
          ${renderActionButton(
    {
      label: 'FLEE'
      , onClick: () => onResolve('Flee')
      , variant: 'primary'
      , className: 'px-12 py-4'
    }
  )}
        </div>
      </div>
    </div>
  `

export const renderEncounterModal =
  ({ encounter
    , onBust
    , onTakeBribe
    , onBustPartner
    , onIgnore
  }: {
    encounter: any
    , onBust: () => void
    , onTakeBribe: (solo: boolean) => void
    , onBustPartner: () => void
    , onIgnore: () => void
  }
  ) => html`
    <div class="chamfered-card has-red-bar !max-w-2xl mx-auto shadow-2xl shadow-black/80">
      <div class="chamfered-card-inner !p-12 text-center space-y-8 animate-fade-in">
        <h3 class="text-2xl font-black font-heading text-crt tracking-[0.4em]">CONTACT_ESTABLISHED</h3>
        <div class="space-y-4 border-y border-white/5 py-8">
            ${encounter.resource ? html`
              ${renderStatItem({
    label: 'IDENTIFIED_RESOURCE',
    value: encounter.resource.name.toUpperCase(),
    className: 'items-center text-white'
  })}
              ${renderStatItem({
    label: 'EST_QUANTITY',
    value: `${encounter.quantity} UNITS`,
    className: 'items-center opacity-40 text-white'
  })}
            ` : html`
               ${renderStatItem({
    label: 'ACTIVITY_LOG',
    value: encounter.type === 'NIMBY_SWEEP' ? 'VIGILANTE_SWEEP' : 'SUSPICIOUS_BEHAVIOR',
    className: 'items-center text-runner'
  })}
            `}
            ${encounter.partners.length > 0 ? renderBadge(
    {
      label: html`<span class="text-crt">🤝 ${encounter.partners.length} PARTNER(S) DETECTED</span>`
      , variant: 'primary'
      , className: 'mt-4'
    }
  ) : ''}
        </div>
        
        <div class="grid grid-cols-1 gap-4">
            ${encounter.activeBetrayal ? html`
                <div class="p-8 bg-runner/5 border border-runner/20 space-y-6">
                    ${renderBadge({ label: html`<span class="text-crt">INTERNAL_AFFAIRS_CRISIS</span>`, variant: 'danger' })}
                    ${renderActionButton(
    {
      label: `BUST_PARTNER: ${encounter.betrayingPartner.name.toUpperCase()}`
      , onClick: onBustPartner
      , variant: 'danger'
      , className: 'w-full py-4 font-black'
    }
  )}
                </div>
            ` : html`
                <div class="grid grid-cols-2 gap-4">
                    ${renderActionButton(
    {
      label: 'OFFICIAL_BUST'
      , onClick: onBust
      , variant: 'primary'
      , className: 'w-full font-black py-4'
    }
  )}
                    ${renderActionButton(
    {
      label: 'SOLICIT_BRIBE'
      , onClick: () => onTakeBribe(false)
      , variant: 'warning'
      , className: 'w-full font-black py-4'
    }
  )}
                </div>
                ${encounter.partners.length > 0 ? renderActionButton(
    {
      label: 'TAKE_BRIBES_SOLO // HIGH_RISK'
      , onClick: () => onTakeBribe(true)
      , variant: 'danger'
      , className: 'w-full py-3 text-[10px] opacity-60 hover:opacity-100'
    }
  ) : ''}
            `}
            ${renderActionButton(
    {
      label: 'MOVE_ALONG'
      , onClick: onIgnore
      , variant: 'ghost'
      , className: 'w-full py-4 text-[10px] opacity-40'
    }
  )}
        </div>
      </div>
    </div>
  `
