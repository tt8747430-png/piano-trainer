# Google's A.I. Duet (2016): what we can take

Source: https://github.com/googlecreativelab/aiexperiments-ai-duet, read 2026-11-06 (README, `static/src`, `server/`).
Archived, no longer maintained. **Apache-2.0**: code may be ported with its notice.

## What it is

A piano that answers you. You play a few notes; when your hands lift and **600 ms pass with nothing held** (or the
phrase has run over 3 s), the phrase goes to a Python server running Magenta's melody model (TensorFlow), which
continues it for about as long as you played (1–8 s, the last 15 s at most). The answer plays back on the same piano in
another colour, notes shortened to 90 % and at most 4 s. A piano roll above the keys shows your notes and the answer's
rising as coloured bars; a glow marks whose turn it is. MIDI keyboard and the computer's middle row play it; Salamander
piano and a string sound.

## For us

The server needs Python 2.7 and old TensorFlow. Magenta's browser library (`@magenta/music`, Apache-2.0) last released
in 2022 on TensorFlow.js 2, which breaks our latest-dependencies rule. So the model is out; **the turn-taking is the
idea**, with an answer we compose ourselves from what we already know of keys and patterns.

**Call and response**, a Practice exercise and a Player mode for improvising:

1. The app plays a short phrase in the chosen key and style (from our patterns, progressions and the learner's level);
   the learner answers. Three games:
   - **Echo:** play it back; marked note for note (ear training, rhythm memory).
   - **Answer:** reply with your own phrase over the same chords; scored only on staying in the key and in time.
   - **Duet:** you lead; when you lift your hands for a moment (600 ms, as Duet does), the app answers with a phrase
     made from yours: the same rhythm moved along the scale, a sequence, an inversion or an ending on the tonic.
2. Your notes and the app's in two colours on the on-screen piano (no piano roll, by the owner's ruling).
3. Over the accompaniment of a progression, so improvising has a harmony under it.

Left out: the neural model and its server.
