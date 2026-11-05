# UX principles

What the principles ask of this app. A review names the principle a finding breaks. They come from the sources the owner
sent on 2026-10-29: Laws of UX, Figma's seven UI principles, and the UX Design Institute's fundamentals.

## The learner

Hands on the keys, a phone on the stand, often one free hand, sometimes offline in a hall. What they came to do (play this
song, learn this lesson, write this bar) is the screen's first and largest thing.

## Principles

| Principle              | Here                                                                                      |
| ---------------------- | ----------------------------------------------------------------------------------------- |
| Hierarchy              | one primary action; size, weight and space say what matters; the page follows the need    |
| Progressive disclosure | the next step, not every option; detail behind ⓘ, sheets and folds                        |
| Consistency            | one component per job; familiar platform patterns beat inventions                         |
| Contrast               | honey marks the one action; danger is red and alone; 4.5:1 text, in both themes           |
| Proximity              | what belongs together shares a card; destructive acts sit apart                           |
| Alignment              | one gutter, one grid, shared edges, tabular numbers                                       |
| Context                | same features upright, on its side and on a laptop; offline is no error                   |
| User control           | undo or confirm every loss; a way back from every screen; drafts kept                     |
| Feedback               | every tap answers within 100ms; a toast says what happened; skeletons; empty states       |
| Accessibility          | WCAG 2.2 AA: 44px targets, focus order, names matching labels, reduced motion             |
| Simplicity             | remove what does not serve the task; the app carries the complexity that remains          |
| Speed                  | under 400ms from tap to response; no layout shift                                         |

## Laws that shape layouts

- **Fitts:** primary actions large and in the thumb's reach.
- **Hick, Miller:** few choices at once, lists in small groups, the rest behind a fold.
- **Serial position:** the key action first or last, never mid-row among equals.
- **Von Restorff:** the one thing that differs is remembered; one accent per screen.
- **Goal-gradient, Zeigarnik:** show progress and what is unfinished (Continue).
- **Peak-end:** a lesson's end says what was done and what is next.
- **Jakob:** learners expect our app to work like the apps they know.
- **Postel:** accept loose input (`6/8`, `6:8`, chords typed many ways), output one clean form.
- **Tesler:** defaults and smart choices carry what cannot be removed.
- **Active user:** nobody reads a manual; teach in place with empty states and ⓘ.
- **Aesthetic-usability:** polish raises trust; craft details are not optional.

## Checklist for a screen

1. What is the learner here to do, and is that the first and largest thing?
2. Is there one primary action, and does the bar hold only the screen's own actions?
3. Is it grouped by meaning, on one grid, with the same components as every other screen?
4. Does it have loading, empty, error and offline states, feedback for each act, and undo or confirm for each loss?
5. Did it pass both browser passes at every size ([testing](testing.md))?
