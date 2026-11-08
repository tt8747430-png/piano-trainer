# R37 — Pace and Settings, simplified (canvas)

## The rulings as they stand (read first; the sections below are the history, and where they disagree, this wins)
Canvas v130, https://claude.ai/artifact/HezkVS2MXdwz7uJ14KDGgp. Each line names the owner's words it rests on.

**Modes (Practice, once Pace).**
- Two tiles, **Wait** and **Play**, no group headers ("i don't like the mods titles").
- **No Follow mode.** In-time and Follow "sound the same", and "no follow my tempo". The app's `follow` mode and
  `followTempo` go in R37-1.
- Practice never disables or hides one setting because of another; each works in both modes ("why it is disabled in the
  wait mode"). In Wait the metronome clicks while the music moves and stops when it waits.

**Tempo and the metronome** (owner's Flat screenshots, 2026-11-07: Playback options › Metronome is one list,
Metronome Count-in · On · Off; each choice opens a page with a Back arrow). One group under the tiles, headed Tempo:
1. The face: the score's meter (3/4) and one light per beat lighting in time, beat 1 larger; − · BPM large · + · Tap;
   "BPM · Andante" (the tempo marking). **Score tempo: 80 BPM** appears only when the tempo differs, to go back.
2. **Metronome** Off · Count-in · On, one tap (Flat's three). Count-in clicks one bar before the music; On counts in
   and keeps clicking. This replaces the Play metronome switch and the Count-in row (Off · 1 bar · 2 bars): it
   supersedes the earlier "no modes like Off · Count-in · Always" line, since the owner brought Flat's as the model.
3. **Metronome sound ›** shows the sound's name and opens its page (Flat's drill-in): Wood block · Claves · Beep, a
   list with a check, each choice playing itself, then Volume; Back returns to Practice.
- The meter and accents come from the score: no beat squares, no accent dots, no subdivision in the Player. They stay
  in the Metronome tool. No Speed slider and no speed %: the tempo is BPM.
- References come from sheet-music players (Flat, forScore, MuseScore, Soundslice, flowkey), never recording
  software. Names are the musician's; every sound must really play.

**Loop** (shown while a loop is set): Repeats · Between repeats (None · Count-in · Rest) · Speed up each pass (a
switch, +5 % a pass).

**The pedal: no pedal setting anywhere in the Player** (2026-11-07: "what is the purpose of this pedalling thing";
then "remove it"). Playback pedals as the score marks it, or by `autoPedal` where it has no marks. The learner's own
pedal (MIDI or the bar's Sustain) always sounds. The score shows its Ped. marks as engraved. (Canvas v129 put a Pedal
row back by mistake; v130 removed it.)

**What you play: Arrangement or Accompaniment** (owner, 2026-11-07: "the songs versions should be separate from the
accompaniment", "use professional names", "one cancels another"; v137's switch and v138's single list rejected).
- References: flowkey sells each song in arrangements by level, Beginner · Intermediate · Advanced · Pro
  (flowkey's magazine); Playground Sessions in Rookie · Intermediate · Advanced (its blog); Yamaha's Smart Pianist
  builds a piano accompaniment from a song's chords and picks it under Song Setting › Arrangement › Accompaniment
  Score Pattern, its patterns grouped Block (Basic, 8Beat, 16Beat) and Arpeggio (Easy Arpeggio, 8Beat Arpeggio)
  (manual.yamaha.com, sandsoftwaresound.net).
- Will build: the Song gear holds two cards, a radio group: **Arrangement** with **Level** Beginner · Intermediate ·
  Advanced (our easy · simple · original; Advanced is the piece as composed), and **Accompaniment** with **Pattern ›**
  (its name; the page of pattern cards, each a little two-hand roll: Bass and chords, Broken chords, Block chords,
  Arpeggio, Dotted bass). The card played has its radio filled and an orange outline; choosing a level picks the
  Arrangement, a pattern or the Accompaniment's radio picks the Accompaniment. Each keeps its own choice while the
  other plays. The Accompaniment card shows only for a song with chord symbols; a chord chart alone has only it.
  Drawings: `.scratch/r37/drawings/song-arrangement.png`, `song-accompaniment.png`, `song-pattern-page.png`.
**The Pattern page is the app's accompaniment library** (owner: "from where are they taken, like from our own
patterns in our app, and how should they be organized like a library"; the two-a-row cards were rejected).
- Source: the app's own patterns, one implementation with Practice › Accompaniment: `entities/pattern` (53 built-in
  patterns in six groups from four books, credited, and Rhythm styles; `pt-patterns` keeps the learner's
  favourites, hidden and own patterns) laid out by `shelves.ts` (Favourites, Yours, each built-in group, Hidden).
- References: Band-in-a-Box's StylePicker (favourites, a genre/feel filter, a double-click preview; pgmusic.com
  manuals), Yamaha arranger keyboards' style list (styles under family headings, a Favourites family), Logic Pro's
  Keyboard Session Player (Block, Broken, Arpeggiated styles with presets, user presets saved; support.apple.com).
- Second pass ("research more and improve this"): the page now takes the shape of the app's own library
  (`widgets/practice-library`, the Songs library's shape), so the Player and Practice › Accompaniment read alike;
  Smart Pianist's pattern list (Block · Arpeggio families, one list) and forScore's searchable lists agree.
- Third pass ("make more like a library and better filtering and better structure, research properly"):
  Band-in-a-Box's StylePicker filters by genre, feel, time signature and tempo, keeps Favorites and Recently Played,
  previews on a double-click, sorts by any column (pgmusic.com manuals, chapter 5; the 2024 MultiPicker); forScore
  sorts by title, rating, difficulty or key and filters by rules over composer, genre and tag (forscore.co,
  Sorting Scores, menu search and filters); flowkey filters its library by level (Beginner to Pro) and category;
  the app's own library holds Sort (book order, name, level) and a Filter sheet (Level, Book or style) with its
  count and removable chips (`widgets/practice-library`, `LibrarySearch`).
- Will build: Back · **Pattern**; **Search patterns** (name and both hands' figures) and the **Sort and filter**
  button beside it, with the number of filters on it. Under them a row of chips that scrolls sideways (owner: "i like
  also the chips at the top to filter"), one on at a time: **All · Favourites · Recently used · Called to Play ·
  Called to Play 2 · Bobrova · Gorshkov · Rhythm styles · Mine**, the places of the app's library tree; a chosen
  book shows its shelves unfolded. The button opens a page, Back · **Sort and filter**: **Sort by** Book · Name ·
  Level; **Level** All · Beginner · Intermediate · Advanced; **Texture** All · Block chords · Broken chords · Arpeggio · Melody ·
  Lines and runs (what the right hand plays, Smart Pianist's Block and Arpeggio families); **Feel** All · Straight ·
  Swing; the foot **Reset** (the place chip stays) and **Show n patterns**. Each filter on shows as a chip under the
  place chips with ×. The book is chosen only by its chip, never in the page too.
- The list by Book is folders (owner: "but what about foldable sections or folders"), each a card whose header
  folds it: a chevron, its icon, its name and its count. **Recently used** (the last three chosen, the playing one
  first) and **Favourites** first and open while nothing narrows; then one folder per book, closed at first, so the
  page opens as an overview: **Called to Play** (16; inside, The five ways (lesson 3) and Right-hand techniques under
  their headings), **Called to Play 2**, **Bobrova**, **Gorshkov**, **Rhythm styles**, **Mine** (the learner's own
  folders, made in Practice, under their headings). What is open is remembered. A search, a filter or a place chip
  opens every folder that holds a match, and folding then is for that view only. **Close all** / **Open all** above
  the list. By Name one A–Z list; by Level Beginner, Intermediate, Advanced, Not graded, each a folder too.
  Folding replaces "Show all n". A row: the two-hand roll, the name over its hands line (LH: … · RH:
  …), the level mark, **Listen** ▶, **Favourite** ♡; the playing one highlighted and bold; a tap chooses it and goes
  back to Song. Nothing matches: **No patterns match**. Last **Manage patterns ›** to Practice › Accompaniment, where
  patterns are made, renamed and hidden. A pattern that cannot play the song's meter or chords is left out
  (`fit.ts`). The app's Filter sheet gains Texture and Feel, so both read alike. Drawings:
  `.scratch/r37/drawings/pattern-library.png`, `pattern-library-folder-open.png`, `pattern-library-filter.png`,
  `pattern-library-filtered.png`.
- **No Voicing and no Swing** ("what are these swings and chords options"). Voicing (Close · Drop 2) is how far the
  chord's notes are spread, Drop 2 a jazz spacing; Swing plays pairs of 8ths long-short. Both are arranger's
  choices: each pattern carries its own spacing and feel, and the swung patterns are patterns of their own.
- **Flat, for parts** (piano-data `flat-score-editor`, 04 and the owner's screenshots): Flat keeps showing a part
  (the Instruments sheet: All, each part's Solo and eye, Edit instruments) apart from hearing it (Audio playback:
  Master, each part's mute, solo, Volume, Reverb). Our Hands menu is that list for a piano song: each hand's switch
  (shown and heard), Dim (shown faint), Volume. A song with its own melody staff gets a **Melody** row the same way
  (R37-1). No Master (the device's volume), Reverb or Solo (with two hands, the other hand's switch is the solo).

**Song settings (the gear):** versions as tiles like the modes, Easy · Medium · Original, easiest first ("make the
versions switch like the mods switch"), no "Difficulty" label and no explanation line; Transpose; Edit score · Export. **No recording settings** (owner: "how are they relevant to our
app?"). Only built-in songs carry a recording (today one, Gorshkov's Romashki, ADR 0034): it plays along in Play,
stretched to the tempo and shifted with Transpose, a little under the piano, like the backing in flowkey or Simply
Piano, with no switch, volume or Sync. Sync only made up for a start measured by hand: the recording and the notes
leave through the same audio clock, so a device can't move one against the other; a wrong start is the content's to
fix, measured again before it ships. `sound.recording` and `recordingSync` go in R37-1.

**Keyboard** (its own transport button): tiles Off · 3D · 2D; 3D Angle Seat · Above; for both Keys Song · 61 · 76 · 88
and Note names. No Show hands (one home for a hand: the Hands menu). No grey shading of unused keys, no tab for notes
past the keys, no finger numbers on or under the keys. No skin tone (one neutral hand). Last, links to the piano's own
pages: **Connect a piano ›** and **All piano settings ›** (key size, pedals, volume, MIDI stay in their one home).

**Hands menu:** each hand's switch, Dim, and volume; a switched-off hand is off the score, keys, sound and 3D hand.

**Views:** a tap on the showing view's pill opens its settings; each view has one.
- **Sheet:** Layout Page · Line; **Show** chips Chord symbols · Chord positions · Lyrics · Finger numbers · Note
  names (the app's own names, ADR 0115). That is all.
- **No cursor or scrolling settings** (owner, twice: "i dont like the cursor settings"; v133's Cursor and Follow rows
  were rejected too). Reference apps: flowkey, Simply Piano and Skoove have none; forScore has no playback cursor;
  MuseScore has one toolbar toggle, "Pan score automatically"; only Soundslice has them, tucked in its advanced
  settings (playhead shape Line · Small rectangle · Wide rectangle · Hidden; five scrolling options). So the
  Player's behaviour is fixed, Soundslice's defaults: a thin line moving note by note, the notes it plays coloured,
  the score scrolling only when the line nears the edge. A scroll by hand stops following and shows a **Back to the
  music** pill (Maps' recenter); a tap on it, or Play, follows again. `playback.cursor`, `playback.follow` and
  `playback.followReturn` go in R37-1. No Your marks switch (owner, "do we need this"): the learner's own
  marks always show, as in forScore and MuseScore, where annotations are part of the page; one is hidden by deleting
  it in Edit, and `scoreView.annotations` goes.

**The end of a run: Played through** (2026-11-07, the redesign skill's "evidence of care": what happened, how to
take it back, what next; the song used to rewind to bar 1 in silence). When the song ends, a sheet (a card above the
transport on a laptop): **Played through**, "Amazing Grace · both verses · Wait · 2:24"; two figures, the value over
its label with a comparison: **94%** notes right first time (Wait) or notes in time (Play), "↑ 6 on last time", and
the tempo played, "80 BPM, Andante"; **Each bar**, one cell per bar shaded by its slips (none is sand, more is deeper
honey; no red or green), the weakest four outlined, a tap on a bar loops its four and plays; **Practise bars 5–8**
(honey, the main act), **Play again**, and the next step: **Try it in Play** from Wait, **Play at 85 BPM** from Play;
last "4 min added to today's practice · 23 days in a row ›" to the practice record. × closes it. It shows at the end of the song only, never after a loop's repeats (owner, 2026-11-07: "song only"). Flowkey and Simply
Piano end a song on a result screen too; ours leads to practice, not a grade. Drawings:
`.scratch/r37/drawings/played-through-*.png`. Canvas v149.

**No Song information and no Song page row** (owner, 2026-11-07: "no song information", then "no song page in the
settings"): the Player's `SongInfo` sheet goes, and the gear has no link to the song's page (it is reached from Songs).
The song's page still gains Tuning.

**The song's drawer: the song at its head, settings only below** (owner, 2026-11-07/08: "the first two three settings
should be more distinctive than the other ones"; v150's row of icon buttons "feels like a bottom bar and not like
settings drawer"; v151's icon list "still not good. research more and look also at the example apps and websites").
- Research: Chordify keeps a song's choices on the song (Transpose · Capo · Simplify tabs) and its acts in a separate
  ⋮ action list (Add to setlist, Share chords, Export to PDF, Export to MIDI; `piano-data/reference-apps/chordify`);
  Flat's Playback options is a titled sheet of settings rows only (`flat-score-editor/05`); forScore keeps a Tools menu
  apart from the score's settings and Share there prints or sends (forscore.co/documentation/tools); Soundslice's
  Settings panel holds transposition, count-in, zoom and nothing to act on (soundslice.com/help, Transposing); Apple's
  HIG groups settings in lists under headers and puts an object's acts in a menu.
- Will build: the drawer's head is the song, as a sheet in Chordify or Apple Music: a cover tile, **Amazing Grace**,
  "G major · 3/4 · 80 BPM" (the key follows Transpose), and at its right two round buttons, **Share link** and **More**
  (···), whose menu holds **Edit score · Print · Export**. Below, settings only, under headers: **What you play**, the
  Arrangement · Accompaniment cards; **Song**, Transpose and Sections ›. No acts among the settings. Canvas v152;
  drawings `song-settings-acts.png`, `song-settings-more-menu.png`, `song-settings-acts-laptop.png`.

**Placed (owner, 2026-11-07, on the five proposals):**
- **Practice, not Pace** ("i don't like that it is called pace"): the transport's menu is titled Practice, the
  musician's word for what it holds (how you play along: Wait · Play, the metronome, the accompaniment, the loop). Its
  bar button still shows the mode itself (Wait or Play), so the word Practice is only the menu's title.
- **Accompaniment** goes in Practice, after the metronome, for a song played from its chords: Pattern (a row with the
  pattern's name, opening the pattern list), Voicing (Close · Drop 2), Swing (Straight · Light · Medium · Hard).
- **Recording: no settings** (later ruling, see Song settings above).
- **Ask which view on open: dropped** ("ok"). The Player opens the view used last (`pt-views`).
- **Hands skin tone: dropped** ("do we need this"). The 3D hands are a guide to where the fingers go, not a portrait of
  the learner: they are drawn in one neutral, stylised tone, as Meta Quest's default hands are, so no choice is
  needed. `handsView.skin` goes; the canvas's 3D hands keep their current tone until R37-1 changes the material.
- **Resume following after a scroll: dropped** ("ok"). Following resumes on its own.

## Source
- Owner, 2026-11-07: "research and look at all the resources and app examples and improve the other settings like
  the pace and the main player settings. what order should be how they are made, how should they be simplified and
  all other best practices … also the apple guidelines of making simple practical ui".

## Research
- Flowkey's tempo menu (`flowkey/09`): two short groups, "Learn at your own pace" (Wait Mode) and "Listen and play
  along" (50 % · 75 % · Original); nothing else.
- Chordify (IMG_4552–4573): Transpose · Capo · Simplify in a strip over the music, tempo · volume · loop in the
  transport, everything rarer under ⋯ (setlist, view settings, share, export, song information).
- Flat's Playback options (`flat-score-editor/05`): three rows, each a page.
- Apple HIG (Settings, Sheets, Popovers, Toggles, Segmented controls): show only what applies now; most used first;
  group related; one home per setting; good defaults; a switch for on/off, a segmented control for 2–5 choices;
  don't duplicate system controls (volume).

## Will build (canvas, phone and laptop)
- **Pace:** Wait mode · Interpret · Listen. Only Listen shows Speed, Count-in, Metronome (Wait mode waits, Interpret
  follows: none of them act). Loop's switch leaves Pace (the transport's Loop is its one home); while a loop is set,
  "LOOP BARS 5–8": Repeats · Between repeats · Speed up (Listen only).
- **Settings:** Song (Version · Transpose · Pedalling) first, then Keyboard (Keys Off · 3D · 2D, then only what that
  kind uses; Skin tone only while hands show), then Edit score · Export. The Volume row goes: the device's volume,
  and each hand's in Hands.

## The pedal (owner, 2026-11-07: "what is the purpose of this pedalling thing it is very weird")
- Today: Settings › Pedalling As marked · Off · Auto chose how *playback* uses the sustain pedal (`withPedal`):
  the score's Ped. marks, none, or `autoPedal`'s. A learner can't tell the three apart.
- Research: Synthesia, flowkey, Skoove, Simply Piano expose no pedal setting in their players; a connected MIDI
  keyboard's pedal simply sustains (Synthesia 0.7.1). Soundslice shows Ped. marks but its synth ignores them.
- Will build (owner, "remove it"): no pedal setting at all. Playback always pedals as the score marks it, and where
  the score has no marks, as `autoPedal` adds (`withPedal` loses its choice). The learner's own pedal (MIDI CC64, or the bar's
  Sustain held or latched) always sounds and is never graded. Ped. marks show on the score as engraved.

## The song's versions (owner, 2026-11-07: "make the song versions more understandable … why is it so important")
- Today: Version Original · Simple · Easy (`arrangePiece`): Original the chords as written; Simple each chord its
  plain triad (`simplifyChart`); Easy the tune over each chord's root (`easyChart`). "Simple" and "Easy" read alike,
  and the order runs hardest first.
- Why it matters: the same song at the learner's level (flowkey's Beginner · Intermediate · Pro arrangements,
  Chordify's Simplify).
- Will build: **Difficulty**: Easy · Medium · Original, easiest first, no explanation line (owner: "remove this
  weird explanation").

## The keyboard's own button (owner, 2026-11-07: "make the keyboard settings more accessible like in the toolbar at
the bottom as the most right button with proper icon")
- Will build: the transport's last button, **Keyboard** (Lucide Piano, the app's keyboard icon; on a phone the icon
  alone, on a laptop icon and word). It opens the Keyboard panel: Keys Off · 3D · 2D, then only what that kind uses
  (3D: Camera, Show hands, Skin tone while hands show; 2D: Note names, Finger numbers, Keys shown). The keyboard's
  rows leave Settings, which keeps the song (Difficulty · Transpose) and Edit score · Export.

## The Keyboard panel, by what matters (owner, 2026-11-07: "refactor them properly and how they should look and what
is most relevant")
- Will build: the choice of keyboard as three picture tiles, **Off · 3D · 2D** (Chordify's "Pick your view"), the
  chosen one outlined in orange; the panel's title names it, so no "Keys" label. Then only what changes that one:
  3D **Angle** Seat · Above, then for 3D and 2D alike **Keys** Song · 61 · 76 · 88 and **Note names**.
- Goes: **Finger numbers** (the standing ruling: no finger numbers on or under the keys); **Skin tone** to the app's
  Settings (set once, app-wide appearance).

## One home for a hand (owner, 2026-11-07: "I can disable the hand in the keyboard settings and also in the hands
settings right or left")
- Today: Keyboard › **Show hands** hid both 3D hands; Hands › a hand's switch takes that hand off the score, the keys,
  the sound and the 3D hand. Two controls over the same hands.
- Will build: **Show hands** goes. The 3D hands follow the Hands panel alone: an enabled hand is drawn, a dimmed hand
  fades, a switched-off hand is gone (Flowkey and Synthesia set hands in one place). Keys without hands is 2D.

## Keys: the learner's own piano (owner, 2026-11-07: "the piano range is not very understandable", then "I want the
range. but refactor more")
- Today: 2D had **Range** Song · All 88, a choice with no reason given.
- Will build: the row **Keys** Song · 61 · 76 · 88, the sizes pianos are sold in (Synthesia sets the keyboard to the
  learner's): Song (default) fits the song's notes with a key's margin; a number draws that piano, 61 C2–C7, 76 E1–G7,
  88 A0–C8.
- Owner, 2026-11-07: "I dont need this greyed piano not used keys": every key is drawn alike; no shading.
- Owner, 2026-11-07: "I dont need this note showing": no tab for notes past the chosen piano.

## Note names and Keys on the 3D piano too (owner, 2026-11-07: "I want to be able to show the notes and change size
also on the 3d piano")
- Will build: under 3D, after Angle, the same **Keys** and **Note names** rows as 2D, one setting each for both kinds.
- Keys on 3D: the camera frames the chosen piano instead of the song, as `frame()` already does for a range, without
  its least key size (the learner chose the size). The band is as tall as the keys need: a wider piano, a shorter band,
  the score moving up into the room left (Song keeps today's height).
- Note names on 3D: each C named on its key's front (C2, C3…), the notes being played named in bold, as on 2D. A name a
  hand covers is not drawn over the hand; names on keys narrower than 14 px are left out.

## Modes named for what happens (owner, 2026-11-07: "make more understandable and useful modes. look at all the
examples and research more")
- Today: Pace lists Wait mode · Interpret · Listen in one group. "Interpret" says nothing of what it does, and "Listen"
  hides that the learner plays along.
- Research: flowkey groups its menu "Learn at your own pace" (Wait Mode) and "Listen and play along" (50 % · 75 % ·
  Original). Synthesia: Melody Practice (waits) · Song Recital (keeps going) · Watch and Listen. Skoove: Listen · Learn
  (waits) · Play (in time). Piano Marvel: Practice (waits) · Assess (in time, scored). Every one splits *the music waits
  for you* from *you keep up with the music*, and names each by what the learner does.
- Will build: Pace in two groups with headers, no other text:
  - **At your own pace:** **Wait for me** (`wait`: the music stops until the right notes), **Follow me** (`follow`: the
    music takes the learner's tempo).
  - **With the music:** **Play along** (`listen`: the music plays at the speed set).
  - The transport's Pace button names the mode the same way. Internal ids stay.

## Tempo for every mode that moves (owner, 2026-11-07: "make more understandable options, why only the play along has
these settings")
- Today: Speed · Count-in · Metronome showed only under Play along, though Follow me runs at a tempo too: it starts at
  the speed set and follows the learner within 40–200 % of it (`followTempo`).
- Will build: a **Tempo** group after the modes, for every mode: **Speed** (Follow me: **Starting speed**),
  **Count-in**, **Speed up each pass**, **Metronome** (in Follow me it ticks at the learner's tempo as it follows).

## Wait for me keeps its settings; the metronome is the learner's (owner, 2026-11-07: "why the wait for me doesn't have
the setting and why they disappear and also make the metronome customizable")
- Today (canvas v113): choosing Wait for me hid the whole Tempo group. The app's Wait mode does pace the other hand,
  the accompaniment and the rests at `tempo` (`features/practice`), so Speed matters there too.
- Ruling: a control that cannot act now is shown disabled, not hidden, so the panel keeps its shape between modes and
  the learner sees what another mode offers (Apple HIG: hidden controls make people wonder where they went; disable
  one that is temporarily unavailable).
- Will build:
  - **Wait for me:** Speed enabled; Count-in, Speed up each pass and Metronome dimmed (nothing keeps time while the
    music waits).
  - **Follow me:** Starting speed, Count-in and Metronome enabled; Speed up each pass dimmed (the learner sets the
    pace).
  - **Play along:** all enabled.
  - Metronome on shows a **Metronome** group: **Sound** Click · Beep · Drum; **Accents**, one dot a beat, a tap
    cycling Downbeat · Accent · Normal · Silent (default the first beat accented); **Clicks per beat** 1 · 2 · 3 · 4;
    **Volume**, a slider (70 %). These are the Metronome tool's own settings (`shared/lib` metronome sounds, beat
    levels, subdivisions), one implementation.

## The Sheet's own settings (found while checking)
- Today (canvas): tapping the Sheet pill while it showed turned pages ↔ line; it had no settings panel, though every
  other view's pill opens one.
- Will build: the showing Sheet's pill opens **Sheet**: **Layout** Page · Line; **Cursor** Off · By note · Smooth
  (default By note); **Follow the music** (on); **Your marks** (on).

## R37-1: what the app still has to port (audit of `main` b98aea88, 2026-11-07)
The app today: the transport's **Pace** popover (`PaceButton`: At your own pace Wait mode · Interpret, Listen and play
along at a speed, a Speed slider, Speed training), the bar's **Click** (`ClickButton`) and **Loop** (`LoopButton`, the
grips done in 40d8e643), the foot's **Hands** sheet (`HandsSheet`: Hands, Play the other hand), the gear's one
**Settings** sheet (`SettingsSheet` from `PlayerLayout` extras): Playback (Count-in Off · Audible · Silent, Pedal,
Metronome sound and beats › the Metronome tool, click volume, Speed training step), Hands (Skin, The other hand),
Score view (each view's fields, Cursor, Follow the music, Return to the playhead, Show on open, Annotations),
On-screen piano (`KeyboardSettingsFields`: key size, named keys, volume, pedals, chord names, marked notes, swipe),
Staves, Accompaniment (`PlayerSetup`: the Pattern list page, right and left hand figures, Chord size, Swing), then
the acts (Sections, Song information, Recordings, How did I play, Print, Tuner, Voice commands, Share link,
Export…) and Version · Transpose as foot tools.

| # | Canvas ruling | App today | Port |
| - | ------------- | --------- | ---- |
| 1 | Practice menu, two tiles Wait · Play | Pace: Wait mode · Interpret · Listen | rename; drop `follow` (Interpret); Listen becomes Play |
| 2 | Tempo face: meter lights, − BPM + Tap | Speed slider in % | BPM stepper and Tap, the score's meter |
| 3 | Metronome Off · Count-in · On | Click button + Count-in Off · Audible · Silent | one three-way choice; Silent goes |
| 4 | Metronome sound › page (Wood block · Claves · Beep, Volume) | a link to the Metronome tool, click volume | its own page in Practice, the tool's sounds |
| 5 | Speed training | Speed training switch + step in Playback | stays as Loop's Speed up each pass |
| 6 | Loop group: Repeats · Between repeats · Speed up each pass | grips only | build the group, shown while a loop is set |
| 7 | No pedal setting | Playback › Pedal | remove; score marks or `autoPedal` |
| 8 | Song gear: Arrangement (Level Beginner · Intermediate · Advanced) or Accompaniment (Pattern ›) as radio cards | Version foot tool (Original · Simple · Easy) and an Accompaniment page | one radio group in the gear; Version tool goes |
| 9 | Pattern page: search, place chips, Sort and filter (Sort by, Level, Texture, Feel), folders, rows with roll, hands line, level, Listen, heart | a flat Listbox of patterns with its idea, From the chart, Own pattern › All patterns › | rebuild on `widgets/practice-library`'s parts; Texture and Feel added to Practice's filter too |
| 10 | No Voicing, no Swing, no hand-figure pages | Chord size, Swing, RH and LH figure pages | remove from the Player (figures stay in Practice's pattern editor) |
| 11 | Transpose in the Song gear | foot tool | move |
| 12 | Hands menu: each hand's switch, Dim, volume | Hands segmented, Play the other hand; The other hand in Settings | rebuild; one home |
| 13 | No skin tone | Hands › Skin | remove, one neutral hand |
| 14 | Staves and their levels | Settings › Staves | into Hands, beside each hand's volume |
| 15 | Keyboard button: Off · 3D · 2D, Angle Seat · Above, Keys Song · 61 · 76 · 88, Note names, Connect a piano ›, All piano settings › | Show the keyboard, the On-screen piano page inline | a transport button and panel; key size, pedals, volume, swipe stay on the piano's page |
| 16 | Each view's settings from its pill (Sheet: Layout, Show chips) | Score view page with every view's fields | per-view panel |
| 17 | No cursor or scroll settings | Cursor, Follow the music, Return to the playhead | remove; follow always, Back to the music pill |
| 18 | Show on open dropped | Show on open switch | remove; `pt-views` opens the last view |
| 19 | No recording settings | `sound.recording`, `recordingSync` | remove; the recording plays a little under the piano |
| 20 | Annotations | Score view › Annotations | not in the canvas: owner's call (below) |
| 21 | ··· acts | Sections, Song information, Recordings, How did I play, Print, Tuner, Voice, Share link, Export | the canvas gear keeps Edit score · Export; the rest stay in ··· (owner's call) |

Stale lines in the rulings above, superseded later and to be read so: Song settings' "versions as tiles" and Placed's
"Accompaniment goes in Practice" gave way to the Arrangement · Accompaniment cards (row 8).

Ruled (owner, 2026-11-07: "i want the sections, the print, and share links to be ported. what else", then "remove
my recordings, my how did i do, voice commands"): the Song gear ends with **Sections ›** · ~~Song page ›~~ (removed, see the rulings), then **Edit score ›** ·
**Print ›** · **Share link ›** · **Export ›**. R37-1 removes from the Player, code and strings with them: My
recordings (`RecordingsSheet`, the Player's takes), How did I play (`FeedbackCard`, the take's verdicts on the score)
and Voice commands (`useVoiceCommands`, its act), with no home elsewhere. The score editor's Record (`record-take`) is
another thing and stays. **Annotations** become a Sheet Show chip, **Your annotations**, on by default (row 20;
owner: "ok"). **Tuner** leaves the Player (owner: "drop from the player"); it stays in Practice › Tools
and the Tools menu of Chords, Scales, Intervals, the Chord player and a lesson. **Song information** (owner: "i am not sure … we have
song overview page, should we refactor this?"): the Player's sheet (`SongInfo`: chord summary, the facts, the
recording's tuning, credits) repeats the song's page, so it goes, and the gear's first group is **Sections ›** ·
**Song page ›** (`/songs/$pieceId`). The song's page gains the one fact only the sheet had, **Tuning** (A n Hz, with
its tip), among its fact cards while the recording is not at 440 Hz. Confirmed (owner, 2026-11-07: "no song information"): `SongInfo` goes from the Player; the gear keeps **Song page ›**. Keyboard shortcuts stay on `?`. Drawings:
`.scratch/r37/drawings/song-settings-acts.png`, `sheet-show-annotations.png`.

## Simple Pace, supersedes the three sections above (owner, 2026-11-07: "i don't like the mods titles and the tempo
settings, also i dont like the cursor settings ... make good and simple ui")
- Research: flowkey offers Wait mode and three speeds, and that is all. Soundslice keeps speed on the transport and
  puts count-in and its other metronome options inside the metronome's own menu; speeding up a little each pass
  ("speed training") belongs to the loop. None of these apps lets the learner choose a cursor style.
- Will build, Pace:
  - **Mode:** three tiles with an icon and one word each: **Wait** (`wait`), **Follow** (`follow`), **In time**
    (`listen`). No group headers. The transport's Pace button shows the same word, plus the speed when it is not 100 %.
  - One group: **Speed**, a slider from 40 to 120 % in steps of 5 with its value; **Count-in**, a switch;
    **Metronome**, a row showing On or Off that opens its own page. In Wait, Count-in and Metronome are dimmed.
  - **Loop bars a–b** (only while a loop is set): Repeats, Between repeats, and **Speed up each pass**, a switch
    adding 5 % a pass, dimmed outside In time.
  - **Metronome page** (Back to Pace): the Metronome switch, then Sound (Click · Beep · Drum), Accents (a dot per beat),
    Subdivision (Off · 8ths · Triplets · 16ths), Volume.
- Will build, Sheet: Layout (Page · Line), **Scroll with the music**. (Your marks later removed, see the rulings.) There is no Cursor setting: the
  cursor always moves note by note.
- Gone: the three-way Count-in (Off · Clicks · Silent), the Speed stepper, the ramp choice of +2/+5/+10 %, and Cursor.

## Two modes, Wait and Play (owner, 2026-11-07: "for me the in time and follow mode sounds the same or i don't
understand them")
- Both keep the music moving and differ only in who sets the tempo, so they become one mode with a switch.
- Will build: two tiles, **Wait** (`wait`) and **Play**. The group under them starts with **Follow my tempo**, a switch:
  on, Play is `follow`, so the music speeds up and slows down with the learner; off, it is `listen`, at the speed
  set. The switch is remembered when the learner goes to Wait and back, and is dimmed in Wait. The Pace button reads
  Wait · Play · Play, following you.

## No Follow; the tempo is the metronome's (owner, 2026-11-07: "no follow my tempo, the tempo can be set from
metronome")
- Follow mode is dropped (the app's `follow` mode and `followTempo` go in R37-1).
- Will build, Pace: the **Wait** and **Play** tiles, then one group: **Count-in** (a switch, dimmed in Wait) and
  **Metronome**, a row reading "Off · 80 BPM" that opens the Metronome page. The Pace button reads Wait or Play, plus
  the tempo when it is not the song's.
- Metronome page: **Tempo**, a slider from 40 to 120 % of the song's tempo, shown in BPM (the speed every mode plays
  at, Wait included for rests and the other hand), and the **Metronome** switch (dimmed in Wait). Below them: Sound,
  Accents, Subdivision and Volume.

## The metronome one tap away (owner, 2026-11-07: "refactor the metronome settings and make it easier to enable")
- Supersedes the Metronome page above. Will build, Pace's group under the tiles, in order:
  - **Metronome:** a switch, dimmed in Wait.
  - **Tempo:** the BPM slider.
  - **Count-in:** a switch, dimmed in Wait.
  - **Sound and accents:** a row showing the sound, which opens a page (Back to Pace) holding Sound, Accents,
    Subdivision and Volume.
- (owner, 2026-11-07: "it is not understandable what subdivision is") The row is **Clicks per beat**, 1 · 2 · 3 · 4
  (the metronome's `none` · `8ths` · `triplets` · `16ths`).
- (owner, 2026-11-07: "but does this make sense?") No: playing several clicks per beat and setting a level for each
  beat are drills for the Practice Metronome tool. Piano apps give the player's metronome one click a beat (flowkey,
  Simply Piano). The Player's page becomes **Metronome sound** (reached from Pace's **Sound** row, which shows the
  sound): **Sound** Click · Beep · Drum; **Accent the first beat**, a switch (on); **Volume**. Clicks per beat and the
  per-beat accent dots are dropped from the Player. The Metronome tool keeps both.

## Pace in a musician's order (owner, 2026-11-07: "the order in the settings doesn't make sense and how the count in
is related to this and how it behaves while the metronome is disabled ... look also at the example")
- References: Flat's recording bar has one Metronome control (♩ = 84 and a switch) and Start countdown beside it.
  Soundslice keeps count-in inside the metronome's menu (1, 2 or 3 bars; at the start, before each loop, or both).
- Ruling: the tempo comes first because everything plays at it. The metronome and the count-in are one sound, so they
  share one group: Count-in plays the metronome's clicks before the music starts, **whether or not the metronome is
  on**. Sound, accent and volume therefore apply to both, and they dim only when both are off. Before each repeat of
  a loop, the count-in is the loop's **Between repeats: Count-in**.
- Will build, Pace, replacing the Sound page:
  1. **Wait · Play**, the tiles.
  2. **Tempo**, the BPM slider, its own group (Wait included: the rests and the other hand play at it).
  3. **Metronome**, a group: **Metronome** (switch, off); **Count-in** Off · 1 bar · 2 bars (1 bar); **Sound** Click ·
     Beep · Drum; **Accent the first beat** (on); **Volume**. In Wait the group is dimmed, because nothing keeps time.
  4. **Loop bars a–b**, while a loop is set.

## The Player's metronome is the Metronome tool's (owner, 2026-11-07: "but the tempo belongs to the metronome and i
still don't like the metronome settings")
- Reference: the owner's own ruling for the Metronome tool (feedback log): a large BPM with steps, Tap tempo, sound,
  beats as squares, and one engine for the tool page, the Player and the quick metronome. The Player shows a compact
  form of the same controls (`pages/metronome` TempoSteps, `features/metronome` BeatSquares).
- Will build, Pace after the Wait · Play tiles, one group with no header:
  1. **Metronome**, a switch (off; dimmed in Wait).
  2. The tempo: **−** (1 BPM slower), the BPM large with "BPM" under it, **+**, **Tap** (sets the tempo from the
     learner's taps). It works in Wait too: the rests and the other hand play at it.
  3. **Beats**: one square for each beat of the bar, numbered. A tap cycles Accent (filled) · Normal · Silent
     (dashed); by default beat 1 is accented.
  4. **Count-in**: Off · 1 bar · 2 bars (dimmed in Wait). It plays the metronome's clicks whether or not the
     metronome is on.
  5. **Sound**: Click · Beep · Drum. 6. **Volume**.
- Gone: the Tempo slider and the "Accent the first beat" switch, which the Beats squares replace.

## Metronome by relevance, its beats from the score (owner, 2026-11-07: "i don't like how the time signature or
beats are chosen and the sound and the count in and how are they ordered for the relevance. research more")
- Research:
  - Flat's metronome is one control by the Play button with three modes: **Count-in** (it plays only before
    playback, Flat's default), **Always on** and **Off**.
  - MuseScore's count-in plays one full bar of the time signature where playback starts, filling a pickup bar.
  - Score players take the beats from the notation; none asks the learner for a meter.
  - The sound is a preference that is set once.
- Ruling: in the Player the meter and its accent come from the score (beat 1 accented, the bar's own beats), so
  nothing is chosen. Count-in and the metronome are one control with three states. The order follows how often each
  is touched: tempo, then the metronome's mode, then volume, then sound.
- Will build, Pace after the Wait · Play tiles, one group:
  1. **Tempo**: − · the BPM large · + · Tap (it works in Wait).
  2. **Metronome**: Off · **Count-in** (one bar before playing, the default) · Always (dimmed in Wait).
  3. **Volume** (dimmed when Off or in Wait).
  4. **Metronome sound ›**, a link row to its one home, the Metronome tool's settings (Click · Beep · Drum).
- Gone from the Player: the Beats squares, the Count-in bars choice, the Sound choice, the separate on/off switch.
  Before each repeat of a loop, the count-in is still the loop's "Between repeats: Count-in".

## Independent settings, none disabled by another (owner, 2026-11-07: "now it is not understandable how the
metronome is enabled and in what mode and why it is disabled in the wait mode ... research how a feature can disable
another feature or how it shouldn't and how each feature relates to another")
- Principles:
  - **Modes cause slips.** A setting whose meaning changes with another state is a mode, and people err when they
    cannot see which mode is on (NN/g, Modes in user interfaces). An Off · Count-in · Always control is a three-state
    mode in which "on" is hidden inside a word.
  - **Disabled controls explain nothing.** They look usable, do nothing and give no reason (NN/g, Why disabled buttons
    hurt UX; USWDS research, 2023: keep controls enabled and give feedback). Disable a control only when it truly
    cannot work, and then say why where the learner can see it.
  - **Dependencies are shown by structure.** A child setting sits under the parent it depends on (Apple HIG,
    Toggles: a primary switch with subordinate ones). Two settings that do not depend on each other are siblings.
  - **Orthogonality.** Each control does one thing in every mode. Combinations are made by the learner, never
    implied by the app.
- Ruling, how the pieces relate: the metronome and the count-in are parts of the music, so they behave like the
  music in every mode. In Play they keep the tempo. In Wait the clicks go on while the music moves, at the tempo, and
  stop when it stops to wait for the learner, as the accompaniment does. Nothing in Pace disables anything else. Both
  play the same click, so the click's volume and sound are named for the click and apply to both.
- Will build, Pace after the Wait · Play tiles, one group:
  1. **Tempo**: − · the BPM large · + · Tap.
  2. **Metronome**, a switch (off): clicks with the music.
  3. **Count-in**, a switch (on): one bar of clicks before the music starts.
  4. **Click volume**. 5. **Click sound ›**, a link to its home in the Metronome tool.
  - In a loop, **Between repeats** offers None · Count-in · Rest, and **Speed up each pass** works in both modes.

## One Metronome group, sounds that work (owner, 2026-11-07: "but now the metronome sounds don't work and the names
don't work for the other sounds")
- Fault: Click sound was a link that led nowhere, and the canvas played one fixed tone whatever the sound and volume.
  "Click volume" and "Click sound" also named one of the three sounds as the whole.
- Will build: under the Wait · Play tiles, a **Metronome** group holding everything the metronome does, so the
  header names the device and each row says when or how it sounds:
  1. The tempo: − · BPM · + · Tap.
  2. **While playing**, a switch (off): clicks with the music.
  3. **Count-in**, a switch (on): one bar of clicks before the music starts.
  4. **Sound**: Click · Beep · Drum. Choosing one plays it once.
  5. **Volume**.
- Both the clicks and the count-in sound with the chosen sound at the chosen volume, the first beat higher. Canvas
  check: a choice plays its sound (square, sine, noise), and while playing Drum is heard for the count-in and every
  beat.

## A professional metronome (owner, 2026-11-07: "still not good and make professional names ... research now how a
metronome should look and what options should it have")
- Research:
  - **Logic Pro:** "Click while playing" turns the metronome on in playback, and the count-in can be the only click.
    Volume and Tone (a short click up to a wood block or claves).
  - **Dorico:** a Click page with Count-in in bars (1 bar by default) and the sounds click, beep and wood block.
  - **Metronome apps** (Soundbrenner, Pro Metronome): the face shows the bar's beats lighting in time, the accented
    first beat larger, the tempo large with tap tempo. The deeper options sit behind it.
  - **Tempo markings** (Largo … Presto) name the tempo in the musician's term.
- Names (UX copy, the musician's term winning): **Click while playing** (Logic), **Count-in** with **1 bar** ·
  **2 bars** (Dorico), sounds named for the instruments they imitate: **Wood block** · **Claves** · **Beep**.
- Will build, the Metronome group:
  1. **The face**: the score's meter (3/4) and a light for each beat of the bar (beat 1 larger), lighting in time
     while playing. Under it: − · the BPM large with "BPM · Andante" · + · **Tap**.
  2. **Click while playing**, a switch (off).
  3. **Count-in**: Off · 1 bar · 2 bars (1 bar).
  4. **Sound**: Wood block · Claves · Beep (Wood block). Choosing one plays it.
  5. **Volume**.
- The meter and accent come from the score. Tempo markings: Largo < 60, Larghetto < 66, Adagio < 76,
  Andante < 108, Moderato < 120, Allegro < 156, Vivace < 176, else Presto.
- In the app the sounds are recorded samples (VCSL, CC0): a wood block, claves and an electronic beep.

## References from sheet-music players, not recording software (owner, 2026-11-07: "but use examples for music and
sheets and not for recording")
- **forScore:** each score keeps its own BPM and time signature, used whenever it is opened. BPM by + and −, a wheel
  or two taps. Count In for a set number of measures. The metronome can be heard, seen or both.
- **MuseScore** (Play panel): **Play metronome** and **Count-in** are separate toggles. The count-in is one measure,
  with extra beats to fill a pickup bar.
- **Soundslice:** the count-in is in the metronome menu, 1, 2 or 3 bars, before playback and before each loop.
- **Flat:** the metronome beside Play.
- Changes from the section above: the switch is **Play metronome** (MuseScore's name, replacing Logic's "Click while
  playing"). When the tempo differs from the score's, a **Score tempo: 80 BPM** button under it brings it back
  (forScore keeps the score's own tempo). The face's beat lights are the metronome seen, the switch the metronome
  heard. Count-in stays Off · 1 bar · 2 bars (Soundslice, forScore). Sound stays Wood block · Claves · Beep. forScore
  plays a tick and a tock, which the learner can replace. Which sounds the other players offer was not found.

## Versions chosen like the modes (owner, 2026-11-07: "make the versions switch like the mods switch")
- Will build: the song's versions in Settings are the same tile control as Pace's Wait · Play: three tiles, each an
  icon and a word, **Easy** (one bar), **Medium** (two bars), **Original** (three bars), the chosen one outlined.
  There is no "Difficulty" label, because the tiles say it. One component serves both (`tiles`). Transpose follows in
  its own group.
