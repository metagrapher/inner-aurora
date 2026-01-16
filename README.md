# INNER AURORA / ADVANCED DRUG WARS

This game is actually three games that interact with each other.
It's actually actually a game system that lives on top of a whole other gaming system.
First and foremost it started as a chat system for the arca.de.com (pronounced R-K-D-com or Arcay-de-com or Arcade-y Com)
And then we realized we needed to play Advanced Drug Wars. Because obviously what do you do at Rave Arcade but play Advanced Drug Wars?

Well, that evolved. It evolved into _things_

ENGINE.md
In many ways, it's a multidimensional game of battleship. You have areas that have things in them or they don't, and then you have turns. The players are effectively lobbing missiles at each other's maps...in many ways. Except there's really only one map, because it's shared among all, at least the tiles that are relevant to you and your part of the game. Anyhow... maps. This game is all about maps.

PLAYER.md

Your player has an avatar. Kind of like a pipboy in a way, but not. You can dress up your character and buy them things, why not? This avatar is visible not only to you, it's how you appear on others' maps and screens when they encounter you in the wild.

You have a location. And you have stats. You have things you have to do to stay alive, like a tomagachi. You have a birthday. You have a bank account. You have a credit line. You have a car? You have a job.* (*maybe) You have a house. Or rent one. You have a family. You have a reputation. You have a social status. You have a health. You have a mood. You have a location.
~~
Choose life. Choose a career. Choose a family. Choose a reputation. Choose a social status. Choose a compact disc player and electrical tin opener. Choose a three piece suit in a range of fabrics. Choose a health. Choose a mood. Choose a location.
~~
You need to eat, sleep, and workout. Well, maybe. You don't necessarily have to work out, but it can help if you get into fights or have to run from situations. If you don't eat then you lose stamina rapidly. You have to eat a certain amount of calories per day to stay alive, unless you do drugs.

## ROLES

ENTREPRENEUR.md
As an entrepreneur you are basically playing the original Advanced Drug Wars, with a little extra on it.

NIMBY.md
As a NIMBY you're playing a form of Monopoly, kind of, ish. Maybe not but kinda? It's up to you, that's just one of the games. The interface is styled after NextDoor.com and we are encouraging just as catty, really.

The point seems to be to _chat_. It's all about the gossip, really. Well, and the money, but who's counting? probably you. 

It's all about the property values, and these pesky encampments keep bringing property values DOWN.
Also there is trash everywhere. And by trash I mean homeless people and their stash tents and party tents. You can't just let them be there, right? You have to do something about it. It's unsanitary. It's unsafe. It's just... gross.

You buy property and rent property for profit. You flip property by improving it. You have to invest money in it and get loans from the bank. The bank will then charge interest depending on how quickly you can pay it back. and they charge you fees if you let people camp on your property!

Oh, and you can sell drugs, too, why not? You can make a lot of money that way. But if you sell drugs in a neighborhood, property values will drop, but then, maybe that's how you keep people renting? idk, probably not.

If you find drugs in your property, you are supposed to evict people. If you don't evict them, and the cops raid the house, you get in trouble. You get in trouble a lot, and the cops have to punish you.

COPS.md
I haven't fully figured out why this is fun yet. I need to find the fun here.

CARS.md

You probably need a car to get around. You can't just walk everywhere, that takes forever.

TIME.md

Time is pretty straight forward. It's a 1m game time to 1s real time ratio. That means that if you wait 1 second in real life, it is 1 minute in game time. So if you wait 1 minute in real life, that's an hour in game time. 24 minutes of real life, that's a whole day, homie!

DRUGS.md

The drugs! how do we forget about the drugs? We literally can't.

The drugs are specific to each city. There is overlap between what drugs are in demand in each city, but there are also unique drugs in some cities.


## PROJECT CODING PHILOSOPHIES

I prefer to start by creating monadic components as much as possible, as these are like our unit components. From here we can build other components, units build together to make larger accumulative units, in the same way that words or numbers are built from letters and digits. Monads are pure functions, first order functions, that are composable, reusable, and portable.

I very much prefer a model of component inheritance, wherein we create a specific implementation component which implements these other abstract higher order components we have created. 

