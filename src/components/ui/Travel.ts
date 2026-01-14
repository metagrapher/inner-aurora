import { html, css } from 'lit'
import { commonStyles } from './Common'
import { CITIES, TRAVEL_COSTS, CITY_DISTANCES, getCity, getAreaTerm, calculateTravelCost } from '../../lib/engine'
import { transitBoardStyles, renderTransitBoard } from './TransitBoard'

export const travelStyles = css`
  ${commonStyles}
  ${transitBoardStyles}
  
  .departure-header {
    display: none; /* Handled by TransitBoard now */
  }

  .split-flap-board-container {
    margin-top: 1rem;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
    border-radius: 12px;
    overflow: hidden;
  }

  .abort-btn {
    margin-top: 2rem;
    width: 100%;
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.4);
    padding: 1.25rem;
    font-family: 'Orbitron', sans-serif;
    font-size: 0.8rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.3em;
    cursor: pointer;
    transition: all 0.2s;
    clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
  }
  .abort-btn:hover {
    border-color: var(--runner);
    color: var(--runner);
    background: rgba(239, 68, 68, 0.05);
  }

  .terminal-tabs {
    display: flex;
    gap: 1px;
    margin-bottom: 2px;
    background: rgba(255, 255, 255, 0.05);
    padding: 1px;
  }
  
  .tab-btn {
    flex: 1;
    background: #020617;
    color: white;
    border: none;
    padding: 1rem;
    font-family: 'Orbitron', sans-serif;
    font-size: 0.75rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    cursor: pointer;
    transition: all 0.2s ease;
    opacity: 0.3;
  }
  
  .tab-btn.active {
    background: #0f172a;
    color: var(--runner);
    opacity: 1;
    text-shadow: 0 0 10px rgba(239, 68, 68, 0.3);
  }
`


