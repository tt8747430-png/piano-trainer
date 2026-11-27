# R39-10 · Chord player, redesigned

Premium here means a chord sheet that reads like a lead sheet and plays like Musicca's chord player: sections of bars,
each chord tapped to change it, the keys showing what sounds, nothing on screen that is not the song.

## The rulings as they stand

- **The section's sheet and Share, the same heads** (the loop, 2026-11-27). Why: similarity (one shape per kind of sheet) and ui-and-mockups, Words (no explanation under a control): Intro, Main per pass (Main, 1st time; Main, 2nd time, as a repeat is said), Into the next section and Ending are each a 15/600 head over the kit's segmented control, 24 apart; Share's People with the link the same; the grey groups, the MAIN caption and "None sends nothing" are gone.
- **The Genos lamps and MIDI, the app's own signs** (the loop, 2026-11-27). Why: crimson means wrong or a loss (seven-questions 4, DESIGN.md), so the chosen section (Main A) is no longer a red-filled lamp; chosen is the rail's chosen wash with an ink ring, the next a honey-deep ring, as the app marks what is on. The paragraph under Follow a MIDI arranger was an explanation under a control (ui-and-mockups, Words); it is gone, the panel's head already saying who plays. Follow's row is the white card as the rest. MIDI is complete where it opens, as the Player's MIDI keyboard popover (R74): Keyboard with its value and, with none, how to connect one, then Follow a MIDI arranger; the row that linked away to Settings is gone.
- **Audio, Chart and Style in the Player's page shape** (the loop, 2026-11-27). Why: one shape for one kind of page (similarity; the Player's and the editor's Audio page, `AUDPANEL`): the Chord player's Audio and Chart drew a grey group with an uppercase PLAYING caption; they are the kit's white card, then a sentence-case head over its segmented control (Voicing, Written as), 24 apart, the same in the laptop panel. Style on a phone was a wheel sheet with Done while the laptop lists the styles as checked rows; ☰'s Style opens that list as a page with ← (R74: every page a ☰ row opens is a page). Key, Tempo and Repeats keep the app's wheel pickers.
- **Audio, the Player's word; the chart its own glyph** (the loop, 2026-11-27). Why: one word per thing (ux-writing, Harmonize): the Player and the editor call their sound panel Audio, the Chord player called it Sound; it is Audio on the rail, in ☰ and on its page. The Chart panel wore the editor's Layout table; it wears a page of text (Lucide file-text), the chart being how the chords are written.
- **One icon, one meaning** (the loop, 2026-11-27). Why: layers is the Player's Versions; the Chord player wore it for Style and both progressions acts. Style is Lucide's drum on the rail and in ☰, Save to my progressions list-plus, Open in Progressions list-music (ux-principles, One thing, one icon).
- **Export, the Player's shape** (the loop, one shape per thing, 2026-11-27). Why: the Player and the editor export through one Export row whose formats open beside it (a submenu on a laptop, a page with ← on a phone); the Chord player listed Export MIDI and Export chart as two rows of their own. Its Export row now holds MIDI and Chart (.txt); its file acts read Share…, Export ›, Import chart… on both sizes. Share… keeps its own word: it opens live sharing with its options, not a copied link.
- **The band under 1280** (the loop, every width, 2026-11-27). Why: at 1024 (a small laptop, an iPad on its side) the Player's band overflowed by about 70 and the Chord player's by about 30; every act stays, so what gives way is what can say less: Version history folds to its clock (its time in its tip), the song's or sheet's name shrinks first to 120 and truncates. Under 768 the phone's header takes over. A bar's last control names itself flush with the screen's edge, never centred past it (HIG, help tags). Built as a container query on the band (`BANDNARROW`, `r41_kit.py`; `r71_tips.py`).
- **The Chord player in the Player's model** (owner, 2026-11-27: "now begin with the refactoring of the chords
  player the same way you did with the laptop and mobile layout and such things"). Canvas R77 (`r58_chordplayer.py`,
  `lm77`, `ph77`). This supersedes R76's "The layout is the learner's" below for its Edit layout, the floating
  Controls dock, the gear and the Chords column: one place for each panel, as the Player's and the editor's; the Genos
  keeps its Full, Compact and Minimized. Sources: the Player's and the editor's boards (`player/r74_versions.py`,
  `r44_editor.py`); Flat's score page (its dark band, the rail of panels, the keyboard docked at the foot); Apple HIG,
  Toolbars and Sidebars.
  - **Laptop:** the full screen, the app's sidebar gone. The band, 64, dark: ✕ (back to Practice); the sheet's name
    with Live or Draft under it, a menu of the recent sheets, New sheet, All chord sheets, then Share…, Import chart…,
    Export MIDI, Export chart, Save to my progressions, Open in Progressions, and Save and Discard draft when there is
    one; the transport as the Player's (Go to start, Play with Playback options under ▾: Repeats and Count-in, the
    metronome pressed through Count-in, On and Off, Loop for the section); the sheet's Key, Tempo and Style as the
    band's pills, each opening its popover under it; MIDI (the keyboard, Follow a MIDI arranger); Undo and the keys
    at the band's end. Under it a rail, 76: Chords (the key's chords, tapped or dragged into a bar), Styles (the
    styles as rows, the chosen one checked, its feel beside it), Genos (the arranger's panel in full: who plays and
    whether it plays, the connection under it with Try again, Main A–D and Break, Intro I–III, Ending/rit. I–III;
    Follow a MIDI arranger under it), Audio (Piano, Bass, Drums, Volume; Voicing), Chart (Time signature, Written
    as); Search and Shortcuts at its foot. A panel, 352, opens beside the rail, « closes it. The chart takes the
    rest, its name in the band; the keys dock under it, the band's keys button showing or hiding them. While
    following and another panel is open, the Genos docks over the keys in its compact row (Start/Stop, Main A–D, ⌃ to
    its panel).
  - **Phone:** Flat's phone header: ←, the transport capsule (Go to start, Play, Loop, Playback options), the keys,
    ☰. The chart keeps its name over it (the name's menu: the sheets). ☰ drops the sheet's places as rows (Chords,
    Style, Key, Tempo, Repeats, Audio, Chart, MIDI), then Share…, Export MIDI, Export chart, Import chart…, then Save
    to my progressions and Open in Progressions; each place a page with ← back to ☰. The Genos sits compact over the
    keys, Start/Stop as its glyph (Main A–D hold 44 each only so), Full and Minimize at its end.
- **The layout is the learner's** *(Edit layout, the dock, the gear and the Chords column superseded 2026-11-27 by R77, above.)* (owner, 2026-11-18: "i want more user customizable ui like draggable resizable,
  hidible, minimizable toolbars dragging to the left and putting it there or draggind to the top … genos controls on
  phone or on laptop are bad designed as on phone it occupies too much space and is not hidable, resizable,
  minimizable, draggable … the layout should be saved and resetable in the app setitngs for teh individual page or for
  the whole app … it correctly opens the last opened or saved scores and teh settinsg should be refactored"). Canvas
  R76 (`r58_chordplayer.py`). Sources: Apple HIG, Toolbars (let people customize a toolbar); iPadOS's Customize
  Toolbar; Logic Pro's Customize Control Bar; Photoshop's and Dorico's workspaces (kept per window, reset from one
  place); WCAG 2.2, 2.5.7 Dragging movements (every drag has a single-tap way).
  - The chart is the page and never moves. Four panels around it: **Keys** (Top or Bottom; Small, Medium, Large),
    **Controls** (Style · Key · Tempo · Repeats · Play; Floating or at the Top; Full or Play only), **Genos** (Top,
    Floating, Bottom, and on a laptop Left or Right; Full, Compact, Minimized) and, on a laptop, the key's **Chords**
    (Left or Right; Narrow or Wide). Any panel but the chart can be hidden.
  - **Edit layout**, from ··· or the gear's Layout: each panel is outlined with its tag (a grip and its name); the grip
    drags it, or a tap on it lights the places it may go as honey zones and a tap there puts it; the tag's menu sets
    Place, Size and Hide. Hidden panels wait in a tray under the bar (+ Keys). The bar holds Reset and Done.
  - **The Genos never takes the phone:** Compact by default (Start/Stop and Main A–D in one row), Full one tap away,
    Minimized to a pill ("Genos · Main A") from its own head at any time, edit or not. On a laptop it defaults to the
    right column.
  - **Saved and reset:** every change is saved at once for the page; the gear's Reset layout puts it back with Undo;
    Settings › General › Layout › Page layouts lists each page changed with Reset, and Reset every page, with Undo.
  - **The last sheet opens:** the Chord player opens on the sheet last open; its name is a menu of the recent sheets
    (the open one checked), New sheet and All chord sheets.
  - **Export** (owner, 2026-11-21: "make me export"): ··· holds Export MIDI (the band once through, a track a part)
    and Export chart (the chart as text), after Share…; Import chart… before them reads such a chart back
    (owner, 2026-11-21: "and import"). A song or progression put in hand keeps its name, so the last
    sheet reopens by its name (owner, 2026-11-21: "that it opens in the last opened").
  - **Settings by how often wanted:** Sound (Piano, Bass, Drums, Volume), Playing (Count-in, Voicing), Chart (Time
    signature, Written as), MIDI (Connect a piano, Follow a MIDI arranger, Arranger), Layout (Edit layout, Reset
    layout, Every page's layout). ··· is the kit's menu at its button (Save and Discard draft when there is one,
    Share…, Edit layout, Save to my progressions, Open in Progressions), no longer a sheet.
- Next after the Chords page (owner, 2026-11-13: "after that continue with the chords player and make all of its
  features … add to instructions to continue with the chords player after you finish with the chords page"), with
  Musicca's chord player beside it (screenshots: sections of bars with beat ticks, + after the last bar, Add section,
  Randomize chords; Play, 100, Pop 1, Settings, File; a chord's sheet: Chord root and quality, Bass note, Duration
  − 4 beats +, Suggested chords, Delete and Done). Every feature it has, and:
  - **Start from any chord:** tap a bar and play from it.
  - **Count-in** before the song.
  - **Duplicate a chord.**
  - **A chord's timing is the learner's:** "if I set timing to these chords I want them to be so and not
    automatically changed when I change a chord": reordering or changing a chord never retimes the others. A bar
    whose beats no longer add up is kept as it is, marked with a ! that says its timing is wrong and opens that
    chord's Duration; nothing else moves.
  - **Easier timing:** Duration as Musicca's − n beats + in the chord's sheet, and the bar's beat ticks.
  - **Easier adding:** + after the last bar of each section opens the chord's sheet on the next suggested chord.
  - **Auto-scroll:** the sheet follows the chord playing.
  - **Bugs:** the chord sheet is not saved (it must be, as a saved store); drag and drop breaks (port
    memory-palaces' fix, read in that repo); reordering changes other chords' timings (fixed by the rule above).
  - **Drag across sections** (owner, 2026-11-13: "and also dragggin into other sections should be possible"): a
    chord dragged out of its section drops into any other, between any two chords or at a section's end, by finger,
    mouse and keyboard; it keeps its own length, and neither section retimes (a bar that no longer adds up takes its !).
    An empty section still takes a drop.
  - **Play leads; the Genos gets only its sections; with no Genos the app's band plays them** (owner, 2026-11-27:
    "the chords are only for the display and the timing, the mode with the aranger should work the same as with no,
    the only difference should be that on the right timing it sends to the genos what styles to play or what intro
    or what ending and so on, or the count in and such things … the chords are not sent to the genos … the chords
    that i actually play are being detected automatically by the genos"; then "can you imitate the styles when no
    genos is connected and let me play even if no genos is connected, and the status no connection is like in this
    midi menu that we have"). This replaces "the Genos leads" below. Play (and the panel's Start/Stop) works in
    every mode, as without an arranger: count-in, the lit sheet, its tempo. A connected Genos gets MIDI Start on
    the first chord, the app's clock, each bar's Section Control as it begins, Stop at Stop; never a chord or a
    note; the band is silent. With none connected the app's band imitates the panel: Main A–D its variations 1–4,
    Fill-in, Break, Ending (struck and held, the run ends) and Intro I–III (the sheet's last 2, 4, 8 bars played in),
    each pressed section taken at the next bar. The panel's head says who plays (Genos, or the style's name) and
    whether it plays; under it the connection as the MIDI keyboard's popover says it ("No Genos found. The app's
    band plays the style's sections." with Try again). Sources: Yamaha Genos Reference Manual, MIDI › System (Clock,
    Start/Stop); the Genos Data List's Section Control.
  - *(Superseded 2026-11-27, above.)* **Follow a MIDI arranger (Yamaha Genos): the Genos leads** (owner, 2026-11-13: "I dont want my chords to be
    played. just to sync the timing", then "when I start on the genos it should sync with genos and understand that
    it started and our app automatically starts"): the app sends nothing and plays no chords. It listens on the
    Genos's USB TO HOST: MIDI Start (FA) starts the Chord player from its first bar (Continue, FB, from where it
    stopped), Stop (FC) stops it, and its MIDI clock (F8, 24 a beat) sets the tempo and moves the beat, so the sheet
    follows the Genos's style while the learner plays the chords on its keys. Where the Genos sends Yamaha's Section
    control (F0 43 7E 00 ss 7F F7) as its Main A to D change, the sheet moves to the section of that letter. The
    Genos must send clock and start/stop (its MIDI transmit settings, to confirm in the Genos manual). Web MIDI runs
    in Chrome and Edge on a Mac or PC, never in Safari on a Mac or any iPhone browser (MDN, caniuse): there the row
    says so and names Chrome or Edge. Built as "Follow a MIDI arranger" in the Chord player's settings, beside
    Connect a piano, with a mark in the bar while it waits for Start. Not testable here without the instrument; a
    fake MIDI port drives it in the browser checks.
  - **The sheet sets the Genos's sections** (owner, 2026-11-13: "I want to be able though to set the transitions for
    the sections automatically like from the verse to chorus and also while playing two times the verse I want to be
    able to set that the Yamaha plays what types like a b c or d and when I dont set then it plays normally. and also
    the endings and the intro"): this replaces "the app sends nothing" for sections only; it still never sends chords
    or notes. Each section of the sheet carries, in its own sheet, an **Intro** (I–III or none, before the first
    section), its **Main** per pass (Main A–D, set apart for each repeat: the verse's 1st time A, 2nd time B), a
    **Fill-in into the next section** (on its last bar: Fill in, Break or none), and the last section an **Ending**
    (I–III or none). Each is sent on the Genos's MIDI clock at the bar line it falls on, as Yamaha's Section Control
    message (F0 43 7E 00 ss 7F F7; ss as the Genos Data List gives it: Intro I–III, Main A–D 08–0B, Fill in, Break,
    Ending I–III; to be checked against the Data List before it ships). Anything left unset sends nothing, so the
    Genos plays as its own panel says. Sending SysEx needs Web MIDI's SysEx permission, asked for when the learner
    turns Follow a MIDI arranger on. Shown on the sheet as a small tag on the section's head ("Main B · Fill in"),
    on the canvas first.
  - **The Genos's style controls, from the Chord player** (owner, 2026-11-13, the Owner's Manual's "Operating
    Style Playback", pp. 63–65: "the chords player should support these controls also … and if you need something
    else search in the user manual and other resources"): with Follow a MIDI arranger on, the Chord player's bar
    gets an arranger strip, laid out as the Genos's panel and named as it is: **Start/Stop**; **ACMP** (on: rhythm
    and auto accompaniment; off: rhythm alone); **Sync Start** (standby until a key, or a left-hand chord with ACMP
    on; pressed while playing it stops and waits again); **Sync Stop** (the style plays while the chord section is
    held; needs ACMP, and not with Full Keyboard fingering); **Intro I–III**; **Main A–D**, the chosen one marked,
    pressed again for its fill-in; **Auto Fill-in**; **Break** (one bar, back to the Main); **Ending I–III**,
    pressed again for rit.; **Fade in/out**; **OTS Link**. Each lamp as the panel's: on (chosen), flashing (next),
    available, off (no data). The sheet's own sections (above) still set Intro, Main per pass, Fill-in or Break and
    Ending, now Intro I–III and Ending I–III as the Genos has them; a press on the strip overrides the sheet until
    the next section. Every message (Start, Stop, Section Control, ACMP, Sync Start, Sync Stop, Fade, OTS Link) is
    taken from the Genos Data List and the Reference Manual before it is built, each cited with its page; a control
    the Genos does not take over MIDI is drawn as its panel lamp only, following what the Genos reports, or left
    out, and the report says which. Still never chords or notes. On the canvas first.
    Found so far (PSR Tutorial forum, 2022, quoting the Data List's Section Control): F0 43 7E 00 ss dd F7, ss 00–02
    Intro I–III (03 the fourth, which the Genos lacks), 08–0B Main A–D, 10–13 Fill-in A–D, 18 Break, 20–22 Ending I–III;
    dd 7F on, 00 off. Start and Stop: MIDI Start (FA) and Stop (FC), which the Genos takes only with its clock set to
    External, so the app sends Section Control and listens for Start and Stop; Yamaha's style start/stop SysEx and
    ACMP, Sync Start, Sync Stop, Fade and OTS Link are still to be found in the Genos Data List (MIDI Data Format)
    before the strip's buttons for them are built.
  - **Every change kept as a draft** (owner, 2026-11-13: "all the changes I do to the sheet should be automatically
    saved, either as draft and then I can save and change the current chords from the draft"): each edit is saved
    at once, on the device, as the sheet's draft; the sheet's saved chords stay as they were until Save, which makes
    the draft the current chords (Discard draft goes back to them, with Undo). A sheet with a draft says so beside
    its name and opens on the draft; nothing is lost on leaving, reloading or going offline. A shared sheet sends
    only what is saved to the open links.
  - **Shared live** (owner, 2026-11-13: "when I share the chords sheet it is online and automatically syncs with the
    other links that are opened"): Share makes the sheet an online sheet with a link; every open copy (the owner's
    and each link's) shows each change as it is made, through Supabase Realtime on the sheet's row (Postgres
    changes, or a broadcast channel per sheet), the last edit winning bar by bar. Sharing asks for an account (it
    reaches other people, ADR 0116: the server must answer); the sheet stays saved on the device too and catches up
    when back online. Who may edit through the link (view only, or edit) is a choice in Share, view only by default.
    **The chord playing is live too** (owner, 2026-11-14: "I also mean live updates meaning the chords being played
    online. like while playing the chords that are being played are also online with what chords is currently
    played"): every open copy lights the chord, its beat and the keys of whichever copy is playing; its own Play takes
    over while it plays. The sheet's name carries a Live mark (a grass dot, honey while another copy plays).
    **The selection follows the chord playing** (owner, 2026-11-14: "the chord from where it began didn't get
    deselected"): Play lets go of the chord it started from; while a chord sounds its ring is the only one; on Stop
    the selection stays on the last chord played, where Play goes on from (Musicca's).
    **Follow without an arranger plays the sheet** (owner, 2026-11-14: "the chords played is not shown while the
    follow a midi arranger is enabled but not connected to the midi and the buttons play are not working"): the Genos
    leads only while it is connected; with Follow on and none there, Play plays the sheet as usual and lights it, and
    the strip says why ("Genos · Not connected. The sheet plays by itself"), its panel buttons dimmed and Start/Stop
    gone until one is connected.
  - **Saved, synced and migrated** (owner, 2026-11-13: "I want to be able to save the like this as chord sheets
    and sync to my account and also the older ones should be able to migrate to this new structure effortlessly"):
    a sheet of bars is saved as text in the `chord_sheets` store, synced to the account like every saved store; a
    sheet written before bars (no `|`) is laid into bars as it is read, a bar per meter's beats, a chord that crossed
    a bar line kept whole in its bar (which takes the !). This overrides "no migration" for chord sheets only: the
    store's version stays, nothing is lost.
  - **The beats shown** (owner, 2026-11-13: "I want also to see the beats in the chords player"): each bar shows its
    beats as Musicca's ticks, and while playing the beat sounding is lit, the count-in's too.

- **Musicca's chart and dialog, tap to select, the dock over the keys** (owner, 2026-11-14, Musicca's chord player
  beside it: "make the ui of the chords like the musicca does"; "one tap on the chord selects it and plays from there
  when I play and double click opens this chord settings"; "the currently played chord should be selected like this
  when playing"; "the drag so change the timing like the musicca does also should be supported"; "the floating bar …
  doesnt stand above the content like pinned above the keyboard but sits under the chords sheet"; "improve the genos
  actions bar … better ui"). Canvas v173, `r58_chordplayer.py` (R59). Each chord a white box as wide as its beats
  (two bars a row on a phone, four on a laptop), its beats ticked along its foot, its name large with its extension
  raised (Cm⁷, B♭sus2, F⁷/A); a + box ends each section; no paper card, no bar lines. A section's head is Musicca's:
  its name (opening its sheet), × n, Variation n, delete (Undo), grip; its Genos tag under it while following. One tap
  selects a chord (ringed); Play starts from it; a double tap opens its sheet. The chord sounding wears the same ring
  on its honey wash, its beat's tick in ink. The selected chord's right edge carries Musicca's handle: dragged, it
  sets the chord's length in beats, nothing else retimed. The chord's sheet is Musicca's dialog: Chord (root ⌄,
  quality ⌄), Bass note ⌄, Duration − n beats +, Suggested chords four across, then Delete · Duplicate · Play from
  here. The keys are pinned at the foot; the dock floats just above them, over the chart, on a phone and a laptop
  alike; the Genos strip floats over the dock as a card showing every control at once: its state and Start/Stop,
  Main A–D and Break, Intro I–III and Ending/rit. I–III (two rows on a phone, one on a laptop), only what the Genos
  takes over MIDI.

## Today

`src/pages/chord-player`, strings `practice.ts` `chordPlayer`. A bar with four icons and ···; New chord sheet ▾,
Pop 1 ▾, Tempo 100 − +, Key C major ›; one Verse with Repeat ×1, bars 1–4, "0 bars" and a + tile; Add section and
Randomize chords; a floating Play and loop button over the keys.

## Will build (canvas row 10)

Phone: Back, the sheet's title ▾ (Chord sheets), Undo, gear, ··· (Redo, New, Chord sheets…, Save as my chord sheet…,
Randomize chords, Open in Progressions, Practise in the Player, Share link). Style ▾ (a sheet by family, each style
with a one-bar Listen) · Key ▾ (root grid, Major · Minor) · Tempo − 96 BPM +. Sections: grip, name ▾, n bars, Repeat
− × n +, ···; bars four to a row, numbered, a bar holding one or two chords by their length; + adds a chord; + Add
section. A chord opens a sheet: its name and length, In the key (C Dm Em F G Am Bdim with numerals), Root, Chord
(maj m 7 maj7 m7 sus4 sus2 dim add9 6), Length − n beats +, Bass note, Delete chord (Undo in its toast), Done. Above
the keys: Play/Stop, Loop, the place now (Chorus · bar 3 · C/E). The keys show the chord, left hand violet, right hand
orange. Settings page: Instruments, Chord names, Count-in ›, All piano settings ›.
Laptop: the sheet left, Style, Key, Tempo, Instruments and Chord names right; the key's chords under the sheet to drag
into a bar; a chord opens in a popover.

## Reference: Musicca's chord player page (2026-11-11)

The owner's saved copy of musicca.com/chord-player (a MiroMiro export: the page as HTML with Tailwind, a JSX element, an
HTML element, and Elementor and Bricks files), read for its text and controls; one state, no menus opened, no phone
layout. The export stays out of the repo.

| Area      | Musicca                                                                                                                                                | Our canvas (row 10)                                         | Take                                                                                                                   |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Style     | 22 styles in families, numbered: Pop 1–5, Rock 1–2, Melodic 1–4, Hip hop 1–2, Disco 1–2, Reggae 1–2, Jazz 1–4, Blues 1–2, Classical 1–2                | Style ▾, a sheet by family with a one-bar Listen            | already ours; the families match                                                                                       |
| Variation | each section picks Variation 1–4, "to create contrast between different song sections such as verse, chorus, and bridge"                               | a section has a name and Repeat                             | **Variation per section**                                                                                              |
| Speed     | ×1 beside the tempo                                                                                                                                    | Tempo − 96 BPM +                                            | no: one tempo control                                                                                                  |
| Settings  | instruments, count-in, time signature, transpose, volume                                                                                               | Instruments, Chord names, Count-in ›, All piano settings ›  | **Time signature** in Settings; transpose is the Key picker; volume is each instrument's level                         |
| File      | New · Save · Share · Download MP3 (signed in)                                                                                                          | ··· New, Chord sheets…, Save as my chord sheet…, Share link | **Download as audio** in ···                                                                                           |
| A chord   | a box with a tick per beat; drag its right edge to change its length; double-click for the advanced editor                                             | a chord opens a sheet with Length − n beats +               | **beat ticks in the chord** and, on a laptop, **its right edge drags its length**                                      |
| Typing    | click a chord and type it: root A–G, # or b, m dim aug sus2 sus4 6 7 maj7, then 9 11 13, / for the bass; Ctrl/Cmd + N adds a chord; Backspace deletes  | the chord sheet only                                        | **type a chord on a laptop**, read by the app's chord-symbol parser; ⌘N adds, Backspace deletes (Undo in its toast)    |
| Order     | drag to reorder; drag away to delete; the keyboard's space bar picks up, arrows move, space drops, Escape cancels                                      | sections move by their grip                                 | **chords drag too**, with the keyboard way for accessibility                                                           |
| Ideas     | Randomize chords; common progressions by genre (Pop, Rock, Jazz, Blues, the 12-bar blues) as text to start from; a table of songs built on four chords | Randomize chords in ···                                     | **Start from a progression** points to the Progressions library; no song table (the library holds the learner's songs) |

Proposed for the canvas: Variation 1–4 per section; Time signature in Settings; Download as audio in ···; beat ticks in
each chord with its right edge dragging its length on a laptop; typing a chord on a laptop; chords that drag, by finger,
mouse and keyboard.

## History

- 2026-11-08: drawn (canvas v8); waiting for the owner.
- 2026-11-11: Musicca's chord player page read from the owner's export and compared above; six proposals, not drawn yet.

Sources: Musicca's chord player (sections, bars, chord picker, instruments); Chordify's chord grid; Band-in-a-Box's
lead sheet (bars four to a row, chords split by beats); `practice.ts` `chordPlayer`.

### Canvas 171 (2026-11-13): the board redrawn to the rulings

`.scratch/r39/canvas/r58_chordplayer.py`, over r41_practice's ChordPlayer board. The chart: each bar's chords sized
by their beats over a row of beat ticks (the sounding beat in ink while playing); the chorus's 4th bar holds F 4 and
G7 2, so it is marked ! (44 target, "Bar 4 holds 6 beats, not 4", opening its chord); each section's head a grip, its
letter, name and × n, and, with Follow a MIDI arranger on, its Genos tag ("Intro I · Main A, Main B · Fill in"),
which opens the section's sheet: Intro (the first section), Main for each time through, Into the next section
(None · Fill in · Break), Ending (the last); "None sends nothing: the Genos plays as its panel says." A chord opens
Musicca's sheet titled "Bar 4 · F": Root, Chord, Bass note, Duration − n beats +, Suggested chords, Play from here,
Duplicate, Delete chord. Every edit marks the sheet's name Draft; ··· holds Save and Discard draft over Share (View
only · Can edit, Copy link). Settings add Follow a MIDI arranger and Arranger · Genos · USB. Over the keys, the
Genos's strip as its panel names it: Style (Start/Stop, ACMP, Sync Start, Sync Stop), Intro I II III, Main A B C D,
Auto Fill, Break, Ending/rit. I II III, Fade, OTS Link; a lamp red when on, pale red when next, white when off.

## Port to the app, R77 (in this order; waits for the Player's and editor's band in the app, tasks 157–159)

The board is the source, value for value (`r58_chordplayer.py`: `BAND77`, `RAIL77`, `_PANEL`, `GDOCK77`, `PHHDR77`,
`PHNAV77`, `PHPAGES77`, `NAMEMENU77L`, `NAMEMENU77P`, `POPS77L`, `_SHL`), with the kit helpers it calls
(`r41_kit.py`: `HDRTRANSPORT`, `HDRKEYSBTN`, `PHTRANSPORT`, `PHKEYSBTN`, `_RAILBTN`, `FROWS`, `FSHEET`, `POPOVER`).

| # | Board (R77) | App today | Port |
| - | ----------- | --------- | ---- |
| 1 | The full screen: no sidebar, the band 64 dark on a laptop; Flat's phone header (←, the transport capsule, the keys, ☰) | `pages/chord-player/ui/ChordPlayerPage.tsx` in the shell with its sidebar; a glass bar of Back, Undo, gear and ··· | the route leaves `shellRoute` as the Player's does; the band and the phone header from the Player's band once it is in the app (one implementation) |
| 2 | The name with Live or Draft under it, its menu: recent sheets, New sheet, All chord sheets; Share…, Import chart…, Export MIDI, Export chart; Save to my progressions, Open in Progressions; Save and Discard draft | `SheetsMenu.tsx` (the sheets), the ··· menu (the file acts) | one menu under the name; the ··· goes |
| 3 | The transport: Go to start, Play with Playback options (Repeats, Count-in) under ▾, the metronome, Loop for the section | the floating dock's Play, Repeats in the dock, Count-in in Settings, Loop in the section's sheet | the band's transport, the Player's own; the dock goes |
| 4 | Key, Tempo and Style as the band's pills, each a popover under it (the wheels) | the dock's Key, Tempo, Style | pills in the band; the dock goes |
| 5 | MIDI in the band: MIDI keyboard, Follow a MIDI arranger | Settings' MIDI rows | the band's MIDI popover, the Player's; Settings keeps a link row only |
| 6 | The rail, 76: Chords, Styles, Genos, Audio, Chart; Search and Shortcuts at its foot; a panel 352 beside it, « closes it | `KeyChords.tsx` in a side column, `StyleSheet.tsx`, `ArrangerStrip.tsx` floating, `ChordPlayerSettings.tsx` | the editor's rail and tabpanel; Sound (Piano, Bass, Drums, Volume; Voicing) and Chart (Time signature, Written as) take what the gear held, which goes |
| 7 | The Genos panel in full in the rail, docked compact over the keys while another panel is open (Start/Stop, Main A–D, ⌃) | `ArrangerStrip.tsx` Full · Compact · Minimized, placed by Edit layout | the strip's sizes kept; its place is the rail's or the dock over the keys |
| 8 | The keys docked under the chart, the band's keys button showing or hiding them | the keys in Edit layout's places and sizes | docked, shown or hidden; Edit layout goes |
| 9 | Edit layout, the floating dock, the gear and the Chords column gone | `use-chord-layout.ts`, `use-layout-edit.ts`, `LayoutZones.tsx`, `PanelTag.tsx`, `KeysGrab.tsx`, Settings › Page layouts | deleted, with the saved layout's store version bumped and the old save kept (ADR 0038) |
| 10 | ☰ on a phone: Chords, Style, Key, Tempo, Repeats, Audio, Chart, MIDI as rows, each a page with ←; then Share…, Export › (MIDI, Chart (.txt)), Import chart…; Save to my progressions, Open in Progressions | the dock and the gear's sheets | the Player's ☰ and its pages, one implementation |
| 11 | A chord's dialog on a laptop hangs under its chord (`ANCHOR`), above it where the screen ends first | `ChordDialog.tsx` centred | anchored to the chord as the board's `chordPos` |

## Port to the app, from canvas 171 (in this order)

| # | Board | App today | Port |
| - | ----- | --------- | ---- |
| 1 | A bar holds its own chords; an edit never retimes another; a bar that does not add up is kept and marked ! | `shared/lib/arrangement/chord-sheet.ts`: a section is one run of chords laid across the bar lines; `resizeChord` takes beats from the next chord, `moveChord` leaves the lengths in place, `removeChord` and `moveChordAcross` hand beats to a neighbour | a section is bars of chords (`bars: { chords }[]`); resize, move, remove, duplicate and drag across sections touch only the chord moved; `playOrder` plays each bar as long as its chords; the text form writes bars with `|`; older text is read into bars, the store's version kept (done) |
| 2 | Beat ticks under each bar, the sounding beat lit; the ! on a bar that does not add up | `SheetSection.tsx`, `ChordTile.tsx` | ticks and the ! from the bar's beats |
| 3 | Musicca's chord sheet: Root, Chord, Bass note, Duration, Suggested chords, Play from here, Duplicate, Delete chord | `ChordDialog.tsx` | rebuilt to the board |
| 4 | The draft: Draft beside the name, Save and Discard draft in ··· | `use-chord-sheet.ts` saves each edit | a draft per sheet in the saved store |
| 5 | Each section's Genos tag and its sheet | none | the section's Intro, Main per pass, into the next, Ending in the sheet's text and store |
| 6 | Follow a MIDI arranger and the Genos strip | none | Web MIDI: Start, Stop, clock in; Section Control out |
| 7 | Share, view only or can edit, live | `share` exists for folders | the sheet's online row and Realtime |


### Ported (loop, 2026-11-14)

- 1 bars of chords (done); 2 the chart, ticks and ! (done): the chart on its paper as canvas 171 draws it; a
  section's head opens its own sheet (Section, Repeat, Loop this section, Variation, Duplicate section, Delete
  section at once with Undo), which the board leaves undrawn: decided so its settings keep one home, the old ⋯ and
  inline pickers gone.
- The bar and the dock (done): Back · Chord player · Undo · gear · ⋯ (Redo, New, Save as my chord sheet…, Share
  link, Chord sheets, Randomize chords, Open in Progressions, Practise in the Player); the dock Style · Key · Tempo
  · Repeats · Play. Decided, one home each: the dock's Key opens the transpose stepper (Settings' Transpose row
  gone); its Repeats is how many times the sheet plays, Until Stop or 1 to 8 (Settings' "Repeat the sheet" gone).
  The head card, the button row and the floating Loop are gone (Loop is in the section's sheet).
- 5 the section's Genos marks (done): a section carries Intro I–III (the first), its Main for each time
  through (A–D or None), Fill in or Break into the next, Ending I–III (the last), saved in the sheet's text as
  head words (`verse x2 i1 mAB fill e2`, `-` for a time left unset), so older sheets read with none. With
  Follow on, the head's tag ("Intro I · Main A, Main B · Fill in", or "Genos" when nothing is set) opens
  "Verse on the Genos": Intro, Main each time through ("1st time", "2nd time": the musician's words, where the
  board wrote Pass 1), Ending, Into the next section. The board's line "None sends nothing…" is the ⓘ beside
  "Main, each time through" (no explanation line under a control). Five letters (None A B C D) keep the
  segmented control in one row; five words still go three over two.
- 6 Follow a MIDI arranger (done): Settings has Follow a MIDI arranger (ⓘ) and an Arranger row naming the port
  (Genos · USB), or Not connected, MIDI not allowed, Needs Chrome or Edge; one preference, `chordPlayer.follow`.
  Turning it on asks for Web MIDI with SysEx. The Genos leads: its Start (FA) plays the sheet from bar 1 in
  silence, its clock (F8, 24 a beat) moves the lit bar and beat, Stop (FC) stops, Continue (FB) goes on; the
  dock's Tempo shows the clock's tempo while it plays, and Play is the Genos's Start/Stop (Yamaha's Rhythm Start
  F0 43 60 7A F7 and Stop F0 43 60 7D F7). The sheet's marks go out as Section Control (F0 43 7E 00 ss 7F F7):
  the first Main and the Intro while the Genos waits for Start, so its panel holds them; each later one as the
  bar before it begins, taken at the next bar line: the next time through's Main, a Fill-in into the Main it
  leads to, a Break, or the last section's Ending; a Main already playing is never sent again (it would play its
  Fill-in). With an Intro and a Genos that reports its section changes, the sheet waits for the first Main.
  The strip over the dock, as the panel names it: Start/Stop, Intro I II III, Main A B C D (pressed again, its
  Fill-in) and Break, Ending/rit. I II III, each lamp red when on. Left out, as no MIDI message for them was found
  in Yamaha's data (the brief's condition): ACMP, Sync Start, Sync Stop, Auto Fill, Fade and OTS Link. Decided:
  the strip floats in the dock's column as a card, since the app's dock floats over the keys where the board's
  sits in the page.
- 8 the laptop's columns (done): from 1024 wide the sheet's column holds the chart, the Genos strip and the dock
  (sticky at its foot, no longer floating beside the page, which had squeezed it to 800px); the 420px side
  column holds "C major chords · Drag one into a bar." (I to vii and V7, 56 tall, serif 20; drag into a bar, or
  tap to add after the last chord) and the Style list, the Style sheet's body. The phone keeps the floating dock.
- 7 Share live (done, canvas v175): `shared_chord_sheets` (migration `20261114100000`, applied; its access test
  `supabase/tests/chord-sheets-access.sql` reports every rule as expected): the owner's row under their policy, the
  link read and written by `read_shared_chord_sheet` and `write_shared_chord_sheet` (anyone with the link; writing
  only while Can edit), each write a new revision pinging the public Realtime topic `chord-sheet:<id>`, which carries
  only the revision so a forged ping only makes a copy read again. The app: `shared/api/chord-share` (port, Supabase,
  fake), `features/share-chord-sheet` (Share sheet as CP_SHARE draws it, share, open a link, save online merged bar by
  bar with `mergeSheets`, a save made offline sent when back), `widgets/chord-player/model/use-online-sheet.ts` (the
  line: changes taken in, the draft rebased on them; the chord playing sent and shown). The sheet in hand is named
  (Save as my chord sheet) before it is shared; a view-only link keeps its draft on the device (Save hidden; Save as
  my chord sheet keeps it). The old Share link that carried the sheet's text in the URL (`?share=`) is gone; a link
  is `?link=<id>`. Checked against the project with two browsers on one link: the second lit C, F, G beat by beat as
  the first played and went dark when it stopped; a change saved on the server appeared in the open copy without a
  reload. Kept on the project for later live checks (owner, 2026-11-14: "without the test user deleted, save for
  you"): the test user `00000000-0000-0000-0000-00000000e2e1` (live-check@rls.test, no password, no sign-in) and its
  sheet "Live check", link `7f3c2a10-1b2c-4d5e-8f90-a1b2c3d4e5f6`, Can edit; run
  `.claude/skills/owner-way/scripts/live-check.mjs` and `live-edit-check.mjs` against a dev server on the project.
- The keys show the chord (loop, 2026-11-14; the brief's "The keys show the chord, left hand violet, right hand
  orange", never built): while the sheet plays, or follows the Genos, the sounding chord lights on the keys, its
  root or slash bass in the left hand (G2 to F♯3) and its tones in the octave just above in the right, each key
  named: a chord spans an octave, so both hands stay in view on the smallest phone. The section's head keeps its
  name and × n whole beside a long Genos tag, the tag shrinking instead.
- Musicca's chart and dialog, from canvas 173 (done): each chord a box as wide as its beats (two bars a row on a
  phone, four on a laptop), its ticks, its extension raised (`ChordName`, also on the key's chords beside the
  chart); a tap selects, Play starts there; a double tap opens the dialog (Chord root and quality, Bass note,
  Duration, Suggested chords four across, Delete · Duplicate · Play from here); the selected box's right edge
  drags its length; the sounding chord wears the ring on its honey wash. The section's head: name pill (its
  sheet), × n, Variation n and delete in place, grip last. The paper card, the sticky dock and the floating
  actions are gone: the dock and the Genos card float over the keys on every size (`--nav-bar` + `--docked` +
  12), the Genos card with every control in view (two rows on a phone, one on a laptop).
- The Genos strip hides or moves (owner, 2026-11-14: "give me possibility also to hide the genos controls with hide
  button or move them to the side"): its head carries Hide (⌄; folded, it keeps its state line and Start/Stop, ⌃
  shows it again) and, on a laptop, Move to the side (it stands at the top of the side column, Back over the dock
  returns it). The place is saved (`chordPlayer.arranger`: card, folded, side). Auto-scroll built: the chord
  sounding is kept in sight, clear of the bar, the keys and what floats over them, checked at 402, 393 and 1710.
