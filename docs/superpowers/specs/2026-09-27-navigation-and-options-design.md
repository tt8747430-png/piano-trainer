# Sub-project 2: navigation and options

- **Status:** decided 2026-09-27 by the building session, on the owner's standing instruction ("make the best
  decisions and continue"; "no legacy leftovers, no workarounds, no backwards compatibility"). Builds sub-project 2 of
  the roadmap (`2026-09-25-next-features-roadmap-design.md` §2, §3.2, §3.8, §3.9, §11.1, §13).
- **Builds on:** the app as built through sub-project 1 and ADR 0011 (`DESIGN.md`, `CLAUDE.md`, ADRs 0009–0011).
- **Research first:** Apple's Human Interface Guidelines, read from Apple's own pages on 2026-09-27 (§2). The roadmap
  asked for it before this spec.

## 1. What this delivers

1. **Four places:** Path · Songs · Learn · Practice, in the docked bar and the laptop's sidebar. Theory goes.
2. **Learn** (`/learn`): the first lesson (the chord-symbol reading notes, now a lesson whose examples play) and the
   references Chords and Scales (the explorers, moved). Symbols goes; its dictionary becomes the Chords reference's
   *Written* line.
3. **Practice** (`/practice`): the Theory quiz and My gaps (moved), and the **Studies** and **Progressions** that leave
   Songs (roadmap §3.9). Songs holds songs.
4. **Choices** become pop-up buttons (dropdowns) and segmented controls. No row of chips is left in the app.
5. **The Scales reference's two views,** *Scale* and *Chords*: in Chords each degree's key carries its numeral over
   its chord and plays the chord; **Keys play: Chords · Notes**, where a note lights the key's chords that hold it.
