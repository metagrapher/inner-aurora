
import { html, css } from 'lit'
import { commonStyles, renderBadge, renderStatItem, renderActionButton } from './Common'
import { RESOURCES, getCity, getAreaTerm } from '../../lib/engine'

export const overlayStyles = css`
  ${commonStyles}
  .busy-avatar {
    width: 128px;
    height: 128px;
    image-rendering: pixelated;
    margin: 0 auto;
  }
  .progress-bar-container {
    width: 100%;
    height: 4px;
    background: rgba(255, 255, 255, 0.05);
    overflow: hidden;
    margin-top: 1rem;
  }
  .progress-bar-fill {
    height: 100%;
    background: var(--runner);
    box-shadow: 0 0 15px var(--runner);
    transition: width 0.5s linear;
  }
`

export const renderBusyOverlay =
    ({ persona
        , busyMessage
        , nimbyAlert
        , onInterrupt
        , onRespondSweep
    }: {
        persona: any
        , busyMessage: string
        , nimbyAlert: boolean
        , onInterrupt: () => void
        , onRespondSweep: () => void
    }
    ) => {
        const stats = persona.gameData.drugwars
        const now = Date.now()
        const activity = stats.activity
        if (!activity) return html``

        const total = activity.duration || 1
        const current = now - (activity.startTime || now)
        const progress = Math.min(100, Math.max(0, (current / total) * 100))

        return html`
      <div class="chamfered-card has-red-bar !max-w-lg mx-auto">
        <div class="chamfered-card-inner !p-12 text-center space-y-8 animate-fade-in">
          <div class="text-center space-y-8">
              <div class="relative">
                  <img src="https://api.dicebear.com/7.x/pixel-art/svg?seed=${persona.id || 'default'}&backgroundColor=transparent" class="busy-avatar floating grayscale brightness-200 contrast-150">
                  ${nimbyAlert ? html`
                      <div class="absolute -top-4 -right-4 bg-runner p-3 animate-bounce shadow-xl shadow-runner/40 text-white">⚠️</div>
                  ` : ''}
              </div>
              
              <div class="space-y-6">
                  <h2 class="text-2xl font-heading font-black tracking-[0.3em] text-white text-crt">
                      ${busyMessage.toUpperCase()}
                  </h2>
                  <div class="progress-bar-container">
                      <div class="progress-bar-fill" style="width: ${progress}%"></div>
                  </div>
                  <p class="text-[10px] opacity-30 font-bold uppercase tracking-widest text-white">decrypting urban signal... ${Math.floor(progress)}%</p>
              </div>

              <div class="flex flex-col gap-4">
                  ${nimbyAlert ? renderActionButton({
            label: 'RESPOND TO SWEEP!',
            onClick: onRespondSweep,
            variant: 'danger',
            className: 'w-full py-5 text-lg font-black'
        }) : ''}
                  ${renderActionButton({
            label: 'INTERRUPT_SESSION',
            onClick: onInterrupt,
            variant: 'ghost',
            className: 'w-full py-4 text-[10px]'
        })}
              </div>
          </div>
        </div>
      </div>
    `
    }

export const renderTravelingOverlay = ({
    message,
    endTime,
    destination
}: {
    message: string,
    endTime: number,
    destination: string
}) => {
    const now = Date.now()
    const remainingMs = Math.max(0, endTime - now)
    const minutes = Math.floor(remainingMs / 60000)
    const seconds = Math.floor((remainingMs % 60000) / 1000)

    return html`
      <div class="fixed inset-0 bg-[#020617]/95 backdrop-blur-3xl z-[70] flex items-center justify-center p-8">
          <div class="max-w-md w-full text-center space-y-12">
              <div class="text-7xl mb-8 animate-pulse grayscale brightness-200">🚀</div>
              
              <div class="space-y-6">
                  <h2 class="text-3xl font-heading font-black tracking-[0.4em] text-white text-crt">
                      ${message}
                  </h2>
                  <div class="text-5xl font-heading font-black text-white tracking-widest">
                      ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}
                  </div>
                  <p class="text-[10px] opacity-30 font-bold uppercase tracking-[0.5em] text-white">APPROACH_VECTOR // TARGET: ${(() => {
            const c = getCity(destination)
            return c ? getAreaTerm(c.id).toUpperCase() : 'DISTRICT'
        })()}</p>
              </div>
          </div>
      </div>
    `
}

