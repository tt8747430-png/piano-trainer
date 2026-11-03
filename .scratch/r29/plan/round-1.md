# Round 1 plan: the app as a whole (and the Settings structure, Decided 20)

Scope: the standing rules' open contradictions (R5, R17, R18, R28), Part A 1–19 open or partial (A2, A3, A4, A5
without Transpose, A6, A8, A9, A11, A15–A17, A19) and A38, and above all the Settings structure under the owner's
correction (Decided 20, prompt lines 404–420). Round 2's plan (`round-2.md`) owns what each Practice page *shows*;
this file owns where every setting *lives* and every row on every settings page (round 2 points here, S1–S11).

Read with: `prompt.md` (cited by line), `compliance/part-a1.md`, `compliance/summary.md`, the code as of
2026-11-03 (branch `claude/keen-gates-q9bnit`).

## Corrections to earlier descriptions

1. **`docs/adr/0052-practice-and-search.md:80`**: "Each Practice page has a Settings page (A24, R18) at
   `/settings/<page>` … a Practice group in Settings". Wrong under Decided 20. Correct: each Practice page's
   Settings is a page under the page itself (`/practice/<page>/settings`), opened only from that page's gear, and
   Settings lists no Practice page. Same fix to its history line 143.
2. **`docs/adr/0025-training.md:46`**: "Exercises and Quiz's Settings (`/settings/exercises-and-quiz`, A24)".
   Correct: `/practice/exercises/settings` and `/practice/quiz/settings`, one page drawn at both.
3. **`docs/adr/0105-the-player.md:53`**: "The Player's settings page (B7; `/settings/player` in Settings, and a
   song's gear … opening the same page)". Correct: the Player's Settings is opened from the Player's gear only, at
   `<the Player's own path>/settings` (`/play/$pieceId/settings`, `/play/walk/settings` …). Settings has no Player
   row. Display's layout and finger numbers are not on it (they are the View menu's, S9).
4. **`docs/adr/0115-one-score-two-modes.md:46`**: "Each mode a kind page (B7): the Player's settings (ADR 0105) and
   Settings › Score editor, whose Editing group a score's own Settings shows too". That is the "Hear notes" duplicate.
   Correct: the score editor's Settings is `/edit/$pieceId/settings` alone; its Note input group is drawn there
   once; Settings › Score editor goes.
5. **`.scratch/r29/settings-registry/spec.md` §3** ("One page per kind, reached two ways … a route under Settings")
   and the end note "Lesson reading's home is Settings › General (R18's own example: one row needs no page)".
   Correct: one way, the gear; the route sits under the item's own path; Lesson reading's home is the lesson's
   Settings page (S0), not General.
6. **`.scratch/r29/settings-registry/spec.md` §2** promised "One renderer `widgets/settings-page`" and the audit
   shows it never came (A10 contradiction). It is built in S14, not "with A12".
7. **`progress.md` row A10/A12** say "done"/"partial: D20 changes the structure"; **row B7** says
   "/settings/player … /settings/score-editor" as the built state. Both describe a structure Decided 20 removes;
   they become "redo per round-1 plan S9, S10, S14".
8. **`progress.md` row A1** says "done". The audit found the sheets/menus/empty-states sweep missing; A1 is not in
   this round's list from the coordinator, so it stays "partial" (not "done").
9. **`docs/UBIQUITOUS_LANGUAGE.md:554`** and **`docs/adr/0114-the-score-editor.md:122,162`**: "Hear notes as you
   edit". Correct term (Decided 20): **Play notes while editing** (ru «Проигрывать ноты при вводе»); "Hear notes as
   you edit" becomes its _Avoid_ entry.
10. **`DESIGN.md` "Buttons › Floating"**: "each its icon alone unless the learner asks for names". Contradicts A3
    ("a primary action is a labelled button"). Correct: the primary action is a labelled pill; second actions are
    icon buttons with a tooltip (A3 below).
11. **`DESIGN.md` "Navigation and the screen's bar"**: "a page's tabs its second row" and "wrapping to a second line
    rather than being cut". Contradicts A2 ("fixed height on every screen: back, title, the screen's tabs or
    segmented switch"). Correct in A2 below.
12. **`docs/adr/0052` and the `SettingsList` comment** call Exercises and Quiz's page "Exercises and Quiz" while the
    gear's label says "Exercises settings"/"Quiz settings". One name: **Exercises and Quiz** (S8).

---

## S: The Settings structure (Decided 20)

The rule, from Decided 20 and R18 (prompt 180–193, 404–420):
- **The app's Settings** (`/settings`) holds only what every page shares: the account, General (language, theme,
  notation and names), Storage and backup, On-screen piano, Connect a piano, Computer keys, Sound and recording,
  Help. No row for a Practice page, the Player, the score editor, Songs or lessons.
- **Each kind has one Settings page, reached only from the gear in its own app bar**, at `<its path>/settings`,
  shaped as a lesson's Settings (`pages/lesson/ui/LessonSettingsPage.tsx`). A kind used in several places (the
  Player for a song, a walk, a progression, an exercise) draws the same component at each place's `/settings`.
- **No setting on two pages.** What the page itself shows now (this chord, this key, this tempo) is a choice on
  the page, kept in the URL; how the page always sounds and looks is on its Settings page. A page may show a link
  row to another page's setting ("Reading: One page ›"), never its control.

### S0: The shape every kind Settings page copies

- **Source:** Decided 20 (prompt 413–417: "a real Settings page reached from its own gear, as a lesson's is …
  the look of a lesson's Settings page"); R20 (206–216), R24 (248–256), R25 (257–265).
- **Today:** a lesson's Settings (`LessonSettingsPage.tsx`): `ScreenHeader` titled "Settings" with `BackButton`;
  under it, in a `max-w-2xl` column, the item's name in display type (`font-display text-2xl`), then
  `SettingsGroup flush` cards of `RowLink`/`ChoiceRow`/`RowButton` rows with coloured tiles, the destructive group
  last. The Practice pages' Settings instead use `PracticeSettingsScreen` → `SettingsScreen` (the app Settings'
  two-pane screen, `sub` when opened from a gear), so on a laptop they open *inside* the app's Settings list.
