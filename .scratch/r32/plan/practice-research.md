# R32 Practice: research

What the references do, read against the owner's message of 2026-11-05 (in `practice.md`'s Source).
`.scratch/r32/research/refs.mjs` shoots the public reference pages with Playwright; from this container the headless
browser reaches no outside host (every page timed out), Chordify's help centre answers 403 and Apple's HIG renders
client-side, so the reading comes from the owner's own reference screens in `piano-data/reference-apps/chordify`
(IMG_4552–4573: Learn the song, the chord popup with its keys and Play, Song information, the Discover page's Toolkit
row of four tiles: Import music, Metronome, Detect chords, How to use), `flowkey/` (01–02: Continue learning first),
and from the apps as they ship and their published documentation.

## 1. Chordify: the metronome and the tools

**Chordify's metronome** (web `chordify.net/metronome`, and the Tools tab of the iOS and Android apps) is one screen
with every control in sight. Nothing hides behind a gear:

| Part                  | What Chordify draws                                                        |
| --------------------- | -------------------------------------------------------------------------- |
| Tempo                 | the BPM very large in the middle; − and + either side; the Italian term under it |
| Slider                | a full-width slider under the tempo                                        |
| Tap                   | a Tap button beside the slider                                             |
| Beats                 | one cell per beat, the first accented; tapping a cell cycles accent · normal · mute |
| Time signature        | a labelled pop-up row under the beats (2/4 … 12/8)                        |
| Sound                 | a labelled pop-up row (Click, Woodblock, Drum, …)                          |
| Subdivision           | a labelled row of pictured note values (♩, ♫, triplet, ♬)                 |
| Start                 | one large Play at the foot                                                 |

The rows are **on the page, under the beats**, in the order a player sets them: time, sound, subdivision. Practice
aids (Chordify's "speed trainer" in the app) are one more labelled section further down, folded to a switch and its
summary, expanded in place. This is what the owner calls "proper UI like Chordify": we had moved Sound,
Subdivision and both trainers to a separate `/practice/metronome/settings` page.

**Chordify's tuner** shows the note, the needle and the frequency, and the reference pitch (A4 = 440 Hz) as a small
stepper on the same screen. There is no Settings page for a single value.

**Chordify's tools menu** (the app's toolbar, the song page's ⋯ › Tools) lists Metronome, Tuner and Chord finder as
rows that act in place: the metronome is a compact live strip with Play, BPM and −/+; the tuner opens over the page;
nothing sends you to a home screen. That is the model for our header's Tools: a real menu of the tools, each usable
where you are, never "More tools" → Practice.

**Chordify's chord pickers** (the chord editor in the app) say what you are choosing by showing it: the chord's
symbol, its notes on a small keyboard, and a short group name. A selection list never shows a check without saying
what the check means.

## 2. Apple's Human Interface Guidelines

**Lists and tables.** Edit mode is entered by Edit in the bar (Done replaces it). In edit mode a row shows a reorder
handle at its trailing edge and the row's delete control; drag-to-reorder starts from the handle (on iPadOS and
macOS also by a long press anywhere on the row). Swipe actions on a row are shortcuts to actions also in its context
menu. Destructive actions are red and confirmed. A grouped list keeps sections with short headers. Empty states use
`ContentUnavailableView`: an SF Symbol, a short title, one line of description, and at most one action.

**Drag and drop.** The item lifts under the finger (a shadow, slightly larger), the others move aside to show where it
will land, and the drop settles in place. The drag preview is the item itself, not a ghost of the slot. A drag that
cannot land snaps back. Reordering is never Move up / Move down buttons.

