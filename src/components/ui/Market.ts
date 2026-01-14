
import { html, css } from 'lit'
import { commonStyles, renderActionButton, renderBadge, renderNimbyAction, renderListRow, renderGridItem } from './Common'
import { RESOURCES, calculateBulkPrice, getGameTime, NimbyAction, getAreaTerm, getActiveEvents, getCity, calculateMarketItem } from '../../lib/engine'

export const marketStyles = css`
  ${commonStyles}
  .market-item.disabled {
      opacity: 0.2;
      filter: grayscale(1);
      pointer-events: none;
  }
  .news-ticker {
    background: var(--border-bright);
    padding: 1px;
    margin-bottom: 1.5rem;
    position: relative;
    clip-path: polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px));
  }
  .news-ticker-inner {
    background: var(--runner);
    color: white;
    padding: 1rem 1.5rem;
    clip-path: polygon(
      -1px -1px, 
      calc(100% - 14.5px) -1px, calc(100% + 1px) 14.5px, 
      calc(100% + 1px) calc(100% + 1px), 
      14.5px calc(100% + 1px), -1px calc(100% - 14.5px)
    );
  }
  .news-ticker::before {
    content: '[ SYSTEM_ADVISORY ]';
    display: block;
    font-size: 10px;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 0.5rem;
    font-weight: 900;
    letter-spacing: 0.3em;
  }
  .network-node {
    width: 32px;
    height: 32px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.1s;
    background: rgba(255, 255, 255, 0.02);
  }
  .network-node:hover {
    border-color: var(--runner);
    background: rgba(239, 68, 68, 0.1);
  }
  input[type="number"] {
    background: var(--border-ghost);
    border: 1px solid var(--border-dim);
    color: white;
    font-family: 'Outfit', sans-serif;
    font-weight: bold;
    padding: 0.4rem;
    text-align: center;
    width: 70px;
    clip-path: polygon(5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%, 0 5px);
  }

  .market-items {
      max-width: 1200px;
      margin: 0 auto;
  }
`

