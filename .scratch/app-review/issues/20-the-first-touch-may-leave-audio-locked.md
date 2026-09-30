# 20. The first touch may leave audio locked, and iOS's suspended audio stays so

Status: done
Severity: P2
Tier: 2
Rule: spec §7 (the first tap anywhere unlocks audio)
Where: `src/app/providers/AudioUnlock.tsx`, `src/shared/api/audio/web-audio.ts`

## What is wrong

`AudioUnlock` unlocked on the first `pointerdown` and stopped listening, but a touch's press does not count as a gesture (its lift does), so the first tap could leave audio locked for good. And iOS puts a running context back in `interrupted` after a call, which only `suspended` was resumed from.

## The test that shows it

`AudioUnlock.test.tsx`: "unlocks audio on every tap and key press, so audio the browser suspends again comes back", "unlocks audio when a finger lifts, which is when a touch counts as a gesture"; `web-audio.test.ts`: "resumes a context iOS interrupted, on the next unlock, and leaves a running one alone".

## The fix

`AudioUnlock` listens to `pointerdown`, `pointerup` and `keydown` for as long as the app runs; `unlock` resumes a context `suspended` or `interrupted` and does nothing once audio runs.

## Comments
