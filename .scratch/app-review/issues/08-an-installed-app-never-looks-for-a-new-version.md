# 08. An installed app never looks for a new version while it is resumed

Status: done
Severity: P2
Tier: 1
Rule: CODE_STYLE §11 "so a deploy reaches learners"; spec §8 "an update prompt appears when a new version is waiting"
Where: `src/app/update-prompt/UpdatePrompt.tsx`

## What is wrong

The browser checks for a new worker only on a navigation. An installed app on a phone is resumed from the background far more often than it is launched, so a deploy could wait days to reach a learner.

## The test that shows it

`src/app/update-prompt/check-on-return.test.ts`: "looks for a new version each time the app comes back to the screen", "waits for the next return when the look fails offline" (fails without the catch: an unhandled rejection).

## The fix

`checkOnReturn(registration)` calls `registration.update()` whenever the page becomes visible, catching the offline failure; `UpdatePrompt` wires it from `onRegisteredSW`.

## Comments
