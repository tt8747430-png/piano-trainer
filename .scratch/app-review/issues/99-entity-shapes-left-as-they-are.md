# 99. Entity shapes a reviewer would deepen, left as they are

Status: wontfix
Severity: P3
Tier: 5
Rule: codebase-design; Primitive Obsession; Data Clumps
Where: `piece/model/chart-layout.ts`, lesson and piece ids, progress dates, `StepTitle`, `BOOKS.author`, `LESSON_CATEGORIES`

## What is wrong

A chord-a-bar chart is assembled by three callers; numerals, key and chord size travel under several names; lesson ids and ISO dates are bare strings; `StepTitle` repeats `EntryTitles`' fields; a book's author is never read; two categories share Modules' names.

## The test that shows it

—

## The fix

None.

## Comments

Each costs a type or a rename across slices for no behaviour; the chart callers are the three Player sources, whose shape 71 already shares. A book's author is content kept for its credits. Categories and Modules are the owner's taxonomy.