- **Will build:**
  - New component `KindSettingsScreen` in `src/shared/ui/KindSettingsScreen.tsx`, exported from `shared/ui`:
    `function KindSettingsScreen({ name, children }: { name: string; children: ReactNode }): ReactElement`.
    It draws exactly the lesson page's frame: `ScreenHeader title={t('common:settings')}` ("Settings", ru
    «Настройки») with `<BackButton />` (Back = `useUp()`, R26); then `<div className="mx-auto flex w-full
    max-w-2xl flex-col gap-7">` holding `<p>` with `name` (the page's name, "Chords") in the lesson page's
    title style, then `children`. One column on every width (a lesson's page is one column too; R20's two panes
    are the app's Settings only).
  - `LessonSettings` is refactored to use `KindSettingsScreen` (its own frame lines removed), so both share one
    frame. `pages/lesson/ui/LessonSettingsPage.tsx`.
  - Every row on a kind page is one of R24's five shared rows (`RowLink`, `ChoiceRow`/`PictureChoice`,
    `SwitchRow`, `RowButton`/`ActionRow`, `DangerRow` in `DangerGroup`), drawn by the registry renderer (S14)
    except rows marked "custom" below. Each row has its tile icon in a coloured square, as the lesson's rows do.
  - The last group on every Practice page's and the Player's Settings is **"Instruments"** (heading; ru
    «Инструменты»): `RowLink` "On-screen piano ›" (`/settings/on-screen-piano`) and `RowLink` "Connect a piano ›"
    with the MIDI summary as its value (`/settings/connect-piano`), as `PracticeSettingsScreen` does today. These
    are links, not controls (R18).
  - The gear: one shared `SettingsGear` in `src/shared/ui/SettingsGear.tsx`:
    `function SettingsGear({ name, to }: { name: string; to: LinkProps['to'] & string }): ReactElement`, a
    `RoundLink` with the `Settings` (cog) icon, `aria-label` and tooltip "{{name}} settings" (ru «Настройки:
    {{name}}»), `search` kept (`search: true`) so Back returns to the page as it was. It replaces
    `widgets/practice-pages/ui/SettingsGear.tsx` and the Player's inline gear button (`PlayerLayout.tsx:170–178`).
    The gear sits first among the bar's round actions (A3).
  - Route search `from` (`validatePracticeSettingsSearch`, `PracticeSettingsFrom`) goes: the parent is the path
    itself.
- **Not in this item:** the two-pane app Settings (stays as built, R20); the item's own facts (a song's name);
  the destructive rows of a lesson (unchanged).
- **Done when:**
  - `src/shared/ui/KindSettingsScreen.test.tsx`: "titles the bar Settings, names the page under it, Back goes up"
    (renders with `renderRouted`, asserts heading level 1 "Settings", the text "Chords", a Back button).
  - `pages/lesson/ui/LessonSettingsPage.test.tsx` still green (frame unchanged to the eye).
  - Screenshots `shots/after/kind-settings-chords-{390x844,844x390,1280x800}.png` beside
    `lesson-settings-{…}.png`: same bar, same title style, same column width.

### S1: Chords settings

- **Source:** A24 Chords (prompt 975–976), A32 (1276–1287), Decided 20; R18; A20 (716–742) for what stays.
- **Today:** gear → `/settings/chords?from=chords`, page `ChordsSettingsPage` (`pages/practice-settings/ui/
  ExplorerSettingsPages.tsx`) holds only the two link rows. On the page (`widgets/chord-explorer/ui/
  ChordBuilder.tsx`): Root, Quality, Chord size, Seventh, Suspension, Right hand from, Inversion, Hands, Voicing
  (`VoicingField.tsx`), colour notes; transport capsule with "Arpeggio" and "Play" (`ChordExplorer.tsx:174–190`).
  No chord setting is saved in `pt-settings`.
