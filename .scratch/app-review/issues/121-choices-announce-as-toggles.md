# 121. One-of-several choices announce as toggle buttons

Status: done
Severity: P2
Tier: 8
Rule: WAI-ARIA APG (radio group, listbox); WCAG 4.1.2
Where: `ChoiceList.tsx`, `ChoiceRow.tsx`, `Segmented.tsx`

## What is wrong

The Setup's lists, the tempo and hands popovers and every segmented control marked the chosen item with
`aria-pressed`: a screen reader heard "toggle button, not pressed" on every other choice, and a closed Setup choice
was `disabled`, so its reason ("Needs a melody") was never reached.

## The test that shows it

`Listbox.test.tsx`; `kit.test.tsx` (Segmented: a radiogroup, arrows choose); `PlayerSetup.test.tsx` ("opens a list
on its choice, and goes back to the row that opened it").

## The fix

A kit `Listbox` (options with `aria-selected`; arrows, Home and End move; Enter, Space or a tap chooses; a closed
option is `aria-disabled`, reachable and heard) for the Setup's pages and the two popovers; `ChoiceList` and
`ChoiceRow` go. `Segmented` is Base UI's radio group; the toggle and toggle-group primitives go. A list page opens on
its choice, and focus returns to the row that opened it.

## Comments
