import { html, css } from 'lit'
import { commonStyles, renderActionButton, renderStatItem, renderGridItem } from './Common'
import { calculateMonthlyRent, calculatePurchasePrice, getLocationWealthFactor } from '../../lib/engine'
import type { Safehouse } from '../../lib/engine'

export const realEstateStyles = css`
  ${commonStyles}
  .property-card:hover {
    background: var(--runner);
  }
  .tag {
    font-size: 8px;
    padding: 2px 6px;
    border-radius: 2px;
    font-weight: black;
    letter-spacing: 0.1em;
  }
  .tag-rent { background: rgba(59, 130, 246, 0.2); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3); }
  .tag-own { background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); }
`

export const renderRealEstate =
    ({ player, location, onAction }: {
        player: any
        , location: string
        , onAction: (type: 'RENT' | 'BUY', location: string) => void
    }) => {
        const wealthFactor = getLocationWealthFactor(location)
        const rent = calculateMonthlyRent(location)
        const buy = calculatePurchasePrice(location)

        const existing = (player.safehouses || []).find((sh: Safehouse) => sh.location === location)
        const isBanned = (player.evictions || {})[location] > Date.now()

        if (existing) {
            return renderGridItem({
                className: 'has-red-bar !p-0',
                content: html`
                    <div class="!p-8">
                        <div class="flex justify-between items-start mb-6">
                            <div>
                                <h3 class="text-xl font-black text-white uppercase tracking-tight">${location}</h3>
                                <p class="text-[10px] opacity-40 font-bold uppercase tracking-widest">Active Safehouse</p>
                            </div>
                            <span class="tag ${existing.ownerId === player.id ? 'tag-own' : 'tag-rent'}">
                                ${existing.ownerId === player.id ? 'OWNED' : 'RENTED'}
                            </span>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            ${renderStatItem({ label: 'STATUS', value: 'SECURE' })}
                            ${renderStatItem({ label: 'VALUE', value: `$${(existing.ownerId === player.id ? buy : rent).toLocaleString()}` })}
                        </div>
                    </div>
                `
            })
        }

        if (isBanned) {
            const timeLeft = Math.ceil(((player.evictions[location] - Date.now()) / 60000)) // mins
            return renderGridItem({
                disabled: true,
                content: html`
                    <div class="!p-8">
                        <h3 class="text-xl font-black text-runner uppercase mb-2">ACCESS_DENIED</h3>
                        <p class="text-xs font-bold text-white mb-4 italic">Banned from leasing in ${location} due to recent eviction.</p>
                        <div class="text-[10px] font-black uppercase tracking-widest text-runner">
                            RE-ENTRY AUTHORIZED IN: ${timeLeft} CYCLES
                        </div>
                    </div>
                `
            })
        }

        return html`
            <div class="ar-grid cols-2 gap-8">
                <!-- LEASE OPTION -->
                ${renderGridItem({
            className: 'property-card',
            content: html`
                        <div class="!p-4 flex flex-col h-full">
                            <div class="mb-6">
                                <span class="tag tag-rent mb-2 inline-block">LEASE_PROTOCOL</span>
                                <h3 class="text-2xl font-black text-white uppercase">${location}</h3>
                                <p class="text-[10px] opacity-30 font-bold uppercase tracking-[0.2em]">Operational Access / Rental</p>
                            </div>
                            
                            <div class="flex-grow mb-8">
                                <div class="text-4xl font-black text-white">$${rent.toLocaleString()}<span class="text-xs opacity-40 ml-1">/MO</span></div>
                                <div class="text-[10px] opacity-40 font-bold uppercase mt-2">Required Cash on Hand to Initialize</div>
                            </div>

                            ${renderActionButton({
                label: 'INITIALIZE LEASE'
                , onClick: () => onAction('RENT', location)
                , variant: 'primary'
                , className: 'w-full py-4'
                , disabled: player.cash < rent
            })}
                        </div>
                    `
        })}

                <!-- PURCHASE OPTION -->
                ${renderGridItem({
            className: 'property-card',
            content: html`
                        <div class="!p-4 flex flex-col h-full">
                            <div class="mb-6">
                                <span class="tag tag-own mb-2 inline-block">ACQUISITION_TARGET</span>
                                <h3 class="text-2xl font-black text-white uppercase">${location}</h3>
                                <p class="text-[10px] opacity-30 font-bold uppercase tracking-[0.2em]">Buy Safehouse</p>
                            </div>
                            
                            <div class="flex-grow mb-8">
                                <div class="text-4xl font-black text-white">$${buy.toLocaleString()}</div>
                                <div class="text-[10px] opacity-40 font-bold uppercase mt-2">Permanent Safezone / Asset</div>
                            </div>

                            ${renderActionButton({
                label: 'ACQUIRE ASSET'
                , onClick: () => onAction('BUY', location)
                , variant: 'primary'
                , className: 'w-full py-4'
                , disabled: player.cash < buy
            })}
                        </div>
                    `
        })}
            </div>
        `
    }
