# Walk the keys, practise an inversion, remember the learner's way, and screens that keep their place

- **Status:** decided 2026-10-01 under the owner's standing instruction (decide, record, continue). Every issue was
  reproduced in the running app (Chrome, `localhost:5173`) or confirmed in the code before it was designed for.
- **Builds on:** ADR 0003 (view state in the URL), ADR 0014 (a walk is a Performance handed to the Player), ADR 0015
  (the chromatic walk), ADR 0018/0021 (a lesson is a worksheet), ADR 0020 (numerals in any key, the progression
  Player).
- **From:** two PDFs of Vasily Gorshkov's course (@stein_way), the course «Ромашковые поля» already comes from:
  «Основы джазовой гармонии. Оборот 2-5-1» (9 pages) and «Мышление ступенями» (5 pages).

## 1. What the owner asked

> 1. want to walk up also the progressions like this, and i want also to practices in what inversion i want it to
>    practices all the cords or progressions. and also the preferences of the user must be also saved like what
>    pattern, what key and other preferences. a lot of the preferences are not saved or none of them is saved.
> 2. look at the information here and what can you take from theese the best practices the best exercices and maybe
>    also best lessons
> 3. also why when i click on the some button on the bottom of the page is will be scrolled to the top. this is not
>    good and causes flickering and bad ui and ux.
> 4. also we dont have somethign like auto hide header on scroll to top auto appeas and ot scroll to bottom auto
>    disappears. beause the user must scroll to the top to get back and also the buttons of the piano are
>    disorienting the user because the user thinks that these are buttons to go back to another page.
> 5. also the back button doest do what it should. it must not undo the actions that the user selected on the page
>    but should go back to another page from where the user came. this is false what happens now.

### 1.1 What was found

| #   | Reproduced                                                                                                                                                                                                                                         | Cause                                                                                                                                                                                                              |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | `/play/flow` in G major, closed, reopened from its page: F major again. Nothing the Setup or the toolbar chooses survives leaving the screen.                                                                                                       | By design (ADR 0003): the Player's choices live only in the URL; only the practice toggles and the keyboard settings are saved.                                                                                    |
| 3   | Chords, scrolled to 67px, **1st** tapped: the page jumps to 0.                                                                                                                                                                                       | TanStack Router resets the scroll on every navigation unless told not to (`resetScroll` defaults to `true`). Every screen writes its choices with `navigate({ search, replace: true })`, never `resetScroll: false`. |
| 4   | Chords scrolled: the title and its Back are gone, the pinned keyboard is at the top, and its rail starts with **‹**.                                                                                                                                  | `ScreenHeader` scrolls away with the page; `Pinned` keeps the keys at the top; the rail's octave-down button sits in the top-left corner, where a Back is expected.                                                  |
| 5   | Progressions tool: two library picks (history 7 → 8 → 9), then **Back**: the first pick again, not Learn.                                                                                                                                            | `ProgressionLibrary`'s rows are `Link`s to the screen they sit on, without `replace`: each pick is a history entry, and Back (`history.back()`) undoes it. Every other in-page change already replaces.               |

## 2. What the PDFs give

**«Оборот 2-5-1»:** the ii–V–I (IIm7–V7–Imaj7) is S–D–T in jazz's dress, its subdominant the brightest one, the ii7;
jazz harmony is built of 7th chords, so triads are rare. The chords' **roots** fall a 5th each time, down the circle
of fifths (the letters, not the bass). Voice leading: what was the 3rd becomes the 7th of the next chord and the 7th
becomes the 3rd; the pulls go down a step and common notes stay. A 6th chord can stand for any major 7th (C6 for
Cmaj7). In minor the ii is half-diminished (iiø7), the V needs the raised 7th (V7, often V7♭9), and the tonic is
often a minor 6th (Cm6). A ii–V can visit another key (Em7♭5–A7♭9 → Dm7). **Exercise 1:** the ii–V–I in close
position, Step 1 up by semitones or whole tones (Dm7 G7 Cmaj7 → E♭m7 A♭7 D♭maj7…), Step 2 down the circle: each
key's I becomes the next key's ii (Dm7 G7 Cmaj7 → Cm7 F7 B♭maj7…, the keys a whole tone lower each time).
**Exercise 2:** the same with 9ths, then in another layout.

