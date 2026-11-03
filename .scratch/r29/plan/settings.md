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

## ST16: The score editor: its bar and its Settings page

## ST17: Songs: the songs page, a folder, a song's overview

## ST18: Lessons and courses (reading moves in)

## ST19: The duplicate audit

## ST20: Registry, routes, parents and the tests that hold one home

## Build order

## Owner's questions
