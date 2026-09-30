# 78. `router.tsx` is past 200 lines

Status: wontfix
Severity: P3
Tier: 4
Rule: CODE_STYLE §1
Where: `src/app/router.tsx` (304 lines)

## What is wrong

The route tree is 29 declarative routes.

## The test that shows it

—

## The fix

None.

## Comments

It changes for one reason, a route added. Splitting it by place would move the parent routes into a module of their own for every place file to import, and the tree would read in five files.
