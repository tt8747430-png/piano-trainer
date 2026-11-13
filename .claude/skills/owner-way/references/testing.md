# Testing

A change is tested at three levels. Unit and screen tests prove the logic, and two passes in a real browser prove what the
learner sees. Passing tests say nothing about a clipped title.

## The ladder

| When                              | Run                                                                          |
| --------------------------------- | ---------------------------------------------------------------------------- |
| Each code change                  | a failing test first; then `npm run typecheck && npm run lint`               |
| Each task                         | `npm run test:related -- <files>`, or `npm run test:changed`                 |
| Each screen changed               | Pass 1 and Pass 2 below                                                      |
| Startup, routing, PWA, config     | `npm run build`, then `npm run preview`                                      |
| Before pushing to `main`          | the full `npm run test` once, then `npm run build`; `npm run e2e` for a flow |

**In a loop, or when the owner says so** (`SKILL.md`, Loops and refactors): the first two rows and the last are not
run; the screen passes run in full; the build runs once at the end of a big feature, fixing only what breaks it; `main`
only when the owner asks.

A command over 10 seconds runs in the background. Never run two suites at once. Never `pgrep -f` or `pkill -f` a pattern your own command holds. Give a long command a limit
of about twice what it needs. A test that fails only under load is made robust, and you say so.

## The size matrix

Sizes come from the device, never from what a browser's emulator reports. Measured 2026-11-05 unless marked. The phone
is the owner's iPhone 17 Pro at 402×874, on the canvas and in the app; 393 is the smaller phone, checked every pass.

| Name             | Size     | What it is                                       | Source                                                     |
| ---------------- | -------- | ------------------------------------------------ | ---------------------------------------------------------- |
| `iphone-17-pro`  | 402×874  | iPhone 17 Pro, the installed app: **the phone**  | the owner's frame (status bar 62, home indicator 34)       |
| `iphone-app`     | 393×852  | iPhone 14 Pro, the installed app: the smaller check | published spec, the whole screen                        |
| `iphone-safari`  | 393×695  | iPhone 14 Pro in Safari, bars showing            | measured in Safari on a simulated 393×852 phone            |
| `iphone-side`    | 852×393  | on its side, the installed app                   | published spec; Safari's side size is **not measured**     |
| `macbook-safari` | 1710×904 | MacBook Air M3 15-inch, Safari filling the screen | measured in Safari on the owner's Mac                      |
| `macbook-app`    | 1710×984 | the same Mac, the most an app window can take    | macOS's usable screen, measured; a title bar takes some    |

Safari's bars collapse on scrolling, taking the phone to 393×735 (`100lvh`). The simulator ran a newer iOS than a real 14 Pro
may, and Safari's bars differ by version, so to settle a size open a page logging `innerWidth`, `innerHeight` and `100svh`
on the phone itself. The Mac's screen is 1710×1107 (macOS's default for this panel, native 2880×1864).

Every size runs in **light and dark**, and in **English and Russian**, whose strings run 20–30% longer.

## Shooting the matrix

```bash
# Dev server (the values only let it start; nothing here reaches a server)
VITE_SUPABASE_URL=http://localhost:54321 VITE_SUPABASE_PUBLISHABLE_KEY=local-check \
  npx vite --port 5191 --strictPort            # run in the background; note its PID

node .claude/skills/owner-way/scripts/shots.mjs http://localhost:5191 <scratchpad>/shots /practice/metronome /songs
```

It shoots each step at all six sizes, both themes and both languages (24 shots a step) as a returning learner. The phones run
as the installed app: the status bar and the home indicator are emulated as safe-area insets (59 and 34 on a 393×852), and
`navigator.standalone` is true. It waits for a score to be engraved before shooting. A step can act first:
`"/play/hot-cross-buns >> click=Version >> scroll"` taps by accessible name and then shoots the top, the middle and the end; `type=<text>` types into the field focused (a New sheet's name); `slide=<0 to 1>` drags the first slider from its middle to that part of its width (the Piano sheet's Range strip).
`inspect.js` checks every shot and prints a `PROBLEM` line for:
- text cut with no ellipsis (`CUT`);
- two controls or texts drawn over each other (`OVERLAP`);
- a fixed or sticky layer over text that isn't its own (`COVERED`), never a popover, menu or tooltip a step opened;
- a band of the page left bare beside an open dialog (`UNCOVERED`), never beside a popover, which keeps no backdrop;
- a target under 44px on a touch screen (`SMALL`), measured to its reach (an ⓘ drawn 20px reaches 44px by its `::before`);
- a page wider than its screen, or a page error.