- **Will build:**
  - Route `/practice/chords/settings` (shell, child path of the Chords page; parent `/practice/chords` with its
    search kept). Opened from the gear in Chords' bar ("Chords settings"). Page component `ChordsSettingsPage`
    in `src/pages/chords/ui/ChordsSettingsPage.tsx` (moves out of `pages/practice-settings`).
  - Name under the bar: "Chords".
  - Group **"Sound"** (ru «Звучание»):
    1. `ChoiceRow` "Chord playback" (ru «Как звучит аккорд») — segmented: **Block** · **Broken** · **Rolled**
       (ru «Вместе» · «Арпеджио» · «Арпеджато»). Default **Block**. Key `chords.playback`:
       `'block' | 'broken' | 'rolled'`. Terms: "block chord" and "broken chord" (method books), "rolled"
       (arpeggiato, Dorico/Sibelius' "arpeggio" line). Effect: the transport's one Play plays the chord this
       way; the capsule's separate "Arpeggio" button goes (R5: never the same action twice). Picture choice (R21):
       three tiny staves (stacked notes; notes one after another; stacked with the wavy arpeggio line).
  - Group **"Display"** (ru «Отображение»):
    2. `SwitchRow` "Fingering" (ru «Аппликатура»), default **on**. Key `chords.fingering`. Off: the
       "Fingering" section and the finger numbers on the staff and keys are not drawn.
    3. `ChoiceRow` "Staff" (ru «Нотоносец») — segmented **Grand staff** · **Treble** (ru «Двойной» ·
       «Скрипичный»), default **Grand staff**. Key `chords.staff`. Treble draws the right hand's notes on one
       treble staff (the left hand's bass, where Hands is Both, still needs the grand staff: the option is then
       hidden, R30, with the ⓘ "Two hands need the grand staff").
  - Group "Instruments" (S0).
  - Stays on the Chords page (what you look at, A32 "Chords owns one chord"): Root, Quality, Size, Seventh,
    Suspension, Added tones, Alterations, Inversion, Voicing, Hands, Right hand from. Hands is still remembered
    per page (`CHORDS_KEPT`, `pt-views`). Chord symbol style is app-wide (S12, General › Notation).
  - Store: `ChordsSettings { playback; fingering; staff }` with `DEFAULT_CHORDS = { playback: 'block',
    fingering: true, staff: 'grand' }` in `entities/settings/model/types.ts`; `pt-settings` version bumped
    (CLAUDE.md: no migration); sanitiser field by field; selector `selectChords`.
- **Not in this item:** what the Chords page draws (round 2, A20); added tones (round 2, C1).
- **Done when:**
  - `src/pages/chords/ui/ChordsSettingsPage.test.tsx`: "opens from the gear and Back returns to the chord as it
    was" (`/practice/chords?root=D` → gear → `/practice/chords/settings` → Back → `/practice/chords?root=D`);
    "saves Chord playback, and Play plays it that way" (choose Broken; `settingsStore.getState().chords.playback
    === 'broken'`; back on Chords, Play schedules the chord's notes at different times on the fake audio);
    "Fingering off hides the Fingering section"; "Staff hides Treble while Hands is Both".
  - `ChordsPage.test.tsx`: "has one Play in its capsule" (no button named "Arpeggio").
  - Screenshots `kind-settings-chords-*` at the three sizes.
- **Owner's question:** keep a second "Arpeggio" button beside Play (today's two buttons) instead of the setting?
  Default taken: one Play, the way set here (R5).

### S2: Scales and keys settings

- **Source:** A24 Scales (977–978), A32 (1280–1287: "octaves, rhythm, tempo, hands, fingering rule, which scale
  families are listed, the chord size the Harmony tab shows"), A21 (743–799), Decided 20.
- **Today:** gear → `/settings/scales?from=scales`, `ScalesSettingsPage` holds only link rows. On the Notes tab
  (`widgets/scale-explorer/ui/RunView.tsx:56–124`): Hands (RH · LH · Both), On the keys (Notes · Left hand ·
  Right hand), Octaves (1 · 2), Start on (menu), Fingering (From the thumb · As the scale), Rhythm (menu, 5),
  Tempo (slider). Harmony tab (`ChordsView.tsx`): Chord size, Inversion, Keys play (Chords · Notes), Played as.
  Rhythm, tempo, hands remembered per page (`SCALES_KEPT`).
- **Will build:**
  - Route `/practice/scales/settings`, gear "Scales and keys settings" in Scales' bar; parent `/practice/scales`
    (search kept). `src/pages/scales/ui/ScalesSettingsPage.tsx`. Name: "Scales and keys".
  - Group **"Scale practice"** (ru «Гаммы»): A24 lists octaves, rhythm, hands; but A24's own rule ("on the page:
    what you are looking at: the scale … tempo") and Decided 20 ("no setting on two pages") decide which: the run
    drawn on the staff changes with octaves and hands, so they stay on the page. Settings get what the page does
    not show:
    1. `ChoiceRow` "Fingering" (ru «Аппликатура») — segmented **Standard** · **From the thumb**
       (ru «Стандартная» · «От первого пальца»), default **Standard**. Key `scales.fingering`. Professional
       term: "standard fingering" (Hanon, ABRSM scale books) versus fingering grouped from the thumb. Today's
       on-page "Fingering: From the thumb · As the scale" segmented control goes from `RunView.tsx`; the page's
       per-scale override (`fingering` in the URL) goes with it.
    2. `ChoiceRow` "Rhythm" (ru «Ритм») — menu of the five rhythms: **Even** · **Long, short** (dotted) ·
       **Short, long** (reverse dotted) · **Long, 3 short** · **3 short, long**. Default **Even**. Key
       `scales.rhythm`. Professional names (ABRSM/Hanon "rhythmic variants"): en "Even quavers", "Dotted",
       "Reverse dotted", "Long, three short", "Three short, long" → final labels: **Even** · **Dotted** ·
       **Reverse dotted** · **Long, 3 short** · **3 short, long** (ru «Ровно» · «Пунктир» · «Обратный пунктир» ·
       «Долгая, 3 коротких» · «3 коротких, долгая»). Picture choice: each as two small notes drawn (R21). Moves off
       the page; `rhythm` leaves `SCALES_KEPT` and the URL.
  - Group **"Harmony"** (ru «Гармония»):
    3. `ChoiceRow` "Chord size" (ru «Аккорды») — segmented **Triads** · **7th chords** (ru «Трезвучия» ·
       «Септаккорды»), default **Triads**. Key `scales.chordSize`. Moves off the Harmony tab (`ChordsView.tsx`
       Chord size goes); the tab shows the key's chords at this size.
  - Group **"Scales listed"** (ru «Какие гаммы в списке»):
    4. one `SwitchRow` per family: **Major and minor** (always on, the switch disabled is not drawn: R30; a
       footnote "Major and minor are always listed"), **Modes**, **Pentatonic and blues**, **Other scales**
       (whole-tone, chromatic, diminished…). Default all on. Key `scales.families: readonly ScaleFamily[]`
       (hidden families). The Scale picker on the page lists only the families on.
  - Group "Instruments" (S0).
  - Stays on the page: Root, Scale, Hands, On the keys, Octaves, Start on, Tempo; Harmony's Inversion, Keys play,
    Played as. Tempo stays (A24: "tempo" is what you look at).
  - Store `ScalesSettings { fingering: 'standard' | 'thumb'; rhythm: PracticeRhythmId; chordSize: 3 | 4;
    hidden: readonly ScaleFamily[] }`, `DEFAULT_SCALES = { fingering: 'standard', rhythm: 'even', chordSize: 3,
    hidden: [] }`; `ScaleFamily` and `scaleFamily(kind)` added to `shared/lib/music` (pure, tested).
  - `app/routes/explorer-search.ts`: `rhythm`, `fingering`, `chords` (size) leave `ScalesSearch` and
    `SCALES_DEFAULTS`; `SCALES_KEPT = ['tempo', 'hands']`.
- **Not in this item:** the tabs' content (round 2, A21, A43).
- **Done when:**
  - `src/pages/scales/ui/ScalesSettingsPage.test.tsx`: "opens from the gear, Back returns with the scale kept";
    "Rhythm Dotted plays the run long-short" (fake audio note lengths alternate 3:1); "Fingering From the thumb
    changes the numbers on the staff"; "turning Modes off takes Dorian out of the Scale picker".
  - `ScalesPage.test.tsx`: "has no Fingering, Rhythm or Chord size control on the page".
  - `src/shared/lib/music/scale-family.test.ts`: every `ScaleKind` has one family.
- **Owner's question:** A24 lists Octaves and Hands for Settings; I keep them on the page because they change the
  run drawn (A24's own "on the page: what you are looking at"). Default as written.

### S3: Intervals settings

- **Source:** A24 Intervals (979–980), A22 (800–823), A32, Decided 20.
- **Today:** gear → `/settings/intervals?from=intervals`, only link rows. The page has Root and the floating
  Harmonic · Melodic rising · Melodic falling (`way` in the URL). Names are written one way (`use-interval-name.ts`).
- **Will build:**
  - Route `/practice/intervals/settings`, gear "Intervals settings"; parent `/practice/intervals`.
    `src/pages/intervals/ui/IntervalsSettingsPage.tsx`. Name: "Intervals".
  - Group **"Names"** (ru «Названия»):
    1. `ChoiceRow` "Interval names" (ru «Названия интервалов») — segmented **m3** · **♭3** · **Minor 3rd**
       (ru «м3» · «♭3» · «Малая терция»), default **Minor 3rd**. Key `intervals.names`:
       `'short' | 'degree' | 'full'`. Rows, staff labels and the Quiz's Intervals answers use it.
  - Group **"Range"** (ru «Диапазон»):
    2. `SwitchRow` "Compound intervals" (ru «Составные интервалы»), default **off**. Key `intervals.compound`.
       On: the list adds the 9th to the 15th (Minor 9th … Double octave) after the Octave.
  - Group "Instruments" (S0).
  - How an interval plays (harmonic or melodic) stays the page's floating choice (A22 built it there; it is what
    you hear now, in the URL `way`), so it is not a setting (no setting on two pages).
  - Store `IntervalsSettings { names; compound }`, `DEFAULT_INTERVALS = { names: 'full', compound: false }`.
- **Done when:** `src/pages/intervals/ui/IntervalsSettingsPage.test.tsx`: "opens from the gear, Back returns";
  "m3 names every row short" (row "m3" shown, "Minor 3rd" gone); "Compound intervals adds the Minor 9th row".
  Screenshots `kind-settings-intervals-*`.

### S4: Progressions settings

- **Source:** A24 Progressions (981–982: "written as, voicing, first chord's inversion, mode"), A23, Decided 20;
  compliance C4 (Mode on the page, not its Settings).
- **Today:** `/settings/progressions` (`ProgressionsSettingsPage.tsx`): one group, Written as (segmented
  Numerals · Nashville · Chord symbols), Voicing (Voice-led · Block), First chord's inversion (only when
  voice-led). Mode is on the page (`mode` in the URL).
- **Will build:**
  - Route `/practice/progressions/settings`, gear "Progressions settings"; parent `/practice/progressions`
    (search kept). Component moves to `src/pages/progressions/ui/ProgressionsSettingsPage.tsx`, drawn by the
    registry (S14). Name: "Progressions".
  - Group **"Notation"** (ru «Запись»): 1. `ChoiceRow` "Written as" (ru «Запись») — segmented **Roman
    numerals** · **Nashville** · **Chord symbols**, default **Roman numerals** (`progressions.names`).
  - Group **"Voicing"** (ru «Голосоведение»): 2. `ChoiceRow` "Voicing" — segmented **Voice leading** · **Block**
    (ru «Плавное голосоведение» · «Аккорды в основном виде»); the label "Voice-led" becomes the noun **Voice
    leading** (A6). Default Voice leading (`progressions.voicing`). 3. `ChoiceRow` "First chord's inversion"
    (ru «Обращение первого аккорда») — segmented Root · 1st · 2nd · 3rd (3rd only for 7th chords), default Root
    (`progressions.inversion`), drawn only under Voice leading (R30).
  - Mode: A23/A24 say it belongs here, but it changes the chords shown (Dorian's ii is major). Decided 20 and A32
    ("nothing that is a page's current choice is a setting") keep it on the page; round 2 C4 decides. Not here.
  - Group "Instruments" (S0).
- **Done when:** the three cases of today's `PracticeSettings.test.tsx` "writes and voices every progression…"
  move to `src/pages/progressions/ui/ProgressionsSettingsPage.test.tsx` at the new route, plus "opens from the
  gear and Back returns to the progression with its key".

### S5: Accompaniment settings

- **Source:** A24 Accompaniment (983–984: "tempo, key, hands, loop, count-in, which sources show as tabs and in
  what order"), A25, R4 (drag), Decided 20.
- **Today:** `/settings/accompaniment`: one switch per source (`accompaniment.hidden`), the last one shown
  disabled. Tempo, key and hands are each pattern's, chosen where it plays; loop and count-in are the Player's.
- **Will build:**
  - Route `/practice/accompaniment/settings`, gear "Accompaniment settings"; parent `/practice/accompaniment`.
    `src/pages/accompaniment/ui/AccompanimentSettingsPage.tsx`. Name: "Accompaniment".
  - Group **"Sources"** (ru «Источники»), custom rows: one row per source with a drag handle at its start
    (dnd-kit, as `LibraryDnd`), its name, a `Switch` at its end (shown in the page's source picker or not).
    Dragging sets the order. Last source shown: its switch is not drawn (R16/R30, hidden, not greyed) and the
    footnote reads "At least one source is shown." Keys `accompaniment.hidden` (kept) and new
    `accompaniment.order: readonly string[]` (empty = the built-in order).
  - Group **"Playback"**: link row "Player settings ›" is **not** added (the Player has no address without a
    pattern); count-in and loop are the Player's (S9), drawn once there.
  - Tempo, key, hands: a pattern's current choice on its page, not settings (A24's list says them; R18 forbids a
    second copy). Logged in the audit.
  - Group "Instruments" (S0).
- **Done when:** `src/pages/accompaniment/ui/AccompanimentSettingsPage.test.tsx`: "hides a source from the page's
  picker and shows it again"; "dragging Styles above Bobrova orders the picker" (keyboard drag: Space, ArrowUp,
  Space); "the last source has no switch".

### S6: Chord finder settings

- **Source:** A24 Chord finder (985–986), A25 (1003–1015: "the gear opens its Settings page"), Decided 20.
- **Today:** `/settings/chord-finder`: four switches, Remember the chords, Slash chords (`C/E` icon), Keys it is in,
  Scale on the keys.
- **Will build:**
  - Route `/practice/chord-finder/settings`, gear "Chord finder settings"; parent `/practice/chord-finder`.
    `src/pages/chord-finder/ui/ChordFinderSettingsPage.tsx`. Name: "Chord finder".
  - Group **"Naming"** (ru «Название»): 1. `SwitchRow` "Slash chords" (ru «Аккорды с басом», e.g. C/E), default
    on (`chordFinder.slash`). Professional term: slash chord (every chord book). Today's label stays if it already
    reads so; the icon becomes a tile like every row (no text-as-icon, R21).
  - Group **"Shown with the chord"** (ru «Под аккордом»): 2. `SwitchRow` "Keys it is in" (ru «Тональности»),
    default on (`chordFinder.inKeys`). 3. `SwitchRow` "Scale on the keys" (ru «Гамма на клавишах»), default off
    (`chordFinder.scale`).
  - Group **"History"** (ru «История»): 4. `SwitchRow` "Remember chords" (ru «Запоминать аккорды»), ⓘ "Keeps the
    last 24 chords on this device.", default off (`chordFinder.remember`).
  - Group "Instruments" (S0). Symbol style is app-wide (S12).
- **Done when:** today's "keeps the Chord finder's choices…" test moves to
  `src/pages/chord-finder/ui/ChordFinderSettingsPage.test.tsx` at the new route; plus "opens from the gear".

### S7: Metronome settings

- **Source:** A24 Metronome (987–988: "sound, accent on beat 1, subdivision, volume, count-in, a visual flash, the
  bar trainer; saved tempo presets"), A39 (1493–1523), A25 (1016–1022), Decided 20 ("each Practice page");
  `settings-homes.test.ts` NOT_YET_HOME (the click volume).
- **Today:** no Settings page and no gear (the bar has only an ⓘ). On the face: tempo ±, word, slider, Tap
  tempo, beat squares, Play; then a card of Sound (Clicks · Beeps · Drum beat), Time signature (menu), Subdivision
  (menu); then Practice: speed trainer and bar trainer. Its volume is `sound.click`, drawn on the Player's
  Settings as "Metronome" volume and written by `use-metronome.ts` too.
- **Will build:**
  - Route `/practice/metronome/settings`, gear "Metronome settings" in its bar (the ⓘ stays beside it).
    `src/pages/metronome/ui/MetronomeSettingsPage.tsx`. Name: "Metronome". Parent `/practice/metronome`.
  - Group **"Sound"** (ru «Звук»):
    1. `ChoiceRow` "Sound" (ru «Звук») — menu: the sounds round 2 (A39, D16) delivers, today **Click** ·
       **Beep** · **Drum kit** (ru «Щелчок» · «Сигнал» · «Ударные»; "Clicks", "Beeps", "Drum beat" become the
       singular instrument names). Default Click (`metronome.sound`). Moves off the face.
    2. `ChoiceRow` "Volume" (ru «Громкость») — slider 0–100 %, step 5, default 100 (`sound.click`, its home moves
       from `player` to `metronome`; the Player's Audio playback loses its "Metronome" slider and keeps the
       "Metronome ›" link row). Today's NOT_YET_HOME exception is deleted.
    3. `ChoiceRow` "Subdivision" (ru «Деление доли») — menu **None** · **8ths** · **Triplets** · **16ths** ·
       **Swing 8ths** (ru «Нет» · «Восьмые» · «Триоли» · «Шестнадцатые» · «Свинг»); "Nothing" becomes "None".
       Default None (`metronome.subdivision`). Moves off the face.
  - Group **"Display"** (ru «Отображение»):
    4. `SwitchRow` "Flash on the beat" (ru «Вспышка на долю»), default off. New key `metronome.flash`. The
       flash itself is round 2's A39; until it exists the row is not drawn (R30), so the row lands with it.
  - Group "Instruments" (S0) — not drawn here: the metronome plays no piano. Instead the page ends with no
    links.
  - Stays on the face: tempo, tempo word, slider, Tap tempo, Time signature, beat squares (tap: accent · beat ·
    silent, which *is* "accent on beat 1"), Play, and the two trainers (practice modes switched on for a
    session, with a live bar count: what you look at). Count-in is the Player's (S9); the Metronome page has none.
  - Saved tempo presets (A39 "tempo list") are round 2's; they join this page's group "Tempos" when built.
- **Done when:** `src/pages/metronome/ui/MetronomeSettingsPage.test.tsx`: "opens from the gear and Back returns";
  "Sound Drum kit plays the kick on beat 1"; "Volume 50 halves the click's gain" (fake audio);
  `MetronomePage.test.tsx`: "has no Sound or Subdivision menu on its face"; `settings-homes.test.ts`'s
  NOT_YET_HOME is empty.
- **Owner's question:** A24 puts the bar trainer in Settings; I keep both trainers on the face (switched per
  session, they show the bar count). Default as written.

### S8: Exercises and Quiz settings

- **Source:** A24 Exercises and Quiz (989–990: "questions in a round, timer, answer by tapping or from the piano,
  hints, sounds, the keys included"), A41, A5 (Keys sheet), Decided 20.
- **Today:** `/settings/exercises-and-quiz` (`TrainersSettingsPage.tsx`): one switch "Go on automatically"
  (`trainer.autoNext`). Each drill's setup (`widgets/trainer-setup/ui/TrainerSetup.tsx`) has Shown, Level, what
  to drill (chords, intervals, keys, inversions, ways, scales, kinds, range, descending, accidentals, arpeggio),
  Rounds (segmented 5 · 10 · 20 · ∞) and Timing › Time limit (menu Off · n seconds), all in the URL.
- **Will build:**
  - Routes `/practice/exercises/settings` and `/practice/quiz/settings`, both drawing
    `src/pages/quiz/ui/TrainersSettingsPage.tsx`; gear "Exercises and Quiz settings" on Exercises' bar, Quiz's bar
    and each drill's setup bar (`/practice/quiz/$trainerId` → `/practice/quiz/settings`). Name: "Exercises and
    Quiz". Parents: the page the gear was on (`/practice/exercises`, `/practice/quiz`).
  - Group **"Rounds"** (ru «Раунды»):
    1. `ChoiceRow` "Questions" (ru «Вопросов») — segmented **5** · **10** · **20** · **∞** (∞'s tooltip "Until
       stopped"). Default 10. New key `trainer.rounds`. Leaves the setup and the URL (`rounds` out of
       `readTrainerSearch`, `TRAINER_DEFAULTS`).
    2. `ChoiceRow` "Time limit" (ru «Время на ответ») — menu Off · 5 s · 10 s · 20 s · 30 s (today's
       `TIME_LIMITS`), default Off. New key `trainer.limit`. ⓘ today's text. Leaves the setup's Timing group,
       which goes.
    3. `SwitchRow` "Next question automatically" (ru «Следующий вопрос сам»), ⓘ today's, default off
       (`trainer.autoNext`). "Go on automatically" is reworded to the action's name.
  - Group **"Answers"** (ru «Ответы»): 4. `ChoiceRow` "Answer with" (ru «Отвечать») — segmented **Buttons** ·
    **Piano** (ru «Кнопками» · «На пианино»), default Buttons; Piano accepts the on-screen piano or a connected
    piano. Only drawn once round 2's A41 drill can take a played answer for every drill kind; until then not drawn
    (R30). Hints and sounds: no such feature exists; not drawn.
  - Stays on each drill's setup (what to drill now): Shown, Level, the items (Keys sheet, chords, intervals…).
  - Group "Instruments" (S0).
- **Done when:** `src/pages/quiz/ui/TrainersSettingsPage.test.tsx`: "opens from Quiz's, Exercises' and a
  drill's gear, Back to each"; "Questions 5 ends a run after five" (start a drill, answer five, see results);
  "Time limit 10 s shows a timer"; `TrainerSetup` test: "has no Rounds or Time limit".
- **Owner's question:** A24 puts "the keys included" here; I keep it on each drill's setup (it is what the drill
  asks; A5 gave it the Keys sheet there). Default as written.

### S9: Player settings

- **Source:** Decided 20 ("the Player … has its own real Settings page reached from its own gear"), R18 (192–193),
  R9, B7 (1809–1815), B8 Display (1829–1830), A35's list; audit R9 PARTIAL (the View popover writes Player
  settings beside `/settings/player`).
- **Today:** Settings › Player (`/settings/player`, `PlayerSettingsPage`) and a song's gear
  (`/play/$pieceId/settings`, `PieceSettingsPage`) both draw `PlayerSettings` (`widgets/player-settings`): Audio
  playback (a slider per staff, the recording, the metronome; Only the chords button), Metronome › link, Playback
  speed (Speed training 2 · 5 · 10 %), Display (Count-in, Cursor, the layout picture choice, Keys switch, Finger
  numbers switch), Practice (Other hand Show · Dim · Hide, Play the other hand), Pedal (As written · Off ·
  Automatic). The walks', progressions' and exercises' Players' gear navigates to `/settings/player`. The View menu
  (`widgets/score-view-menu`, `PlayerViewMenu.tsx`) also writes layout, finger numbers, note names, chord positions,
  chord names, lyrics, view, Diagrams mode, text size, pinned and "Show this when opening a song" (askOnOpen).
- **Will build:**
  - Routes (full-screen, each a child of its Player route, the Player's search kept): `/play/$pieceId/settings`
    (exists), new `/play/walk/settings`, `/play/chromatic/settings`, `/play/progression/settings`,
    `/play/exercise/$exerciseId/settings`. All draw `PlayerSettingsPage` in `src/pages/player/ui/
    PlayerSettingsPage.tsx` (renamed from `PieceSettingsPage`; the tracks from the piece where there is one, else
    the piano's two staves). Parents: each its Player (`toPlayer`-style, `search: true`).
  - Opened from the gear in the Player's bar (`SettingsGear name="Player"`, first of the bar's actions after MIDI).
    Name under the bar: the song's title where there is one ("Fantaisie-Impromptu"), else "Player".
  - Group **"Audio playback"** (Flat's term; ru «Воспроизведение»), custom rows: one volume slider per staff of
    this song by its name (else "Upper staff", "Lower staff"), "Recording" where the song has one; button
    "Only the chords" stays (a command, R24 "does something" row: accent label, `RowButton`). The "Metronome"
    slider leaves (S7); a `RowLink` "Metronome ›" (value: the sound, "Click") opens `/practice/metronome/settings`.
  - Group **"Playback"** (ru «Воспроизведение»): 1. "Count-in" (ru «Отсчёт») — segmented **None** · **Audible** ·
    **Visual**, default None (`playback.countdown`); "Countdown" → **Count-in** (the musician's word, as A24 uses).
    2. "Pedal" (ru «Педаль») — segmented **As written** · **Off** · **Automatic**, default As written
    (`playback.pedal`); joins this group (no group of one row). 3. "Speed training step" (ru «Шаг ускорения») —
    segmented 2 % · 5 % · 10 %, default 5 % (`playback.speedStep`).
  - Group **"Display"** (ru «Отображение»): 4. "Cursor" (ru «Курсор») — segmented None · Beats · Continuous,
    default Continuous (`playback.cursor`). 5. `SwitchRow` "Choose the view on opening" (ru «Выбирать вид при
    открытии»), default off (`scoreView.askOnOpen`; leaves the View menu, where it was a setting inside a
    menu, against DESIGN.md "a menu never holds a setting"). 6. B8's "Clef" (Original · Treble · Bass) is round
    4's (B7); it joins this group when its engraving exists, not drawn before (R30).
  - Group **"One hand"** (ru «Одна рука»): 7. "Other hand" — segmented Show · Dim · Hide, default Dim
    (`otherHand.look`). 8. `SwitchRow` "Play the other hand", default on (`otherHand.play`).
  - Group "Instruments" (S0).
  - Leave this page (drawn once, in the View menu, which is the Player's "what you look at", Chordify's View):
    the layout (`scoreView.layout`), Keys (`scoreView.keys`), Finger numbers (`practice.fingerNumbers`). Their
    rows go from `PlayerSettings.tsx`.
  - `/settings/player`, `PlayerSettingsPage` in `pages/settings`, `widgets/player-settings` (folded into
    `pages/player`'s page, as only the Player uses it) and the SettingsList row go.
  - The editor's Sound popover (`pages/score-editor/ui/RecordingSettings.tsx`) row "Audio playback ›" points to
    `/edit/$pieceId/settings` (S10), not `/settings/player`.
- **Not in this item:** Transpose (round 4), Staves (A35), Clef/Insert/palette side engines (B7, round 4).
- **Done when:**
  - `src/pages/player/ui/PlayerSettingsPage.test.tsx`: for `/play/fur-elise`, `/play/walk?…`, `/play/progression?
    …`, `/play/exercise/hanon-1`: "the gear opens `<path>/settings`, and Back returns to the Player with its
    search"; "Count-in Audible counts a bar before the music" (fake audio); "has no layout, keys or finger
    numbers row"; "Metronome › opens the Metronome's settings".
  - `PlayerViewMenu` test: "has no Choose the view on opening switch".
  - Screenshots `kind-settings-player-*` (a song with a recording) at the three sizes.

### S10: Score editor settings

- **Source:** Decided 20 (the score editor's own Settings; "Hear notes as you edit" is not a professional term:
  "Play notes while editing" / Dorico "Play notes during note input"), R18 (198), B7 (1810–1812).
- **Today:** two pages draw `EditingGroup` (`widgets/editor-settings/ui/EditingGroup.tsx`): Settings › Score editor
  (`/settings/score-editor`) and the score's Settings (`/edit/$pieceId/settings`, `ScoreSettingsPage.tsx`, its
  gear in the editor's bar): Hear notes as you edit (switch), then links Connect a piano, Sound and recording,
  Player. The score's Settings also hold its names, Instruments, Music (Tempo, Key, Time, Bars) and Layout
  (Staff size, Bars per line).
- **Will build:**
  - The score editor's Settings is `/edit/$pieceId/settings` alone (it is the lesson model: the item's own rows,
    then the kind's rows). Gear "Score settings" (unchanged place). Name under the bar: the score's title.
  - Its groups in order: Title and credits, Instruments, Music, Layout (unchanged, this score's), then
    **"Note input"** (ru «Ввод нот»; Dorico's and MuseScore's name for the editor's entry preferences):
    1. `SwitchRow` **"Play notes while editing"** (ru «Проигрывать ноты при вводе»), ⓘ "A note sounds when you
       enter it, select it or change its pitch.", default on. Key `editing.hearNotes` renamed `editing.playNotes`
       (shape change: `pt-settings` version bump). Drawn here only.
    2. Round 4 (B7) adds "Input mode" (Replace · Insert) and "Palette" (Left · Right) here when their engines
       exist; not drawn before.
  - Group **"Recording"** (ru «Запись»): 3. `SwitchRow` "Click while recording" (ru «Метроном при записи»),
    default on (`recorder.click`), moves here from Sound and recording, since only the editor records (its home
    becomes `score-editor`). "Play melody" (`recorder.tune`, `TuneSwitch`) is deleted with its field (A14, A35).
  - Group "Instruments" (S0), plus `RowLink` "Audio playback ›"? No: the volumes are the Player's; the editor's
    Sound popover links to the Player only from a song's Player. The old links Sound and recording and Player go
    from this group.
  - Removed: `/settings/score-editor`, `pages/settings/ui/ScoreEditorSettingsPage.tsx`, its SettingsList row,
    `widgets/editor-settings` (the group moves into `pages/score-editor/ui/NoteInputGroup.tsx`).
  - The lesson example editor (`/lessons/$lessonId/example`) has no Settings gear today; it gets none (its score
    belongs to the lesson).
  - Glossary: "Play notes while editing" added, _Avoid:_ "Hear notes as you edit"; ADR 0114 lines 122, 162.
- **Done when:** `pages/score-editor/ui/ScoreSettingsPage.test.tsx`: "draws Play notes while editing once, under
  Note input"; "Click while recording is here, and Sound and recording has no recording rows"; the avoid-words
  test fails on "Hear notes" in any locale; no route `/settings/score-editor` (`router` test).

### S11: Songs settings

- **Source:** Decided 20 ("the Player, the score editor, Songs has its own real Settings page"); A38 (1474–1475:
  "Settings may choose what a song opens to ('Open a song on: its page · the Player')").
- **Today:** Songs has no gear and no kind setting. Its bar: Select, Archive (and a folder's ⋯). The sort is the
  library's, beside the search.
- **Will build:**
  - Route `/songs/settings` (shell; static, so it wins over `/songs/$pieceId`); parent `/songs`. Gear "Songs
    settings" in Songs' bar at the top level and in a folder's bar (parent then still `/songs`, the folder kept
    only by browser Back). `src/pages/songs/ui/SongsSettingsPage.tsx`. Name: "Songs".
  - Group **"Opening a song"** (ru «Открытие песни»): 1. `ChoiceRow` "Open a song on" (ru «Открывать песню») —
    segmented **Song page** · **Player** (ru «Страница песни» · «Плеер»), default Song page. New key
    `songs.open`. A tap on a song row opens `/songs/$pieceId` or `/play/$pieceId`; the row's ⋯ keeps both
    ("Open", "Practise").
  - Group "Instruments" is not drawn (no piano on Songs).
  - B9's Card style ("how a song row and card look") joins this page in round 14.
- **Done when:** `src/pages/songs/ui/SongsSettingsPage.test.tsx`: "opens from the gear, Back to Songs"; "Player
  makes a tap on a row open the Player".
- **Owner's question:** the page has one row until B9. Default: build it now (Decided 20 names Songs).

### S12: What stays in the app's Settings

- **Source:** Decided 20 ("The app's Settings holds only what is app-wide"); R18 (199: "language, theme, account,
  sync, connected piano, recording"); A32 (1272–1277: app-wide "Notation and names").
- **Today:** `SettingsList.tsx`: account card; General (General, Storage and backup); Playing (On-screen piano,
  Connect a piano, Computer keys, Sound and recording, Player, Score editor); Practice (seven rows); Help (How to
  use, Privacy, Terms, version rows); Admin. General page: Language, Lessons read as, Theme.
- **Will build:**
  - `SettingsList.tsx` keeps: account card; **General** (General, Storage and backup); **Playing** (On-screen
    piano, Connect a piano, Computer keys, Sound and recording); **Help**; Admin. Leaves: the Player and Score
    editor rows and the whole Practice group (`PRACTICE_SETTINGS` deleted).
  - General page (`/settings/general`): group 1 Language (menu), Theme (picture choice). **Lesson reading leaves**
    General: its home becomes the lesson's Settings (below). New group **"Notation"** (ru «Нотация»), A32's
    app-wide names, built here when round 2 (A32) wires them into every page; each row not drawn until its
    effect exists (R30): "Note names" (C D E · До Ре Ми · German: H), "Chord symbols" (Cmaj7 · CΔ7 · CM7),
    "Accidentals" (Sharps · Flats, for the black keys by default).
  - Sound and recording becomes **"Sound"** (`/settings/sound`; ru «Звук»): its Recording group leaves (S10);
    what is left: a `RowLink` "Metronome ›" to `/practice/metronome/settings`. Round 3 (A27) adds the piano
    sound's rows. If round 3 adds none, the page and its row go and the Metronome link with them. Owner's
    question below.
  - **Lesson reading** (`lessonReading`): home `lesson`. The lesson's Settings (`LessonSettingsPage.tsx`) draws
    the control itself instead of its link to General: group "Reading" (ru «Чтение»), `ChoiceRow` "Reading" —
    segmented **One page** · **One section at a time** (today's `reading.page`/`reading.sections` labels), default
    One page. Course lessons draw the same `LessonSettings` (one component, one home). The course's Settings
    (`/courses/$courseId/settings`) has no reading row.
- **Done when:** `widgets/settings-screen/ui/SettingsList.test.tsx` (new): "lists only app-wide pages" (names
  exactly: General, Storage and backup, On-screen piano, Connect a piano, Computer keys, Sound, How to use,
  Privacy, Terms; no Chords, Player, Score editor, Songs); `GeneralPage` test "has no Reading row";
  `LessonSettingsPage.test.tsx` "chooses One section at a time here and the lesson reads by sections".
  Screenshots `settings-list-{390x844,1280x800}`.
- **Owner's question:** "Sound and recording" left with one link row: rename to "Sound" and wait for A27's rows,
  or remove it now? Default: rename and keep only if round 3 fills it in the same release; else remove.

### S13: Duplicates removed

| Setting | Drawn today on | One home after | Removed from |
|---|---|---|---|
| Play notes while editing (`editing.hearNotes`→`playNotes`) | Settings › Score editor; score's Settings | score's Settings › Note input | `/settings/score-editor` |
| Player's whole set (`playback.*`, `sound.*`, `otherHand.*`) | Settings › Player; a song's Player gear | the Player's `/settings` | `/settings/player` |
| Metronome volume (`sound.click`) | Player › Audio playback; written by `use-metronome.ts` | Metronome settings › Volume | Player's Audio playback |
| Layout (`scoreView.layout`) | Player settings › Display; View menu | View menu | Player settings |
| Keys under the score (`scoreView.keys`) | Player settings › Display; View menu/rail | View menu | Player settings |
| Finger numbers (`practice.fingerNumbers`) | Player settings › Display; View chips | View menu | Player settings |
| Choose the view on opening (`scoreView.askOnOpen`) | View menu | Player settings › Display | View menu |
| Click while recording (`recorder.click`) | Sound and recording | score's Settings › Recording | Sound and recording |
| Play melody (`recorder.tune`) | Sound and recording | none (deleted, A14) | everywhere |
| Lesson reading (`lessonReading`) | General; link on lesson Settings | lesson's Settings | General |
| Each Practice page's settings | `/settings/<page>` + Settings' Practice group | `/practice/<page>/settings` | the app's Settings |
| Chords' "Arpeggio" button | capsule beside Play | Chords settings › Chord playback | Chords' capsule |
| Scales' Fingering, Rhythm, Chord size | Notes / Harmony tabs | Scales and keys settings | the tabs |
| Metronome's Sound, Subdivision | its face | Metronome settings | its face |
| Rounds, Time limit | each drill's setup | Exercises and Quiz settings | setups |

### S14: Registry, routes, parents and tests

- **Source:** A10 (594–601: "Define the settings once, in a registry (key, home, label, control), and render pages
  from it"), audit contradiction 4; R18; R26.
- **Today:** `entities/settings/model/registry.ts`: `SETTINGS_PAGES` (15 ids), `SETTING_HOMES` key → page,
  `NOT_PREFERENCES`; no label or control; every page hand-written. Tests: `registry.test.ts` (every field homed),
  `src/app/settings-homes.test.ts` (commands written only from their home's files), `src/app/settings-pages.test.
  tsx` (renders each page, `data-setting` only from its home), `pages/practice-settings/ui/PracticeSettings.
  test.tsx`.
- **Will build:**
  - `registry.ts`:
    - `SETTINGS_PAGES` becomes two lists: `APP_PAGES = ['general', 'on-screen-piano', 'connect-piano',
      'computer-keys', 'sound']` and `KIND_PAGES = ['lesson', 'songs', 'player', 'player-view', 'score-editor',
      'metronome', 'chords', 'scales', 'intervals', 'progressions', 'accompaniment', 'chord-finder', 'trainers']`
      (`player-view` = the Player's View menu, a surface of the Player); `SettingsPageId` their union.
    - `interface SettingDef { readonly key: SettingKey; readonly home: SettingsPageId; readonly group: string;
      readonly label: string; readonly info?: string; readonly control: SettingControl }` where `group`, `label`,
      `info` are i18n keys (`'practice:chords.settings.playback'`), and
      `type SettingControl = { kind: 'switch' } | { kind: 'segmented' | 'menu' | 'picture'; options: readonly
      (string | number)[]; option: string /* i18n prefix */ } | { kind: 'slider'; min: number; max: number; step:
      number } | { kind: 'custom' }` (custom: drawn by its page, e.g. per-staff volumes, sources).
    - `export const SETTINGS: readonly SettingDef[]` in page order; `SETTING_HOMES` derived from it
      (`Object.fromEntries`), typed `Record<SettingKey, SettingsPageId>` by a `satisfies` check so a new field
      without a def fails `tsc`.
  - Renderer `src/widgets/settings-page/` (new slice): `SettingsRows({ page, custom }: { page: SettingsPageId;
    custom?: Partial<Record<SettingKey, ReactNode>> }): ReactElement` draws the page's defs grouped in
    `SettingsGroup`s, each def through `SettingRow({ def })` → the R24 row for its control, with `data-setting`.
    One write path: `setSetting<K extends SettingKey>(store: SettingsStoreApi, key: K, value: SettingValue<K>):
    void` in `src/features/set-preference/set-setting.ts` (with its test); the existing commands stay for the
    View menu, rail and MIDI pages that are not registry-drawn.
  - Every kind page in S1–S11 and the app pages (General, On-screen piano, Computer keys, Sound) draw their
    preference rows with `SettingsRows`; Connect a piano keeps its device list custom.
  - Routes in `src/app/router.tsx`: delete the nine routes at lines ~199–208 and ~242–285 (`/settings/player`,
    `/settings/score-editor`, `/settings/chords|scales|intervals|progressions|accompaniment|chord-finder|
    exercises-and-quiz`); add `/practice/{chords,scales,intervals,progressions,accompaniment,chord-finder,
    metronome,exercises,quiz}/settings`, `/songs/settings`, `/play/{walk,chromatic,progression}/settings`,
    `/play/exercise/$exerciseId/settings`; `/settings/sound-and-recording` → `/settings/sound`. Lazy screens:
    each new page in its place's `*-screens.ts` (`explorer-screens.ts`, `tool-screens.ts`, `practice-screens.ts`,
    `songs-screens.ts`, `player-screens.ts`), never `settings-screens.ts`.
  - `src/app/routes/parents.ts`: remove the nine `/shell/settings/<kind>` entries and `practiceSettings`; add each
    new route's parent (its page, search kept, R26).
  - `src/app/routes/practice-search.ts`: delete `PracticeSettingsFrom`, `validatePracticeSettingsSearch`.
  - Deleted: `src/pages/practice-settings/` (all), `pages/settings/ui/PlayerSettingsPage.tsx`,
    `ScoreEditorSettingsPage.tsx`, `widgets/practice-pages/ui/SettingsGear.tsx`, `widgets/editor-settings/`,
    `widgets/player-settings/` (moved into `pages/player`).
  - `pt-settings` version bumped once for the round (new `chords`, `scales`, `intervals`, `songs` groups;
    `trainer.rounds`, `trainer.limit`, `accompaniment.order`, `metronome.flash`; `editing.playNotes`;
    `recorder.tune` gone).
  - Tests:
    - `entities/settings/model/registry.test.ts` adds: "every def's label and group exist in en and ru" (reads
      the locale objects); "every app page is in Settings' list and every kind page is not" (against a
      `SETTINGS_LIST_PAGES` constant `SettingsList` reads).
    - `src/app/settings-pages.test.tsx`: `PAGES` becomes every page's route (app pages and every kind route
      above, with a sample piece/exercise id); still asserts each `data-setting` only on its home and never on
      two pages.
    - `src/app/settings-homes.test.ts`: `PAGE_PATHS` to the new files; `NOT_YET_HOME` empty.
    - New `src/app/kind-settings.test.tsx`: `it.each` over every page with a gear: "the gear opens
      `<path>/settings` and Back returns to `<path>` with its search" (replaces `PracticeSettings.test.tsx`).
    - `parents.test.ts` passes (every route has a parent).
  - Docs: ADR 0052, 0025, 0105, 0115 amended (Corrections 1–4); CLAUDE.md's Settings paragraph and "the places"
    lines (Settings' pages list; Practice's settings); `settings-map.md` rewritten from `SETTINGS`.
- **Done when:** typecheck, lint, the tests above, `npm run build` (routing changed); screenshots of each new
  page and of the app's Settings list at 390×844, 844×390, 1280×800 in `shots/after/`.
