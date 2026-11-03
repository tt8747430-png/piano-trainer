# Settings, redesigned (Decided 20 and 21)

Replaces round 1's S0–S14 (`plan/round-1.md` lines 68–611). Where this file and round 1 differ, this file holds;
what round 1 got right is kept and cited. Scope: where every setting and every repeated action lives, the app's
Settings, each page's own Settings page, the Metronome as a tool, the duplicate audit, the registry, the routes
and the tests. What each Practice page *shows* (its controls for the thing you look at) is
`plan/practice-redesign.md`'s; this file only says which choices leave a page for its Settings and which stay.

Read with: `prompt.md` Decided 20 (404–420) and 21 (422–461), R9 (143), R18 (189–200), R19–R25 (203–265), A10
(654–660), A12–A14 (672–714), A24 (1004–1030), A39 (1534–1564), B7 (1850–1856), B10–B11 (1898–1934); the code as of
commit `6b5d3ebe`.

---

## Corrections to earlier descriptions

1. **`plan/round-1.md` S1** ("`ChoiceRow` "Chord playback" — Block · Broken · Rolled … the capsule's separate
   "Arpeggio" button goes"). Decided 21 says "Chords' Play and Arpeggio: together, but distinct: two buttons". Correct:
   Play and Arpeggio stay two buttons on the page (practice-redesign); Chords' Settings has no "Chord playback" row.
   Its only sound setting is how the Arpeggio button rolls (ST7).
2. **`plan/round-1.md` S1, row "Fingering" (`chords.fingering`)** and **`plan.md` "Conflicts" row 1** ("One app-wide
   **Fingering** switch in General"). Both add a switch for something the page already folds away (the Fingering
   section folds, `foldedSections`) and the Player already shows or hides (View › Fingers). A third control for
   one idea breaks Decided 21. Correct: no Fingering switch anywhere in Settings; the Fingering section's fold is
   the one control on a Practice page, View › Fingers in the score screen (ST19 row 5).
3. **`plan/round-1.md` S12** ("Sound and recording becomes **"Sound"** … a `RowLink` "Metronome ›" … If round 3
   adds none, the page and its row go"). Decided 21 asks to "decide properly". Decided: the page goes now (ST5).
4. **`plan/round-1.md` S9** ("Group **"Audio playback"** … one volume slider per staff … stays"). The staff
   volumes sit on a settings page while each staff's Play and Show switches sit in the Setup's Staves: one idea (a
   staff's part in the mix) in two places. Correct: volume joins Play and Show in Setup › Staves, as Flat's mixer
   has mute and volume on one row (ST15).
5. **`plan/round-1.md` S7** ("Group "Instruments" (S0) — not drawn here … Count-in is the Player's"). Kept. But
   "`sound.click`, its home moves from `player` to `metronome`" is kept only with the one-engine rule written out:
   the Player's count-in and click take the Metronome's sound and volume (ST13).
6. **`plan/round-1.md` S10** ("Its groups in order: Title and credits, Instruments, Music, Layout (unchanged, this
   score's)"). Music (Tempo, Key, Time) is also edited by tapping the printed marking on the score
   (`PrintedEdit.tsx`) and from the palette: the same popover in two places. Correct: Tempo, Key and Time leave
   the score's Settings (ST16).
7. **`plan/round-1.md` S11** ("Group "Instruments" is not drawn (no piano on Songs) … one row until B9"). Decided 21
   names three Songs surfaces (the songs page, a folder, a song's overview). Correct in ST17: three Settings pages,
   the folder's replacing its ⋯ menu.
8. **`plan/round-1.md` S0, "the last group … **"Instruments"**"**. The word is the score's instruments elsewhere
   (Score settings › Instruments, New song's step). Correct: the link group is **"Piano"** (ru «Пианино»), the same
   name as the app's Settings group that holds those pages (ST1).
9. **`src/widgets/score-view-menu/ui/ScoreViewMenu.tsx` doc** ("how it plays is the Setup's: nothing is here twice")
   and **`PlayerSettings.tsx`** (layout, keys and finger numbers drawn again). The View and the Player's settings
   both write `scoreView.layout`, `scoreView.keys`, `practice.fingerNumbers`. Corrected in ST15.
10. **`CLAUDE.md` "The score editor"** ("its Unpublished changes (status, Publish, Versions, Discard) in the bar by
    Done and on the song's Settings, only while there are some"). Two menus for one act set. Correct: the menu is
    the editor bar's; the song's Settings shows a link row to it (ST19 row 22).
11. **`CLAUDE.md` "Songs"** ("one Export… sheet (MusicXML, MIDI, Share link; the Player's More opens it too)").
    Correct: Export… is on the song's Settings only; the Player's More keeps Print (ST15, ST19 row 20).
12. **`docs/adr/0052-practice-and-search.md:80`, `0025-training.md:46`, `0105-the-player.md:53`,
    `0115-one-score-two-modes.md:46`**: as round 1's corrections 1–4 (each page's Settings under its own path,
    opened from its own gear; no rows in the app's Settings). Kept.
13. **`features/live-keyboard/ui/KeyboardSettingsFields.tsx` row "Play what you choose" (`keyboard.autoplay`)**
    sits on On-screen piano but is about Practice pages ("A chord or a scale chosen on a Practice page plays at
    once"). Correct: it leaves the On-screen piano page; each explorer gets its own "Play when chosen" (ST7–ST10).
14. **`progress.md` rows A10, A12, A14, B7** describe `/settings/player`, `/settings/score-editor`, the Practice
    group and "Sound and recording" as built. They become "redo per `plan/settings.md` ST1–ST20".
15. **`docs/UBIQUITOUS_LANGUAGE.md`**: "Hear notes as you edit" → **Play notes while editing** (Avoid: Hear notes as
    you edit); add **Page settings** (a page's own Settings, from its gear; Avoid: kind page) and **Settings** (the
    app's, from the Profile's gear or the sidebar; Avoid: app settings, preferences).

---

## Research: how settings are done

| Source | What it does | What we take |
|---|---|---|
| Apple HIG, *Settings* (developer.apple.com/design/human-interface-guidelines/settings) | "Provide a custom settings area … to offer general settings that affect your overall experience … If you need to offer settings that affect only a specific task, you can provide these options within the task itself". "Prefer letting people modify task-specific options without going to your settings area … showing or hiding parts of the current view … make these options available in the screens they affect". "Minimize the number of settings". "Avoid including redundant versions". | Three homes: the app's Settings (app-wide, rarely changed); a page's own Settings (how that page always behaves); the screen itself (show/hide parts of what you look at: the View menu). No copy anywhere. |
| iOS Settings | Account card first; groups of rows, each a coloured icon tile; each app's page lists only that app's settings. | The app's Settings list (ST1), as round 1 built it. |
| Noji, deck Settings (`new_app_2/IMG_4870.PNG`) | A gear on the deck opens "Settings" for that deck: Spaced repetition, Text-to-speech, Card style, Sharing, Publish in library, Import, Rename, Move, Duplicate…, all with ›. | Every item and page has a gear to its own Settings page, a page not a sheet, Back up to the item (ST0). |
| memory-palaces (`src/pages/settings`, `deck-settings`) | App Settings: Preferences (notifications, sound, haptics, reduced motion, daily goal, theme, language, swipe actions, select toolbar), Privacy & data, Support. Deck settings: Study (text-to-speech, card style), Manage (import, rename, move, duplicate, reset, archive, export, delete). | The deck shape for a song's and a folder's Settings (ST17): what it is, how it looks, then its acts, destructive last. |
| Flat (`flat-score-editor/05-playback-options-sheet.png`; help.flat.io *Playback speed*, *Metronome*) | One "Playback options" sheet from the speaker: Audio playback ›, Metronome ›, Playback speed ›. Playback speed "is not engraved and will not be persisted into the score"; the metronome is count-in by default. | The Player's Settings groups (ST15): playback is the learner's, not the score's; the metronome one engine with its own page. |
| new-app scale page (`new-app/IMG_4695.PNG`) | A "…" sheet under the scale: One/Two hands, Octave range 1–4, start octaves, Tempo, Use metronome, Ticks between loops. All of it is what you play now. | What you play now stays on the page (practice-redesign); only "how it always behaves" goes to Settings. |
| journey app Settings (`journey-app/05-settings/01.png`) | App Settings holds Piano sounds, MIDI keyboard (input switch, a test), Tools. | The app's Settings holds the instrument pages (ST1 "Piano" group). |
| Soundbrenner (suggestions.soundbrenner.com, App Store notes) | Accents cycled by tapping beat markers on the face; subdivision set with the time signature on the face; screen flash under Settings › Display & flashes. | Metronome (ST13): accents, meter, subdivision on the face; sound, volume, flash on its Settings. |
| MuseScore 4 Preferences (handbook.musescore.org/4/preferences); Dorico "Play notes during note input" | A Note input section holds "play notes when editing" and its duration. | Score settings › **Note input** › "Play notes while editing" (ST16). |

The rule this gives (written into DESIGN.md "Settings" in ST20):

- **On the screen:** what you look at or play now (this chord, this scale, the tempo, which view, what the view
  shows). In the URL or remembered per page (`pt-views`).
- **The page's Settings** (its gear): how that page always sounds and behaves, for every chord, scale, song.
- **The app's Settings:** what every page shares: the account, language and theme, notation, storage, and the
  instruments (the on-screen piano, a connected piano, the computer keys).
- **Never twice.** A setting has one control in the whole app. Elsewhere at most a link row ("On-screen piano ›").
- **Acts:** once per screen. A list's context menus (a row's ⋯, long press, swipe, Select's bar) repeat an item's
  acts by design (R11, R19); a screen's bar and menus never hold the same act twice, and a menu never holds a
  setting.

---

## ST0: The shape of every page's Settings (frame, gear, rows)

- **Source:** Decided 20 (413–417), Decided 21 (430–433: "its own Settings page from its own gear, like a
  lesson's"); R20 (206–216), R24 (248–256), R25 (257–265); round 1 S0 (kept, corrected below).
- **Today:** a lesson's Settings (`pages/lesson/ui/LessonSettingsPage.tsx`): `ScreenHeader` "Settings" with Back,
  the item's name in display type in a `max-w-2xl` column, `SettingsGroup flush` cards of rows with tiles, the
  destructive group last. A song's (`pages/piece/ui/SongSettingsPage.tsx`) and a score's
  (`pages/score-editor/ui/ScoreSettingsPage.tsx`) copy that frame by hand. The Practice pages' Settings use
  `PracticeSettingsScreen` → the app's two-pane `SettingsScreen`, so on a laptop they open inside the app's
  Settings list. Gears: `widgets/practice-pages/ui/SettingsGear.tsx`, the Player's inline gear
  (`PlayerLayout.tsx:170–178`, cog `Settings`), the editor's (`EditorHeader.tsx` `SettingsButton`, icon
  `Settings2`): two different icons for one act.
- **Will build:**
  - `src/shared/ui/PageSettingsScreen.tsx`, exported from `shared/ui`:
    `function PageSettingsScreen({ name, children }: { name: string; children: ReactNode }): ReactElement`.
    Draws: `ScreenHeader title={t('common:settings')}` ("Settings", ru «Настройки») with `<BackButton />`
    (`useUp()`, R26); then `<div className="mx-auto flex w-full max-w-2xl flex-col gap-7">` with `<p>` `name` in
    the lesson page's title style (`px-1 font-display text-2xl font-semibold text-balance`), then `children`. One
    column at every width (R20's two panes are the app's Settings alone). Lesson, course, song, score and every
    page below use it; their hand-copied frames go.
  - `src/shared/ui/SettingsGear.tsx`: `function SettingsGear({ name, to, params }: { name: string; to: string;
    params?: Record<string, string> }): ReactElement`, a round bar button with the cog icon (`Settings`, lucide),
    `aria-label` and tooltip "{{name}} settings" (ru «Настройки: {{name}}»), navigating with `search: true` so Back
    returns to the page as it was. The **one** gear: it replaces `widgets/practice-pages/ui/SettingsGear.tsx`, the
    Player's inline button and the editor's `SettingsButton` (whose `Settings2` icon goes: one icon, one meaning,
    Decided 21). Its place in every bar: last of the bar's round actions, before More (⋯) and before Edit/Done.
  - Rows: only R24's five shared rows (`RowLink`, `ChoiceRow`/`PictureChoice`, `SwitchRow`, `ActionRow`,
    `DangerRow` in `DangerGroup`), each with its tile, each preference row drawn by the registry renderer
    (`SettingsRows`, ST20) unless marked **custom** below.
  - The link group at the end of a page that plays the piano: heading **"Piano"** (ru «Пианино»), rows `RowLink`
    **"On-screen piano"** › and **"Connect a piano"** › (value: the MIDI summary, "Not connected" / the device's
    name). On the Player and every Practice page except the Metronome.
  - No `from` search on any settings route: the parent is the path above it (`validatePracticeSettingsSearch`,
    `PracticeSettingsFrom` go).
- **Not in this item:** the app's Settings screen (ST1, two panes kept).
- **Done when:**
  - `src/shared/ui/PageSettingsScreen.test.tsx` "titles the bar Settings, names the page under it, Back goes up".
  - `src/shared/ui/SettingsGear.test.tsx` "names its page in its label and tooltip; keeps the page's search".
  - `src/app/one-icon.test.ts` (new): no module under `src/pages` or `src/widgets` imports `Settings2` from
    `lucide-react` (the gear is `SettingsGear` alone).
  - Screenshots `shots/after/page-settings-{chords,lesson,song}-{390x844,844x390,1280x800}.png`: the same bar, title
    style and column.

## ST1: The app's Settings: what it holds and how it is grouped

- **Source:** Decided 20 (413–417: "The app's Settings holds only what is app-wide"); Decided 21 (437–439: "today it
  duplicates page settings … the playing pages … are not intuitively structured. Each setting goes to the page it
  belongs to"); R18 (199), R21 (category rows), A14 (704–714), A15 (715–727); D13 (two panes).
- **Today:** `widgets/settings-screen/ui/SettingsList.tsx`: account card; **General** (General, Storage and
  backup); **Playing** (On-screen piano, Connect a piano, Computer keys, Sound and recording, Player, Score
  editor); **Practice** (Chords, Scales and keys, Intervals, Progressions, Accompaniment, Chord finder, Exercises
  and Quiz); **Help** (How to use, Privacy, Terms, version rows); Admin.
- **Will build** (`/settings`, two panes from 64rem as today; the list in this order):
  1. Account card (unchanged, A15).
  2. Group **"General"** (ru «Основные»): `RowLink` **"General"** (tile `Settings2`→ replaced by `SlidersHorizontal`,
     sky; the cog is the gear's alone) → `/settings/general`; `RowLink` **"Storage and backup"** (`HardDrive`,
     grass) → `/settings/storage`.
  3. Group **"Piano"** (ru «Пианино»; was "Playing"): `RowLink` **"On-screen piano"** (`Piano`, lilac);
     **"Connect a piano"** (`Cable`, sky, value the MIDI summary); **"Computer keys"** (`Keyboard`, sand). Three
     rows, named after what the learner plays on (R22); the quick test of A14 answers: "my digital piano" →
     Connect a piano; "note names on keys" → On-screen piano; "metronome" → not here: Practice › Tools ›
     Metronome, whose page has its gear.
  4. Group **"Help"** (unchanged rows: How to use, Privacy, Terms, the version rows; B9's About joins it).
  5. Admin (an admin's, unchanged).
  - Leave the list: Sound and recording (ST5), Player (ST15), Score editor (ST16), the whole Practice group
    (`PRACTICE_SETTINGS` deleted; each page's gear, ST7–ST14).
  - `SettingsList` reads its rows from `APP_PAGES` in the registry (ST20), so a page added there shows here and a
    page not there cannot.
- **Not in this item:** B10's customisable bars (their homes are decided in ST15–ST17, built in round 13).
- **Done when:**
  - `src/widgets/settings-screen/ui/SettingsList.test.tsx` (new) "lists exactly the app-wide pages": row names
    General, Storage and backup, On-screen piano, Connect a piano, Computer keys, How to use, Privacy, Terms; none
    named Chords, Player, Score editor, Sound and recording, Metronome.
  - Screenshots `settings-list-{390x844,844x390,1280x800}.png`, before and after.

## ST2: On-screen piano

- **Source:** Decided 21 (437–439: the playing pages "not intuitively structured"; "No duplicate menus or settings
  anywhere"); A13 (pictures), A14, A26 (1065–1083: the rail's controls, "what to keep on it is chosen in On-screen
  piano settings").
- **Today:** `/settings/on-screen-piano` (`KeyboardSettingsFields.tsx`): **Look** (Key size picture: All 88 · Fit ·
  Large; Key length: Long · Short; Note names: Every C · Every key · None; Names on marked keys; Chord names),
  **Position** (Piano position: At the bottom · At the top; Fold the keys: Never · On its side · Always),
  **Playing** (A swipe on the keys: Scrolls · Plays; Play what you choose), **Buttons on the bar** (seven
  checkboxes: Key size, Note names, Chord names, Computer keys, MIDI sound, Glissando, Pedal). The rail
  (`LiveKeyboard`) draws the chosen buttons, five of which (Note names, Chord names, Computer keys, MIDI sound,
  Glissando) are second controls for rows on this page or on Computer keys / Connect a piano; Key size's − + is a
  second control for the Key size row; the rail's ⌄ "Hide the keys" writes the same `keyboard.folded` as "Fold the
  keys › Always".
- **Decision and why:** the rail is the instrument's own bar, used with a hand on the keys: it keeps what is done
  *while playing* and is not a setting row anywhere (GarageBand's and Ultimate Piano's keyboards keep octave,
  zoom and sustain on the keys; new-app keeps the rest in a sheet). Everything that is set once lives on this
  page, once. So each duplicate goes from one side:
  - **Rail keeps (fixed, not customisable):** ‹ › move an octave, − + key size (`keyboard.keySize`: All 88 · Fit
    · Large, stepping), **Pedal** (latched sustain, A26; an act, not saved), ⌄ **Hide the keys** (`keyboard.folded`,
    the one place it is set; the floating "Keys" button brings them back). Each with an icon and its name on hover
    and for screen readers (A26).
  - **Rail loses:** Note names, Chord names, Computer keys, MIDI sound, Glissando (their one home is a row below or
    on ST3/ST4). With nothing left to choose, "Buttons on the bar" (`keyboard.railControls`,
    `RailControlsField.tsx`, `RAIL_CONTROLS` choice) goes.
  - For church accompanists on a phone on the stand: the four rail controls are the ones a hand reaches for
    mid-song (a bigger key, the pedal, the keys out of the way); names and swipe behaviour are chosen once at home.
- **Will build** (`/settings/on-screen-piano`, title "On-screen piano", ru «Пианино на экране»):
  - Group **"Keys"** (ru «Клавиши»):
    1. `PictureChoice` **"Key length"** — **Long** · **Short** (a tall and a short key), default Long
       (`keyboard.keyLength`).
    2. `PictureChoice` **"Note names"** — **Every C** · **Every key** · **None** (three mini keyboards), default
       Every C (`keyboard.namedKeys`).
    3. `SwitchRow` **"Names on marked keys"** (ⓘ "A chord's or a scale's keys show their note name"), default on
       (`keyboard.markNotes`).
    4. `SwitchRow` **"Chord names"** (ⓘ "The bar over the keys names the chord you hold"), default on
       (`keyboard.chordNames`).
  - Group **"Position"** (ru «Расположение»):
    5. `PictureChoice` **"Keyboard position"** — **Bottom** · **Top** (two page outlines), default Bottom
       (`keyboard.dock`). Label was "Piano position" (R22 asks "Keyboard position"; A13).
    6. `SwitchRow` **"Hide on a phone on its side"** (ru «Скрывать на телефоне боком»), ⓘ "A phone turned sideways
       shows the page; the Keys button brings them back", default on (`keyboard.foldedLandscape`). Replaces "Fold
       the keys: Never · On its side · Always" (its "Always" is the rail's ⌄, ST19 row 16).
  - Group **"Playing"** (ru «Игра»):
    7. `PictureChoice` **"Swipe on the keys"** — **Scroll** · **Glissando** (a scrolling hand, a sweep), default
       Scroll (`keyboard.swipe`). "Plays" becomes the musician's word "Glissando".
  - Leave this page: Key size (rail − +), Fold the keys (rail ⌄ + row 6), Play what you choose (ST7–ST10), Buttons
    on the bar (gone).
  - Files: `features/live-keyboard/ui/KeyboardSettingsFields.tsx` (rows 1–7, drawn by `SettingsRows` with
    `PictureChoice` pictures passed as `custom`), `LiveKeyboard.tsx` (rail fixed: `KeyZoom`, octave, `PedalToggle`,
    fold), delete `RailControlsField.tsx`, `NamedKeysToggle.tsx`, `ChordNamesToggle.tsx`, `TypingToggle.tsx`,
    `GlissandoToggle.tsx` (+ test), `connect-midi/ui/MidiSoundToggle.tsx`; `shared/lib/keyboard-choices.ts`
    `RAIL_CONTROLS`/`railControls` go; `KeyboardSettings.railControls`, `.autoplay`, `.folded` stays (rail),
    `pt-settings` version bump (ST20).
- **Not in this item:** what the keys draw (A26's labels per key, the pedal lamp): rounds 3–4.
- **Done when:**
  - `features/live-keyboard/ui/LiveKeyboard.test.tsx` "the rail holds octave, key size, pedal and hide, nothing
    else"; `KeyboardRail.test.tsx` "− + steps All 88 · Fit · Large and saves it".
  - `pages/settings/ui/OnScreenPianoPage.test.tsx` (new) "draws seven rows in Keys, Position, Playing; no Key size,
    no Buttons on the bar"; "Hide on a phone on its side off keeps the keys on a phone on its side" (stub a 844×390
    landscape match).
  - Screenshots `on-screen-piano-{390x844,844x390,1280x800}.png` and the rail on Chords at 390×844.

## ST3: Connect a piano

- **Source:** A14 (708–709: "devices, sound, log, how to connect by cable or Bluetooth"), Decided 21 (437–439), R24.
- **Today:** `/settings/connect-piano` (`pages/midi-settings/ui/MidiSettingsPage.tsx`): a card of MIDI input, MIDI
  output, MIDI input plays sound; Connected devices; Playing (Octave shift, Touch, Pedal); Bluetooth; Troubleshooting
  (MIDI log ›). Its MIDI sound is also the rail's "MIDI sound" button (goes, ST2).
- **Will build** (title **"Connect a piano"**, ru «Подключить пианино»; order is the order a learner connects in):
  - Group **"Connection"** (ru «Подключение»):
    1. `SwitchRow` **"Use a MIDI piano"** (was "MIDI input"; ⓘ today's `inputNote`), default on (`midi.input`).
    2. **custom** device list "Your pianos" (ru «Ваши инструменты»), today's `MidiDeviceList`, the one heard
       marked (`midi.device`); empty state "Plug in by USB or pair by Bluetooth, then press a key".
    3. `RowLink` **"Bluetooth pairing"** › (today's `BluetoothPairing` as its own page `/settings/connect-piano/
       bluetooth`: one group of steps, since it is help, not a setting).
  - Group **"Sound"** (ru «Звук»):
    4. `SwitchRow` **"Play the app on the piano"** (was "MIDI output"; ⓘ "Songs and examples sound from the piano's
       own speakers"), default off (`midi.throughPiano`).
    5. `SwitchRow` **"Sound the keys you play"** (was "MIDI input plays sound"; ⓘ "For a keyboard without
       speakers"), default off (`midi.sound`). Its one home (the rail's MIDI sound goes).
  - Group **"Playing"** (ru «Игра»):
    6. `ChoiceRow` **"Octave shift"** — menu −2 · −1 · 0 · +1 · +2, default 0 (`midi.octaveShift`).
    7. `ChoiceRow` **"Touch"** (Velocity curve in DAWs; label kept) — segmented Light · Normal · Heavy, default
       Normal (`midi.touch`).
    8. `ChoiceRow` **"Sustain pedal"** (was "Pedal") — segmented **Normal** · **Reversed**, default Normal
       (`midi.pedal`).
  - Group **"Troubleshooting"**: `RowLink` **"MIDI log"** › with its count (unchanged).
  - Rows 4–5 are drawn only once input is on and a device is chosen where they need one (R30); they are hidden, not
    greyed.
- **Done when:** `pages/midi-settings/ui/MidiSettingsPage.test.tsx` "groups Connection, Sound, Playing,
  Troubleshooting in that order"; "Bluetooth pairing opens its page and Back returns"; screenshots
  `connect-piano-{390x844,1280x800}.png` with and without a device (fake `webMidi`).

## ST4: Computer keys

> **Decided 22 (wins over this item):** Computer keys is **not its own page**. Its two groups ("Playing the piano"
> with the key map, "Shortcuts") become the last groups of the **On-screen piano** page (ST2), drawn only on a
> device with a fine pointer and a keyboard; `/settings/computer-keys` goes (its route, its row in ST1, its parent),
> and the Settings list's Piano group holds On-screen piano and Connect a piano. Test: `OnScreenPianoPage.test.tsx`
> "shows Computer keys on a computer and not on a phone".

- **Source:** A14 (710: "typing, octave and pedal keys, shortcuts"), R21 (show, don't describe).
- **Today:** `/settings/computer-keys`: switch "Play from the computer keys" (ⓘ lists Z X and Space) and a
  Shortcuts button. The rail's ⌨ is a second switch (goes, ST2).
- **Will build** (title **"Computer keys"**, ru «Клавиши компьютера»):
  - Group **"Playing the piano"** (ru «Игра на пианино»): 1. `SwitchRow` **"Letters play the on-screen piano"**,
    default on where the pointer is fine (`keyboard.typing`, `defaultKeyboard`). 2. **custom** picture under it (no
    row): a small computer keyboard drawing with A W S E D F T G Y H U J K on two piano octaves, Z X marked "Octave
    − +", Space marked "Pedal" (`ComputerKeysPicture` in `shared/ui/pictures`), replacing the ⓘ text (R21). Drawn
    only while the switch is on.
  - Group **"Shortcuts"** (ru «Сочетания клавиш»): `RowLink` **"Keyboard shortcuts"** › opening today's
    shortcuts sheet (`ShortcutsButton` becomes the row; ⌘/ stays its own shortcut).
- **Done when:** `pages/settings/ui/ComputerKeysPage.test.tsx` "shows the key map only while letters play";
  screenshot `computer-keys-{390x844,1280x800}.png`.

## ST5: Sound (was Sound and recording)

- **Source:** Decided 21 (459: "'Sound and recording' in the app's Settings: decide properly"); R18; A35 ("Play
  melody" goes); A27/D15 (the sampled piano).
- **Today:** `/settings/sound-and-recording` (`pages/settings/ui/SoundPage.tsx`): Recording (Metronome while
  recording `recorder.click`, Play melody `recorder.tune`) and a link to the Metronome page.
- **Decision and why:** nothing on it is app-wide. Recording happens in the score editor only, so its click is the
  editor's (ST16); "Play melody" is deleted (A35); the metronome's sound is the Metronome's (ST13). The sampled
  grand (A27) is not a choice: there is one piano sound, and a choice between it and the synthesised fallback would
  be a control that only makes things worse (R30). Its download size and "Download for offline" are storage, so
  they go to Storage and backup (ST6). Flat and the journey app also keep sound under the playback or the
  instrument, not a page of its own.
- **Will build:** the page, its route `/settings/sound-and-recording`, its parent entry, its list row, `SoundPage.tsx`,
  `features/record-take/ui/TuneSwitch.tsx`, `RecorderSettings.tune` and its i18n go. `MetronomeSwitch` moves to the
  score's Settings (ST16).
- **Done when:** `src/app/router.test.tsx` "has no /settings/sound-and-recording"; `registry.test.ts` "no setting
  homed on sound-and-recording".

## ST6: General and Storage

- **Source:** R18 (199), A32 (app-wide notation), A15 (Storage), D15 (sample size in Storage).
- **Today:** General: Language (menu), Lessons read as (menu), Theme (pictures). Storage and backup as A15 built.
- **Will build:**
  - **General** (`/settings/general`): Group 1: `ChoiceRow` **"Language"** — menu English · Русский (`locale`).
    Group 2: `PictureChoice` **"Appearance"** (iOS's word; was "Theme") — **Automatic** · **Light** · **Dark**
    (three screen previews), default Automatic (`theme`, values unchanged). "Lessons read as" leaves (ST18).
    Group **"Notation"** (ru «Нотная запись»), each row drawn only when practice-redesign/A32 wires it into every
    page (R30): `ChoiceRow` **"Note names"** — **C D E** · **До Ре Ми**; `ChoiceRow` **"Chord symbols"** —
    **Cmaj7** · **CΔ7** · **CM7**. These are app-wide because every page, the Player, the Quiz and the score's chord
    symbols draw them (one key each, home `general`).
  - **Storage and backup** (`/settings/storage`): unchanged (A15), plus, when A27 ships, group **"Piano sound"**:
    a value row **"Grand piano samples"** with its size ("18 MB") and `ActionRow` **"Download for offline"** /
    status "Downloaded".
- **Done when:** `pages/settings/ui/GeneralPage.test.tsx` "has Language and Appearance, no reading row"; the
  Notation rows' tests land with A32.

## The Practice pages: one split for all (ST7–ST14)

What stays on a Practice page and what goes to its Settings, decided once:
- **On the page** (URL or `pt-views`): the thing shown and how you play it *now*: root, quality, size, voicing,
  inversion, hands, scale, octaves, start, rhythm, tempo, key, progression, pattern, meter, beats, subdivision.
  new-app keeps exactly these in its scale's "…" sheet (`new-app/IMG_4695.PNG`); practice-redesign decides their
  controls.
- **On its Settings:** how the page always behaves and names things, the same for every chord, scale, interval:
  plays when chosen, how the Arpeggio rolls, naming, which families or sources are listed, rounds.
- **Every page's Settings** is `PageSettingsScreen` (ST0) at `/practice/<page>/settings`, its gear in the page's
  bar, parent the page with its search; it ends with the "Piano" links group (ST0), except the Metronome.
- `keyboard.autoplay` ("Play what you choose", one switch for four pages, on the On-screen piano page) splits into
  each explorer's own **"Play when chosen"** (default on): a learner who wants silent Chords may still want
  Progressions to sound. Four keys (`chords.autoplay`, `scales.autoplay`, `intervals.autoplay`,
  `progressions.autoplay`).

## ST7: Chords settings

- **Source:** A24 Chords (prompt ~1013), Decided 21 (447–451: Play and Arpeggio "together, but distinct"), Decided 20.
- **Today:** gear → `/settings/chords?from=chords` (`ExplorerSettingsPages.tsx`), only the two link rows.
- **Will build:** route `/practice/chords/settings`, gear "Chords settings"; `src/pages/chords/ui/
  ChordsSettingsPage.tsx`; name "Chords".
  - Group **"Sound"** (ru «Звук»):
    1. `SwitchRow` **"Play when chosen"** (ru «Играть при выборе»), default on (`chords.autoplay`).
    2. `PictureChoice` **"Arpeggio"** (ru «Арпеджио») — **Up** · **Down** · **Up and down** (three small staves of
       a broken chord rising, falling, both), default Up (`chords.arpeggio: 'up' | 'down' | 'updown'`). What the
       page's Arpeggio button plays; Play stays a block chord.
  - Group **"Piano"** (ST0).
  - Not here (decided): chord symbol style (General › Notation, app-wide); Fingering (the page's fold); hands,
    voicing (on the page).
- **Done when:** `src/pages/chords/ui/ChordsSettingsPage.test.tsx` "opens from the gear and Back returns to the chord
  as it was" (`/practice/chords?root=D` → gear → Back → `?root=D`); "Arpeggio Down plays the top note first" (fake
  audio order); "Play when chosen off: choosing Cm plays nothing". Screenshots `chords-settings-*` at the three sizes.

## ST8: Scales and keys settings

- **Source:** A24 Scales, A32, Decided 21 (452–456: "which belongs to the sheet, which to playing").
- **Today:** `/settings/scales?from=scales`, only link rows. On the page: Hands, On the keys, Octaves 1–2, Start
  on, Fingering (From the thumb · As the scale), Rhythm, Tempo, and on Harmony Chord size, Inversion, Keys play.
- **Will build:** `/practice/scales/settings`, gear "Scales and keys settings"; `src/pages/scales/ui/
  ScalesSettingsPage.tsx`; name "Scales and keys".
  - Group **"Sound"**: 1. `SwitchRow` **"Play when chosen"**, default on (`scales.autoplay`).
  - Group **"Fingering"** (ru «Аппликатура»): 2. `ChoiceRow` **"Fingering"** — segmented **Standard** · **From the
    thumb** (ru «Стандартная» · «От первого пальца»), default Standard (`scales.fingering`). The fingering method
    is the same for every scale (the scale books' "standard fingering"), so it is a setting; the page's per-scale
    toggle and its `fingering` URL field go.
  - Group **"Scales listed"** (ru «Гаммы в списке»): 3–5. `SwitchRow` **"Modes"**, **"Pentatonic and blues"**,
    **"Other scales"** (whole-tone, chromatic, diminished), each default on; footnote "Major and minor are always
    listed." (`scales.hidden: readonly ScaleFamily[]`; `scaleFamily(kind)` in `shared/lib/music` with its test).
  - Group **"Piano"** (ST0).
  - Stays on the page (what you play now, practice-redesign lays it out): Root, Scale, Hands, Octaves (1–4, A21),
    Start on, Rhythm, Tempo, the Harmony tab's chord size and inversion. Round 1's move of Rhythm and Chord size to
    Settings is withdrawn: both change the music drawn and played now.
- **Done when:** `ScalesSettingsPage.test.tsx` "opens from the gear, Back keeps the scale"; "From the thumb changes
  the finger numbers on the staff"; "Modes off takes Dorian out of the Scale menu". `ScalesPage.test.tsx` "has no
  Fingering control on the page".

## ST9: Intervals settings

- **Source:** A24 Intervals, A22, Decided 21 (446: Intervals' icons and meanings, practice-redesign's).
- **Today:** `/settings/intervals?from=intervals`, only link rows; names written one way.
- **Will build:** `/practice/intervals/settings`, gear "Intervals settings"; `src/pages/intervals/ui/
  IntervalsSettingsPage.tsx`; name "Intervals".
  - Group **"Sound"**: 1. `SwitchRow` **"Play when chosen"**, default on (`intervals.autoplay`).
  - Group **"Names"** (ru «Названия»): 2. `ChoiceRow` **"Interval names"** — segmented **m3** · **♭3** ·
    **Minor 3rd** (ru «м3» · «♭3» · «Малая терция»), default Minor 3rd (`intervals.names`). Read by Intervals and
    the Quiz's interval answers (one home). 3. `SwitchRow` **"Compound intervals"** (ru «Составные интервалы»;
    ⓘ "Adds the 9th to the double octave"), default off (`intervals.compound`).
  - Group **"Piano"** (ST0).
  - Stays on the page: root, harmonic or melodic (`way`).
- **Done when:** `IntervalsSettingsPage.test.tsx` "m3 names the rows short"; "Compound intervals adds Minor 9th";
  "the Quiz's interval answers follow Interval names".

## ST10: Progressions settings

- **Source:** A24 Progressions, A23, Decided 21 (457–459: passing chords, practice-redesign's).
- **Today:** `/settings/progressions` (`ProgressionsSettingsPage.tsx`): Written as, Voicing, First chord's inversion.
- **Will build:** `/practice/progressions/settings`, gear "Progressions settings"; component moves to
  `src/pages/progressions/ui/ProgressionsSettingsPage.tsx`; name "Progressions".
  - Group **"Sound"**: 1. `SwitchRow` **"Play when chosen"**, default on (`progressions.autoplay`).
  - Group **"Notation"**: 2. `ChoiceRow` **"Written as"** — **Roman numerals** · **Nashville numbers** · **Chord
    symbols**, default Roman numerals (`progressions.names`).
  - Group **"Voicing"**: 3. `ChoiceRow` **"Voicing"** — **Voice leading** · **Root position** (was Voice-led ·
    Block), default Voice leading (`progressions.voicing`). 4. `ChoiceRow` **"First chord's inversion"** — Root ·
    1st · 2nd · 3rd (3rd only where the size has a 7th), default Root (`progressions.inversion`), drawn only under
    Voice leading (R30).
  - Group **"Piano"** (ST0).
  - Stays on the page: key, mode, the progression, chord size, passing chords (practice-redesign).
- **Done when:** today's `PracticeSettings.test.tsx` cases move to `ProgressionsSettingsPage.test.tsx` at the new
  route, plus "opens from the gear and Back returns with the key kept".

## ST11: Accompaniment settings

- **Source:** A24 Accompaniment, A25, R4 (drag).
- **Today:** `/settings/accompaniment`: a switch per source, the last one disabled.
- **Will build:** `/practice/accompaniment/settings`, gear "Accompaniment settings";
  `src/pages/accompaniment/ui/AccompanimentSettingsPage.tsx`; name "Accompaniment".
  - Group **"Sources"** (ru «Источники»), **custom**: a row per source: drag handle, name (Bobrova, Gorshkov, Called
    to Play, Styles… transliterated in English, Cyrillic in Russian, A25), `Switch` "Shown". The last shown source
    has no switch (hidden, R16); footnote "At least one source is shown." Keys `accompaniment.hidden` (kept),
    `accompaniment.order: readonly string[]` (new, empty = built-in order).
  - Group **"Piano"** (ST0).
  - Stays: a pattern's tempo, key and hands (on its page or in the Player's Setup).
- **Done when:** `AccompanimentSettingsPage.test.tsx` "hides a source from the page's picker"; "dragging Styles above
  Bobrova orders the picker" (keyboard drag); "the last shown source has no switch".

## ST12: Chord finder settings

- **Source:** A24 Chord finder, A25 ("⚙ C" button; "the gear opens its Settings page").
- **Today:** `/settings/chord-finder`: Remember the chords, Slash chords, Keys it is in, Scale on the keys. The bar
  has a "⚙ C" button.
- **Will build:** `/practice/chord-finder/settings`, `SettingsGear` "Chord finder settings" replaces "⚙ C";
  `src/pages/chord-finder/ui/ChordFinderSettingsPage.tsx`; name "Chord finder".
  - Group **"Naming"** (ru «Название»): 1. `SwitchRow` **"Slash chords"** (ru «Аккорды с басом»; ⓘ "C/E names an
    inversion by its bass"), default on (`chordFinder.slash`).
  - Group **"Under the chord"** (ru «Под аккордом»): 2. `SwitchRow` **"Keys it belongs to"**, default on
    (`chordFinder.inKeys`). 3. `SwitchRow` **"Scale on the keys"**, default off (`chordFinder.scale`).
  - Group **"History"** (ru «История»): 4. `SwitchRow` **"Remember chords"** (ⓘ "Keeps the last 24 on this
    device"), default off (`chordFinder.remember`).
  - Group **"Piano"** (ST0).
- **Done when:** the Chord finder case of `PracticeSettings.test.tsx` moves to `ChordFinderSettingsPage.test.tsx`;
  "the bar has one gear and no ⚙ C".

## ST13: Tools group and the Metronome (page and settings)

- **Source:** Decided 21 (434: "The Metronome is a tool in a Tools group (B11), with its own page and its own
  Settings page"); B11 (1915–1934); A39 (1534–1564); D16 (sounds); round 1 S7 (kept with corrections 5).
- **Today:** Practice's groups (`widgets/practice-pages/model/practice-pages.ts`): Theory (Chords, Scales and keys,
  Intervals, Progressions), Playing (Accompaniment, Chord finder), Training (Exercises, Quiz, Metronome). The
  Metronome (`/practice/metronome`, `pages/metronome`) has no gear, only an ⓘ; its face holds tempo, word, slider,
  Tap tempo, beat squares, Play, a card of Sound (Clicks · Beeps · Drum beat), Time signature, Subdivision
  ("Between beats"), then the speed and bar trainers. Its volume is `sound.click`, drawn on the Player's settings.
- **Decision and why:** Soundbrenner, Pro Metronome and Flat keep tempo, meter, accents and subdivision on the
  face (what you hear now, changed per piece) and put the sound, volume and the flash in settings. A church
  accompanist sets the click once and changes the tempo per hymn. One engine (A39): the Player's count-in and
  click and the editor's recording click use the Metronome's sound and volume, so their one home is here.
- **Will build:**
  - `PRACTICE_GROUPS`: **Tools** first (ru «Инструменты»): Metronome, Chord finder; then Theory (Chords, Scales and
    keys, Intervals, Progressions); Playing (Accompaniment); Training (Exercises, Quiz). B11's other tools (Circle
    of fifths as a reference page, Recorder, Drone) join Tools when built; Tap tempo is the Metronome's own button,
    not a tool of its own (one tool, one page). Routes unchanged (`/practice/metronome`, `/practice/chord-finder`).
  - Metronome page bar: title "Metronome", `SettingsGear` "Metronome settings" (the ⓘ moves under the tempo word
    as A25 asks). Face (practice-redesign/A39 lay it out): tempo stepper, tempo word, Tap tempo, Time signature,
    beat squares (tap: accent · normal · silent), **Subdivision** (stays on the face; label "Between beats" becomes
    "Subdivision", ru «Деление доли»), Play, speed trainer, bar trainer. The Sound menu leaves the face.
  - Route `/practice/metronome/settings`; `src/pages/metronome/ui/MetronomeSettingsPage.tsx`; name "Metronome".
    - Group **"Sound"** (ru «Звук»):
      1. `ChoiceRow` **"Sound"** — menu, today **Click** · **Beep** · **Drum kit** (ru «Щелчок» · «Сигнал» ·
         «Ударные»; "Clicks", "Beeps", "Drum beat" become instrument names); after D16: **Woodblock** · **Clave** ·
         **Rimshot** · **Cowbell** · **Click** · **Drum kit**, default Woodblock then (`metronome.sound`).
      2. `ChoiceRow` **"Volume"** — slider 0–100 %, step 5, default 100 (`sound.click` renamed `metronome.volume`;
         home `metronome`). The Player's "Metronome" slider goes.
    - Group **"Display"** (ru «Отображение»): 3. `SwitchRow` **"Flash on the beat"** (ru «Вспышка на долю»),
      default off (`metronome.flash`), drawn when A39's flash ships (R30).
    - No "Piano" group (the metronome plays no piano).
  - Engine: `features/practice`'s count-in and click and `features/record-take`'s recording click read
    `metronome.sound` and `metronome.volume` (one set, A39); their own volume field goes.
- **Not in this item:** the sounds themselves (D16), the flash, the tempo list (A39, round 2); the quick metronome
  sheet over any screen (B11, round 14).
- **Done when:** `MetronomeSettingsPage.test.tsx` "opens from the gear and Back returns"; "Volume 50 halves the
  click's gain" (fake audio); "the Player's count-in uses the sound chosen here". `MetronomePage.test.tsx` "has no
  Sound menu on its face; Subdivision stays". `PracticePage.test.tsx` "Tools is the first group: Metronome, Chord
  finder". `settings-homes.test.ts` `NOT_YET_HOME` empty.

## ST14: Exercises and Quiz settings

- **Source:** A24 Exercises and Quiz, A41, round 1 S8 (kept, values corrected).
- **Today:** `/settings/exercises-and-quiz`: "Go on automatically" (`trainer.autoNext`). Each drill's setup holds
  Rounds (10 · 20 · ∞, `ROUNDS` in `features/trainer/trainer-view.ts`) and Time limit (Off · 5 · 10 · 20 · 30 s)
  in the URL.
- **Will build:** `/practice/exercises/settings` and `/practice/quiz/settings`, one page
  `src/pages/quiz/ui/TrainersSettingsPage.tsx`, name "Exercises and Quiz"; the gear on Exercises', Quiz's and each
  drill's setup bar (a drill's gear goes to `/practice/quiz/settings`, its parent the Quiz).
  - Group **"Rounds"** (ru «Раунды»): 1. `ChoiceRow` **"Questions"** — segmented **10** · **20** · **∞** (∞'s
    tooltip "Until you stop"), default 10 (`trainer.rounds`; leaves the URL and the setup). 2. `ChoiceRow` **"Time
    limit"** — menu Off · 5 s · 10 s · 20 s · 30 s, default Off (`trainer.limit`; the setup's Timing goes).
    3. `SwitchRow` **"Next question automatically"** (was "Go on automatically"), default off (`trainer.autoNext`).
  - Group **"Piano"** (ST0).
  - Stays on each drill's setup (what to drill now): Level, the items (Keys sheet, chords, intervals…), Shown.
- **Done when:** `TrainersSettingsPage.test.tsx` "opens from Exercises', Quiz's and a drill's gear, Back to each";
  "Questions 20 ends a run after twenty"; `TrainerSetup.test.tsx` "has no Rounds or Time limit".

## ST15: The Player: its bar and its Settings page

> **Decided 22 (wins over this item):** the owner rejected both the four menus and "one job per button": "why do
> we still have four menus or four settings. I want its own settings page." So:
> - **One place for settings:** the gear opens the Player's Settings page; **Setup goes** and its Staves (Play,
>   Show, Volume per staff, Only the chords, a chart's pattern and swing) become that page's first group
>   **"Staves"**. The View menu's display options (Layout, Show: chord symbols, positions, words, fingers, note
>   names; Diagrams' mode; Lyrics' size; Keys) become its group **"Display"**, per view.
> - **View** in the tools row is only the switch between views (Sheet · Grid · Diagrams · Lyrics), a segmented
>   control with no options inside (a mode of the screen, not a setting).
> - **⋯ More** holds only acts on this song (Favourite, Song information, Sections, Print); no setting, no link to
>   one.
> - **Bar:** Close · title · MIDI · gear · ⋯ · Edit. Tools row: View switch · Transpose · Simplify.
> - Tests add: "the bar has no Setup"; "the View control has no options"; "every setting the Player has is on its
>   Settings page" (walks `SETTING_HOMES` for home `player`).

- **Source:** Decided 20 (413–417), Decided 21 (425–433: "No settings scattered in the header across four menus";
  "No duplicate menus or settings anywhere: check the Player"), R9, R18 (190–193), B7 (1850–1856), B8 Display
  (1866–1868, Flat/new-app references), round 1 S9 (kept where not corrected).
- **Today** (`pages/player/ui/PlayerLayout.tsx`, `PlayerPage.tsx`, `PlayerMore.tsx`, `PlayerViewMenu.tsx`,
  `widgets/player-settings/ui/PlayerSettings.tsx`):
  - Bar: Close · title · MIDI · **Setup** (sheet: Staves Play/Show per staff; a chart's chord size, pattern, swing)
    · **gear** (cog; a song's → `/play/$pieceId/settings`, a walk's/progression's/exercise's → `/settings/player`)
    · **More** (Add to favourites, Move to…, Archive, Song information, Sections, **Score settings** (icon
    `Settings2` → `/edit/$pieceId/settings`), Print, **Export…**) · Edit.
  - Tools row: **View** (views as tiles + "Show this when opening a song" switch; the view's own part: Layout,
    Show chips Chord symbols/Positions/Words/Fingers/Note names; Diagrams' mode; Lyrics' pinned and text size;
    Keys), Transpose, Simplify.
  - Dock: tempo, ‹ ▶ ›, loop, click (metronome on/off), hands.
  - Settings page: Audio playback (a slider per staff, the recording, the metronome; Only the chords), Metronome ›
    (to the Metronome *page*), Playback speed (Speed training 2 · 5 · 10 %), Display (Count-in, Cursor, **Layout**,
    **Keys**, **Finger numbers**), Practice (Other hand, Play the other hand), Pedal.
  - Four menus in the header hold settings or settings links (Setup, gear, More › Score settings, View), and three
    settings are drawn twice (Layout, Keys, Finger numbers).
- **Decision and why:** each of the bar's menus gets one job, named by what it holds, and no setting sits in a menu
  (DESIGN.md "a menu never holds a setting"; HIG: showing or hiding parts of the view belongs on the screen):
  - **Setup** = this song's arrangement now (which staves play and show, and how loud; a chart's pattern): the
    reference app's "Version"/Practice choices, Flat's mixer. Per song, in the URL; the staff volumes join it.
  - **View** = what you look at now: the view and what it shows. Chordify keeps its view choices on the song
    screen; HIG says the same.
  - **gear** = how the Player always behaves, for every song (Flat's Playback options: count-in, speed step,
    metronome link; the reference's Display: countdown, cursor).
  - **More** = acts on this song while playing (Song information, Sections, Print, ♡ Favourite, R11). Library acts
    (Move to, Archive) and Export… are the song's Settings' (ST17), Score settings is the editor's gear (ST16).
- **Will build:**
  - **Bar** (in order): Close · title · MIDI · Setup · `SettingsGear name="Player"` · More · Edit (A38's
    "Edit score" icon, practice-redesign/A38). Tools row: View · Transpose · Simplify (unchanged). Dock unchanged.
  - **More** (`PlayerMore.tsx`): **Add to Favourites / Remove from Favourites**, **Song information**,
    **Sections**, **Print**. Removed: Move to…, Archive (from `MoreActions` value in `PlayerPage.tsx:156`),
    Score settings (`PlayerPage.tsx:128–135`), Export… (`PlayerMore.tsx` `export`).
  - **View** (`PlayerViewMenu.tsx`): views tiles; the view's own part (unchanged: Layout and Show chips for the
    sheet, Diagrams' mode, Lyrics' pinned and text size, the Grid's words); Keys. The switch "Show this when
    opening a song" leaves (a setting in a menu) → Settings row 5.
  - **Setup › Staves** (`widgets/player-setup/ui/StavesSection.tsx`): each staff a row: its name, **Play** switch,
    **Show** switch, and a **Volume** slider 0–100 % under it, drawn while Play is on (`sound.staves[id]`, saved by
    staff place for every song as today); the recording's row the same (`sound.recording`); `ActionRow` **"Only
    the chords"** under them where the song has a recording. Moved from the settings page; one row per staff
    holds everything about that staff (Flat's mixer: mute and volume on one line).
  - **Settings page**: routes (full-screen, each a child of its Player route, its search kept):
    `/play/$pieceId/settings` (exists), new `/play/walk/settings`, `/play/chromatic/settings`,
    `/play/progression/settings`, `/play/exercise/$exerciseId/settings`, all drawing `src/pages/player/ui/
    PlayerSettingsPage.tsx` (renamed from `PieceSettingsPage`) in `PageSettingsScreen`, name "Player" (ru
    «Плеер»). `/settings/player` goes.
    - Group **"Playback"** (ru «Воспроизведение»):
      1. `ChoiceRow` **"Count-in"** — segmented **None** · **Audible** · **Visual**, default None
         (`playback.countdown`).
      2. `ChoiceRow` **"Pedal"** — segmented **As written** · **Off** · **Automatic**, default As written
         (`playback.pedal`).
      3. `ChoiceRow` **"Speed training step"** — segmented 2 % · 5 % · 10 %, default 5 % (`playback.speedStep`).
      4. `RowLink` **"Metronome"** › value its sound and volume ("Click, 100 %") → `/practice/metronome/settings`
         (the click's one home, ST13).
    - Group **"Display"** (ru «Отображение»):
      5. `SwitchRow` **"Choose the view when a song opens"** (Chordify: "Show this when opening a song"), default off
         (`scoreView.askOnOpen`).
      6. `ChoiceRow` **"Cursor"** — segmented **None** · **Beats** · **Continuous**, default Continuous
         (`playback.cursor`).
      7. B8's **"Clef"** joins here when A35 engraves it (R30: not before).
    - Group **"One hand"** (ru «Одна рука»; was "Practice"):
      8. `ChoiceRow` **"Other hand"** — segmented **Show** · **Dim** · **Hide**, default Dim (`otherHand.look`).
      9. `SwitchRow` **"Play the other hand"**, default on (`otherHand.play`).
    - Group **"Piano"** (ST0).
    - Removed from it: Audio playback (to Setup), the Metronome slider (ST13), Layout, Keys, Finger numbers (the
      View's alone).
  - B10's "Player toolbar" customisation (Decided 9) is the Player's own setting: it lands here as group
    **"Toolbar"** › in round 13, not in the app's Settings.
  - Files: `widgets/player-settings/` deleted (the page's groups in `pages/player/ui/PlayerSettingsPage.tsx`);
    `pages/settings/ui/PlayerSettingsPage.tsx` (+ test) deleted; `PlayerLayout.tsx` `onSettings` becomes required
    (each Player route passes its own `/settings` path); `features/set-preference` `onlyTheChords`, `setStaffVolume`
    used by `StavesSection`.
- **Not in this item:** Transpose (rounds 3–4 T), B8's Modes/Version/Tools sheets (round 14).
- **Done when:**
  - `src/pages/player/ui/PlayerSettingsPage.test.tsx`: `it.each` over `/play/fur-elise`, `/play/walk?…`,
    `/play/progression?…`, `/play/exercise/hanon-1`: "the gear opens `<path>/settings` and Back returns to the
    Player with its search"; "has no Layout, Keys, Finger numbers or volume row"; "Metronome › opens the Metronome's
    settings".
  - `PlayerMore.test.tsx` "More holds Favourite, Song information, Sections, Print only".
  - `PlayerViewMenu.test.tsx` "has no switch".
  - `widgets/player-setup/ui/PlayerSetup.test.tsx` "each staff has Play, Show and Volume; a muted staff hides its
    Volume"; "Only the chords mutes the staves and keeps the recording".
  - Screenshots `player-bar-*`, `player-settings-*`, `player-setup-staves-*` at the three sizes (a song with a
    recording).

## ST16: The score editor: its bar and its Settings page

- **Source:** Decided 20 ("Play notes while editing"; the score editor's own Settings), Decided 21 (425–428: "the
  editor's Sound popover that only links to Settings goes"; one icon, one meaning), R18 (198), B7, round 1 S10
  (kept, corrected by Corrections 6).
- **Today:**
  - Bar (`EditorHeader.tsx`): Close · title · MIDI · Undo · Redo · gear (`Settings2` → `/edit/$pieceId/settings`) ·
    draft status and menu (an editor's) · Done. Tools row (`EditorToolsRow.tsx`): **View** (eye: Layout, Show chips
    Chord symbols/Words/Fingers, **Keys** chip writing `keyboard.folded` through `useFoldKeys`), Transpose. Dock
    (`EditorDock.tsx`): tempo, transport, Record, Takes, **Sound** (`RecordingSettings.tsx`: a popover of two links,
    "Audio playback" → `/settings/player`, "Sound and recording" → `/settings/sound-and-recording`).
  - Settings (`ScoreSettingsPage.tsx`): Score (title, subtitle, composer, lyricist, arranger), Instruments, Music
    (**Tempo**, **Key**, **Time** popovers, Bars stepper), Layout (Staff size, Bars per line), then `EditingGroup`
    (Hear notes as you edit; links Connect a piano, Sound and recording, Player). `/settings/score-editor` draws
    `EditingGroup` again.
  - Tempo, Key and Time are also edited by tapping the printed marking (`PrintedEdit.tsx`) and from the palette.
- **Decision and why:**
  - The score's Settings is the lesson model: this score's own facts, then how the editor always writes. Flat's,
    MuseScore's and Dorico's score properties hold the title and credits and the layout; key, time and tempo are
    written on the music, from the palette or by editing the marking (Flat's toolbar, MuseScore's palettes,
    Dorico's popovers). So Tempo, Key and Time leave the Settings page: one place, on the score.
  - The View is drawn in both modes of the one score screen (ADR 0115: the Player and the editor are one screen,
    Practise · Edit). Its controls are one component writing one set of keys, in one place on that screen (the
    tools row's first tool); it is not a second home. Keys: today the editor's Keys chip writes a different
    setting (`keyboard.folded`) from the Player's (`scoreView.keys`) for the same thing; one key, `scoreView.keys`.
  - The Sound popover only linked elsewhere (Decided 21): it goes, and the dock keeps Record and Takes.
- **Will build:**
  - **Bar:** Close · title · MIDI · Undo · Redo · `SettingsGear name="Score"` ("Score settings") · draft status and
    its menu (an editor's) · Done. The `Settings2` icon goes (ST0).
  - **Tools row:** View (eye; Layout, Show: Chord symbols · Words · Fingers, **Keys** writing `scoreView.keys`),
    Transpose.
  - **Dock:** tempo, transport, Record, Takes. `RecordingSettings.tsx` deleted (also from `RecordingStrip.tsx`).
  - **Settings page** `/edit/$pieceId/settings` in `PageSettingsScreen`, name: the score's title.
    - Group **"Title and credits"** (ru «Название и авторы»): the five text rows (unchanged).
    - Group **"Instruments"** (unchanged, `widgets/instrument-list`).
    - Group **"Bars"** (ru «Такты»): stepper **"Number of bars"** 1–`MOST_BARS` (unchanged control).
    - Group **"Layout"** (ru «Вёрстка»): **"Staff size"**, **"Bars per line"** (unchanged).
    - Group **"Note input"** (ru «Ввод нот»; MuseScore's and Dorico's section): 1. `SwitchRow` **"Play notes while
      editing"** (ru «Проигрывать ноты при вводе»), ⓘ "A note sounds when you enter it, select it or change its
      pitch", default on (`editing.playNotes`, renamed from `hearNotes`). Round 4 adds Input mode (Replace ·
      Insert) and Palette side here when they exist.
    - Group **"Recording"** (ru «Запись»): 2. `SwitchRow` **"Metronome while recording"** (Flat/Logic: "Click while
      recording"; label **"Click while recording"**, ru «Метроном при записи»), default on (`recorder.click`, home
      `score-editor`). Its sound and volume are the Metronome's (link row 3: `RowLink` **"Metronome"** › →
      `/practice/metronome/settings`).
    - Group **"Piano"** (ST0) and `RowLink` **"Player settings"** › → `/play/$pieceId/settings` (count-in and
      the other playback rows the editor's Play also uses).
    - Destructive rows for the score stay where they are today (an own song's Delete is on the song's Settings,
      ST17).
    - B10's editor toolbar customisation lands here as group **"Toolbar"** › in round 13.
  - Removed: `/settings/score-editor`, `pages/settings/ui/ScoreEditorSettingsPage.tsx`, `widgets/editor-settings/`
    (Note input in `pages/score-editor/ui/NoteInputGroup.tsx`), Music's Tempo/Key/Time rows, the Player's More ›
    Score settings (ST15).
  - The lesson example editor (`/lessons/$lessonId/example`) keeps no gear (its score is the lesson's).
- **Done when:**
  - `pages/score-editor/ui/ScoreSettingsPage.test.tsx`: "draws Play notes while editing once, under Note input";
    "has no Tempo, Key or Time row"; "Click while recording is here".
  - `ScoreEditorPage.test.tsx` "the dock has no Sound button"; "View › Keys hides the keys in the editor and in the
    Player alike" (one key).
  - The avoid-words test fails on "Hear notes" in either locale.
  - Screenshots `editor-bar-*`, `score-settings-*` at the three sizes.

## ST17: Songs: the songs page, a folder, a song's overview

> **Decided 22 (wins over this item):** **no Songs settings page** (`/songs/settings`, `songs.open` and its gear do
> not get built: a tap on a song opens its page, as today). A **folder's** and a **song's** own Settings pages are
> built as below. The studies (Savchenko's *Called to Play* exercises) move to a built-in Songs folder credited to
> the book (with the Chord player work, practice-redesign CP).

- **Source:** Decided 21 (431–432: "Songs (the songs page, a folder, a song's overview) has its own Settings page
  from its own gear"; 459: "Songs' Settings page: maybe one row now; decide what is best"); D8, D10, R16, R17,
  R25; B9 (folder and song acts, appearance), B10 (swipe and Select bars).
- **Today:** Songs' bar (`pages/songs/ui/LibraryHeader.tsx`): Select, Archive (opens `/songs/archive`). A folder's
  bar: Select and a ⋯ menu (Edit folder, Move to…, Archive, Delete). A song's page bar: Settings gear and Edit; its
  Settings (`SongSettingsPage.tsx`): Library (Folder, Archive), Share (Export…, Share link, Publish in library),
  Unpublished changes (status and its menu, an editor's), Delete or Reset. Sort is beside the search
  (`LibraryFilters.tsx`, `pt-library.sort`): a view of the list, it stays there (HIG: sorting on the screen).
- **Decision and why:**
  - **The songs page** has one real app-wide-for-Songs choice today: what a tap on a song opens. A church
    accompanist with a phone on the stand wants the music at once; a learner wants the overview first. Spotify and
    Apple Music open an item's page; Chordify and MuseScore's app open the player. Both are honest, so it is a
    setting. B10's Swipe actions and Select bar for song rows, and B9's Card style, are this page's too (they
    shape Songs' rows only), so the page grows into a real one; until then it has one row (R30: no empty rows).
  - **A folder's** ⋯ menu holds the folder's facts and acts: they move to its Settings page (Noji's deck, memory-
    palaces' deck settings), and the ⋯ goes, so the bar has one way to each act.
  - **A song's** Settings stays as built, with the duplicates removed (ST15, ST19).
- **Will build:**
  - **Songs settings** `/songs/settings` (static path, wins over `/songs/$pieceId`), gear "Songs settings" in
    Songs' bar after Archive; `src/pages/songs/ui/SongsSettingsPage.tsx`, name "Songs".
    - Group **"Opening a song"** (ru «Открытие песни»): 1. `PictureChoice` **"A tap on a song opens"** — **Song
      page** · **Player** (a page outline; a score with a play mark), default Song page (`songs.open:
      'page' | 'player'` in `pt-settings`, home `songs`). Songs' and a folder's rows and Search's song results
      follow it; a row's ⋯ keeps both "Open" and "Practise".
    - Rounds 13–14 add group **"Rows"**: Swipe actions ›, Select bar ›, Card style › (B9, B10).
  - **Folder settings** `/songs/folders/$folderId/settings`, gear "Folder settings" replacing the folder bar's ⋯;
    `src/pages/songs/ui/FolderSettingsPage.tsx`, name: the folder's name.
    - Group **"Folder"** (ru «Папка»): `RowButton` **"Name"** › value the name (opens today's name sheet);
      **"Colour"** › value its swatch (B9 adds cover and icon as "Appearance" ›).
    - Group **"Library"** (ru «Библиотека»): `RowButton` **"Move to"** › value the parent ("Home"); `ActionRow`
      **"Archive folder"** (confirms, R17, with Undo).
    - `DangerGroup`: **"Delete folder"** (confirms, R17; footnote "Its songs move to the Archive.").
    - Built-in folders (D8): a learner sees no gear (nothing there is theirs to change, R30); an editor outside
      Learner view sees the page, every row allowed by `entities/library`'s permission function.
  - **A song's Settings** `/songs/$pieceId/settings` (exists), in `PageSettingsScreen`: Library (Folder ›,
    Archive), Share (Export…, Share link, Publish in library ›), an editor's **"Unpublished changes"** `RowLink` ›
    with its status as value, opening the editor where its menu is (ST19 row 22), then Delete or Reset last.
  - Files: `LibraryHeader.tsx` (folder ⋯ goes, gear added), `FolderPage.tsx`, router and parents (ST20).
- **Not in this item:** B9 Appearance, Card style; B10's pages.
- **Done when:**
  - `SongsSettingsPage.test.tsx` "opens from the gear, Back to Songs"; "Player makes a tap on a row open the Player".
  - `FolderSettingsPage.test.tsx` "Rename, Move to, Archive and Delete from the page; Back to the folder"; "a learner
    in a built-in folder sees no gear".
  - `SongSettingsPage.test.tsx` "Unpublished changes is a link to the editor, with no menu here".
  - `back-as-up.test.tsx` Songs → folder → folder settings → Back ×2 lands in Songs.
  - Screenshots `songs-settings-*`, `folder-settings-*`, `song-settings-*` at the three sizes.

## ST18: Lessons and courses (reading moves in)

- **Source:** Decided 21 (437–438: "lessons' 'read as' is a lesson setting"), R18 (188–195).
- **Today:** "Lessons read as" (`lessonReading`) is a menu in Settings › General; a lesson's Settings has a link row
  "Reading" › to General.
- **Will build:**
  - `lessonReading` home `lesson`. A lesson's Settings (`/lessons/$lessonId/settings`) and a course lesson's
    (`/courses/$courseId/$lessonId/settings`) draw the control, the same `LessonSettings` component (one component,
    one key): group **"Reading"** (ru «Чтение»), `PictureChoice` **"Read as"** (ru «Читать») — **One page** · **A
    section at a time** (a long page outline; one card with dots), default One page.
  - Applies to every lesson (it is how lessons read, not this lesson's), so its footnote says "For every lesson."
  - General's row and the link row go. A course's Settings has no reading row.
- **Done when:** `LessonSettingsPage.test.tsx` "A section at a time here makes every lesson read by sections";
  `GeneralPage.test.tsx` "has no reading row"; `settings-pages.test.tsx` passes with `lessonReading` drawn at both
  lesson routes (one home, one component; see ST20).

## ST19: The duplicate audit

Every setting or act drawn in two places today (read in the code at `6b5d3ebe`), its one home, and what goes.
"Context menus" (a row's ⋯, long press, swipe, Select's bar) repeat an item's acts by design and are not listed.

| # | Setting or act | Drawn today on | One home after | Removed from | Item |
|---|---|---|---|---|---|
| 1 | Play notes while editing (`editing.hearNotes` → `playNotes`) | Settings › Score editor; score's Settings | Score settings › Note input | `/settings/score-editor` | ST16 |
| 2 | The Player's whole set (`playback.*`, `otherHand.*`) | Settings › Player; a song's Player gear | the Player's gear page | `/settings/player` and its list row | ST15 |
| 3 | Layout (`scoreView.layout`) | Player settings › Display; View | View | Player settings | ST15 |
| 4 | Keys under the score (`scoreView.keys`) | Player settings › Display; Player's View; editor's View writes `keyboard.folded` instead | View, one key in both modes | Player settings; the editor's `useFoldKeys` chip | ST15, ST16 |
| 5 | Finger numbers (`practice.fingerNumbers`) | Player settings › Display; View › Fingers | View | Player settings | ST15 |
| 6 | Choose the view when a song opens (`scoreView.askOnOpen`) | View (a switch in a menu) | Player settings › Display | View | ST15 |
| 7 | Metronome volume (`sound.click` → `metronome.volume`) | Player settings › Audio playback; the Metronome | Metronome settings › Volume | Player settings | ST13 |
| 8 | Staff and recording volumes, Only the chords | Player settings › Audio playback, while Play/Show per staff are in Setup | Setup › Staves (one row per staff) | Player settings | ST15 |
| 9 | Click while recording (`recorder.click`) | Sound and recording | Score settings › Recording | Sound and recording | ST5, ST16 |
| 10 | Play melody (`recorder.tune`) | Sound and recording | none (deleted, A35) | everywhere | ST5 |
| 11 | Lesson reading (`lessonReading`) | General; a link on the lesson's Settings | the lesson's Settings | General | ST18 |
| 12 | Each Practice page's settings | `/settings/<page>` from the gear and from Settings' Practice group | `/practice/<page>/settings` | Settings' Practice group, `/settings/<page>` routes | ST7–ST14 |
| 13 | The editor's Sound popover (two links) | editor dock, recording strip | none (links to pages that keep their homes) | `RecordingSettings.tsx` | ST16 |
| 14 | Note names, Chord names, Glissando (`keyboard.namedKeys`, `chordNames`, `swipe`) | On-screen piano; the rail's buttons | On-screen piano page | the rail | ST2 |
| 15 | Computer keys play (`keyboard.typing`) | Computer keys; the rail's ⌨ | Computer keys | the rail | ST2, ST4 |
| 16 | MIDI sound (`midi.sound`) | Connect a piano; the rail's MIDI sound | Connect a piano › Sound | the rail | ST2, ST3 |
| 17 | Key size (`keyboard.keySize`) | On-screen piano pictures; the rail's − + | the rail's − + | On-screen piano | ST2 |
| 18 | Folding the keys (`keyboard.folded`) | On-screen piano "Fold the keys › Always"; the rail's ⌄ | the rail's ⌄ (and the Keys button back) | On-screen piano (keeps only "Hide on a phone on its side") | ST2 |
| 19 | Which rail buttons (`keyboard.railControls`) | On-screen piano | none (the rail is fixed) | everywhere | ST2 |
| 20 | Export… | the song's Settings; the Player's More | the song's Settings | the Player's More | ST15, ST17 |
| 21 | Move to…, Archive (a song) | the song's Settings; the Player's More | the song's Settings | the Player's More | ST15 |
| 22 | Unpublished changes' menu (Publish, Versions, Discard) | the editor's bar by Done; the song's Settings | the editor's bar | the song's Settings (a link row stays) | ST17 |
| 23 | Score settings | the editor's gear; the Player's More | the editor's gear | the Player's More | ST15, ST16 |
| 24 | Tempo, Key, Time of a score | Score settings › Music; the printed marking; the palette | the score (marking and palette) | Score settings | ST16 |
| 25 | A folder's Edit, Move to, Archive, Delete | the folder bar's ⋯ | the folder's Settings | the ⋯ (the bar gets the gear) | ST17 |
| 26 | Play what you choose (`keyboard.autoplay`) | On-screen piano (about Practice pages) | each explorer's "Play when chosen" | On-screen piano | ST7–ST10 |
| 27 | Chord finder's choices | Settings › Chord finder; the "⚙ C" button's sheet | Chord finder settings (gear) | "⚙ C" | ST12 |
| 28 | Two gear icons (cog, `Settings2`) for one act | Player, editor, practice pages | `SettingsGear` (cog) | `Settings2` gears | ST0 |
| 29 | Rounds, Time limit | each drill's setup (per URL) | Exercises and Quiz settings | the setups | ST14 |
| 30 | Scales' fingering method | Notes tab toggle per scale | Scales and keys settings | the tab | ST8 |

Checked and kept (not duplicates): the welcome's language choice (a one-time first-run step, R11-style; General is
its home afterwards); the transport's click toggle (`practice.metronome`, an on/off of the click for this play, its
only control); Speed training's on/off in the tempo popover beside its step in settings (two different settings);
Sort beside the search (one control); the MIDI button in bars (a status that opens Connect a piano).

## ST20: Registry, routes, parents and the tests that hold one home

- **Source:** A10 (654–660: "Define the settings once, in a registry (key, home, label, control), and render pages
  from it … A test fails if a setting key is rendered on more than one page"); round 1 S14 (kept, corrected).
- **Today:** `src/entities/settings/model/registry.ts`: `SETTINGS_PAGES` (15 ids, including `sound-and-recording`,
  `score-editor`, `player`), `SETTING_HOMES` key → page, `NOT_PREFERENCES`; no label or control, every page
  hand-written. Tests: `registry.test.ts`, `src/app/settings-homes.test.ts` (commands written only from their
  home's files, `NOT_YET_HOME`), `src/app/settings-pages.test.tsx` (renders pages, `data-setting` only from its
  home), `pages/practice-settings/ui/PracticeSettings.test.tsx`.
- **Will build:**
  - `registry.ts`:
    - `APP_PAGES = ['general', 'on-screen-piano', 'connect-piano', 'computer-keys'] as const` (the app's
      Settings, ST1) and `PAGE_SETTINGS = ['lesson', 'songs', 'folder', 'player', 'score-editor', 'metronome',
      'chords', 'scales', 'intervals', 'progressions', 'accompaniment', 'chord-finder', 'trainers'] as const`
      (each page's own) and `SURFACES = ['score-view', 'player-setup', 'keyboard-rail'] as const` (on-screen homes:
      the View, the Setup, the rail). `SettingsPageId = (typeof APP_PAGES)[number] | (typeof PAGE_SETTINGS)[number]
      | (typeof SURFACES)[number]`.
    - `interface SettingDef { readonly key: SettingKey; readonly home: SettingsPageId; readonly group: string;
      readonly label: string; readonly info?: string; readonly control: SettingControl }`, `group`/`label`/`info`
      i18n keys; `type SettingControl = { kind: 'switch' } | { kind: 'segmented' | 'menu' | 'picture'; options:
      readonly (string | number)[]; option: string } | { kind: 'slider'; min: number; max: number; step: number }
      | { kind: 'custom' }`.
    - `export const SETTINGS: readonly SettingDef[]` in page and row order (every row named in ST2–ST18);
      `SETTING_HOMES` derived from it, typed `Record<SettingKey, SettingsPageId>` with `satisfies`, so a new field
      without a def fails `tsc`.
    - `SETTING_ROUTES: Readonly<Record<(typeof APP_PAGES | typeof PAGE_SETTINGS)[number], readonly string[]>>`:
      the route paths each page is drawn at (`player`: the five `/play/…/settings`; `lesson`: the two lesson
      settings routes; `trainers`: the two), read by the tests.
  - Keys after (`pt-settings` version bumped once, CLAUDE.md: no migration): new `chords { autoplay; arpeggio }`,
    `scales { autoplay; fingering; hidden }`, `intervals { autoplay; names; compound }`, `progressions.autoplay`,
    `songs { open }`, `metronome.volume`, `metronome.flash`, `trainer.rounds`, `trainer.limit`,
    `accompaniment.order`, `editing.playNotes`; removed `editing.hearNotes`, `recorder.tune`, `sound.click`,
    `keyboard.railControls`, `keyboard.autoplay`. Homes moved: `lessonReading` → `lesson`; `recorder.click` →
    `score-editor`; `scoreView.*` and `practice.fingerNumbers|namedNotes|positions` → `score-view`;
    `scoreView.askOnOpen` → `player`; `sound.staves`, `sound.recording` → `player-setup`; `keyboard.keySize`,
    `keyboard.folded` → `keyboard-rail`; `practice.metronome` → `player` (the transport's toggle; drawn by the
    dock, a part of the Player).
  - Renderer `src/widgets/settings-page/` (new slice): `SettingsRows({ page, custom }: { page: SettingsPageId;
    custom?: Partial<Record<SettingKey, ReactNode>> }): ReactElement` draws the page's defs grouped in
    `SettingsGroup`s, each def through `SettingRow({ def })` → the R24 row for its control, with `data-setting`.
    One write path `setSetting<K extends SettingKey>(store: SettingsStoreApi, key: K, value: SettingValue<K>):
    void` in `src/features/set-preference/set-setting.ts` (+ test). Every page of ST2–ST18 draws its preference
    rows with it; custom rows: device list, sources, staves, pictures.
  - **Routes** (`src/app/router.tsx`): delete `/settings/player`, `/settings/score-editor`,
    `/settings/sound-and-recording`, `/settings/{chords,scales,intervals,progressions,accompaniment,chord-finder,
    exercises-and-quiz}`; add `/practice/{chords,scales,intervals,progressions,accompaniment,chord-finder,
    metronome,exercises,quiz}/settings`, `/songs/settings`, `/songs/folders/$folderId/settings`,
    `/play/{walk,chromatic,progression}/settings`, `/play/exercise/$exerciseId/settings`,
    `/settings/connect-piano/bluetooth`. Lazy screens in each place's `*-screens.ts` (`explorer-screens.ts`,
    `tool-screens.ts`, `practice-screens.ts`, `accompaniment-screens.ts`, `songs-screens.ts`, `player-screens.ts`),
    never `settings-screens.ts`.
  - **Parents** (`src/app/routes/parents.ts`): remove the ten `/shell/settings/<page>` entries and
    `practiceSettings`; each new route's parent is the page above it with its search kept (R26); folder settings →
    its folder; `/settings/connect-piano/bluetooth` → `/settings/connect-piano`.
  - `src/app/routes/practice-search.ts`: `PracticeSettingsFrom`, `validatePracticeSettingsSearch` go;
    `explorer-search.ts`: `fingering` leaves `ScalesSearch`; `practice-search.ts`: `rounds`, `limit` leave the
    trainer's search.
  - Deleted: `src/pages/practice-settings/` (all), `pages/settings/ui/PlayerSettingsPage.tsx` (+ test),
    `ScoreEditorSettingsPage.tsx`, `SoundPage.tsx`, `widgets/practice-pages/ui/SettingsGear.tsx`,
    `widgets/editor-settings/`, `widgets/player-settings/`, `pages/score-editor/ui/RecordingSettings.tsx`, the five
    rail toggles and `RailControlsField` (ST2).
  - **Tests that hold one home:**
    - `src/entities/settings/model/registry.test.ts`: "every field has one def" (exists, now from `SETTINGS`);
      "every def's group, label and options exist in en and ru"; "every app page is in Settings' list and no page
      setting is" (against `APP_PAGES`, which `SettingsList` reads).
    - `src/app/settings-pages.test.tsx`: renders every route in `SETTING_ROUTES`, plus the Player with View and
      Setup open and a page with the rail; asserts each `data-setting` appears only on its home's routes or
      surface, and that no key appears on two homes.
    - `src/app/settings-homes.test.ts`: `PAGE_PATHS` to the new files; `NOT_YET_HOME` deleted.
    - `src/app/page-settings.test.tsx` (new, replaces `PracticeSettings.test.tsx`): `it.each` over every page with
      a gear: "the gear opens `<path>/settings`, its label names the page, and Back returns to `<path>` with its
      search".
    - `src/app/no-setting-in-menus.test.tsx` (new): opens every bar menu (Player's More, View, editor's View,
      Songs' Select, a song row's ⋯) and asserts no `role="switch"` and no `data-setting` inside a `role="menu"`
      (DESIGN.md "a menu never holds a setting"; the View is a popover of view choices, allowed by name).
    - `src/app/one-icon.test.ts` (ST0).
    - `parents.test.ts` passes (every route has a parent).
  - **Docs:** DESIGN.md gains "Settings: where a setting lives" (the rule above, with the HIG and references
    cited); ADR 0052, 0025, 0105, 0114, 0115 amended (Corrections 12); a new ADR "Settings: the app's, a page's,
    the screen's" recording this plan's decisions; CLAUDE.md's Settings paragraph and "the places" lines;
    `settings-map.md` regenerated from `SETTINGS`; UBIQUITOUS_LANGUAGE (Corrections 15).
- **Done when:** `npm run typecheck && npm run lint`, the tests above, `npm run build` (routing changed), the full
  `npm run test` once at the round's end; screenshots of every page in ST1–ST18 at 390×844, 844×390, 1280×800 in
  `shots/after/`.

## Build order

One commit per step, each with its tests (CLAUDE.md):
1. ST20's registry shape (`SettingDef`, `SETTINGS`, homes as today) and `SettingsRows`, `setSetting`, with the
   tests; no page changes yet.
2. ST0: `PageSettingsScreen`, `SettingsGear`; the lesson, song and score Settings onto them.
3. ST7–ST12, ST14: each Practice page's route, page and gear (one commit each), removing its `/settings/<page>`
   route and list row as it lands; ST13 with the Tools group last of the Practice ones.
4. ST15 (Player), then ST16 (editor), then ST17 (Songs, folder), ST18 (reading).
5. ST2–ST6: the app's pages and the rail; ST1 the list from `APP_PAGES`.
6. ST19's leftovers, the `pt-settings` version bump, the strict tests (`settings-pages`, `no-setting-in-menus`),
   docs. Full gate, build, screenshots.

## Owner's questions

Defaults are taken unless you say otherwise.
1. **The rail on the on-screen piano** keeps only octave ‹ ›, key size − +, Pedal and Hide; Note names, Chord names,
   Glissando, Computer keys and MIDI sound become rows on their pages only (no choosing which rail buttons show).
   Or keep them as quick switches on the rail and take them off the settings pages? Default: the settings pages.
2. **A tap on a song opens:** Song page · Player, a row of Songs' Settings (Songs' only row until B9/B10). Build it
   now? Default: yes.
3. **Tempo, Key and Time leave the score's Settings** (edited on the score and from the palette, as Flat, MuseScore
   and Dorico do). Default: yes.
4. **The View stays one menu in both modes of the score** (the Player's and the editor's View write the same keys,
   drawn by one component in one place on one screen). Default: yes; the alternative would be the editor without
   Layout or Keys.
5. **Sound and recording goes**, with no Sound page; the sampled piano's size and download sit in Storage and
   backup. Default: yes.
