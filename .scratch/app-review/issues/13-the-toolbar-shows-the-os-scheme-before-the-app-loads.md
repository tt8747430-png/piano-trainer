# 13. The toolbar shows the OS scheme before the app loads

Status: done
Severity: P3
Tier: 1
Rule: vercel-react-best-practices `rendering-hydration-no-flicker`; spec §6
Where: `index.html` #theme-boot, `vite.config.ts` themeColorMeta

## What is wrong

The theme-color metas were written after the boot script, so a learner who chose Dark on a light OS saw a light toolbar until React mounted and `ThemeProvider` repainted it.

## The test that shows it

`src/app/theme-boot.test.ts`: "colours the browser toolbar for the theme it paints" (fails on the old script).

## The fix

The build prepends the metas; the boot script sets both to the painted theme's colour, read from its own scheme's meta (no second colour table).

## Comments
