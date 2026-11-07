# Lessons from design videos

The owner pasted these transcripts on 2026-11-07. They are read as data, and only what fits a calm music-learning app is
kept here. Sponsor reads (Mobbin, Relume, Lovable, UX Peak Plus) and sales pitches are left out. `DESIGN.md`,
`CLAUDE.md` and the owner's rulings win; where a video argues against one of them, the conflict is listed at the end
for the owner.

## Tim Gabe: why people trust products that look made with care

Three videos: "made with care", "the commodity ceiling", and the Undertone case study.

- **Decide what premium means before drawing.** Neither "make it pop" nor "make it premium" tells a designer anything.
  Name the feeling for the buyer (calm and warm, or sharp and fast), feed real screens from real apps as references
  instead of adjectives, then a designer's rules (the craft skills), then **one thing only we would make**. For us
  that is the engraved score, the hands at the keys, and the musician's own words.
- **"Fine" is the floor.** About nine in ten AI-built pages land in six looks. A clean screen says nothing about
  care; the decisions only this product would make do.
- **Evidence of a good product lives in three places above that ceiling:**
  1. **What AI leaves out ("design theater").** Show what the system is doing, let the learner take it back, and
     help them recover from an error. Walk the core flow and check three things at every step: what just happened,
     how to take it back, and what to do next. "I was expecting anything instead of nothing": a dead end is where
     learners are lost.
  2. **The connective tissue.** A learner sees screen 80 beside screen 1. The same situation gets the same pattern
     everywhere (Undertone's "2 of 2 sessions used", with the date they refresh, on both screens that said "you've
     used all your sessions"). Moving one navigation bar doubled time on a page, and people said it hadn't slowed
     them down. Use the app for an hour as a learner would, and note every place it stops feeling like one product.
  3. **The worst moment.** Break it on purpose: go offline mid-flow, fail a save or a sign-in, empty every list.
     Design those states as carefully as success. A failure handled well can leave people happier than no failure
     (the service recovery paradox).
- **Find the moment learners come back on their own**, from aggregates (never a learner's data), and make that the
  best screen in the app, not the weakest. The peak-end rule: an experience is remembered by its peak and its end.
  For us that is likely finishing a piece or a lesson.
- **Move friction into a flow people are already motivated to finish,** and answer "does it work, and what will it
  give me?" before they reach the empty app.
- **While something works, name its steps** (Undertone's island: transcribing, anonymising, summarising) instead of a
  bare spinner.
- **Settle the visual language before fixing flows,** so every fix comes out as the same product.
- **The site is built from the product's own parts,** the same way the product itself is.
- **Fit the person:** Undertone's brief was "nothing clinical, nothing cute". Ours is a learner at a piano.

## Kole Jain: mobile, intent, and building a look

- **Phone is not a squeezed laptop.** Type and targets stay as large or get larger: iOS body text is 17px and macOS
  13px. A laptop dashboard shows five things; a phone shows one.
- **One direction per section on a phone:** stack vertically, or scroll sideways, never both.
- **Four building blocks:** cards, text and links, images, inputs. Don't nest a card in a card (padding on padding);
  group with space instead.
- **One screen does one thing.** Something new opens a page; a choice made in context opens a bottom sheet (title,
  search, a list, Done).
- **A bottom bar has three to five places,** each target at least 44px. Actions are contextual: they come and go with
  what is being done (an editor hides the tab bar and shows its own tools).
- **Gestures:** swipe back with the page behind sliding at about 35%; a sheet zooms the page behind it; a long press
  is the right-click (blur the rest, lift the item, show its actions).
- **Two empty states.** First run: point at the main action. No results: say nothing matched those words, suggest
  near spellings, and give a way out.
- **Intent costs time, certainty or trust:**
  - Wait (a double-click delay) only when two actions compete for the same press.
  - Keep a submenu open while the pointer travels towards it (the menu-aim triangle).
  - After the first tooltip has shown, show the rest at once.
  - Dragging near an edge scrolls, faster the closer the pointer is, and shows where the item will land.
  - Act first and offer Undo for what can be undone; settings and editors save themselves, with history to go back.
    Ask first only when it truly can't be undone (sending to many people, money).
  - A button commits when it is released (dragging off cancels); a menu opens when it is pressed (press, drag,
    release on an item).
- **A look comes from one image and its world:** take colours from photos of the subject, add one texture and one
  serif for personality, and draw icons in the accent. Combine references section by section ("Frankenstein"), then
  keep only the wireframe.
- **Motion has an identity:** one or two moves repeated throughout, which guide the eye from one focal point to the
  next.
- **Train the eye:** pull a screen apart (proximity: subtext 8px, eyebrow 12px, buttons 32px; hierarchy by opacity as
  well as size), copy a screen exactly to learn its measures, then restyle it twice.

## UX Peak: psychology and product-page craft

- **Smart defaults:** 70–90% of people never change a default, so a default reads as a recommendation. Pre-select the
  usual choice, and let the button say what will happen ("12 results").
- **Never start at zero:** count what the learner has already done (goal gradient).
- **Give before asking:** show real value before an account (reciprocity). Our accounts are already optional (ADR 0116).
- **What they build is theirs:** letting the learner make something before asking anything (the IKEA effect) fits our
  learners' own lessons and songs.
- **Hierarchy:** the value outranks its label (591, not "Sales"). Use size, weight, colour and an icon, not "label:
  value" rows.
- **The product page's fifteen mistakes, as rules:**
  - An icon over an image gets a backing so it works on any picture.
  - Images are chosen as a set that sits together in a grid.
  - Everything sits on one grid with the same margins.
  - Colour supports the content and doesn't compete with it.
  - One type family, with hierarchy from size and weight.
  - A small uppercase label gets a little letter-spacing.
  - Badges are short ("20% off").
  - The rating sits next to the title.
  - Body text gets enough line height and slightly less contrast.
  - Icons share one style.
  - Dividers are soft.
  - Spacing expresses relationships: closer means related.
  - No redundant labels ("Price" before a price).
  - A title never contradicts a control.
  - The amount sits next to the action, the total is on the button, the action stays visible, and common presets
    sit beside a custom choice.
- **Adapt to where the learner is:** new, returning, or deeply engaged see different first screens.
- **Search starts with help:** recent searches, popular items and suggestions, never a blank page.
- **After an action, a status screen** that answers questions before they are asked.
- **Choose the input by frequency:** a wheel or slider for a one-time value in a known range; a field or stepper for
  precise, frequent entry.
- **Shadows**, where used, are soft and tinted with the colour of the background behind them.

## John (Meta engineer): shipping an app that feels good

- **Plan with a goal and a test for done:** the features, the screens, the references, and screenshot checks.
- **Make it your own:** take what works elsewhere and add one twist.
- **"Feel good" is hand iteration:** play with it until each drag, landing and finish feels right, with small sounds,
  sparkles and moving characters where they suit the product.
- **QA by breaking it:**
  - no network, empty states, the largest text size;
  - leave the app and come back, and check the state survives;
  - tap fast and repeatedly;
  - the keyboard covering a button;
  - a notification that opens the wrong screen;
  - animations frozen after a detour.
- **The non-functional list:** performance (no dropped frames, images no larger than their space), accessibility at
  maximum text size, reliability across background and restore, security.

## Tim Gabe: progression that keeps people coming back

Tim says himself that these mechanics are morally complicated: they can build a habit or trap someone. We use them to
build the practice habit, under the honesty rule below.

- **Mostly predictable rewards, with a little controlled surprise:** an unexpected bonus, or a milestone that arrives
  early. Never a slot machine: nothing is random by design to keep the learner chasing.
- **One visible measure of total progress** draws more than twenty scattered badges (Finch's six traits, League's
  points). For us that could be one practice record: pieces learned, minutes at the piano, the streak.
- **Streaks that compound into something worth keeping,** not a counter that just resets: milestones at 7 and 42
  days, a freeze that is earned.
- **No "done" state:** totals that never cap (classes, miles, output), so there is always a next milestone.
- **Progress others can see** (Strava segments, Peloton's leaderboard): when progress is visible to others, a goal
  becomes part of who the learner is. Here that means groups and the public profile, and only where the learner
  chooses to show it.
- **Human connection makes the score matter:** a teacher, or a group calling out progress.

## Kole Jain: beginner mistakes, fixed one at a time

- **Plan the flow before drawing it:** every choice has a Skip, an "other" with search, and a way back. The pieces
  people miss are navigation links, hidden states, hover and pressed states, and micro-interactions.
- **Effects sparingly:** no two-hue gradients (one hue at most, usually none); soft shadows or none; less visual
  noise is better design.
- **A grid and room to breathe:** align to columns, give stacked content more vertical space than seems needed on a
  phone, and lay groups out with one consistent gap.
- **Identical components:** two search fields differ only in their placeholder; small controls share one radius;
  Back and Skip match in size, radius and style. Styles for colours, variables for measures, components for parts.
- **Icons:**
  - An icon on a card saves reading.
  - Icons in one area share fill, stroke and style.
  - A rare icon gets a label or a tooltip.
  - Separate areas may use different icon styles: the bar, the content and the badges.
- **Remove what is redundant:** an arrow where a swipe does the job, a stroke that adds nothing, a second way to the
  same place.
- **Feedback at once:** a pressed button dims, or shows a spinner when the wait is long; saving something puts a dot
  on the tab where it went.
- **Charts are read, not admired:** a value axis, flat bar ends, and one bar per thing counted (seven days, seven
  bars).

## An AI-coding channel: getting AI-built sites to look designed

- **Give the model a design system,** not "make it beautiful". Ours is `DESIGN.md` and the theme tokens. The canvas
  works from screenshots of the screen itself and of the reference apps.
- **Proven components over generated ones,** where a library does the job well (shadcn here).
- **Animate sparingly, and name the exact effect wanted.** "Make it animated" gets everything moving.
- **Type carries the feel:** a face chosen for the subject. Ours is Literata for what is named and Onest for what is
  read and pressed.
- **Name the responsive layout exactly:** for example a bento grid that becomes one column on a phone. "Responsive"
  alone isn't enough.

(A data-structures video, sponsored by InsForge, has nothing for design and is not used.)

## Rulings the videos led to

- **Undo instead of asking** (owner: "adopt also this"): Kole Jain's act first and offer Undo replaces "a loss asks
  first". Only what can't be undone, or reaches other people, still asks. The port is `.scratch/r38/plan/undo-and-loss.md`.
- **A loss is shown as a loss** (owner: "i don't like your rejection"): UX Peak's loss framing is adopted, kept true:
  the learner's own things named, the way out naming its cost, never an invented countdown or scarcity.
- **Shadows for depth** stay out: `DESIGN.md` parts cards by surface and a 1px line.
