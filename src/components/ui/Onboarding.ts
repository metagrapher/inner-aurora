
import { html, css } from 'lit'
import { commonStyles, renderActionButton } from './Common'
import { CITIES, getLocationWealthFactor, calculateMonthlyRent } from '../../lib/engine'
import { transitBoardStyles, renderTransitBoard } from './TransitBoard'

export const onboardingStyles = css`
  ${commonStyles}
  ${transitBoardStyles}
  .onboarding-container {
    max-width: 1300px;
    margin: 2rem auto;
    padding: 1rem 2rem;
  }
  .role-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    margin: 2rem 0;
  }
  .role-icon {
    font-size: 4rem;
    filter: drop-shadow(0 0 20px var(--border-dim));
    display: block;
    margin-bottom: 1rem;
  }
  .wealth-tag {
    font-size: 8px;
    padding: 2px 4px;
    border: 1px solid var(--border-dim);
    border-radius: 2px;
    margin-top: 4px;
    display: inline-block;
  }
`

function renderRole({ role, label, icon, onSelect }: { role: string, label: string, icon: string, onSelect: (role: string) => void }) {
  const wealthFactor = getLocationWealthFactor(role)
  const monthlyRent = calculateMonthlyRent(role)
  return html`
<!-- ${role.toUpperCase()} -->
          <div class="chamfered-card has-red-bar">
            <div class="chamfered-card-inner !py-10 !px-8 flex flex-col h-full">
              <span class="role-icon">${icon}</span>
              <div class="flex flex-col gap-3 mt-4">
                <h3 class="text-crt text-lg">${label}</h3>
                <p class="text-[10px] opacity-50 uppercase font-black tracking-tighter leading-tight">BUY LOW. SELL HIGH.<br>STAY AHEAD OF THE HEAT.</p>
              </div>
              <div class="mt-auto w-full pt-8">
                ${renderActionButton(
                  { label: label
                  , onClick: () => onSelect(role)
                  , variant: 'primary'
                  , className: 'w-full py-4'
                  }
                )}
              </div>
            </div>
          </div>
  `
}

export const renderNewGame =
  ({ onSelectRole }: { onSelectRole: (role: string) => void }) => html`
    <div class="onboarding-container text-center">
      <h1 class="text-8xl font-black mb-6 font-heading text-white tracking-tighter text-crt">ADVANCED <span class="text-runner animate-pulse">DRUG</span> WARS</h1>
      <p class="mb-20 opacity-40 uppercase tracking-[0.5em] text-xs font-bold text-white shadow-terminal">INITIATE SESSION // SECURE URBAN ENVIRONMENTS</p>
      
      <div class="role-grid">
      ${[
        {role: "entrepreneur", label: "Entrepreneur", icon: "💼", onSelect: () => onSelectRole("Entrepreneur")},
        {role: "police", label: "Police", icon: "🚨", onSelect: () => onSelectRole("Police")},
        {role: "nimby", label: "NIMBY", icon: "🏙️", onSelect: () => onSelectRole("NIMBY")}].map(renderRole)
      }
      </div>
      
      <div class="mt-20 opacity-30 text-[10px] uppercase tracking-[0.3em] font-bold">
        AURORA-CLI // v0.98.4 // CLEAN RUN ENCRYPTED
      </div>
    </div>
  `

