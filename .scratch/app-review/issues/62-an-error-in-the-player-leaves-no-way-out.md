# 62. An error in the Player or the Check leaves the learner nowhere to go

Status: done
Severity: P1
Tier: 4
Rule: spec §5 (the Player and the Check are full-screen with a way back); spec §7 (a route-level error boundary)
Where: `src/app/RouteError.tsx`

## What is wrong

The error screen offered only Reload. Under the full-screen layout there is no navigation; a reload opens the same URL, so an error the URL causes comes back, and the installed iOS app has no Back of its own.

## The test that shows it

`RouteError.test.tsx`: "leaves a screen that throws for where the learner came from", "leaves a screen opened directly for the Path" (a router whose full-screen route throws).

## The fix

Back beside Reload, through `useGoBack({ to: '/' })`.

## Comments
