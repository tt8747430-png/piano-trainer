# 28. Wait mode sounds the answer on a move, plays the other hand twice, and drags through rests

Status: done
Severity: P2
Tier: 2
Rule: vercel-react-best-practices `rerender-dependencies`, `rerender-move-effect-to-event`; CODE_STYLE §8 (the audio clock)
Where: `src/features/practice/use-practice.ts`

## What is wrong

A move while Wait mode played sounded the whole beat group, the practised hand included; its effect depended on the whole state, so a second Play (a new object) played the other hand again; and a run of rests was timed by timers, each late by a render.

## The test that shows it

`use-practice.test.tsx`: "sounds nothing where the learner moves while it waits: the learner plays it", "plays the other hand once, however often Play is tapped meanwhile", "keeps a run of rests on the audio clock, each where the last ends".

## The fix

A move while Wait mode plays sounds nothing; the effect depends on what it uses; through rests each beat group is due on the audio clock where the last ends.

## Comments
