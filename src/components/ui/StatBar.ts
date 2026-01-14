
import { html, css } from 'lit'
import { commonStyles, renderStatItem, renderBadge, renderActionButton } from './Common'
import { getCity, getAreaTerm, getGameTimeOfDay, getPlayerAgeInDays, getInventorySize, POCKET_LIMIT } from '../../lib/engine'

export const statBarStyles = css`
  ${commonStyles}
  .stat-bar {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 1.5rem;
    padding: 1.25rem 2.5rem;
    background: rgba(var(--bg-deep-rgb), 0.95);
    backdrop-filter: blur(20px);
    border-bottom: 2px solid var(--runner);
    position: sticky;
    top: 0;
    z-index: 1000;
    color: var(--text-bright);
  }
  .vitals-group {
    display: flex;
    gap: 0.75rem;
  }
  .main-stats {
    display: flex;
    gap: 2.5rem;
  }
  .clock-container {
    background: rgba(255, 255, 255, 0.1);
    padding: 1px;
    clip-path: polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px));
    position: relative;
    min-width: 200px;
  }
  .clock-box {
    padding: 0.5rem 1.5rem;
    background: rgba(var(--bg-deep-rgb), 0.9);
    font-family: 'Orbitron', sans-serif;
    clip-path: polygon(0 0, calc(100% - 14.5px) 0, 100% 14.5px, 100% 100%, 14.5px 100%, 0 calc(100% - 14.5px));
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .clock-box::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: var(--runner);
  }
`

export const renderStatBar =
  ({ persona
    , onGymMembership
    , theme
    , onToggleTheme
    , onReset
    , sunlight
  }: {
    persona: any
    , onGymMembership: () => void
    , theme: 'dark' | 'light'
    , onToggleTheme: () => void
    , onReset: () => void
    , sunlight?: any
  }
  ) => {
    if (!persona) return html``
    const stats = persona.gameData.drugwars
    const isCop = persona.role === 'Police'
    // Fallback for stat renaming
    const health = stats.health ?? 100
    const energy = stats.energy ?? 100
    const stamina = stats.stamina ?? stats.stamina ?? 100

    return html`
      <div class="stat-bar animate-flicker">
        <div class="main-stats">
            ${renderStatItem(
      {
        label: 'CAPITAL'
        , value: html`<span class="text-white font-black">$${stats.cash.toLocaleString()}</span>`
        , icon: '||'
      }
    )}
            
            ${isCop ? renderStatItem(
      {
        label: 'CLEANLINESS'
        , value: html`<span class="text-runner font-black">${100 - (stats.corruption || 0)}%</span>`
        , icon: '!!'
      }
    ) : renderStatItem(
      {
        label: 'RESERVE'
        , value: html`<span class="text-white font-black">$${stats.bank.toLocaleString()}</span>`
        , icon: '^^'
      }
    )}

            ${renderStatItem(
      {
        label: isCop ? 'RECOVERED' : 'STORAGE'
        , value: html`<span class="text-white/60">${getInventorySize(stats.inventory || {})}${isCop ? '' : ` / ${POCKET_LIMIT}`} UNITS</span>`
        , icon: '::'
      }
    )}
        </div>

        <div class="clock-container animate-pulse-slow">
          <div class="clock-box">
                ${(() => {
        const city = getCity(stats.location)
        const { hours, minutes } = getGameTimeOfDay(Date.now(), city?.timezone)
        const lifeDay = getPlayerAgeInDays(stats, Date.now())
        const ampm = hours >= 12 ? 'PM' : 'AM'
        const dispHour = hours % 12 || 12
        const dispMins = minutes.toString().padStart(2, '0')

        // Solar Indicator
        let isDay = hours >= 6 && hours < 18
        if (sunlight) {
          const [riseH, riseM] = sunlight.sunrise.split(':').map(Number)
          const [setH, setM] = sunlight.sunset.split(':').map(Number)
          const current = hours + (minutes / 60)
          isDay = current >= (riseH + riseM / 60) && current < (setH + setM / 60)
        }

        return html`
                    <div class="flex items-center gap-2 mb-0.5">
                      <div class="text-[9px] opacity-40 uppercase tracking-[0.3em]">LOCAL TIME</div>
                      <div class="text-[14px] ${isDay ? 'text-amber-400' : 'text-indigo-400'} animate-pulse">
                        ${isDay ? '☀' : '🌙'}
                      </div>
                    </div>
                    <div class="text-lg font-heading font-black text-white whitespace-nowrap text-crt">
                        DAY ${lifeDay} <span class="opacity-20">//</span> ${dispHour}:${dispMins} ${ampm}
                    </div>
                 `
      })()}
          </div>
        </div>

        <div class="vitals-group">
            ${renderBadge({ label: html`<span class="text-crt">HEALTH ${health}%</span>`, variant: health < 30 ? 'danger' : 'primary' })}
            ${renderBadge({ label: html`<span class="text-crt">STRENGTH ${energy}%</span>`, variant: energy < 30 ? 'warning' : 'primary' })}
            ${renderBadge({ label: html`<span class="text-crt">STAMINA ${stamina}%</span>`, variant: stamina < 30 ? 'warning' : 'primary' })}
        </div>

        <div class="flex gap-6 items-center">
            <div class="text-right">
                <div class="stat-label text-[10px] text-white/40 mb-1">${getAreaTerm(stats.cityId, persona.role)}</div>
                <div class="font-black text-sm text-white tracking-widest">${stats.location.toUpperCase()}</div>
            </div>
            <div class="w-px h-8 bg-white/10"></div>
            <div class="text-right">
                <div class="stat-label text-[10px] text-white/40 mb-1">CITY</div>
                <div class="font-black text-sm text-runner tracking-widest">${(getCity(stats.location)?.name || 'Unknown').toUpperCase()}</div>
            </div>
        </div>

        ${isCop && !stats.gymMembershipActive ? renderActionButton(
        {
          label: 'JOIN GYM'
          , onClick: onGymMembership
          , variant: 'warning'
          , className: 'text-xs'
        }
      ) : ''}

        ${renderActionButton(
        {
          label: theme === 'dark' ? 'LIGHT' : 'DARK'
          , onClick: onToggleTheme
          , variant: 'ghost'
          , className: 'text-[10px] opacity-50'
          , icon: theme === 'dark' ? '☀' : '🌙'
        }
      )}

        ${renderActionButton(
        {
          label: 'RESET'
          , onClick: onReset
          , variant: 'danger'
          , className: 'text-[10px] opacity-70 ml-2'
          , icon: '⟳'
        }
      )}
      </div>
    `
  }