export const renderTravel =
  ({ persona
    , selectedCity
    , onSelectCity
    , onTravelRequest
    , onBack
    , terminal = 'BUS'
    , onTerminalChange
    , mode = 'INTRA'
    , onModeChange
  }: {
    persona: any
    , selectedCity: any
    , onSelectCity: (city: any) => void
    , onTravelRequest: (loc: string, method?: string) => void
    , onBack: () => void
    , terminal?: string
    , onTerminalChange?: (t: string) => void
    , mode?: 'INTER' | 'INTRA'
    , onModeChange?: (m: 'INTER' | 'INTRA') => void
  }
  ) => {

    const currentCity = getCity(persona.gameData.drugwars.location)

    if (mode === 'INTER') {
      const getHeader = () => {
        if (terminal === 'PLANE') return 'FLIGHT DEPARTURES'
        if (terminal === 'TRAIN') return 'TRAIN SCHEDULE'
        return 'BUS DEPOT'
      }

      return html`
          <div>
            <div class="terminal-tabs">
              ${renderActionButton({ label: '✈️ PLANE', onClick: () => onTerminalChange?.('PLANE'), variant: terminal === 'PLANE' ? 'primary' : 'ghost', className: 'flex-1 !border-none' })}
              ${renderActionButton({ label: '🚆 TRAIN', onClick: () => onTerminalChange?.('TRAIN'), variant: terminal === 'TRAIN' ? 'primary' : 'ghost', className: 'flex-1 !border-none' })}
              ${renderActionButton({ label: '🚌 BUS', onClick: () => onTerminalChange?.('BUS'), variant: terminal === 'BUS' ? 'primary' : 'ghost', className: 'flex-1 !border-none' })}
            </div>

            <div class="split-flap-board-container">
              ${renderTransitBoard({
        title: getHeader()
        , columns: [
          { key: 'name', label: 'DESTINATION' }
          , { key: 'status', label: 'TIME', align: 'right' }
          , { key: 'fare', label: 'FARE', align: 'right', width: '120px' }
        ]
        , data: CITIES.map((city, idx) => {
          const currentCityId = persona.gameData?.drugwars?.cityId || 'nyc'
          const dist = CITY_DISTANCES[currentCityId][city.id] || 0
          let isHere = city.id === currentCityId
          let cost = 0
          let duration = 0

          if (!isHere) {
            const { financialCost, gameHours } = calculateTravelCost(
              currentCityId,
              city.id,
              terminal as any || 'BUS',
              persona.gameData?.drugwars || {},
              true
            )
            cost = financialCost
            duration = gameHours
          }

          const hours = Math.floor(duration)
          const mins = Math.floor((duration - hours) * 60)
          const timeStr = isHere ? 'NOW' : `${hours}h ${mins}m`

          return {
            id: city.id
            , name: city.name.toUpperCase()
            , status: html`<span class="text-yellow">${timeStr}</span>`
            , fare: isHere ? '--' : `$${cost}`
            , disabled: isHere
          }
        })
        , onRowClick: (row) => onTravelRequest(row.id, terminal)
      })}
            </div>
            
            ${renderActionButton({ label: 'SWITCH TO LOCAL TRANSIT', onClick: () => onModeChange?.('INTRA'), variant: 'warning', className: 'w-full py-4 mt-8' })}
            ${renderActionButton({ label: 'ABORT TRAVEL', onClick: onBack, variant: 'ghost', className: 'w-full py-4 mt-2' })}
          </div>
        `
    }

    // INTRA-CITY MODE
    const getIntraHeader = () => {
      if (terminal === 'SUBWAY') return 'SUBWAY TRANSIT'
      if (terminal === 'TAXI') return 'YELLOW CAB CO'
      if (terminal === 'WALK') return 'PEDESTRIAN'
      return 'LOCAL BUS'
    }

    return html`
      <div>
        <div class="terminal-tabs">
          ${renderActionButton({ label: 'Ⓢ SUBWAY', onClick: () => onTerminalChange?.('SUBWAY'), variant: terminal === 'SUBWAY' ? 'primary' : 'ghost', className: 'flex-1 !border-none' })}
          ${renderActionButton({ label: 'Ⓣ TAXI', onClick: () => onTerminalChange?.('TAXI'), variant: terminal === 'TAXI' ? 'primary' : 'ghost', className: 'flex-1 !border-none' })}
          ${renderActionButton({ label: 'Ⓦ WALK', onClick: () => onTerminalChange?.('WALK'), variant: terminal === 'WALK' ? 'primary' : 'ghost', className: 'flex-1 !border-none' })}
          ${renderActionButton({ label: 'Ⓑ BUS', onClick: () => onTerminalChange?.('BUS'), variant: terminal === 'BUS' ? 'primary' : 'ghost', className: 'flex-1 !border-none' })}
        </div>

        <div class="split-flap-board-container">
            ${renderTransitBoard({
      title: getIntraHeader()
      , columns: [
        { key: 'name', label: 'LOCATION' }
        , { key: 'status', label: 'EST. TIME', align: 'right' }
        , { key: 'fare', label: 'FARE', align: 'right', width: '120px' }
      ]
      , data: currentCity?.districts.map((loc: string) => {
        const isCurrent = persona.gameData.drugwars.location === loc

        let fare = 0
        let timeStr = '15m'

        if (!isCurrent) {
          const details = TRAVEL_COSTS.intra_ways[terminal as any || 'SUBWAY']
          fare = details.cost
          // Abstract intra-city time
          timeStr = terminal === 'WALK' ? '1h+' : (terminal === 'TAXI' ? '10m' : '20m')
        }

        return {
          id: loc
          , name: loc.toUpperCase()
          , status: html`<span class="text-yellow">${isCurrent ? 'HERE' : timeStr}</span>`
          , fare: isCurrent ? '--' : (fare === 0 ? 'FREE' : `$${fare}`)
          , disabled: isCurrent
        }
      })
      , onRowClick: (row) => onTravelRequest(row.id, terminal)
    })}
        </div>
        
        ${renderActionButton({ label: 'SWITCH TO LONG HAUL', onClick: () => onModeChange?.('INTER'), variant: 'warning', className: 'w-full py-4 mt-8' })}
        ${renderActionButton({ label: 'ABORT TRAVEL', onClick: onBack, variant: 'ghost', className: 'w-full py-4 mt-2' })}
      </div>
    `
  }
