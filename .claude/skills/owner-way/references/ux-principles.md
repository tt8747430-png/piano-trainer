# UX and UI principles, applied to Piano Trainer

Condensed from the sources the owner sent (2026-10-29): GeeksforGeeks' *Principles of UI/UX Design*, Figma's
*Seven essential UI design principles*, Jon Yablonski's *Laws of UX*, the UX Design Institute's *7 fundamental UX
principles*, SilverSky's *6 core principles*, dev.to's *UI/UX principles every developer should know* and Upslide's
*12 UI UX best practices*. Each line says what the principle asks of this app. Use them with impeccable's craft floor
(practices.md) when shaping, refactoring or reviewing a screen; a review names the principle a finding breaks.

## The principles

- **User-centred.** Build for the learner at the piano: hands on the keys, a phone on the stand, often one free
  hand. What they came to do (play this song, learn this lesson, drill this chord) is the screen's first thing.
- **Hierarchy.** One primary action per screen, filled and placed first (Practise, Continue, Start); everything
  else smaller, quieter, later. Size, weight, contrast and space say what matters; the page's order follows the
  learner's order of need (hero → primary action → facts → sections).
- **Progressive disclosure.** Show the next step, not every option. Detail behind ⓘ, More menus, sheets and
  disclosure rows; a long setup split into steps that say where you are ("Step 2 of 4").
- **Consistency (Jakob's law).** One component for one job, everywhere: the same bar, the same row, the same
  button, the same sheet. Familiar platform patterns (tab bar, large title, grouped settings, swipe actions) beat
  inventions. A deviation needs a reason.
- **Contrast.** The accent marks the one primary action, the selection and the state; danger is red and alone. Text
  at least 4.5:1 (3:1 for large), in light and dark.
- **Proximity and common region.** What belongs together sits together inside one card or group; what does not is
  separated by space, never by a line alone. Destructive actions sit apart from the everyday ones.
- **Alignment.** One gutter, one grid; rows, tiles and cards share edges; numbers are tabular.
- **Context.** A phone held upright, on its side, a laptop: same features, layout adapted. Offline is a context,
  not an error. The learner always knows where they are (title, tabs, back) and what happens next.
- **User control.** Every action can be undone or confirmed; a way back from every screen; drafts kept; nothing
  destructive without a confirmation that names what goes.
- **Feedback.** Every tap answers within 100ms: pressed states, a saving/saved line, a toast that says what
  happened, a skeleton while loading, an empty state that says what to do.
- **Accessibility.** WCAG 2.2 AA: contrast, 44px targets, focus order, names that match the visible label, reduced
  motion respected, screen-reader labels for the keys and the score.
- **Usability.** Learnable, efficient, memorable, forgiving, satisfying: fewest steps to play, shortcuts for the
  learner who comes back daily, no dead ends.
- **Simplicity (Occam, Tesler).** Remove what does not serve the task; the complexity that cannot go is carried by
  the app (defaults, smart choices), not by the learner.
- **Speed (Doherty threshold).** Under 400ms from tap to response; lazy chunks, skeletons, no layout shift.

## The laws that shape layouts

- **Fitts's law:** primary actions large and in the thumb's reach (the floating actions, the tab bar, the transport);
  rarely used ones may be small and far.
- **Hick's law and choice overload:** few choices at once; group, default, and hide the rest behind More.
- **Miller's law and chunking:** lists in groups of a handful; a lesson paged a section at a time.
- **Serial position effect:** the first and last items are remembered; put the key action first or last, never in
  the middle of a row of equals.
- **Von Restorff effect:** the one thing that differs is remembered; one accent per screen.
- **Goal-gradient and Zeigarnik effects:** show progress toward a goal (steps learned, lessons left) and what is
  unfinished (Continue).
- **Peak-end rule:** the end of a lesson, a check or a practice run is celebrated and says what's next.
- **Aesthetic-usability effect:** polish raises trust; craft-floor details are not optional.
- **Law of similarity and uniform connectedness:** what looks alike behaves alike; a connected path (the journey)
  reads as one sequence.
- **Postel's law:** accept loose input (chord symbols typed many ways, 6/8 or 6:8), output one clean form.
- **Paradox of the active user:** nobody reads the manual first; teach in place (empty states, ⓘ), not in a tour.
- **Selective attention and cognitive load:** one task per screen; decoration never competes with the music.

## Checklist for a screen

1. What is the learner here to do, and is that the first and largest thing?
2. One primary action; at most two actions in the bar; the rest in More.
3. Grouped by meaning, aligned to one grid, the same components as every other screen.
4. Loading, empty, error and offline states; feedback for every action; undo or confirm for every loss.
5. 390, 320, 844×390 and 1280: nothing clipped, nothing wraps badly, targets 44px, contrast passes.
