# 01. A cast migrates saved progress

Status: done
Severity: P2
Tier: 1
Rule: No workarounds (no `as` cast); CLAUDE.md "a shape change ships a `migrate` and a sanitising `merge`"
Where: `src/entities/progress/model/store.ts:29`

## What is wrong

`migrate: (persisted) => persisted as ProgressState` hands an unchecked shape on as typed state and leans on `merge`
to repair it, while `pt-settings` sanitises in both. The two stores should read alike, and a migrated save should
never be typed as valid before it is checked.

## The test that shows it

```ts
it.each([0, 2])('reads a version-%i save for what is still valid', (version) => {
  const storage = createMemoryStorage()
  writeSaved(storage, { learned: { 'piece:bz5': DAY, 'lesson:1': DAY }, quiz: 'lost' }, version)
  expect(createProgressStore({ storage }).getState()).toEqual({
    ...EMPTY_PROGRESS,
    learned: { 'piece:bz5': DAY },
  })
})
```

It passes today (`merge` sanitises after the cast); it pins the behaviour the refactor must keep.

## The fix

`migrate: (persisted) => sanitize(persisted)`, as `pt-settings` does.

## Comments
