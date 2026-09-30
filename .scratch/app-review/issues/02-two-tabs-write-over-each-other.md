# 02. Two tabs write over each other's saved progress

Status: done
Severity: P0
Tier: 1
Rule: CLAUDE.md "Saved data keeps working"
Where: `src/entities/progress/model/store.ts:20`, `src/entities/settings/model/store.ts:28`

## What is wrong

Each tab holds the whole store in memory and saves the whole of it. With the installed app and a browser tab open,
answers recorded in one are wiped by the next mark saved in the other, whose copy is older. Nothing listens for the
`storage` event, so a tab never learns what another saved.

## The test that shows it

```ts
it('keeps what another tab saved when it saves next', () => {
  const storage = createMemoryStorage()
  const otherTabs = new EventTarget()
  const store = createProgressStore({ storage, otherTabs })
  writeSaved(storage, { ...EMPTY_PROGRESS, practised: { bz5: DAY } })
  otherTabs.dispatchEvent(new StorageEvent('storage', { key: PROGRESS_STORAGE_KEY }))
  store.setState({ learned: { 'piece:bz5': DAY } })
  expect(JSON.parse(storage.getItem(PROGRESS_STORAGE_KEY) ?? 'null').state).toEqual({
    ...EMPTY_PROGRESS,
    practised: { bz5: DAY },
    learned: { 'piece:bz5': DAY },
  })
})
```

## The fix

`followOtherTabs(persist, key, tabs)` in `shared/lib`: on a `storage` event for the store's key (or a cleared
storage), the store rehydrates. Both store factories take `otherTabs?: EventTarget` (default `window`) and follow it.

## Comments
