
import { LitElement, html, css } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { createPersona, loadPersona, savePersona } from '../lib/persona'
import { CITIES, handleTravel, handleBust, handleSolicitBribe, handleWellness, handleFence, handleGymMembership, handleSleep, processActivityCompletion, interruptActivity, canChangeBeat, handleCopPatrol, handleNIMBYPatrol, handleNIMBYEncounter, handleCitizenReport, handleBetrayal, handleBuy, handleSell, handleEncounterOutcome, getCity, completeTravel, processTimePassage, handleBuyCar, handleEstablishSafehouse, handleEstablishEncampment, processInsurance, getGameTimeOfDay, handleUseItem, handleRealEstateAction, getClosestCity, handleStashTransition } from '../lib/engine'
import type { Safehouse } from '../lib/engine'
import { RENT_INTERVAL_MS } from '../lib/constants'

import { commonStyles } from './ui/Common'
import { renderStatBar, statBarStyles } from './ui/StatBar'
import { renderNewGame, renderNameEntry, renderAcademySelect, renderLocationConfirm, renderCitySelect, renderDistrictSelect, onboardingStyles } from './ui/Onboarding'
import { renderMarket, marketStyles } from './ui/Market'
import { renderTravel, travelStyles } from './ui/Travel'
import { renderEncounter, renderEncounterModal, encounterStyles } from './ui/Encounter'
import { renderPatrol, renderBlotter, blotterStyles } from './ui/Blotter'
import { renderBusyOverlay, renderLocker, renderInteractionModal, overlayStyles } from './ui/Overlays'
import { renderTravelMethodSelect } from './ui/TravelMethodSelect'
import { renderInTransit, inTransitStyles } from './ui/InTransit'
import { renderLeaderboard, leaderboardStyles } from './ui/Leaderboard'
import { renderRealEstate, realEstateStyles } from './ui/RealEstate'
import { renderPlayerList, playerListStyles } from './ui/PlayerList'
import { renderChatBox, chatBoxStyles } from './ui/ChatBox'
import { renderBase, baseStyles } from './ui/Base'
import { renderToast, toastStyles } from './ui/Toast'
import type { ToastMessage } from './ui/Toast'
import { renderChatPopup, chatPopupStyles } from './ui/ChatPopup'
import type { ChatMessage } from './ui/ChatPopup'
import { gunController } from '../lib/GunController'
import { interactionEngine } from '../lib/InteractionEngine'
import * as MP from '../lib/player/multiplayerActions'
import './ui/CyberBackground'

declare global {
  interface Window {
    id_godmode: () => void
  }
}

@customElement('game-ui')
export class GameUI extends LitElement {
  public geoData: any = null
  @state() private persona: any = null
  @state() private currentView: string = 'NewGame'
  @state() private mainTab: 'MARKET' | 'LEADERBOARD' = 'MARKET'
  @state() private selectedCity: any = null
  @state() private selectedRole: string | null = null

  @state() private enteredName: string = ''
  @state() private message: string = ''
  @state() private peers: any[] = []
  @state() private tradeVolumes: Record<string, number> = {}
  @state() private quantities: Record<string, number> = {}
  @state() private encounter: any = null
  @state() private busyMessage: string | null = null
  @state() private showLocker: boolean = false
  @state() private nimbyAlert: boolean = false
  @state() private blotterEvents: any[] = []
  @state() private leaderboard: any[] = []
  @state() private monitoredLocations: Set<string> = new Set()
  @state() private currentEncampment: any = null
  @state() private encampments: any[] = []
  @state() private theme: 'dark' | 'light' = 'dark'
  @state() private chatMessages: any[] = []
  @state() private incomingInteractions: any[] = []
  @state() private activeInteraction: any = null
  @state() private sunlight: any = null

  // Toast & Chat Popup State
  @state() private toasts: ToastMessage[] = []
  @state() private activeChatPeer: string | null = null
  @state() private chatPopupOpen: boolean = false
  @state() private chatPopupMinimized: boolean = false
  @state() private dmHistory: Record<string, ChatMessage[]> = {}

  // Travel State
  @state() private isTraveling: boolean = false
  @state() private travelStartTime: number = 0
  @state() private travelEndTime: number = 0
  @state() private travelRisk: number = 0
  @state() private travelDestination: string | null = null
  @state() private travelTerminal: string = 'BUS'
  @state() private travelMode: 'INTER' | 'INTRA' = 'INTRA'

  // Market View State
  @state() private marketViewMode: 'list' | 'grid' = 'list'

  get isOnboarding() {
    const onboardingViews = ['NewGame', 'NameEntry', 'AcademySelect', 'LocationConfirm', 'CitySelect', 'DistrictSelect']
    if (onboardingViews.includes(this.currentView)) return true

    if (this.persona && !this.persona.isInitialized) {
      return true
    }

    return false
  }

  static styles = [
    commonStyles
    , statBarStyles
    , onboardingStyles
    , marketStyles
    , travelStyles
    , encounterStyles
    , blotterStyles
    , overlayStyles
    , inTransitStyles
    , leaderboardStyles
    , baseStyles
    , realEstateStyles
    , playerListStyles
    , chatBoxStyles
    , toastStyles
    , chatPopupStyles
    , css`
      :host {
        display: block;
        min-height: 100vh;
        color: var(--text-bright);
        background: var(--bg-deep);
        overflow-x: hidden;
      }
      .main-container {
          width: 100%;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          position: relative;
          z-index: 1;
      }
      .tab-bar {
        display: flex;
        border-bottom: 2px solid var(--border-ghost);
        padding: 0 2rem;
        gap: 3rem;
        margin-bottom: 1rem;
        background: rgba(var(--bg-deep-rgb), 0.5);
      }
      .tab-btn.active::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 100%;
        height: 4px;
        background: var(--runner);
        box-shadow: 0 0 10px var(--runner);
      }
      .action-log {
          background: var(--bg-deep);
          border-left: 6px solid var(--runner);
          padding: 2rem 2.5rem;
          margin: 1.5rem 2rem;
          font-family: 'Outfit', sans-serif;
          color: var(--text-bright);
          font-size: 0.95rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.2);
          /* Solid connected chamfers */
          clip-path: polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px);
          border: 1px solid var(--border-ghost);
          border-left: 6px solid var(--runner);
      }
    `
  ]

