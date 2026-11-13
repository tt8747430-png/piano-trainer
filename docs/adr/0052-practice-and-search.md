# ADR 0052 — Four places; Practice's pages hold their tools; the Metronome; Search finds everything

- **Status:** accepted · **Date:** 2026-09-27 · consolidated 2026-10-27

## Context

Practice was rebuilt several times: topics with Explore, Quiz and Play; seven places, a page for each thing; things,
tools and training; a tool as a tab of what it works on. piano.org, musictheory.net and musicca.com keep three kinds
of page apart (what teaches, what trains, what works something out) and link a thing to its tool with its state in the
URL. The owner asked for less jumping between pages, and then for a metronome to keep time by and a short guide.

## Decision

- **Three places and the Profile**: Learn (ADR 0053), Songs (ADR 0106) and Practice, then the Profile as the fourth
  tab (memory-palaces', Noji's), its icon the learner's initial. A bar docked at the foot on a phone, a rail down the
  left on a phone on its side, a sidebar from 1024px as Claude's (R32): the name and its collapse toggle, Search as a field (the modifier and K), the places, Recents (the five songs opened last), the learner at its foot (their picture and name, or Guest, opening the Profile) with Settings' gear beside it; collapsed, a rail of icons with tooltips (a phone keeps the Profile as its last tab and opens Settings from it); the phone's bar on the places alone. Alt with 1–4
  goes to them. A place's bar on a phone has Search. Settings opens from the Profile (the gear in its bar and a row
  under its hero); the Profile's tab stays current under Settings and the account pages on a phone; on a laptop Settings is current alone. Every screen below a place
  has Back.
