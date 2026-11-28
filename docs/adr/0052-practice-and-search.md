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
  left on a phone on its side, a sidebar from 1024px as Claude's (R32): the name and its collapse toggle, Search as a field (the modifier and K), the places, Recents (the five songs opened last), the learner at its foot as one row (their picture and name, or Guest, and ⌃⌄) opening a menu above it: their email, Profile, Settings, Language with the one in use, Help, then Sign out apart, asking first (Sign in for a guest); collapsed, a rail of icons with tooltips (a phone keeps the Profile as its last tab and opens Settings from it); the phone's bar on the places alone. Alt with 1–4
  goes to them. A place's bar on a phone has Search. Settings opens from the Profile (the gear in its bar and a row
  under its hero); the Profile's tab stays current under Settings and the account pages on a phone; on a laptop Settings is current alone. Every screen below a place
  has Back.
- **The Profile** is the learner at a glance (memory-palaces', the Profile boards, r50): their name as its title
  with the bell and the gear in one glass on both sizes; their picture (76, Edit photo a 30 round on its corner), the
  name at 28 and "@handle · Joined 2025" (or a guest's Sign in); three tiles in one ink, only the flame painted, a
  streak alive (day streak to Streak, songs learned to Songs, practice time to Practice history, in hours alone from
  the first); then **Last 7 days**, **Practice history**, **Badges** and **Achievements**, each a 20 bold heading
  12 over its box, See all at its end. The week's box holds the minutes' scale (0 and two lines) and one bar a day,
  today in copper and the days before in ember, a day not played a flat stub; the plot is 72 on a phone and 150 on a
  laptop. A run's row leads with its score in a 52 tile; a badge's with its medal, a white star on its tier's metal
  (`--medal-*`), and the bar to its next tier; an achievement's with a check on the grass, or a lock before it is
  earned, the earned first. Each box's last row draws no line. A phone reads one column, the sections 32 apart; a
  laptop reads rows that meet, 32 apart: the learner beside the tiles, the week beside the badges, the history
  beside the achievements, each pair stretched to one bottom edge with what it holds centred, and no chevron on
  their rows. **Streak** names its reward: "Today counts. 2 more days to the Gold badge." while the streak badge has
  a next tier. **Achievements**' personal records are a value over its label (the level its number alone, under
  "Level"); a record nothing has set yet, Best accuracy before any take, shows "—", never "0 %".
- **Settings** (R32, iOS's Settings and claude.ai's; `widgets/settings-screen`, its groups one model in
  `model/sections.ts`), each thing placed where Apple places it: the account first (the learner's picture, name and one
  line of the sync, or Sign in), then **App** (General: Language, one segmented English | Русский, the Computer
  keyboard where a mouse or trackpad hovers, Software update last; Appearance, the theme alone, its value in the list;
  Storage and backup), **Piano** (MIDI devices, its connection as its value), **Library** (Selection toolbar, every act
  its glyph on a sand tile and the preview its glyph over its word; Swipe actions, every slot its act's glyph, No
  action the ban sign), **Support** (User guide, Report a problem, About: only the app's facts, its licence, Legal and
  the acknowledgements), and for an administrator **Administration**. General shows "Update available" in the list
  only when one waits. Only what concerns the whole app (R29: the Player's, the editor's and each Practice page's
  settings are behind their own gear).
  **On a phone** one grouped list, each row its icon in a coloured square, each page pushed with Back (to Settings,
  or to the page it is under). **On a laptop** (from 64rem) Settings is a dialog over the page it was opened from, as
  claude.ai's: a Settings address (a row's link, Search's, the gear's) is turned by its route's `opensAsDialog` into
  the page behind's, the place held in the history entry's state and never in the address (`app/settings-dialog`;
  owner, 2026-11-20: claude.ai's address does not change between its places), and `SettingsDialogHost` in the shell
  shows that place's page as the pane; Back steps back through the places, × and Escape go back past them all. The dialog is 22 round, 60rem by 45rem at most (claude.ai's
  Settings), centred on the window, its bar the word Settings and ×; a 16.5rem nav (a search field, the account as a plain row,
  each group's small heading and its places as 40 rows, the open one on the chosen wash, Administration last, whose
  own places replace the list under "‹ Settings") beside the pane (at most 45rem, its title with Back to its parent
  for a page under a page). The pane wears one shape (`settings-pane`, by `data-slot`): sentence-case headings, the
  groups as rows on the pane parted by hairlines, no cards; the same page components serve both sizes, reading
  `useSettingsDialog` where a row differs (Language and Theme at their row's end).
  **The Account** has every Settings page's shape: who it is at its head (the 64 picture, the name, the email), then
  Profile (Edit profile, Privacy with its value), Sign-in and security (Email, its own page: the current address, New
  email, Send confirmation link; Change password), Sync (where it stands beside its dot with when it last synced,
  Changes pending, Sync now; what syncs behind its ⓘ: its one home), for an editor or administrator **Editorial
  access** (the role, and Preview as learner: its one home), then Sign out and Delete account… alone 16 further, each
  red and asked first (the word typed for Delete). Signed out: "You are not signed in.", why it matters, Sign in and
  Create account. **Storage and backup** reads Device storage, Backup, Piano sound, then its two losses together at the
  foot and apart (Remove downloaded piano, Reset progress).
  **Legal** is one document a page, no tabs: its name in the bar, when it last changed, a heading and a paragraph a
  section, the other document as one link row at its end; on a laptop the contents a band of links at the top and
  the text in two columns. **The account pages** (Sign in, Create an account, Forgot, New password) carry their name
  in the bar beside Close, one column 16 apart (440 and centred under the app's mark on a laptop), every field the
  one `FormField`.
- **Practice is three groups** (canvas 160): **Theory** (Chords, Scales and keys, Intervals, Progressions,
  Accompaniment), the pages that explain a thing and practise it where it is explained; **Exercises**, its three books
  (Finger technique, Barry Harris, Piano With Jonny, each with its count and the library's tile, `EXERCISE_BOOKS`),
  each opening the Exercises library at its place; the **Tools** last (the Chord player, Metronome, Tuner, Chord
  finder, Circle of fifths), the Metronome and Tuner showing what they are set to. One card of rows on a phone, cards
  five across on a laptop. No Up next and no Quiz: nothing the app cannot stand behind, and no trainer beside a topic's page. A page's URL sits under
  its page's.
- **Choosing a root, a quality or a scale** is one row of pickers at the top of the page (ADR 0061):
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
  - Intervals (canvas 170): the interval chosen (`iv=`, the perfect 5th first) is the page's subject: its name, with
    an ⓘ holding what it sounds like, songs it rises and falls in (each language its own titles) and what it inverts
    to; its size and notes ("7 semitones · C up to G"); its staff on the paper, the song it sounds like under it, with Hear it;
    the page's pinned keys show it. Under it Simple · Compound and the intervals as tiles, seven a row, each its short
    name and semitones (the tritone twice, A4 and d5; the compound ones a chord symbol names, ♭9 to 13); a tile chooses
    and plays. Then From (the root) and Play as, **Ascending · Descending · Harmonic** (`way=`), in a column beside
    the interval on a laptop; **Play all** floats. The cards with a staff are the lessons';
  - **Exercises, Accompaniment and Progressions are one library** (`widgets/practice-library`, R30-4), the Songs
    library's shape and its own parts (the kit's `FilterSheet`, `FilterChips`, `SortChoice`, `MoreMenu`,
    `SortHeading`): the search with Sort (Book or Style, Name, Level) and Filter (Level; Style for
    Progressions), and under it the places as chips on both sizes (All, Favourites, the books or styles, Mine,
    Hidden); on a phone Favourites while there are some, each book (or style) a run of rows folded after five with
    Show all n, Mine last, a row its picture (a progression's its chords as tiles tinted by role, `ProgressionTiles`,
    R34), name, line and level (pips and its number), ♡ in its ⋯ and on a swipe; from 64rem no places pane (R67): one
    table, its rows under each place's heading and folded as the phone's, its columns Name, then the kind's own
    (Exercises: Exercise and Level; Accompaniment: Pattern and Level; Progressions: its chords and Major or Minor), ♡
    and ⋯ at the row's end, its headings sorting. Its view (`q`, `sort`, `place`, `stage`) is the URL's; `place` and
    `sort` are remembered. Creating is the floating honey + on both sizes. A level is the content's: an exercise's own, a pattern's its book's
    course's, a study's its own; the rhythm styles, the learner's patterns and every progression have none, so
    Progressions shows, sorts and filters by no level;
  - Exercises: its three books; an exercise's page has the ♡ in its bar, and its score leads it (R67): its first four
    bars, two systems of two, fitted together to the column (one 880 column on a laptop), then its choices as rows
    with the value at the row's end (Hands, Rhythm, Next key, Octaves), How in a card last;
  - The subject of Intervals, a progression's chords and a pattern's bar stand on the paper, never in a card, a
    caption under them (R67);
  - Accompaniment: each method book (named in the interface's script: Bobrova, Боброва) and the rhythm styles a
    place of its **patterns only** (R32: content kinds apart), with links to the book's course in Learn and its songs
    in Songs; Mine the learner's patterns, Hidden the built-ins they hid (through `pt-patterns`, so the Player's
    picker agrees). A pattern's ♡ is `pt-patterns`'. Back from a pattern goes to its book's place; a study goes up
    to its method book's course;
  - **Every library is the learner's to arrange** (R32, Songs' acts, the built-in books included, as an overlay in
    `pt-practice-library` version 2): each row's More has Rename…, Move to… (a book, a style, a folder of their own),
    Hide (Show under Hidden) and Restore original name; the bar's Edit word (the kit's, beside the title) opens Edit, every place and row with
    its handle in one drag context (memory-palaces' engine and overlay), a place's More renaming, hiding or (their
    own folder) deleting it, asking first, its rows going home. New makes what the page makes (a pattern, a
    progression) and New folder, the kit's `NewDial`, floating at the foot on both sizes (`useLibraryNew`, R67). The
    sort's first choice is Manual;
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
- **The Chord player's screen** (`/practice/chord-player`, canvas R77, `r58_chordplayer.py`; the sheet and its
  engine are ADR 0112's): a full screen in the Player's model, no sidebar, its view in the URL (`panel`, the rail's
  panel when not Chords; `keys=off`, the keys hidden), remembered in `pt-views`.
  - **From 64rem, the band** (the kit's `Band`, 64, ink): ✕ up to Practice; the sheet's name with Live or Draft
    under it, a menu of the sheets opened last (the open one checked), a hairline, New sheet, All chord sheets,
    then the file's acts: Share…, Export › (MIDI, Chart .txt, a submenu), Import chart…, Randomize chords, Save to
    my progressions, Open in Progressions, and Save and Discard draft while there is a draft; the transport
    (`BandTransport`): Go to start, Play with Playback options under its ▾, the metronome pressed through
    Count-in, On and Off (each press said in a toast; On a click on every beat while the sheet plays, the bar's
    first accented, the sheet's `click`), Loop; the sheet's Key, Tempo and Style as `BandPill`s, each opening its
    `PanelPopover` under it (Key the kit's root grid in the sheet's mode, a key taken moving the chart the short
    way, −5 to +6); MIDI (the keyboard, Follow a MIDI arranger); Undo and the keys at its end.
  - **The rail** (`Rail`, 76): Chords (the key's chords, tapped or dragged into a bar), Styles (rows, the chosen
    checked), Genos, Audio (Piano, Bass, Drums, Volume; Voicing), Chart (Time signature, Written as). Its panel
    (`RailPanel`, 352) opens beside it, « folds it; the chart takes the rest, the keys docked under it. While
    following and another panel is open, the Genos docks over the keys in its compact row.
  - **Under 64rem, the phone's header** (`PhoneBand`): ←, the transport capsule (Go to start, Play, Loop, Playback
    options), the keys, ☰. ☰ (`PhoneMenu`) is a card under it: the sheet's name, its places as rows (Chords,
    Style, Key, Tempo, Repeats, Audio, Chart, MIDI), each a `PhonePage` with ← back to ☰, then the file's acts.
    The Genos sits compact over the keys; Full and Minimize at its end.
  - **Playback options** is one white card on both sizes: Repeats with its stepper, Count-in under its name, and
    on a phone the Metronome switch, the header having no metronome.
  - **All chord sheets** (`LibrarySheet`) is a 320 popover at the name from 64rem and a `PhonePage` under it: My
    chord sheets (the open one in link blue; each row's ··· Rename, Duplicate, Delete, which goes at once with Undo
    and leaves the sheet in hand Not saved when it was the open one; when none, "None saved yet. Save the sheet in
    hand from its name."), Songs, then Progressions by style as chips over two-line rows. Rename rises over it.
  - **The keys** (`litKeys`) show the chord picked, else the first, as its hands' wash while stopped or counting
    in, and the chord sounding in full where it is shown (`LiveKeyboard`'s `sound`, in place of the voicing's own
    keys): its root or slash bass in the left hand, its tones an octave above; kept in sight (`inView`). Play turns
    to Stop, a square, as it is pressed.
  - **The chord's sheet** hangs under its chord on a laptop (a 460 popover) and is a sheet on a phone that stands
    on the keys (`SheetContent`'s `foot`: it and its scrim end at their top, the keys lit with the chord and
    playable while it changes, 16 under its last row): Chord, Bass note, Duration in a white card, Suggested chords
    (the key's, likeliest first, less the chord picked) under a sentence-case head, then Delete · Duplicate ·
    Play from here.
  - **The Genos** (`ArrangerStrip`) while Follow a MIDI arranger is on: in the rail's panel it is in its place (no
    size controls, its title on one line); over the keys it is Compact (a 64 row, Start/Stop as its glyph and Main
    A–D at 44), Full (Intro, Main, Break and Ending under its head, each group named in sentence case) or
    Minimized (a glass pill, "Genos · Main A"). A section's tag under its head names what is set for it (Intro I ·
    Main A, Main B · Fill in), or reads Genos in soft ink when nothing is.
  - **Play leads, with or without a Genos** (owner, 2026-11-27: "the mode with the aranger should work the same as
    with no, the only difference should be that on the right timing it sends to the genos what styles to play …
    the chords are not sent to the genos"; "imitate the styles when no genos is connected and let me play even if
    no genos is connected, and the status no connection is like in this midi menu"). `useArrangerPlay` drives Play
    and the panel in every mode. With a Genos connected the band keeps the time in silence (the count-in heard)
    and `useArrangerFollow` sends it MIDI Start on the sheet's first chord, the app's clock (24 a beat, handed to
    the browser 120 ms ahead), each bar's Section Control as the bar begins (`arrangerCues`), Stop at Stop, and
    after an Ending lets it play out before Stop; a sheet with an Intro waits for the Genos's first Main heard.
    Never a chord or a note: the Genos detects the chords played. With none connected the app's band stands in
    (`imitatedPlay`, `imitatedOrder`): Main A–D play variations 1–4, a Fill-in plays the style's fill in its bar,
    Break strikes its bar's first beat and rests, an Ending strikes its bar and holds it, the run ending there, and
    Intro I–III plays the sheet's last 2, 4 or 8 bars before the first; a section pressed while it plays is taken
    at the first bar not yet queued, one pressed while stopped is where the next Start begins. The head says who
    plays (the Genos, or the style by name) and whether it plays; under it the connection in a line as the MIDI
    keyboard's popover says it, with Try again for a refused prompt or no Genos found. Start/Stop rests on a sheet
    with no chords, as Play. On the Genos: Menu › MIDI › System, Clock USB, Start/Stop Style, System Exclusive
    Message Receive On.
  - **The last sheet opens:** the route remembers `sheet` (`remembered`), so a plain open returns to it; opening a
    sheet marks it (`markOpened`).
  - **Its settings are in place:** what was the Settings page's (Sound, Playing, Chart, MIDI) lives in the rail's
    panels and the band's popovers; each preference's home is `ChordPlayerPanels.tsx` (`settings-homes.test.ts`).
    R76's Edit layout, the floating dock, the page-layout store and Settings › Page layouts are gone; their
    `pt-page-layouts` save stays on the device untouched.
- **A Practice page has a Settings page only where it holds several settings of its own** (A24, R18, R32) at
  `/settings/<page>` (scales, progressions, chord-finder): how the page sounds and looks
  every time, then rows to the on-screen piano and a connected piano. A single setting stays in place (the Tuner's A4,
  a drill's Advance automatically in its setup); the piano's are a row to On-screen piano; so Chords, Intervals,
  Accompaniment and Exercises have no gear, and nothing redirects to the app's Settings. The page's gear opens it (`?from=` names the page, so Back returns
  there); Settings does not list them (R29). The page keeps what you look at.
- **The Metronome** (`/practice/metronome`), its face in Chordify's order: the BPM large between −10 −1 +1 +10, a
  slider labelled at its ends (30 and 300) and Tap tempo (the average of the last five taps), a square a beat (the
  first larger, the one sounding filled, a tap cycling accent · beat · silent), one honey Play. Every setting is in
  one home, one group of rows under the face (R67; no gear, no settings page): Time signature (a stepper),
  Subdivision (None, Eighth notes, Triplets, Sixteenth notes, Swung eighths) and Sound (Click, Beep, Drum kit) each
  its value opening a sheet of choices, Volume (a stepper), Flash on the beat (a switch), then the Speed trainer and
  Silent bars, each its value ("Off", or what it does) opening its sheet. On a laptop the page is one centred column
  of 760 (`ToolPage`'s `column`; the Tuner's 720), as the board. A click's and a beep's accent is an octave up; the drum grooves are A39's (rock in 4:
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
  of the registries, held to each by a test. Every name is found in either language (a Russian learner typing
  "tuner" finds the Тюнер), the app's own pages as much as content. A chord symbol typed is read as the chord, its root in either case (dm7 is Dm7, dm7 g7 c a line of chords), and a scale typed with its tonic, by letter or as a Russian musician says it ("D minor", "F♯ dorian", "ре минор", "фа-диез мажор"), opens
  that scale's page on it; symbols print engraved (♯, ♭). A chord quality's row shows its symbol on C, a scale kind's its notes on C (Major blues: C D E♭ E G A), shown but never searched. Printed accidentals fold to typed ones (C7#9 finds C7♯9, Bb finds B♭). Nothing found is no dead
  end: it names what was missed, says how to search instead, and lists the Suggestions to go on from.
- **Words:** a Place is the nav's; Practice has pages in groups; a thing's page is an Explorer; a Tool works something
  out from what it is given.
  **Focus** (the sidebar's head, beside its toggle): the sidebar and the side panels of content hide for the session and the screen takes the window; Exit focus stands first in the bar, before Back or the title, and Esc leaves (`use-focus-mode.ts`, the `focus-mode:` variant). A capsule at the foot was tried on the canvas and lay over the keys.

## Consequences

A link to a tool opens the page that holds it, on what it names. A new page is a row in `PRACTICE_PAGES` and a tile in
`PAGE_TILES`.
