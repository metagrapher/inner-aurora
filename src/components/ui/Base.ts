import { html, css } from 'lit'
import { commonStyles, renderActionButton, renderStatItem } from './Common'
import { RESOURCES, RENT_INTERVAL_MS } from '../../lib/engine'
import type { Safehouse } from '../../lib/engine'

export const baseStyles = css`
  ${commonStyles}
  .base-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  @media (min-width: 640px) {
    .base-grid {
      grid-template-columns: 1fr 1fr;
    }
  }
  .stash-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .item-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.5rem;
    background: rgba(2, 6, 23, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.05);
    margin-bottom: 0.5rem;
  }
  .property-row {
    margin-bottom: 1rem;
    position: relative;
  }
  .past-due {
    border-color: #f43f5e;
    box-shadow: 0 0 10px rgba(244, 63, 94, 0.2);
  }
  .empty-msg {
    text-align: center;
    padding: 2rem;
    opacity: 0.4;
    font-style: italic;
    font-size: 0.8rem;
  }
`

export const renderBase =
    ({ persona
        , onStash
        , onSleep
        , onBack
        , onManageProperty
    }: {
        persona: any
        , onStash: (id: string, qty: number, toStash: boolean) => void
        , onSleep: () => void
        , onBack: () => void
        , onManageProperty?: (action: 'PAY_RENT' | 'LIST_RENT' | 'DELIST_RENT', shId: string) => void
    }
    ) => {
        const player = persona.gameData.drugwars
        const inventory = player.inventory || {}
        const stash = player.stash || {}
        const safehouses = (player.safehouses || []) as Safehouse[]

        const inventoryItems = Object.entries(inventory).map(([id, qty]) => {
            const res = RESOURCES.find(r => r.id === id)
            return { id, qty, name: res?.name || id }
        })

        const stashItems = Object.entries(stash).map(([id, qty]) => {
            const res = RESOURCES.find(r => r.id === id)
            return { id, qty, name: res?.name || id }
        })

        return html`
        <div class="animate-fade-in p-2">
            <div class="flex items-end justify-between mb-12 border-b-2 border-white/5 pb-8">
                <div>
                    <div class="text-[10px] opacity-40 uppercase tracking-[0.5em] font-bold text-white mb-2">OPERATIONAL_BASE // SECURE</div>
                    <h1 class="text-5xl font-black font-heading tracking-tight text-white uppercase text-crt">PERIMETER_LOG</h1>
                    <p class="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-2">LOCATION: ${player.location.toUpperCase()}</p>
                </div>
                <div class="text-right flex items-center gap-4">
                    ${renderActionButton({
            label: 'REST_RECON',
            variant: 'primary',
            onClick: onSleep,
            className: 'px-12 py-4'
        })}
                </div>
            </div>

            <div class="base-grid">
                <!-- INVENTORY -->
                <div class="chamfered-card has-red-bar">
                  <div class="chamfered-card-inner !p-8">
                    <div class="flex items-end justify-between mb-8 border-b border-white/5 pb-4">
                        <h3 class="font-black text-xs tracking-[0.3em] uppercase text-white text-crt">CARRIED_LOADOUT</h3>
                        <span class="text-[8px] opacity-30 uppercase font-bold tracking-widest">ON_PERSON</span>
                    </div>
                    <div class="stash-list">
                        ${inventoryItems.length === 0 ? html`<div class="empty-msg text-white/30">Inventory is empty.</div>` : inventoryItems.map(item => html`
                            <div class="item-row bg-white/5 border-white/5">
                                <div class="flex flex-col">
                                    <span class="font-bold text-sm text-white">${item.name}</span>
                                    <span class="text-[10px] opacity-40 text-white">Qty: ${item.qty}</span>
                                </div>
                                <div class="flex gap-2">
                                    ${renderActionButton({
            label: 'STASH_1',
            onClick: () => onStash(item.id, 1, true),
            className: 'scale-75 origin-right',
            variant: 'ghost'
        })}
                                    ${renderActionButton({
            label: 'TRANSFER_ALL',
            onClick: () => onStash(item.id, item.qty, true),
            className: 'scale-75 origin-right'
        })}
                                </div>
                            </div>
                        `)}
                    </div>
                  </div>
                </div>

                <!-- STASH -->
                <div class="chamfered-card has-red-bar">
                  <div class="chamfered-card-inner !p-8">
                    <div class="flex items-end justify-between mb-8 border-b border-white/5 pb-4">
                        <h3 class="font-black text-xs tracking-[0.3em] uppercase text-white text-crt">SECURE_STASH</h3>
                        <span class="text-[8px] opacity-30 uppercase font-bold tracking-widest">LOCKED_STORAGE</span>
                    </div>
                    <div class="stash-list">
                        ${stashItems.length === 0 ? html`<div class="empty-msg text-white/30">Stash is empty. Hide your goods here.</div>` : stashItems.map(item => html`
                            <div class="item-row bg-white/5 border-white/5">
                                <div class="flex flex-col">
                                    <span class="font-bold text-sm text-white">${item.name}</span>
                                    <span class="text-[10px] opacity-40 text-white">Qty: ${item.qty}</span>
                                </div>
                                <div class="flex gap-2">
                                    ${renderActionButton({
            label: 'EXTRACT_1',
            onClick: () => onStash(item.id, 1, false),
            className: 'scale-75 origin-right',
            variant: 'ghost'
        })}
                                    ${renderActionButton({
            label: 'EXTRACT_ALL',
            onClick: () => onStash(item.id, item.qty, false),
            className: 'scale-75 origin-right'
        })}
                                </div>
                            </div>
                        `)}
                    </div>
                  </div>
                </div>
            </div>

            <!-- PROPERTY MANAGEMENT -->
            <div class="mt-12">
                <div class="flex items-end justify-between mb-8 border-b-2 border-white/5 pb-4">
                    <h3 class="font-black text-xs tracking-[0.4em] uppercase text-white text-crt">REAL_ESTATE_ARCHIVE</h3>
                    <span class="text-[8px] opacity-30 uppercase font-bold tracking-widest">SECURED_NODES: ${safehouses.length}</span>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${safehouses.map(sh => {
            const isPastDue = sh.pastDueAt && (Date.now() - sh.pastDueAt > 0)
            const isOwner = sh.ownerId === player.id
            const timeLeft = sh.rentDueAt ? Math.ceil((sh.rentDueAt - Date.now()) / (60 * 1000)) : 0

            return html`
                            <div class="item-row property-row ${isPastDue ? 'past-due' : ''} bg-white/5 border-white/10">
                                <div class="flex flex-col">
                                    <span class="font-black text-runner uppercase text-xs leading-none mb-1">${sh.location}</span>
                                    <div class="flex items-center gap-2">
                                        <span class="text-[9px] font-bold ${isOwner ? 'text-green-500' : 'text-blue-500'} uppercase">
                                            ${isOwner ? 'OWNED' : 'LEASED'}
                                        </span>
                                        ${!isOwner ? html`
                                            <span class="text-[9px] opacity-40 font-bold uppercase">
                                                ${isPastDue ? 'PAST_DUE' : `DUE: ${timeLeft} CYCLES`}
                                            </span>
                                        ` : html`
                                            <span class="text-[9px] opacity-40 font-bold uppercase">
                                                ${sh.renterId ? (sh.renterId === 'system' ? 'RENTED_BY_SYSTEM' : 'RENTED_OUT') : 'VACANT'}
                                            </span>
                                        `}
                                    </div>
                                    <div class="text-[10px] font-black mt-2 text-white">
                                        $${sh.rentAmount.toLocaleString()}<span class="opacity-30">/MO</span>
                                    </div>
                                </div>
                                <div class="flex flex-col gap-2 scale-90 origin-right">
                                    ${!isOwner && isPastDue ? renderActionButton({
                label: 'PAY_ARREARS',
                onClick: () => onManageProperty?.('PAY_RENT', sh.id),
                variant: 'danger'
            }) : ''}
                                    ${isOwner ? renderActionButton({
                label: sh.isForRent ? 'DELIST' : 'LIST_FOR_RENT',
                onClick: () => onManageProperty?.(sh.isForRent ? 'DELIST_RENT' : 'LIST_RENT', sh.id),
                variant: sh.isForRent ? 'warning' : 'success'
            }) : ''}
                                </div>
                            </div>
                        `
        })}
                </div>
            </div>

            <div class="mt-12 chamfered-card">
              <div class="chamfered-card-inner !p-8">
                <h3 class="font-black text-xs uppercase tracking-[0.4em] mb-8 opacity-40 border-b border-white/5 pb-4 text-white">STREET_INTELLIGENCE // LIVE_FEED</h3>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-8">
                    ${renderStatItem({ label: 'HEAT_LEVEL', value: 'LOW_RES', className: 'text-white' })}
                    ${renderStatItem({ label: 'DISTRICT_SCAN', value: 'NOMINAL', className: 'text-white' })}
                    ${renderStatItem({ label: 'NETWORK_LOG', value: 'STABLE', className: 'text-white' })}
                    ${renderStatItem({ label: 'TAX_LIABILITY', value: 'NIL', className: 'text-white' })}
                </div>
              </div>
            </div>

            <div class="mt-12">
                ${renderActionButton({
            label: 'RETURN_TO_STREETS',
            onClick: onBack,
            className: 'w-full',
            variant: 'ghost'
        })}
            </div>
        </div>
    `
    }
