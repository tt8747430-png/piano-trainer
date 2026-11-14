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
- **A progression's page in the Chords page's shape (canvas 177, loop, 2026-11-14):** one piano, one bar, one shape
  across Practice, as Scales and Intervals. The keys edge to edge at the top under Back · Progression · Settings ·
  Piano (glass); the name (serif, its ♡ beside it), how it sounds · its style, and Key as a picker; the chords as
  tiles coloured by role with each root's move, the legend, and one card of the chords on the staff with what it
  teaches; Practise through the keys in the Player as the Scales page's Practise rows; Passing chords; Songs with this
  progression and Open in the Chord player. One floating bar: Loop (lit while it loops) · Play ⌄ (Chords: Triads ·
  7ths · 9ths, where a chord grows; Approach chords: None · Secondary dominants · ii–V) · Practise (the Player). On a
  laptop the keys run across the top, the progression on the left, the practice and its passing chords and songs on
  the right. Never Chord size or Approach chords as fields on the page, the keys docked at the foot, or the name in
  the bar.

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

## Ported (loop, 2026-11-14), canvas 177

Built to `r62_progression.py`:

- **Bar:** Back (glass) · Progression · the keys' tools · the gear (`ProgressionScreen`); the name left the bar.
- **Keys** at the top, edge to edge (`PinnedKeyboard place="top"`), across the page on a laptop over a 3fr | 2fr grid.
- **Hero:** the name in the serif, 36 bold, its ♡ beside it; how it sounds · its style, 15 soft; Key as the picker.
- **Tiles** (`shared/ui/RoleChips`: `RoleTiles`, `RoleTile`): four to a row, 96 tall (120 on a laptop), 12 round, in
  the role's wash (Tonic peach, Predominant sky, Dominant sage: `ROLE_PAINT` home sand, away sky, tension grass), the
  numeral in the serif 26 (34) over the chord 15 bold, ringed in ink while it sounds; under each its root's move on to
  the next ("5th up →"), the last back to the first. The legend Tonic · Predominant · Dominant, 13 soft, with the ⓘ.
  The arrows between chips and the role words on the chips went; so did the chord diagrams under the row.
- **Music card:** the chords on the staff and what the progression teaches in one card (16 round, the sheet, a ring).
  The staff stays the grand staff: the left hand's root is on it, which a treble staff alone would lose.
- **Practise through the keys in the Player:** the Scales page's `PractiseRows`, one row a sequence, the chords it
  plays first in its line (truncated). The canvas's soft circle became the kit's honey one, as on Chords and Scales.
- **Passing chords:** a 14 heading; the pair and In the key only in one row; each way a card ("D7 into G", its kind,
  why it works, Play), no staff; the explanation line and the category headings went.
- **Songs with this progression**, then Open in the Chord player as the group's last row (alone where no song has it).
- **Floating bar** (`RowPlay variant="pieces"`): Loop (ink while it loops) · Play ⌄ (What it plays: Chords Triads ·
  7ths · 9ths where a chord grows; Approach chords None · Secondary dominants · ii–V) · Practise (`FloatingPieceLink`,
  a dumbbell: the piano icon is the bar's keyboard). Chord size and Approach chords left the page.
- Strings: `harmony.role` Tonic · Predominant · Dominant (ru Тоника · Субдоминанта · Доминанта), moves "5th up"
  (ru "квинта вверх"), `progressions.title`, `plays`, `chords`, `inPlayer`, `throughKeys`, `inChordPlayer`,
  `passingChords.into`. Lessons' rows of roles take the same tiles.
