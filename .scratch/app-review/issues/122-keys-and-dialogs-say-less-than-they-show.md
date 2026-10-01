# 122. Keys, popovers, sheets and bars say less to a screen reader than they show

Status: done
Severity: P2
Tier: 8
Rule: WCAG 1.4.1 (colour alone), 1.3.1, 4.1.2; DESIGN (label every coloured key); CODE_STYLE §10
Where: `key-look.ts:65`, `Key.tsx:80`, `TempoButton.tsx`, `HandsButton.tsx`, `MidiButton.tsx`, `Sheet.tsx`, `BarButton.tsx:28`, `RouteError.tsx`

## What is wrong

A quiz's wrong key was crimson with nothing on it; a key's printed degree and its wrong, missing or played state
never reached its accessible name or description; the three Player popovers were unnamed dialogs; the Setup sheet
had no Close a touch screen reader could reach; a bar's name was built in code and left out its printed notes; the
error screen said nothing when the learner was offline.

## The test that shows it

`key-look.test.ts` (✕), `PianoKeyboard.test.tsx` ("describes what a key prints and what it is…"), the dialog-name
checks in the Tempo, Hands and MIDI tests, `PlayerSetup.test.tsx` (Close), `RouteError.test.tsx` (offline).

## The fix

A wrong key prints ✕; a key is described by `keyDescription` (its mark, Wrong, Missing, Played) under its note's
name; each popover is named; every sheet carries an sr-only Close (`SheetClose` leaves the kit); a bar is named by
`music:sheet.barChords` with its notes (`piece.barLabel` goes); the error screen says when the learner is offline.

## Comments
