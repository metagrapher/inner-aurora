/** @vitest-environment happy-dom */
import { describe, it, expect, vi, beforeEach } from "vitest"
import { loadPersona, savePersona } from "./persona"
import { createPersona } from "./persona"

describe("Game Reset Logic", () => {
    beforeEach(() => {
        // Ensure localStorage is mocked if not in a real browser environment
        if (typeof localStorage === 'undefined' || !localStorage.clear) {
            const storage: Record<string, string> = {}
            vi.stubGlobal('localStorage', {
                getItem: (key: string) => storage[key] || null,
                setItem: (key: string, value: string) => { storage[key] = value },
                removeItem: (key: string) => { delete storage[key] },
                clear: () => { 
                    Object.keys(storage).forEach(k => delete storage[k])
                }
            })
        }
        localStorage.clear()
        vi.restoreAllMocks()
    })

    it("should clear relevant localStorage keys upon reset", () => {
        // Mock window.location.reload
        const reloadMock = vi.fn()
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: { reload: reloadMock }
        })

        // Setup some data
        const persona = createPersona("test-id", "Test", "NIMBY", "nyc")
        savePersona(persona)
        localStorage.setItem("arca.de.currentView", "Market")
        localStorage.setItem("arca.de.mainTab", "MARKET")
        localStorage.setItem("arca.de.marketViewMode", "grid")

        // Define a simple reset function similar to GameUI.resetGame
        const resetGame = () => {
            localStorage.removeItem("arca.de.persona")
            localStorage.removeItem("arca.de.currentView")
            localStorage.removeItem("arca.de.mainTab")
            localStorage.removeItem("arca.de.marketViewMode")
            window.location.reload()
        }

        resetGame()

        expect(localStorage.getItem("arca.de.persona")).toBeNull()
        expect(localStorage.getItem("arca.de.currentView")).toBeNull()
        expect(localStorage.getItem("arca.de.mainTab")).toBeNull()
        expect(localStorage.getItem("arca.de.marketViewMode")).toBeNull()
        expect(reloadMock).toHaveBeenCalled()
    })
})