  private _isResetting = false
  private _clockInterval: any
  private _konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a', 'Enter']
  private _konamiIndex = 0
  private _boundHandleKonami = (e: KeyboardEvent) => this._handleKonami(e)
  private _boundHandlePopState = (e: PopStateEvent) => {
    if (e.state?.view) {
      this._navigate(e.state.view, false)
      if (['Market', 'Leaderboard'].includes(e.state.view)) {
        this.mainTab = e.state.view.toUpperCase() as any
        localStorage.setItem('arca.de.mainTab', this.mainTab)
      }
    }
  }

  private _navigate(view: string, push: boolean = true) {
    console.log('[GameUI] _navigate to:', view, 'push:', push)
    this.currentView = view
    localStorage.setItem('arca.de.currentView', view)
    if (push) {
      window.history.pushState({ view }, '', `#${view}`)
    }
  }



  connectedCallback() {
    super.connectedCallback()
    window.addEventListener('keydown', this._boundHandleKonami)

    // Global Cheat Function
    window.id_godmode = () => this._activateCheat()

    this._initAppData()
  }

  async _initAppData() {
    this.persona = await loadPersona()

    // Restore UI State
    const savedView = localStorage.getItem('arca.de.currentView')
    const savedTab = localStorage.getItem('arca.de.mainTab') as 'MARKET' | 'LEADERBOARD'
    const savedMarketMode = localStorage.getItem('arca.de.marketViewMode') as 'list' | 'grid'

    if (savedView) this.currentView = savedView
    if (savedTab) this.mainTab = savedTab
    if (savedMarketMode) this.marketViewMode = savedMarketMode

    // Sync history state if empty
    if (!window.history.state) {
      window.history.replaceState({ view: this.currentView }, '', `#${this.currentView}`)
    }

    window.addEventListener('popstate', this._boundHandlePopState)

    // Load theme preference
    const savedTheme = localStorage.getItem('arca.de.theme') as 'dark' | 'light'
    if (savedTheme) {
      this.theme = savedTheme
      this.setAttribute('data-theme', savedTheme)
    }

    if (this.persona) {
        this._setupPersonaDependentServices()
    }
  }

  private _setupPersonaDependentServices() {
    if (!this.persona) return
    gunController.subscribeToLeaderboard((board) => {
      this.leaderboard = board
      this.requestUpdate()
    })
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    window.removeEventListener('keydown', this._boundHandleKonami)
    window.removeEventListener('popstate', this._boundHandlePopState)
    // @ts-ignore
    delete window.id_godmode
    if (this._clockInterval) clearInterval(this._clockInterval)
  }

  async updateSunlight() {
    if (!this.persona) return
    const stats = this.persona.gameData.drugwars
    const city = getCity(stats.location)
    if (!city) return

    try {
      const resp = await fetch(`/api/sunlight/${city.id}`)
      if (resp.ok) {
        this.sunlight = await resp.json()
        stats.sunlight = this.sunlight
        console.log('[Sunlight] Updated for', city.name, this.sunlight)
        savePersona(this.persona)
      }
    } catch (e) {
      console.error('[Sunlight] Fetch failed:', e)
    }
  }

  startClock() {
    if (this._clockInterval) clearInterval(this._clockInterval)
    this._clockInterval = setInterval(() => {
      // Shared Time Logic
      if (this.persona) {
        this.checkActivity()

        // Logic guards: Only run game progression if NOT onboarding
        if (!this.isOnboarding) {
          this.checkTimePassage()
          this.checkInsurance()
        }

        if (this.persona.gameData.drugwars.cheatsEnabled) {
          const stats = this.persona.gameData.drugwars
          stats.cash += 50
          stats.health = 100
          stats.stamina = 100
          stats.energy = 100
        }

        if (this.busyMessage && this.busyMessage !== 'Sleeping...' && !this.nimbyAlert) {
          if (Math.random() < 0.05) this.nimbyAlert = true
        }
      }

      this.requestUpdate()
    }, 1000)
  }

  checkActivity() {
    if (this.isTraveling) {
      if (Date.now() >= this.travelEndTime) {
        this.completeTravelSequence()
      }
    } else {
      if (!this.persona) return
      const stats = this.persona.gameData.drugwars
      if (stats.activityEnd && Date.now() >= stats.activityEnd) {
        processActivityCompletion(stats)
        this.busyMessage = null
        this.nimbyAlert = false
        savePersona(this.persona)
        // Refresh sync on completion (e.g. net worth update)
        gunController.syncPlayer(this.persona)
      }
    }
  }

  checkTimePassage() {
    if (!this.persona) return
    const stats = this.persona.gameData.drugwars

    const result = processTimePassage(stats, this.isTraveling)

    if (result.forceSleep) {
      this.message = "PASSED OUT FROM EXHAUSTION! (Force Sleep)"
      this.sleep(true)
      return
    }

    if (result.sleepingRough) {
      if (result.robbed) {
        this.message = "SLEEPING ROUGH: Robbed while you dozed off!"
      } else if (result.lowFunds) {
        // 10% chance to show message to avoid spam
        if (Math.random() < 0.1) this.message = result.message || "Sleeping Rough..."
      }
    }

    if (result.charged) {
      if (result.lowFunds) {
        this.message = result.robbed
          ? "SLEEPING ROUGH: Broke and on the streets. You were robbed in the night!"
          : "SLEEPING ROUGH: Can't afford a room. It was a cold, hard night."
      } else {
        this.message = `Stayed in a hotel. Paid $${result.cost} for ${result.days} night(s).`
      }
      savePersona(this.persona)
    }
  }

