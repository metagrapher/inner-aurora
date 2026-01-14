
import { html, css } from 'lit'
import { commonStyles } from './Common'

export const toastStyles = css`
  ${commonStyles}
  
  .toast-container {
      position: fixed;
      top: 2rem;
      right: 2rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      pointer-events: none;
  }

  .toast {
      pointer-events: auto;
      width: 320px;
      /* Glassmorphism cyber style */
      background: rgba(10, 10, 15, 0.9);
      backdrop-filter: blur(10px);
      border: 1px solid var(--border-ghost);
      border-left: 4px solid var(--text-muted);
      
      /* Clipped corner */
      clip-path: polygon(
          0 0,
          100% 0,
          100% calc(100% - 15px),
          calc(100% - 15px) 100%,
          0 100%
      );

      padding: 1rem;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      
      transform: translateX(100%);
      transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
      opacity: 0;
      
      display: flex;
      gap: 1rem;
      align-items: flex-start;
  }

  .toast.visible {
      transform: translateX(0);
      opacity: 1;
  }

  /* Variants */
  .toast.type-info { border-left-color: var(--text-highlight); }
  .toast.type-success { border-left-color: #10b981; }
  .toast.type-warning { border-left-color: #f59e0b; }
  .toast.type-error { border-left-color: #ef4444; }
  .toast.type-chat { border-left-color: var(--runner); }

  .toast-icon {
      font-size: 1.5rem;
      line-height: 1;
  }

  .toast-content {
      flex-grow: 1;
  }

  .toast-title {
      font-family: 'Outfit', sans-serif;
      font-weight: 800;
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.25rem;
      color: var(--text-bright);
  }

  .toast-body {
      font-size: 0.8rem;
      color: var(--text-dim);
      line-height: 1.4;
  }

  .toast-close {
      background: none;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      opacity: 0.5;
      transition: opacity 0.2s;
  }
  .toast-close:hover { opacity: 1; }
`

export interface ToastMessage {
    id: string
    title: string
    message: string
    type: 'info' | 'success' | 'warning' | 'error' | 'chat'
    duration?: number
    onClick?: () => void
}

export const renderToast = (toast: ToastMessage, onDismiss: (id: string) => void) => {
    const icons = {
        info: 'ℹ️',
        success: '✅',
        warning: '⚠️',
        error: '🚫',
        chat: '💬'
    }

    return html`
        <div 
            class="toast type-${toast.type} visible" 
            @click="${() => { if (toast.onClick) toast.onClick(); onDismiss(toast.id); }}"
        >
            <div class="toast-icon">${icons[toast.type]}</div>
            <div class="toast-content">
                <div class="toast-title">${toast.title}</div>
                <div class="toast-body">${toast.message}</div>
            </div>
            <button class="toast-close" @click="${(e: Event) => { e.stopPropagation(); onDismiss(toast.id); }}">
                ✕
            </button>
        </div>
    `
}
