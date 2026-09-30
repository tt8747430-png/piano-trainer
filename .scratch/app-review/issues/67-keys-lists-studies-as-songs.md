# 67. The Keys page lists studies under "Songs in this key"

Status: done
Severity: P3
Tier: 4
Rule: CLAUDE.md ("Song", "Study" or "Progression" in the UI)
Where: `src/pages/keys/ui/KeysPage.tsx:20,38`

## What is wrong

`entriesInKey` returns songs, listings and studies; all showed under the songs heading (C major listed the study Lesson 3).

## The test that shows it

`KeysPage.test.tsx`: "lists the studies written in the key apart from its songs".

## The fix

Songs and studies in two groups, "Songs in this key" and "Studies in this key" / «Этюды в этой тональности»; the songs' empty line stays.

## Comments
