# 18. A keyboard unplugged in place leaves its keys down

Status: done
Severity: P1
Tier: 2
Rule: ADR 0009; CODE_STYLE §1 (a key is down while a hand holds it)
Where: `src/shared/api/midi/web-midi.ts` (hook)

## What is wrong

Chrome may keep an unplugged port in `access.inputs` with `state: 'disconnected'`. The adapter counted every port in the map, so the status stayed "connected" and the keys it held (issue 03) never came up.

## The test that shows it

`web-midi.test.ts`: "lets go of a keyboard’s keys when its port turns disconnected in place".

## The fix

Only ports whose `state` is `connected` are heard and counted.

## Comments
