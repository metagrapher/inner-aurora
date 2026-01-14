
import { html, css } from 'lit'
import { commonStyles } from './Common'
import { getCity } from '../../lib/engine'

export const inTransitStyles = css`
  ${commonStyles}
  
  .transit-overlay {
    background: #020617;
    color: white;
    font-family: 'Outfit', sans-serif;
    padding: 4rem;
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-left: 6px solid var(--runner);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    position: relative;
    overflow: hidden;
    clip-path: polygon(30px 0, calc(100% - 30px) 0, 100% 30px, 100% calc(100% - 30px), calc(100% - 30px) 100%, 30px 100%, 0 calc(100% - 30px), 0 30px);
    box-shadow: 0 50px 150px rgba(0, 0, 0, 0.8);
  }

  .transit-icon {
    font-size: 5rem;
    margin-bottom: 2.5rem;
    filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.1));
  }

  .transit-title {
    font-family: 'Orbitron', sans-serif;
    font-size: 1.5rem;
    font-weight: 900;
    letter-spacing: 0.5em;
    margin-bottom: 2rem;
    color: white;
  }

  .progress-container {
    width: 100%;
    max-width: 400px;
    height: 4px;
    background: rgba(255, 255, 255, 0.05);
    margin: 2rem 0;
    position: relative;
    overflow: hidden;
  }

  .progress-bar {
    height: 100%;
    background: var(--runner);
    box-shadow: 0 0 15px var(--runner);
    transition: width 0.5s linear;
  }

  .progress-text {
    font-family: 'Orbitron', sans-serif;
    margin-top: 1rem;
    font-size: 0.8rem;
    font-weight: 800;
    letter-spacing: 0.2em;
    color: var(--runner);
  }

  .details {
    margin-top: 3rem;
    opacity: 0.3;
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.3em;
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  .scanline {
    width: 100%;
    height: 100px;
    z-index: 10;
    background: linear-gradient(0deg, rgba(0, 0, 0, 0) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(0, 0, 0, 0) 100%);
    opacity: 0.3;
    position: absolute;
    bottom: 100%;
    animation: scanline 8s linear infinite;
  }

  @keyframes scanline {
    0% { bottom: 100%; }
    100% { bottom: -100px; }
  }
`

export const renderInTransit = ({
  method,
  destination,
  progress,
  timeRemaining
}: {
  method: string,
  destination: string,
  progress: number,
  timeRemaining: string
}) => {
  const getIcon = () => {
    switch (method) {
      case 'PLANE': return '✈️'
      case 'TRAIN': return '🚆'
      case 'BUS': return '🚌'
      case 'CAR': return '🚗'
      case 'SUBWAY': return '🚇'
      case 'TAXI': return '🚕'
      case 'WALK': return '👟'
      default: return '📍'
    }
  }

  const targetCity = getCity(destination)
  const displayDestination = targetCity ? `${targetCity.name} - ${destination}` : destination

  return html`
    <div class="transit-overlay">
      <div class="scanline"></div>
      <div class="transit-icon">${getIcon()}</div>
      <div class="transit-title">EN ROUTE TO ${displayDestination.toUpperCase()}</div>
      <div class="progress-container">
        <div class="progress-bar" style="width: ${progress}%"></div>
      </div>
      <div class="progress-text">${Math.floor(progress)}% COMPLETE</div>
      <div class="details">REMAINING: ${timeRemaining}</div>
    </div>
  `
}
