# 27. The count-in is out of phase after a mid-bar start

Status: done
Severity: P1
Tier: 2
Rule: spec §12 count-in; ADR 0016 (the count-in leads into the bar)
Where: `src/shared/lib/schedule/schedule.ts`

## What is wrong

The count-in was always a full bar from its accented first click, then the music at `fromTick`: from beat 3 the learner heard "1 2 3 4 | 3 4 | 1", and from an off-beat the last click fell a beat before the music.

## The test that shows it

`schedule.test.ts`: "counts in on the beats of the bar it starts in, so the music comes in on its beat", "comes in half a beat after the last click when it starts on an off-beat".

## The fix

`countInBeats`: a bar's worth of beats before `fromTick` on the grid of the bar it starts in, each bar's first beat accented.

## Comments
