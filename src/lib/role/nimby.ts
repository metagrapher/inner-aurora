export enum NimbyAction {
    BARTER = "BARTER",
    ARGUE = "ARGUE",
    ASK_TO_LEAVE = "ASK_TO_LEAVE",
    SWEEP = "SWEEP"
}

export const handleNIMBYPatrol = (player: any, proximityPeers: any[], encampments: any[] = []) => {
    const stats = player.gameData?.drugwars || player
    if (stats.role !== "NIMBY") return { error: "NOT_NIMBY" }

    // Find fellow NIMBYs
    const peers = proximityPeers.filter(p => p.role === "NIMBY")

    // Find target encampments (home bases of Entrepreneurs)
    const targets = encampments.filter(e => e.location === stats.location)

    // Proximity target is one that is occupied or very close
    const proximityTarget = proximityPeers.find(p => p.role === "Entrepreneur" && p.location === stats.location)

    return {
        type: "PATROL_RESULTS"
        , peers
        , targets
        , proximityTarget
    }
}

export const handleNIMBYEncounter = (nimby: any, target: any, action: any) => {
    const stats = nimby.gameData?.drugwars || nimby
    if (stats.role !== "NIMBY") return nimby

    const results: any = { nimby }

    if (action === "BARTER") {
        stats.nimbyStatus += 2
        results.message = "You bartered for some vintage scraps."
    } else if (action === "ARGUE" || action === "ASK_TO_LEAVE") {
        const success = Math.random() > 0.5
        if (success) {
            stats.nimbyCred += 5
            results.message = `You convinced them to move on. Social status up!`
            results.targetAction = "MOVE_OUT"
        } else {
            results.message = `The argument got heated. They aren't budging.`
            results.targetAction = "CALL_COPS"
        }
    } else if (action === "SWEEP") {
        if (!target) return { error: "NO_TARGET" }

        const isOccupied = !!target.isOccupied
        if (isOccupied) {
            results.encounter = true
            results.message = "The owner is home! It's an encounter!"
        } else {
            // Unoccupied sweep
            const loot = target.stash || {}
            results.loot = loot
            results.message = `Sweep complete. You found: ${Object.entries(loot).map(([id, count]) => `${count}x ${id}`).join(', ') || 'nothing but trash'}`

            // Transfer loot (this logic will be called in the UI/Gun sync layer to update both players)
            stats.nimbyCred += 10
            stats.cash += 50
        }
    }

    stats.lastActionTime = Date.now()
    return results
}

export const handleCitizenReport = (reporter: any, location: string, targetType: "ENCAMPMENT" | "HARASSMENT", quality: "VAGUE" | "GOOD") => {
    const stats = reporter.gameData?.drugwars || reporter
    stats.nimbyCred = (stats.nimbyCred || 0) + (quality === "GOOD" ? 10 : 2)
    stats.lastActionTime = Date.now()

    return ({
        message: "Report filed. Good work, citizen."
        , success: true
        , event:
        {
            type: "BLOTTER_REPORT"
            , location
            , reportType: targetType
            , quality
            , reporterId: reporter.id
            , reporterRole: reporter.role
            , message: targetType === "ENCAMPMENT"
                ? `Citizen measures ${quality} encampment activity.`
                : `Citizen reports ${quality} harassment in progress.`
            , isOccupied: true // In a report, we assume something is happening to report it.
            , timestamp: Date.now()
        }
        , reporter
    }
    )
}
