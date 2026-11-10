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

## A UI-design channel: dashboards, slop pages, motion and depth

Four videos (the channel's sponsor code reads "sided").

- **Fix where things go before how they look.** The numbers the learner came for come first. Each filter sits beside
  the thing it changes, never in a block above it.
- **One product:** every control uses the page's type, no browser-default control is left showing, there is one
  radius for controls and a larger one for cards, and the greys are tinted towards the accent.
- **Grey first, then colour for a job:** the data and whatever is switched on. A button, a tab or a page number is
  not accent-coloured just because it can be.
- **A number needs something to compare with:**
  - The number stays the largest thing on its card.
  - Under it, the change since last week, with an arrow for its direction.
  - Good or bad is shown by emphasis, not by red and green.
  - Everything around the number is played down.
- **A chart answers a question in a second:**
  - an axis and soft grid lines;
  - a tooltip with the real value;
  - last period as a dashed grey line to compare against;
  - a line in a colour that has contrast in each theme.
- **Cut every control that duplicates another,** and update live; no Apply button. Pick the right kind of control:
  a switch for on and off, checkboxes when several can be chosen, a slider whose two ends are labelled with what is
  being traded.
- **What real apps have:**
  - A hover state on everything that can be pressed, and on table rows.
  - Numbers in a table aligned right.
  - Icons and logos where they speed spotting.
  - A way to tell where you are.
  - Profile and Settings where people look for them.
  - The system theme followed, with the accent changed per theme where it would lose contrast.
- **Slop is a page made of defaults; premium is a page of decisions.** Six steps, the same for any product:
  1. A typeface with a job.
  2. An axis off the centre.
  3. Grey plus one chosen accent; never a purple gradient.
  4. Specific words and real proof instead of made-up logos and numbers.
  5. **A centrepiece that demonstrates the product working** (for us: a real score playing, the keys lighting).
  6. The same care carried down the page, with every motion showing something true.
- **Motion technique:**
  - One highlight slides to the chosen item rather than each item lighting up on its own.
  - What is added flies to where it went, and the count changes when it lands.
  - A failed field shakes.
  - A shape morphs only between paths with the same number of points.
  - The video's `transition: all` is not used here: name the properties.
- **Depth from shades of one colour:**
  - Three or four steps of lightness, the lighter one on top.
  - A "small shadow" made of a light inset line at the top and a soft dark shadow below.
  - A recessed track (a progress bar) gets an inner shadow.
  - To play something down, set it a step darker.
  - Average to good costs far less than good to excellent; depth is a cheap step there.

## AI Labs: Benji Taylor's stageshow

- **Taste is mostly small decisions, written down,** so the agent can follow them. `stageshow` is Benji Taylor's
  process for landing-page demos, now installed.
- **A screenshot on a landing page is too much to read; a generated demo is generic.** A demo is a stripped-down
  working copy of one screen:
  - three to seven real words, bars for the rest;
  - one story in three to five beats, over 10 to 16 seconds;
  - a cursor that curves like a hand;
  - a loop whose last frame matches its first.
- **The phone gets its own design,** not a shrunk copy.
- **Start from the closest real example and copy it,** rather than working from rules alone.
- **Check the motion, not only the still:** film it, lay the frames side by side, and look for text that doesn't fit
  and anything that jumps. Fix the worst first and film again. A check finds mistakes but not a boring idea, so watch
  it yourself.
- **Feedback goes back into the skill,** so the next demo doesn't repeat the mistake.
- For us, `stageshow` is the tool for the Explore and landing pages, and for any picture of the app in Learn or in
  the store.

## UX Peak: junior, mid, senior and staff (a list, then its filters)

- **A list:**
  - **The picture is of the thing, big enough to want it.** 56px only identifies; appetite needs real space.
    "Above the fold" is a myth: everyone scrolls, so what matters is whether the first thing seen makes them go on.
  - **One shape language** across a screen: the same rounding everywhere, not square corners beside circles.
  - **Hierarchy you can scan:** the name, then the rating, everything else quieter.
  - **Quick filters visible as chips,** with a Filter button for the rest and Sort beside it.
  - **A count of what is being looked through** ("640 places").
  - **A cards or list switch,** where no single default suits everyone: big pictures invite, a list compares.
  - **A search placeholder that says what can be searched** ("Places, dishes or cuisines").
  - **Details off the picture,** so every card looks the same whatever its picture; a "best match" label where the
    app knows the person.
  - **Category icons drawn for the app,** quieter than the content, rather than stock photos competing with the
    items below them.
- **Filters (four versions of one filter screen):**
  - A filter helps people narrow down while they are still working out what they want, so connected choices are
    shown together: one sheet over the results, in one scroll. Never a page for each filter, where every choice is
    made blind to the others.
  - A range gets a slider for quick exploring plus fields for an exact value.
  - A known small number gets a row of options (1 · 2 · 3+ · 4+), not a stepper. "3+" means at least three, and a
    range can be chosen by tapping two options.
  - The button says what it will return: "Show 41 homes".
  - The senior version puts a histogram behind the range, showing where the choices cluster. The staff version
    adds:
    - how many fit the current filters ("459 of 1,557");
    - each option's count before it is chosen;
    - the person's own limit drawn on that histogram, worked out from what they actually know (a deposit and a
      monthly payment, not a maximum price).
  - The cost is a busier screen: keep only what helps the decision.
