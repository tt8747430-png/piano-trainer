# R39-8 · Progressions and a progression's page, redesigned

Premium here means the library looks and behaves like Songs (one library shape), and a progression's page shows the
harmony itself: what each chord does and how the root moves, in any key, heard at once.

## The rulings as they stand

- "the libraries editable like Songs, the built-in ones too" and the library shape (taste table): search; place chips
  All · Favourites · Recently played · Mine; a Sort and filter sheet with its count on the button, Sort by (As
  arranged, Name, Recently played), Key (Major key · 18, Minor key · 8), Reset and Show n; styles that fold with counts;
  a heart, not a star; + Add (Type numerals or chords, Build from chords, New folder). The laptop is the library tree
  and a table, Add in the bar.
- "Harmony: draw the roles and moves on the chords (the Function · Root motion switch changed only letters)": every
  numeral is coloured by its role (Tonic, Predominant, Dominant, Borrowed, Secondary dominant), the legend says so,
  and between two chords the root's move is drawn (5th down, 3rd up, step down…). No switch.
- "A Progression is the library's, never a piece": its page is a Practice page, Back to Progressions.
- "A key or root is one of shared/ui/pickers": Key opens the root grid; Numerals of: Major · Minor when it has both;
  Voicing: Voice-led · Block.
- The edit form stays the owner's (editors only); a learner edits a copy (··· Edit a copy).
- A progression's own pages drawn (canvas 134, from "no edit mode for the pages … you missed so many features"): ··· Edit the progression opens its editor (Name, How it sounds, The progression, Style, Lines) with a Draft pill, Settings, Publish and Discard; a built-in one offers Edit a copy instead. Practise in the Player opens the Player with a setup sheet.
- A progression's keys take the colour of the chord's function, the legend's colour, not three chord-tone colours (canvas 136); each move under a tile is named truly, the last one back to I; the phone's dock reads Loop · Practise · Play, so nothing is cut off.

## Today

`src/pages/progressions` → `widgets/practice-library` (tree, rows, search, sort, filter), `pages/progression`
(`ProgressionScreen`, `ProgressionLinePage`), content `entities/progression-library/content/library.ts`. Rows are cards
with ··· and role chips; the page has a pencil in the bar and a gear.

## Will build (canvas rows 5 and 6)

The library as above. A progression's page: Back, the heart, ··· (Edit a copy, Add to folder, Share, Hide from the
library); its style, name in serif and how it sounds; Key, Numerals of, Voicing; the chords as tiles (numeral in serif,
chord in the key) four to a row like bars, coloured by role, the chosen one filled, the root's move between them; the
chosen chord named with its role; About this progression; Practise it (In all 12 keys, In the Chord player); More like
it; Play with tempo above the keys, which light the chord (left hand root, right hand voiced).

## History

- 2026-11-08: drawn (canvas v6); waiting for the owner.

Sources: the app's progression library (names, numerals, notes); Hooktheory's function colours; Chordify's chord
tiles four to a bar.