export const renderMarket =
    ({ persona
        , peers
        , quantities
        , tradeVolumes
        , currentEncampment
        , onInteractPeer
        , onWellness
        , onPatrol
        , onNimbyAction
        , onReport
        , onUpdateQuantity
        , onBuy
        , onSell
        , onTravel
        , onGoHome
        , onEstablishBase
        , onEstablishEncampment
        , onBuyCar
        , onUse
        , viewMode = 'list'
        , onToggleViewMode
    }:
        {
            persona: any
            , peers: any[]
            , quantities: Record<string, number>
            , tradeVolumes: Record<string, number>
            , currentEncampment: any
            , onInteractPeer: (peer: any) => void
            , onWellness: (type: "GYM" | "FOOD") => void
            , onPatrol: () => void
            , onNimbyAction: (action: NimbyAction) => void
            , onReport: (quality: "VAGUE" | "GOOD") => void
            , onUpdateQuantity: (resId: string, val: number) => void
            , onBuy: (res: any, total: number, qty: number) => void
            , onSell: (res: any, total: number, qty: number) => void
            , onTravel: () => void
            , onGoHome: () => void
            , onEstablishBase: () => void
            , onEstablishEncampment?: () => void
            , onBuyCar?: () => void
            , onUse?: (resId: string) => void
            , viewMode?: 'list' | 'grid'
            , onToggleViewMode?: () => void
        }
    ) => {
        const onBuyCarSafe = onBuyCar || (() => console.warn('onBuyCar not implemented'))
        const onUseSafe = onUse || (() => console.warn('onUse not implemented'))
        const onToggleViewSafe = onToggleViewMode || (() => console.warn('onToggleViewMode not implemented'))

        const stats = persona.gameData.drugwars
        const isCop = persona.role === 'Police'
        const isEntrepreneur = persona.role === 'Entrepreneur'
        const currentBase = (stats.safehouses || []).find((sh: any) => sh.location === stats.location)
        const cityName = getCity(stats.location)?.name || 'Unknown'

        const gameTime = getGameTime()
        const activeEvents = getActiveEvents(gameTime.hours + (gameTime.days * 24), stats.cityId)

        const USABLE_ITEMS = ['coke', 'meth', 'pills', 'alcohol', 'lean']

        return html`
      <div>
        <!-- HEADER -->
        <div class="flex justify-between items-end mb-8 border-b-2 border-white/5 pb-6">
            <div>
                <div class="text-[10px] opacity-40 uppercase tracking-widest text-white font-bold mb-1">LOCAL_SECTOR // OPERATIONAL</div>
                <h2 class="text-4xl font-black text-white tracking-tight">
                    ${stats.location.toUpperCase()} <span class="text-runner">/</span> ${cityName.toUpperCase()}
                </h2>
            </div>
            <div class="text-right">
                <div class="text-[10px] opacity-40 uppercase mb-1 text-white/40 font-bold">PEER_SIGNALS</div>
                <div class="flex gap-2 justify-end">
                    ${peers.length > 0 ? peers.map((p: any) => {
            const isPartner = isCop && p.role === 'Police' && !(stats.blockedPartners || []).includes(p.id)
            const isBlocked = isCop && (stats.blockedPartners || []).includes(p.id)

            return html`
                            <div class="network-node ${isPartner ? 'border-runner bg-runner/5' : isBlocked ? 'border-white/10 bg-white/5' : 'border-white/5'}"
                                 @click="${() => isCop && onInteractPeer(p)}">
                                ${p.role === 'Police' ? 'CP' : p.role === 'NIMBY' ? 'NB' : 'PL'}
                            </div>
                        `
        }) : html`<span class="text-[10px] opacity-30 uppercase italic">scanning nodes...</span>`}
                </div>
            </div>
        </div>

        <!-- ALERTS -->
        ${persona.isInitialized && activeEvents.length > 0 ? html`
            <div class="news-ticker animate-flicker">
                <div class="news-ticker-inner">
                    ${activeEvents.map(event => html`
                        <div class="mb-2">
                            <span class="text-neon font-bold text-xs uppercase mr-2">[ ${event.title} ]</span>
                            <span class="text-xs text-white/70">${event.description}</span>
                        </div>
                    `)}
                </div>
            </div>
        ` : ''}

        <!-- WELLNESS (COP) -->
        ${isCop ? html`
        <div class="grid grid-cols-2 gap-4 mb-8">
            ${renderActionButton(
            {
                label: 'SUBSISTENCE: MEAL / $50'
                , onClick: () => onWellness('FOOD')
                , variant: 'primary'
            }
        )}
            ${renderActionButton(
            {
                label: 'TRAINING: SESSION / $200'
                , onClick: () => onWellness('GYM')
                , variant: 'info'
            }
        )}
        </div>
        ` : ''}

        <!-- NIMBY ACTIONS -->
        ${persona.role === 'NIMBY' ? html`
            <div class="mb-6 space-y-4">
                ${renderActionButton(
            {
                label: 'PATROL_:_SCAN_FOR_ENCAMPMENTS'
                , onClick: onPatrol
                , variant: 'info'
                , className: 'w-full py-4 text-xl'
            }
        )}
                ${currentEncampment ? html`
                    <div class="chamfered-card has-red-bar">
                      <div class="chamfered-card-inner !p-8 text-center space-y-4">
                        <h3 class="text-crt !text-runner font-black">! TARGET DETECTED !</h3>
                        <p class="text-xs opacity-60 uppercase">${currentEncampment.isOccupied ? 'Hostiles identified in perimeter.' : 'Anomaly detected. Clearing abandoned.'}</p>
                        <div class="grid grid-cols-2 gap-4">
                            ${currentEncampment.isOccupied ? html`
                                ${renderNimbyAction({ label: 'NEGOTIATE', action: NimbyAction.BARTER, onAction: onNimbyAction })}
                                ${renderNimbyAction({ label: 'CONFRONT', action: NimbyAction.ARGUE, onAction: onNimbyAction })}
                            ` : html`
                                ${renderNimbyAction({ label: 'PURGE', action: NimbyAction.SWEEP, onAction: onNimbyAction, type: 'sweep' })}
                            `}
                            ${renderActionButton({ label: 'LOG_GOOD', onClick: () => onReport('GOOD'), variant: 'primary', className: 'text-xs' })}
                            ${renderActionButton({ label: 'LOG_VAGUE', onClick: () => onReport('VAGUE'), variant: 'ghost', className: 'text-xs' })}
                        </div>
                      </div>
                    </div>
                ` : ''}
            </div>
          ` : ''}

        <!-- VIEW TOGGLE -->
        ${persona.isInitialized || isCop ? html`
            <div class="flex justify-end mb-4">
                ${renderActionButton({
            label: html`
                        <div class="flex items-center gap-2">
                            <span>${viewMode === 'list' ? 'SWITCH_TO_GRID' : 'SWITCH_TO_LIST'}</span>
                            <div class="w-2 h-2 bg-runner rounded-full ${viewMode === 'list' ? 'animate-pulse' : ''}"></div>
                        </div>
                    `,
            onClick: onToggleViewSafe,
            variant: 'ghost',
            className: 'text-[10px] scale-90'
        })}
            </div>
        ` : ''}

        <!-- MARKET ITEMS -->
        ${persona.isInitialized || isCop ? html`
          <div class="market-items ${viewMode === 'grid' ? 'ar-grid cols-4' : 'flex flex-col gap-2'}">
            ${[...RESOURCES].sort((a, b) => {
            const city = getCity(stats.location)
            const priorities = city?.availableResources ?? []
            const indexA = priorities.indexOf(a.id)
            const indexB = priorities.indexOf(b.id)

            // If both are in priorities, use priority order
            if (indexA !== -1 && indexB !== -1) return indexA - indexB
            // If only A is in priorities, it comes first
            if (indexA !== -1) return -1
            // If only B is in priorities, it comes first
            if (indexB !== -1) return 1
            // Otherwise keep existing order
            return 0
        }).map(res => {
            const vol = tradeVolumes[res.id] || 0
            const marketItem = calculateMarketItem(res, stats.location, gameTime, vol, stats.inventory)
            if (!marketItem.isVisible) return ''

            const qty = quantities[res.id] || 1
            const buyBulk = calculateBulkPrice(res, stats.location, gameTime, vol, qty, true)
            const sellBulk = calculateBulkPrice(res, stats.location, gameTime, vol, qty, false)

            const hasInInventory = (stats.inventory[res.id] || 0) > 0
            const canAffordQty = stats.cash >= buyBulk.total
            const isDisabled = !hasInInventory && stats.cash < marketItem.buyPrice && marketItem.isAvailableToBuy

            // CARD CONTENT (GRID MODE)
            if (viewMode === 'grid') {
                return renderGridItem({
                    disabled: isDisabled,
                    content: html`
                        <div class="flex justify-between items-start mb-2">
                            <div class="min-w-0">
                                <div class="flex flex-wrap items-center gap-2 mb-0.5">
                                    <span class="font-black text-sm text-white tracking-tighter truncate">${res.name.toUpperCase()}</span>
                                    ${USABLE_ITEMS.includes(res.id) && hasInInventory ? renderActionButton({
                        label: 'USE',
                        onClick: () => onUseSafe(res.id),
                        variant: 'primary',
                        className: 'scale-75 origin-left !px-2'
                    }) : ''}
                                </div>
                                <div class="text-[9px] uppercase font-bold text-white/30 whitespace-nowrap">
                                    ${marketItem.isAvailableToBuy ? html`BUY: <span class="text-white">$${marketItem.buyPrice}</span>` : ''}
                                    ${marketItem.isAvailableToBuy ? ' | ' : ''}SELL: <span class="text-white">$${marketItem.sellPrice}</span>
                                </div>
                            </div>
                            <div class="text-right shrink-0">
                                <div class="text-[8px] font-bold text-white/20 uppercase">OWN</div>
                                <div class="text-sm font-black text-runner">${stats.inventory[res.id] || 0}</div>
                            </div>
                        </div>

                        <div class="flex items-center gap-2 border-y border-white/5 py-2 mb-2">
                            <div class="flex items-center gap-1">
                                ${renderActionButton({ label: '-', onClick: () => onUpdateQuantity(res.id, Math.max(1, qty - 1)), variant: 'ghost', className: 'px-1.5 py-0.5 scale-90' })}
                                <input type="number" .value="${qty}" class="!w-[45px] !p-0.5 text-xs text-center" @input="${(e: any) => onUpdateQuantity(res.id, Math.max(1, parseInt(e.target.value) || 1))}">
                                ${renderActionButton({ label: '+', onClick: () => onUpdateQuantity(res.id, qty + 1), variant: 'ghost', className: 'px-1.5 py-0.5 scale-90' })}
                            </div>
                            <div class="flex-grow text-right truncate">
                                <div class="text-[8px] font-bold text-white/20 uppercase leading-none mb-0.5">EST.</div>
                                <div class="font-black text-white text-base leading-none">$${(marketItem.isAvailableToBuy ? buyBulk.total : sellBulk.total).toLocaleString()}</div>
                            </div>
                        </div>
                        
                        <div class="grid grid-cols-2 gap-1.5">
                            ${marketItem.isAvailableToBuy ? renderActionButton({
                        label: 'BUY',
                        onClick: () => onBuy(res, buyBulk.total, qty),
                        variant: 'primary',
                        className: 'text-[10px] py-1.5',
                        disabled: !canAffordQty
                    }) : html`<div class="text-[8px] h-[28px] flex items-center justify-center opacity-30 border border-white/10 uppercase">N/A</div>`}
                            
                            ${(stats.inventory[res.id] || 0) >= qty ? renderActionButton({
                        label: 'SELL',
                        onClick: () => onSell(res, sellBulk.total, qty),
                        variant: 'danger',
                        className: 'text-[10px] py-1.5'
                    }) : html`<div class="text-[8px] h-[28px] flex items-center justify-center opacity-30 border border-white/10 uppercase">NO STOCK</div>`}
                        </div>
                    `
                })
            }

            // LIST CONTENT (ROW MODE)
            return renderListRow({
                disabled: isDisabled,
                info: html`
                    <div class="flex items-center gap-2 shrink-0">
                        <span class="font-black text-sm text-white tracking-tighter truncate max-w-[100px]">${res.name.toUpperCase()}</span>
                        ${USABLE_ITEMS.includes(res.id) && hasInInventory ? renderActionButton({
                    label: 'USE',
                    onClick: () => onUseSafe(res.id),
                    variant: 'primary',
                    className: 'scale-75 origin-left !px-2'
                }) : ''}
                    </div>
                    
                    <div class="hidden sm:flex items-center gap-3 text-[9px] uppercase font-bold text-white/20 border-l border-white/5 pl-3">
                        <span>BUY: <span class="text-white/60">$${marketItem.buyPrice}</span></span>
                        <span>SELL: <span class="text-white/60">$${marketItem.sellPrice}</span></span>
                    </div>
                    
                    <div class="hidden md:block text-[9px] font-bold text-white/20 uppercase border-l border-white/5 pl-3">
                        OWN: <span class="text-runner text-sm ml-1">${stats.inventory[res.id] || 0}</span>
                    </div>
                `,
                controls: html`
                    <div class="flex items-center gap-0.5">
                        ${renderActionButton({ label: '-', onClick: () => onUpdateQuantity(res.id, Math.max(1, qty - 1)), variant: 'ghost', className: 'px-1 scale-75' })}
                        <input type="number" .value="${qty}" class="!w-[40px] !p-0.5 text-xs text-center" @input="${(e: any) => onUpdateQuantity(res.id, Math.max(1, parseInt(e.target.value) || 1))}">
                        ${renderActionButton({ label: '+', onClick: () => onUpdateQuantity(res.id, qty + 1), variant: 'ghost', className: 'px-1 scale-75' })}
                    </div>
                    <div class="text-right min-w-[65px] truncate">
                        <div class="font-black text-white text-sm">$${(marketItem.isAvailableToBuy ? buyBulk.total : sellBulk.total).toLocaleString()}</div>
                    </div>
                `,
                actions: html`
                    ${marketItem.isAvailableToBuy ? renderActionButton({
                    label: 'BUY',
                    onClick: () => onBuy(res, buyBulk.total, qty),
                    variant: 'primary',
                    className: 'text-[9px] px-3 py-1.5',
                    disabled: !canAffordQty
                }) : html`<div class="text-[8px] px-2 h-[24px] flex items-center justify-center opacity-20 border border-white/10 uppercase">N/A</div>`}
                    
                    ${(stats.inventory[res.id] || 0) >= qty ? renderActionButton({
                    label: 'SELL',
                    onClick: () => onSell(res, sellBulk.total, qty),
                    variant: 'danger',
                    className: 'text-[9px] px-3 py-1.5'
                }) : html`<div class="text-[8px] px-2 h-[24px] flex items-center justify-center opacity-20 border border-white/10 uppercase">NO_STOCK</div>`}
                `
            })
        })}
          </div>
        ` : html`
          <div class="chamfered-card opacity-50 mb-8">
            <div class="chamfered-card-inner !p-12 text-center">
              <div class="text-runner animate-pulse mb-4">
                <span class="text-2xl font-black">! CONNECTION_ERR !</span>
              </div>
              <p class="text-xs uppercase tracking-[0.3em] font-bold opacity-40">Scanning local networks... Secure a safehouse to access market data.</p>
            </div>
          </div>
        `}

        <!-- FOOTER ACTIONS -->
        <div class="grid grid-cols-2 gap-4 mt-8">
            ${renderActionButton(
            {
                label: `RELOCATE_TO: ${isCop ? 'NEW_BEAT' : 'NEXT_DISTRICT'}`
                , onClick: onTravel
                , variant: 'ghost'
                , className: 'py-4'
            }
        )}
            ${renderActionButton(
            {
                label: currentBase ? (currentBase.type === 'ENCAMPMENT' ? 'MANAGE_ENCAMPMENT' : 'ENTER_SAFEHOUSE') : 'ESTABLISH_SAFEHOUSE'
                , onClick: currentBase ? onGoHome : onEstablishBase
                , variant: 'info'
                , className: 'py-4'
            }
        )}
            ${!currentBase && isEntrepreneur ? renderActionButton(
            {
                label: 'SET_UP_ENCAMPMENT'
                , onClick: onEstablishEncampment || (() => { alert("this does nothing?") })
                , variant: 'warning'
                , className: 'py-4'
                , disabled: stats.cash < 0
            }
        ) : ''}
        </div>

        ${!isCop && persona.role === 'Entrepreneur' && !stats.hasCar ? html`
            <div class="mt-4">
                ${renderActionButton({
            label: 'ACQUIRE_TRANSPORT: $15,000'
            , onClick: onBuyCarSafe
            , variant: 'primary'
            , className: 'w-full py-4'
            , disabled: !stats.safehouses?.some((loc: string) => getCity(loc)?.id === stats.cityId)
        })}
            </div>
        ` : ''}
      </div>
    `
    }
