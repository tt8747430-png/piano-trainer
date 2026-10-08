# The Sheets' Numerals, a Row's Hands and the Walks as Rows Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or
> superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** The Progressions page reads what the course's sheets write (a degree with its chord, a 6th, any chord of
the table), voices a row as the sheets do, and lists every walk through the keys as a row.

**Architecture:** A `Numeral` carries a chord quality of the table instead of a triad and a 7th, so reading, writing
and `numeralOf` cover all 36 chords through the chord table's own suffix lookup. `voiceLead` leaves a big chord's root
to the bass and puts the bass under the hand. The page's Player rows are one per walk, and `walk` stops being a kept
param of the progression Player.

**Tech Stack:** React 19, TypeScript 6 strict, TanStack Router, Vitest 4 + Testing Library, i18next.

**Spec:** `docs/superpowers/specs/2026-10-08-sheet-numerals-row-voicing-walk-rows-design.md` · **ADR:** 0032

**Execution:** native, in this session, on `main`, one commit per task (the owner's standing rule; no review gate).

## Global Constraints

- The kernel is fenced (lint): `shared/lib/music` imports only itself, and no package.
- A bare upper-case numeral stays a major chord; a plain triad grows with the chord size; any other chord is played
  as written.
- Numerals are written one way: lower case for the table's twelve chords with a minor 3rd.
- Every URL read before is read the same (`III+7`, `iMaj7`, `viio7`, `V7b9`).
- No new strings: walks are `player:keyWalk.*`, their group `learn:progressions.throughKeys`.
- Test first; `globals: false`; fakes, never module mocks; prettier on touched files only.
- Verify: `npm run typecheck && npm run lint && npm run test`, then `npm run build` (a route's kept params change).

## Review Focus

1. A line written the old way (`III+7`, `iMaj7`, `viio7`) in a saved view or a link: read, and written the one way.
2. A token no grammar reads (`Vi`, `Vfoo`, `iisus4`): the field says it cannot be read; nothing throws.
3. A minor chord typed the jazz way in lower case (`iim7 V7 IMaj7`): read as `ii7`.
4. A suffix a URL must escape (`I6/9`, `V7#9`, `III+`): the page opened on such a URL shows those chords.
5. A row of one chord, of none, or of a 13th: a bass under a hand, never a key struck twice.

Each has its test in the task that owns the code (1–3 Task 1 kernel, 4 Task 1 page, 5 Task 2).

---

### Task 1: A numeral carries its chord

**Files:**

- Modify: `src/shared/lib/music/numerals.ts`, `src/shared/lib/music/chord-symbol.ts`
- Test: `src/shared/lib/music/numerals.test.ts`, `src/widgets/progressions/model/typed-progression.test.ts`,
  `src/pages/progressions/ui/ProgressionsPage.test.tsx`

**Interfaces:**

- Produces: `interface Numeral { degree: number; shift: -1 | 0 | 1; quality: ChordQuality }`;
  `readQualitySuffix(suffix: string): ChordQuality | null` (kernel-internal, from `chord-symbol.ts`). `parseNumeral`,
  `parseNumerals`, `numeralText`, `numeralsLine`, `numeralsParam`, `numeralChord`, `numeralOf`, `readDegree` keep their
  signatures. `NumeralTriad` and `NumeralSeventh` go.

- [ ] **Step 1: Write the failing kernel tests** in `numerals.test.ts` (keep every existing test but the one named
      below):

```ts
const texts = (line: string) => (parseNumerals(line) ?? []).map(numeralText)

it('reads a degree with its chord as the sheets write it', () => {
  expect(texts('IIm7 – V7 – Imaj7')).toEqual(['ii7', 'V7', 'IMaj7'])
  expect(texts('Im7 IVm9 Vsus4 Im7')).toEqual(['i7', 'iv9', 'Vsus4', 'i7'])
  expect(texts('IIm7b5 V7b9 Im6')).toEqual(['iiø7', 'V7♭9', 'i6'])
  expect(texts('iim7 V7 IMaj7')).toEqual(['ii7', 'V7', 'IMaj7'])
})

it('still reads a line written the old way', () => {
  expect(texts('III+7 iMaj7 viio7 viiø')).toEqual(['III7#5', 'iMaj7', 'vii°7', 'viiø7'])
})

it('reads no token that is neither grammar', () => {
  for (const token of ['Vi', 'Vfoo', 'iisus4', 'ii+', 'iMaj7♭9']) expect(parseNumeral(token), token).toBeNull()
})

it('writes every chord of the table on a degree and reads it back, in a line and in a URL', () => {
  for (const quality of CHORD_QUALITIES) {
    const numeral = { degree: 4, shift: -1, quality } as const
    expect(parseNumeral(numeralText(numeral)), quality).toEqual(numeral)
    expect(parseNumerals(numeralsParam([numeral])), quality).toEqual([numeral])
  }
})

it('writes lower case exactly the chords with a minor 3rd', () => {
  for (const quality of CHORD_QUALITIES) {
    const minor3rd = qualityIntervals(quality).some(({ degree }) => degree === '♭3')
    expect(numeralText({ degree: 1, shift: 0, quality }).startsWith('ii'), quality).toBe(minor3rd)
  }
})

it('plays a 6th as written, at every chord size', () => {
  expect(chords('ii7 V7 I6', C, 'ninths')).toEqual(['Dm7', 'G7', 'C6'])
  expect(chords('iiø7 V7 i6', A_MINOR, 'triads')).toEqual(['Bm7♭5', 'E7', 'Am6'])
})
```

and under `numeralOf`, in place of "writes none for a chord a numeral does not name":

```ts
it('writes a chord of any quality as its numeral', () => {
  const D_MINOR: Key = { tonic: note('D'), minor: true }
  const written = (symbols: string[], key: Key) =>
    symbols.map((symbol) => {
      const numeral = numeralOf(parseChordSymbol(symbol), key)
      return numeral ? numeralText(numeral) : null
    })
  expect(written(['Dm7', 'G7', 'C6'], C)).toEqual(['ii7', 'V7', 'I6'])
  expect(written(['Dm9', 'G9', 'CMaj9'], C)).toEqual(['ii9', 'V9', 'IMaj9'])
  expect(written(['Dm7', 'Gm9', 'Asus4'], D_MINOR)).toEqual(['i7', 'iv9', 'Vsus4'])
})

it('writes none for a chord whose root is no degree’s, sharpened or flattened', () => {
  expect(numeralOf(parseChordSymbol('F##'), C)).toBeNull()
})
```

- [ ] **Step 2: Run** `npx vitest run src/shared/lib/music/numerals.test.ts` — expect the new tests to fail (`IIm7`
      unread, `I6` unread, `quality` missing).

- [ ] **Step 3: Implement.** In `chord-symbol.ts`, beside `QUALITY_BY_SUFFIX`:

```ts
/** The chord a suffix writes, in any of its spellings (`m7b5`, `maj7`, none for major); null for one the table lacks. */
export const readQualitySuffix = (suffix: string): ChordQuality | null =>
  QUALITY_BY_SUFFIX.get(normalise(suffix)) ?? null
```

and `parseChordSymbol` reads its quality through it. In `numerals.ts` the model, the reading and the writing become:

```ts
export interface Numeral {
  readonly degree: number
  readonly shift: -1 | 0 | 1
  readonly quality: ChordQuality
}

const TOKEN = /^([b♭#♯]?)(VII|VI|V|IV|III|II|I|vii|vi|v|iv|iii|ii|i)(.*)$/

/** What a lower-case numeral writes after it, for each chord with a minor 3rd. */
const LOWER_TAILS: ReadonlyMap<ChordQuality, string> = new Map<ChordQuality, string>([
  ['min', ''], ['m6', '6'], ['m69', '6/9'], ['m7', '7'], ['mM7', 'Maj7'], ['m9', '9'],
  ['mM9', 'Maj9'], ['m11', '11'], ['dim', '°'], ['o7', '°7'], ['hd', 'ø7'], ['hd9', 'ø9'],
])
const LOWER_QUALITIES = new Map([...LOWER_TAILS].map(([quality, tail]) => [tail, quality] as const))
const TAIL_ALIASES: ReadonlyMap<string, string> = new Map([
  ['o', '°'], ['o7', '°7'], ['ø', 'ø7'], ['maj7', 'Maj7'], ['M7', 'Maj7'], ['maj9', 'Maj9'], ['M9', 'Maj9'],
])

/** A lower-case numeral's chord: by its tail, or by a suffix that itself writes a chord with a minor 3rd (`iim7`). */
function lowerQuality(tail: string): ChordQuality | null {
  const short = LOWER_QUALITIES.get(TAIL_ALIASES.get(tail) ?? tail)
  if (short) return short
  const full = readQualitySuffix(tail)
  return full && LOWER_TAILS.has(full) ? full : null
}

export function parseNumeral(token: string): Numeral | null {
  const match = TOKEN.exec(token)
  if (!match) return null
  const [, sign = '', roman = '', tail = ''] = match
  const read = readDegree(sign, roman)
  const quality = roman === roman.toUpperCase() ? readQualitySuffix(tail) : lowerQuality(tail)
  return !read || !quality ? null : { ...read, quality }
}

export function numeralText(numeral: Numeral): string {
  const sign = numeral.shift < 0 ? '♭' : numeral.shift > 0 ? '#' : ''
  const roman = ROMANS[numeral.degree] ?? ''
  const tail = LOWER_TAILS.get(numeral.quality)
  return sign + (tail === undefined ? roman + qualitySuffix(numeral.quality) : roman.toLowerCase() + tail)
}
```

`numeralChord` returns `{ root, quality }` for any chord but a plain triad (`maj`, `min`, `dim`, `aug`), which grows
as before (`GROWN` keyed by those four); `numeralOf` returns `{ degree, shift, quality: chord.quality }` for every
chord whose root is a degree or a semitone from one. `NAMED`, `triadOf`, `seventhOf`, `SEVENTH_TEXT` and the two
types go.

- [ ] **Step 4: Run** the kernel tests — expect PASS; then `npx tsc --noEmit` and fix any literal `Numeral` in tests.

- [ ] **Step 5: The field and the page.** Add to `typed-progression.test.ts`:

```ts
it('reads the sheets’ degrees and chords of any quality', () => {
  const D_MINOR: Key = { tonic: note('D'), minor: true }
  const read = (text: string, key: Key) => (readProgression(text, key) ?? []).map(numeralText)
  expect(read('IIm7 – V7 – Imaj7', C)).toEqual(['ii7', 'V7', 'IMaj7'])
  expect(read('Dm7 G7 C6', C)).toEqual(['ii7', 'V7', 'I6'])
  expect(read('Dm7 Gm9 Asus4 Dm7', D_MINOR)).toEqual(['i7', 'iv9', 'Vsus4', 'i7'])
})
```

and to `ProgressionsPage.test.tsx`:

```tsx
it('reads a 6th chord typed, and a chord a URL must escape', async () => {
  const user = userEvent.setup()
  const { router } = await renderApp('/practice/progressions')
  const field = await screen.findByRole('textbox', { name: 'Numerals or chords' })
  await user.clear(field)
  await user.type(field, 'Dm7 G7 C6')
  expect(router.state.location.search).toEqual({ p: 'ii7-V7-I6' })
  expect(row()).toEqual(['Dm7ii7', 'G7V7', 'C6I6'])
})

it('opens on a line whose chords a URL escapes', async () => {
  await renderApp(`/practice/progressions?p=${encodeURIComponent('I6/9-V7#9-III+')}`)
  await screen.findByRole('list', { name: 'Chords' })
  expect(row()).toEqual(['C6/9I6/9', 'G7#9V7#9', 'E+III+'])
})
```

Run both files — expect PASS (no code change beyond the kernel's).

- [ ] **Step 6: Verify and commit** — `npm run typecheck && npm run lint && npm run test`, prettier on touched files.

```bash
git add src/shared/lib/music src/widgets/progressions/model/typed-progression.test.ts src/pages/progressions/ui/ProgressionsPage.test.tsx
git commit -m "Numerals: a degree carries any chord of the table, read the sheets' way"
```

### Task 2: A row's hands

**Files:**

- Modify: `src/shared/lib/music/voice-lead.ts`
- Test: `src/shared/lib/music/voice-lead.test.ts`

**Interfaces:**

- Produces: `voiceLead(chords: readonly Chord[]): Midi[][]`, unchanged in shape: each chord its bass, then the hand.

- [ ] **Step 1: Write the failing tests** (the shapes are the sheet's, p.9 Step 1 and p.6 moved to B♭):

```ts
const voiced = (...symbols: string[]) => voiceLead(symbols.map(parseChordSymbol))

it('leaves a 9th chord’s root to the bass: the hand plays its 3rd, 5th, 7th and 9th', () => {
  expect(voiced('Dm9', 'G9', 'CMaj9')).toEqual([
    [50, 65, 69, 72, 76],
    [55, 65, 69, 71, 74],
    [48, 64, 67, 71, 74],
  ])
})

it('takes the nearest inversion though it starts on the root, the bass an octave under it', () => {
  expect(voiced('Cm7', 'F7', 'BbMaj7')).toEqual([
    [48, 60, 63, 67, 70],
    [53, 60, 63, 65, 69],
    [46, 58, 62, 65, 69],
  ])
})

it('voices a row of one chord, of none, and a 13th', () => {
  expect(voiced('C')).toEqual([[48, 60, 64, 67]])
  expect(voiced()).toEqual([])
  const [[bass = 0, ...hand] = []] = voiced('G13')
  expect(hand).toHaveLength(5)
  expect(hand.map((key) => key % 12)).not.toContain(7)
  expect(Math.min(...hand)).toBeGreaterThan(bass)
})
```

and widen the existing "keeps the right hand above the bass" test's qualities with `'m9'`, `'n9'`, `'maj9'`, `'n13'`.

- [ ] **Step 2: Run** `npx vitest run src/shared/lib/music/voice-lead.test.ts` — expect the three new tests to fail.

- [ ] **Step 3: Implement:**

```ts
/** The bass plays each root between C3 and B3, an octave lower where the hand reaches down to it. */
const BASS_FROM = 48
/** A chord of this many notes leaves its root to the bass. */
const ROOTLESS_FROM = 5

export function voiceLead(chords: readonly Chord[]): Midi[][] {
  let previous: readonly Midi[] | null = null
  return chords.map((chord) => {
    const tones = spellChord(chord.root, chord.quality)
    const [rootTone] = tones
    const held = tones.length >= ROOTLESS_FROM ? tones.slice(1) : tones
    const options = Array.from({ length: lastInversion(held.length) + 1 }, (_, inversion) =>
      placeChord(held, { inversion, bothHands: false }).rh.map((placed) => placed.midi),
    ).flatMap((keys) => [keys, keys.map((key) => midi(key - 12))])
    const [first = []] = options
    const target = previous === null ? null : middle(previous)
    const hand =
      target === null
        ? first
        : options.reduce((best, keys) =>
            Math.abs(middle(keys) - target) < Math.abs(middle(best) - target) ? keys : best,
          )
    previous = hand
    const root = BASS_FROM + (rootTone?.pitchClass ?? 0)
    return [midi(root < Math.min(...hand) ? root : root - 12), ...hand]
  })
}
```

with the doc comment saying both rules.

- [ ] **Step 4: Run** the file — expect PASS — then the suites that play rows:
      `npx vitest run src/pages/progressions src/pages/passing-chords src/widgets/lesson-view`.

- [ ] **Step 5: Verify and commit**

```bash
git add src/shared/lib/music/voice-lead.ts src/shared/lib/music/voice-lead.test.ts
git commit -m "Rows: a 9th's root is the bass's, and the bass sits under the hand"
```

### Task 3: The walks as rows

**Files:**

- Modify: `src/widgets/progressions/ui/ProgressionPractice.tsx`, `src/app/routes/player-search.ts`
- Test: `src/pages/progressions/ui/ProgressionsPage.test.tsx`, `src/app/remembered-views.test.tsx`

**Interfaces:**

- Consumes: `KEY_WALKS` (`@/shared/lib/music`), `InPlayer` (`../model/progressions-view`).
- Produces: `PROGRESSION_KEPT` without `'walk'`.

- [ ] **Step 1: Write the failing tests.** In `ProgressionsPage.test.tsx`, in place of "opens it through the keys,
      round the circle of fifths":

```tsx
it('lists every walk through the keys as a row into the Player, and the key alone', async () => {
  await renderApp('/practice/progressions?p=ii-V-I&size=sevenths')
  const walks = within(await screen.findByRole('region', { name: 'Through the keys' })).getAllByRole('link')
  expect(walks.map((link) => link.textContent)).toEqual([
    'Up by semitones',
    'Down by semitones',
    'Up by whole tones',
    'Down by whole tones',
    'Round the circle of fifths',
  ])
  expect(walks.map((link) => /walk=([a-z-]+)/.exec(link.getAttribute('href') ?? '')?.[1])).toEqual([
    'semitones-up',
    'semitones-down',
    'tones-up',
    'tones-down',
    'fifths',
  ])
  const alone = screen.getByRole('link', { name: 'In C major' })
  expect(alone.getAttribute('href')).not.toMatch(/walk=/)
})
```

In `remembered-views.test.tsx`, "opens the progression the tool names, played the learner's way" expects
`{ p: 'I-IV-V', key: 'G', pattern: 'jazz' }`: the pattern is the learner's, the walk is not.

- [ ] **Step 2: Run** both files — expect FAIL (one walk row; `walk: 'fifths'` kept).

- [ ] **Step 3: Implement.** `ProgressionPractice` returns two groups:

```tsx
<>
  <RowGroup title={t('practice:inPlayer')}>
    <li>
      <RowLink
        title={t('learn:progressions.inKey', { key: keyName(musicKey) })}
        icon={Music}
        paint="grass"
        render={<Link to="/play/progression" search={inPlayer} />}
      />
    </li>
  </RowGroup>
  <RowGroup title={t('learn:progressions.throughKeys')}>
    {KEY_WALKS.map((walk) => (
      <li key={walk}>
        <RowLink
          title={t(`player:keyWalk.${walk}`)}
          icon={Footprints}
          paint="lilac"
          render={<Link to="/play/progression" search={{ ...inPlayer, walk }} />}
        />
      </li>
    ))}
  </RowGroup>
</>
```

and `PROGRESSION_KEPT` is `PLAYING` (its comment: the tool names the walk).

- [ ] **Step 4: Run** both files, then `npx vitest run src/app src/pages/player src/widgets/lesson-view` — expect PASS.

- [ ] **Step 5: Verify and commit** — `npm run typecheck && npm run lint && npm run test && npm run build`.

```bash
git add src/widgets/progressions/ui/ProgressionPractice.tsx src/app/routes/player-search.ts src/pages/progressions/ui/ProgressionsPage.test.tsx src/app/remembered-views.test.tsx
git commit -m "Progressions: every walk through the keys a row, and the key alone"
```

### Task 4: Docs

**Files:**

- Create: `docs/adr/0032-a-numeral-carries-its-chord.md`
- Modify: `docs/CONTENT.md` (numerals in the library and a lesson), `docs/UBIQUITOUS_LANGUAGE.md` (Numerals),
  `docs/CODE_STYLE.md` §8 (a row's hands), `docs/adr/0022-…md` is left as written (ADR 0032 amends its table),
  `CLAUDE.md` (the kernel's numerals, `ProgressionPractice`'s rows)

- [ ] **Step 1:** Write ADR 0032 (amends 0020 and 0022): the three decisions of the spec and their consequences.
- [ ] **Step 2:** Update the four docs to what the code does; `npx prettier --write` on them.
- [ ] **Step 3:** Commit: `Docs: ADR 0032, numerals that carry a chord, a row's hands and the walks as rows`.
