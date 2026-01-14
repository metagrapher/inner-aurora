
import { html, css } from 'lit'
import { renderActionButton, commonStyles } from './Common'
import { TRAVEL_COSTS, type TravelMethod, type IntraCityMethod, CITY_DISTANCES, calculateTravelCost } from '../../lib/engine'

export const travelMethodSelectStyles = css`
  .board-header {
    font-family: 'VT323', monospace;
    font-size: 2rem;
    color: #ffb700;
    text-shadow: 0 0 5px rgba(255, 183, 0, 0.5);
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 1rem;
    border-bottom: 2px solid #333;
    padding-bottom: 0.5rem;
  }

  .options-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .road-sign-btn {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0;
    background: transparent;
    border: none;
    cursor: pointer;
    transition: transform 0.1s;
    width: 100%;
  }
  .road-sign-btn:hover {
    transform: scale(1.02);
  }

  /* Highway Sign Style for Bus/Car */
  .sign-body {
    background: #016a38; /* Interstate Green */
    border: 3px solid #fff;
    border-radius: 8px;
    padding: 1rem;
    color: white;
    font-family: 'Inter', sans-serif; /* Highway Gothic alterntive */
    font-weight: 700;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    box-shadow: 0 4px 6px rgba(0,0,0,0.5);
    position: relative;
    height: 80px;
    justify-content: center;
  }
  
  .sign-interstate {
    background: #1a3c8a; /* Interstate Blue */
    position: relative;
  }
  /* Shield decoration for interstate */
  .shield-icon {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 2rem;
    opacity: 0.8;
  }

  .sign-transit {
    background: #333;
    border-color: #fbbf24;
    color: #fbbf24;
  }

  .sign-title {
    font-size: 1.5rem;
    line-height: 1;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .sign-sub {
    font-size: 0.7rem;
    opacity: 0.8;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-top: 4px;
  }

  /* Toll Display */
  .toll-display {
    background: #111;
    border: 4px solid #444;
    border-radius: 4px;
    padding: 0.5rem 1rem;
    margin-left: 1rem;
    font-family: 'VT323', monospace;
    color: #ff3333; /* LED Red */
    font-size: 1.8rem;
    min-width: 100px;
    text-align: right;
    box-shadow: inset 0 0 10px rgba(0,0,0,0.8);
    display: flex;
    flex-direction: column;
    justify-content: center;
    line-height: 0.9;
  }
  .toll-label {
    font-size: 0.6rem;
    color: #666;
    text-align: center;
    margin-bottom: -5px;
    font-family: sans-serif;
  }
  .led-text { text-shadow: 0 0 5px #ff3333; }
  .led-free { color: #33ff33; text-shadow: 0 0 5px #33ff33; }
`

