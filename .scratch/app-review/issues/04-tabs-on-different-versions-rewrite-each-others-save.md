# 04. Tabs on different versions rewrite each other's save

Status: done
Severity: P1
Tier: 1
Rule: CLAUDE.md "Saved data keeps working"
Where: `src/shared/lib/other-tabs.ts`

## What is wrong

zustand migrates a save of any other version, newer ones included, and writes it back in its own. With every tab following every other's saves (issue 02), a tab left on an older version beside a newer one would migrate each newer save down and write it back, the newer tab would migrate it up and write again, and the two would trade the save for as long as both stayed open, resetting the newer version's fields.

## The test that shows it

`src/shared/lib/other-tabs.test.ts`: "leaves a newer version's save to the tab that wrote it", "reads again a save of an older version, which it can bring up to date"; `src/shared/lib/saved-store.test.ts`: "leaves a newer version's save in another tab alone, never writing it back in its own".

## The fix

`followOtherTabs(store, { key, version }, tabs)` reads the save's version from the event and follows a save of its own version or an older one; a newer one is left to the tab that wrote it, which reads this tab's saves. A removed or unreadable save is not followed.

## Comments
