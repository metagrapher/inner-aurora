import Gun from 'gun'
import 'gun/sea'
// import 'gun/axe' // Optional: for more efficient routing

let _gun: any = null

export const initGun =
    (peers: string[] = []
    ) => {
        if (!_gun) {
            const host = typeof window !== 'undefined' ? window.location.host : 'drugwars.arca.de.com'
            const protocol = typeof window !== 'undefined' && window.location.protocol === 'https:' ? 'wss:' : 'ws:'
            const localPeer = `${protocol}//${host}/gun`

            _gun = Gun(
                {
                    // Use local worker relay for development
                    peers: peers.length > 0 ? peers : [
                        localPeer,
                        "https://drugwars.arca.de.com/gun",
                        "http://localhost:8787/gun"
                    ]
                    , localStorage: true
                }
            )
        }
        return _gun
    }

export const getGun = () => _gun || initGun()

export const syncPlayerProximity =
    (player: any
    ) => {
        const gun = getGun()
        const area = gun.get("regions").get(player.location)

        // Publish location
        area.get(player.id).put(
            {
                name: player.name
                , x: Math.random() // Placeholder for actual street coord
                , y: Math.random()
                , role: player.role
            }
        )

        // Subscribe to others in the same area
        area.map().once((peer: any, id: string) => {
            if (id !== player.id) {
                console.log("Encountered peer:", peer.name, "Role:", peer.role)
            }
        })
    }

export const syncBlotterEvent = (event: any) => {
    const gun = getGun()
    gun.get("blotter").set(event)
}

export const subscribeToBlotter = (callback: (event: any) => void) => {
    const gun = getGun()
    gun.get("blotter").map().on((event: any, id: string) => {
        callback({ ...event, id })
    })
}
