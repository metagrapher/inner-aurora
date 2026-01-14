
import { html, css } from 'lit'
import { commonStyles, renderActionButton } from './Common'

export const playerListStyles = css`
    ${commonStyles}
    .player-card {
        background: var(--bg-deep);
        border: 1px solid var(--border-dim);
        padding: 0.75rem;
        margin-bottom: 0.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
    }
    .player-info {
        display: flex;
        flex-direction: column;
    }
    .player-name {
        font-weight: 900;
        letter-spacing: -0.02em;
        text-transform: uppercase;
    }
    .player-role {
        font-size: 10px;
        opacity: 0.5;
        font-weight: bold;
    }
    .player-actions {
        display: flex;
        gap: 0.5rem;
    }
`

export const renderPlayerList = ({
    peers,
    myId,
    myRole,
    onInteract
}: {
    peers: any[],
    myId: string,
    myRole: string,
    onInteract: (peer: any, type: string) => void
}) => {
    return html`
        <div class="space-y-2">
            <div class="text-[10px] opacity-40 uppercase tracking-widest font-bold mb-2">LOCAL_INSTANCES // DETECTED</div>
            ${peers.length === 0 ? html`
                <div class="text-[10px] opacity-30 italic uppercase p-4 border border-dashed border-white/10 text-center">
                    No other signatures detected in sector...
                </div>
            ` : peers.map(peer => html`
                <div class="player-card">
                    <div class="player-info">
                        <span class="player-name">${peer.name}</span>
                        <span class="player-role">${peer.role}</span>
                    </div>
                    <div class="player-actions">
                        ${renderActionButton({
        label: 'CHAT',
        onClick: () => onInteract(peer, 'CHAT'),
        variant: 'ghost',
        className: 'text-[9px] px-2 py-1'
    })}
                        ${renderActionButton({
        label: 'TRADE',
        onClick: () => onInteract(peer, 'TRADE'),
        variant: 'info',
        className: 'text-[9px] px-2 py-1'
    })}
                        ${myRole === 'Police' ? renderActionButton({
        label: 'BUST',
        onClick: () => onInteract(peer, 'BUST'),
        variant: 'danger',
        className: 'text-[9px] px-2 py-1'
    }) : renderActionButton({
        label: 'ROB',
        onClick: () => onInteract(peer, 'ROB'),
        variant: 'danger',
        className: 'text-[9px] px-2 py-1'
    })}
                    </div>
                </div>
            `)}
        </div>
    `
}