**A page is shot only once fully loaded** (the owner's rule): every capture, the app's and a reference site's, waits on
`scripts/settle.mjs` (load, network quiet, fonts, images, no busy region or spinner, a still layout) and reports a
part that never settles instead of shooting past it. **Nothing that only greets or interrupts is shot** (the owner's
rule): `clearOnboarding` dismisses the app's welcome, sign-in or sign-up prompts, product tours and cookie or newsletter
banners by their gentlest way out as each page loads, before any act (so a sheet a step opens is kept), and reports what it dismissed. It presses Escape only for a layer left open with no way out: on a bare screen Escape is the screen's own key, and the Player closes on it. `ONBOARDING=1` keeps them, only when
the check is of them or the owner asks. The harness also seeds a returning learner from the served app's own settings
version, so run it from the checkout that serves the app.

`SEED=<file.json>` starts the learner with saved stores (`{ "pt-own-lessons": "…" }`, made once through the app's own screens and read from its storage), for a screen that lists what the learner made. `SIZES`, `THEMES` and `LANGUAGES` narrow it while iterating; a pass is the whole matrix. The Claude-in-Chrome tab is no substitute: it reports as hidden,
so lazy staves stay blank and sheets never finish opening.

## Pass 1: as the builder

After the change, with the tests green:

1. Shoot the matrix for every route the change reaches.
2. Open the shots and read each one: the phone sizes in both languages always, the rest at least once per theme.
3. Drive what a screenshot cannot show (below).
4. Fix everything found, in one batch.

## Pass 2: as the owner

A second, complete pass after the fixes, on a fresh start. It is a new look, not a re-check of what Pass 1 fixed.

1. Delete the old shots, reload from a clean browser profile, and shoot the matrix again.
2. Walk the screen as a learner, from the place that opens it, with the owner's message and reference screenshot beside
   you. Compare line by line.
3. Open the neighbouring screens that share the changed component.
4. Go through [the checklist](#what-to-look-for), looking for what is wrong instead of confirming what is right.

**If Pass 2 changes anything, it was not Pass 2.** Fix it and run another full pass. Two passes is the least; done means the
last pass found nothing. A quick request, a late hour or a green suite changes none of this.

| Thought                                     | Reality                                                            |
| ------------------------------------------- | ------------------------------------------------------------------ |
| "It looked fine at one width"               | The owner's phone found clipped titles at the other widths.        |
| "Only one component changed"                | That component is on every screen that uses it.                    |
| "Pass 1 was clean, Pass 2 is a formality"   | Pass 2 is a different walk, in a fresh state, against the request. |
| "The owner wants it quick"                  | A round sent back costs more than two passes.                      |

## The shots a pass must include

The owner's phone found what a shot of a page at its top never shows (`.scratch/r30/plan/owner-shots-compared.md`):

- **Scrolled.** Every screen with more than one screenful, part way and at the end: sticky previews and bars cover what
  scrolls under them.
- **Every sheet, menu and dialog opened,** over a scrolled page: a backdrop that stops short leaves a band bare.
- **Real content:** the longest title, an imported score with pedal marks and many staves (Fantaisie-Impromptu in
  `piano-data`), a folder of many songs, signed in (the save mark beside Done).
- **The score engraved,** then the floating pills and transport checked against its title and staves.
- **After playing:** play a few bars and stop; nothing stays lit or held.

## What to drive by hand

Use Playwright's `page` (real Chrome) for what a still image hides:

- Every state of the screen: loading, empty, error, offline, a long title, many items, one item.
- **The tap after a popover closes** reaches its target, and nothing traps a click.
- Switching Player ↔ editor and entering Select: compare element positions before and after.
- Sheets and fields with the phone's keyboard up.
- Keyboard only: Tab order, Esc closes the top layer alone, focus visible.
- Under `reducedMotion: 'reduce'`, and with audio or MIDI behaviour through the fakes.
- The score: a selection tight to the notes, one playhead line, in all three layouts.

## What to look for

- Nothing clipped, cut, overflowing or badly wrapped at any size; titles take two lines before an ellipsis.
- Nothing hangs under the bar; nothing square pokes out of a rounded card.
- One honey control; one place current; one way to each action.
- Floating things reserve no space and keep their gap above the home indicator.
- Targets 44px; contrast 4.5:1 (3:1 for large text and control lines), both themes.
- Every word a musician's term, and every Russian string natural.
- Controls hold their place. No flash of the other layout.

## Reporting a pass

State it as evidence: "Pass 2: 24 shots each of `/songs` and `/practice/metronome`, 0 problems; tap-through after the key
picker works; suite 6,249 passed; build clean." Say which part was not run, and why. Then list what is running and stop what
is yours by PID.
