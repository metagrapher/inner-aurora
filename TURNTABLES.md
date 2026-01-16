So it occurs to me that we have websockets and we have webrtc and we have streaming protocols and Cloudflare supporting all of this. 

I have wanted to have a turntable application for a long time. Honestly, each webpage can be one turntable. The browser already allows multiple browser windows to play audio simultaneously. That's a thing that is just natural and built-in, we don't have to do anything special.

Already, if we want to play youtube.com music and spotify.com music at the same time, we can do this. That's not even complicated. In fact, what is complicated is to get that to sound good together. But is it that complicated?

What if we had a webpage that was like a webturntable. We could use cloudflare to stream the streaming service, just hand it over. This way we proxy the connection through a websocket and use WebRTC to make the connection more direct, properly P2P streaming, but allowing the browser to control things like speed and pitch, which are totally adjustments that can be made to the audio stream.

If there is a way to effect the audio stream through an iframe situation, that would be the best, but I'm unsure if the various streaming services allow being iframed, for security. We'd need to test, and then we are at their whim to be turned off if we use iframes.

I want to be able to route audio streams from one browser (window, tab, frame, browser entirely?!) to another browser.

Each window/tab is a turntable. This is where pitch and speed is controlled.

We need a mixer tab. The mixer tab helps us to route audio. We need a view for the back panel of the mixer: to route the audio between tabs (devices) as sources. The front panel of our mixer allows us to control volume of each source (tab / device). Each source is in a channel. A channel may have sub channels: one for each L, R, up to a whole array of surround sound or 3D audio channel streams.