- **The Profile** is the learner at a glance: their name as its title, their initial, email (or a guest's Sign in),
  one row of three figures (day streak, songs learned, practice time); rows to Settings and the Account; Activity
  (the month's calendar, whether today kept the run in its header); the rest of the record as a short list; badges.
- **Settings** (R32, iOS's Settings and macOS's System Settings; `widgets/settings-screen`, its groups one model in
  `model/sections.ts`): the account first (the learner's initial, name, email and one line of the sync, or Sign in),
  then **App** (General: Appearance and Language; Storage and backup), **Piano** (On-screen piano, with Computer
  keyboard inside it where a mouse or trackpad hovers; MIDI devices, its connection as its value), **Library**
  (Selection toolbar, Swipe actions: memory-palaces' and iOS Mail's, pages of Settings' own), **Support** (User guide,
  Report a problem: a page with its field in sight, greyed offline; About, the version or a waiting update as its
  value), and for an administrator **Administration**. Only what concerns the whole app (R29: the Player's, the
  editor's and each Practice page's settings are behind their own gear; how lessons read is a lesson's Settings').
  **On a phone** one grouped list, each row its icon in a coloured square, each page pushed with Back (to Settings,
  or to the page it is under). **On a laptop** (from 64rem) the two panes of the libraries (Songs' tree and list): the
  sidebar (17rem, `TreeItem` rows with a painted swatch, the account first, the groups headed) stands sticky under the
  bar with its own height and scroll, so the page beside it (44rem) scrolls with the window and never drags it; the
  page shown is marked, a page under a page marking its parent (Edit profile the account, the legal pages About, the
  MIDI log MIDI devices) and keeping its Back; a top-level page has none. A page Settings does not list (a Practice
  page's Settings) stands alone in one column with Back. **About** is a Settings page: the app's icon, name, version
  and build; Software update (its status the value, a tap checks, Install and restart under it when one waits) and
  the licence; Legal (Privacy Policy, Terms of Service, each a row; their pages go up to About); Acknowledgements.
  **The Account** reads as an edit profile: the initial; Profile (the name, Save once changed, the email, Change
  password); for an editor or administrator **Editorial access** (the role, and Preview as learner: the app as a
  learner sees it for the session, its one home); Sync (where it stands, Sync now, what syncs: its one home); then
  Sign out and Delete account…, each red in a group of its own at the foot, a footnote under it, asking through the
  one confirm dialog (the email typed for Delete).
- **Practice is three groups** (canvas 160): **Theory** (Chords, Scales and keys, Intervals, Progressions,
  Accompaniment), the pages that explain a thing and practise it where it is explained; **Exercises**, its three books
  (Finger technique, Barry Harris, Piano With Jonny, each with its count and the library's tile, `EXERCISE_BOOKS`),
  each opening the Exercises library at its place; the **Tools** last (the Chord player, Metronome, Tuner, Chord
  finder, Circle of fifths), the Metronome and Tuner showing what they are set to. One card of rows on a phone, cards
  five across on a laptop. No Up next and no Quiz: nothing the app cannot stand behind, and no trainer beside a topic's page. A page's URL sits under
  its page's.
- **Choosing a root, a quality or a scale** is one row of pickers at the top of the page (`PickerRow`, ADR 0061):
  the root's value with ⌃⌄ opening an octave of twelve keys (`NotePicker`, a black key split "C♯ | D♭"; a pitch alone
  `PitchPicker`), a quality, a voicing or a scale's kind a menu (`MenuPicker`), a key the circle of fifths
  (`KeyPicker`). The step strips with ‹ › and their 17 spellings are gone (round 29).
- **A chord or a scale chosen plays as it is chosen** (a scale up its octave), unless Settings › On-screen piano ›
  Play on selection is off.
- **A thing's page shows it on the keys, read top to bottom**: the keys docked; what it is, with its one honey Play;
  its choices as labelled fields; its sections. **It holds the tools that work on it**, never a tab or a page of their
  own:
  - Chords: the builder (any chord from its parts, ADR 0046; its root, quality and voicing one row of pickers, the
    power chord among the qualities; a size, 7th, suspension, inversion or hands the chord cannot take not drawn, R30),
    its Colour notes (one panel, ADR 0046: Chord tones · Tensions · Avoid, a note the chord can take a toggle that
    adds it to its keys, symbol and sound, `colour=b9,#11`; with `key=` from Scales' Chords or Progressions' chords the
    groups follow its degree, "As ii7 in C major" under the heading), its voicing (a menu
    of the eight, ADR 0046, `voicing=`, one the chord cannot take left out, the chosen one's ⓘ saying what it is with its spelling in C and on this
    chord; a voicing other than close sets the hands, and the inversion where it is not made from a close chord),
    its Fingering (each hand drawn as Scales draws it, beside a row an inversion of each hand's block fingering, the
    keys' own marked; a voicing or a chord of five notes one row of what each hand holds), the fingers on the keys,
    its arpeggio and chromatic walk into the Player; Arpeggio and Play one floating capsule (R29);
  - Scales and keys, its views saying what is in them, **Scale · Chords · Key** (A32; the URL's `show=scale|chords|key`
    kept): Scale (a run from any start; what its keys carry, Notes · Left hand · Right hand, `onKeys=`;
    on a staff, the music first, one layer of labels on it, **Fingers · Degrees · Steps** (`marks=`, fingers by
    default); its fingering hand by hand, each hand drawn with its fingers numbered beside the run's notes and
    fingers; its exercises), Chords (the scale's chords to 13ths on the seven-degree spine, a column a degree, each
    its symbol, numeral and, in a key, its degree's name (the degrees table gone into them), in an inversion, walked,
    each a tap to play and opening in Chords, in the key, from its card's corner: no second row of links) and Key
    (the circle of fifths, its signature, facts: relative (here alone, A32) and parallel keys, the keys beside it on the circle, its
    other spelling where the circle's ends meet, modes; borrowed chords, the books' names under them; the songs in it,
    and Harmonise: the chords that hold a melody note);
  - Intervals: a row an interval over a root, as the reference lists them: a play mark, its short name, its name over
    its size ("3 semitones"), a small keyboard with both keys, every row's drawn at one size; the simple ones (the
    tritone twice, A4 and d5) and those a chord symbol names (♭9 to 13; no 12th; the augmented 9th). A tap plays it
    the way the floating transport says, **Harmonic · Melodic, rising · Melodic, falling** (`way=`, three pictured
    buttons), beside **Play all** (each interval in turn) and Stop (A22). Within the octave each row's ⓘ names songs
    that open with it, rising and falling (the unison once, the tritone under both spellings), each language its own
    list of titles. The cards with a staff are the lessons';
  - **Exercises, Accompaniment and Progressions are one library** (`widgets/practice-library`, R30-4), the Songs
    library's shape and its own parts (the kit's `FilterSheet`, `FilterChips`, `SortChoice`, `RowMore`,
    `FavouriteMark`, `TreeItem`, `SortHeading`): the search with Sort (Book or Style, Name, Level) and Filter (Level;
    Style for Progressions, the tree's own place); on a phone Favourites while there are some, each book (or style) a
    run of rows folded after five with Show all n, Mine last, a row its picture (a progression's its chords as tiles
    tinted by role, `ProgressionTiles`, R34), name, line and level (pips and its
    number), ♡ in its ⋯ and on a swipe; from 64rem the tree (All, Favourites, the books, Mine, Hidden; a count of
    none hidden; 44px rows) beside a table its headings sort (Name, Book, Level; Accompaniment's Hands, each figure's
    name; Progressions' chords). Its view (`q`, `sort`, `place`, `stage`) is the URL's; `place` and `sort` are
    remembered. Creating is the floating honey +. A level is the content's: an exercise's own, a pattern's its book's
    course's, a study's its own; the rhythm styles, the learner's patterns and every progression have none, so
    Progressions shows, sorts and filters by no level;
  - Exercises: its three books; an exercise's page has the ♡ in its bar;
  - Accompaniment: each method book (named in the interface's script: Bobrova, Боброва) and the rhythm styles a
    place of its **patterns only** (R32: content kinds apart), with links to the book's course in Learn and its songs
    in Songs; Mine the learner's patterns, Hidden the built-ins they hid (through `pt-patterns`, so the Player's
    picker agrees). A pattern's ♡ is `pt-patterns`'. Back from a pattern goes to its book's place; a study goes up
    to its method book's course;
  - **Every library is the learner's to arrange** (R32, Songs' acts, the built-in books included, as an overlay in
    `pt-practice-library` version 2): each row's More has Rename…, Move to… (a book, a style, a folder of their own),
    Hide (Show under Hidden) and Restore original name; the pencil in the bar opens Edit, every place and row with
    its handle in one drag context (memory-palaces' engine and overlay), a place's More renaming, hiding or (their
    own folder) deleting it, asking first, its rows going home; New folder. The sort's first choice is Manual;
  - Progressions opens on its library (each style a place, Mine the learner's own). A progression's page
    (`/practice/progressions/$id`, the library's or `mine-n`) has its ♡, its Key and Chords (size), approach chords, its
    chords with their roles and bass moves, the Player's diagrams and staff, Play it in the Chord player, practising in
    all 12 keys, Passing chords as its section and the songs it is in (a second column on a laptop), Play floating. A
    line typed anywhere opens `/practice/progressions/line` (named where the library has it), kept in Mine from its
    bar; the learner's own is changed on its page, renamed by Edit, deleted asked first (ADR 0112). Favourites of
    exercises and progressions and the learner's progressions are `pt-practice-library` (version 1, synced);
    a pattern's page and the editor of the learner's own; a study's page.
- **The Chord finder** (`/practice/chord-finder?keys=&key=`) is the one tool at the keys: the chord a MIDI keyboard
  plays (as its keys went down, read on once they are let go), else the keys tapped (kept in the URL, a link to send).
  One stage in the middle: the chord named as large as the page allows in every reading, over its grand staff, the
  chords played logged on it in turn, then the keys that hold it; the key it spells in, its picker over the stage.
  The key picker reads Spelled in, its ⓘ saying why. Empty (R32), the stage says in one line what to do and offers
  three chords to try (C major, A minor 7th, D dominant 7th); the staff waits for a chord. Its Settings are grouped
  (Chord names: slash chords for inversions; Analysis: the keys that contain it, the key's scale on the keyboard;
  History: keep the last chords) on their own page, not a sheet.
- **A Practice page has a Settings page only where it holds several settings of its own** (A24, R18, R32) at
  `/settings/<page>` (scales, progressions, chord-finder; the Chord player's its own): how the page sounds and looks
  every time, then rows to the on-screen piano and a connected piano. A single setting stays in place (the Tuner's A4,
  a drill's Advance automatically in its setup); the piano's are a row to On-screen piano; so Chords, Intervals,
  Accompaniment and Exercises have no gear, and nothing redirects to the app's Settings. The page's gear opens it (`?from=` names the page, so Back returns
  there); Settings does not list them (R29). The page keeps what you look at.
- **The Metronome** (`/practice/metronome`), its face in Chordify's order: the BPM large between −10 −1 +1 +10, a
  slider and Tap tempo (the average of the last five taps), a square a beat (the first larger, the one sounding
  filled, a tap cycling accent · beat · silent), one honey Play. Every setting is in place, as Chordify's (R32; no
  gear, no settings page): under it, beside it on a laptop, Rhythm (Time signature, Sound: Click, Beep, Drum kit;
  Subdivision: None, Eighth notes, Triplets, Sixteenth notes, Swung eighths), then Practice aids, the speed trainer
  and silent bars, each a switch whose rows open in place and read as a sentence. A click's and a beep's accent is an octave up; the drum grooves are A39's (rock in 4:
  kick 1 and 3, snare 2 and 4; a waltz: kick 1, snare 2 and 3; 6/8: kick 1, snare 4; odd meters by their groups), the
  hat on the subdivision, the kick and snare one loudness.
  Beats are planned on the audio clock a second and a half ahead and topped up by a timer; a change while it plays
  goes on from the beat heard. Space starts it, ↑ ↓ change the tempo; the screen stays on. Its sounds are synthesised,
  so it works offline. Its tempo is named by its Italian tempo word (`tempoWord`, the editor's dial's ladder), the
  word's meaning and range in its ⓘ. **Silent bars** (the bar trainer) play N bars, then mute N bars (1–8 each, saved with the
  Metronome; "Keep counting" over the squares): each beat carries its bar since the start, a muted bar's beats are not
  queued but still shown. The **speed trainer** reads Start at · Goal · Speed up by · Every; while it is on, the tempo
  shown and set is its start.
- **Musical terms** are one list each in the kernel: the tempo words with their ranges (`TEMPO_TERMS`, larghissimo
  to prestissimo; ten name a tempo, the shades between only describe), the editor's expression text in three groups
  (`EXPRESSION_GROUPS`: character, tempo changes, technique), each meaning in both languages.
- **User guide** is Settings' Support: six folding parts in the order a learner meets them, each step beside the icon
  its control wears.
- **Search** (`/search?q=`) lists every named thing by kind, each a row to its page: Practice's pages, songs and
  folders, lessons, chord qualities, scale kinds, progressions, patterns, and exercises. It is one projection
  of the registries, held to each by a test. A chord symbol typed is read as the chord.
- **Words:** a Place is the nav's; Practice has pages in groups; a thing's page is an Explorer; a Tool works something
  out from what it is given.

## Consequences

A link to a tool opens the page that holds it, on what it names. A new page is a row in `PRACTICE_PAGES` and a tile in
`PAGE_TILES`.
