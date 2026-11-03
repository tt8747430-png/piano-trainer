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
13. **`src/shared/ui/FloatingActions.tsx` doc and `ALIGN`** ("beside the page … in a column at its right, over the
    keys") and **DESIGN.md "Buttons › Floating"** ("the honey 56px circle … a second action a raised 48px circle"):
    describe the docked column and two button shapes R5 forbids. Correct: one centred capsule at the foot on every
    screen and orientation (R5 below).
14. **`progress.md` row A5**: "Decided: … the score editor's key keeps its sign grid (ADR 0114)" and "wedges show
    the signature as a count". Both contradict A5 (prompt 655–660: the editor's key is the circle; "each wedge with
    its key signature"). ADR 0114 is older than the brief, so the brief wins. Correct in A5 below; Transpose is out
    of A5 (Decided 20).
15. **`progress.md` row A11**: "DESIGN.md pattern left". It is written (DESIGN.md "Placement", "An act on an item
    is a button"). What is left is Learned's menu command (A11 below).
16. **`progress.md` row A17**: "the song's Reset/Delete keeps its own dialog for its focus return (to move with
    B6)". R17 says one dialog everywhere; it moves now (A9 below), not in round 10.
17. **`progress.md` row A9**: "edit-original's in round 10 (audit)". The prompt puts A9 in round 1 (prompt 1960–
    1966). Discard, Restore and Publish's own `AlertDialog`s move to `ConfirmDialog` now (A9).
18. **`ScreenHeader.tsx` doc** ("one row of one height on every screen … a page's tabs its second row … allowed a
    second line"): the height is not one; corrected by A2.

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
  - Group "Instruments" (S0): On-screen piano ›, Connect a piano ›. Then group **"Playback"** with one
    `RowLink` "Audio playback ›" (ru «Воспроизведение») to `/play/$pieceId/settings` (each staff's volume is
    the Player's, R18). Today's links "Sound and recording" and "Player" (to `/settings/player`) go.
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

---

## R: The standing rules' open contradictions

### R5: Floating actions, one centred capsule

- **Source:** R5 (prompt 132–136: one style and size; clear of the tab bar, home indicator and keyboard; a centred
  capsule, never docked to a side; never the same action twice); R16 (hidden, never greyed, re-centred); R29
  ("The floating transport is one capsule"); A3 (primary is a labelled button); audit contradiction 1.
- **Today:** `shared/ui/FloatingActions.tsx`: `FloatingHost` is `justify-center aside:justify-end` and `ALIGN`
  is `aside:flex-col`, so wherever keys are docked (a laptop from 64rem, a phone on its side) the actions stand
  as a column at the right edge. Two looks: a lone circle (`Fab`, `FabLink`, `PlayFab`, `FabPill`, `SpeedDial`:
  Scales' Play up and down, a song section's Practise, Course's Start, Learn's New course, Songs' +) and a capsule
  (`FloatingBar`: Chords, Intervals, the Player's transport, a lesson's ‹ n/m ›). `FloatingBar` has an `aside`
  orientation (upright) used by `LessonView`.
- **Will build:**
  - **One capsule.** Everything a screen floats is one `FloatingBar` (the pill: `rounded-pill border bg-raised
    elevation-2`, 56px high, 4px inner padding) centred at the foot. Inside it, left to right: second actions
    (48px round icon buttons, `FloatingBarButton`, tooltip = name), then the main action last (rightmost, the
    thumb's side). The main action is a honey pill with icon and label (`FloatingBarMain`, new, below), except a
    transport's Play/Stop, which stays the 48px honey round `FloatingBarPlay` between ‹ and › (media controls,
    named by tooltip; DESIGN.md says why).
  - `src/shared/ui/FloatingActions.tsx`:
    - `FloatingHost`: the outer div loses `aside:justify-end`; `ALIGN` becomes `'flex-row items-center'` (no
      `aside:flex-col`); `DIAL_ALIGN`/`DIAL_ASIDE` lose their `aside:` parts (a dial always opens upward,
      centred). `--floating-inline` is no longer set; only `--floating-block`.
    - `FloatingActions` keeps its signature (`{ last?, className?, children }`): each part a screen floats is a
      segment of the one capsule. Where two parts float at once (the Player's transport and its selection bar),
      they sit in one row, `gap-3`, centred together.
    - Removed exports: `Fab`, `FabLink`, `PlayFab`, `FabPill`, `MINI_FAB`. `SpeedDial` stays as a capsule
      member: its trigger is a `FloatingBarButton` (`⋯`, or `+` labelled "New" as a main pill when `main`).
  - `src/shared/ui/FloatingBar.tsx`:
    - `ORIENTATION` keeps `along` only; `column`, `aside`, `landscape-phone` go. The Player's full-screen layout
      (no host) places its capsule at the foot centred too.
    - New `function FloatingBarMain({ label, icon, render, ...button }: { label: string; icon: LucideIcon;
      render?: useRender.RenderProp } & Omit<ComponentProps<typeof Button>, 'children'>): ReactElement`: a
      48px-high honey pill inside the capsule, `icon` then `label` (Onest 600 16px), `rounded-pill px-4`.
    - New `function FloatingPlay({ label, playing, onClick }: { label: string; playing: boolean; onClick: () =>
      void }): ReactElement`: a one-member capsule (`FloatingBar` + `FloatingBarMain` with `Play`/`Square`, label
      the thing played: "Play", "Play up and down"; "Stop" while sounding). Replaces `PlayFab`.
  - `theme.css`: the `aside` custom variant stays only for the docked keys' own layout; `--floating-left`/
    `--floating-right` and the `:root:has([data-slot='docked'])` block that zeroes `--floating-foot` go: the page
    pads its foot by the capsule's height above the docked keys on every screen.
  - Call sites (each now one capsule, the main labelled):

    | Screen | File | Capsule, left → right |
    |---|---|---|
    | Chords | `widgets/chord-explorer/ui/ChordExplorer.tsx` | main "Play" (Arpeggio button goes, S1) |
    | Scales and keys | `widgets/scale-explorer/ui/PlayUpDown.tsx` | main "Play up and down" (`FloatingPlay`) |
    | Intervals | `widgets/interval-explorer/ui/IntervalExplorer.tsx` | Harmonic · Melodic rising · Melodic falling, main "Play" |
    | A song's section | `pages/piece/ui/SectionPage.tsx` | main "Practise" (link) |
    | A listing | `pages/piece/ui/ListingView.tsx` | main "Practise" (link) |
    | A course | `pages/course/ui/CoursePage.tsx` | main "Start" / "Continue" (link) |
    | Learn › Courses (editor) | `pages/learn/ui/LearnPage.tsx` | main "New course" |
    | Songs | `pages/songs/ui/NewActions.tsx` | main "+ New" opening the dial (New song, Import, New folder) |
    | Songs › Select | `pages/songs/ui/SelectionBar.tsx` | its acts as icon buttons (already a bar) |
    | Chord finder | `pages/chord-finder/ui/ChordFinderPage.tsx` | ⋯ dial, main "Play" |
    | A pattern | `pages/pattern/ui/PatternPage.tsx` | main "Practise" (link) |
    | Shared song, Public song | `pages/shared-song/…`, `pages/public-library/ui/PublicSongPage.tsx` | main "Add to my library" (A3's own example), second "Practise" |
    | A take | `pages/score-editor/ui/TakePage.tsx` | ⋯ dial, main "Play" |
    | A chord row | `features/play-example/ui/ChordRow.tsx` | main "Play" |
    | Folded keys | `features/live-keyboard/ui/PinnedKeyboard.tsx` | second action (keys icon, "Show the piano") in the same capsule, `last` |
    | A lesson | `widgets/lesson-view/ui/LessonView.tsx` | ‹ n/m › (no `aside` orientation) |
    | The Player, the editor | `widgets/practice-player/ui/Transport.tsx`, `RecordButton`, `TakesButton`, `LoopButton`, `ClickButton` | Loop, Click, ‹, Play (round honey), ›, Record (editor) |

  - Clearance (R5's second bullet, unchanged mechanism, now tested): `bottom-docked` + `mb-3` keeps 12px above
    the tab bar, the docked keys and the home indicator (`mb-safe-4` where no tab bar); the keyboard-up rule
    (`theme.css` 443) still steps it aside.
  - "Never the same action twice": checked per screen in the table; the only double today is Chords' Arpeggio
    beside Play (S1 removes it).
- **Not in this item:** the dial's card (unchanged); which actions a built-in folder shows (R16, B3, round 7); the
  Player's transport buttons themselves (B8).
- **Done when:**
  - `src/shared/ui/FloatingActions.test.tsx`: "tells the page the room its actions take … at the foot or at the
    side" becomes "tells the page the room its actions take at the foot, keys docked or not" (no
    `--floating-inline`); new "stands centred in one row with keys docked on a laptop" (asserts the host has
    `justify-center` and no `flex-col`, with a `[data-slot=docked]` present and `matchMedia('(width >= 64rem)')`
    stubbed true).
  - `src/shared/ui/FloatingBar.test.tsx`: new "the main action is a labelled pill, last in its capsule" and
    "FloatingPlay says Stop while it sounds".
  - New `src/app/floating-actions.test.ts` (source scan, like `nav-marks.test.ts`): "no module outside
    `shared/ui` imports `Fab`, `FabLink`, `PlayFab` or `FabPill`" and "no `aside:` class in `FloatingActions.tsx`
    or `FloatingBar.tsx`".
  - Screenshots: Chords, Scales and keys, a song's section, Songs, the Player at 390×844, 844×390, 1280×800
    (`shots/after/floating-<screen>-<size>.png`): one capsule centred above the keys/tab bar in each.
- **Owner's question:** the transport's Play stays a round icon (media players' mark) while every other main
  action carries its label. Default as written.

### R17: Confirm before an act that loses or hides work

- **Source:** R17 (prompt 157–177); audit contradiction 6 (Remove a lesson asks nothing).
- **Today:** the rule is half built: `confirm()` / `ConfirmDialog` (`shared/ui/confirm.ts`, `ConfirmDialog.tsx`)
  serve Archive, the deletes, Reset progress, Sign out, Delete account, a take's Delete, Unpublish of an item made
  in the app. Six screens keep their own `AlertDialog`; three acts ask nothing.
- **Will build:** everything in A9 below (one table, one dialog, one test per act). R17 adds no other code.
- **Done when:** A9's Done.

### A9: Every act that loses or hides work, through the one dialog

- **Source:** A9 (prompt 692–695), R17 (157–177), R25 (one-line footnote), A17 (song Reset/Delete).
- **Today:** see the table's "Today" column. Own `AlertDialog`s: `features/edit-original/ui/DraftBar.tsx`
  (Publish, Discard), `VersionsDialog.tsx` (Restore inside a list dialog), `pages/piece/ui/OwnMusicAsk.tsx`
  (Reset to the original, Delete), `pages/score-editor/ui/KeepBars.tsx` (Keep bars), `features/backup-data/ui/
  BackupFields.tsx` (Restore from a file), `pages/admin/ui/GroupsTab.tsx`, `SwitchesTab.tsx`, `ReportsTab.tsx`.
- **Will build:**
  - **The one dialog.** `ConfirmDialog` (`shared/ui/ConfirmDialog.tsx`) is the only `AlertDialog` user outside
    `shared/ui/primitives`, `widgets/welcome` (not a confirmation) and `app/deletion-gate` (a blocking screen,
    not a confirmation). Its shape is unchanged: title the question, one body line, the act's name on the button
    (red when `destructive`), Cancel focused first and closing on Esc. Every call goes through `confirm(asking)`
    (`shared/ui/confirm.ts`) except where the dialog needs a live field (Delete account's typed email: already
    `typed`).
  - **The acts** (en title / body / button; ru in the same keys). "Asks" = through `confirm()`; "Undo" = a
    `say(…, { label: 'Undo' })` notice after.

    | Act | Trigger(s) | Today | After | Title · body · button |
    |---|---|---|---|---|
    | Archive songs | row ⋯, swipe left, Select's bar, **Delete key in Select (new)** | asks + Undo | same; the key added | "Archive {{n}} songs?" (one: "Archive “{{title}}”?") · "You can restore them from the Archive." · Archive |
    | Archive a folder | row ⋯, swipe | asks + Undo | same | "Archive “{{name}}”?" · "Its songs go with it. You can restore it from the Archive." · Archive |
    | Delete forever (Archive) | row ⋯, Select | asks | same | "Delete {{n}} songs forever?" · "This can't be undone." · Delete |
    | Delete a folder | row ⋯ | asks (`DeleteFolderAsk`) | same | unchanged |
    | Delete an own song / Reset to the original | song Settings' danger rows | own `AlertDialog` (`OwnMusicAsk.tsx`) | `confirm()`; `OwnMusicAsk.tsx` deleted, its focus return done by `ConfirmDialog`'s `finalFocus` (the row) | "Delete “{{title}}”?" · "Its music and takes are deleted. This can't be undone." · Delete; "Reset “{{title}}”?" · "Your changes to its music are lost. This can't be undone." · Reset |
    | Unpublish (Public library) | Publish page's Unpublish button | **asks nothing** (`PublishScreen.tsx:192`) | asks | "Unpublish “{{title}}”?" · "It leaves the Public library. Saved copies stay with those who saved them." · Unpublish |
    | Unpublish / Delete (an item made in the app) | its Settings' danger rows | asks (`RemoveGroup.tsx`) | same | unchanged |
    | Discard changes (a draft) | bar menu's Discard; Settings' Unpublished changes | own `AlertDialog` (`DraftBar.tsx`) | `confirm()` | "Discard the changes to “{{title}}”?" · "The published version stays. This can't be undone." · Discard |
    | Publish a draft | bar's Publish | own `AlertDialog` | `confirm()` with `destructive: false` (not a loss, but it replaces what everyone sees) | unchanged words |
    | Restore an older version | Versions list → a version's Restore | restores inside `VersionsDialog` | the list stays a dialog of choices; its Restore closes it and asks `confirm()` | "Restore the version of {{date}}?" · "It replaces the draft. The published version stays until you publish." · Restore |
    | Remove a lesson from a course or level | row ⋯ Remove (`widgets/content-editor/ui/RowGroups.tsx` `remove`) | Undo only | asks + Undo | "Remove “{{title}}”?" · "It leaves this course. The lesson itself is kept." (level: "this level") · Remove |
    | Remove a course from a shelf (Manage courses) | row ⋯ Remove | Undo only (same `RowGroups`) | asks + Undo | "Remove “{{title}}”?" · "It leaves this shelf. The course itself is kept." · Remove |
    | Delete a take | take page ⋯ | asks (`DeleteTakeDialog.tsx`) | same | unchanged |
    | Keep bars (cuts a take) | take page Keep | own `AlertDialog` (`KeepBars.tsx`) | `confirm()` | "Keep bars {{first}}–{{last}}?" · "The other bars of this take are deleted. This can't be undone." · Keep |
    | Restore from a file | Storage › Restore from a file | own `AlertDialog` (`BackupFields.tsx`) | `confirm()` | unchanged words; button "Restore" |
    | Reset progress | Storage; a lesson's / course's Settings | asks | same | unchanged |
    | Sign out; Delete account (typed email) | Account | asks | same | unchanged |
    | Delete a pattern | pattern page | asks | same | unchanged |
    | Admin: delete a group, a switch, a report | Admin tabs | own `AlertDialog`s | `confirm()` | unchanged words |
    | Apply a card style to every folder | — | not built (B9, round 14) | asks when built | — |
    | Remove a song from a setlist | — | no setlists exist | — | — |

  - **Keyboard Delete in Songs' Select** (R17 "Easy triggers"): `pages/songs/ui/LibrarySelect.tsx` adds
    `useShortcuts(t('songs:select.shortcuts'), [{ label: t('songs:library.archive'), combo: 'Delete', run:
    archiveSelected }, { …, combo: 'Backspace', … }], { enabled: selected > 0 })`, opening the same Archive ask
    with the count.
  - Words: new keys in `learn.ts` `edit.order.removeTitle`, `removeBody.course`, `removeBody.level`,
    `removeBody.shelf`; `songs.ts` `public.unpublishTitle`, `unpublishBody`; `editor.ts` `take.keepTitle`,
    `keepBody`; `common.ts` `original.restoreTitle`, `restoreBody`. ru for each.
- **Not in this item:** the swipe's own look (ADR 0106); B9's card styles; a learner's "Archive" in a built-in
  folder (B3).
- **Done when:**
  - One test per act, three assertions each ("asks; Cancel changes nothing; <Act> does it"), named "asks before
    <act>":
    `pages/songs/ui/SongsPage.test.tsx` (archive one, archive many by Select, archive by the Delete key, archive a
    folder), `pages/song-archive/ui/SongArchivePage.test.tsx` (delete forever), `pages/piece/ui/SongSettingsPage.
    test.tsx` (reset, delete own), `features/publish/ui/PublishScreen.test.tsx` (unpublish),
    `features/edit-original/ui/DraftBar.test.tsx` (discard, publish, restore a version),
    `widgets/content-editor/ui/RowGroups.test.tsx` (remove a lesson; after confirming, Undo puts it back),
    `pages/score-editor/ui/TakePage.test.tsx` (keep bars, delete a take), `pages/settings/ui/StoragePage.test.tsx`
    (restore from a file, reset progress), `pages/settings/ui/AccountSettingsPage.test.tsx` (sign out, delete
    account), `pages/admin/ui/AdminPage.test.tsx` (delete a group).
  - New `src/app/one-dialog.test.ts` (source scan): "only ConfirmDialog, the welcome and the deletion gate import
    the alert-dialog primitive".
  - `.scratch/r29/audit.md` gets the table above as A9's rows.

### R18: Each setting lives in one place

- **Source:** R18 (prompt 178–193) as changed by Decided 20 (413–419): R18's "reached from the gear … and from a
  row in Settings" is replaced by "reached from its own gear only"; R9 (one place, not split across the toolbar,
  bar and menus).
- **Today:** a kind page is reached two ways (`/settings/<kind>` from Settings' rows and a gear), "Hear notes" is
  drawn on two pages, the Player's View menu writes settings that its Settings page draws too, Lesson reading's
  home is General.
- **Will build:** S0–S14 above. The R18 rule as the code will hold it, written into DESIGN.md "Settings pages" and
  `entities/settings/model/registry.ts`' doc: "A setting has one home. The app's Settings holds what every page
  shares. A kind of page (a lesson, Songs, the Player, the score editor, each Practice page) has its own Settings
  page at `<its path>/settings`, opened from the gear in its bar. Anywhere else, a link row."
- **Not in this item:** an item's own Settings (a song's, a lesson's): unchanged.
- **Done when:** S14's tests; `src/app/settings-pages.test.tsx` fails a key drawn on two pages, including the
  View menu (`player-view`) as a page.

### R28 and A19: A wide screen is filled

- **Source:** R28 (prompt 279–289), A19 (708–710), audit contradiction 2; owner-way "Fill the screen, calm the
  page".
- **Today (from the code; A19's shots at 1280/1440/1920 do not exist):**
  - Practice (`pages/practice/ui/PracticePage.tsx`): `grid items-start lg:grid-cols-2 xl:grid-cols-3` of three
    groups of 4, 2 and 3 rows: unequal columns.
  - Learn (`LearnPage.tsx:69`), Profile (`ProfilePage.tsx:64`), Activity, Public library, Course shelves: one
    `max-w-2xl` (672px) column, centred: at 1280 with the sidebar, about half the width empty.
  - Course (`max-w-3xl`), Chord finder, Admin (`max-w-3xl`), Metronome (`max-w-md…4xl` steps).
  - Songs (`widgets/song-library`): `grid-cards` rows; folders and loose songs in different shapes (B3 owns the
    folder cards).
- **Will build:** one rule (DESIGN.md "Layout", new paragraph "Wide screens (R28)") and its application:
  - **Rule:** from 64rem a page is (a) an even grid of same-height cards that reflows (`grid-cards`:
    `repeat(auto-fill, minmax(min(18rem,100%),1fr))`, `grid-auto-rows: 1fr`), (b) two panes, or (c) a reading
    column (a lesson's text, legal pages, a kind's Settings: `max-w-2xl`, centred: reading width is a type rule,
    not empty space). Never fixed columns of unequal lists.
  - **Practice** (`PracticePage.tsx`): the three groups become **full-width bands**, each a heading ("Theory",
    "Playing", "Training", today's `SettingsGroup` heading style) over a `grid-cards` grid whose cells are
    equal-height cards (`PageCard`, new in `widgets/practice-pages/ui/PageCard.tsx`: `function PageCard({ page,
    trailing }: { page: PracticePageId; trailing?: ReactNode }): ReactElement`, the tile, name, one line, the
    whole card a link, hover to its edges). On a phone (<48rem) the bands stay today's grouped list
    (`PageRow` in one `SettingsGroup` card). `RowGroup`'s inset (`card p-1.5`) is not used here.
  - **Learn**: Lessons' chapters and Courses' shelves as `grid-cards` of lesson/course cards from 64rem (the
    column `max-w-2xl` goes from `LearnPage.tsx` and `CourseShelves.tsx`); Continue spans the first row.
  - **Profile** (`ProfilePage.tsx`): from 64rem two panes: the hero and figures (left, 22rem), the record,
    badges and Activity row (right). Activity: the month's calendar and the figures side by side.
  - **Public library**: `grid-cards` of song cards from 64rem (its list becomes cards; B3 later moves it into
    Songs' Explore).
  - **Course**: header and facts left pane, its lessons right pane from 64rem.
  - **Admin**: `max-w-3xl` goes; its tables take the width.
  - **Chord finder, Metronome**: stay centred tools (a tool's face is not a list), unchanged.
  - **Search results**: the palette is a list; `/search` is a link only. No change.
  - **Songs**: unchanged here (B3, round 7: Explore in the bar, folders and loose songs one card, "Not in a
    folder" heading).
- **Not in this item:** the Player and editor (full-screen, own layout); Songs (B3).
- **Done when:**
  - `src/pages/practice/ui/PracticePage.test.tsx`: "lays its pages out as three bands of cards on a laptop"
    (with `stubMatchMedia` at 1280: three `section`s each with a heading and a `grid-cards` list) and "keeps one
    grouped list on a phone".
  - A Playwright check in `e2e/places.spec.ts`: "no place leaves half its width empty at 1280" (for `/`,
    `/practice`, `/profile`, `/songs/public`: the main content's width ≥ 80% of `main`'s).
  - Screenshots of every place and its pages at 1280×800, 1440×900, 1920×1080: `shots/after/wide-<place>-
    <width>.png` (Learn both views, a course, Songs, a song, Practice, each Practice page, Profile, Activity,
    Settings, Admin), listed in the round's report.

---

## A: Part A items 2–19 and 38 (open or partial)

### A2: One app bar, one height

- **Source:** A2 (prompt 529–533), R1 (123–126: one row, compact, titles never cut, actions in it, nothing
  under it); owner-way "Titles are never cut … wraps to two lines"; audit "claimed done but not".
- **Today:** `shared/ui/ScreenHeader.tsx`: a `min-h-14` row (Back, `h1` with `line-clamp-2`, actions) and the
  page's `tabs` as a second row (`NavTabs`, a scrolling `tab-strip`) on Learn (Lessons · Courses), Scales and
  keys (Notes · Harmony · Key), Progressions (Progression · Library · Passing chords), Accompaniment (one tab per
  source, up to 7), Admin (9). A two-line title makes the row taller (up to ~70px), so the height changes from
  screen to screen.
- **Will build:**
  - **One height:** the bar's row is exactly 56px (`h-14`, was `min-h-14`) on every screen; nothing is drawn
    under it (no second row). 38 screens use `ScreenHeader`; none passes a second row after this.
  - **The title never cut, never taller:** one line at its size (place 24px `text-2xl`, other screens 20px
    `text-xl`, Literata 600). If it does not fit one line, it sets in two lines at 16px/20px leading (40px,
    inside the 56px row), still no ellipsis. Measured by new `useTitleLines(ref: RefObject<HTMLElement>): 1 | 2`
    in `src/shared/ui/use-title-lines.ts` (a `ResizeObserver` comparing `scrollHeight` to one line at the large
    size); `ScreenHeader` sets `data-lines="2"` and the two-line classes. A third line is impossible: at 16px
    over the width left at 320 the longest title in the catalogue (a song's) fits two lines; past that it
    breaks words (`wrap-break-word`), never clips.
  - **Views in the bar row** (A2: "the screen's tabs or segmented switch"): new component
    `src/shared/ui/BarViews.tsx`:
    `function BarViews<V extends string>({ label, views, current, to }: { label: string; views: readonly {
    value: V; label: string }[]; current: V; to: (view: V) => { to: string; search: Record<string, unknown> }
    }): ReactElement`. Each view is a link with `replace` (R26) and `aria-current="page"` on the current one.
    - 2–3 views: a **segmented control** (`Segmented`'s look, the one selected style R15), in the row between
      the title and the actions. Learn: **Lessons · Courses**; Scales and keys: **Notes · Harmony · Key**;
      Progressions: **Progression · Library · Passing chords**; Songs (B3, round 7): **My songs · Explore**.
    - 4 or more: a **menu** (`Dropdown`, its face the current view's name with ⌃⌄, R23), same place:
      Accompaniment's sources ("Bobrova ⌃⌄"), Admin's nine views ("Overview ⌃⌄").
    - Phone (<40rem) where back + title + views + actions do not fit (measured as for the title): the views
      keep their place and the title becomes visually hidden (`sr-only`, still the page's `h1`), as iOS bars
      that carry a segmented control. Learn fits at 320 (title "Learn" + Lessons · Courses + Search), so it keeps
      its title; Scales and keys and Progressions show the views alone on a phone held upright.
  - `ScreenHeader` props: `tabs` is renamed `views` and is drawn in the row. `NavTabs`/`NavTab`
    (`shared/ui/NavTabs.tsx`) and the `tab-strip` utility in `theme.css` are deleted; the five callers
    (`LearnPage`, `ScalesPage` → `ScaleTabs`, `ProgressionsPage` → `ProgressionsTabs`, `AccompanimentPage` →
    `AccompanimentTabs`, `AdminPage`) pass `BarViews`.
  - The bar's slide-away on scroll (0a9069b4) and the hairline stay.
  - DESIGN.md "Navigation and the screen's bar": "a page's tabs its second row" and "wrapping to a second line
    rather than being cut" are replaced by the two rules above.
- **Not in this item:** Songs' My songs · Explore (B3, round 7, uses `BarViews`); a large title collapsing on
  scroll (A2 "may": with one fixed row there is nothing to collapse; not built).
- **Done when:**
  - `src/shared/ui/ScreenHeader.test.tsx` (new): "is one row, with its views in it" (the `header` has one child
    row; `h-14`; the views' links inside it); "sets a long title in two smaller lines, never cut" (stubbed
    `scrollHeight` → `data-lines="2"`, no `truncate`/`line-clamp-1` class); "hides the title, not the views,
    where both do not fit on a phone" (`h1` has `sr-only`, still the heading).
  - `src/shared/ui/BarViews.test.tsx`: "is a segmented control of links for three views, the current one
    marked"; "is a menu for four views or more"; "switching replaces the history entry".
  - `src/app/one-bar.test.ts` (source scan): "no module imports NavTabs" and "no ScreenHeader is given `tabs`".
  - Screenshots: Learn, Scales and keys, Progressions, Accompaniment, a song with a long title (Fantaisie-
    Impromptu's full name), Admin at 390×844, 844×390, 1280×800: the bar the same height in each.
- **Owner's question:** on a phone, Scales and keys and Progressions show their three views in the bar with the
  title hidden (the scale's name is on the page under it). The alternative is a views menu ("Notes ⌃⌄") beside
  the visible title. Default: the segmented control, title hidden.

### A3: One rule for actions

- **Source:** A3 (prompt 534–537), R1 ("The screen's actions (Settings, Edit, Share) live in it"), R5, R16;
  owner-way "A screen's own actions go in its bar … The floating + is only for creating"; audit contradiction 7.
- **Today:** DESIGN.md "Placement": "the bar holds Back, the title and at most two round actions; More holds
  the rest"; "Floating: … each its icon alone unless the learner asks for names". No rule for where Edit,
  Settings and Done sit; each screen orders its own `actions` (`PieceView`: gear, pencil; `LessonLayout`:
  Learned, gear, mode; `CoursePage`: gear, pencil).
- **Will build:**
  - **The rule** (DESIGN.md "Placement", replacing its bar and floating bullets; same on phone and laptop):

    | What | Where | Look |
    |---|---|---|
    | Back | the bar's start | ‹ round (`BackButton`); none on a place |
    | Title, views | after Back | A2 |
    | Screen tools (Search on a place, MIDI in the Player) | the bar's end, first | round icon, tooltip |
    | **Settings** | the bar's end, after the tools | gear, round (`SettingsGear`, S0) |
    | **More** (⋯) | after Settings | round; commands only (R3); destructive last, red |
    | **Edit ⇄ Done** | the bar's very end | pencil, round; in Edit the same place holds **Done**, a labelled honey button (`EditToggle`) |
    | **Primary action** (Play, Practise, Start, New, Add to my library) | the floating capsule, centred at the foot | honey pill, icon + label (R5) |
    | Second actions (at most two) | the same capsule, before the primary | round icons, tooltip |
    | An act on the item (Learned, ♡) | on the item's card (a song's overview card); where a page has no card (a lesson), in the bar before Settings | toggle button (A11) |
    | Destructive acts | never in the bar or the capsule: the item's Settings' last group, or last in ⋯ | red (R25) |
    | Sheets | title at the top, the one act pinned at the foot ("Create"), close ✕ at the top's end | `NewSheet` |
    | Dialogs | Cancel then the act, right-aligned (stacked on a phone, act on top) | `ConfirmDialog` |

    Why (written beside it): iOS puts the screen's own commands at the bar's trailing end with Done last, and
    the main act in the thumb's reach; Flat and Noji put Settings and Edit in the bar; the primary is never
    an icon alone ("Add to my library" must be read).
  - **Enforced by `ScreenHeader`**, not by each page: its `actions` prop is replaced by named slots,
    `{ tools?: ReactNode; settings?: ReactNode; more?: ReactNode; edit?: ReactNode }`, drawn in that order. A
    page cannot put the pencil before the gear. Item acts in the bar (a lesson's Learned) pass as `tools`.
  - **Applied** to every `ScreenHeader` caller (38 files: `grep -rl "<ScreenHeader" src`): each `actions`
    fragment split into the slots. Known moves: `LessonLayout` (Learned → tools, gear → settings, mode → edit);
    `CoursePage`, `PieceView` (gear → settings, pencil → edit); the Player's bar (`PlayerLayout.tsx`, MIDI →
    tools, gear → settings, View/Setup/More → more, the pencil → edit).
  - **Primary labelled**: R5's capsule (`FloatingBarMain`). "Add to my library" on a public or shared song is
    the main pill (`PublicSongPage.tsx`, `SharedSongPage.tsx`), "Practise" the second.
- **Not in this item:** the toolbars' customisation (B10); the editor's palette (round 4).
- **Done when:**
  - `src/shared/ui/ScreenHeader.test.tsx`: "draws tools, Settings, More and Edit in that order, whatever order
    they are given".
  - `src/app/one-bar.test.ts`: "no ScreenHeader is given `actions`" (the prop no longer exists: `tsc` fails it
    too).
  - `pages/public-library/ui/PublicSongPage.test.tsx`: "Add to my library is a labelled button" (role button,
    name "Add to my library", visible text).
  - Screenshots: a song, a lesson, a course, the Player at 390×844 and 1280×800 with the same order at the bar's
    end.

### A4: Page, sheet or menu, and every place that breaks it

- **Source:** A4 (prompt 538–545); audit: rule written, no audit rows.
- **Today:** DESIGN.md "Placement" holds the rule ("a page for settings and anything with many fields; a sheet for
  creating one thing or one focused choice; a menu for one-tap commands … a menu never holds a setting"). No
  audit row lists the places that break it.
- **Will build:**
  - The rule stays as written, with one sentence added: "A popover is a sheet on a laptop: the same rule."
  - Every sheet, popover and menu checked (34 files that open one, `grep -rl "<Sheet\b\|<Popover\b\|ActionMenu"
    src`). Rows added to `.scratch/r29/audit.md` under A4, and the breaks fixed here:

    | Where | Kind | Holds | Verdict | Fix |
    |---|---|---|---|---|
    | The Player's View (`widgets/score-view-menu/ui/ScoreViewMenu.tsx`, `pages/player/ui/PlayerViewMenu.tsx`) | popover | what is shown now, plus "Show this when opening a song" (a setting) | breaks: a setting in a popover of view choices | the switch moves to the Player's Settings (S9) |
    | The editor's Sound (`pages/score-editor/ui/RecordingSettings.tsx`) | popover from the transport | two link rows to settings pages | breaks: a second way to the gear's pages (R5 "never the same action twice") | removed with its transport button; the editor's gear (S10) is the one way |
    | The Player's and an exercise's Setup (`widgets/player-setup/ui/PlayerSetup.tsx`, `pages/player/ui/ExerciseSetup.tsx`) | sheet with pages | this music's choices (pattern, figure, tempo ladder, hands, swing): up to eight fields | borderline: many fields, but all "this play, now" | kept as a sheet; logged for B8 (round 11, the Player's practice flow) to decide |
    | Song information (`pages/player/ui/SongInfo.tsx`) | sheet | facts, no fields | fits (Chordify's) | none |
    | Filters (`pages/songs/ui/FilterSheet.tsx`) | sheet/popover | one focused choice (what is listed) | fits | none |
    | Export…, Import, Move to…, New … (seven) | sheets | one act each | fit | none |
    | Takes (`TakesSheet.tsx`) | sheet | a list of takes, each opening its page | fits | none |
    | Shortcuts (`features/shortcuts-help`) | sheet | reference | fits | none |
    | Tempo, Hands (`widgets/practice-player/ui/TempoButton.tsx`, `HandsButton.tsx`) | popovers | one focused choice | fit | none |
    | Transpose (`widgets/transpose`) | popover | one focused choice | fits | round 4 rebuilds it (Decided 20) |
    | Every ⋯ (`ActionMenu`) | menu | commands; checked items only for an item's own state (a draft's language, a section's kind) | fits | none |
    | Publish in library (`features/publish/ui/PublishScreen.tsx`) | page | many fields | fits | none |
    | MIDI (`features/connect-midi/ui/MidiButton.tsx`) | popover | the device's state and a link to Connect a piano | fits | none |

  - Removing the editor's Sound: `RecordingSettings.tsx` deleted; its two call sites go (`pages/score-editor/ui/
    EditorDock.tsx:47`, the dock's last button, and `RecordingStrip.tsx:34`, the recording strip's); `editor.ts`
    keys `sound.*` that only it used go (en, ru). While a take records, the bar's gear stays reachable (the
    strip does not cover the bar).
- **Not in this item:** the Setup sheet's future (B8).
- **Done when:** `audit.md` has the A4 rows above; `pages/score-editor/ui/ScoreEditorPage.test.tsx`: "the
  transport has no Sound button" (no button named "Sound"); `PlayerViewMenu` test from S9.

### A5: The right control for each choice (key pickers; Transpose excluded)

- **Source:** A5 (prompt 546–678) without "Transpose" (Decided 20, prompt 409–411: no circle for Transpose; it is
  round 4's); audit contradiction 3; owner-way "one key picker".
- **Today:** the rule is in DESIGN.md "Choices" and ADR 0061; `PitchPicker`, `NotePicker`, `KeyPicker` (circle,
  "Select: …"), `KeyCircle` (in place on the Key tab), `KeysChecklist`, `MenuPicker`, `PickerRow` exist
  (`shared/ui/pickers`). Gaps: the score editor's key (`pages/score-editor/ui/KeyPicker.tsx`, used by the palette
  `ScoreKeys.tsx`, the printed signature's `KeyPopover.tsx` and the score's Settings) and New song's key
  (`pages/songs/ui/NewSongSheet.tsx:45`) use `KeySignaturePicker` (a grid of signs); the circle's wedges show a
  count ("2♯"), not the signature; Start on is a `MenuPicker`; no list of every picker exists.
- **Will build:**
  - **The editor's key is the circle.** `pages/score-editor/ui/KeyPicker.tsx` keeps its signature `KeyPicker({
    bar }: { bar?: number })` and its behaviour (a section after the first changes key from there; the switch
    "Change the key for the whole song" stays), but draws `KeyCircle` with the shared `KeyPicker`'s "Select: E♭
    major" button instead of `KeySignaturePicker`. Majors outside, relative minors inside; the song's mode decides
    which ring is chosen. The palette's Key, the printed key signature's popover and the score's Settings › Music ›
    Key all open it (one component). The "Switch to natural" button goes: C major / A minor is a wedge.
  - **New song's key** (`NewSongSheet.tsx`): the same `KeyPicker` as a row "Key: C major ⌃⌄" in its Fine-tune step
    (one key control in the app, A1).
  - `shared/ui/pickers/KeySignaturePicker.tsx` is deleted (no user left); ADR 0114's key-picker paragraph is
    amended (the circle, "per A5").
  - **Wedges draw their signature.** `KeyCircle` (`shared/ui/pickers/KeyCircle.tsx`): each outer (major) wedge
    shows its name over its signature drawn as accidental glyphs in a row (Noto Music, 9px at 320, 11px from
    40rem: "♯♯♯" for A major, "♭♭" for B♭), not a count; the inner (minor) wedges show the name alone (they share
    the major's signature, drawn once beside them). C / Am wedges show no sign. The split wedges (B / C♭, F♯ / G♭,
    C♯ / D♭) draw each half's own signature. A screen reader's name stays "A major, 3 sharps".
  - **Start on** (the Scales page's run and the exercise setup's scale run, `widgets/scale-explorer/ui/RunView.
    tsx`, `pages/player/ui/ScalePracticeFields.tsx`): `PitchPicker` (unsplit, only the pitch matters, A5) with a
    new optional prop `only?: readonly PitchClass[]`: the cells of the scale's notes alone, in octave order, the
    others not drawn (R30). Signature `PitchPicker({ value, onChange, label, only }: { value: PitchClass;
    onChange: (pitch: PitchClass) => void; label?: string; only?: readonly PitchClass[] })`.
  - **Tempo is a stepper** where it is a number to set (DESIGN.md: "a number → a stepper"): Scales' `TempoSlider`
    (`widgets/scale-explorer/ui/TempoSlider.tsx`) and the exercise setup's slider (`ScalePracticeFields.tsx:76`)
    become `Stepper` "Tempo − 80 +" (♩ = 40–240, step 4, held to repeat, the value typed on tap). The Metronome
    keeps ± with its slider (its face is the tempo). The Player's speed popover (`TempoButton.tsx`) is round 4's
    (B8).
  - **The list of every picker** goes into `.scratch/r29/audit.md` under A5 (and DESIGN.md "Choices" gets a
    one-line table pointer):

    | Choice | Where | Control | Verdict |
    |---|---|---|---|
    | Root (Chords) | `ChordBuilder.tsx` | `NotePicker` (split) | fits |
    | Root (Scales) | `ScaleChoice.tsx` | `NotePicker` | fits |
    | Root (Intervals) | `IntervalExplorer.tsx` | `PitchPicker` | fits |
    | Melody note (Key tab) | `KeyHarmonise.tsx` | `PitchPicker` | fits |
    | Start on | `RunView.tsx`, `ScalePracticeFields.tsx` | `MenuPicker` | → `PitchPicker only` (above) |
    | Key (Progressions, Chord finder, walks, lesson examples) | `ProgressionExplorer.tsx`, `ChordFinderPage.tsx`, `ProgressionSetup.tsx`, `WalkSetup.tsx`, `ExampleFields.tsx` | `KeyPicker` | fits |
    | Key (Key tab) | `CircleOfFifths.tsx` | `KeyCircle` in place | fits |
    | Key (the editor, New song) | above | `KeySignaturePicker` | → `KeyPicker` (above) |
    | Keys (Quiz, Exercises) | `KeysChecklist` | checklist sheet | fits |
    | Quality, Voicing, Scale kind | `ChordBuilder.tsx`, `VoicingField.tsx`, `ScaleChoice.tsx` | `MenuPicker` | fits |
    | Inversion | `InversionChoice` | segmented of stacks | fits |
    | Tempo | Metronome; Scales; exercise setup; New song; score Settings | slider+±; slider; slider; `Stepper`; `Stepper` | Scales, exercise → `Stepper` |
    | Time signature | `TimePicker.tsx` (wheels), New song's tiles | wheels / tiles | fits (Flat's) |
    | Clef | `ClefPicker.tsx` | picture tiles | fits |
    | Instruments | `widgets/instrument-list` | − n + per instrument | fits |
    | Level (Learn) | `JourneyLibrary.tsx` `ChoiceChips` | chips | fits (a filter of the library) |
    | Pattern's key (Accompaniment) | the pattern plays over a progression; its key is `ProgressionSetup`'s `KeyPicker` | `KeyPicker` | fits; no second key control on Accompaniment |

- **Not in this item:** Transpose (round 4, Decided 20); the Key tab's content (round 2, A43); what each explorer
  shows after a choice (round 2, A20–A22).
- **Done when:**
  - `src/shared/ui/pickers/pickers.test.tsx`: "the circle draws A major's three sharps in its wedge, not a
    count" (the wedge's text holds "♯♯♯"); "PitchPicker with only shows those cells alone".
  - `pages/score-editor/ui/ScoreEditorPage.test.tsx`: "the key opens the circle, and Select: E♭ major writes
    three flats" (the draft's key becomes E♭ major).
  - `pages/songs/ui/NewSongSheet` test (in `SongsPage.test.tsx`): "New song's key is chosen on the circle".
  - `src/app/one-key-picker.test.ts` (source scan): "nothing imports KeySignaturePicker".
  - `widgets/scale-explorer` test: "Tempo is a stepper" (role spinbutton or buttons "Slower"/"Faster" around
    the value).
  - Screenshots: the editor's key popover, New song's Fine-tune, Scales' Start on at 390×844 and 1280×800.
- **Owner's question:** New song's key moves from the sign grid (Flat's new-score sheet has a sign grid) to the
  circle, so the app has one key picker. Default: the circle.

