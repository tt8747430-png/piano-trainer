# 45. Melodic minor comes back down raised

Status: done
Severity: P1
Tier: 3
Rule: Melodic minor as taught beside natural and harmonic minor (the major and minor family, ADR 0014)
Where: `src/shared/lib/schedule/run.ts`, `src/widgets/scale-explorer/model/scale-run.ts`, `src/features/play-example/model/scale-example.ts`

## What is wrong

A run reversed the rising form, so the Scales reference and a lesson played and wrote melodic minor's raised 6th and 7th coming down.

## The test that shows it

`scale-run.test.ts`: "brings melodic minor back down as natural minor, each note with its finger there"; `scale-example.test.ts`: "brings melodic minor back down as natural minor".

## The fix

`kindComingDown(kind)` in the kernel; `scaleRun` takes the way down (`down: RunWay`) with its own fingers.

## Comments