  checkInsurance() {
    if (!this.persona) return
    const result = processInsurance(this.persona.gameData.drugwars)
    if (result.charged) {
      if (result.message) this.message = result.message
      savePersona(this.persona)
    }
  }

  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark'
    this.setAttribute('data-theme', this.theme)
    localStorage.setItem('arca.de.theme', this.theme)
  }

  render() {
    if (!this.persona && !this.isOnboarding) {
      this.currentView = 'NewGame'
    }

    const onboardingViews = ['NewGame', 'NameEntry', 'AcademySelect', 'LocationConfirm', 'CitySelect', 'DistrictSelect']
    const isInteracting = this.encounter || this.isTraveling || (this.busyMessage && !this.isTraveling)
    const showHUD = !onboardingViews.includes(this.currentView)

    return html`
      <div class="main-container">
        ${showHUD ? renderStatBar(
      {
        persona: this.persona
        , onGymMembership: () => this.gymMembership()
        , theme: this.theme
        , onToggleTheme: () => this.toggleTheme()
        , onReset: () => this.resetGame()
        , sunlight: this.sunlight
      }
    ) : ''}

        <!-- ACTION CENTER -->
        <div class="action-center">
          ${this.message ? html`
            <div class="action-log animate-flicker">
              > ${this.message}
            </div>
          ` : ''}
          
          ${this.encounter ? renderEncounterModal(
      {
        encounter: this.encounter
        , onBust: () => this.bustAction()
        , onTakeBribe: (solo: boolean) => this.takeBribe(solo)
        , onBustPartner: () => this.bustPartner()
        , onIgnore: () => this.ignoreEncounter()
      }
    ) : ''}

          <!-- TOASTS -->
          <div class="toast-container">
            ${this.toasts.map(t => renderToast(t, (id) => this.removeToast(id)))}
          </div>
          
          <!-- CHAT POPUP -->
          ${renderChatPopup({
      isOpen: this.chatPopupOpen,
      isMinimized: this.chatPopupMinimized,
      activePeerName: this.peers.find(p => p.id === this.activeChatPeer)?.name || 'UNKNOWN',
      messages: this.activeChatPeer ? (this.dmHistory[this.activeChatPeer] || []) : [],
      onToggleMinimize: () => this.chatPopupMinimized = !this.chatPopupMinimized,
      onClose: () => this.chatPopupOpen = false,
      onSend: (text) => this.sendDirectMessage(text),
      onFocus: () => this.chatPopupMinimized = false
    })}

          ${this.isTraveling ? renderInTransit({
      method: this.travelTerminal,
      destination: this.travelDestination || "Unknown",
      progress: Math.min(100, Math.max(0, ((Date.now() - this.travelStartTime) / (this.travelEndTime - this.travelStartTime)) * 100)),
      timeRemaining: `${Math.ceil((this.travelEndTime - Date.now()) / 60000)}m`
    }) : ''}

          ${this.busyMessage && !this.isTraveling ? renderBusyOverlay(
      {
        persona: this.persona
        , busyMessage: this.busyMessage
        , nimbyAlert: this.nimbyAlert
        , onInterrupt: () => this.interrupt()
        , onRespondSweep: () => this.respondToSweep()
      }
    ) : ''}

          ${this.incomingInteractions.length > 0 ? renderInteractionModal({
      interaction: this.incomingInteractions[0],
      onAccept: () => this.handleInteraction(this.incomingInteractions[0], 'ACCEPTED'),
      onReject: () => this.handleInteraction(this.incomingInteractions[0], 'REJECTED')
    }) : ''}
        </div>
        
        <!-- MAIN GAME CONTENT -->
        <div class="flex-grow transition-all duration-300 ${isInteracting ? 'opacity-20 blur-sm brightness-50' : ''}">
          ${showHUD && this.persona && (this.currentView === 'Market' || this.currentView === 'Leaderboard') ? html`
            <div class="tab-bar">
                ${['Market', 'Leaderboard'].map(tab => html`
            <button 
              class="tab-btn px-6 py-2 text-[10px] font-bold tracking-[0.2em] transition-all relative
                     ${this.currentView === tab ? 'active text-white' : 'text-white/40 hover:text-white'}"
              @click="${() => {
        this.mainTab = tab.toUpperCase() as any;
        localStorage.setItem('arca.de.mainTab', this.mainTab);
        this._navigate(tab);
      }}">
              [ ${tab.toUpperCase()} ]
            </button>
          `)}
            </div>
          ` : ''}

          <div class="p-4">
            ${(this.currentView === 'Leaderboard' || this.mainTab === 'LEADERBOARD') ? renderLeaderboard(this.leaderboard) : this.renderCurrentView()}
          </div>
        </div>
      </div>
    `
  }

  renderCurrentView() {
    if (this.showLocker) return renderLocker(
      {
        persona: this.persona
        , onFence: (id: string) => this.fenceAction(id)
        , onBack: () => this.showLocker = false
      }
    )

    switch (this.currentView) {
      case 'NewGame': return renderNewGame(
        {
          onSelectRole: (role: string) => this.handleRoleSelect(role)
        }
      )

      case 'NameEntry': return renderNameEntry(
        {
          onConfirm: (name: string) => this.handleNameConfirm(name)
          , onBack: () => this._navigate('NewGame')
          , role: this.selectedRole || ''
        }
      )
      case 'AcademySelect': return renderAcademySelect(
        {
          onEnroll: (city: any) => {
            this.selectedCity = city
            this.completeAcademy(city)
          }
          , onBack: () => {
            this._navigate('NewGame')
          }
        }
      )
      case 'LocationConfirm': return renderLocationConfirm(
        {
          city: this.selectedCity
          , onConfirm: () => {
            if (this.selectedRole === 'Police') {
              this.startNewGame()
            } else {
              this._navigate('DistrictSelect')
            }
          }
          , onChange: () => {
            this._navigate('CitySelect')
          }
          , onBack: () => this._navigate('NewGame')
        }
      )
      case 'CitySelect': return renderCitySelect(
        {
          onSelect: (city: any) => {
            this.selectedCity = city
            if (this.selectedRole === 'Police') {
              this.startNewGame()
            } else {
              this._navigate('DistrictSelect')
            }
          }
          , onBack: () => {
            this._navigate('NewGame')
          }
        }
      )
      case 'DistrictSelect': return renderDistrictSelect(
        {
          city: this.selectedCity
          , role: this.selectedRole || 'Entrepreneur'
          , onSelect: (district: string) => {
            this.startNewGame(district)
          }
          , onBack: () => this._navigate(this.geoData ? 'LocationConfirm' : 'CitySelect')
        }
      )
      case 'TravelMethodSelect': return renderTravelMethodSelect({
        originCity: this.persona?.gameData?.drugwars?.cityId || 'nyc',
        targetCity: getCity(this.travelDestination || '')?.id || 'nyc',
        isNimby: this.persona.role === 'NIMBY',
        persona: this.persona,
        onSelect: (method) => this.startTravel(method),
        onBack: () => {
          this._navigate('Travel')
          this.travelDestination = null
        }
      })
      case 'Base': return renderBase(
        {
          persona: this.persona
          , onStash: (id, qty, toStash) => this.stashAction(id, qty, toStash)
          , onSleep: () => this.sleep()
          , onManageProperty: (action, shId) => this.handleManageProperty(action, shId)
          , onBack: () => this._navigate('Market')
        }
      )
      case 'Market': return html`
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2 space-y-8">
                ${this.persona?.role === 'Police'
          ? renderPatrol(
            {
              persona: this.persona
              , blotterEvents: this.blotterEvents
              , monitoredLocations: this.monitoredLocations
              , onAction: (action: string) => this.handleCopAction(action)
              , onToggleMonitor: (loc: string) => this.toggleMonitor(loc)
            }
          )
          : renderMarket(
            {
              persona: this.persona
              , peers: this.peers
              , quantities: this.quantities
              , tradeVolumes: this.tradeVolumes
              , currentEncampment: this.currentEncampment
              , onInteractPeer: (p: any, type: string) => this.interactWithPeer(p, type)
              , onWellness: (type: any) => this.wellness(type)
              , onPatrol: () => this.patrolForEncampment()
              , onNimbyAction: (act: any) => this.nimbyAction(act)
              , onReport: (q: any) => this.reportEncampment(q)
              , onUpdateQuantity: (id: string, val: number) => this.quantities = { ...this.quantities, [id]: val }
              , onBuy: (res: any, total: number, qty: number) => this.buy(res, total, qty)
              , onSell: (res: any, total: number, qty: number) => this.sell(res, total, qty)
              , onTravel: () => this._navigate('Travel')
              , onGoHome: () => this.goHome()
              , onEstablishBase: () => this._navigate('RealEstate')
              , onBuyCar: () => this.buyCar()
              , onEstablishEncampment: () => this.establishEncampment()
              , onUse: (resId: string) => this.useItem(resId)
              , viewMode: this.marketViewMode
              , onToggleViewMode: () => {
                this.marketViewMode = this.marketViewMode === 'list' ? 'grid' : 'list'
                localStorage.setItem('arca.de.marketViewMode', this.marketViewMode)
              }
            }
          )}
                
                ${renderChatBox({
            messages: this.chatMessages,
            onSend: (text) => this.sendChat(text)
          })}
            </div>
            <div>
                ${renderPlayerList({
            peers: this.peers,
            myId: this.persona.id,
            myRole: this.persona.role,
            onInteract: (p, type) => this.interactWithPeer(p, type)
          })}
            </div>
        </div>
      `
      case 'Travel': return renderTravel(
        {
          persona: this.persona
          , selectedCity: this.selectedCity
          , terminal: this.travelTerminal
          , onSelectCity: (city: any) => this.selectedCity = city
          , onTravelRequest: (loc: string, method?: string) => {
            if (method) this.travelTerminal = method
            this.handleTravelRequest(loc)
          }
          , onTerminalChange: (t: string) => this.travelTerminal = t
          , mode: this.travelMode
          , onModeChange: (m: 'INTER' | 'INTRA') => {
            this.travelMode = m
            // Default terminal based on mode
            this.travelTerminal = m === 'INTER' ? 'PLANE' : 'SUBWAY'
          }
          , onBack: () => this._navigate('Market')
        }
      )
      case 'RealEstate': return renderRealEstate(
        {
          player: this.persona.gameData.drugwars
          , location: this.persona.gameData.drugwars.location
          , onAction: (type, loc) => this.handleRealEstate(type, loc)
        }
      )
      case 'Encounter': return renderEncounter(
        {
          message: this.message
          , onResolve: (action: string) => this.resolveEncounter(action)
        }
      )
      default: return html`<div>Unknown View</div>`
    }
  }

  handleRoleSelect(role: string) {
    this.selectedRole = role
    this._navigate('NameEntry')
  }

  handleNameConfirm(name: string) {
    this.enteredName = name
    if (this.selectedRole === 'Police') {
      this._navigate('AcademySelect')
      return
    }

    // Geolocation Flow
    if (this.geoData && this.geoData.latitude && this.geoData.longitude) {
      this.selectedCity = getClosestCity(this.geoData.latitude, this.geoData.longitude)
      this._navigate('LocationConfirm')
    } else {
      // Fallback
      this._navigate('CitySelect')
    }
  }

  startNewGame(homeBase?: string) {
    const role = this.selectedRole || 'Entrepreneur'
    console.log('[GameUI] Starting new game with role:', role, 'and homeBase:', homeBase)
    try {
      this.persona = createPersona(
        "player_" + Math.random().toString(36).slice(2, 7)
        , this.enteredName || ((role === 'NIMBY' ? "Citizen_" : "Player_") + Math.random().toString(36).slice(2, 4))
        , role as any
        , this.selectedCity?.id
        // For Entrepreneur/NIMBY, we land in the district but don't establish the safehouse yet
        // to allow for the "Establish Safehouse" flow which reveals the HUD
        , undefined
      )

      this.persona.isInitialized = true

      // Explicitly set the location to the selected district if provided
      if (homeBase) {
        this.persona.gameData.drugwars.location = homeBase
      }

      savePersona(this.persona)
      const stats = this.persona.gameData.drugwars
      if (!stats.startTime) stats.startTime = Date.now()

      this._navigate('Market')
      this.setupGunSync()
      this.startClock()
      this.message = `Welcome to life. Congratulations. Your parental units have been decommissioned. $2,000 allowance provided. Secure a safehouse in ${this.selectedCity?.name} to improve stability. Note: Cake is mandatory but currently unavailable.`
    } catch (e) {
      console.error('[GameUI] Failed to start new game:', e)
      this.message = 'SYSTEM ERROR: Failed to initialize life. Please contact the administrator of your simulation.'
    }
  }

  completeAcademy(city: any) {
    const startingDistrict = city.districts[Math.floor(Math.random() * city.districts.length)]
    this.persona = createPersona(
      "player_" + Math.random().toString(36).slice(2, 7)
      , this.enteredName || ("Officer_" + Math.random().toString(36).slice(2, 4))
      , 'Police'
      , city.id
      , startingDistrict
    )
    this.persona.isInitialized = true
    savePersona(this.persona)
    const stats = this.persona.gameData.drugwars
    if (!stats.startTime) stats.startTime = Date.now()

    this._navigate('Market')
    this.setupGunSync()
    this.startClock()
    this.updateSunlight()
    this.message = `Welcome to the Force. Congratulations. :funfetti: <br/>
    You're assigned to ${startingDistrict}. <br/>
    Note: Fun is mandatory but currently unavailable.`
  }

  setupGunSync() {
    gunController.syncPlayer(this.persona)
    const loc = this.persona.gameData.drugwars.location

    // Publish Encampment if Entrepreneur has one here
    const currentBase = (this.persona.gameData.drugwars.safehouses || []).find((sh: any) => sh.location === loc && sh.type === 'ENCAMPMENT')
    if (currentBase) {
      gunController.syncEncampment(this.persona)
    }

    gunController.subscribeToPeers(loc, this.persona.id, (peers) => {
      this.peers = peers
      this.requestUpdate()
    })

    gunController.subscribeToEncampments(loc, (encs) => {
      this.encampments = encs
      this.requestUpdate()
    })

    gunController.subscribeToTradeVolume(loc, (vol, resourceId) => {
      const current = this.tradeVolumes[resourceId] || 0
      this.tradeVolumes = {
        ...this.tradeVolumes,
        [resourceId]: Math.min(20, current + (vol > 0 ? 1 : 0))
      }
      this.requestUpdate()
    })

    gunController.subscribeToChat(loc, (msg) => {
      this.chatMessages = [...this.chatMessages, msg].slice(-50)
      this.requestUpdate()
    })

    gunController.subscribeToInbox(this.persona.id, (interaction) => {
      // Handle CHAT interactions
      if (interaction.type === 'CHAT') {
        this.handleIncomingChat(interaction)
        return
      }

      const existing = this.incomingInteractions.find(i => i.id === interaction.id)
      if (!existing) {
        // Handle direct results (SUCCESS/FAILURE/ACCEPTED)
        if (interaction.type.endsWith('_SUCCESS') || interaction.type.endsWith('_FAILED') || interaction.type === 'TRADE_ACCEPTED') {
          let msg = ''
          if (interaction.type === 'TRADE_ACCEPTED') msg = interactionEngine.handleTradeResponse(this.persona, interaction)
          if (interaction.type.startsWith('ROB')) msg = interactionEngine.handleRobResponse(this.persona, interaction)
          if (interaction.type.startsWith('BUST')) msg = interactionEngine.handleBustResponse(this.persona, interaction)

          if (msg) {
            this.message = msg
            savePersona(this.persona)
          }
          return
        }

        this.incomingInteractions = [...this.incomingInteractions, interaction]

        // Notification for Interaction
        this.addToast({
          title: 'New Interaction',
          message: `Interaction from ${interaction.fromName}`,
          type: 'warning',
          onClick: () => {
            // Focus?
          }
        })
        this.message = `NEW INTERACTION: From ${interaction.fromName}`
      }
      this.requestUpdate()
    })
  }

  // --- HELPER METHODS FOR TOASTS/CHAT ---

  addToast(toast: Omit<ToastMessage, 'id'>) {
    const id = Math.random().toString(36).slice(2, 9)
    this.toasts = [...this.toasts, { ...toast, id }]
    // Auto dismiss after duration (default 5000ms, 0 means infinite)
    const duration = toast.duration !== undefined ? toast.duration : 5000
    if (duration > 0) {
      setTimeout(() => this.removeToast(id), duration)
    }
  }

  removeToast(id: string) {
    this.toasts = this.toasts.filter(t => t.id !== id)
  }

  handleIncomingChat(interaction: any) {
    const { fromId, fromName, text, timestamp } = interaction.payload
    const msg: ChatMessage = {
      id: interaction.id,
      senderId: fromId,
      senderName: fromName,
      text,
      timestamp: timestamp || Date.now(),
      isSelf: false
    }

    const history = this.dmHistory[fromId] || []
    this.dmHistory = {
      ...this.dmHistory,
      [fromId]: [...history, msg]
    }

    // Market Check
    if (this.currentView === 'Market') {
      if (!this.chatPopupOpen) {
        this.chatPopupOpen = true
        this.activeChatPeer = fromId
        this.chatPopupMinimized = false
      } else {
        if (this.activeChatPeer !== fromId) {
          this.addToast({
            title: `Message from ${fromName}`,
            message: text,
            type: 'chat',
            onClick: () => {
              this.activeChatPeer = fromId
              this.chatPopupOpen = true
              this.chatPopupMinimized = false
            }
          })
        }
      }
    } else {
      // Not in Market: Show Toast
      this.addToast({
        title: `Message from ${fromName}`,
        message: text,
        type: 'chat',
        onClick: () => {
          this.activeChatPeer = fromId
          this.chatPopupOpen = true
          this.chatPopupMinimized = false
        }
      })
    }
  }

  sendDirectMessage(text: string) {
    if (!this.activeChatPeer || !this.persona) return

    interactionEngine.sendDirectMessage(this.persona, this.activeChatPeer, text)

    const msg: ChatMessage = {
      id: Math.random().toString(),
      senderId: this.persona.id,
      senderName: 'ME',
      text,
      timestamp: Date.now(),
      isSelf: true
    }

    const history = this.dmHistory[this.activeChatPeer] || []
    this.dmHistory = {
      ...this.dmHistory,
      [this.activeChatPeer]: [...history, msg]
    }
    this.requestUpdate()
  }

  sendChat(text: string) {
    if (!this.persona) return
    gunController.sendChatMessage(this.persona.gameData.drugwars.location, {
      senderId: this.persona.id,
      senderName: this.persona.displayName,
      text
    })
  }

  interactWithPeer(peer: any, type?: string) {
    if (this.persona.role === 'Police' && peer.role === 'Police') {
      const stats = this.persona.gameData.drugwars
      if ((stats.blockedPartners || []).includes(peer.id)) {
        this.message = `Refusing to work with ${peer.name}.`
        return
      }
      if (!type) {
        this.message = `Coordinating with Partner ${peer.name}.`
        return
      }
    }

    if (type === 'CHAT') {
      this.activeChatPeer = peer.id
      this.chatPopupOpen = true
      this.chatPopupMinimized = false
      this.message = `Chat opened with ${peer.name}`
    } else if (type === 'TRADE') {
      const resId = Object.keys(this.persona.gameData.drugwars.inventory)[0] || 'weed'
      interactionEngine.sendTradeOffer(this.persona, peer.id, resId, 5, 200)
      this.message = `Trade offer sent to ${peer.name}`
    } else if (type === 'ROB') {
      interactionEngine.sendRobAttempt(this.persona, peer.id)
      this.message = `Robbery attempt initiated on ${peer.name}`
    } else if (type === 'BUST') {
      interactionEngine.sendBustAttempt(this.persona, peer.id)
      this.message = `Bust attempt initiated on ${peer.name}`
    }
  }

  handleInteraction(interaction: any, status: 'ACCEPTED' | 'REJECTED') {
    gunController.updateInteractionStatus(this.persona.id, interaction.id, status)
    this.incomingInteractions = this.incomingInteractions.filter(i => i.id !== interaction.id)

    if (status === 'ACCEPTED') {
      let result: MP.InteractionResult = { success: false, message: 'Unknown interaction' }

      if (interaction.type === 'TRADE_OFFER') {
        result = MP.handleIncomingTrade(this.persona, interaction)
      } else if (interaction.type === 'ROB_ATTEMPT') {
        result = MP.handleIncomingRob(this.persona, interaction)
      } else if (interaction.type === 'BUST_ATTEMPT') {
        result = MP.handleIncomingBust(this.persona, interaction)
      }

      this.message = result.message
      if (result.success) {
        savePersona(this.persona)
      }
    } else {
      this.message = `Declined interaction from ${interaction.fromName}.`
    }
  }

  handleTravelRequest(loc: string) {
    const stats = this.persona.gameData.drugwars
    const isInterCity = CITIES.some(c => c.id === loc)

    if (isInterCity && this.persona.role === 'Police') {
      this.message = "JURISDICTION ERROR: Cops cannot leave their assigned city."
      return
    }

    this.travelDestination = loc
    this._navigate('TravelMethodSelect')
  }

  startTravel(method: any) {
    if (!this.travelDestination) return

    const isIntraCity = this.travelMode === 'INTRA'
    const options = isIntraCity
      ? { isIntraCity: true, targetDistrict: this.travelDestination }
      : { isIntraCity: false, targetCityId: this.travelDestination }

    const result = handleTravel(this.persona.gameData.drugwars, method, options)
    if (result.error || !result.travelData) {
      this.message = result.message || result.error || "Travel initialization failed."
      return
    }

    // Travel Started successfully
    this._navigate('Market')
    this.isTraveling = true
    this.travelStartTime = Date.now()
    this.travelRisk = result.travelData.risk
    this.travelEndTime = Date.now() + result.travelData.durationRealMs
    this.travelTerminal = method
    this.message = result.travelData.message
    savePersona(this.persona)
  }

  completeTravelSequence() {
    const stats = this.persona.gameData.drugwars
    const isLongHaul = this.travelMode === 'INTER'

    const result = completeTravel(stats)

    this.isTraveling = false
    this.travelStartTime = 0
    this.travelEndTime = 0
    this.travelDestination = null
    this.travelRisk = 0

    this.message = result.message || "Arrived."

    gunController.leaveLocation(stats.location, this.persona.id)
    this.peers = []
    this.tradeVolumes = {}

    this.setupGunSync()
    savePersona(this.persona)

    // After Long Haul, automatically open the Transit board for the new city
    if (isLongHaul) {
      this._navigate('Travel')
      this.travelMode = 'INTRA'
      this.travelTerminal = 'SUBWAY'
    }

    // Update sun schedule for the new city
    this.updateSunlight()
  }


  resolveEncounter(action: string) {
    const result = handleEncounterOutcome(this.persona, action)
    this.message = result.message
    if (result.died) {
      localStorage.removeItem("arca.de.persona")
      window.location.reload()
    } else {
      savePersona(this.persona)
      setTimeout(() => {
        this._navigate('Market')
        this.message = ''
      }, 1500)
    }
  }

  resetGame() {
    if (this._isResetting) return
    this._isResetting = true
    
    try {
      if (confirm("THIS WILL WIPE ALL PROGRESS AND START A NEW LIFE. ARE YOU SURE?")) {
        localStorage.removeItem("arca.de.persona")
        localStorage.removeItem("arca.de.currentView")
        localStorage.removeItem("arca.de.mainTab")
        localStorage.removeItem("arca.de.marketViewMode")
        window.location.reload()
      }
    } finally {
      this._isResetting = false
    }
  }

  buy(res: any, totalCost: number, quantity: number) {
    const result = handleBuy(this.persona, res.id, quantity, totalCost)
    if (result.success) {
      this.message = `Acquired ${quantity} ${res.name}.`
      gunController.recordTrade(this.persona.gameData.drugwars.location, res.id, quantity)
      savePersona(this.persona)
    } else {
      this.message = result.error || "Purchase failed."
    }
  }

  sell(res: any, totalValue: number, quantity: number) {
    const result = handleSell(this.persona, res.id, quantity, totalValue)
    if (result.success) {
      this.message = `Liquidated ${quantity} ${res.name}.`
      gunController.recordTrade(this.persona.gameData.drugwars.location, res.id, quantity)
      savePersona(this.persona)
    } else {
      this.message = result.error || "Sale failed."
    }
  }

  handleCopAction(action: string) {
    if (action === 'PATROL') {
      const stats = this.persona.gameData.drugwars
      const nearbyCops = this.peers.filter((p: any) => p.role === 'Police' && p.id !== this.persona.id && !(stats.blockedPartners || []).includes(p.id))

      const encounter = handleCopPatrol(stats)
      if (!encounter || encounter.error) {
        this.message = encounter?.error || "Patrol failed."
        return
      }
      if (encounter.type === 'NOTHING_SIGNIFICANT') {
        this.message = encounter.message
        return
      }

      this.encounter = { ...encounter, partners: nearbyCops, activeBetrayal: false }
    } else if (action === 'EAT') {
      this.wellness('FOOD')
    } else if (action === 'GYM') {
      this.wellness('GYM')
    } else if (action === 'STASH') {
      this._navigate('Base')
    }
  }

  sleep(forced: boolean = false) {
    const result = handleSleep(this.persona.gameData.drugwars, forced)
    savePersona(this.persona)
    this.busyMessage = forced ? 'Passed out...' : 'Sleeping...'
    this.requestUpdate()
  }

  useItem(resId: string) {
    const result = handleUseItem(this.persona.gameData.drugwars, resId)
    this.message = result.message
    if (result.success) {
      savePersona(this.persona)
      // If stimulant was used, maybe UI visual effect?
    }
  }

  bustAction() {
    if (!this.encounter) return
    const result = handleBust(
      this.persona.gameData.drugwars
      , this.encounter.resource?.id || 'disorderly_conduct'
      , this.encounter.quantity || 1
      , this.encounter.partners.length
      , undefined // target
      , this.encounter.opponent
    )

    if (result.error === 'TOO_TIRED') {
      this.message = "TOO EXHAUSTED! You need at least 25 Stamina to bust."
      // We do NOT clear the encounter so they have to choose "Move Along" or wait (if we had waiting logic)
      // But for now, they must likely Move Along.
      return
    }

    if (result.fought) {
      if (!result.success) {
        this.message = `BUST FAILED! Suspect fought back. You took ${result.damage} damage!`
      } else {
        this.message = `BUSTED (FORCE)! Suspect subdued. You took ${result.damage} damage.`
      }
    } else {
      this.message = `BUSTED! Confiscated ${this.encounter.quantity} ${this.encounter.resource.name}.`
    }

    this.encounter = null
    savePersona(this.persona)
  }

  takeBribe(solo: boolean = false) {
    if (!this.encounter) return
    const stats = this.persona.gameData.drugwars
    const partners = this.encounter.partners || []
    if (!solo || partners.length === 0) {
      handleSolicitBribe(stats, this.encounter.quantity / 5, partners.length, !solo)
      this.message = solo ? "Took it all." : "Shared it."
      this.encounter = null
    } else {
      if (Math.random() > 0.5) {
        this.encounter.activeBetrayal = true
        this.encounter.betrayingPartner = partners[0]
        this.message = `PARTNER SEES YOU! ${partners[0].name} is coming!`
      } else {
        handleSolicitBribe(stats, this.encounter.quantity / 5, partners.length, false)
        this.message = "Got away with it."
        this.encounter = null
      }
    }
    savePersona(this.persona)
  }

  bustPartner() {
    if (!this.encounter?.activeBetrayal) return
    handleBetrayal(this.persona.gameData.drugwars, this.encounter.betrayingPartner.id, this.encounter.quantity * 150)
    this.message = "BETRAYAL! Terminated partnership."
    this.encounter = null
    savePersona(this.persona)
  }

  ignoreEncounter() { this.encounter = null }

  gymMembership() {
    const result = handleGymMembership(this.persona.gameData.drugwars)
    this.message = result.message
    if (result.success) savePersona(this.persona)
  }

  wellness(type: "GYM" | "FOOD") {
    const result = handleWellness(this.persona.gameData.drugwars, type)
    this.message = result.message
    if (result.success) {
      this.busyMessage = type === 'GYM' ? 'Training...' : 'Eating...'
      savePersona(this.persona)
    }
  }

  respondToSweep() {
    this.nimbyAlert = false
    this.interrupt()
    this.message = "Evaded the sweep!"
  }

  interrupt() {
    interruptActivity(this.persona.gameData.drugwars)
    this.busyMessage = null
    this.nimbyAlert = false
    savePersona(this.persona)
  }

  fenceAction(resId: string) {
    const result = handleFence(this.persona.gameData.drugwars, resId)
    this.message = result.message
    if (result.success) savePersona(this.persona)
  }

  patrolForEncampment() {
    const result = handleNIMBYPatrol(this.persona, this.peers, this.encampments)
    if (result.error) {
      this.message = result.error
      return
    }

    this.message = "Searching for suspicious activity..."
    this.busyMessage = "Patrolling..."

    // We'll set the result after the activity completes, or for now, just set it
    // In a more complex version, we'd wait for the timer.
    this.currentEncampment = result.targets[0] || null
    this.message = this.currentEncampment ? "TARGET LOCATED!" : "Nothing unusual found."

    savePersona(this.persona)
  }

  nimbyAction(action: any) {
    const result = handleNIMBYEncounter(this.persona, this.currentEncampment, action)
    this.message = result.message
    if (result.success !== false) {
      if (action === 'SWEEP' && result.loot) {
        Object.entries(result.loot).forEach(([id, qty]) => {
          this.persona.gameData.drugwars.inventory[id] = (this.persona.gameData.drugwars.inventory[id] || 0) + (qty as number)
        })
      }
      this.busyMessage = action === 'SWEEP' ? 'Sweeping...' : 'Interacting...'
      savePersona(this.persona)
    }
  }

  reportEncampment(quality: "VAGUE" | "GOOD") {
    const result = handleCitizenReport(this.persona, this.currentEncampment?.location || this.persona.gameData.drugwars.location, "ENCAMPMENT", quality)
    this.message = result.message
    if (result.success) {
      gunController.syncBlotterEvent(result.event)
      this.currentEncampment = null
      savePersona(this.persona)
      this.requestUpdate()
    }
  }

  toggleMonitor(loc: string) {
    if (this.monitoredLocations.has(loc)) this.monitoredLocations.delete(loc)
    else this.monitoredLocations.add(loc)
    this.requestUpdate()
  }

  stashAction(id: string, qty: number, toStash: boolean) {
    const result = handleStashTransition(this.persona.gameData.drugwars, id, qty, toStash)
    if (result.success) {
      this.message = toStash ? `Stashed ${qty} items.` : `Withdrew ${qty} items.`
      savePersona(this.persona)
    } else {
      this.message = "Error: Insufficient quantity."
    }
  }

  goHome() {
    const stats = this.persona.gameData.drugwars
    const home = stats.safehouses?.[0] // For now, go to the first/primary safehouse
    if (!home) {
      this.message = "No safehouse established! Set one up first."
      return
    }

    if ((stats.safehouses || []).some((sh: Safehouse) => sh.location === stats.location)) {
      this._navigate('Base')
    } else {
      // Trigger travel to the primary safehouse
      this.handleTravelRequest(home.location)
    }
  }

  establishBase() {
    const result = handleEstablishSafehouse(this.persona.gameData.drugwars)
    if (result.error) {
      this.message = result.message || result.error
      return
    }

    const stats = this.persona.gameData.drugwars
    // Reset survival timers for a fresh start
    stats.lastSleepTime = Date.now()
    stats.lastHotelPayment = Date.now()

    savePersona(this.persona)
    this.requestUpdate()
  }

  handleRealEstate(type: 'RENT' | 'BUY', location: string) {
    const result = handleRealEstateAction(this.persona.gameData.drugwars, location, type)
    if (result.error) {
      this.message = result.message || result.error
      return
    }

    const stats = this.persona.gameData.drugwars
    // If it's the first safehouse, reset survival timers
    if (stats.safehouses.length === 1) {
      stats.lastSleepTime = Date.now()
      stats.lastHotelPayment = Date.now()
    }

    this.message = result.message || "Property transaction successful."
    savePersona(this.persona)
    this._navigate('Market')
    this.requestUpdate()
  }

  establishEncampment() {
    const result = handleEstablishEncampment(this.persona)
    this.message = result.message
    if (result.success) {
      savePersona(this.persona)
      gunController.syncEncampment(this.persona)
      this.requestUpdate()
    }
  }

  handleManageProperty(action: 'PAY_RENT' | 'LIST_RENT' | 'DELIST_RENT', shId: string) {
    const stats = this.persona.gameData.drugwars
    const sh = (stats.safehouses || []).find((s: Safehouse) => s.id === shId)
    if (!sh) return

    if (action === 'PAY_RENT') {
      const cost = sh.rentAmount
      if (stats.bank >= cost) {
        stats.bank -= cost
        sh.pastDueAt = undefined
        sh.rentDueAt = Date.now() + RENT_INTERVAL_MS
        this.message = "Rent paid in full (Bank)."
      } else if (stats.cash >= cost) {
        stats.cash -= cost
        sh.pastDueAt = undefined
        sh.rentDueAt = Date.now() + RENT_INTERVAL_MS
        this.message = "Rent paid in full (Cash)."
      } else {
        this.message = "ERROR: Insufficient funds to pay rent."
      }
    } else if (action === 'LIST_RENT') {
      sh.isForRent = true
      this.message = "Property listed for rent. Collections will automate."
    } else if (action === 'DELIST_RENT') {
      sh.isForRent = false
      this.message = "Property removed from rental market."
    }

    savePersona(this.persona)
    this.requestUpdate()
  }

  buyCar() {
    const result = handleBuyCar(this.persona.gameData.drugwars)
    if (result.error) {
      this.message = result.message || result.error
      return
    }
    this.message = "Congratulations on your new ride! You can now travel by car."
    savePersona(this.persona)
    this.requestUpdate()
  }

  private _handleKonami(e: KeyboardEvent) {
    if (e.key === this._konamiSequence[this._konamiIndex]) {
      this._konamiIndex++
      if (this._konamiIndex === this._konamiSequence.length) {
        this._konamiIndex = 0
        this._activateCheat()
      }
    } else {
      this._konamiIndex = 0
    }
  }

  private _activateCheat() {
    if (!this.persona) return

    const stats = this.persona.gameData.drugwars
    if (stats.cheatsEnabled) {
      // Re-entering code = Restart
      localStorage.removeItem("arca.de.persona")
      window.location.reload()
    } else {
      stats.cheatsEnabled = true
      stats.cash = 999999999
      stats.health = 100
      stats.stamina = 100
      stats.energy = 100
      this.message = "KONAMI CODE ACTIVATED: GOD MODE ENABLED"
      savePersona(this.persona)
      this.requestUpdate()
    }
  }
}
