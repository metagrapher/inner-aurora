
import { html, css } from 'lit'
import { commonStyles, renderActionButton } from './Common'

export const chatBoxStyles = css`
    ${commonStyles}
    .chat-container {
        height: 300px;
        display: flex;
        flex-direction: column;
        background: rgba(0, 0, 0, 0.2);
        border: 1px solid var(--border-dim);
    }
    .chat-messages {
        flex-grow: 1;
        overflow-y: auto;
        padding: 0.75rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    .chat-message {
        font-size: 13px;
        line-height: 1.4;
    }
    .chat-sender {
        font-weight: 900;
        color: var(--runner);
        margin-right: 0.5rem;
        text-transform: uppercase;
    }
    .chat-input-area {
        display: flex;
        padding: 0.5rem;
        border-top: 1px solid var(--border-dim);
        gap: 0.5rem;
    }
    .chat-input {
        flex-grow: 1;
        background: transparent;
        border: none;
        color: white;
        font-family: inherit;
        outline: none;
    }
`

export const renderChatBox = ({
    messages,
    onSend
}: {
    messages: any[],
    onSend: (text: string) => void
}) => {
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
        <div class="chat-container">
            <div class="chat-messages" id="chat-messages">
                ${messages.map(msg => html`
                    <div class="chat-message">
                        <span class="chat-sender">${msg.senderName}:</span>
                        <span class="chat-text">${msg.text}</span>
                    </div>
                `)}
            </div>
            <div class="chat-input-area">
                <input 
                    type="text" 
                    class="chat-input" 
                    placeholder="Enter message..."
                    @keydown="${handleKeydown}"
                >
            </div>
        </div>
    `
}