- **For us:** the Pattern page's Sort and filter could show each chip's count before it is chosen ("Advanced 6"),
  and the Songs filter the same. Our ruling opens Sort and filter as a page with Back (Flat), where these filters
  use a sheet over the results; both keep every choice in one scroll with "Show n" at the foot.

## The same UI-design channel: colour, components, "don't make me think", typography

- **Colour is neutrals, one brand colour and the state colours,** each as a set of shades. Shades come from
  lightness, in a format where the numbers mean something (OKLCH here, as in Tailwind 4).
  - A neutral background has three steps: base, surface and raised. The lighter one sits on top and is used only
    for what matters.
  - Text has two shades, a sharp one and a muted one, never pure white on black.
  - For light mode, start from 100 minus the lightness, then correct by eye: the top layer is still the lightest.
  - In dark mode, a lighter top edge reads as light falling from above. In light mode the edge matches the card,
    and depth comes from a short dark shadow mixed with a long light one.
- **Components with props, built once:** the same card or section with different content is one component, never a
  copy. Colours and spacing are variables, never a literal.
- **Don't make me think:**
  - Conventions win: a button looks like a button, and search is a magnifying glass.
  - One obvious next step. Where the way splits, say exactly which way and show it.
  - Simple is not bare: everything needed to decide is there, and nothing that competes with it.
  - Scannable text: people click the first reasonable option, so make the right one the most obvious.
  - Map the flow for one named person before drawing it.
  - To settle an argument, watch a first-time user try the task here and in a rival app.
- **Typography:**
  - Group and separate with size, colour, spacing and weight, as a reader sees them.
  - To make one thing stand out, play the others down: lower their lightness rather than raising the one.
  - One base size (14 or 16px) and two pixels either side covers almost everything; weight and colour do the rest.
  - Line height is the gap below text, and sizes are in rem.
  - The heading level in the code is for document order; the size on screen is for importance.
  - A number that changes is designed at its longest value.

## AI Labs: eight skills for making videos

Hashu Motion, Ross Arc Motion, Take One, Reanimate, Argo, ExplainRoo, Video Director and Earshot. They make launch
films, character animation, copied motion, recorded app demos, explainers and soundtracks. None is installed: they
make marketing video, not app screens, and some run large local models. The lessons that carry over:

- **A reviewer that never saw the work scores it,** and the work goes back until it passes (up to three rounds).
- **Copying motion from a reference:** record both frame by frame, compare them side by side, and fix whatever is
  furthest off first.
- **An animated character keeps a notes file** of what it can and can't do, and every part of it moves on one
  timing.
- **A demo of the real app** is recorded by clicking through it, with labels and highlights steering the eye; the
  app's own screens, never a template.

## Ben (AI agency founder): keep the setup clean ("detox")

- Every skill description, connector and line in `CLAUDE.md` loads into each session, so unused skills cost context
  and can fire by accident.
- A skill that should run only when asked for gets `disable-model-invocation: true`.
- Rules go stale and contradict each other; when a better model arrives, try removing instructions first.
- Audit regularly: skills unused or overlapping, `CLAUDE.md` pointing to places that moved, rules that contradict.
- Applied here (2026-11-07): ten of the installed skills now run only when called by name. They are `stageshow`,
  `agentation`, `agentation-self-driving`, `ask-sonner`, `animation-vocabulary`, `fixing-metadata`,
  `create-canvas`, `component-canvas`, `create-design-md` and `ui-skills-root`. `prototype-variants` and
  `pick-ui-library` were already so.

(A data-structures video, sponsored by InsForge, has nothing for design and is not used.)

## A Firecrawl video: Scrape or Interact (transcript, with the scrape skill and the Interact snippet)

A tool for research, not a design lesson. Kept for how this repo's sessions fetch pages.

- **Scrape** reads one known page (markdown, JSON by schema, links, a screenshot); it renders JavaScript, and may
  serve a cached copy unless `maxAge: 0`. **Interact** starts from a scrape and drives a real browser by prompt or
  Playwright code across calls; it is billed by the browser minute, so stop the session when done.
- **Use here:** when the Firecrawl connector is attached, `firecrawl_search` then `firecrawl_scrape` for reference
  apps' manuals and teaching pages, before guessing a convention. Scrape to read, never `query` (five extra
  credits) when the markdown answers it.
- **The owner's rule stands over the tool:** a site's bot check is never got around. Pass `proxy: "basic"` on
  every scrape (the default escalates to a stealth proxy on its own), never `stealth` or `enhanced`, and do not
  use it to reach a site that refused this session. A 403 through it is a refusal: stop, name the page as unread.
- **Not used:** Interact (logins, clicking through flows) has no place in reading public help pages; installing
  the CLI skill or adding an API key is the owner's decision.

