# R32-D Practice: spec

Research: `practice-research.md`. Mockup: `../mockups/practice.html` (critiqued twice, below).

## Source

The owner, 2026-11-05: "i dont like the metronome how its settings are hidden in the settings make proper ui like the
chordify does. and the tools settings still are very weird, some have only one option in settings, some are redirected to
the app settings. and the side bar is not done like the for example claude sidebar is done. and the chord player has bugs
with drag and drop, look at the memory-palaces for the fix and improve and refactor the chord player and make more
intuitive and simple and use apple guidelines and other best practices. and the tools in the header are very weird, where
only the metronome is available and when i click on more tools i am redirected to the practice page. and i dont like the
popup for selecting the chords or intervals like this is very misleading and not understandable what all of these selected
notes mean and why are they selected. and the tools were not implemented very good and not close to the mockups … and it
is weird with these accompaniments library because i can['t] edit the default ones, can't move, can't remove and all the
normal editing actions … and this called to play lessons mixed with patterns are also weird. and songs inside the
accompaniment are also weird. we still mix a lot of the content … and i dont like the chord finder in the empty state …
and it is weird also how the sections are placed where the page is called practice, the tools come before the learning
content and the content is not ordered in the order of relevancy … and the same for the exercises with editing lacking
features … the same for the progressions … and this continue at the top is also very weird … and also refactor the
practice page overview and all of its components."

And: "refactor all the text and string and all names and write professionally, not plain words."

Standing rulings: feedback-log › Practice, Navigation and bars, Actions and menus, Words.

## Today

- **Practice** (`pages/practice`, `widgets/practice-pages`): Continue (the last two rows tapped on Practice, recorded only
  from Practice's own rows, repeating rows listed below), then Tools, Theory, Playing, Training: tools first.
- **Metronome** (`pages/metronome`): tempo, beats, slider, Tap and Time signature on the page; Sound, Subdivision and
  both trainers on `/practice/metronome/settings` behind the gear.
- **Tuner** (`pages/tuner`): its one setting, A4, on `/practice/tuner/settings`.
- **Settings pages with nothing or one thing:** Chords and Intervals (only the rows to the piano's pages), Accompaniment
  (one switch list of sources), Exercises and Quiz (one switch, Advance automatically).
- **The header's Tools** (`widgets/tools-sheet/ToolsButton`): the quick Metronome, the Tuner, and "All tools", which
  navigates to `/practice`.
- **Quiz's selection sheets** (`widgets/trainer-setup/ListSheetRow`): a list with a check at the far end, preselected by
  the level with no word of why, no select-all, no count per group, no example of what a row is.
- **Chord finder** empty: a card "Play a chord" over an empty grand staff, the key picker above with no word of what it
  does.
- **Chord player** (`widgets/chord-player`): bars of boxes spanning their beats with a resize edge; nested drag contexts;
  the resize also drags; double tap to open; a sentence of how-to on the page.
- **Libraries** (`widgets/practice-library`): favourites only; built-in books cannot be renamed, reordered, hidden (but
  through Accompaniment's Settings), moved; no folders; Accompaniment mixes patterns with the songs and studies they are
  practised on.
- **Sidebar** (`widgets/app-nav`): name and toggle, three places, Search, Settings, Profile at the foot; nothing recent.

## Will build

### 1. Practice, the place (`/practice`)

Bar: **Practice** (large title), Search on a phone. Under it, the purpose line (soft ink, one line):
"Daily technique, theory and accompaniment, in one place." / ru "Техника, теория и аккомпанемент для ежедневных занятий."

**Up next** (heading), up to three cards in a row (one column on a phone), each its tile, a reason line, a title and a
chevron; the whole card is the link. Shown from the learner's own record, in this order, at most three:

| Card              | When                                    | Reason line                          | Title                     | Opens                 |
| ----------------- | --------------------------------------- | ------------------------------------ | ------------------------- | --------------------- |
| Review            | skills due in the Quiz (`useGapsCount`) | "4 skills due for review"            | "Quiz review"             | `/practice/quiz`      |
| Resume exercise   | the exercise last played through        | "Last practised Tuesday · 96 BPM"    | its name                  | its page              |
| Resume            | the last Practice page opened, any route | "Last opened in Practice"           | its page's name           | it                    |
| Start here        | none of the above (a new learner)       | "Recommended first step"             | "Five-finger warm-up"     | the first exercise    |
|                   |                                         | "Build every chord from its root"    | "Chords"                  | `/practice/chords`    |

Continue goes. The page opened is recorded on every route of a Practice page (`useNotePracticeOpened` in the shell's
route for `/practice/*`), not only from Practice's rows; an unknown id is dropped on reading.

Then the groups, by relevance (feedback-log: learning before tools):

| Group (en / ru)                           | Rows                                                         |
| ----------------------------------------- | ------------------------------------------------------------ |
| **Theory** / Теория                       | Chords, Scales and keys, Intervals, Progressions             |
| **Playing** / Игра                        | Accompaniment, Chord player                                  |
| **Training** / Тренировка                 | Exercises, Quiz                                              |
| **Tools** / Инструменты                   | Metronome, Tuner, Chord finder, Circle of fifths: compact tiles |

Laptop: Up next three across; Theory left, Playing and Training right (four rows each side); Tools a full-width row of
four tiles (icon, name, one-line value: "120 BPM · 4/4", "A4 = 440 Hz", "Name any chord", "Keys and signatures").

Row lines (en): Chords "Triads to thirteenths, voicings and fingerings"; Scales and keys "Scales, modes, harmony and
key signatures"; Intervals "Every interval, by ear and on the keyboard"; Progressions "Common progressions in every key";
Accompaniment "Left- and right-hand accompaniment patterns"; Chord player "Chord charts played by a backing band";
Exercises "Technique by method book"; Quiz "Chords, keys, intervals and sight-reading".

### 2. Metronome (`/practice/metronome`), everything in place

Bar: Back · **Metronome** · ⓘ. No gear. The face (Chordify's order): −10 −1 **120** BPM +1 +10; the tempo term
(Allegro ⓘ); the beats (tap: accent · normal · silent); slider with **Tap tempo**. Under it (beside it from 64rem), two
grouped cards:

- **Sound** (group): Time signature (pop-up, 4/4) · Sound (pop-up: Click, Beep, Drum kit) · Subdivision (pop-up:
  Quarter notes, Eighth notes, Triplets, Sixteenth notes).
- **Practice aids** (group): **Speed trainer** switch, its sentence rows when on (Start at · Target · Increase by ·
  Every n bars); **Silent bars** switch, its rows when on (Play n bars · Mute n bars).

`/practice/metronome/settings` goes; the setting homes stay `metronome` (the Metronome page is its home).

### 3. Tuner (`/practice/tuner`)

The readout, then one card: **Reference pitch** A4 stepper 415–466 Hz (default 440) with ⓘ. No gear;
`/practice/tuner/settings` goes.

### 4. The tools' settings

| Page             | Before                         | After                                                      |
| ---------------- | ------------------------------ | ---------------------------------------------------------- |
| Chords           | gear → piano rows only         | no gear (the keyboard strip's ⚙ is the piano's)            |
| Intervals        | gear → piano rows only         | no gear                                                    |
| Accompaniment    | gear → hide sources            | no gear: hiding a book is the library's Edit (§8)          |
| Exercises, Quiz  | gear → Advance automatically   | no gear: **Advance automatically** is a switch in the Quiz's setup, its home |
| Scales and keys  | 4 staff layers                 | kept (gear)                                                |
| Progressions     | names, voicing, inversion      | kept (gear)                                                |
| Chord finder     | 4 switches                     | kept, regrouped and renamed (§6)                           |
| Chord player     | its page                       | kept                                                       |

`accompaniment.hidden` leaves Settings (the settings store's version goes up, no migration).

### 5. The header's Tools (`widgets/tools-sheet/ToolsButton`)

The grid button opens **Tools**: a popover from 48rem (anchored under the button, 380px), a sheet on a phone. In it:

1. **Metronome**, live: Play/Stop, − BPM +, the time signature, the beats; "Open Metronome ›" for the full page.
2. **Tuner**, in place: a row "Tuner · Off" with a switch; on, the readout (note, needle, Hz) grows under the row and
   listens until the switch goes off or the menu closes.
3. **Chord finder ›** and **Circle of fifths ›**: rows that open the tool's own page (a tool, never Practice).

"All tools" goes.

### 6. Chord finder (`/practice/chord-finder`)

Empty state, in the stage: a keyboard picture, the title "Play or tap a chord", one line "Hold three or more keys; the
chord is named as you play." and three example buttons ("C major", "A minor seventh", "D dominant seventh") that put the
chord on the keys. The empty grand staff is not drawn until a chord is. The key picker reads **Spelled in** (C major)
with ⓘ ("Accidentals follow this key: B♭ in F major, A♯ in B major").

Its Settings, grouped: **Chord names** · Slash chords for inversions (C/E); **Analysis** · Keys that contain the chord ·
Scale of the key on the keyboard; **History** · Keep the last 8 chords; then the piano rows.

### 7. Selection sheets (Quiz's custom chords, intervals, scales, kinds)

Title: "Chord qualities" (intervals "Intervals", scales "Scales"). Under the title a summary row: **"8 of 27 included ·
Level 2 set"** (or "· Custom selection"), with **Select all** · **Clear** · **Level set** (restores the level's set; shown
when custom). Each group: its name and "3 of 4", an All/None button. Each row: a **check box at its start** (filled when
included), the name, and at its end an example in soft ink: a chord "Cm7", an interval "m3 · 3 semitones", a scale "C D E♭
F G A♭ B♭". Done at the foot. At least one stays included (Clear leaves the first).

### 8. Libraries: Exercises, Accompaniment, Progressions (`widgets/practice-library`)

**Edit** (the pencil beside the title; Done while editing), as Songs' Select and iOS lists:

- **Places** (the books, the styles, Mine, the learner's folders): reordered by their handles; each place's ⋯ **Rename…**,
  **Hide** (Show from Hidden), **Delete folder…** (the learner's own only, asking first, its items back to their books).
  **New folder** at the places' foot (a `NewSheet`: Name, Create).
- **Items**: the row's ⋯ (outside Edit too): **Favourite**, **Rename…**, **Move to…** (a sheet of the places), **Hide**
  (Show from Hidden); the learner's own also **Delete…**. In Edit, a handle on each row reorders it in its place.
- A renamed built-in shows the learner's name; ⋯ › **Restore original name**. Moving a built-in places it, never changes
  it. All of it is the learner's overlay (`pt-practice-library` version 2: `arrangement` per library), synced as before.
- Sort: **Manual** (the learner's order, default), Name, Level.

**Content kinds apart** (the owner: "we still mix a lot of the content"):

- **Accompaniment holds patterns only.** A method book's place heads its patterns with two links: **Course** (its course
  in Learn) and **Songs** (its collection in Songs) where it has them. The studies and songs leave Accompaniment.
- Exercises hold exercises; Progressions hold progressions.

### 9. The sidebar (laptop, from 64rem), Claude's

Top: **Piano Trainer** and the collapse toggle (⌘B). **Search** as a field-like row ("Search", ⌘K at its end). The
places: Learn, Songs, Practice. **Recents** (heading): the five songs last opened (`byLastOpened`), one line each,
ellipsised, each its link; none while there are none. Foot: the learner's row (avatar, name or "Guest", a line "Profile"),
a link to the Profile, with **Settings** (gear) beside it. Collapsed (72px): toggle, Search, places, avatar, gear;
tooltips; Recents hidden. The phone keeps its four-tab bar (standing ruling).

## What goes

Continue; `/practice/metronome/settings`; `/practice/tuner/settings`; `/settings/chords`, `/settings/intervals`,
`/settings/accompaniment`, `/settings/exercises-and-quiz`; the gears of Chords, Intervals, Accompaniment, Exercises and the
Quiz; "All tools"; the Chord player's resize edge, nested drag contexts and how-to sentence; the songs and studies in
Accompaniment; `accompaniment.hidden`.

## Mockup critique (impeccable lens)

Rendered by `.scratch/r32/mockups/check.mjs` at 1710 and 393 wide, light and dark: no page error, nothing wider than the
page, every frame whole.

**Pass 1** (the first draw, read as the owner, question by question):
1. Chord player, phone: the section's head (handle, name, − × 2 +, ⋯) wrapped its ⋯ to a second line. Repeat became one
   pop-up ("Repeat × 2"), so the head is one row at 393.
2. Chord player, phone: the floating transport sat over the Chorus' last tiles and Add section was cut by the home
   indicator. One section drawn with scroll room under it; the transport floats over empty room.
3. Metronome, laptop: the face floated 60px lower than the settings column beside it. Top-aligned.
4. Tools menu, phone: the Metronome's −, BPM, + and Play in one row pushed Play past the card's edge at 393. Play stays
   at the row's end; − BPM + go to a line of their own.

**Pass 2** (a fresh read after the fixes):
1. The sidebar's laptop screens (10.1, 10.2) drew only Up next, leaving two thirds of the page bare ("no half-empty
   laptop screens"). They now draw the whole Practice page.
2. The collapsed rail's tooltip covered the Theory heading. Moved beside the rail.
3. One honey control per screen held everywhere: the Tools menu's Tuner switch is grass, its only honey is Play; the
   library's Edit mode shows Done in honey and hides the honey +.
4. Russian length check of the longest new strings ("4 навыка ждут повторения", "Слэш-аккорды для обращений",
   "Гаммы, лады, гармония и ключевые знаки") fits two lines at 393.
