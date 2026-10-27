# Check the early requests still hold

## Goal

Confirm that five things the owner asked for early on still work everywhere. Fix any place where one has slipped. They are built today, so this is a regression check, not new work.

## Context

Read `CLAUDE.md` and load the `owner-way` skill. Each request names where it lives now.

## Task

Check each request on a phone held upright (390×844), a phone on its side (844×390) and a laptop (1280×800), with Playwright and the tests that cover it.

1. **Choices are remembered.** A screen opens as the learner left it: pattern, key, inversion and the other choices (`pt-views`, `features/remember-view`, ADR on remembered views). Find any screen whose choices are lost on leaving and coming back.
2. **Practise in any inversion.** Progressions and chords can be walked through the keys and practised in a chosen inversion, or each chord in its nearest one (`widgets/progression-explorer`, `PositionField`, the walk in the Player).
3. **A button never scrolls the page to the top.** Any control that changes the screen in place keeps the scroll (`IN_PLACE`, `useViewChange`). Find any that jumps or flickers.
4. **The screen bar hides on scroll down and shows on scroll up** (`useShownOnScrollUp`, `ScreenHeader`). The keyboard's rail buttons must not read as navigation.
5. **Back goes back to the page the learner came from.** It never undoes choices made on the current page (`useGoBack`, `BackButton`).

## Constraints

- Fix at the cause, test first. Don't add a second mechanism beside the one named.

## Done means

Each request is confirmed with the screen and size checked, or fixed with a test that fails without the fix.

## Report

One line per request (holds, or fixed and how), then the commits.
