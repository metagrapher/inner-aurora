export const handleBanking =
    (player: any
        , amount: number
        , isDeposit: boolean
        , teamSize: number = 1
    ) => {
        const stats = player.gameData?.drugwars || player
        if (isDeposit) {
            if (stats.cash >= amount) {
                stats.cash -= amount
                stats.bank += amount
            }
        }
        else {
            if (stats.bank >= amount) {
                stats.bank -= amount
                stats.cash += amount
            }
        }
        // Banking dynamic: Teams get better rates/limits (logic to be expanded)
        return player
    }