Oftentimes we are createing second order components which are implementing two or more other monadic components, and presenting themselves as a unit for use in monadic contexts, such that they could be used as a unit themselves. These are second level functions because they have to know about another function in order to work. They can be thought of, conceptually, as having a degree for the number of functions they need to know to work. So, a component that uses 1 other component is a second level function of the first degree.

Finally, we should be using Implementation Components, a third order function, which is effectively our composition implementation component function. This is where we sew together the second level functions. Think of it like sentences to our words, or formulae for our binomials. These third level functions are often as far as we need to abstract, because we can compose them together, too. These third level components are direct implementation components, like a specific kind of button, or a button in a certain context. They are often not as unique as they seem at the time, and should be named as abstractly as possible. They are the most common kind of component, kind of like our presentation layer, where we are putting together the logic of our second order components. Third order components have a degree, as well, which is how many second or first order components they include.

One more kind...Fourth order components are those unique and special snowflakes that are components made for a specific place and time. They are their own sideeffect, you might say. They often inherit from third level components and have unique special patterns curried in as exceptions. They are they least used and most rare component. In a functioning well-built application they do not exist.



### A11y + 508c3 + WCAG
We adhere to strict web standards and accessibility. 

It's very important that we support A11y and 508c3 standards to the max. In fact, we use it to the max, allowing 3d spatial accessibility implementations so that our games are playable by anyone, even non-sighted players and players with different input devices.

### Fighter Pilot Coding
All projects in arca.de.com follow a strict no errors policy. This is a higher standard of coding than that to which most are accustomed.

Code must be iterated on and tested with ALL possible inputs, especially strange or unexpected input. We must gracefully handle "interference".

#### Test Driven Development
We perform strict Test Driven Development. We always write the failing unit test (RED STAGE) before we write any implementation code. When we have unit tests that accurately reflect the requirements, we write code that will cause the unit tests to pass. Then we run ALL tests to ensure regression as well as to ensure that our tests have passed. (If we are in a large project, we shall ensure that ALL tests are not too many tests to run at once, and that we should have a tiered testing model in this instance.)

#### There is no try-catch. Only Do.
We do not try-catch, as that is endemic of poor architecture. Instead we handle all exceptions. No exception is unhandled, and we do not throw. Unhandled exceptions are a life-death scenario, often resulting in death. 

#### No Unhandled Exceptions
Errors are unacceptable. We must inform the human of exceptional conditions and allow them opportunity to react or adjust as need be. It is important, at this time, to note the security contexts and to not compromise information to unauthenticated parties, as they are untrusted entirely.

### Parameterizations
Parameters are often from untrusted sources. It's important to be able to realize where information is coming from and who is responsible. Generally information from GET URL parameters, in any capacity, is untrusted. We necessarily must expose some information for the sake of deep linking, however we should generally operate on a principle of keeping communication internal as much as possible, like a SPA, and we do have websockets and web workers, so we can take advantage of these technologies deeply. As well, we are able to pass information among Cloudflare Workers with shared KV stores, R2 buckets, and D1 tables.

#### URL Parameters vs Path Parameters

We always use path parameters. URL parameters and path parameters both are untrusted, but surprisingly, path parameters are more trusted than URL parameters because it is well known that URL parameters can be left off and hacked at, whereas it's more difficult to discern which parts of a path are necessarily dynamic, and which parts are able to be hacked at, incremented, or otherwise abused to discover structure. It's easier to discover structure through a combination of path parameters and url parameters. We prefer path parameters in nearly all cases. 

### Path parameters vs URL Fragment identifiers

URL fragments, the #identifier at the end of urls often used in SPAs are fine to use, however, it's important that they are used for lit only, because Astro does not have access to the url fragment, as that is not passed to the server. Since we prefer an optimal and streamlined experience, and we prefer SSR to client hydration, we will not use fragments very often, except to ensure history state or for deep linking in otherwise challenging dynamic environments. We always prefer to handle deep linking with path parameters whenever possible, since URL fragments necessarily require that the client load a script from the server, parse and run the script, parse the fragment, and then request from the server the resource in question. This is suboptimal for obvious reasons and should only be used as a last resort.
