# UI and mockups

How a screen gets built, and how a question gets drawn. The look is in `DESIGN.md`, code rules in `docs/CODE_STYLE.md`.

## Building a screen

1. **Read:** the area's section of `feedback-log.md`, its ADR, and the reference app's screens in `piano-data/reference-apps`.
2. **Look at it today:** shoot the current screen before changing it, so you know what it does.
3. **Load `impeccable`:** `.claude/skills/impeccable/scripts/impeccable context --target <path>` once a session, then the command's
   reference, and `.claude/skills/impeccable/reference/craft-floor.md` right before the first edit. Our screens are Operate; lessons and How to use are Read.
4. **Use the kit.** Read `shared/ui/index.ts` first. Tokens only, never a raw value. A new kind of thing joins the kit only
   when it has a second user.
5. **Write the test first,** then the screen.
6. **Every state:** loading, empty, error, offline; every control's hover, focus, disabled.
7. **Both languages,** in the musician's terms, the Russian written rather than translated word for word.
8. **Two passes** ([testing](testing.md)), each with an `impeccable` check of this page (`critique` or `audit`, then
   again after the fixes), page by page as it is built, never only at the round's end.

## Rules for every screen

**Actions**

- One way to each action. Adding a direct way removes the old one.
- A screen's own actions go in its bar; the floating + only creates. One gear per screen, Edit beside the title.
- Creating anything is a New sheet: a name, a few properties, one Create at the foot.
- Reorder by dragging a handle, by mouse and held finger, never Move up or Move down.
- Menu items are short ("Remove"); the menu's label names the thing.
- Undo instead of asking: a loss that can be undone happens at once with Undo in its toast; only what can't be undone, or
  reaches other people, asks first. A loss is named as one, truly.
- One icon, one meaning, app-wide: the same thing wears the same icon and word on every screen; check what it wears
  elsewhere before choosing ([ux-principles](ux-principles.md)). Two acts kept together get two distinct icons.
- Close is related: a control sits beside what it changes; groups are closer inside than apart.
- Ordered by relevance: what the learner came for first, the rarely used and the dangerous last and apart.
- Show only what works here. A control that does nothing for what is shown goes.
- If a control's effect cannot be seen or heard, it is wrong.

**Layout**

- Phone and desktop have the same features, text and layout logic.
- Nothing hangs under a bar: a status or language goes in the bar or its menu.
- Floating things float, reserve no space, and auto-hide reliably.
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
- **Real content:** a real song, real chords, the exact English label each control will carry, one Russian check of the
  longest string. No lorem ipsum, no "Hymn 1", no internal names.
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
2. Copy tokens from `src/styles/tokens.css`; shoot the real screen and redraw from it.
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
