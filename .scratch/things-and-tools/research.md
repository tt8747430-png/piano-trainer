# Things and tools: piano.org's structure, the app through the same lens, and inconsistencies

Scope: how piano.org separates what it holds (chords, scales, articles) from what it does (tools), where the app
mixes the two, and what else in the app disagrees with itself. Researched 2026-10-13 from piano.org's own pages and
sitemaps (fetched that day) and from this repo's code and docs. Every count below is from the page or file named.

## 1. How piano.org is built

**The nav is nouns, then one "Tools", then one index.** Chords · Scales · Modes · Theory · Progressions · Voicings ·
Songs · Tools · Glossary, with a search field in the header. https://piano.org/

**Sizes** (https://piano.org/sitemap-core.xml, https://piano.org/sitemap-reference.xml: 1,159 + 1,380 URLs):
chords 171 + 880, scales 83 + 376, modes 8 + 124, chord-progressions 227, songs 150, theory 118, notes 89,
notation 66, tools 45, key 45, exercises 20 (Hanon), voicings 13.

**A thing has a URL that names it.** `/chords/<type>/<root>/`, `/scales/<kind>/<root>/`, `/modes/<mode>/<root>/`,
`/key/<key>/`, `/notes/<note>/`, `/voicings/<kind>/`, `/chord-progressions/<name>/`, `/theory/<article>/`.

**One chord page** (https://piano.org/chords/major/c/ and its twin https://piano.org/chords/major/c.md) holds, in
this order: an answer-first sentence; a keyboard with inversion, arpeggio, hand and fingering switches and ‹ › to the
next key and the next chord type; notes and degrees; construction; fingering; inversions with their span in mm;
voicings; the key signature; its function in each key that holds it (numeral, function); the scales that include it;
the progressions that use it; "One-edit neighbors" (change one note: Cm, Csus4, C7…); set theory; frequencies; an
FAQ. Its footer says "Nothing above is hand-entered per chord": the kernel computes it from root, quality and stated
parameters.

**The chord index** (https://piano.org/chords/) is one sortable, filterable table: 54 types × 18 spelled roots = 972
chords, with columns Chord type · Symbol · Formula · In C · Notes · Family · Rank, and six families (Triads, Sixth,
Seventh, Extended, Altered, Suspended & Added). The theory index (https://piano.org/theory/) is the same table
component over 72 articles in eleven sections, plus two "Learning paths" of seven articles each.

**The glossary is a projection, not a list** (https://piano.org/glossary/). 1,671 terms, A to Z, each with its type,
one sentence and its link: 1,015 chords, 456 scales, 133 modes, 67 theory terms (counted from the page's
`data-type`). The page says: "This index is a projection of the reference set, not a second list to maintain. Every
term, its type, and its route come from the same data behind the site. Each definition is the answer-first sentence
published on that term's own reference page." Other pages end with "Terms on this page: …", each linking a glossary
anchor (`/glossary/#g-theory-chord-inversions`). Its type filter offers "Tools", but the page holds no tool entry.

**A tool is a record of what it takes and what it gives** (https://piano.org/tools/). 42 tools in one table: Tool ·
What it does · Takes · Gives · MIDI · Group · Rank. A tool's twin page states the record, e.g.
https://piano.org/tools/chord-finder.md: "Family: Play & identify · Task: identify · Inputs: mouse, touch · Outputs:
chord name". The five groups:

| Group           | Tools                                                                                                                                                                                                                                                          |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Play & identify | Virtual Piano, Chord Finder                                                                                                                                                                                                                                    |
| Lookup          | What Am I Playing?, Chord Builder, Progression Generator, Progression Analyzer, Interval Finder, Key Finder, Scale Finder, Modulation Finder, Roman Numeral Analyzer, Cadence Finder, Note Identifier, Circle of Fifths, Keyboard Fit, printables, Temperament |
| Drills          | Chord Drill, Scale Drill, Scale Speed Test, Key Signature Quiz, Note Reading, Sight Reading Generator, Rhythm Drill, Play Along, Metronome, Tap Tempo                                                                                                          |
| Ear and pitch   | Interval Trainer, Perfect Pitch Test, Tone Deaf Test, Vocal Range Test, Tone Generator, Pitch Pipe, three tuners                                                                                                                                               |
| MIDI keyboard   | Skill Diagnostic, MIDI Monitor, Latency Calibration, a gear guide                                                                                                                                                                                              |

**How the two meet.** This is the part worth copying.

- A thing links to a tool with its state in the URL: "Play this on the virtual piano ›"
  (`/tools/virtual-piano/?notes=C4,E4,G4&entity=/chords/major/c/`), "Every route"
  (`/tools/modulation/?from=c-major&to=a-minor`, from https://piano.org/key/c-major/), "Practise this fingering ›".
- A thing says what its opposite tool is for: "Have the notes but not the name? The piano chord finder works the other
  way round."
- A tool links back to the thing it found ("Open ›"), and names its neighbour tools ("Chord Finder names one chord.
  What Am I Playing listens live.").
- Teaching sits over both. An article (https://piano.org/theory/triads/) carries small interactives of its own
  ("Inversion Walker", "Build-a-Triad Trainer") and ends with "Related Tools". Learn (https://piano.org/learn/) is
  ten stages, and "every stage links a page that already exists here".
- Flashcards (https://piano.org/flashcards/) is "six topics, six tools": a doorway to the drills, not a seventh.

## 2. The app through the same lens

ADR 0019 already has the test: "A reference is looked things up in; a tool works something out from what the learner
gives it." In URL terms: a thing's URL names it; a tool's URL holds what it was given. A third kind scores the
learner. By that test:

| Where (Practice) | Page                          | Kind      | Takes → gives                                     |
| ---------------- | ----------------------------- | --------- | ------------------------------------------------- |
| Chords           | Build                         | thing     | a chord by its parts → its keys, staff, tensions  |
| Chords           | Find                          | **tool**  | keys held or tapped → the chord's names           |
| Scales and keys  | Scale · Chords · Key          | thing     | a scale → its run, its chords, its key            |
| Progressions     | Progression (the library)     | thing     | a library line in a key → its chords              |
| Progressions     | Progression (the typed field) | **tool**  | numerals typed → chords in the key                |
| Progressions     | Passing chords                | **tool**  | two chords → the ways between them                |
| Progressions     | Reharmonise                   | **tool**  | a melody note and a key → the chords that hold it |
| Intervals        | Intervals                     | thing     | a root → every interval over it                   |
| Accompaniment    | a book's patterns, a pattern  | thing     | a pattern → heard over a piece                    |
| Accompaniment    | the pattern editor            | **tool**  | figures chosen → a pattern of the learner's       |
| Exercises        | the list                      | thing     | an exercise and its fields → the Player           |
| Quiz             | eleven trainers, My gaps      | **drill** | answers → a score, a rating                       |
| Free play        | Play, Mark, the metronome     | **tool**  | keys played → a live score; marks; a click        |

Outside Practice: the Player and the score editor are tools; songs, studies and lessons are things; the Check is a
drill.

**What this shows**

- Four of Practice's eight places hold both kinds. Chords and Progressions hide their tools behind tabs that look
  like the views of one thing, as Scales' tabs really are.
- Reharmonise is not a progression: it takes a melody note. Passing chords takes two chords. Both are under
  Progressions because ADR 0030 gave every page a subject to live in.
- The metronome has no page: it is inside Free play. The circle of fifths is inside Scales → Key.
- The app has no index and no search outside Songs (`src/pages/songs/ui/SearchField.tsx`). A chord, a pattern, a
  lesson or a trainer is reached only by walking to it.
- A lesson can link to twelve targets (`src/entities/lesson/model/types.ts:70`), but not to the Chord finder, a
  trainer or Free play, so a thing cannot yet say "work it the other way round".

**The app's tools against piano.org's** (the kernel named is what already exists)

| piano.org                               | The app                                                                 |
| --------------------------------------- | ----------------------------------------------------------------------- |
| Virtual Piano, What Am I Playing?       | Free play; the rail names a held chord (ADR 0037). No interval or scale |
| Chord Finder                            | Chords → Find (`nameChords`)                                            |
| Chord Builder                           | Chords → Build, and richer                                              |
| Progression Generator                   | the library and the typed field; no generator                           |
| Progression / Roman Numeral Analyzer    | missing: chords → numerals in a key (`numerals.ts` reads the other way) |
| Key Finder, Scale Finder                | missing (`chordsHolding`, `tonesInKey` are near)                        |
| Interval Finder                         | missing as a tool; Intervals shows them all                             |
| Modulation Finder, Cadence Finder       | missing                                                                 |
| Note Identifier                         | missing; the Reading notes trainer drills it                            |
| Circle of Fifths                        | Scales → Key                                                            |
| Chord / Scale Drill, Key Signature Quiz | Build chord, Build scale, Key signatures                                |
| Interval Trainer                        | Intervals by ear (and chords, scales, progressions by ear)              |
| Note Reading                            | Reading notes                                                           |
| Rhythm Drill, Sight Reading Generator   | missing                                                                 |
| Play Along                              | the Player's Wait mode                                                  |
| Metronome, Tap Tempo                    | Free play's metronome with tap tempo                                    |
| Skill Diagnostic                        | My gaps, the Check                                                      |
| MIDI Monitor, Latency Calibration       | Settings' MIDI fields; no monitor                                       |
| (none)                                  | Passing chords, Reharmonise, the score editor, takes: the app's own     |

## 3. How to separate them

ADR 0029 removed "References" and "Tools" because they "named a distinction a learner does not make". What failed
there was the word "References" over pages a learner calls Chords and Scales, and both groups sitting under
twenty-eight lessons. piano.org shows the version that works: the things carry their own names and need no group
word; only the leftover verbs sit under "Tools", each saying what it takes and gives.

**Recommended: keep the four places, and cut Practice's page into three titled groups** (`RowGroup` is in the kit):

1. **The things**, with no heading or the plainest one: Chords · Scales and keys · Intervals · Progressions ·
   Accompaniment. One page per thing; tabs only where they are views of that one thing (Scale · Chords · Key;
   Accompaniment's books).
2. **Tools**: Chord finder · Passing chords · Reharmonise · Free play · Metronome. Each a row and a URL of its own,
   its detail line the piano.org record: what it takes → what it gives.
3. **Train**: Exercises · Quiz.

What follows from it:

- Chords loses Build · Find: the Chords page is the builder. Progressions loses its three tabs.
- Each thing links to its opposite tool with state in the URL, and each tool opens what it found (the finder already
  opens the chord in Chords, ADR 0019). Lessons gain link targets for the finder, a trainer and Free play.
- The typed field stays on Progressions: it is the same page's second way in, not a second page.
- A fifth nav place for tools is not worth it: the phone's bar holds four (ADR 0012), and five tools do not fill a
  place.

**An index, projected.** The app already has every registry piano.org's glossary is made of: 36 chord qualities, 13
scale kinds, the intervals, the progression library, 45 patterns, 19 exercises, 11 trainers, 49 lessons, 44 pieces,
and the 57 bold leads (`lead`) in which lessons define their terms. One searchable page of name · kind · one line · link, in both
languages, built from those registries and held to them by a test (as `quiz-groups.ts` is held to every trainer),
would be the app's glossary with no second list to maintain. `matchesQuery` (`shared/lib/fold-text.ts`) already
matches a query against folded text for Songs' search.

**Worth borrowing for the Chords page** from piano.org's chord page: the keys that hold this chord with its numeral
in each, the library progressions that use it, and "change one note" neighbours. All three are computable from
`numerals.ts`, the library and `chord-parts.ts`.

This is a design change, so it needs a brainstorm and a spec before code (CLAUDE.md), and an ADR amending 0029 and 0030.

## 4. Inconsistencies found

### A learner sees

1. **Practice's rows promise what the pages do not show** (`src/shared/i18n/locales/en/practice.ts:19`, `ru`
   likewise).
   - Chords says "Build · Find · Tensions"; the tabs are Build · Find, and tensions are a section of Build.
   - Progressions says "In any key · Passing chords · Reharmonise"; the first tab is "Progression".
   - Accompaniment says "Called to Play · Боброва · Styles"; the tabs are Called to Play · Боброва · Горшков ·
     Styles · Yours (`REFERENCE_PARTS`, since ADR 0043).
   - Free play says "Live score · Mark · Metronome"; its modes are Play · Mark.
   - Russian Quiz says «Аккорды · Гаммы · На слух · Ноты»; its groups are «… Гаммы и тональности … Чтение».
2. **Tabs mean four things.** Chords' switch a thing for a tool (two routes); Scales' switch views of one thing
   (`?show=`); Progressions' switch a thing for two tools (three routes); Accompaniment's switch sources (`?show=`);
   Learn's switch how lessons are grouped.
3. **A lesson's row repeats its module's heading.** Each row shows its category under its title
   (`src/pages/learn/ui/LearnPage.tsx:70`). All 3 Gospel lessons say "Gospel" under Gospel, 6 of 9 Accompaniment
   lessons say "Accompaniment" under Accompaniment, and 15 of 22 course lessons say "Accompaniment" under an
   accompaniment book.
4. **A method book has three homes.** Its lessons are on Learn → Courses, its patterns and studies on Practice →
   Accompaniment → its tab, and Боброва's hymns and Gorshkov's songs on Songs (`METHOD_BOOK_PIECES`). No page shows
   one book whole; piano.org's style hub (`/styles/country/`: its progressions, its piano styles, its songs) is the
   model.
5. **Only Songs can be searched.**

### The language says two things

6. **"Place"** is the nav's four (UBIQUITOUS_LANGUAGE.md:160), Practice's eight (CLAUDE.md, ADR 0034,
   `PracticePage.tsx:11`) and any of a lesson link's twelve targets (`place: 'piece'`, `types.ts:70`).
7. **"Subject"** is one of Practice's eight (UBIQUITOUS_LANGUAGE.md:168, `SUBJECTS`, `practice:subjects`,
   `widgets/subject-tabs`) and Learn's first tab with its modules (`SUBJECT_MODULES`, `learn:tabs.subjects`).
8. **"Reference" and "tool" are on Explorer's Avoid list** (UBIQUITOUS_LANGUAGE.md:154), yet the Lesson row beside it
   says "links into the references, the tools and the Player" (:163), the widgets are `ProgressionsTool`,
   `PassingChordsTool` and `ReharmoniseTool`, and Accompaniment's tabs are `REFERENCE_PARTS` / `referenceShelves`.
   `ProgressionsTool` is also the one of the three that is mostly a thing.
9. **"Quiz"** is the place, a lesson's block (`kind: 'quiz'`), the evidence ("quiz answers") and the i18n namespace
   of the trainers, while the table tells code not to call a Trainer a quiz (:149).

### Code names that drifted

10. **Practice's pages read the `learn` namespace.** Chords, the finder, Scales, Intervals, Progressions, Passing
    chords, Reharmonise, a pattern's page and the pattern editor all call `useTranslation('learn')`; `learn.ts` is
    315 lines, `practice.ts` 69. CLAUDE.md says "namespaces per place". Left from before ADR 0029 moved them.
11. **One visible name, two keys.** "Chords" is `learn:chords` and `practice:subjects.chords`; "Scales and keys" is
    `learn:scales` and `practice:subjects.scales`; likewise Progressions and Intervals; "Practise in the Player" is
    `learn.ts:293` and `practice.ts:2`. Each pair can drift apart.
12. **Three naming schemes for like widgets:** `chord-explorer`, `scale-explorer`, `interval-explorer`; then
    `progressions`, `passing-chords`, `reharmonise` with `*Tool` components; then `chord-finder`.
13. **The route chunks are named for a split that is gone.** `routes/explorer-screens.ts` holds Accompaniment, a
    pattern's page and the pattern editor; `routes/practice-screens.ts` holds Quiz, Exercises, Free play and the
    Check.
14. **Routes nest for some children only.** `/practice/chords/find` and `/practice/progressions/passing` nest;
    a trainer is `/practice/trainers/$trainerId`, not under `/practice/quiz`; patterns and studies are not under
    `/practice/accompaniment`; `/check` is outside `/practice`.
15. **`catalogue.ts`** in `entities/exercise/content` beside `catalog.test.ts` in piece and lesson.

### Stale or dead

16. `PAGE_TILES.chordFinder` is used nowhere (`src/shared/ui/page-tiles.ts:36`). `keys` and `tensions` name pages
    that ADR 0029 and 0030 folded away. The tiles of Exercises and Quiz are written inline in `PracticePage.tsx`,
    outside the table.
17. A lesson link's `place: 'keys'` and `place: 'tensions'` (7 uses in the lessons) name those same folded pages.
18. `src/app/router.tsx:166` still says "Practice's seven places".
19. CLAUDE.md and UBIQUITOUS_LANGUAGE.md:168 list Accompaniment's tabs without Горшков.

## 5. A sensible order

1. Fix what a learner reads wrong today: the five row summaries (item 1) and the repeated category (item 3). Small,
   no design needed.
2. Clear the dead and stale (items 16 to 19) and the duplicate keys (item 11).
3. Brainstorm and spec the three groups of §3 with the owner's references, then move the tools, and with that move
   settle the names: one word each for Place and Subject, `explorer` against `tool`, the namespace of Practice's
   pages, the chunk files and the route nesting (items 6 to 8, 10, 12 to 14).
4. The index of §3, after the names are settled, since it prints them.
5. New tools, cheapest first by what the kernel has: chords → numerals in a key, a key finder, an interval finder.