export const renderTravelMethodSelect = ({
  originCity,
  targetCity,
  onSelect,
  onBack,
  isNimby,
  persona
}: {
  originCity: string,
  targetCity: string,
  onSelect: (method: TravelMethod | IntraCityMethod) => void,
  onBack: () => void,
  isNimby: boolean,
  persona: any
}) => {
  const isInterCity = originCity !== targetCity
  const distance = isInterCity ? (CITY_DISTANCES[originCity]?.[targetCity] || 1000) : 5
  const stats = (persona.gameData || persona.stats || {}).drugwars || {}
  const cityObj = CITIES.find(c => c.id === (isInterCity ? originCity : stats.cityId))

  let options: any[] = []

  if (isInterCity) {
    options = (['BUS', 'CAR', 'TRAIN', 'PLANE'] as TravelMethod[])
      .filter(method => {
        if (method === 'CAR') {
          if (!stats.hasCar) return false
          // Must be at the car's location
          return stats.carLocation === stats.location
        }
        return true
      })
      .map(method => {
        const details = TRAVEL_COSTS.ways[method]
        const { financialCost, gameHours } = calculateTravelCost(
          persona,
          method,
          { isIntraCity: false, targetCityId: targetCity }
        )

        const hours = Math.floor(gameHours)
        const mins = Math.floor((gameHours - hours) * 60)
        const durationStr = `${hours}h ${mins > 0 ? mins + 'm' : ''}`.trim()

        // Use average speed for display if not calculated explicitly
        // Or calculate effective speed: dist / hours
        const effectiveSpeed = gameHours > 0 ? Math.floor(distance / gameHours) : details.speed

        return {
          method,
          name: details.name,
          cost: financialCost,
          duration: `${durationStr}`,
          sub: method === 'PLANE' ? 'Direct Flight' : `${effectiveSpeed} MPH`,
          style: method === 'CAR' ? 'sign-interstate' : 'sign-body',
          icon: method === 'CAR' ? '🛡️' : (method === 'BUS' ? '🚌' : (method === 'TRAIN' ? '🚆' : '✈️'))
        }
      })
  } else {
    options = (['SUBWAY', 'TAXI', 'BUS', 'WALK', 'CAR'] as IntraCityMethod[]).filter(m => {
      if (m === 'CAR') {
        if (!stats.hasCar) return false
        return stats.carLocation === stats.location
      }
      if (m === 'SUBWAY' && cityObj) {
        // originCity is string cityId in this context? No, wait. 
        // In GameUI: originCity: this.persona?.gameData?.drugwars?.cityId
        // targetCity: getCity(this.travelDestination || '')?.id
        // For intra-city, originCity === targetCity (both are cityId)
        // We need the districts.
        const originDistrict = stats.location
        const targetDistrict = targetCity // targetCity here is the destination district/hub
        return cityObj.railConnectivity[originDistrict] && cityObj.railConnectivity[targetDistrict]
      }
      return true
    }).map(method => {
      const { financialCost, gameHours } = calculateTravelCost(
        persona,
        method,
        { isIntraCity: true, targetDistrict: targetCity }
      )

      const details = TRAVEL_COSTS.intra_ways[method] || TRAVEL_COSTS.intra_ways.SUBWAY
      const mins = Math.round(gameHours * 60)

      return {
        method,
        name: details.name,
        cost: financialCost,
        duration: `${mins}m`,
        sub: method === 'WALK' ? '-25 ENERGY' : (method === 'CAR' ? 'Private Vehicle' : 'Transit Authority'),
        style: 'sign-transit',
        icon: method === 'WALK' ? '🚶' : (method === 'TAXI' ? '🚕' : (method === 'BUS' ? '🚌' : (method === 'CAR' ? '🏎️' : '🚇')))
      }
    })
  }

  return html`
        <div class="flex flex-col gap-4">
            <div class="board-header">
                ${isInterCity ? 'DEPARTURES' : 'LOCAL TRANSIT'} > ${targetCity.toUpperCase()}
            </div>
            
            <div class="options-grid">
                ${options.map(opt => html`
                    <button class="road-sign-btn" @click="${() => onSelect(opt.method)}">
                        <div class="sign-body ${opt.style}">
                            <div class="sign-title">
                                <span>${opt.icon}</span> ${opt.name}
                            </div>
                            <div class="sign-sub">${opt.sub} • ${opt.duration}</div>
                            ${opt.style === 'sign-interstate' ? html`<div class="shield-icon">I-95</div>` : ''}
                        </div>
                        <div class="toll-display">
                            <div class="toll-label">TOLL</div>
                            <span class="led-text ${opt.cost === 0 ? 'led-free' : ''}">
                                ${opt.cost === 0 ? 'FREE' : `$${opt.cost}`}
                            </span>
                        </div>
                    </button>
                `)}
            </div>

            <div class="mt-8">
                ${renderActionButton({ label: 'ABORT TRAVEL', onClick: onBack, variant: 'ghost', className: 'w-full py-4' })}
            </div>
        </div>
    `
}