6. **The keyboard** learns what a key plays (a degree's chord), and a key's second label line (the numeral).
7. **Every page earns its place** goes into CODE_STYLE §1.

Not here (their sub-projects): 9ths to 13ths, inversions and *Start on* in the scale's chords, church modes, key pages
and the key's chords practised in the Player (4); lesson filters, more lessons, Intervals, Tensions and the tools (5);
the Path's own pages (6); exercises and trainers (7). The Player's layout is sub-project 3's; here only its Setup
sheet's row of key chips becomes a pop-up.

## 2. What Apple's guidelines say, and what each changes

Read from `developer.apple.com/design/human-interface-guidelines/<slug>` (DocC JSON) on 2026-09-27.

| Rule (page)                                                                                                     | Here                                                                                              |
| --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| A tab bar navigates top-level sections only, single-word labels, always visible, never an action (`tab-bars`)   | Path · Songs · Learn · Practice; Settings stays an action in Path's header                          |
| Keep tabs few, five or fewer; a sidebar on wide screens with the same places (`tab-bars`, `sidebars`, `layout`) | Four, the same four in the sidebar from 1024px                                                      |
| A segmented control: 2–5 closely related choices on iPhone, equal widths, noun labels, text only; it may switch closely related subviews, never app sections (`segmented-controls`) | Inversion, Hands, Fingers, Triads · 7ths, Keys play, and the Scales reference's Scale · Chords views; Theory's tab track goes |
| Prefer a segmented control when every choice fits: one tap, all shown (`tab-views`)                              | A choice of five or fewer short nouns stays a segmented control                                     |
| A pop-up button: one of many mutually exclusive values, shows the current value, predictable from its label (`pop-up-buttons`) | Root, Chord, Scale, Rhythm, Collection, Level, the Player's key: a pop-up button with its label and value |
| Menus: group with separators and headers, the item in effect checked (`menus`)                                   | The Chord pop-up groups its 33 chords under the five family names; the chosen item carries a check  |
| Very long sets are lists, not menus (`pickers`, `lists-and-tables`)                                              | Studies and progressions are lists on Practice, not a pop-up                                        |
| A row that drills in has a disclosure chevron (`lists-and-tables`)                                               | Learn's and Practice's rows (`RowLink`) end in a chevron                                            |
| Popovers are for wide views; on a phone use a sheet (`popovers`)                                                 | New choices never open a popover. The keyboard settings keep theirs (roadmap §3.1), recorded as the one exception: it sits beside the keys and must not cover them, so each change is seen live |
| One sheet or popover at a time (`sheets`, `popovers`)                                                            | Kept: no sheet opens a sheet                                                                        |
| Back is a chevron symbol, never the word "Back"; a short title (`toolbars`)                                      | A Learn or Practice screen below the top level has a back RoundButton (icon, labelled) and a short title |
| 44 × 44 targets; spacing matters as much as size (`buttons`, `accessibility`)                                    | Every pop-up trigger and item is 44px; rows 64px                                                     |
| Never colour alone (`accessibility`)                                                                             | Chords that hold a note are outlined on the keys and in the list, and named in a line of text       |

## 3. Navigation

- **The four places** (`widgets/app-nav`): Path (`Route`), Songs (`Music`), Learn (`BookOpen`), Practice
  (`Metronome`). Monochrome, as now. Russian: Путь · Песни · Обучение · Практика. The phone's bar fits four at 360px.
- **Routes** (`app/router.tsx`):

| Route                                 | Screen                                                                  | Chunk      |
| ------------------------------------- | ----------------------------------------------------------------------- | ---------- |
| `/`, `/settings`                      | Path, Settings (unchanged)                                              | home       |
| `/songs`, `/songs/$pieceId`           | Songs; a song's or listing's page                                       | songs      |
| `/learn`                              | **Learn**: Lessons, References                                          | learn      |
| `/learn/chords`, `/learn/scales`      | The Chords and Scales references (the explorers), each with a back button | learn    |
| `/learn/lessons/$lessonId`            | **A lesson**                                                            | learn      |
| `/practice`                           | **Practice**: Theory quiz, Studies, Progressions                        | practice   |
| `/practice/quiz/$quiz`                | One Theory quiz (`build-chord`, `name-chord`, `build-scale`, `gaps`)    | practice   |
| `/practice/studies/$pieceId`          | A study's page                                                          | songs      |
| `/practice/progressions/$pieceId`     | A progression's page                                                    | songs      |
| `/play/$pieceId`, `/check`            | Player, Check (full screen, unchanged)                                  | player, practice |

- A route that names something checks it in `beforeLoad` and throws `notFound()`: an unknown lesson or quiz, a piece on
  the wrong shelf (a study under `/songs/`, a song under `/practice/studies/`).
- **No redirects** from `/theory/*`: the owner asked for no backwards compatibility. An old link shows the not-found
  screen, which keeps the navigation. Saved data is untouched: no store changes shape.
- The quiz is chosen on Practice, so it is a path segment, not a search param; the quiz page has no mode switch.
- **Where a piece lives** is its kind: a song or listing on Songs, a study or progression on Practice. One helper says
  so (`pieceLinkOptions(entry)` in `entities/piece`), and one component links there (`PieceLink`), used by Songs'
  and Practice's rows, the Path's step rows, and as the fallback of a piece page's Back and the Player's Close.
- `TheoryLayout` and `widgets/theory-nav` go. Each Learn and Practice screen draws its own `ScreenHeader`; below the
  top level it has a back `RoundButton` (`useGoBack` to `/learn` or `/practice`).

## 4. Learn

- **The page:** `ScreenHeader` "Learn", then two grouped lists. **Lessons:** "Reading chord symbols" (detail: its
  level and category, "Beginner · Chords"). **References:** Chords, Scales. Each row is a `RowLink`: a 48px tile in
  its paint's wash with the deep icon (Chords sand with `KeyboardMusic`, Scales sky with
  `ChartNoAxesColumnIncreasing`, as on the Path; a lesson grass with `BookOpenText`), a title, an optional detail, a
  chevron. From 1024px the two lists sit in two columns.
- **Chords reference** (`/learn/chords`, the explorer): the chord in Literata and its name; **Root** and **Chord**
  pop-ups side by side (the Chord pop-up grouped by family, each item its name with the symbol's suffix after it, e.g.
  "Minor 7th · m7"); Inversion and Hands segmented; the keyboard; the tones; Play and Arpeggio; then **Written**: every
  way the symbol is written on this root (`qualitySpellings`: "Cm7 · Cmin7 · C−7"), which was Symbols' dictionary.
  The family pop-up and the three chip rows go.
- **Scales reference** (`/learn/scales`): §6.
- **The lesson:** §5.
- A Path step still opens its reference with `?step=` and the step panel (check yourself, learned).

## 5. The first lesson, and lessons as content

The reading notes become content, as the roadmap's lessons are (§3.4, §4.2): `entities/lesson`.

