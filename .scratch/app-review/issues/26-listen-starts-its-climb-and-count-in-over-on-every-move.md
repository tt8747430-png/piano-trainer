# 26. Listen starts speed training over and counts in again on every move

Status: done
Severity: P1
Tier: 2
Rule: Glossary: Speed training (each pass faster); spec §12 count-in
Where: `src/features/practice/use-practice.ts`

## What is wrong

Any move or change of how Listen plays (‹ ›, a bar, hands, swing, metronome) started a new transport from pass 0: speed training's climb fell back to the chosen tempo, a count-in played again before the music went on, and switching the count-in restarted the pass.

## The test that shows it

`use-practice.test.tsx`: "carries the climb on when the learner moves while training plays", "starts again from the cursor, the climb carried on, when the hands change mid-training" (it pinned the reset before), "starts the climb over at the chosen tempo when Play starts it again", "counts in when Play starts, never when a move starts the pass again", "plays on when the count-in is switched while it plays".

## The fix

The hook keeps Listen's run: a pass started again carries the tempo sounding, without a count-in; Play or a new tempo starts over. The count-in is read as a pass starts (`useEffectEvent`), never a reason to start one.

## Comments