## Kevin (AI and tech explainers): Matt Pocock's agent skills, v1.3 (transcript)

How the work is run, not how a screen looks. The repo already carries most of these skills (`grilling`, `prototype`,
`tdd`, `code-review`, `domain-modeling`, `research`).

- **The agent fills every gap with a guess.** One sentence from the owner ("improve the hands") hides a tree of
  decisions; a longer prompt only holds the ones already thought of. Facts are the agent's to look up; decisions are
  the owner's.
- **Grill before building, when rounds keep bouncing.** After two rejections of the same part, stop drawing: put the
  open decisions to the owner with a recommended answer each, the parent decision first, and build only when they
  are settled. `grilling` (v1.3) asks every open question whose parent is settled in one numbered round.
- **What cannot be settled by talking gets a prototype:** a few versions that look nothing alike, to click and pick
  from; the canvas is that, but with the variants side by side, not one guess per round.
- **Keep the glossary:** one line per term and the words to avoid (`CLAUDE.md`'s "Words in code", the avoid-words
  test). "Wait, what?" means say it again plainly.
- **Slices, a fresh head each; review at another desk:** a reviewer that never saw the work reads it against the spec
  and against the standards.
- **Retro before the chat is cleared:** what the agent struggled with becomes a check where a machine can spot it,
  an instruction where it is a judgment; the owner picks which to keep (the feedback log is this).
- **Installed 2026-11-09** at the owner's word: the v1.3 set (`INSTALLED-FROM-VIDEOS.md`). `implement-spec` (one agent
  per ticket) is an allowed exception to working inline when its job fits (`owner-way`).

## A UI-design channel: the seven things every good UI has (transcript, 2026-11-10)

The same components look paid-for or AI-made by seven things. Ask each of every screen:

- **One focal point:** what is the screen for, and is that the biggest, highest-contrast thing? Turn the rest down,
  usually by removing it. On a settings page, the one action you came for is at the top.
- **A spacing scale** (4 or 8): a label close to its field, items in a section closer than sections are to each
  other, so grouping needs no line or box.
- **Hierarchy by weight and colour,** not size: a title a little larger but darker and heavier, secondary text a
  softer grey, one or two fonts, slightly tighter headings, short lines.
- **Few colours:** neutrals tinted toward the brand, one accent where it matters (the main button, focus, a link).
  Colour everywhere means nothing stands out.
- **Real content:** real names, numbers and words for this product, never placeholders.
- **Details:** one radius (nested a little smaller), 1px subtle borders, soft layered shadows, icons one size and
  stroke, aligned to the text.
- **Motion from where the user acted:** a menu grows from its button, opens a little slower than it closes, a toast
  slides from the edge and stacks, a sheet follows the finger and settles. Short, eased out.

Applied: the Chords page, canvas 96 (a chord symbol in capitals was wrong content; there was no motion).

## The same UI-design channel: "weirdly perfect" and "every UI concept" (transcripts, 2026-11-10)

- **Edges:** a receipt is hard left and hard right, and only what nobody reads is centred. Every element on a
  compact screen meets two edges or more; make a new edge rather than filling space or hiding buttons in a menu.
- **Differentiate, not space out:** pictures where things are referenced, groups by what people hunt for.
- **Show, not tell:** a stop sign has no words; a diagram or icon registers at once. Explaining harder (labels,
  tooltips) makes a screen harder to read.
- **Emphasis is a difference:** a checkbox is coloured only when on; defaults grey, the changed value in ink.
- **Cards dissolve:** one line and a column edge do a card's work, without borders on borders.
- **Every UI concept:** signifiers; hierarchy by size, position and colour; a 4-point grid that halves; one sans
  font; headings at -2 to -3% tracking, 110-120% line height; one primary colour with its ramp, semantic colours
  for meaning; by night lighter cards, softer lines, dimmer chips; soft shadows, stronger for what floats; icons as
  tall as the line; buttons and fields with every state; feedback for every action; gradients under text on images.
- The Figma files sent with them are binary; only their thumbnails could be seen here. `Swipe_Anims.fig` arrived cut
  off and does not open.
- Kept as the `scan-first` skill (and four lines in `seven-questions`). Applied: Chords, canvas 97.

## Rulings the videos led to

- **Undo instead of asking** (owner: "adopt also this"): Kole Jain's act first and offer Undo replaces "a loss asks
  first". Only what can't be undone, or reaches other people, still asks. The port is `.scratch/r38/plan/undo-and-loss.md`.
- **A loss is shown as a loss** (owner: "i don't like your rejection"): UX Peak's loss framing is adopted, kept true:
  the learner's own things named, the way out naming its cost, never an invented countdown or scarcity.
- **Shadows for depth: yes** (owner, 2026-11-07, "yes to shadows"). A card is a lighter surface on a darker sand
  panel with a small layered shadow (a 1px ring at 5%, a 1–2px shadow, a soft 10px one); progress and slider tracks are
  inset. Drawn on the Player canvas (v148); `DESIGN.md` changes when it is built.
