# ENGINE

## The Loop

The Game engine is the main loop.

This is the core of the game. The thing that makes it tick, literally.

In fact, it _is_ the tick.

The game runs on a 500ms loop. Everything kicks off with a setInterval(()=>{/* game logic */}, 500); loop
We choose 500ms because javascript does not gaurantee timing, and we want to be able to ensure that we hit every tick. We do not need to know which tick we are on, the tick is effectively now().

In fact, we should call our loop that. We should make our loop named now(). The game now begins with:
const now = () => { /* game logic */ }
const run = setInterval(now, 500);

this literally kicks off our game.

## The Map

The map is literal. We use the actual literal real world map of each city. Granted, our areas are loosely defined, for now, however we track the coordinates of each player, and we use parcels to define real estate, pulling from real data as much as possible (and it's almost always available.)

While it's not currently displayed to people, we use real lat lon coordinates to determine if people are in the same area, if police can see them or should be alerted by them, determine interactions, etc.

We will eventually incorporate map display and avatar movement on the map. I'm currently envisioning Waze style map, but it's up for debate. We will likely want to build a special purpose AI that can convert map data into a stylized, game-appropriate map. 