- **Model** (`model/types.ts`): a `Lesson` has an `id`, a `title` and a `summary` (`LocalText`), a `level` (the
  Path's `Level`, 1–4, so a lesson and a step say "Beginner" alike) and a `category`
  (`chords | scales | theory | accompaniment | jazz | gospel`, roadmap §3.4), and `sections`, each a `heading` and
  `blocks`. A block is one of: `text` (a `LocalText`, with an optional bold `lead`), `steps` (a numbered list),
  `note` (a callout the learner reads: roadmap §4.5's "note") and `chords` (chord symbols that play, parsed by the
  kernel). Sub-project 5 adds blocks (a scale, a staff, a progression); nothing here is a stand-in for them.
- **Content** (`content/reading-chord-symbols.ts`): the three parts of the notes (reading chord symbols; chord
  numbers; naming any chord in seven steps) with their English and Russian, moved from the `theory` namespace, and
  chord examples where the text names chords (`C Cm C° C+`, `C7 CMaj7 Cm(maj7)`, `C6 Cm6`, `Csus2 Csus4`, `C/D`,
  `C7♭9#5`; `C2 Cadd9 C6`, `C9`, `C13`; and `Dm7 F6/D`). A catalog test holds every `LocalText` to both languages
  and every example to the chord parser.
- **The page** (`/learn/lessons/$lessonId`, `pages/lesson` over `widgets/lesson-view`): a back button, the title,
  the summary, then the sections. The keyboard is pinned at the top (as on the references). A chord example is a
  button showing its symbol: a tap plays it (`usePlayback`, so a second tap stops it) and marks its tones on the keys
  by role and degree; the last one tapped stays marked. Notes are a card on sand.
- CODE_STYLE §10's one exception ("Theory → Symbols' reading notes") becomes **lessons**: a lesson teaches music, never
  a button.

## 6. The Scales reference: Scale and Chords

- **Controls:** the scale's name in Literata; **Root** and **Scale** pop-ups; a segmented control **Scale · Chords**
  (aria "Show") when the scale has seven notes; the keyboard.
- **Scale view** (as today): the degrees on the keys, **Fingers** None · RH · LH, the fingering table, the practice
  card (Rhythm pop-up, Tempo slider, Hands segmented, Play up and down), the facts.
- **Chords view:**
  - Each degree's key (the seven of the marked octave) carries its **numeral over its chord** (`ii` over `Dm`): the
    mark's label is the chord symbol and its new **caption** the numeral. The tonic's key keeps the tonic's colour,
    the others the scale's. The keyboard's range narrows to that octave, so a chord's name fits on its key.
  - **Triads · 7ths** and **Keys play: Chords · Notes**, two segmented controls.
  - **Keys play Chords** (default): a tap, a typed key or a Glissando onto a degree's key sounds its chord, stacked
    from that key, and puts the chord's keys down while the hand holds it (for at least the shortest press). Any
    other key plays its own note. A MIDI key is the MIDI keyboard's own note, as everywhere.
  - **Keys play Notes:** every key sounds alone; the last key a hand played (a tap, a typed key or a MIDI key going
    down) is **the note**, and the key's chords that hold it are outlined, on their keys (the deep-sky ring inside)
    and in the list, and named in a line: "E is in C, Em and Am" or "No chord of C major holds C♯". Changing the
    root, the scale, the size or Keys play clears the note.
  - **The list:** the seven chords, each a button with its symbol over its numeral; a tap plays it from its degree's
    key (the same keys as the key's tap) and it is pressed while it sounds.
- **The URL** (`ScaleView`, `app/routes/search.ts`): `show` (`scale` | `chords`, default `scale`) and `keysPlay`
  (`chords` | `notes`, default `chords`) join `root`, `kind`, `fingers`, `rhythm`, `tempo`, `hands` and `chords`
  (3 | 4). A scale without seven notes reads `show` as `scale`.
- **The kernel** (`shared/lib/music`): `scaleHasChords(kind)` (seven notes); `placeScaleChords(root, kind, size)`
  (each degree's `roman`, `chord`, its key from `placeScale` and the chord's tones stacked from that key);
  `chordHolds(chord, pitchClass)`. The reharmonisation table (roadmap §10.3) is the oracle for the chords that hold a
  note, within a key.
- **Pure view logic** in `widgets/scale-explorer/model`: the marks for each view, what a key plays in Chords view, and
  the keys that hold the note, each tested without React.

## 7. Practice

- **The page:** `ScreenHeader` "Practice"; **Theory quiz**: four `RowLink`s (Build chord, Name chord, Build scale, My
  gaps; My gaps' detail "Gaps: 3" when it has any); **Studies** and **Progressions**: the pieces as the Songs list
  draws them (`PieceList`), each row linking to its page on Practice. From 1024px: the quiz beside the two lists.
- **A quiz** (`/practice/quiz/$quiz`): a back button and the quiz's name as the title; the board, the stats and the
  choice sheet as today; My gaps with none offers the Build chord quiz.
- **Songs** (`/songs`) lists the three song collections only («Боже, спасибо», Called to Play, Hymns). Its filters
  are two pop-ups side by side: **Collection** (All and the three) and **Level** (Any and the levels its songs are on).
  A stale `?collection=studies` falls back to All.
- The Path keeps its study and progression steps; they open on Practice.

## 8. Choosing: the kit

- **`Dropdown`** (`shared/ui`, over shadcn's `select`, Base UI, added with the CLI): the pop-up button. Its trigger
  is a 44px control in the control line, card paper, 12px corners: the label in soft ink, the current value in ink
  (Onest 600), and an up-down chevron. The popup is a popover surface (the popover shadow and ring) of 44px items,
  the chosen one checked; groups have their name as a header and a hairline between them. Same API as `Segmented`
  (`label`, `value`, `options`, `onChange`), with `groups` in place of `options` for a grouped list; an option may
  carry a `detail` shown after it in soft ink.
- **`Segmented`** as now, for five or fewer short nouns.
- **`RowLink`** (`shared/ui`): a list row that leads somewhere: a tinted tile (a `Paint` from the kit's `PAINT` map,
  which `STEP_PAINT` now names too), a title, an optional detail, a chevron; it renders the router's `Link` passed as
  `render`, as `ButtonLink` does.
- **`ChipRow` goes**, with the toggle's `chip` variant. What is chosen stays neutral: an item checked in umber
  (`text-selected`, as the Setup sheet's lists already check theirs), a card-paper segment.
- **The rule** (CODE_STYLE §1 and DESIGN.md): a choice of five or fewer short nouns is a segmented control; more, or
  longer labels, a pop-up button showing its label and value; on or off a switch; settings changed less often a sheet;
  a popover only beside the keys.

## 9. The keyboard

- **What a key plays** (`LiveKeyboard`'s and `PianoKeyboard`'s `keyPlays`, default the key alone): a hand's key
  (finger, typed key, Glissando) sounds those keys at once and puts them down while it holds the key. The sound is
  `useSoundKeys()` (was `useSoundKey()`), a hand's play of any number of keys; `keySounds(keys)` in `schedule` (was
  `keySound(key)`).
- **A mark's caption:** `KeyMark.caption`, a second, smaller line above its label, drawn on the key.
- **Outlined** keys already exist (the deep-sky ring inside a key); Notes view uses them.
- **`ExplorerKeyboard`** passes `keyPlays`, `outlined` and `onKeyPress` through, and takes an optional `range` (the
  keys that fill the width at Fit), by default the middle octaves grown to hold its keys.
- **MIDI:** `useMidiKeyDown(onKey)` (`features/connect-midi`) calls back for each key going down on the MIDI keyboard;
  Notes view listens with it.

## 10. Words and strings

- **i18n:** the `theory` namespace splits into **`music`** (the vocabulary every screen shares: families, qualities,
  scale kinds and names, gaps, inversions) and **`learn`** (Learn's screens: the page, the references, the lesson's
  controls). A new **`practice`** namespace holds Practice's page. `common.nav` gains `learn` and `practice` and loses
  `theory`. Russian is typed against English, as ever.
- **Glossary:** **Learn** and **Practice** (places), **Reference** (a Learn page to look things up: Chords, Scales),
  **Lesson** (a Learn page that teaches music, with examples that play), **Chords view** / **Scale view**, **Keys play**,
  **Holds** (a chord holds a note when the note is one of its tones), **Pop-up button** (the UI; `Dropdown` in code).
  **Explorer** is "a reference that places any chord or scale on the keys", no longer "Theory → …". **Theory quiz**
  keeps its name (it quizzes chord and scale theory) and lives on Practice.
- **Pages** are named for their routes: `pages/learn`, `pages/chords`, `pages/scales`, `pages/lesson`,
  `pages/practice`, `pages/theory-quiz`; `pages/theory-symbols` goes.

## 11. States

Everything here is bundled content or URL state: nothing loads over the network after the first visit (the PWA
precaches every chunk). A lesson, quiz or piece that is not there is the not-found screen. Practice's My gaps row
shows no detail when there are none, and the quiz says so (as today). A scale without chords shows no Scale · Chords
control. Notes view with no note yet shows no line.

## 12. Tests

Test first, per module. The kernel's three functions with the reharmonisation table's rows as the oracle; the
widget models' marks and plays; `Dropdown` and `RowLink` in the kit test; `LiveKeyboard` sounding a key's chord and
holding its keys down; `useMidiKeyDown`; the lesson catalog; each screen's test beside its page through `renderApp`
(Learn's rows, the references' pop-ups, Chords view by tap and by Notes, Practice's rows and a study's page, Songs'
filters); the router's table of routes, its not-found cases and the four places in the nav. `npm run typecheck && npm
run lint && npm run test && npm run build`.

## 13. Records this changes

DESIGN.md (navigation, pop-up buttons, rows, the key's caption; chips and Theory's tabs go), CODE_STYLE §1 (the page
rule, the kit) and §10, PRODUCT.md (screens), the glossary, CLAUDE.md (architecture), a new ADR 0012 (Learn and
Practice replace Theory; choices are pop-up buttons and segments), the master spec's §5 route table, and the
roadmap's status (sub-project 2 built).
