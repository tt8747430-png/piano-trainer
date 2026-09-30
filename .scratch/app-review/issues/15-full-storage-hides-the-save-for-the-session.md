# 15. Full storage hides the save for the session

Status: wontfix
Severity: P3
Tier: 1
Rule: ADR 0003 (falls back to memory)
Where: `src/shared/lib/safe-storage.ts:7-15`

## What is wrong

The probe writes a key; if the origin's storage were full, the app would fall back to memory and not read `pt-settings` and `pt-progress` for the session.

## The test that shows it

None.

## The fix

None. The two saves are a few kilobytes, the origin's quota is megabytes and nothing else writes to it: full storage at startup is not a state this app reaches, and a probe that tells reading from writing would be code for it.

## Comments
