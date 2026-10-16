# ADR 0056 — The keys say their notes; the learner chooses what the bar holds

- **Status:** accepted · **Date:** 2026-10-16 · **Amends:** ADR 0055 (docked keys and floating actions),
  ADR 0036 (every rail setting in sight)

## Context

The owner found UI that told the learner nothing new: a row of tone chips (1 C · 3 E · 5 G) under every chord and
scale repeated what the marked keys already showed; Practice's "Pick up where you left off" repeated its own
list. "Above the keys: Every setting / Only the essentials" chose nothing the learner could name, and the MIDI
settings did not say what they did. Folded keys docked at the top took a whole row for one button; docked at the
foot, the button sat over the screen's actions, away from where the keys came back. A page with its parts hidden
stood empty. A lesson's contents showed twice on a laptop.

## Decision

- **A marked key names its note under its degree** (`KeyMark.note`, `toneMark`), unless the keyboard setting
  `markNotes` is off. No row of chips repeats it.
- **The bar over the keys holds the buttons the learner keeps** (`railControls`, in the bar's order), chosen in
  Settings as tiles wearing the bar's own pictures. Every setting the bar sets is in Settings too: the swipe
  became a setting of its own. Each keyboard and MIDI setting says in a line what it does.
- **Folded keys float where they were**: at the foot, lowest of the screen's actions (`FloatingActions last`);
  at the top, under the screen's bar, out of the page's flow. Folding and unfolding morph the keys into the
  button and back (`morph`, a view transition; at once under reduced motion).
- **A page says what the learner hid**, each part a button that brings it back (the Chord finder's keys,
  staff and keys it is in), and its prompt asks for a MIDI keyboard while the keys are folded.
- **A lesson's sections step from a floating ‹ n / m ›**; on a phone its count opens the contents, a laptop keeps
  them beside the lesson only. **Its options float in a dial**: the fingers on its scales (`lesson.fingers`,
  drawn on the keys and the staff) where it has one, and the way on.
- Practice lists its pages once.

## Consequences

The settings store reads `markNotes`, `railControls` and `lesson` as their defaults from a save without them
(ADR 0038); a save's `rail` is no longer read.
