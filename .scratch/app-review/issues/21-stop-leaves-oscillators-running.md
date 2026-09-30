# 21. Stop leaves oscillators running unheard

Status: done
Severity: P3
Tier: 2
Rule: A stop that stops
Where: `src/shared/api/audio/web-audio.ts` (stop)

## What is wrong

`stop()` disconnected each voice's envelope but left its oscillators and filter running until their scheduled end, and set a gain it disconnected on the next line.

## The test that shows it

`web-audio.test.ts`: "silences what sounds on stop, and stops its oscillators at once rather than at their end".

## The fix

A voice keeps its sources; `stop()` disconnects its output and stops every source now.

## Comments
