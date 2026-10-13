# Things, tools and training: Practice in three groups, a tool a page of its own, and Search

- **Date:** 2026-10-13 · **Follows:** ADR 0019 (a reference and a tool), ADR 0029 and 0030 (Practice's places)
- **Research:** `.scratch/things-and-tools/research.md` (piano.org, musictheory.net, musicca.com, and the app's own
  inconsistencies)
- **Decided without a review gate:** the owner asks for decisions, not menus (memory: decide and continue).

## What the owner said

"Research piano.org, especially the glossary for chords and how it is structured, what tools it has, and how we can
separate the tools from the actual things we have in the app, and research other inconsistencies in our app." Then:
"Make good implementations and refactoring with no legacy leftover or backwards compatibility. You may do anything
you want." With two more references: musictheory.net and musicca.com.

## What the references do

All three keep three kinds of page apart, under the same three words.

| Site            | Teaches | Trains                      | Works something out                                   | Holds                              |
| --------------- | ------- | --------------------------- | ----------------------------------------------------- | ---------------------------------- |
| piano.org       | Theory  | Drills, Ear and pitch       | Tools: Play & identify, Lookup                        | Chords, Scales, Modes, a Glossary  |
| musictheory.net | Lessons | Exercises                   | Tools: Calculators, Utilities                         | (nothing)                          |
| musicca.com     | Lessons | Exercises                   | Tools: Equipment, Finders, Other; Instruments         | a Dictionary                       |

piano.org adds the two things worth copying. A thing links to its opposite tool with its state in the URL ("Have the
notes but not the name? The chord finder works the other way round"), and the tool opens the thing it found. And its
glossary is "a projection of the reference set, not a second list to maintain".

## What was there

- Practice listed eight places in one list. Four of them held both a thing and a tool: Chords (Build, and Find behind
  a tab), Progressions (the library, and Passing chords and Reharmonise behind tabs), Accompaniment (patterns, and
  the editor), Free play.
- Tabs meant four things: a thing against a tool (Chords, Progressions), views of one thing (Scales), sources
  (Accompaniment), groupings (Learn).
- A row's line said what the page did not show ("Build · Find · Tensions"; Accompaniment without Горшков).
- Only Songs could be searched.
- A lesson's row showed its category, which in 24 of 49 rows repeated its module's heading. The category was Learn's
  filter (ADR 0018), and the filter went in ADR 0029.
- Names had drifted: Practice's pages read the `learn` strings; "place" and "subject" each meant two or three
  things; widgets were `*-explorer`, `*Tool` and neither; a trainer's and a pattern's URL sat beside their page's,
  not under it.

## Decisions

**Three kinds of page, and Practice shows them as three groups.** ADR 0019's test stands: a thing's URL names it; a
tool's URL holds what the learner gave it; training scores the learner.

| Group                | Rows                                                             | A row's line says      |
| -------------------- | ---------------------------------------------------------------- | ---------------------- |
| (no heading)         | Chords · Scales and keys · Intervals · Progressions · Accompaniment | what is inside         |
| **Tools**            | Chord finder · Passing chords · Reharmonise · Free play          | what it takes → gives  |
| **Training**         | Exercises · Quiz                                                 | what is inside         |

The things carry their own names and need no group word, as piano.org's nav shows; "References" over them is what
ADR 0029 rightly removed. "Tools" is the one word all three references use. The metronome stays in Free play: a
click is for playing to, and a page of its own would be Free play again.

**A tool is a page of its own, and tabs are only the views of one thing.** Chords is the builder, with no tabs.
Progressions is the library and the typed line, with no tabs. Scales keeps Scale · Chords · Key, and Accompaniment
its parts, each beside its page (`widgets/subject-tabs` goes).

**A page's URL sits under the page it belongs to.**

| Page                                   | URL                                                              |
| -------------------------------------- | ---------------------------------------------------------------- |
| Chords, Scales, Intervals, Progressions | `/practice/chords`, `/scales`, `/intervals`, `/progressions`     |
| Chord finder, Passing chords, Reharmonise | `/practice/chord-finder`, `/passing-chords`, `/reharmonise`    |
| Free play, Exercises, Quiz             | `/practice/free-play`, `/exercises`, `/quiz`                     |
| A trainer                              | `/practice/quiz/$trainerId`                                      |
| Accompaniment, a pattern, its editor   | `/practice/accompaniment`, `…/patterns/$patternRef`, `…/edit`, `…/patterns/new` |
| A study                                | `/practice/accompaniment/studies/$pieceId`                       |

The Check stays `/check`: it is the Path's and a song's, full screen. No redirect from an old path (the app has no
users); `pt-views` is version 2, so no view is remembered under a path that is gone.

**A thing leads to its tool, with its state.** Each explorer ends, after its ways into the Player, with a **Tools**
group of rows:

- Chords → Chord finder, on the keys the chord is shown on (so the finder names it, and its other names).
- Progressions → Passing chords, in the key, between the line's first two chords; Reharmonise, in the key.
- Scales' Key view → Reharmonise, in the key.

The finder already opens its chord in Chords. Passing chords and Reharmonise show chords that play in place; they
gain no links.

**Search finds everything, from one projection.** A page in the shell, `/search?q=`: one field, and under it every
named thing the app has, grouped by kind, each a row to its page.

| Kind         | From                                   | Opens                              |
| ------------ | -------------------------------------- | ---------------------------------- |
| Pages        | Practice's rows                        | the page                           |
| Songs        | the repertoire (the learner's too)     | the piece's page                   |
| Lessons      | `LESSONS`                              | the lesson                         |
| Chords       | the 36 chord qualities                 | Chords, the chord built on C       |
| Scales       | the 13 scale kinds                     | Scales, the scale on C             |
| Progressions | the library                            | Progressions, that line            |
| Patterns     | the pattern book (the learner's too)   | the pattern's page                 |
| Exercises    | the catalog                            | the Player                         |
| Quiz         | the trainers                           | the trainer                        |

A query matches a name in either language, folded (`matchesQuery`). A chord symbol typed ("F#m7") is read as that
chord and leads the results. With no query the page is the whole index. The projection is one pure function over the
registries, held to each by a test, so nothing is listed twice. Search is at the sidebar's foot over Settings, behind
a magnifier in the Path's bar on a phone, and under the platform's modifier with K.

**A lesson's row says its level; the category goes.** `LessonCategory`, its strings and each lesson's field are
removed. The module's heading already says where a lesson belongs, and the row keeps its number, title, level's
mark and learned badge.

**One word, one meaning.**

- **Place** is one of the nav's four. Practice has **pages**, in three **groups**. A lesson link's discriminant
  `place` becomes `to`.
- **Subject** is Learn's: its first tab and that tab's modules.
- **Explorer** is a Practice page that shows a thing on the keys: Chords, Scales and keys, Intervals, Progressions.
  **Tool** is one that works something out from what it is given: Chord finder, Passing chords, Reharmonise, Free
  play. The widgets are named so: `chord-explorer`, `scale-explorer`, `interval-explorer`, `progression-explorer`;
  `chord-finder`, `passing-chords`, `reharmonise`.
- Accompaniment's tabs are its **parts** (`ACCOMPANIMENT_PARTS`, `AccompanimentPart`, `partShelves`).
- Strings live by place: Practice's pages read `practice`; `learn` holds Learn's and a lesson's; words the lesson and
  the explorers share are `music`'s.
- The route modules hold what their names say: `explorer-*` (the four explorers), `tool-*` (the four tools),
  `accompaniment-*` (Accompaniment, a pattern, its editor), `practice-*` (the list, Exercises, Quiz, a trainer, the
  Check), `search-*`.
- `PAGE_TILES` holds the tile of every row Practice lists, and no tile nothing wears.
- `catalog`, one spelling for the three content catalogs.

## Out of scope

- New tools the kernel affords (chords → numerals, a key finder, an interval finder): each is its own spec.
- A page for a method book whole (its lessons, patterns and pieces together).

## Order of work

1. This spec and ADR 0044.
2. Practice's three groups, the tools' own pages and URLs, the tabs gone, the Tools rows on the explorers.
3. A lesson's category removed.
4. The names: parts, widgets, the lesson link's `to`, the route modules, `catalog`.
5. The strings by place.
6. Search.
7. CLAUDE.md, UBIQUITOUS_LANGUAGE.md, CODE_STYLE.md.

Each step is test first, verified (`typecheck`, `lint`, `test`, and `build` where routes change) and committed alone.