export const renderLocker =
    ({ persona
        , onFence
        , onBack
    }: {
        persona: any
        , onFence: (resId: string) => void
        , onBack: () => void
    }
    ) => {
        const stats = persona.gameData.drugwars
        const inventory = stats.inventory || {}

        return html`
      <div class="space-y-8">
        <div class="flex justify-between items-end border-b-2 border-white/5 pb-6">
            <div>
                <div class="text-[10px] opacity-40 uppercase tracking-widest font-bold text-white mb-1">SECURE_STORAGE // BIO-LOCKED</div>
                <h2 class="text-4xl font-black font-heading text-white text-crt">NARCO_LOCKER</h2>
            </div>
            ${renderActionButton({
            label: 'EXIT_PERIMETER',
            onClick: onBack,
            variant: 'ghost',
            className: 'text-[10px]'
        })}
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${Object.entries(inventory).map(([resId, qty]) => {
            const res = RESOURCES.find(r => r.id === resId)

            if (!res || (qty as number) <= 0) return ''

            return html`
                <div class="chamfered-card group transition-colors">
                  <div class="chamfered-card-inner !p-6 flex justify-between items-center">
                    <div>
                        <p class="font-black text-xl text-white tracking-tighter text-crt">${res.name.toUpperCase()}</p>
                        <p class="text-[10px] opacity-30 uppercase font-bold tracking-widest text-white">${qty} UNITS SECURED</p>
                    </div>
                    ${persona.role === 'Police' ? renderActionButton({
                label: 'CONTACT FENCE',
                onClick: () => onFence(resId),
                variant: 'primary',
                className: 'text-[10px]'
            }) : ''}
                  </div>
                </div>
              `
        })}
            ${Object.values(inventory).every(qty => (qty as number) <= 0) ? html`
                <div class="col-span-full py-12 text-center opacity-30 italic">Locker is empty...</div>
            ` : ''}
        </div>
      </div>
    `
    }

export const renderInteractionModal =
    ({ interaction, onAccept, onReject }: { interaction: any, onAccept: () => void, onReject: () => void }) => {
        let typeLabel = interaction.type
        let body = html``

        if (interaction.type === 'TRADE_OFFER') {
            const { resourceId, quantity, price, fromName } = interaction.payload
            const res = RESOURCES.find(r => r.id === resourceId)
            typeLabel = 'INCOMING TRADE'
            body = html`
                <div class="space-y-4">
                    <p class="text-white"><span class="text-runner font-black">${fromName}</span> offers ${quantity} ${res?.name || resourceId} for <span class="text-green-400 font-black">$${price.toLocaleString()}</span></p>
                </div>
            `
        } else if (interaction.type === 'ROB_ATTEMPT') {
            typeLabel = 'THEFT INCIDENT'
            body = html`<p class="text-white">Someone is trying to rob you!</p>`
        } else if (interaction.type === 'BUST_ATTEMPT') {
            typeLabel = 'POLICE INTERVENTION'
            body = html`<p class="text-white">Police are attempting a bust!</p>`
        }

        return html`
        <div class="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div class="chamfered-card has-red-bar max-w-md w-full shadow-2xl">
                <div class="chamfered-card-inner !p-10 text-center space-y-8">
                    <h3 class="text-xl font-heading font-black tracking-widest text-runner">${typeLabel}</h3>
                    <div class="border-y border-white/10 py-6">
                        ${body}
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        ${renderActionButton({
            label: 'ACCEPT',
            onClick: onAccept,
            variant: 'primary',
            className: 'w-full py-4'
        })}
                        ${renderActionButton({
            label: 'REJECT',
            onClick: onReject,
            variant: 'ghost',
            className: 'w-full py-4'
        })}
                    </div>
                </div>
            </div>
        </div>
    `
    }