export const renderNameEntry =
  ({ onConfirm, onBack, role }: { onConfirm: (name: string) => void, onBack: () => void, role: string }) => {

    return html`
    <div class="onboarding-container text-center">
        <h1 class="text-4xl font-black mb-6 font-heading text-white tracking-tight">IDENTITY_REGISTRATION</h1>
        <p class="mb-12 opacity-40 uppercase tracking-[0.3em] text-[10px] font-bold text-white">
            ${role === 'Police' ? 'ENTER OFFICER SURNAME' : 'ESTABLISH ALIAS'}
        </p>
        
        <div class="max-w-md mx-auto mb-16 relative group">
            <div class="absolute -inset-1 bg-gradient-to-r from-[var(--runner)] to-[var(--neon-blue)] opacity-20 group-hover:opacity-40 transition-opacity duration-500 blur"></div>
            <input 
                type="text" 
                placeholder="${role === 'Police' ? 'OFFICER NAME' : 'ALIAS'}" 
                class="relative w-full bg-[var(--bg-deep)] border border-[var(--border-dim)] p-4 text-center text-2xl font-black text-white outline-none focus:border-[var(--runner)] transition-colors uppercase tracking-widest placeholder-white/10"
                @keydown="${(e: KeyboardEvent) => {
        const val = (e.target as HTMLInputElement).value
        if (e.key === 'Enter' && val.trim().length > 0) onConfirm(val)
      }}"
                autofocus
            />
            <div class="absolute right-4 top-1/2 -translate-y-1/2 opacity-30 text-[10px] pointer-events-none font-mono">
                [ENTER]
            </div>
        </div>

        <div class="flex flex-col gap-6 max-w-sm mx-auto">
            ${renderActionButton({
        label: 'CONFIRM IDENTITY'
        , onClick: (e: Event) => {
          // Robustly find the input relative to the button to support Shadow DOM
          const container = (e.target as Element).closest('.onboarding-container')
          const input = container?.querySelector('input') as HTMLInputElement
          if (input && input.value.trim().length > 0) {
            onConfirm(input.value)
          }
        }
        , variant: 'primary'
        , className: 'py-4'
      })}
        </div>

        ${renderActionButton({
        label: '[ ABORT ]',
        onClick: onBack,
        variant: 'ghost',
        className: 'mt-12 scale-90 opacity-40'
      })}
    </div>
  `
  }

export const renderAcademySelect =
  ({ onEnroll, onBack }: { onEnroll: (city: any) => void, onBack: () => void }) => html`
    <div class="onboarding-container text-center">
      <h1 class="text-4xl font-black mb-4 font-heading text-white tracking-tight">ENFORCEMENT ACADEMY</h1>
      <p class="mb-12 opacity-40 uppercase tracking-[0.3em] text-[10px] font-bold text-white">Select Active Jurisdiction Department</p>
      
      <div class="max-w-3xl mx-auto">
          ${renderTransitBoard({
    title: 'ACADEMY_ROSTER_V04'
    , columns: [
      { key: 'name', label: 'DEPARTMENT' }
      , { key: 'status', label: 'CLEARANCE' }
      , { key: 'enroll', label: 'ACTION', align: 'right' }
    ]
    , data: CITIES.map(city => ({
      id: city.id
      , name: city.name
      , status: 'OPEN'
      , enroll: renderActionButton({
        label: 'ASSIGN'
        , onClick: () => onEnroll(city)
        , variant: 'primary'
        , className: 'text-xs px-6 py-2'
      })
    }))
    , onRowClick: (row) => onEnroll(CITIES.find(c => c.id === row.id))
  })}
      </div>
      ${renderActionButton({
    label: '[ REVERSE_SEQUENCE ]',
    onClick: onBack,
    variant: 'ghost',
    className: 'mt-12 scale-90'
  })}
    </div>
  `

export const renderLocationConfirm =
  ({ city, onConfirm, onChange, onBack }: {
    city: any, onConfirm: () => void, onChange: () => void, onBack: () => void
  }) => html`
    <div class="onboarding-container text-center">
        <div class="border-y-2 border-white/5 py-16 mb-12">
            <p class="text-[10px] uppercase mb-6 opacity-30 font-bold tracking-widest text-white">initial coordinates verified</p>
            <h1 class="text-8xl font-black mb-10 text-white tracking-tighter text-crt">START IN ${city?.name?.toUpperCase() || 'UNKNOWN'}?</h1>
            <div class="flex flex-col gap-6 max-w-sm mx-auto">
                ${renderActionButton({
    label: 'INITIALIZE'
    , onClick: onConfirm
    , variant: 'primary'
    , className: 'py-5 text-xl'
  })}
                ${renderActionButton({
    label: 'CHANGE CITY',
    onClick: onChange,
    variant: 'ghost',
    className: 'scale-90 opacity-60'
  })}
            </div>
        </div>

        ${renderActionButton({
    label: '[ BACK ]',
    onClick: onBack,
    variant: 'ghost',
    className: 'scale-90 opacity-40'
  })}
    </div>
`

