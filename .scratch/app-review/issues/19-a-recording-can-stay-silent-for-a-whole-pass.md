# 19. A recording can stay silent for a whole pass

Status: done
Severity: P1
Tier: 2
Rule: ADR 0016 (primed on the Play tap, then played on the clock)
Where: `src/shared/api/audio/recording-player.ts`

## What is wrong

`prime()` plays the element muted, which takes it out of pause at once but resolves only when the file is in. A pass starting meanwhile skipped the element (not paused), then the prime paused it; nothing started it again until the next pass. An interruption that paused the element was never undone either.

## The test that shows it

`recording-player.test.ts`: "keeps a play going that starts while the Play tap’s prime is still loading the file", "starts its element again when something pauses it under a play, as an interruption does", "primes each recording once: a later tap leaves a primed one alone".

## The fix

A prime never pauses an element a play has taken over; a play unmutes what it takes over; an element paused under a play is sought and started again; each element is primed once (Safari needs one gesture per element).

## Comments
