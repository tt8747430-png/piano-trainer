# R35-2: the hands, after Ivory

**Source:** "can you improve our hands using the ivory example" (2026-11-06). Ivory's parts are a row of buttons, each
a colour dot, the part's name and an eye; the score's sounding notes take the part's colour.

**Today:** five hand choices, each hand-built: the Player's Modes sheet (Left · Both · Right, `player:modes.hands`),
an exercise (Both · Right · Left, `NamedSegmented`), a scale run in the Player (Right · Left · Both), the Scales
explorer's run (Right · Left · Both), the Chords builder (Right · Both). Nothing ties the words to the keys' colours.
The sounding heads were lit in R35-1.

**Will build:** `HandsSegmented` in `shared/ui`, the one control: segments in the keys' order Left · Both · Right
(only those offered), words from `common:handsShort`; `painted` puts the hand's dot over each word (right a filled
brick dot, left a lilac ring with its wash, Both the two) where the keys wear the hands' colours: the Modes sheet,
an exercise, the Player's scale run. The Scales explorer and Chords builder stay unpainted (their keys wear a
chord's tones). `named` keeps the exercise's name-on-the-left layout. `player:modes.hands` goes (en, ru).
Not taken from Ivory: the eye (Practice's "Hear the other hand" already says it) and a scale on the sounding head
(DESIGN: no bounce).
