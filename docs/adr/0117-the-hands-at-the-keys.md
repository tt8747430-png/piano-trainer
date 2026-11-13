# ADR 0117 — The hands at the keys: two 3D hands play the music in the keys' place

- **Status:** accepted · **Date:** 2026-11-06

## Context

flowkey films a pianist's hands from above the seat, the keys due lit in orange, and learners copy what each finger
does. The owner asked for the Player to be like flowkey's with a real hand on real-size keys (the Hands at the keys
mock-up, version 2), and accepted the WebXR generic hand (MIT, © 2019 Amazon.com) in the app, credited. Standing
rulings hold: no finger numbers on or under the keys, no piano roll, nothing reserving a band over the keys, nothing
floating over the music, the keys edge to edge.

## Decision

- **Where:** in the keys' place under the music, edge to edge, as tall as the divider sets the keys. The bar's
  Keyboard is two toggles, **Hands at the keys** and **Keyboard** (`KeyboardTools`, `KeysPlace`); the keys are the
  default (`scoreView.hands` false). The hands are watched, never tapped: a piano or the Keyboard is played, so Wait
  mode and Interpret need one of those (the Pace menu says so).
- **The model** (`widgets/piano-hands/model`, pure and tested): real key sizes (`keys.ts`); each finger's angles
  hovering and pressing any key, solved once from the model by `scripts/hand-poses.mjs` into `hand-poses.json` and
  interpolated (`fingers.ts`, `poses.ts`); the fingers for each hand's whole part, chords and held notes included,
  written fingers kept (`fingerPart`, Parncutt's costs, in `shared/lib/music`); the **choreography**, each hand's
  place per onset within its fingers' reach, moved in for a short finger's black key, a glide before the next onset,
  a lift only with no key held, each finger turning to its next key and pressing it (`pressHeld` stands them on the
  notes awaited in Wait mode and Interpret and presses what the learner holds).
- **The camera** (`camera.ts`) looks down from the seat at 62°, its field 22° tall, its top edge at the fallboard and
  its bottom edge across the backs of the hands. It stands back as far as the music's range needs (two octaves at
  least) and over the music, moved off the piano's ends as far as the music's outer keys allow; where a white key
  would draw under 22px it follows the hands instead, down to 14px where two hands play far apart (`handsApart`).
- **The scene** (`ui/scene`, three.js, loaded only once the hands are shown): the 88 keys instanced, each pressed
  and painted on its own as the flat keys are (`keyFill`): the notes awaited in their hand's wash, a key a finger
  presses sinking into its hand's colour (brick right, lilac left), a key the learner holds in its down paint
  (`--key-down`, or its mark's full paint); the bed, the felt, the case, the key slip and the cheeks in the theme's
  paints (`withPaint` reads the tokens); the two hands in the chosen skin (Settings › Hands › Skin, four tones), the
  hand not chosen at a third. It draws on demand, never in an idle loop, and eases each move (playing 12 ms,
  stepping 60 ms, the camera 400 ms); with reduced motion a step, a fade and the camera land at once.
- **States:** the keys' bed while loading ("Getting the hands ready…"); "This device can't draw the hands." with
  **Show the keys** where WebGL is missing; "The hands didn't load." with Try again and Show the keys. Offline it
  works from the precache (the models are in the PWA's `glb` glob).
- **Credits:** About names three.js and the WebXR hand model, its licence beside the models
  (`widgets/piano-hands/assets/LICENSE.md`).

## Consequences

The Player's bundle grows only for a learner who shows the hands: three.js and the models load with them. A new
key-size or keyboard setting reaches the keys alone; the hands frame by their own camera.