**«Мышление ступенями»:** to transpose quickly, think in degrees. Find the key first: the key signature (nine times
in ten), the first and last chords, and where the last melody note resolves. Name each chord by its degree and
quality (Dm7 Gm9 Asus4 Dm7 in D minor: Im7 IVm9 Vsus4 Im7). The functions: the tonic rests, the subdominant
unsettles, the dominant pulls back to the tonic; ii shares two notes with IV and so sounds like it; vii° shares two
with V and pulls like it; iii and vi are weaker and take their colour from the context.

**What the app already has:** «Ромашковые поля» whole, `twofive` (ii–V–I), `minor251` (iiø–V7♭9–i), the cadences;
the chord family of a key (numerals); key signatures and the circle; the Progressions tool (numerals in any key).

**What it adopts:**

- Exercise 1 is a way to play **any** progression: **walk the keys** (§5).
- Exercise 2's "another layout" is an **inversion** of the right hand's chord (§4); a 9th chord's two rootless
  layouts (from the 3rd, from the 7th) are its 1st and 3rd inversions.
- Three lessons (§7): **Chord functions** (Fundamentals), **Thinking in degrees** and **The ii–V–I**
  (Accompaniment). Each plays its examples in place and opens the Player on the exercise.

Not adopted: m6 as a numeral (numerals name triads and 7ths, ADR 0020; the `minor251` piece keeps its own chords),
the PDFs' own typos (none affect content).

## 3. Screens keep their place (#3, #4, #5)

### 3.1 An in-page change neither scrolls nor adds history

- **One hook writes a screen's view:** `useViewChange(from)` in `shared/lib` returns `(patch) => void`, which
  navigates with `search: (prev) => ({ ...prev, ...patch })`, `replace: true` and `resetScroll: false`. Every screen's
  inline `navigate` (the 15 pages and the 4 Player pages) uses it.
- **A link to the screen it sits on** (`CircleOfFifths`, `KeyFacts`, `ScaleFacts`, `ProgressionLibrary`) is a view
  change too: `replace` and `resetScroll={false}`. `ProgressionLibrary` gains the `replace` it lacked (#5).
- **Back is `history.back()`**, unchanged: with no in-page entries left, it leaves the screen the way the learner
  came. A screen opened directly still goes to its `fallback`.
- **The router restores scroll positions** (`scrollRestoration: true`): Back to Learn or Songs returns to where the
  learner was in the list, not the top.

### 3.2 The screen's bar hides while reading and returns on the way back (#4)

- **`ScreenHeader` becomes the screen's bar:** sticky at the top, on the page's background, clear of the notch. It
  slides up and away while the page scrolls down and back as soon as the page scrolls up (past an 8px dead zone), or
  reaches the top. It stays while focus is inside it (a keyboard user never loses the focused Back). With reduced
  motion it appears and disappears without sliding.
- **The pinned keyboard sits under the bar** while the bar shows, at the top when it hides, moving with it (one
  transform, same duration). `ScreenBarProvider` (in `AppShell`) shares the bar's height and whether it shows;
  `ScreenHeader` reports its height (`ResizeObserver`) and `Pinned` reads both. A screen without a header (the Path)
  has no bar and no offset.
- **The rail's octave buttons stand together at its end**, beside the keyboard settings: **‹ › ⚙**. The top-left
  corner no longer holds a lone arrow, and the pair reads as one control that moves the keys.
- The Player and the Check (full screen) keep their own toolbar, always in view: unchanged.

## 4. Practise in an inversion (#1)

- **The Setup's Inversion field:** Nearest · Root · 1st · 2nd · 3rd, in every Player (a piece, Walk the chords, the
  chromatic walk, a progression). **Nearest** (the default, as today) voice-leads each chord from the last. The others
  keep that inversion for every chord. URL `inversion=0..3`, absent is Nearest.