**Sidebars.** A sidebar is the app's top-level navigation on iPad and Mac: sections with short headers, an SF Symbol
and a label per item, a disclosure for items with children, a toggle in the toolbar to hide it (and a keyboard
shortcut). On iPhone the same structure becomes a tab bar (iOS 18's adaptive tab bar turns into a sidebar on iPad).
Keep it short: top-level places, then the learner's own collections.

**Menus and popovers.** A menu acts; it does not hold a setting. A popover shows a small task in place and dismisses
on a tap outside. Pull-down button menus label what they act on.

**Settings.** An app's Settings holds what is app-wide; a screen's own options stay on that screen (iOS Camera's
format pills, Clock's timer sounds row on the timer itself). A setting with one value does not get a page.

## 3. The Claude app's sidebar (claude.ai, the desktop and phone apps)

| Part             | Laptop (claude.ai, desktop app)                                              | Phone                           |
| ---------------- | ---------------------------------------------------------------------------- | ------------------------------- |
| Top              | the product name and the collapse toggle (a panel icon), ⌘. / ⌘B             | a ☰ in the bar opens it         |
| Primary action   | New chat, a prominent row with + at the top                                  | the same, first row             |
| Places           | Chats, Projects, Artifacts, Code: icon and label, one current                 | the same                        |
| Recents          | a "Recents" header, then the latest conversations by title, one line each, ellipsised; hover shows ⋯ (Star, Rename, Delete) | the same list, scrolls |
| Starred          | above Recents when there are some                                            | the same                        |
| Foot             | the account row: avatar, name, plan; it opens a menu (Settings, Help, Sign out) | the same                     |
| Collapsed        | a 56px rail of icons: toggle, New chat, places, the avatar; tooltips on hover; hovering the rail's logo shows the expand icon | n/a |
| Motion           | the width animates; the content reflows; state remembered                    | slides in over a dimmed page    |

What we take: the **toggle beside the name**, **one primary action at the top**, places, then **Recents: the songs,
lessons and Practice pages the learner opened last**, each a one-line row with its own icon, and **the learner at the
foot as one account row** opening a menu (Profile, Settings, Search hint, Sign in/out), so Search and Settings stop being
two loose rows. Collapsed: a rail of icons with tooltips, the Recents gone. On a phone our standing ruling keeps the
four-tab bar with the Profile as its last tab (ADR 0052, feedback-log › Navigation); Claude's phone drawer is not taken,
so nothing a learner already knows moves on the phone.

## 4. memory-palaces: drag and drop, folders, cards

Read from `/home/user/tt8747430-png/memory-palaces` (the owner's, read-only).

- **`shared/lib/use-sortable-sensors.ts`**: Mouse after 8px, Touch after a 250ms hold with 5px tolerance, Keyboard by
  `sortableKeyboardCoordinates`. Never a bare `PointerSensor` (it fights scrolling and tap).
- **`widgets/action-slots/model/use-sortable-list.ts`** with **`useHeldOrder`**: the order dropped is held on screen
  until the store re-emits the same order, so rows never snap back under the finger (CODE_STYLE §10, cause 1).
- **`DragOverlay`** draws the row in hand as the real row (cause 3), lifted by a shadow, never scaled; the source slot
  stays as an empty space.
- **One context per surface.** No `DndContext` inside another; a drag handle is the only activator (`setActivatorNodeRef`),
  so a tap, a double tap, a resize edge or a field inside the item never starts a drag.
- **Equal tiles.** Sorting strategies assume the items' rects; items of different widths in a grid (our bars with boxes
  spanning beats) give wrong transforms. memory-palaces only sorts rows or equal tiles.
- **Folders:** built-in decks stay put, but the learner renames, recolours and reorders their own; every list has an
  Edit mode with handles; a destination sheet moves; delete asks first, Undo in the toast.

Piano-trainer already ported the engine as `shared/lib/use-sortable-list.ts` (with `useHeldOrder`, `moveBlock`); the
Songs library uses it. **The Chord player does not**: it nests a `DndContext` per section inside the sections'
context, uses `PointerSensor` with no constraint for sections, spreads the box's drag listeners over the whole box (so
the resize edge's `pointerdown.stopPropagation()` does not stop the `MouseSensor`'s `mousedown` and a resize also
drags), sorts boxes of different spans with `rectSortingStrategy`, and has no `DragOverlay`. Those are the bugs.

## 5. Songs' own library (`widgets/song-library`, `features/manage-library`)

Select mode with a check where ⋯ stood, handles in the Manual order, drag into folders and onto the Archive, a Move
sheet (`MoveSheet`) for any depth, a folder sheet to rename and recolour, archive and delete asking first, Undo in
toasts, card looks per folder. Built-in collections cannot be renamed or deleted (they are the catalog's); a learner
archives a built-in song for themselves. Practice's libraries take the same acts, with one difference the owner asked
for: **the built-in books are the learner's to arrange** (rename what they see, reorder, hide, move items between
books and their own folders), because nothing in a book changes by it: the names and places are the learner's
overlay over the catalog, and "Restore original" undoes it.

## 6. How a practice home says what to do

| App            | First thing on its practice home                                           | Order after it                                 |
| -------------- | -------------------------------------------------------------------------- | ---------------------------------------------- |
| Yousician      | "Today's workout": the next exercise of your path, one Play                | path, then challenges, then tools              |
| Simply Piano   | "Continue" the next step of your course, with its progress ring            | courses, then sheet music, then tools          |
| Flowkey        | "Continue learning" the last song or course at its exact point             | courses, songs by level                        |
| musictheory.net| Lessons first, Exercises second, Tools last (three columns)               | the learner reads, drills, then uses a tool    |
| Tonal (tonal.js docs) | n/a as a home; its scale/chord dictionaries are what our Theory pages are |                                   |

The common rule: **what to do next first** (one card, one action, saying why), **learning before drilling before
tools**, and tools last and compact, because a tool is reached for while doing something else (and is also in the
header's Tools menu). Practice today does the opposite: Tools first, a "Continue" that repeats two rows already listed
below it and records only rows tapped on Practice (a page reached from Search or a link never appears, a deleted page
id stays).

## 7. Decisions for the spec

1. Practice opens with a purpose line and **Up next**: up to three cards the learner's own data proves are next
   (skills due in the Quiz, the exercise to resume at its tempo, the last pattern or progression opened), each saying
   why; for a new learner, a "Start here" card. Continue goes.
2. Then the groups by relevance: **Theory**, **Play-along** (Accompaniment, Progressions, Chord player), **Training**
   (Exercises, Quiz), then **Tools** last and compact (four tiles in one row).
3. Every tool's settings in place; no settings page with one option; no gear that opens only the piano's rows.
4. The header's Tools: a popover (a sheet on a phone) with the live Metronome, the Tuner in place, the Circle of fifths
   in place, and the Chord finder as a row that opens its page.
5. Selection sheets say what is included and why (the level's set, or yours), with a check box per row and an example
   on each row.
6. The Chord player: equal chord tiles in a flowing grid per section, a tile tapped opens its chord sheet (symbol,
   length, bass, passing chords), dragged by a held finger or a mouse (one context, `useSortableList`, `DragOverlay`).
7. The libraries: Edit (the pencil beside the title) arranges places and items, built-ins included, as an overlay.
8. The sidebar: Claude's structure on a laptop, the phone's tab bar unchanged.
