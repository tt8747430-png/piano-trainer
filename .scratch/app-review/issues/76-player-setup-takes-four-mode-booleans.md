# 76. Every Setup passes `PlayerSetup` four mode booleans, and the four Setups share a clump of props

Status: ready-for-agent
Severity: P2
Tier: 7
Rule: `architecture-avoid-boolean-props`; Data Clumps
Where: `WalkSetup.tsx:39-42`, `ChromaticSetup.tsx:51-54`, `ProgressionSetup.tsx:31-34`, `PieceSetup.tsx:51-54`

## What is wrong

`methods={false} melody={false} keyed compound={false}` at each caller; `open, onOpenChange, choice, swing, onChange, onSwing` travel together through all four, with the pages' `setupOpen` state.

## The test that shows it

For Tier 7 (component APIs), which owns `widgets/player-setup`.

## The fix

Tier 7.

## Comments