export const renderCitySelect =
  ({ onSelect, onBack }: { onSelect: (city: any) => void, onBack: () => void }) => html`
    <div class="onboarding-container text-center">
        <h1 class="text-4xl font-black mb-10 font-heading text-white tracking-tight">SELECT_LOCATION</h1>
        <div class="max-w-3xl mx-auto">
            ${renderTransitBoard({
    title: 'AVAIL_DISTRICTS_V09'
    , columns: [
      { key: 'name', label: 'CITY' }
      , { key: 'status', label: 'STATUS' }
      , { key: 'select', label: 'INITIATE', align: 'right' }
    ]
    , data: CITIES.map(city => ({
      id: city.id
      , name: city.name
      , status: 'STABLE'
      , select: renderActionButton({
        label: 'OPEN'
        , onClick: () => onSelect(city)
        , variant: 'primary'
        , className: 'text-xs px-6 py-2'
      })
    }))
    , onRowClick: (row) => onSelect(CITIES.find(c => c.id === row.id))
  })}
        </div>
        ${renderActionButton({
    label: '[ RETURN_PREVIOUS ]',
    onClick: onBack,
    variant: 'ghost',
    className: 'mt-12 scale-90'
  })}
    </div>
`

export const renderDistrictSelect =
  ({ city, role, onSelect, onBack }: {
    city: any, role: string, onSelect: (district: string) => void, onBack: () => void
  }) => {
    const isNimby = role === 'NIMBY'
    const title = isNimby ? 'DISTRICT_DOMINANCE' : 'ESTABLISH_OPERATIONS'
    const desc = isNimby ? `Define district jurisdiction perimeter` : `Secure terminal facilities in metropolitan center`

    const districts = city.districts
      .map((d: string) => ({ name: d, wealth: getLocationWealthFactor(d, city.id) }))
      // Filter to less wealthy districts for non-Police roles during onboarding
      .filter((d: any) => role === 'Police' || d.wealth < 1.0)
      .sort((a: any, b: any) => a.wealth - b.wealth)

    return html`
    <div class="onboarding-container text-center">
        <h1 class="text-4xl font-black mb-2 font-heading text-white tracking-tight">${title}</h1>
        <p class="opacity-40 mb-12 uppercase text-[10px] tracking-[0.3em] font-bold text-white">${desc}</p>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-16">
            ${districts.map((d: any) => {
      const rent = calculateMonthlyRent(d.name)
      return html`
                <div class="chamfered-card">
                  <div class="chamfered-card-inner !p-6 flex flex-col h-full">
                    <h3 class="text-crt text-lg mb-1">${d.name}</h3>
                    <div class="wealth-tag opacity-40 uppercase font-black mb-4">
                      Wealth Index: ${d.wealth.toFixed(1)}x
                    </div>
                    
                    <div class="flex-grow flex flex-col justify-center gap-2 mb-6">
                        <div class="text-[10px] opacity-30 uppercase font-bold tracking-widest">Initial Lease</div>
                        <div class="text-2xl font-black text-white text-crt">$${rent.toLocaleString()}<span class="text-[10px] opacity-40 ml-1">/MO</span></div>
                        <p class="text-[8px] opacity-20 uppercase">First month due in 30 days</p>
                    </div>

                    <div class="w-full mt-auto">
                        ${renderActionButton({
        label: isNimby ? 'SECURE' : 'LEASE'
        , onClick: () => onSelect(d.name)
        , variant: 'primary'
        , className: 'w-full py-4'
      })}
                    </div>
                  </div>
                </div>
            `})}
        </div>
        ${renderActionButton({
        label: '[ RETURN_TO_CITY ]',
        onClick: onBack,
        variant: 'ghost',
        className: 'scale-90'
      })}
    </div>
`
  }
