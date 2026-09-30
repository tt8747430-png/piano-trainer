# 05. The two saved stores repeat one shape

Status: done
Severity: P2
Tier: 1
Rule: Smell baseline: Duplicated Code, Shotgun Surgery, Data Clumps
Where: `src/entities/settings/model/store.ts`, `src/entities/progress/model/store.ts`

## What is wrong

Both stores wrote the same `persist` options (key, version, JSON storage, a sanitiser for `migrate` and `merge`) and, after issue 02, the same `followOtherTabs` call and the same `{ storage, otherTabs }` options: one rule, "saved data keeps working", written twice.

## The test that shows it

`src/shared/lib/saved-store.test.ts` (the save's key and version, any version read for what it can, the initial state for what it cannot, another tab's save of this version and of an older one, a newer one left alone); both stores' own tests unchanged.

## The fix

`createSavedStore({ key, version, initial, read }, { storage, otherTabs })` in `shared/lib` owns the rule; `SavingOptions` bundles where a store saves; each entity passes its key, version, initial state and sanitiser.

## Comments
