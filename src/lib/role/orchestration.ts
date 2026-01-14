export const generateEvent =
    (player: any
    ) => {
        const stats = player.gameData?.drugwars || player
        const roll = Math.random()
        // If cop is corrupt, IA might visit
        if (stats.role === "Police" && (stats.corruption || 0) > 50 && roll < 0.2) {
            return { type: "IA_INVESTIGATION", severity: stats.corruption > 80 ? "HIGH" : "LOW" }
        }
        if (roll < 0.1) return { type: "COPS", severity: "LOW" }
        if (roll < 0.2) return { type: "NIMBY", action: "SWEEP" }
        if (roll < 0.3) return { type: "TRASH", item: "Vintage Neon Sign" }
        return null
    }

export const handleEncounterOutcome = (player: any, action: string) => {
    const stats = player.gameData?.drugwars || player
    const success = (stats.cheatsEnabled) ? true : Math.random() > 0.4
    const result: any = { success, message: `${action} successful!` }

    if (!success) {
        stats.health -= 20
        result.message = `${action} failed!`
        if (stats.health <= 0) {
            result.died = true
        }
    }
    result.player = player
    return result
}
