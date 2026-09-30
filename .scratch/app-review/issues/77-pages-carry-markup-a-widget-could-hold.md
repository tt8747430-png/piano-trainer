# 77. Pages carry small markup and lines a lower layer could hold

Status: wontfix
Severity: P3
Tier: 4
Rule: CODE_STYLE §1 (a page with little markup of its own); Duplicated Code
Where: `SettingsPage.tsx` (`Group`, the reset dialog), `TheoryQuizPage.tsx` (the stats), `CheckResult.tsx`, `PieceFacts.tsx` (the key and meter), `LessonPage.tsx` and `LessonsColumn.tsx` (the level · category line), `SongsPage.tsx` and `LessonsColumn.tsx` (the level options, the empty state's reset)

## What is wrong

Each is a page's own part or two lines in two pages.

## The test that shows it

—

## The fix

None.

## Comments

Each has one caller or lives in two page slices whose only shared home is an entity: the reset dialog's and the lesson line's words are Settings' and Learn's, and a widget for one screen is Speculative Generality. `CheckResult` links a skill to its explorer without a step, which `ExplorerLink` (a step's) does not do; `PieceFacts`' shelf and `use-close`'s piece page are different fallbacks written the hooks' way.
