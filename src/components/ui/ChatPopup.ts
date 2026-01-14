
import { html, css } from 'lit'
import { commonStyles, renderActionButton } from './Common'

export const chatPopupStyles = css`
  ${commonStyles}

  .chat-popup-container {
    position: fixed;
    bottom: 0;
    right: 2rem;
    z-index: 1000;
    width: 360px;
    display: flex;
    flex-direction: column;
    filter: drop-shadow(0 -5px 20px rgba(0,0,0,0.5));
    transition: transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
  }

  .chat-popup-container.minimized {
    transform: translateY(calc(100% - 48px)); /* Show only header */
  }

  .chat-header {
    background: var(--bg-surface);
    border: 1px solid var(--border-dim);
    border-bottom: none;
    padding: 0.75rem 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    border-radius: 8px 8px 0 0;
    position: relative;
    /* Cyber glitch text effect possibility? Keep simple for now */
  }

  .chat-header::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: var(--runner);
    box-shadow: 0 0 10px var(--runner);
  }

  .chat-title {
    font-family: 'Outfit', sans-serif;
    font-weight: 800;
    text-transform: uppercase;
    font-size: 0.9rem;
    color: var(--text-bright);
    letter-spacing: 0.05em;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .chat-body-container {
    height: 400px;
    background: rgba(10, 10, 15, 0.95);
    backdrop-filter: blur(10px);
    border: 1px solid var(--border-dim);
    border-top: none;
    display: flex;
    flex-direction: column;
  }

  .chat-history {
    flex-grow: 1;
    overflow-y: auto;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .chat-bubble {
    max-width: 85%;
    padding: 0.5rem 0.75rem;
    border-radius: 4px;
    font-size: 0.9rem;
    line-height: 1.4;
    word-break: break-word;
    position: relative;
  }

  .chat-bubble.received {
    align-self: flex-start;
    background: rgba(255, 255, 255, 0.05);
    border-left: 2px solid var(--border-muted);
    color: var(--text-dim);
  }

  .chat-bubble.sent {
    align-self: flex-end;
    background: rgba(var(--runner-rgb), 0.1);
    border-right: 2px solid var(--runner);
    color: var(--text-bright);
    text-align: right;
  }

  .bubble-meta {
    font-size: 0.65rem;
    opacity: 0.5;
    margin-bottom: 2px;
    font-weight: 700;
    text-transform: uppercase;
  }

  .chat-input-row {
    padding: 0.75rem;
    border-top: 1px solid var(--border-dim);
    display: flex;
    gap: 0.5rem;
  }

  .chat-input {
    flex-grow: 1;
    background: rgba(0,0,0,0.3);
    border: 1px solid var(--border-dim);
    color: white;
    padding: 0.5rem;
    font-family: inherit;
    font-size: 0.9rem;
    outline: none;
    transition: border-color 0.2s;
  }
  .chat-input:focus {
    border-color: var(--runner);
  }

  .close-btn {
    font-size: 1.2rem;
    line-height: 1;
    color: var(--text-muted);
    background: none;
    border: none;
    cursor: pointer;
  }
  .close-btn:hover { color: var(--runner); }
`

export interface ChatMessage {
    id: string
    senderId: string
    senderName: string
    text: string
    timestamp: number
    isSelf: boolean
}

interface ChatPopupProps {
    isOpen: boolean
    isMinimized: boolean
    activePeerName?: string
    messages: ChatMessage[]
    onToggleMinimize: () => void
    onClose: () => void
    onSend: (text: string) => void
    onFocus?: () => void
}

export const renderChatPopup = ({
    isOpen,
    isMinimized,
    activePeerName,
    messages,
    onToggleMinimize,
    onClose,
    onSend,
    onFocus
}: ChatPopupProps) => {
    if (!isOpen) return html``

    const handleKeydown = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            const input = e.target as HTMLInputElement
            if (input.value.trim()) {
                onSend(input.value)
                input.value = ''
            }
        }
    }

    return html`
        <div class="chat-popup-container ${isMinimized ? 'minimized' : ''}" @click="${onFocus}">
            <div class="chat-header" @click="${onToggleMinimize}">
                <div class="chat-title">
                    <span class="text-runner">●</span>
                    ${activePeerName || 'MESSAGES'}
                </div>
                <div class="flex items-center gap-3">
                    <button class="close-btn" @click="${(e: Event) => { e.stopPropagation(); onToggleMinimize(); }}">
                        ${isMinimized ? '▲' : '▼'}
                    </button>
                    ${!isMinimized ? html`
                        <button class="close-btn" @click="${(e: Event) => { e.stopPropagation(); onClose(); }}">×</button>
                    ` : ''}
                </div>
            </div>
            
            <div class="chat-body-container">
                <div class="chat-history">
                    ${messages.length === 0 ? html`
                        <div class="text-center opacity-30 text-xs mt-10 uppercase tracking-widest">
                            No active signal...
                        </div>
                    ` : ''}
                    
                    ${messages.map(msg => html`
                        <div class="chat-bubble ${msg.isSelf ? 'sent' : 'received'}">
                            <div class="bubble-meta">${msg.isSelf ? 'YOU' : msg.senderName}</div>
                            ${msg.text}
                        </div>
                    `)}
                </div>
                
                <div class="chat-input-row">
                    <input 
                        type="text" 
                        class="chat-input" 
                        placeholder="Transmit message..."
                        @keydown="${handleKeydown}"
                    >
                </div>
            </div>
        </div>
    `
}
