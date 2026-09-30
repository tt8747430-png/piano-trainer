# 36. A recording is a sixth of a beat off from a swung off-beat start

Status: wontfix
Severity: P3
Tier: 2
Rule: ADR 0016
Where: `src/shared/lib/schedule/recording.ts`

## What is wrong

The recording's offset is worked out from the pass's first tick unswung, the notes swung.

## The test that shows it

None.

## The fix

None. It moves only a pass that starts on an off-beat with swing on, by a sixth of a beat, and a sung recording keeps its own feel under swung notes anyway.

## Comments
