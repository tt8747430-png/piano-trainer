# A41: Exercises and the Quiz, inside (report)

**Built**
- **The round:** Check, Next, Reveal and Results are now the floating capsule's primary (`Fab`). The Check page hosts its own `FloatingHost`. "Build C" is set at 48px with its quality under it, plus a **Hint** that shows the notes as chips. Every round answered on the keys hides the key names (`LiveKeyboard namesKeys`), and the rail's names toggle is greyed. The tally line reads "Round 3 of 10 · 2 right · 1 wrong · Run 2", with the `TimeLeft` ring beside it.
- **After an answer:** "Right" or "Not quite" in words and colour, then a **Why** line. It comes from `whyAnswer(question)` in `features/trainer/why.ts`: a chord's notes and formula, an interval's letter names and semitones, a scale's W/H steps, a note's line or space and ledger lines per clef, a key's sharps or flats in order, a numeral's chord on its degree, a progression's chords, and each cadence's defining motion. 9 unit tests check this against theory, and `quiz.why.*` has en and ru strings.
- **Results:** What to review lists each missed thing once, linked to Chords, Intervals, Scales or Scales' Key, or Progressions. **Review the missed ones** (`useTrainer.review`) and Again. Misses already reach My gaps through `recordAnswer` evidence.
- **The exercise page** `/practice/exercises/$exerciseId` (`pages/exercise`), with its parent, Search and the Exercises rows linking to it. It shows What it trains, How to play it with a `HandCard` of the first hand position, then Key (`KeyPicker`), Hands, Octaves and Tempo, and **Start** in the capsule. Each exercise gains `how` and `options` (`oneKey`, `bothHands`).
- **The Player:** an exercise's score is `plain`, with no chord symbols and no staff name; its harmony stays for the chord views. **Next key** steps round the circle of fifths after each pass. `pt-progress` keeps the tempo reached per exercise and key (`hanon:5:G`) and moves to **version 6**.

**Commits:** e6d0f0f0, 32b085ee, c0f08132, 3afa8b5f.

**Rulings** (each with its cost if wrong)
- The exercise data lives in `entities/exercise`, not `shared/lib/exercise`, so `how` and `options` went there. Cost: none.
- The Player's URL uses the existing `root` param, not `key`. Cost: the spec's link shape differs.
- **Next key** sits in the Player's status line above the transport, because the transport pill's seven fixed controls are shared with the editor. Cost: a small move if the owner wants it inside the pill.
- Key names are hidden for every round answered on the keys, not only Note reading and Play it. Cost: one condition.
- `why.ts` and `ReviewLink` sit flat in their slices, matching the slice's shape (the feature has no `model/` folder).
- On an exercise with no Major or minor choice, choosing a minor key in Key keeps only the tonic. Cost: confusion if someone picks a minor key there.

**Left, and why**
- **Rhythm** (Even · Dotted · Triplets) for Hanon: the generator has no rhythm variants yet.
- **Target tempo:** the Player has no target to climb to.
- **Chromatic order for Next key**, and ticking the day's routine row.
- **Hanon's number on the page:** it is still chosen in the Player's settings.
- **Fit:** a round fits at 402×874 and nearly at 1280×800, where the capsule overlaps the last row of answers. On a phone held sideways the round scrolls, because the keys take the height.

**Checks:** typecheck and lint are clean, and the build passes with placeholder environment variables. The affected test files pass, run in smaller sets (the machine ran out of memory). Screenshots are in `.scratch/r29/shots/after/a41-*`.

**Migration:** none.
