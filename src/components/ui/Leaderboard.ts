import { html, css } from 'lit'
import { commonStyles, renderBadge } from './Common'

export const leaderboardStyles = css`
    ${commonStyles}
    .leaderboard-container {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }
    .leaderboard-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem 2rem;
        background: rgba(2, 6, 23, 0.95);
        border: 1px solid rgba(255, 255, 255, 0.05);
        margin-bottom: 0.5rem;
        position: relative;
    }
    .leaderboard-item:hover {
        border-color: var(--runner);
        background: #020617;
    }
    .rank-badge {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-weight: 900;
        margin-right: 1.5rem;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .rank-1 { background: var(--runner); color: white; border-color: var(--runner); box-shadow: 0 0 15px var(--runner); }
    .rank-2 { background: rgba(255,255,255,0.1); color: white; }
    .rank-3 { background: rgba(255,255,255,0.1); color: white; }
    .rank-other { background: transparent; color: rgba(255,255,255,0.3); }
`

export const renderLeaderboard = (entries: any[]) => {
    return html`
        <div class="animate-fade-in shadow-2xl">
            <div class="flex flex-col mb-12 border-b-2 border-white/5 pb-8">
                <h2 class="text-4xl font-black font-heading text-white tracking-[0.3em] uppercase text-crt">
                    GLOBAL_NETWORK_LOG
                </h2>
                <p class="text-[10px] font-bold text-white/30 uppercase tracking-[0.5em] mt-2">DECENTRALIZED_RANKINGS // PK-AUTH: ENABLED</p>
            </div>

            <div class="leaderboard-container">
                ${entries.length === 0 ? html`
                    <div class="glass p-8 text-center opacity-30 italic">
                        Scanning the network for players...
                    </div>
                ` : entries.map((entry, index) => {
        const rank = index + 1
        const rankClass = rank === 1 ? 'rank-1' : rank === 2 ? 'rank-2' : rank === 3 ? 'rank-3' : 'rank-other'

        return html`
                        <div class="chamfered-card group transition-colors animate-fade-in" style="animation-delay: ${index * 0.05}s">
                          <div class="chamfered-card-inner !p-6 flex justify-between items-center">
                            <div class="flex items-center">
                                <div class="rank-badge ${rankClass}">${rank}</div>
                                <div class="flex flex-col">
                                    <div class="flex items-center gap-4">
                                        <span class="font-black text-2xl text-white tracking-tighter uppercase text-crt">${entry.name}</span>
                                        ${entry.role === 'Police' ? renderBadge({ label: 'OFFICER', variant: 'indigo' }) : ''}
                                    </div>
                                    <span class="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">${entry.city || 'ENCRYPTED'} // ${entry.district || 'UNTRACKED'}</span>
                                </div>
                            </div>
                            <div class="text-right">
                                <div class="stat-label text-white/20 uppercase text-[10px] font-bold tracking-widest mb-1">TOTAL_VALUE</div>
                                <div class="font-black text-white text-3xl tracking-tighter">$${(entry.netWorth || 0).toLocaleString()}</div>
                            </div>
                          </div>
                        </div>
                    `
    })}
            </div>

            <div class="mt-12 p-6 bg-white/5 border border-white/10 text-[10px] text-white/30 uppercase tracking-[0.3em] text-center font-black">
                UPDATES_AUTOMATICALLY // SYNC_STATUS: ACTIVE
            </div>
        </div>
    `
}
