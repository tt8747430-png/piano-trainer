# 17. A Retry hears every MIDI note twice

Status: done
Severity: P1
Tier: 2
Rule: ADR 0004 (one MIDI input); CODE_STYLE §8
Where: `src/shared/api/midi/web-midi.ts` (connect)

## What is wrong

Each `connect()` asked the browser for a new `MIDIAccess` and hooked its ports, while the first access's ports kept theirs. Retry after "no keyboard" and then plugging one in delivered each key twice: Wait mode and the quiz's MIDI took it twice.

## The test that shows it

`web-midi.test.ts`: "asks for access once, so a retry never hears a key twice".

## The fix

Access is granted once and kept (`granted ??= await requestAccess()`); a retry re-reads its keyboards.

## Comments