- **What the right hand plays in an inversion** (`shared/lib/arrangement`): its chord stacked from its 1st, 2nd, 3rd
  or 4th note. A chord of up to four notes is played whole: root, 3rd, 5th, 7th (a triad has no 3rd inversion and
  takes its 2nd). A bigger chord leaves its root to the bass and its 5th out, down to four notes, as the right hand
  does today, and its 9th stands first, where the root was: Dm9 is E F A C in root position, F A C E in the 1st
  inversion (the course's 3‑5‑7‑9 layout), A C E F in the 2nd and C E F A in the 3rd (its 7‑9‑3‑5). The lowest note
  sits from E3 to E4, the octave nearer the last chord when there are two, as the Nearest voicing's does.
- **Which patterns it changes:** the ones whose right hand plays the chord (`C`, `vN`). A pattern that plays its own
  shapes (the triads from the root `T T1 T2`, `U`, the key's triads `Ka Kb Kc`, the tune) keeps them: the field is
  disabled under that pattern with one line saying so (`playsChord` over the right hand's figure).
- **Fingering:** four notes 1‑2‑3‑5, three 1‑3‑5, as today.

## 5. Walk the keys (#1)

- **The Setup's Through the keys field** for a progression (the progression Player and a progression piece):
  One key (default) · Up by semitones · Down by semitones · Up by whole tones · Down by whole tones · Round the circle
  of fifths. URL `walk`, absent is One key.
- **The keys** (`shared/lib/music`: `walkKeys(key, walk)`), each ending back home: by semitones 12 keys and home (13);
  by whole tones 6 and home (7); round the circle each key a 5th lower (C F B♭ E♭ A♭ D♭ G♭ B E A D G C). A minor
  progression stays minor. Each tonic is spelled by the key's one rule (`tonicSpelling`).
- **The chart** (`shared/lib/arrangement`: `chartInKeys(chart, keys)`): the progression once per key, a section per
  key, in C so the sheet music writes each chord's accidentals (as the chromatic walk does). Down by whole tones from
  C is the course's Step 2: each I becomes the next key's ii (Cmaj7 → Cm7).
- **While it walks:** nothing plays the key's triads (no single key: the pattern fit's `key` is off, as the chromatic
  walk's is), and a recording does not play (it is in one key). The Player's title names the walk.

## 6. The learner's way is remembered (#1)

**Decision** (ADR 0022, amends ADR 0003): the URL still holds what is on screen, so links stay exact and Back works.
A new saved store remembers each screen's last view, and a screen is opened from it by two rules:

1. **Opened plainly** (its URL has no params: a nav tab, a row in Learn, a piece's Play), a screen comes back as the
   learner left it.
2. **Opened by a link that names what to show** (a lesson's link, the Progressions tool's Play), it shows that, played
   the learner's way: each of the screen's **kept** params the link leaves out takes the remembered value.

| Screen                                                                                         | Remembered under                   | Kept (rule 2)                                                                                               |
| ---------------------------------------------------------------------------------------------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| A piece in the Player (`/play/$pieceId`)                                                       | each piece                         | key, pattern, rh, lh, chordSize, inversion, walk, tempo, hands, mode, swing, speedTraining                  |
| A progression in the Player (`/play/progression`)                                              | the screen                         | pattern, rh, lh, inversion, walk, tempo, hands, mode, swing, speedTraining (not `p`, `key`, `chordSize`: the tool names them, and its triads are named by leaving `chordSize` out) |
| Walk the chords (`/play/walk`)                                                                 | the screen                         | pattern, rh, lh, inversion, tempo, hands, mode, swing, speedTraining (not `chordSize`, left out for the default) |
| The chromatic walk (`/play/chromatic`)                                                         | the screen                         | direction, pattern, rh, lh, inversion, tempo, hands, mode, swing, speedTraining                             |
| Chords, Scales, Keys, Intervals, Available tensions, Chord finder, Reharmonise, Passing chords, Progressions | each screen                        | Scales: fingers, rhythm, tempo, hands. Chords: hands. Others: none                                         |

- **Never remembered:** the loop (`loop`, a passage of one session) and a path step's panel (`step`). Lists (Songs,
  Learn), the Path, Settings, Practice, quizzes, the Check and lessons are not remembered: a stale filter would hide
  what the learner looks for, and the rest have no choices.
- **The store:** `entities/views`, `pt-views` version 1 (`createSavedStore`, follows other tabs): `{ views: Record<path,
  Record<param, string | number | boolean>> }`, at most 200 paths (the oldest dropped). The sanitiser keeps only that
  shape. Values are not trusted: a route's own validator reads them.
- **How (app layer):** the router's context carries the store. A remembered route's `beforeLoad`, on `enter` only
  (never `stay` or `preload`), builds the view by the two rules, runs it through the route's validator, and redirects
  with `replace` only when that changes the validated search (so it ends after one redirect). `router.subscribe
  ('onResolved')` saves a remembered route's URL params (minus the never-remembered) under its path. The routes say
  what they keep in `staticData.remember`.

## 7. Lessons (#2)

New lesson link target: **the progression Player** `{ place: 'player', numerals, key, size?, walk?, inversion? }`
(`/play/progression`, read by `readProgression`'s rules), so a lesson opens an exercise ready to play.

1. **Chord functions: tonic, subdominant, dominant** (Fundamentals, level 2, after The chord family of a key). Rest,
   unsettle, pull; C F G in C; ii sounds like IV (Dm and F share F A), vii° like V (B° and G share B D), vi and iii
   take colour from the context; I–IV–V–I and I–ii–V–I played in place. Quizzes: the subdominant of G (C); the chord
   of C major that shares two notes with F and is minor (Dm). Link: Keys, C major.
2. **Thinking in degrees** (Accompaniment, level 2, after Common progressions). Find the key: the signature, the first
   and last chords, the last melody note. Name each chord by degree: «Ромашковые поля» opens Im7 IVm9 Vsus4 Im7 in
   D minor. Play it in any key: the same numerals in G minor. Quizzes: the vi of G (Em); the IV of D (G). Links: the
   song in the Player; Keys, D minor.
3. **The ii–V–I** (Accompaniment, level 3, after Thinking in degrees). S–D–T in 7th chords; roots fall a 5th (the
   letters, not the bass); voice leading 3rd ↔ 7th, pulls down a step, common notes stay; the 6th for the major 7th;
   minor iiø7–V7–i; a ii–V visiting another key (Em7♭5 A7 → Dm7). Progressions played in place (ii7–V7–Imaj7 in C;
   iiø7–V7–i in C minor). Exercises as Player links: Step 1, up by semitones; Step 2, down by whole tones (each I
   becomes the next ii); Exercise 2, 9ths in the 1st inversion (3‑5‑7‑9), then the 3rd (7‑9‑3‑5). Link: the
   `twofive` piece.

## 8. Order of work

Each tier is test-first, ends green on `npm run typecheck && npm run lint && npm run test` (and `npm run build`
where it touches the router or startup), and is checked in Chrome.

1. **Screens keep their place:** `useViewChange`, the four same-page links, scroll restoration (§3.1).
2. **The screen's bar and the rail** (§3.2).
3. **Inversion** in the arrangement and every Setup (§4).
4. **Walk the keys** in the kernel, the progression Player and progression pieces (§5).
5. **Remembered views** (§6), after 3 and 4 so `inversion` and `walk` are kept.
6. **Lessons** and the `player` link target (§7).
7. **Docs:** CLAUDE.md, UBIQUITOUS_LANGUAGE (Inversion field "Nearest", Walk the keys, Remembered view, Screen bar),
   CONTENT (the `player` link), ADR 0022 (remembered views) and ADR 0023 (an inversion and a walk of keys are ways to
   play any chart).

## 9. Testing

- **Kernel:** `walkKeys` (each walk's keys and spellings, minor kept, home at the end); `chartInKeys` (a section per
  key, chords transposed, in C); the inversion voicing (each inversion's lowest tone, the four-note rule, a triad's
  3rd fitted to its 2nd, the octave nearer the last chord).
- **Store:** the sanitiser (bad shapes dropped, the cap), following another tab.
- **App (`renderApp`):** a choice low on a screen keeps the scroll; Back after in-page changes leaves the screen; the
  bar hides on scrolling down and shows on scrolling up (`stubScrolling`); a piece reopened plainly keeps its key,
  pattern, inversion and tempo; a progression opened from the tool keeps the tool's numerals, key and size and the
  remembered pattern and walk; a loop is not restored; the remembered route redirects once.
- **Content:** the lessons' catalog test reads every new block and link.
