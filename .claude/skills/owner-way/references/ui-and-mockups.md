# UI and mockups

How a screen gets built, and how a question gets drawn. The look is in `DESIGN.md`, code rules in `docs/CODE_STYLE.md`.

## Building a screen

1. **Read:** the area's section of `feedback-log.md`, its ADR (a refactor skips the ADR: `SKILL.md`, Loops and
   refactors), and the reference app's screens in `piano-data/reference-apps`.
   **Look at the examples before refactoring any control, component or page** (owner, 2026-11-16: "when you need to
   refactor a control and component a page … look at the piano-data examples and search by file name … and also
   search for example images in internet"): find the thing by its file name in `piano-data/reference-apps`
   (`ls piano-data/reference-apps/*/ | grep -i <word>`: members, settings, folder, sheet, menu, toolbar, picker), open
   every match, then search the web for screenshots of the same control in shipped apps, and cite what was looked at
   in the spec. **Mobbin** (the connector, `search_screens` and `search_flows`, iOS and web; owner, 2026-11-26) is
   the screenshot library for shipped apps: search the screen by its kind and the app's kind ("music learning app
   sign in screen"), look at the images, and cite each by its `mobbin_url`.
   Dorico and Flat (`dorico/`, `flat-score-editor/`) come first and are looked at most;
   `piano-chords-and-scales-app/` is a welcome source for any screen. `music-theory-book-app/` is for its learning
   content only, never as a UI example. The app's own old screens are never an example.
2. **Look at it today:** shoot the current screen before changing it, so you know what it does.
   **Question every part of it** (owner, 2026-11-16: "you shouldnt just take the current app design as so it should
   be … you should question every decision and every component that is on the page or in app so that we dont have
   unneded components unneded pages, duplicate content … are the tabs correct? do we need them. should we migrate
   them, should we somehow merge them. what content can be shown easier or what is already know by the user"): what
   is drawn today is a draft, never the spec. Before any polish, list each page, section, tab, control and line of
   text, and for each ask: is it needed; does it say again what another part (or another page) already says; would
   it merge with a neighbour or move to where it is used; could a picture or the music show it more simply; does the
   learner already know it. Remove, merge or move what fails, in the same turn, and say in the spec what went and
   why. Polish only what survives.
   **Between pages and across the app too** (owner, 2026-11-16: "you should also check between the pages for these
   thigns and across the app"): the same questions are asked of the page against its neighbours and the whole app:
   two pages that show the same thing (a key's facts on Scales and on the Circle of fifths, a chord's tiles on Chords
   and on Scales), a page that only repeats a section of another, a tab or a page that could be a section of its
   parent, the same content explained in two places, the same act reachable two ways. One home is kept for each
   thing; the others link to it or go.
3. **Load `impeccable`:** `.claude/skills/impeccable/scripts/impeccable context --target <path>` once a session, then the command's
   reference, and `.claude/skills/impeccable/reference/craft-floor.md` right before the first edit. Our screens are Operate; lessons and How to use are Read.
4. **Design in four phases, each checked before the next** (owner, 2026-11-17, the mebis course "Grundlagen", Softwareergonomie: "Skizzen … Wireframes … Mockups", then the prototype; "in jeder Phase spielen die Prinzipien der Softwareergonomie eine entscheidende Rolle"):
   1. **Sketch:** the flow before any screen: which pages, what each is for (one line), what is on it as a list of parts in order of relevance, and every link between pages (where Back goes, what opens what). Written in the spec; questioned as step 2 asks. No look yet.
   2. **Wireframe:** the structure at the real device sizes, no colour and no words: `lines.mjs` with `WIRE=1` draws a board as grey boxes. Judge here what structure decides: one focal point, groups by proximity, edges, the frame shared with sibling pages (the flow), what floats. A screen that does not read as boxes will not read in colour.
   3. **Mockup:** the look on that structure: `DESIGN.md`'s tokens, real songs and labels, both themes; the lines and `seven-questions` run on it.
   4. **Prototype:** every tap works on the canvas (sheets, menus, states, Undo), then the two passes; only then is it ported.
   Each phase is held to the five E's (effective, efficient, engaging, error tolerant, easy to learn) and the laws in `edge-lines/references/laws.md`, its spacing ratios and its 15 information-architecture checks (the sketch: rules 1–3 and 7–15; the mockup: 4–6) among them. A change to an existing board starts at the phase the change touches: a moved section is a wireframe change, a colour a mockup change.
5. **Build what the board's code draws** (`SKILL.md`, Port from the board's code): read the board's generator and
   its kit helpers first, then `shared/ui/index.ts`. Where a kit part or token differs from the board, the kit part
   or token changes to the board's values, everywhere it is used; a part the board draws that the kit lacks is
   built. Never keep an app part because it exists.
6. **Write the test first,** then the screen; in a loop or a refactor, no tests (`SKILL.md`, Loops and refactors).
7. **Every state:** loading, empty, error, offline; every control's hover, focus, disabled.
8. **Both languages,** in the musician's terms, the Russian written rather than translated word for word.
9. **Two passes** ([testing](testing.md)), each with an `impeccable` check of this page (`critique` or `audit`, then
   again after the fixes), page by page as it is built, never only at the round's end.

## Rules for every screen

**Actions**

- One way to each action. Adding a direct way removes the old one.
- **Nothing the owner did not ask for** (owner, 2026-11-26: "remove all the thigns that i didnt asked for, make more clean interface"): a part stays when a ruling asked for it or the page cannot work without it; a feature drawn on our own initiative, a line that repeats what is beside it (a name over a staff the pickers name, credits printed twice, "Lesson n" under a numbered spine), or a second home for another page's job goes.
- A screen's own actions go in its bar. **What creates or adds floats** (owner, 2026-11-17: "use proper floating
  actions and like add to library in this add buttons floating"; Flat's floating +): the + that creates on a library,
  and a detail page's one act (Add to my library, Open in my library) as the honey floating action at the bottom
  right, so the page has one focus and the act is always in reach. One floating action per screen (Material 3: "Don't
  display multiple FABs on a single screen"); any other act sits on what it acts on (Play at the head of the music it
  plays; NN/g, closeness of actions and objects). Never two acts of different weight in one box in the content.
  Cards, focus, edges and gaps are judged by `edge-lines`. One gear per screen, Edit beside the title.
- Creating anything is a New sheet: a name, a few properties, one Create at the foot.
- In a list of people or things, Add is the list's last row, and a folded list's "Show all n ›" is a quiet link under the card, below Add (owner 2026-11-16); a row's own acts sit behind its ···; the loss of the
  whole thing is its own card at the page's foot (Noji's Participants and deck settings; owner 2026-11-16). Never a
  New field inline above a list, nor loose Add or Delete links.
- Reorder by dragging a handle, by mouse and held finger, never Move up or Move down.
- Menu items are short ("Remove"); the menu's label names the thing.
- **A ··· opens a menu at its button,** on a phone as on a laptop (owner, 2026-11-17: "what kind of nonsense is to put
  this delete in this cnetered popup with doen button"; Apple HIG, Pull-down buttons; Material 3, Menus): the kit's
  `ROWMENU`, placed by `ANCHOR` from the button, below it or above when the screen ends first. No title, no Done, no
  Cancel; the loss last, in crimson, after a hairline; a tap outside closes it. Never a bottom sheet, never a dialog
  centred on the screen, and never a menu of one item. What a laptop shows centred is only a form (New song, New
  playlist), a question about a loss that cannot be undone (`ConfirmDialog`), or Settings, which on a laptop is a dialog over the page as claude.ai's (owner, 2026-11-17); a phone sheet never becomes a centred
  dialog on a laptop by itself.
- **Every list of the learner's things has Select** (owner, 2026-11-17: "why dont we have a select mode in such pages as
  trash and archive"): the library, a playlist, Archive, Trash, Your lessons. Select in the bar (Cancel while on, the
  bar's title "n selected"), a checkbox leading each row, the floating glass selection bar at the foot with the acts on
  what is picked, or on all when nothing is (Apple Photos' Recently Deleted: Recover All, Delete All). A bulk act
  (Restore all, Empty Trash) is Select's, never a button of its own in the bar, and a row carries no act button beside
  its ··· (no Restore pill on every row): one act per row, the rest in its menu.
- Undo instead of asking: a loss that can be undone happens at once with Undo in its toast; only what can't be undone, or
  reaches other people, asks first. A loss is named as one, truly.
- One icon, one meaning, app-wide: the same thing wears the same icon and word on every screen; check what it wears
  elsewhere before choosing ([ux-principles](ux-principles.md)). Two acts kept together get two distinct icons.
- Close is related: a control sits beside what it changes; groups are closer inside than apart.
- Ordered by relevance: what the learner came for first, the rarely used and the dangerous last and apart.
- Show only what works here. A control that does nothing for what is shown goes.
- If a control's effect cannot be seen or heard, it is wrong.

**Layout**

- Every bar and floating button is glass; a bar has no background band or line (`DESIGN.md`, Placement; Apple's
  grouping rules in `.scratch/r39/plan/bars.md`). Glass never goes on content.
- Phone and desktop have the same features, text and layout logic.
- Nothing hangs under a bar: a status or language goes in the bar or its menu.
- Floating things float, reserve no space, and auto-hide reliably. **The scroll's end clears them:** at the last scroll
  position nothing readable or tappable lies under a floating action (Material 3, FAB placement; iOS content
  insets); a place with the tab bar and a + ends its column 176 above the screen's foot.
- **No control reserves space it does not use** (owner, 2026-11-17, the lesson: "the drag handle reserves space … other
  controls else can have this issues? fix all the instructions that made you do this"): a page's column starts on the
  16 gutter on a phone (the bar's 12 inset plus the glass's own 4, as every list), and the first content stands 8–16
  under the bar. An edit handle, a ···, a number or a check that shows only in one mode is drawn over its block when
  it is wanted (the selected block's grip and ··· float at its top right, glass, Notion and Craft on iOS), never
  as a margin kept empty in every mode. Edit looks as it reads: entering it moves nothing. `lines.mjs` fails a
  column that starts further in with nothing in the band at its left, and a bare band under the bar.
- **The page has one focus, and what floats is centred on it** (owner, 2026-11-16: "the floating controls like in the
  scales page should be centerd by the main focus content … the practices on the right robs the focus from the main
  content and the floatign actions feel wrongly placed … all of the main content should be correctly focudsed"): the
  main content (the scale, the interval, the chord, the progression) is one centred column that leads the page; what
  follows from it (practise rows, related links) reads after it in the same column, never as a rival column beside it.
  A floating bar of the page's controls is centred on that column, not on the window or between two columns. A
  sidebar of the app's places is not content and does not count.
- Nothing traps a click. Controls never jump between modes or on entering Select.
- Rows and grids stay even on wide screens. A card's hover never hides a button's inside it.
- Nothing is cut: titles wrap to two lines; rows in a rounded card keep its corners.
- The phone's tab bar shows on the four places alone and hides on what they open and under the keyboard. A selection's bar
  takes its slot.
- Fill the screen and calm the page: no half-empty laptop screens, no 6,000px pages; folds with a summary, "Show all n".
- Tabs never make a page's header taller than other pages'.

**Words**

- Explanations go in ⓘ popups, never under a control.
- Real musical language, checked against `piano-data/books`, Flat and Dorico. A name is the musician's term, never a
  paraphrase of it: Chromatically, Circle of fifths, Diatonically, Wait mode, Hands together; never "up by half steps",
  "round the circle", "through the key of", "waits for you". An option carries no explanation line; at most an example
  of its music (C D♭ D E♭ …) or an ⓘ. A source is named as
  the musician names it ("Hanon", "Barry Harris").
- No hardcoded text on the score, no labels the learner did not write.

**The score**

- Everything printed is editable where it prints.
- Remove UI the score makes redundant: a tap on the staff picks the staff.
- Selection is tight to the notes, the same in every layout and in both modes, and never picks empty space.
- The playhead is one line across the staves in sight.
- Staves are plain staves: add, remove, name, hide.

**Motion**

- Strips and diagrams animate and swipe on their own; the page never moves.
- Tapping a chord moves the cursor; it opens no dialog.
- No flash of the other layout.

## Mockups

The owner decides by seeing. "I need more context how it will look like" means the mockup was missing or too small. A
question about a screen is always a drawing of that screen.

### What a mockup is

One canvas holds every place (v15): The ideal Piano Trainer, built by `.scratch/r39/canvas/index.py` from the r39 kit
(`r41_kit.py`, `calm_kit.py`). Each area is a page of it, every page and option of that area drawn on it; a place
drawn elsewhere is merged in, never left in a canvas of its own. On each area's page, four rows (canvas 100–101): the
flow's phone boards in order, their Night boards, the laptop boards, their Night boards.

- **The whole screen, never the control alone:** bar, toolbar, content, floating actions, tab bar.
- **Phone and laptop** for every option: the phone is the owner's iPhone 17 Pro, 402×874, the board's screen at 24,23
  in its 450×920 frame (`.scratch/r30/mockups/iphone-17-pro.png`); the laptop the owner's MacBook Air, the 1710-wide
  page (`macbook-air.png`, `safari-light.png`, `safari-dark.png`). The smaller 393×852 phone is a check, not a
  board (`testing.md`); the iPhone 17 Pro in Safari (`iphone-safari.png`, its floating bottom bar over the page) is
  drawn where a question depends on the browser's bars.
- **Real parts:** `DESIGN.md`'s tokens copied in as CSS variables, Literata and Onest, the app's real 44px sizes, corners,
  icons and honey. It must read as our app.
- **Real content:** a real song, real chords, the exact English label each control will carry; checked in English
  only (owner, 2026-11-16). No lorem ipsum, no "Hymn 1", no internal names.
- **Both themes,** Night as its own boards in its own row, never a toggle. Options the owner settles by eye are drawn
  side by side, labelled A and B.
- **What does not change** is drawn too, so the owner sees the option in place.

### Each question

Numbered, so the owner can answer "1. yes 2. …", and in this order:

1. **Where:** the screen and route.
2. **What changes for the learner,** in their words.
3. **The options, drawn.**
4. **Your recommendation and why,** naming the reference it comes from.
5. **A feedback box,** one per page, kept in the artifact, so the owner writes in the order they scroll.

### Making it

1. Load `artifact-design`; load `artifact-capabilities` for the feedback boxes, which need saved state.
2. Copy tokens from `src/styles/tokens.css`; shoot the real screen to know what it does today. A port runs the
   other way: from the board's code to the app, never from the app's look to the board.
3. Publish to the one canvas with the Artifact tool and give the link; every later turn updates it, keeping its URL.

### Testing a mockup twice

A broken drawing wastes the owner's time as much as a broken screen.

**Check 1, the render:** open it at 402 and 1710 wide (and the 393 check), Day and Night. Nothing overflows, every frame shows its whole
screen, every font loaded, every toggle and box works.

**Check 2, as the owner:** read it from the top with no context from this session. Can each question be answered from the
page alone? Does each option look like our app beside a real screenshot? Is any word internal? Does any option break a rule
above or an earlier ruling in `feedback-log.md`? Is the difference between options visible at a glance?

Each check includes an `impeccable critique` of the mockup itself, so every mockup is checked by impeccable at least
twice. A change after Check 2 means running it again.

### Reading the answers

| The owner says                          | Do                                                    |
| --------------------------------------- | ----------------------------------------------------- |
| "yes", "yes maybe"                      | build it, refined by best practice                    |
| "maybe"                                 | recommend and decide                                  |
| "use proper decision"                   | research, decide, log the ruling                      |
| "I don't like neither"                  | new options, drawn                                    |
| "I need more context", "I don't understand" | redraw with the whole screen and ask again        |
| "continue without my feedback"          | apply the same patterns to the pages they skipped     |

Read all of it, apply it, answer each comment in the artifact, and keep it current. The answer becomes the item's spec, in
the owner's words where they gave words.
