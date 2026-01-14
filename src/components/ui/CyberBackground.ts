import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('cyber-background')
export class CyberBackground extends LitElement {
    @property({ type: String }) color = '#00ff41'
    @property({ type: Number }) fontSize = 14

    private _canvas: HTMLCanvasElement | null = null
    private _ctx: CanvasRenderingContext2D | null = null
    private _drops: number[] = []
    private _animationFrame: number | null = null

    static styles = css`
    :host {
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: -1;
      pointer-events: none;
      background: #000;
    }
    canvas {
      display: block;
    }
  `

    firstUpdated() {
        this._canvas = this.renderRoot.querySelector('canvas')
        if (this._canvas) {
            this._ctx = this._canvas.getContext('2d')
            this.resize()
            window.addEventListener('resize', () => this.resize())
            this.draw()
        }
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        if (this._animationFrame) cancelAnimationFrame(this._animationFrame)
    }

    resize() {
        if (this._canvas) {
            this._canvas.width = window.innerWidth
            this._canvas.height = window.innerHeight
            const columns = this._canvas.width / this.fontSize
            this._drops = Array(Math.floor(columns)).fill(1)
        }
    }

    draw() {
        if (this._ctx && this._canvas) {
            this._ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
            this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height)

            this._ctx.fillStyle = this.color
            this._ctx.font = `${this.fontSize}px VT323, monospace`

            this._drops.forEach((y, i) => {
                const text = String.fromCharCode(Math.random() * 128)
                const x = i * this.fontSize
                this._ctx!.fillText(text, x, y * this.fontSize)

                if (y * this.fontSize > this._canvas!.height && Math.random() > 0.975) {
                    this._drops[i] = 0
                }
                this._drops[i]++
            })
        }
        this._animationFrame = requestAnimationFrame(() => this.draw())
    }

    render() {
        return html`<canvas></canvas>`
    }
}
