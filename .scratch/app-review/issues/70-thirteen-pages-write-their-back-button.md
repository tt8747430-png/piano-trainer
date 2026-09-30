# 70. Thirteen screens write their Back button out

Status: done
Severity: P3
Tier: 4
Rule: Duplicated Code; CODE_STYLE §1 (a page composes, with little markup of its own)
Where: the nine Learn references and tools, `LessonPage`, `TheoryQuizPage`, `PieceFacts`, `SettingsPage`

## What is wrong

Each wrote `useGoBack({ to })` and `<RoundButton label={t('common:back')} icon={ArrowLeft} onClick={back} />`; Settings wrote a link instead (60).

## The test that shows it

Structural: every page's Back test, green before and after.

## The fix

`BackButton` in the kit, typed like `useGoBack` (`fallback`); CODE_STYLE §1 and CLAUDE.md list it.

## Comments

The `navigate({ search: (prev) => ({ ...prev, ...change }), replace: true })` each page writes stays: it is typed by the route's `from`, and a shared hook would need the router's generics or a cast.
