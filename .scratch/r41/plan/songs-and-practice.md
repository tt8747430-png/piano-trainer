# R41: every Songs and Practice page refactored to its own reference, in the calm language

Canvas: [The ideal Piano Trainer](https://claude.ai/artifact/9J6uVajsp9EDULa5zsKwJH), v14. Generator:
`.scratch/r39/canvas/r41.py` (kit `r41_kit.py` on `calm_kit.py`, the library shape `r41_lib.py`, pages
`r41_songs.py` and `r41_practice.py`), boards laid out by `index.py`.

## The rulings as they stand

- "i meant this minimalistic not that all the pages should look like it, refactor them properly and look at the example
  apps and websites": the calm Chords page sets the **language** (tokens, a bare bar, inset grouped rows, a floating
  glass bar, a quiet type scale, honey for the one main act), never the layout. Each page keeps the layout its job and
  its reference app give it. R40's one-layout-for-all is withdrawn.
- Every R39 ruling stands (`.scratch/r39/plan/*.md`): every control labelled; a gear for the page's settings; a key or
  root from the root grid; fingering on the staff or in a table, never on or under the keys; libraries in the one
  library shape; Undo, not a question.

| Page | Reference (read) | Layout |
| ---- | ---------------- | ------ |
| My songs | Apple Music Library (Sort, Recently Added), forScore's library, Simply Piano (heart, search), Mindscape | My songs · Explore title; Archive, +, ···; search with Sort and filter (its count); place chips; Continue shelf of engraved covers; Folders and Songs that fold with counts; a heart on songs only. Laptop: places tree and a table. |
| A song | flowkey's song page (cover, title, artist, Start), Apple Music's album page, forScore | The first bars as the cover; title with Edit; one byline; Key · Time · Tempo; Continue from bar 9 and From the start; the chords as small keys to hear; progressions; Details. Learned, heart, ··· in the bar. |
| Score editor | Flat (named category tabs over their tools), Sibelius for iPhone (Back, Play, Undo in one bar) | Done · Undo · Redo · Piano keys · Play · ···; the page; a palette sheet (tools over Notes · Accidentals · Articulation · Dynamics · Bar · Text; its grip opens all in one scroll); the keys. Laptop: palette docked right. |
| Practice | Yousician's Home (Continue, daily session), R39-4 | Practice, Tools, Search; Up next card with Start; Harmony, Playing, Tools as rows with pictures of their content. Laptop: cards with large pictures. |
| Scales and keys | Piano Companion (the staff, then the chords that fit) | Subject; Scale · Chords · Key; the staff with fingering over the notes, the keys below; Tonic › (root grid), Scale ›, Hands, Octaves; Practise this scale and Play. |
| Intervals | Tenuto (named answers P5), Perfect Ear (staff and keys) | Subject; keys with the two notes and "Sounds like"; the 13 intervals as named tiles; From ›, Play as, Intervals; Train your ear and Play. |
| Progressions, Accompaniment, Exercises | the library rulings | The one library shape, each with its own Sort and filter and + Add. |
| A progression | Hooktheory (chords by function, the likelier moves) | Numerals coloured Tonic · Predominant · Dominant with the root's move between; the chord on the keys; Key ›, Voicing, Tempo; Loop, Practise in the Player, Play. |
| Chord player | iReal Pro (the chart fills the page, the player bar at the foot: style, key, tempo, repeats) | The chart on paper with section letters, × repeats, grips; tap a bar to change its chord (Delete with Undo); the foot bar Style · Key · Tempo · Repeats · Play. Laptop: the key's chords to drag in. |
| An exercise | Hanon Pro (Listen, a metronome, tempo) | Hanon No. 1; four bars on the staff; Number, Key ›, Hands, Rhythm, Tempo and the tempo ladder; Listen and Start. |
| Quiz and a run | Tenuto (named answers), Functional Ear Trainer (levels, accuracy), Duolingo Music (the verdict bar) | My gaps first; groups with best-score rings; a row opens its setup (Drill, Level, Rounds, Time limit, Start). The run: ✕, progress, 3 of 10; the question; the grand staff and Hear it; four answers; a verdict bar, Continue. |
| Metronome | Soundbrenner (accent markers you tap through), Pro Metronome | The tempo marking, −10 −1 120 +1 +10, the slider; beats as squares (accent, normal, silent); Time signature, Subdivision ›, Sound ›, Speed trainer ›, Silent bars ›; Tap tempo and Start. |
| Tuner | Pano Tuner and Cleartune (note, needle, cents, Hz, adjustable A4) | A₄, "6 cents flat", Hz; the needle; A4 = 440 Hz, Temperament; Listening and Play A4. |
| Chord finder | R39 ruling | Cmaj7/E; its notes with their roles; Spelled in, Also read as, Played; the keys as the input; Clear the keys, Open in Chords. |
| Circle of fifths | muted.io (the circle, then signature, diatonic chords) | The circle; the key; Chords in the key; Major · Minor, Scales and keys, Play. Laptop: the key signature and chords beside the circle. |
| Chords | the calm Chords page itself | Unchanged; its Fingering view must take the table when ported. |

## History

- R40 (2026-11-08): every page drawn in the calm Chords layout. Withdrawn the same day by the ruling above.
- R41 (2026-11-08): each page refactored to its reference, in the calm language; the R39 rulings restored; the R40
  "A pattern" board removed (Accompaniment is a library; a pattern is heard from its row).
