# The chromatic walk and «Ромашковые поля» Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or
> superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** «Ромашковые поля» played exactly as the course writes it (verse, chorus, both endings; only its 7th chords
grow to 9ths), and a chromatic walk of any chosen chord types, root by root, in the Player.

**Architecture:** A Progression may be written in the chart's `Section`s, each line packed into bars on its own. The
chromatic walk is a pure chart builder in `features/practice` (beside the scale walk), handed to the Player by a new
page hook filling `PlayerLayout` at `/play/chromatic`. The Setup sheet learns to close the figures that play the
key's triads (a chromatic walk has no key), and `MultiDropdown` learns `Dropdown`'s groups and second word.

**Tech Stack:** React 19, Vite, strict TypeScript 6, TanStack Router (code-based), zustand, i18next, Vitest 4 +
jsdom 29 + Testing Library, VexFlow (sheet music), Base UI's Select under `shared/ui/primitives`.

**Spec:** `docs/superpowers/specs/2026-09-29-chromatic-walk-and-daisy-fields-design.md`

## Global Constraints

- FSD, lint-enforced: `app → pages → widgets → features → entities → shared`; another slice only through its
  `index.ts`. `shared/lib/music` imports only itself.
- Strict TS: `noUncheckedIndexedAccess`, `verbatimModuleSyntax` (`import type`), no `any`, no casts in product code,
  no `eslint-disable`.
- Tests colocated, Vitest with `globals: false` (import `describe`/`it`/`expect`/`vi`). A screen's test runs the app
  through `renderApp` from `@/app/testing/render-app`.
- Prettier: no semicolons, single quotes, trailing commas `all`, printWidth 100. Format only the files you touched:
  `npx prettier --write <files>`. **Never** `npm run format`.
- Every UI string in `en` and `ru` (`src/shared/i18n/locales/{en,ru}/<namespace>.ts`); Russian is typed against
  English, so a missing key fails `tsc`.
- Saved data keeps working: the piece id `romashki` never changes.
- Words (glossary): "Chromatic walk" («По полутонам»), "Chord types" («Виды аккордов»), Up · Down · Up and down
  («Вверх · Вниз · Вверх и вниз»), "Needs a key" («Нужна тональность»), "Exercises" («Упражнения»).
- Commits go on `main` directly, each message a plain sentence (no `feat:` prefix) ending with the line
  `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Verify before claiming done: `npm run typecheck && npm run lint && npm run test`, and `npm run build` (a new route).

## Review Focus

1. **A loop past a shorter walk.** `loop=20-24` kept in the URL after the Setup shortens the walk to 13 bars: the
   Player ignores the loop (`readLoop` returns `null`) and still plays. Pinned in Task 6.
2. **A root in another spelling.** `/play/chromatic?chords=m9&root=Ab`: the URL reads `root=G#`, the Setup's Root
   pop-up shows it chosen, the title reads `G#m9`. Pinned in Task 6 (search test).
3. **The big chords on every root.** `alt` (7 notes) and `n13` (6 notes) from all 12 roots, up and down: every note
   on the piano, the sheet music filling each bar. Pinned in Task 5.
4. **A key-bound pattern reached by URL.** `/play/chromatic?pattern=flow&rh=flow`: the walk plays its own Block
   pattern, never C major's I–IV–V over G♯m9. Pinned in Task 6 (`chromaticChoice`).
5. **Emptying the chord types.** Unchecking the last checked type leaves it checked; `chords=` or `chords=xx` in the
   URL is the major triad. Pinned in Tasks 5 and 6.

---

### Task 1: A Progression may be written in sections

**Files:**

- Modify: `src/entities/piece/model/types.ts` (`Section.lines` doc, `ProgressionPiece.progression`)
- Modify: `src/entities/piece/model/parse-progression.ts`
- Modify: `src/entities/piece/ui/use-section-heading.ts`
- Modify: `src/entities/piece/testing/test-pieces.ts`
- Test: `src/entities/piece/model/parse-progression.test.ts`, `src/entities/piece/ui/piece-ui.test.tsx`

**Interfaces:**

- Produces: `ProgressionPiece.progression: string | readonly Section[]`; `parseProgression(piece, size): Chart`
  (unchanged signature) writing one Chart section per `Section`, one Chart line per written line;
  `usePieceHeadings(piece)` heading a sectioned progression like a chart.

- [ ] **Step 1: Write the failing tests**

Append to `src/entities/piece/model/parse-progression.test.ts` (after the existing `describe`):

```ts
describe('parseProgression in sections', () => {
  it('writes each line of a section as its own line of bars, a chart section per section', () => {
    const chart = parseProgression(
      testProgression([
        { kind: 'verse', lines: ['I:maj:4 IV:maj:2', 'V:dom:4'] },
        { kind: 'chorus', last: true, lines: ['vi:min:2 IV:maj:2 I:maj:4'] },
      ]),
      'sevenths',
    )
    expect(chart.sections.map((section) => section.lines.map((line) => line.length))).toEqual([
      [2, 1],
      [2],
    ])
    expect(bars(chart)).toEqual(['CMaj7 4', 'FMaj7 2', 'G7 4', 'Am7 2 | FMaj7 2', 'CMaj7 4'])
  })

  it('names the section, line and chord it cannot read', () => {
    expect(() =>
      parseProgression(
        testProgression([{ kind: 'verse', lines: ['I:maj:4', 'V:dom:4 IV:mj:4'] }]),
        'triads',
      ),
    ).toThrow('prog · section 1, line 2, chord 2: unknown function in "IV:mj:4"')
  })
})
```

In `src/entities/piece/ui/piece-ui.test.tsx`, add the import
`import { testProgression } from '../testing/test-pieces'` and append inside `describe('a piece’s headings', …)`:

```ts
  it('head a progression written in sections as a chart’s', () => {
    const sectioned = testProgression([
      { kind: 'verse', lines: ['I:maj:4'] },
      { kind: 'chorus', last: true, lines: ['V:dom:4'] },
    ])
    expect(renderHook(() => usePieceHeadings(sectioned)).result.current).toEqual([
      'Verse',
      'Last chorus',
    ])
  })
```

- [ ] **Step 2: Run the tests to see them fail**

Run: `npx vitest run src/entities/piece/model/parse-progression.test.ts src/entities/piece/ui/piece-ui.test.tsx`
Expected: FAIL (type error or `progression.split is not a function`).

- [ ] **Step 3: Widen the type**

In `src/entities/piece/model/types.ts`, change `Section.lines`' doc and `ProgressionPiece`:

```ts
  /** A chart's bars separated by spaces, or a sectioned progression's chords; see docs/CONTENT.md. */
  readonly lines: readonly string[]
```

```ts
export interface ProgressionPiece extends PieceCommon {
  readonly kind: 'progression'
  readonly chordSize: { readonly default: ChordSize; readonly choosable: boolean }
  /**
   * Degree, function and beats per chord (`ii:min:4 V:dom:4 I:maj:8`), four bars a line under one
   * heading; or a chart's Sections whose lines are written so, each line of the chart as written.
   */
  readonly progression: string | readonly Section[]
}
```

In `src/entities/piece/testing/test-pieces.ts`, widen `testProgression`'s first parameter:

```ts
export function testProgression(
  progression: ProgressionPiece['progression'],
  overrides: Partial<ProgressionPiece> = {},
): ProgressionPiece {
```

- [ ] **Step 4: Parse sections line by line**

In `src/entities/piece/model/parse-progression.ts`, change the `content-error` import to
`import { ContentError, type ContentPosition } from './content-error'` and the `arrangement` import to
`import type { Chart, ChartBar, ChartChord } from '@/shared/lib/arrangement'` (unchanged if already so). Replace
`parseProgression` with:

```ts
/** Bars four to a line: a one-string progression's layout. */
const fourToALine = (bars: readonly ChartBar[]): ChartBar[][] =>
  Array.from({ length: Math.ceil(bars.length / BARS_PER_LINE) }, (_, i) =>
    bars.slice(i * BARS_PER_LINE, (i + 1) * BARS_PER_LINE),
  )

/**
 * Reads a progression at a chord size into a chart of real bars: one string four bars a line, or
 * sections line by line, each line starting on a new bar.
 */
export function parseProgression(piece: ProgressionPiece, size: ChordSize): Chart {
  if (!CHORD_SIZES.includes(size)) throw new RangeError(`Unknown chord size "${size}"`)
  const meterTicks = beatsPerBar(piece.meter) * TICKS_PER_BEAT
  const barsOf = (written: string, at: ContentPosition): ChartBar[] =>
    packIntoBars(
      written
        .split(/\s+/)
        .filter(Boolean)
        .map((token, i) =>
          readChord(token, piece, size, (problem) => {
            throw new ContentError(piece.id, { ...at, chord: i + 1 }, problem)
          }),
        ),
      meterTicks,
    )
  const sections =
    typeof piece.progression === 'string'
      ? [{ lines: fourToALine(barsOf(piece.progression, {})) }]
      : piece.progression.map((section, s) => ({
          lines: section.lines.map((line, l) => barsOf(line, { section: s + 1, line: l + 1 })),
        }))
  return { key: pieceKey(piece), meter: piece.meter, sections }
}
```

- [ ] **Step 5: Head sections as a chart's**

In `src/entities/piece/ui/use-section-heading.ts`, replace `usePieceHeadings`:

```ts
/** The headings a piece's chart is shown under: its sections in order, or a one-string progression's one. */
export function usePieceHeadings(piece: Piece): string[] {
  const { t } = useTranslation('piece')
  const heading = useSectionHeading()
  if (piece.kind !== 'progression') return piece.sections.map(heading)
  return typeof piece.progression === 'string' ? [t('progression')] : piece.progression.map(heading)
}
```

- [ ] **Step 6: Run the tests to see them pass**

Run: `npx vitest run src/entities/piece`
Expected: PASS (the existing one-string tests still pass: their messages name only the chord).

- [ ] **Step 7: Typecheck, format, commit**

```bash
npm run typecheck
npx prettier --write src/entities/piece/model/types.ts src/entities/piece/model/parse-progression.ts src/entities/piece/model/parse-progression.test.ts src/entities/piece/ui/use-section-heading.ts src/entities/piece/ui/piece-ui.test.tsx src/entities/piece/testing/test-pieces.ts
git add src/entities/piece
git commit -m "$(printf 'Write a progression in sections, each line packed into bars and headed as a chart'"'"'s\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>')"
```

---

### Task 2: «Ромашковые поля» as the course writes it

**Files:**

- Modify: `src/entities/piece/content/progressions/romashki.ts`
- Test: `src/entities/piece/content/catalog.test.ts:200-210`

**Interfaces:**

- Consumes: Task 1's sectioned `progression`.

- [ ] **Step 1: Write the failing test**

In `src/entities/piece/content/catalog.test.ts`, add `type ChordSize,` to the `from '../index'` import and replace
the test `'reads Ромашковые поля as the course writes it'` with:

```ts
  it('reads Ромашковые поля as the course writes it, growing only its 7th chords', () => {
    const romashki = pieceById('romashki')
    if (!romashki) throw new Error('missing piece')
    const lines = (size: ChordSize) =>
      chartOf(romashki, size).sections.map((section) =>
        section.lines.map((line) =>
          line.map((bar) => bar.chords.map((chord) => chordSymbol(chord)).join(' ')).join(' | '),
        ),
      )
    expect(lines('sevenths')).toEqual([
      ['Dm7 | Gm7 Asus4 | Dm7', 'Gm Csus4 | Am D | D/F# Gm', 'Csus4 C F | B♭ Gm', 'Em7♭5 | Asus4 A'],
      ['Dm7 Gm7 | Csus2 C FMaj7 D7', 'Gm7 Dm/F | Em7♭5 Asus4 A'],
      ['Dm7 Gm7 | Csus2 C FMaj7 D7', 'Gm7 Dm/F | Em7♭5 A Dm6'],
    ])
    expect(lines('ninths')[1]).toEqual([
      'Dm9 Gm9 | Csus2 C FMaj9 D7♭9',
      'Gm9 Dm/F | Em7♭5 Asus4 A',
    ])
    expect(lines('triads')[1]).toEqual(['Dm Gm | Csus2 C F D', 'Gm Dm/F | E° Asus4 A'])
  })
```

- [ ] **Step 2: Run it to see it fail**

Run: `npx vitest run src/entities/piece/content/catalog.test.ts -t "Ромашковые"`
Expected: FAIL (one section, `C7`, `A7`, `Dm7/F`).

- [ ] **Step 3: Write the song**

Replace `src/entities/piece/content/progressions/romashki.ts` with:

```ts
import { definePiece } from '../../model/types'

export default definePiece({
  id: 'romashki',
  kind: 'progression',
  title: 'Ромашковые поля',
  titleEn: 'Daisy fields',
  key: 'Dm',
  meter: '4/4',
  tempo: 72,
  pattern: 'pop8',
  chordSize: { default: 'sevenths', choosable: true },
  progression: [
    {
      kind: 'verse',
      lines: [
        'i:min:4 iv:min:2 V:=sus4:2 i:min:4',
        'iv:=min:2 ♭VII:=sus4:2 v:=min:2 I:=maj:2 I:=maj:2/3 iv:=min:2',
        '♭VII:=sus4:1 ♭VII:=maj:1 ♭III:=maj:2 ♭VI:=maj:2 iv:=min:2',
        'ii:hd:4 V:=sus4:2 V:=maj:2',
      ],
    },
    {
      kind: 'chorus',
      lines: [
        'i:min:2 iv:min:2 ♭VII:=sus2:1 ♭VII:=maj:1 ♭III:maj:1 I:domb9:1',
        'iv:min:2 i:=min:2/3 ii:hd:2 V:=sus4:1 V:=maj:1',
      ],
    },
    {
      kind: 'chorus',
      last: true,
      lines: [
        'i:min:2 iv:min:2 ♭VII:=sus2:1 ♭VII:=maj:1 ♭III:maj:1 I:domb9:1',
        'iv:min:2 i:=min:2/3 ii:hd:1 V:=maj:1 i:=m6:2',
      ],
    },
  ],
  note: {
    en: 'From Vasily Gorshkov’s accompaniment course, the chorus written out twice: with its 1st ending, then its 2nd. With 9ths only the 7th chords grow, as the course teaches: Dm9, Gm9, FMaj9, and D7♭9 into Gm.',
    ru: 'Из курса по аккомпанементу Василия Горшкова; припев выписан дважды: с первой вольтой, затем со второй. С нонаккордами растут только септаккорды, как учит курс: Dm9, Gm9, FMaj9 и D7♭9 перед Gm.',
  },
})
```

- [ ] **Step 4: Run the content's tests**

Run: `npx vitest run src/entities/piece src/entities/path src/features/practice/notate-pieces.test.ts`
Expected: PASS (the catalog arranges it in 12 keys with all 39 patterns; the path still names `romashki`; the
sheet music writes it).

- [ ] **Step 5: Format and commit**

```bash
npx prettier --write src/entities/piece/content/progressions/romashki.ts src/entities/piece/content/catalog.test.ts
git add src/entities/piece/content
git commit -m "$(printf 'Write «Ромашковые поля» as the course does: verse, chorus and both endings, only its 7th chords growing to 9ths\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>')"
```

---

### Task 3: `MultiDropdown` gets `Dropdown`'s groups and second word

**Files:**

- Modify: `src/shared/ui/option.ts`
- Create: `src/shared/ui/OptionItems.tsx`
- Modify: `src/shared/ui/Dropdown.tsx`, `src/shared/ui/MultiDropdown.tsx`
- Test: `src/shared/ui/MultiDropdown.test.tsx`

**Interfaces:**

- Produces: `MultiDropdown<V>({ label, none?, value, onChange, className?, options | groups })`, each option's
  `detail` shown after its label, `title` its accessible name; `none` optional (a pop-up that never empties has
  none). `Choices<V>` and `ChoiceGroup<V>` in `option.ts`.

- [ ] **Step 1: Write the failing test**

Append inside `describe('MultiDropdown', …)` in `src/shared/ui/MultiDropdown.test.tsx`:

```tsx
  it('lists groups under their labels, each item named by its title, its second word shown', async () => {
    const user = userEvent.setup()
    render(
      <MultiDropdown
        label="Chord types"
        value={['m9']}
        groups={[
          {
            label: 'Triads',
            options: [{ value: 'maj', label: 'M', title: 'Major triad', detail: 'Major triad' }],
          },
          {
            label: '9ths & more',
            options: [{ value: 'm9', label: 'm9', title: 'Minor 9th', detail: 'Minor 9th' }],
          },
        ]}
        onChange={vi.fn()}
      />,
    )
    const button = screen.getByRole('combobox', { name: 'Chord types' })
    expect(button).toHaveTextContent('Chord typesm9')
    await user.click(button)
    expect(await screen.findByText('Triads')).toBeInTheDocument()
    expect(screen.getByText('9ths & more')).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Minor 9th' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('option', { name: 'Major triad' })).toHaveTextContent('M Major triad')
  })
```

- [ ] **Step 2: Run it to see it fail**

Run: `npx vitest run src/shared/ui/MultiDropdown.test.tsx`
Expected: FAIL (`groups` is not a prop; `none` is required).

- [ ] **Step 3: Share the choices' type and the list's items**

Append to `src/shared/ui/option.ts`:

```ts
/** A group of a pop-up's options, under its label where it has one. */
export interface ChoiceGroup<V extends OptionValue> {
  readonly label?: string
  readonly options: readonly Option<V>[]
}

/** A pop-up's choices: a list of options, or groups of them under their labels. */
export type Choices<V extends OptionValue> =
  | { readonly options: readonly Option<V>[]; readonly groups?: never }
  | { readonly groups: readonly OptionGroup<V>[]; readonly options?: never }

/** The groups a pop-up lists: its own, or one unlabelled group of its options. */
export const choiceGroups = <V extends OptionValue>(
  choices: Choices<V>,
): readonly ChoiceGroup<V>[] => choices.groups ?? [{ options: choices.options }]
```

Create `src/shared/ui/OptionItems.tsx`:

```tsx
import { Fragment } from 'react'
import type { ChoiceGroup, OptionValue } from './option'
import { SelectGroup, SelectItem, SelectLabel, SelectSeparator } from './primitives/select'

/**
 * A pop-up list's items group by group: a group's label over its items, a line between groups, an
 * item's second word in soft ink after its label.
 */
export function OptionItems<V extends OptionValue>({
  groups,
}: {
  groups: readonly ChoiceGroup<V>[]
}) {
  return (
    <>
      {groups.map((group, i) => (
        <Fragment key={group.label ?? i}>
          {i > 0 ? <SelectSeparator /> : null}
          <SelectGroup>
            {group.label ? <SelectLabel>{group.label}</SelectLabel> : null}
            {group.options.map((option) => (
              <SelectItem
                key={String(option.value)}
                value={option.value}
                aria-label={option.title}
              >
                {option.label}
                {option.detail ? (
                  <>
                    {' '}
                    <span className="text-muted-foreground">{option.detail}</span>
                  </>
                ) : null}
              </SelectItem>
            ))}
          </SelectGroup>
        </Fragment>
      ))}
    </>
  )
}
```

- [ ] **Step 4: Both pop-ups list through it**

Replace `src/shared/ui/Dropdown.tsx` with:

```tsx
import { choiceGroups, type Choices, type OptionValue } from './option'
import { OptionItems } from './OptionItems'
import { Select, SelectContent, SelectTrigger, SelectValue } from './primitives/select'

/**
 * One choice of many behind a pop-up button (Apple's): the button shows its label and the current
 * value, the list checks it. Five or fewer short nouns are a `Segmented` instead.
 */
export function Dropdown<V extends OptionValue>({
  label,
  value,
  onChange,
  className,
  ...choices
}: {
  label: string
  value: V
  onChange: (value: V) => void
  className?: string
} & Choices<V>) {
  const groups = choiceGroups(choices)
  const items = groups.flatMap((group) =>
    group.options.map((option) => ({ value: option.value, label: option.label })),
  )
  return (
    <Select
      items={items}
      value={value}
      onValueChange={(next) => {
        if (next !== null && next !== value) onChange(next)
      }}
    >
      <SelectTrigger aria-label={label} className={className}>
        <span aria-hidden className="text-muted-foreground">
          {label}
        </span>
        <SelectValue className="block min-w-0 flex-1 truncate text-left font-semibold" />
      </SelectTrigger>
      <SelectContent>
        <OptionItems groups={groups} />
      </SelectContent>
    </Select>
  )
}
```

Replace `src/shared/ui/MultiDropdown.tsx` with:

```tsx
import { choiceGroups, type Choices, type OptionValue } from './option'
import { OptionItems } from './OptionItems'
import { Select, SelectContent, SelectTrigger, SelectValue } from './primitives/select'

/**
 * Several choices of many behind a pop-up button: the button shows its label and the chosen, the
 * list checks each, a tap on an item turning it on or off. `none` names an empty choice; a pop-up
 * that never empties has none.
 */
export function MultiDropdown<V extends OptionValue>({
  label,
  none,
  value,
  onChange,
  className,
  ...choices
}: {
  label: string
  none?: string
  value: readonly V[]
  onChange: (value: V[]) => void
  className?: string
} & Choices<V>) {
  const groups = choiceGroups(choices)
  const options = groups.flatMap((group) => group.options)
  return (
    <Select
      multiple
      items={options.map((option) => ({ value: option.value, label: option.label }))}
      value={[...value]}
      onValueChange={(next: V[]) => onChange(next)}
    >
      <SelectTrigger aria-label={label} className={className}>
        <span aria-hidden className="text-muted-foreground">
          {label}
        </span>
        <SelectValue className="block min-w-0 flex-1 truncate text-left font-semibold">
          {(chosen: V[]) =>
            chosen.length === 0
              ? none
              : options
                  .filter((option) => chosen.includes(option.value))
                  .map((option) => option.label)
                  .join(' ')
          }
        </SelectValue>
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false}>
        <OptionItems groups={groups} />
      </SelectContent>
    </Select>
  )
}
```

- [ ] **Step 5: Run the kit's tests**

Run: `npx vitest run src/shared/ui src/pages/chords`
Expected: PASS (the Alterations pop-up and every Dropdown still work).

- [ ] **Step 6: Typecheck, lint, format, commit**

```bash
npm run typecheck && npm run lint
npx prettier --write src/shared/ui/option.ts src/shared/ui/OptionItems.tsx src/shared/ui/Dropdown.tsx src/shared/ui/MultiDropdown.tsx src/shared/ui/MultiDropdown.test.tsx
git add src/shared/ui
git commit -m "$(printf 'Group a MultiDropdown'"'"'s items and show their second word, as a Dropdown'"'"'s\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>')"
```

---

### Task 4: A source without a key closes the figures that play the key's triads

**Files:**

- Modify: `src/shared/lib/arrangement/figure.ts`, `src/shared/lib/arrangement/index.ts`
- Modify: `src/entities/pattern/model/selectors.ts`, `src/entities/pattern/index.ts`
- Modify: `src/widgets/player-setup/ui/PlayerSetup.tsx`, `src/widgets/player-setup/ui/FigurePage.tsx`
- Modify: `src/pages/player/ui/PieceSetup.tsx`, `src/pages/player/ui/WalkSetup.tsx`
- Modify: `src/shared/i18n/locales/en/player.ts`, `src/shared/i18n/locales/ru/player.ts`
- Test: `src/shared/lib/arrangement/figure.test.ts`, `src/entities/pattern/model/selectors.test.ts`,
  `src/widgets/player-setup/ui/PlayerSetup.test.tsx`

**Interfaces:**

- Produces: `playsKeyTriads(figure: Figure): boolean` (from `@/shared/lib/arrangement`);
  `needsKey(id: PatternId): boolean` (from `@/entities/pattern`); `PlayerSetup`'s new required prop
  `keyed: boolean`; `player:needsKey`.

- [ ] **Step 1: Write the failing tests**

Append to `src/shared/lib/arrangement/figure.test.ts` (add `playsKeyTriads` to its `./figure` import):

```ts
describe('playsKeyTriads', () => {
  it('finds the key’s triads in any of a figure’s events', () => {
    expect(playsKeyTriads({ kind: 'events', events: parseFigure('0/4 Ka,4/4 C') })).toBe(true)
    expect(
      playsKeyTriads({
        kind: 'events',
        events: parseFigure('0/16 C'),
        inThree: parseFigure('0/4 Kb'),
      }),
    ).toBe(true)
    expect(playsKeyTriads({ kind: 'events', events: parseFigure('0/4 C,4/4 T1') })).toBe(false)
  })
})
```

Append to `src/entities/pattern/model/selectors.test.ts` (import `needsKey` from `./selectors`, `PATTERN_IDS`,
`RIGHT_FIGURE_IDS`, `LEFT_FIGURE_IDS` from `./types`, `RIGHT_FIGURES`, `LEFT_FIGURES` from `../content/figures`,
`playsKeyTriads` from `@/shared/lib/arrangement`, as the file does not already):

```ts
describe('what needs a key', () => {
  it('is the Chord flow alone: its right hand plays the key’s triads', () => {
    expect(PATTERN_IDS.filter(needsKey)).toEqual(['flow'])
    expect(RIGHT_FIGURE_IDS.filter((id) => playsKeyTriads(RIGHT_FIGURES[id].figure))).toEqual([
      'flow',
    ])
    expect(LEFT_FIGURE_IDS.filter((id) => playsKeyTriads(LEFT_FIGURES[id].figure))).toEqual([])
  })
})
```

In `src/widgets/player-setup/ui/PlayerSetup.test.tsx`, give `renderSetup` a `keyed` option and pass it:

```tsx
function renderSetup({ methods = false, melody = false, keyed = true } = {}) {
```

```tsx
      melody={melody}
      keyed={keyed}
```

and append inside `describe('PlayerSetup', …)`:

```tsx
  it('closes what plays the key’s triads to a source without a key', async () => {
    const user = userEvent.setup()
    renderSetup({ keyed: false })
    await user.click(screen.getByRole('button', { name: /^Pattern/ }))
    expect(
      screen.getByRole('button', { name: (name) => name.includes(PATTERNS.flow.name.en) }),
    ).toBeDisabled()
    expect(screen.getByText('Needs a key')).toBeInTheDocument()
  })

  it('keeps the Chord flow for a source in a key', async () => {
    const user = userEvent.setup()
    renderSetup()
    await user.click(screen.getByRole('button', { name: /^Pattern/ }))
    expect(
      screen.getByRole('button', { name: (name) => name.includes(PATTERNS.flow.name.en) }),
    ).toBeEnabled()
  })
```

- [ ] **Step 2: Run them to see them fail**

Run:
`npx vitest run src/shared/lib/arrangement/figure.test.ts src/entities/pattern src/widgets/player-setup`
Expected: FAIL (`playsKeyTriads`, `needsKey` and `keyed` do not exist).

- [ ] **Step 3: Read the key's triads from a figure's tokens**

Append to `src/shared/lib/arrangement/figure.ts` (import `EventFigure`, `Figure`, `FigureEvent` types from
`./types` if the file does not already):

```ts
const eventsPlayKeyTriads = (events: readonly FigureEvent[]): boolean =>
  events.some((event) => event.tones.some((tone) => tone.token.kind === 'key-triad'))

/** Whether a figure plays the key's triads (`Ka` `Kb` `Kc`): only a source in a key can play it. */
export function playsKeyTriads(figure: Figure): boolean {
  const eventFigures: readonly EventFigure[] =
    figure.kind === 'events'
      ? [figure]
      : figure.use === 'ends'
        ? [figure.between, figure.withoutMelody]
        : [figure.withoutMelody]
  return eventFigures.some((each) =>
    [each.events, each.inThree ?? [], each.onMajor ?? []].some(eventsPlayKeyTriads),
  )
}
```

In `src/shared/lib/arrangement/index.ts`: `export { parseFigure, playsKeyTriads } from './figure'`.

In `src/entities/pattern/model/selectors.ts`, add `import { playsKeyTriads } from '@/shared/lib/arrangement'` and:

```ts
/** A pattern that plays the key's triads (the Chord flow): it needs a source in a key. */
export const needsKey = (id: PatternId): boolean =>
  playsKeyTriads(PATTERNS[id].pattern.rh) || playsKeyTriads(PATTERNS[id].pattern.lh)
```

In `src/entities/pattern/index.ts`: `export { needsKey, needsMelody, patternsIn } from './model/selectors'`.

- [ ] **Step 4: The Setup closes them, with a note**

In `src/shared/i18n/locales/en/player.ts`, after `needsMelody`: `needsKey: 'Needs a key',`. In
`src/shared/i18n/locales/ru/player.ts`, after `needsMelody`: `needsKey: 'Нужна тональность',`.

In `src/widgets/player-setup/ui/PlayerSetup.tsx`:

- add `needsKey` to the `@/entities/pattern` import;
- add the prop after `melody`: in the destructuring `keyed,` and in the type
  `/** The source is in a key, for a figure that plays its triads. */ keyed: boolean`;
- after `const noMelody = …` add `const noKey = keyed ? undefined : t('needsKey')`;
- in the pattern items replace the `disabledNote` spread with:

```tsx
                      ...(needsMelody(id) && noMelody
                        ? { disabledNote: noMelody }
                        : needsKey(id) && noKey
                          ? { disabledNote: noKey }
                          : {}),
```

- pass `noKey={noKey}` to both `FigurePage`s.

In `src/widgets/player-setup/ui/FigurePage.tsx`:

- change the arrangement import to `import { playsKeyTriads, type Figure } from '@/shared/lib/arrangement'`;
- update the doc comment's last line to "one that plays the tune is closed to a piece without a melody, one that
  plays the key's triads to a source without a key.";
- add the prop after `noMelody`: in the destructuring `noKey,` and in the type
  `/** Why a figure that plays the key's triads is closed; nothing for a source in a key. */ noKey: string | undefined`;
- replace the items' mapping with:

```tsx
          ...ids.map((id) => {
            const { name, figure } = figures[id]
            const closed =
              figure.kind === 'melody' ? noMelody : playsKeyTriads(figure) ? noKey : undefined
            return {
              value: id,
              label: localText(name, locale),
              ...(closed ? { disabledNote: closed } : {}),
            }
          }),
```

In `src/pages/player/ui/PieceSetup.tsx` and `src/pages/player/ui/WalkSetup.tsx`, add `keyed` to the
`<PlayerSetup …>` props, after `melody={…}` (both are in a key).

- [ ] **Step 5: Run the tests to see them pass**

Run:
`npx vitest run src/shared/lib/arrangement src/entities/pattern src/widgets/player-setup src/pages/player`
Expected: PASS.

- [ ] **Step 6: Typecheck, lint, format, commit**

```bash
npm run typecheck && npm run lint
npx prettier --write src/shared/lib/arrangement/figure.ts src/shared/lib/arrangement/figure.test.ts src/shared/lib/arrangement/index.ts src/entities/pattern/model/selectors.ts src/entities/pattern/model/selectors.test.ts src/entities/pattern/index.ts src/widgets/player-setup/ui/PlayerSetup.tsx src/widgets/player-setup/ui/FigurePage.tsx src/widgets/player-setup/ui/PlayerSetup.test.tsx src/pages/player/ui/PieceSetup.tsx src/pages/player/ui/WalkSetup.tsx src/shared/i18n/locales/en/player.ts src/shared/i18n/locales/ru/player.ts
git add src
git commit -m "$(printf 'Close the figures that play the key'"'"'s triads to a source without a key, as a tune'"'"'s are closed without one\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>')"
```

---

### Task 5: The chromatic walk's chart

**Files:**

- Create: `src/features/practice/chromatic.ts`
- Modify: `src/features/practice/index.ts`
- Test: `src/features/practice/chromatic.test.ts`, `src/features/practice/notate-pieces.test.ts`

**Interfaces:**

- Produces (all from `@/features/practice`):
  - `CHROMATIC_DIRECTIONS = ['up', 'down', 'both'] as const`, `type ChromaticDirection`
  - `CHROMATIC = { chords: ['maj'], direction: 'up', tempo: 72, pattern: 'block' } as const`
  - `type ChromaticChords = readonly [ChordQuality, ...ChordQuality[]]`
  - `interface ChromaticChoice { root: SpelledNote; chords: ChromaticChords; direction: ChromaticDirection;
    pattern: PatternId; rh: RightFigureId | null; lh: LeftFigureId | null }`
  - `chromaticRoot(pc: PitchClass, quality: ChordQuality): SpelledNote`
  - `readChords(value: unknown): ChromaticChords`, `chordsParam(chords: readonly ChordQuality[]): string`
  - `chromaticChart(root: SpelledNote, chords: readonly ChordQuality[], direction: ChromaticDirection): Chart`
  - `arrangeChromatic(choice: ChromaticChoice): Performance`

- [ ] **Step 1: Write the failing tests**

Create `src/features/practice/chromatic.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import type { Chart } from '@/shared/lib/arrangement'
import { CHORD_QUALITIES, chordSymbol, note, PITCH_CLASSES, rootSpelling } from '@/shared/lib/music'
import {
  arrangeChromatic,
  chordsParam,
  CHROMATIC,
  CHROMATIC_DIRECTIONS,
  chromaticChart,
  readChords,
} from './chromatic'

const symbols = (chart: Chart) =>
  chart.sections.flatMap((section) =>
    section.lines.flatMap((line) => line.flatMap((bar) => bar.chords.map(chordSymbol))),
  )

const [firstQuality, ...otherQualities] = CHORD_QUALITIES
if (!firstQuality) throw new Error('the table is empty')
/** Every quality of the table, as a walk's chords. */
const EVERY_CHORD = [firstQuality, ...otherQualities] as const

describe('chromaticChart', () => {
  it('walks a chord up by semitones to its root’s octave, a bar each, four bars a line, in C', () => {
    const chart = chromaticChart(note('G'), ['m9'], 'up')
    expect(symbols(chart)).toEqual([
      'Gm9',
      'G#m9',
      'Am9',
      'B♭m9',
      'Bm9',
      'Cm9',
      'C#m9',
      'Dm9',
      'E♭m9',
      'Em9',
      'Fm9',
      'F#m9',
      'Gm9',
    ])
    expect(chart.sections[0]?.lines.map((line) => line.length)).toEqual([4, 4, 4, 1])
    expect(chart.key).toEqual({ tonic: note('C'), minor: false })
    expect(chart.meter).toBe('4/4')
  })

  it('plays every chosen chord on a root before the next, in the table’s order, each spelled its way', () => {
    expect(symbols(chromaticChart(note('G'), ['n9', 'm9', 'maj9'], 'up')).slice(0, 6)).toEqual([
      'Gm9',
      'GMaj9',
      'G9',
      'G#m9',
      'A♭Maj9',
      'A♭9',
    ])
  })

  it('goes down to the octave below, or up and back with the octave once', () => {
    expect(symbols(chromaticChart(note('C'), ['maj'], 'down'))).toEqual([
      'C',
      'B',
      'B♭',
      'A',
      'A♭',
      'G',
      'F#',
      'F',
      'E',
      'E♭',
      'D',
      'D♭',
      'C',
    ])
    const both = symbols(chromaticChart(note('C'), ['maj'], 'both'))
    expect(both).toHaveLength(25)
    expect(both.slice(11, 14)).toEqual(['B', 'C', 'B'])
    expect(both.at(-1)).toBe('C')
  })
})

describe('the chords param', () => {
  it('reads known chords once each in the table’s order; none is the walk’s own', () => {
    expect(readChords('n9.m9.xx.m9')).toEqual(['m9', 'n9'])
    expect(readChords('xx')).toEqual(CHROMATIC.chords)
    expect(readChords('')).toEqual(CHROMATIC.chords)
    expect(readChords(undefined)).toEqual(CHROMATIC.chords)
    expect(chordsParam(['n9', 'm9'])).toBe('m9.n9')
  })
})

describe('arrangeChromatic', () => {
  it.each(CHROMATIC_DIRECTIONS)(
    'arranges every chord from every root going %s, every note on the piano',
    (direction) => {
      for (const pc of PITCH_CLASSES) {
        const performance = arrangeChromatic({
          root: rootSpelling(pc, false),
          chords: EVERY_CHORD,
          direction,
          pattern: CHROMATIC.pattern,
          rh: null,
          lh: null,
        })
        expect(performance.bars).toHaveLength(
          (direction === 'both' ? 25 : 13) * CHORD_QUALITIES.length,
        )
        expect(performance.notes.filter((n) => n.midi < 21 || n.midi > 108)).toEqual([])
      }
    },
  )
})
```

In `src/features/practice/notate-pieces.test.ts`, add the imports
`import { CHORD_QUALITIES } from '@/shared/lib/music'` (merge into the existing `@/shared/lib/music` import) and
`import { arrangeChromatic, CHROMATIC } from './chromatic'`, then append inside `describe('notation of the content', …)`:

```ts
  it('writes a chromatic walk of every chord, up and back', () => {
    const [first, ...rest] = CHORD_QUALITIES
    if (!first) throw new Error('the table is empty')
    expectWritten(
      notate(
        arrangeChromatic({
          root: note('C'),
          chords: [first, ...rest],
          direction: 'both',
          pattern: CHROMATIC.pattern,
          rh: null,
          lh: null,
        }),
      ),
    )
  })
```

- [ ] **Step 2: Run them to see them fail**

Run: `npx vitest run src/features/practice/chromatic.test.ts src/features/practice/notate-pieces.test.ts`
Expected: FAIL (`./chromatic` does not exist).

- [ ] **Step 3: Write the chart**

Create `src/features/practice/chromatic.ts`:

```ts
import {
  LEFT_FIGURES,
  PATTERNS,
  RIGHT_FIGURES,
  type LeftFigureId,
  type PatternId,
  type RightFigureId,
} from '@/entities/pattern'
import { isOneOf } from '@/shared/lib'
import { arrange, type Chart, type ChartBar, type Performance } from '@/shared/lib/arrangement'
import {
  CHORD_QUALITIES,
  chordRootSpelling,
  note,
  pitchClass,
  pitchClassOf,
  qualityIntervals,
  type ChordQuality,
  type PitchClass,
  type SpelledNote,
} from '@/shared/lib/music'

export const CHROMATIC_DIRECTIONS = ['up', 'down', 'both'] as const
export type ChromaticDirection = (typeof CHROMATIC_DIRECTIONS)[number]

/** At least one chord quality: a chromatic walk always walks a chord. */
export type ChromaticChords = readonly [ChordQuality, ...ChordQuality[]]

/** The walk's own chords, direction, tempo and pattern: what the Player plays when its URL chooses none. */
export const CHROMATIC = {
  chords: ['maj'],
  direction: 'up',
  tempo: 72,
  pattern: 'block',
} as const satisfies {
  readonly chords: ChromaticChords
  readonly direction: ChromaticDirection
  readonly tempo: number
  readonly pattern: PatternId
}

/** What the learner walks: the Player's URL, read. */
export interface ChromaticChoice {
  readonly root: SpelledNote
  readonly chords: ChromaticChords
  readonly direction: ChromaticDirection
  readonly pattern: PatternId
  readonly rh: RightFigureId | null
  readonly lh: LeftFigureId | null
}

/** Semitones from the root: up to its octave, down to the octave below, or up and back, the octave once. */
const STEPS: Readonly<Record<ChromaticDirection, readonly number[]>> = {
  up: Array.from({ length: 13 }, (_, i) => i),
  down: Array.from({ length: 13 }, (_, i) => -i),
  both: Array.from({ length: 25 }, (_, i) => 12 - Math.abs(12 - i)),
}
const BARS_PER_LINE = 4
const C_MAJOR = { tonic: note('C'), minor: false }

const isQuality = isOneOf(CHORD_QUALITIES)

/** The chosen qualities in the table's order, each once. */
const inTableOrder = (chords: readonly ChordQuality[]): ChordQuality[] =>
  CHORD_QUALITIES.filter((quality) => chords.includes(quality))

/** A chord's root on this pitch class, spelled by the one rule over its intervals: G♯m9, A♭Maj9. */
export const chromaticRoot = (pc: PitchClass, quality: ChordQuality): SpelledNote =>
  chordRootSpelling(pc, qualityIntervals(quality))

/** The URL's chords (`m9.maj9.n9`) read: known qualities, each once, in the table's order; none is the walk's own. */
export function readChords(value: unknown): ChromaticChords {
  const [first, ...rest] =
    typeof value === 'string' ? inTableOrder(value.split('.').filter(isQuality)) : []
  return first ? [first, ...rest] : CHROMATIC.chords
}

/** Chords as the URL writes them: the table's order, joined by `.`. */
export const chordsParam = (chords: readonly ChordQuality[]): string =>
  inTableOrder(chords).join('.')

/**
 * The chosen qualities root by root, a semitone at a time from `root`, a bar of 4/4 each, four bars
 * a line; in C, so the sheet music writes each chord's accidentals.
 */
export function chromaticChart(
  root: SpelledNote,
  chords: readonly ChordQuality[],
  direction: ChromaticDirection,
): Chart {
  const from = pitchClassOf(root)
  const qualities = inTableOrder(chords)
  const bars: ChartBar[] = STEPS[direction].flatMap((step) =>
    qualities.map((quality) => ({
      chords: [{ root: chromaticRoot(pitchClass(from + step), quality), quality, beats: 4 }],
      beats: 4,
    })),
  )
  const lines = Array.from({ length: Math.ceil(bars.length / BARS_PER_LINE) }, (_, i) =>
    bars.slice(i * BARS_PER_LINE, (i + 1) * BARS_PER_LINE),
  )
  return { key: C_MAJOR, meter: '4/4', sections: [{ lines }] }
}

/** The chromatic walk as the Player plays it: the learner's pattern and hands' figures. */
export function arrangeChromatic(choice: ChromaticChoice): Performance {
  const chart = chromaticChart(choice.root, choice.chords, choice.direction)
  return arrange(chart, {
    tonic: chart.key.tonic,
    pattern: PATTERNS[choice.pattern].pattern,
    ...(choice.rh ? { rh: RIGHT_FIGURES[choice.rh].figure } : {}),
    ...(choice.lh ? { lh: LEFT_FIGURES[choice.lh].figure } : {}),
  })
}
```

In `src/features/practice/index.ts`, after the walk's export line:

```ts
export {
  arrangeChromatic,
  chordsParam,
  CHROMATIC,
  CHROMATIC_DIRECTIONS,
  chromaticChart,
  chromaticRoot,
  readChords,
  type ChromaticChoice,
  type ChromaticChords,
  type ChromaticDirection,
} from './chromatic'
```

- [ ] **Step 4: Run the tests to see them pass**

Run: `npx vitest run src/features/practice`
Expected: PASS. If a spelling in the first three tests differs, the kernel's `rootSpelling` is the authority
(C♯ and G♯ only under a minor 3rd or minor 9th; E♭, F♯ and B♭ always): fix the expectation only after checking
`src/shared/lib/music/note.ts:120`, never the kernel.

- [ ] **Step 5: Typecheck, lint, format, commit**

```bash
npm run typecheck && npm run lint
npx prettier --write src/features/practice/chromatic.ts src/features/practice/chromatic.test.ts src/features/practice/notate-pieces.test.ts src/features/practice/index.ts
git add src/features/practice
git commit -m "$(printf 'Walk any chord qualities root by root a semitone at a time, up, down or both, as a chart the Player can arrange\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>')"
```

---

### Task 6: The chromatic walk in the Player

**Files:**

- Create: `src/pages/player/model/chromatic-search.ts`, `src/pages/player/model/use-chromatic-player.ts`
- Create: `src/pages/player/ui/ChromaticSetup.tsx`, `src/pages/player/ui/ChromaticPlayerPage.tsx`
- Modify: `src/pages/player/index.ts`, `src/app/routes/player-screens.ts`, `src/app/routes/search.ts`,
  `src/app/router.tsx`
- Modify: `src/shared/i18n/locales/en/player.ts`, `src/shared/i18n/locales/ru/player.ts`
- Test: `src/pages/player/model/chromatic-search.test.ts`, `src/pages/player/ui/ChromaticPlayerPage.test.tsx`,
  `src/app/routes/search.test.ts`, `src/app/router.test.tsx`

**Interfaces:**

- Consumes: Task 5's `CHROMATIC`, `CHROMATIC_DIRECTIONS`, `readChords`, `chordsParam`, `chromaticRoot`,
  `arrangeChromatic`, `ChromaticChoice`, `ChromaticDirection`; Task 4's `needsKey`, `playsKeyTriads`, `keyed`;
  Task 3's `MultiDropdown` groups.
- Produces: the route `/play/chromatic` (id `/full-screen/play/chromatic`) with
  `ChromaticSearch = PracticeView & { chords: string; root: NoteParam; direction: ChromaticDirection } &
  Omit<SetupParams, 'key' | 'chordSize'>`; `CHROMATIC_DEFAULTS`, `validateChromaticSearch`; Task 7 links to it
  with `search={{ chords, root }}`.

- [ ] **Step 1: Write the failing tests**

Create `src/pages/player/model/chromatic-search.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { CHROMATIC } from '@/features/practice'
import { note, noteParam } from '@/shared/lib/music'
import { chromaticChoice, chromaticPatch } from './chromatic-search'

const search = { chords: 'm9.n9', root: noteParam(note('G')), direction: 'both' } as const

describe('chromaticChoice', () => {
  it('reads the chords, and takes the walk’s own pattern where the URL chooses none', () => {
    expect(chromaticChoice(search)).toEqual({
      root: note('G'),
      chords: ['m9', 'n9'],
      direction: 'both',
      pattern: CHROMATIC.pattern,
      rh: null,
      lh: null,
    })
  })

  it('reads From the chart, and anything that needs a key, as the walk’s own', () => {
    expect(chromaticChoice({ ...search, pattern: 'chart' }).pattern).toBe(CHROMATIC.pattern)
    expect(chromaticChoice({ ...search, pattern: 'flow', rh: 'flow' })).toMatchObject({
      pattern: CHROMATIC.pattern,
      rh: null,
    })
    expect(chromaticChoice({ ...search, pattern: 'ballad', rh: 't1' })).toMatchObject({
      pattern: 'ballad',
      rh: 't1',
    })
  })
})

describe('chromaticPatch', () => {
  it('writes the walk’s own pattern as absent', () => {
    expect(chromaticPatch({ pattern: CHROMATIC.pattern })).toEqual({ pattern: undefined })
    expect(chromaticPatch({ rh: 't1' })).toEqual({ rh: 't1' })
  })
})
```

Create `src/pages/player/ui/ChromaticPlayerPage.test.tsx`:

```tsx
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { PATTERNS } from '@/entities/pattern'

describe('The chromatic walk in the Player', () => {
  it('walks the chosen chords root by root as sheet music, titled by them', async () => {
    await renderApp('/play/chromatic?chords=m9.maj9&root=G')
    expect(
      await screen.findByRole('heading', { name: 'Chromatic walk: Gm9 · GMaj9' }),
    ).toBeInTheDocument()
    expect(await screen.findByRole('button', { name: 'Bar 1: Gm9' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Bar 3: G#m9' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Bar 4: A♭Maj9' })).toBeInTheDocument()
  })

  it('plays and stops', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/play/chromatic')
    await user.click(await screen.findByRole('button', { name: 'Play' }))
    expect(audio.played).toHaveLength(1)
    await user.click(screen.getByRole('button', { name: 'Stop' }))
    expect(audio.stops).toBeGreaterThan(0)
  })

  it('ignores a loop past the end of a shorter walk, and still plays', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/play/chromatic?loop=20-24')
    expect(await screen.findByRole('button', { name: 'Bar 13: C' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Play' }))
    expect(audio.played).toHaveLength(1)
  })

  it('checks chord types in the Setup sheet, never unchecking the last', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/play/chromatic?chords=m9&root=G')
    await user.click(await screen.findByRole('button', { name: 'Setup' }))
    await user.click(await screen.findByRole('combobox', { name: 'Chord types' }))
    await user.click(await screen.findByRole('option', { name: 'Dominant 9th' }))
    expect(router.state.location.search).toMatchObject({ chords: 'm9.n9' })
    await user.click(screen.getByRole('option', { name: 'Minor 9th' }))
    expect(router.state.location.search).toMatchObject({ chords: 'n9' })
    await user.click(screen.getByRole('option', { name: 'Dominant 9th' }))
    expect(router.state.location.search).toMatchObject({ chords: 'n9' })
    expect(screen.getByRole('option', { name: 'Dominant 9th' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
  })

  it('changes the direction and the root in the Setup sheet', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/play/chromatic?chords=maj9&root=G')
    await user.click(await screen.findByRole('button', { name: 'Setup' }))
    await user.click(await screen.findByRole('button', { name: 'Up and down' }))
    expect(router.state.location.search).toMatchObject({ direction: 'both' })
    await user.click(screen.getByRole('combobox', { name: 'Root' }))
    await user.click(await screen.findByRole('option', { name: 'A♭' }))
    expect(router.state.location.search).toMatchObject({ root: 'Ab' })
  })

  it('closes the Chord flow: a chromatic walk has no key', async () => {
    const user = userEvent.setup()
    await renderApp('/play/chromatic')
    await user.click(await screen.findByRole('button', { name: 'Setup' }))
    await user.click(await screen.findByRole('button', { name: /^Pattern/ }))
    expect(
      screen.getByRole('button', { name: (name) => name.includes(PATTERNS.flow.name.en) }),
    ).toBeDisabled()
  })

  it('closes to Practice when opened directly', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/play/chromatic')
    await user.click(await screen.findByRole('button', { name: 'Close' }))
    expect(router.state.location.pathname).toBe('/practice')
  })
})
```

In `src/app/routes/search.test.ts`, add `CHROMATIC_DEFAULTS` to the `./search` import; in
`'fill every default for an empty URL'` add
`expect(await searchAt('/play/chromatic')).toEqual(CHROMATIC_DEFAULTS)`; and append inside `describe('search params', …)`:

```ts
  it('read the chromatic walk’s chords in the table’s order, its root as its first chord spells it', async () => {
    expect(
      await searchAt('/play/chromatic?chords=n9.m9.xx&root=Ab&direction=both&pattern=pop8'),
    ).toMatchObject({ chords: 'm9.n9', root: 'G#', direction: 'both', pattern: 'pop8' })
    expect(await searchAt('/play/chromatic?chords=xx&root=H&direction=sideways')).toEqual(
      CHROMATIC_DEFAULTS,
    )
    expect(await searchAt('/play/chromatic?chords=&chordSize=ninths&key=D')).toEqual(
      CHROMATIC_DEFAULTS,
    )
  })
```

In `src/app/router.test.tsx`, add `['/play/chromatic', '/play/chromatic'],` to `ROUTES` after the walk's row.

- [ ] **Step 2: Run them to see them fail**

Run:
`npx vitest run src/pages/player src/app/routes/search.test.ts src/app/router.test.tsx`
Expected: FAIL (no route, no modules).

- [ ] **Step 3: The walk's URL, read and written**

Create `src/pages/player/model/chromatic-search.ts`:

```ts
import { LEFT_FIGURES, needsKey, RIGHT_FIGURES } from '@/entities/pattern'
import {
  CHROMATIC,
  readChords,
  type ChromaticChoice,
  type ChromaticDirection,
} from '@/features/practice'
import { playsKeyTriads } from '@/shared/lib/arrangement'
import { noteFromParam, type NoteParam } from '@/shared/lib/music'
import type { FigureChange, SetupParams } from '@/widgets/player-setup'
import type { PracticeView } from '@/widgets/practice-player'

/** The chromatic walk's URL: its chords, root and direction, how the Player goes, and its own choices (absent is its own). */
export type ChromaticSearch = PracticeView & {
  /** Chord qualities joined by `.`, in the table's order: `m9.maj9.n9`. */
  readonly chords: string
  readonly root: NoteParam
  readonly direction: ChromaticDirection
} & Omit<SetupParams, 'key' | 'chordSize'>

/**
 * The walk's URL read: what it leaves out is the walk's own, and so is From the chart (the walk
 * names no methods) and anything that plays the key's triads (the walk has no key).
 */
export function chromaticChoice(
  search: Pick<ChromaticSearch, 'chords' | 'root' | 'direction' | 'pattern' | 'rh' | 'lh'>,
): ChromaticChoice {
  const { pattern, rh, lh } = search
  return {
    root: noteFromParam(search.root),
    chords: readChords(search.chords),
    direction: search.direction,
    pattern:
      pattern === undefined || pattern === 'chart' || needsKey(pattern)
        ? CHROMATIC.pattern
        : pattern,
    rh: rh && !playsKeyTriads(RIGHT_FIGURES[rh].figure) ? rh : null,
    lh: lh && !playsKeyTriads(LEFT_FIGURES[lh].figure) ? lh : null,
  }
}

/** A Setup change as the walk's URL writes it: its own pattern left out. */
export function chromaticPatch(change: FigureChange): Partial<ChromaticSearch> {
  return {
    ...change,
    ...('pattern' in change
      ? { pattern: change.pattern === CHROMATIC.pattern ? undefined : change.pattern }
      : {}),
  }
}
```

Create `src/pages/player/model/use-chromatic-player.ts`:

```ts
import { useMemo } from 'react'
import { arrangeChromatic, CHROMATIC, type ChromaticChoice } from '@/features/practice'
import type { Performance } from '@/shared/lib/arrangement'
import type { FigureChange } from '@/widgets/player-setup'
import { usePracticePlayer, type PracticePlayer } from '@/widgets/practice-player'
import { chromaticChoice, chromaticPatch, type ChromaticSearch } from './chromatic-search'

export interface ChromaticPlayer {
  readonly choice: ChromaticChoice
  readonly performance: Performance
  readonly player: PracticePlayer
  changeSetup(change: FigureChange): void
}

/** The chromatic walk as the Player plays it: the URL's chords arranged, practised from the widget's hook. */
export function useChromaticPlayer(
  search: ChromaticSearch,
  setSearch: (patch: Partial<ChromaticSearch>) => void,
): ChromaticPlayer {
  const { chords, root, direction, pattern, rh, lh } = search
  const choice = useMemo(
    () => chromaticChoice({ chords, root, direction, pattern, rh, lh }),
    [chords, root, direction, pattern, rh, lh],
  )
  const performance = useMemo(() => arrangeChromatic(choice), [choice])
  const player = usePracticePlayer(performance, search, setSearch, CHROMATIC.tempo)
  return {
    choice,
    performance,
    player,
    changeSetup: (change) => setSearch(chromaticPatch(change)),
  }
}
```

- [ ] **Step 4: The Setup and the page**

Add to `src/shared/i18n/locales/en/player.ts`, after `walk`:

```ts
  chromatic: { title: 'Chromatic walk: {{chords}}' },
  chordTypes: 'Chord types',
  direction: 'Direction',
  directions: { up: 'Up', down: 'Down', both: 'Up and down' },
```

and to `src/shared/i18n/locales/ru/player.ts`, after `walk`:

```ts
  chromatic: { title: 'По полутонам: {{chords}}' },
  chordTypes: 'Виды аккордов',
  direction: 'Направление',
  directions: { up: 'Вверх', down: 'Вниз', both: 'Вверх и вниз' },
```

Create `src/pages/player/ui/ChromaticSetup.tsx`:

```tsx
import { useTranslation } from 'react-i18next'
import {
  CHROMATIC_DIRECTIONS,
  chromaticRoot,
  type ChromaticChoice,
  type ChromaticChords,
  type ChromaticDirection,
} from '@/features/practice'
import {
  CHORD_FAMILIES,
  noteName,
  noteParam,
  PITCH_CLASSES,
  qualitiesIn,
  qualitySuffix,
  type NoteParam,
} from '@/shared/lib/music'
import { Dropdown, MultiDropdown, Segmented } from '@/shared/ui'
import { FigureRows, PlayerSetup, type FigureChange } from '@/widgets/player-setup'
import { PlayingFields } from '@/widgets/practice-player'

/** The chromatic walk's Setup: its chord types, root and direction, the pattern and figures, and how it plays. */
export function ChromaticSetup({
  open,
  onOpenChange,
  choice,
  swing,
  onChords,
  onRoot,
  onDirection,
  onChange,
  onSwing,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  choice: ChromaticChoice
  swing: boolean
  onChords: (chords: ChromaticChords) => void
  onRoot: (root: NoteParam) => void
  onDirection: (direction: ChromaticDirection) => void
  onChange: (change: FigureChange) => void
  onSwing: (on: boolean) => void
}) {
  const { t } = useTranslation(['player', 'music'])
  const [first] = choice.chords
  return (
    <PlayerSetup
      open={open}
      onOpenChange={onOpenChange}
      figures={choice}
      methods={false}
      melody={false}
      keyed={false}
      onFigures={onChange}
    >
      <MultiDropdown
        label={t('player:chordTypes')}
        value={choice.chords}
        groups={CHORD_FAMILIES.map((family) => ({
          label: t(`music:family.${family}`),
          options: qualitiesIn(family).map((quality) => ({
            value: quality,
            label: qualitySuffix(quality) || t('music:major'),
            title: t(`music:quality.${quality}`),
            detail: t(`music:quality.${quality}`),
          })),
        }))}
        onChange={([checked, ...others]) => {
          // Unchecking the last one leaves it checked: the walk always has a chord.
          if (checked) onChords([checked, ...others])
        }}
      />
      <Dropdown
        label={t('player:root')}
        value={noteParam(choice.root)}
        options={PITCH_CLASSES.map((pc) => {
          const root = chromaticRoot(pc, first)
          return { value: noteParam(root), label: noteName(root) }
        })}
        onChange={onRoot}
      />
      <Segmented
        label={t('player:direction')}
        value={choice.direction}
        options={CHROMATIC_DIRECTIONS.map((direction) => ({
          value: direction,
          label: t(`player:directions.${direction}`),
        }))}
        onChange={onDirection}
      />
      <FigureRows />
      <PlayingFields swing={swing} onSwing={onSwing} />
    </PlayerSetup>
  )
}
```

Create `src/pages/player/ui/ChromaticPlayerPage.tsx`:

```tsx
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { chordsParam, chromaticRoot } from '@/features/practice'
import { useGoBack } from '@/shared/lib'
import { chordSymbol, pitchClassOf } from '@/shared/lib/music'
import type { ChromaticSearch } from '../model/chromatic-search'
import { useChromaticPlayer } from '../model/use-chromatic-player'
import { ChromaticSetup } from './ChromaticSetup'
import { PlayerLayout } from './PlayerLayout'

/** A chromatic walk has one section and names none. */
const NO_HEADINGS: readonly string[] = []

/** The chromatic walk in the Player: the chosen chord types root by root, a semitone at a time, with a song's patterns. */
export function ChromaticPlayerPage() {
  const { t } = useTranslation('player')
  const search = useSearch({ from: '/full-screen/play/chromatic' })
  const navigate = useNavigate({ from: '/play/chromatic' })
  const [setupOpen, setSetupOpen] = useState(false)
  const close = useGoBack({ to: '/practice' })
  const setSearch = (patch: Partial<ChromaticSearch>) =>
    void navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true })
  const { choice, performance, player, changeSetup } = useChromaticPlayer(search, setSearch)
  const from = pitchClassOf(choice.root)
  const chords = choice.chords
    .map((quality) => chordSymbol({ root: chromaticRoot(from, quality), quality }))
    .join(' · ')
  return (
    <>
      <PlayerLayout
        title={t('chromatic.title', { chords })}
        onClose={close}
        view={search}
        player={player}
        performance={performance}
        headings={NO_HEADINGS}
        onSetup={() => setSetupOpen(true)}
      />
      <ChromaticSetup
        open={setupOpen}
        onOpenChange={setSetupOpen}
        choice={choice}
        swing={search.swing}
        onChords={(next) => setSearch({ chords: chordsParam(next) })}
        onRoot={(root) => setSearch({ root })}
        onDirection={(direction) => setSearch({ direction })}
        onChange={changeSetup}
        onSwing={player.setSwing}
      />
    </>
  )
}
```

In `src/pages/player/index.ts`, add:

```ts
export type { ChromaticSearch } from './model/chromatic-search'
export { ChromaticPlayerPage } from './ui/ChromaticPlayerPage'
```

- [ ] **Step 5: The route**

In `src/app/routes/player-screens.ts`:
`export { ChromaticPlayerPage, PlayerPage, WalkPlayerPage } from '@/pages/player'`.

In `src/app/routes/search.ts`:

- change the practice import to
  `import { CHROMATIC, CHROMATIC_DIRECTIONS, chordsParam, chromaticRoot, isLoopParam, PRACTICE_MODES, readChords } from '@/features/practice'`;
- change the player import to `import type { ChromaticSearch, PlayerSearch, WalkSearch } from '@/pages/player'`;
- append after `validateWalkSearch`:

```ts
// Player → Chromatic walk: the chords, root and direction, then the Player's own params.
export const CHROMATIC_DEFAULTS: ChromaticSearch = {
  chords: chordsParam(CHROMATIC.chords),
  root: noteParam(note('C')),
  direction: CHROMATIC.direction,
  ...PLAYER_DEFAULTS,
}
const isDirection = isOneOf(CHROMATIC_DIRECTIONS)
export function validateChromaticSearch(input: Input<ChromaticSearch>): ChromaticSearch {
  const raw: Raw = input
  const chords = readChords(raw.chords)
  const root = readNote(raw.root)
  return {
    chords: chordsParam(chords),
    root: noteParam(root ? chromaticRoot(pitchClassOf(root), chords[0]) : note('C')),
    direction: valueOr(isDirection, raw.direction, CHROMATIC_DEFAULTS.direction),
    ...practiceView(raw),
    pattern: isPlayerPattern(raw.pattern) ? raw.pattern : undefined,
    rh: isRightFigureId(raw.rh) ? raw.rh : undefined,
    lh: isLeftFigureId(raw.lh) ? raw.lh : undefined,
  }
}
```

In `src/app/router.tsx`, add `CHROMATIC_DEFAULTS` and `validateChromaticSearch` to the `./routes/search` import,
and after `walkRoute`:

```ts
const chromaticRoute = createRoute({
  getParentRoute: () => fullScreenRoute,
  path: '/play/chromatic',
  validateSearch: validateChromaticSearch,
  search: { middlewares: [stripSearchParams(CHROMATIC_DEFAULTS)] },
  component: lazyRouteComponent(playerScreens, 'ChromaticPlayerPage'),
})
```

and `fullScreenRoute.addChildren([playerRoute, walkRoute, chromaticRoute, checkRoute])`.

- [ ] **Step 6: Run the tests to see them pass**

Run: `npx vitest run src/pages/player src/app`
Expected: PASS. (`architecture.test.ts` proves the new imports keep the layers.)

- [ ] **Step 7: Typecheck, lint, build, format, commit**

```bash
npm run typecheck && npm run lint && npm run build
npx prettier --write src/pages/player src/app/routes/search.ts src/app/routes/search.test.ts src/app/routes/player-screens.ts src/app/router.tsx src/app/router.test.tsx src/shared/i18n/locales/en/player.ts src/shared/i18n/locales/ru/player.ts
git add src
git commit -m "$(printf 'Walk chosen chord types chromatically in the Player: chord types, root and direction in its Setup\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>')"
```

---

### Task 7: Ways in — the Chords reference and Practice's exercises

**Files:**

- Create: `src/features/practice/ui/ChromaticWalkLink.tsx`
- Modify: `src/features/practice/index.ts`
- Modify: `src/widgets/chord-explorer/ui/ChordExplorer.tsx`
- Modify: `src/pages/practice/ui/PracticePage.tsx`
- Modify: `src/shared/i18n/locales/en/practice.ts`, `src/shared/i18n/locales/ru/practice.ts`
- Test: `src/pages/chords/ui/ChordsPage.test.tsx`, `src/pages/practice/ui/PracticePage.test.tsx`

**Interfaces:**

- Consumes: Task 6's route `/play/chromatic` and its search `{ chords?, root? }`; Task 5's `chordsParam`.
- Produces: `ChromaticWalkLink({ root: SpelledNote, quality: ChordQuality })`.

- [ ] **Step 1: Write the failing tests**

Append inside `describe('Learn → Chords', …)` in `src/pages/chords/ui/ChordsPage.test.tsx`:

```tsx
  it('walks a chord the table names chromatically in the Player, from its root', async () => {
    await renderApp('/learn/chords?root=G&triad=min&size=9')
    expect(await screen.findByRole('heading', { level: 2, name: 'Gm9' })).toBeInTheDocument()
    const href = screen.getByRole('link', { name: 'Chromatic walk' }).getAttribute('href') ?? ''
    const [path, query] = href.split('?')
    expect(path).toBe('/play/chromatic')
    expect(new URLSearchParams(query).get('chords')).toBe('m9')
    expect(new URLSearchParams(query).get('root')).toBe('G')
  })

  it('offers no chromatic walk for a chord the table does not name', async () => {
    await renderApp('/learn/chords?triad=sus4&size=13')
    expect(await screen.findByRole('heading', { level: 2, name: 'C13sus4' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Chromatic walk' })).not.toBeInTheDocument()
  })
```

Append inside `describe('Practice', …)` in `src/pages/practice/ui/PracticePage.test.tsx`:

```tsx
  it('offers the chromatic walk among the exercises, opening in the Player', async () => {
    await renderApp('/practice')
    const exercises = await screen.findByRole('region', { name: 'Exercises' })
    expect(within(exercises).getByRole('link', { name: 'Chromatic walk' })).toHaveAttribute(
      'href',
      '/play/chromatic',
    )
  })
```

- [ ] **Step 2: Run them to see them fail**

Run: `npx vitest run src/pages/chords src/pages/practice`
Expected: FAIL (no such link, no Exercises region).

- [ ] **Step 3: The link, and the two places it goes**

Add to `src/shared/i18n/locales/en/practice.ts`: `chromatic: 'Chromatic walk',` after `walk`, and
`exercises: 'Exercises',` after `quiz`. Add to `src/shared/i18n/locales/ru/practice.ts`: `chromatic: 'По полутонам',`
after `walk`, and `exercises: 'Упражнения',` after `quiz`.

Create `src/features/practice/ui/ChromaticWalkLink.tsx`:

```tsx
import { Link } from '@tanstack/react-router'
import { Footprints } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { noteParam, type ChordQuality, type SpelledNote } from '@/shared/lib/music'
import { RowGroup, RowLink } from '@/shared/ui'
import { chordsParam } from '../chromatic'

/** A chord the table names, walked in the Player a semitone at a time from its root. */
export function ChromaticWalkLink({ root, quality }: { root: SpelledNote; quality: ChordQuality }) {
  const { t } = useTranslation('practice')
  return (
    <RowGroup title={t('inPlayer')}>
      <li>
        <RowLink
          title={t('chromatic')}
          icon={Footprints}
          paint="lilac"
          render={
            <Link
              to="/play/chromatic"
              search={{ chords: chordsParam([quality]), root: noteParam(root) }}
            />
          }
        />
      </li>
    </RowGroup>
  )
}
```

In `src/features/practice/index.ts`, after `PractiseChords`:
`export { ChromaticWalkLink } from './ui/ChromaticWalkLink'`.

In `src/widgets/chord-explorer/ui/ChordExplorer.tsx`, add `import { ChromaticWalkLink } from '@/features/practice'`
and, after the closing `</p>` of the "Written" line (inside the same column `div`):

```tsx
        {built.quality ? <ChromaticWalkLink root={built.root} quality={built.quality} /> : null}
```

In `src/pages/practice/ui/PracticePage.tsx`, add `Footprints` to the `lucide-react` import, change the doc comment
to "Practice: the Theory quizzes and the exercises, then the studies and progressions, each opening its page here.",
and replace the quiz `RowGroup` (the grid's first child) with a column holding it and the new group:

```tsx
        <div className="flex flex-col gap-8">
          <RowGroup title={t('practice:quiz')}>
            {QUIZ_ROWS.map(({ quiz, icon, paint }) => (
              <li key={quiz}>
                <RowLink
                  title={t(`quiz:modes.${quiz}`)}
                  detail={
                    quiz === 'gaps' && gaps > 0 ? t('practice:gaps', { count: gaps }) : undefined
                  }
                  icon={icon}
                  paint={paint}
                  render={<Link to="/practice/quiz/$quiz" params={{ quiz }} />}
                />
              </li>
            ))}
          </RowGroup>
          <RowGroup title={t('practice:exercises')}>
            <li>
              <RowLink
                title={t('practice:chromatic')}
                icon={Footprints}
                paint="lilac"
                render={<Link to="/play/chromatic" />}
              />
            </li>
          </RowGroup>
        </div>
```

- [ ] **Step 4: Run the tests to see them pass**

Run: `npx vitest run src/pages/chords src/pages/practice src/app/architecture.test.ts`
Expected: PASS.

- [ ] **Step 5: Typecheck, lint, format, commit**

```bash
npm run typecheck && npm run lint
npx prettier --write src/features/practice/ui/ChromaticWalkLink.tsx src/features/practice/index.ts src/widgets/chord-explorer/ui/ChordExplorer.tsx src/pages/practice/ui/PracticePage.tsx src/pages/chords/ui/ChordsPage.test.tsx src/pages/practice/ui/PracticePage.test.tsx src/shared/i18n/locales/en/practice.ts src/shared/i18n/locales/ru/practice.ts
git add src
git commit -m "$(printf 'Open the chromatic walk from a chord in the Chords reference and from Practice'"'"'s new Exercises\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>')"
```

---

### Task 8: Record it — CONTENT, the glossary, ADR 0015, the roadmap, CLAUDE.md

**Files:**

- Modify: `docs/CONTENT.md` (§ Progressions), `docs/UBIQUITOUS_LANGUAGE.md`
- Create: `docs/adr/0015-progressions-in-sections-and-a-chromatic-walk.md`
- Modify: `docs/superpowers/specs/2026-09-25-next-features-roadmap-design.md`, `CLAUDE.md`

- [ ] **Step 1: CONTENT.md**

In `docs/CONTENT.md`'s `## Progressions`, after the bullet list that ends with "**Chord size:** …", add:

````markdown
**In sections.** A song-shaped progression writes `progression` as a chart's sections (`kind`, `n`, `label`, `last`,
`detail`, `lines`), each line a progression of its own: it starts on a new bar and is one line of the chart, so the
printed line breaks stay. Headings are a chart's. A mistake names its section, line and chord.

```ts
progression: [
  { kind: 'verse', lines: ['i:min:4 iv:min:2 V:=sus4:2 i:min:4', 'ii:hd:4 V:=sus4:2 V:=maj:2'] },
  { kind: 'chorus', last: true, lines: ['iv:min:2 i:=min:2/3 ii:hd:1 V:=maj:1 i:=m6:2'] },
],
```

**As printed.** Write a printed triad, suspension, 6th or slash chord as a fixed quality (`=maj`, `=sus4`, `=m6`,
`/3`) and a printed 7th chord as a function: then the chord size grows only the 7th chords, as an accompanist
extends a song («Ромашковые поля»: Dm7 → Dm9, D7 → D7♭9 into Gm, its C and A staying triads).
````

- [ ] **Step 2: The glossary**

In `docs/UBIQUITOUS_LANGUAGE.md`:

- Content table, **Progression** row, "Means": `A Piece written as degrees + functions, in one line or in a chart's
  Sections, whose chords grow with the chosen Chord size`.
- Content table, **Section** row, "Means": `A labelled part of a Chart or of a sectioned Progression: intro, verse,
  chorus, ending, practice, hymn, part`.
- Content table, **Exercise** row, "Means": `A line generated from a rule in any key, practised in Practice: the
  Chromatic walk; later a scale from any note, Barry Harris's 6th-diminished scale`.
- Practice table, after **Walk the chords**, a new row:
  `| **Chromatic walk** | Chosen chord qualities root by root, a semitone at a time, from a root up to its octave, down, or up and back (the octave once); in the Player (`/play/chromatic`) with a song's patterns; no key, so nothing plays the key's triads («По полутонам») | chromatic run, chord drill |`

- [ ] **Step 3: ADR 0015**

Create `docs/adr/0015-progressions-in-sections-and-a-chromatic-walk.md`:

```markdown
# ADR 0015 — A progression may be written in sections, and a chromatic walk is one more Player source

- **Status:** accepted · **Date:** 2026-09-29 · **Amends:** ADR 0002's progression format, ADR 0014's walk (a
  second walk beside the scale's)

## Context

On 2026-09-29 the owner sent three pages of Vasily Gorshkov's accompaniment course: the theory of 9th chords, its
practice sheet (Exercise 2: m9, Maj9 and 9 walked up by semitones; the song's 7th chords grown to 9ths, D7 → D7♭9
into Gm) and the chart of «Ромашковые поля». The app held only the song's chorus, as a progression that grew every
chord (C7 and A7 where the course writes C and A, Dm7/F for Dm/F), and walked chords only through a scale. The owner
asked for the song as the course writes it, kept on Practice, and to "walk different types or selected types of
chords chromatically, not just in the specific key or scale", root by root.

## Decision

- **A Progression may be written in a chart's Sections**, each line a progression that starts on a new bar and is a
  line of the chart; headings are a chart's. A printed triad is a fixed quality and a printed 7th chord a function,
  so the chord size grows only the 7th chords. «Ромашковые поля» is its verse, its chorus with the 1st ending and its
  last chorus with the 2nd, the repeat written out (the chart format has no repeat signs).
- **The chromatic walk** (`/play/chromatic`) is a chart built in `features/practice` (`chromaticChart`): the chosen
  table qualities root by root, up to the octave, down, or up and back, each root spelled by the kernel's one rule,
  in C. A page hook fills `PlayerLayout`; its Setup chooses the chord types (a `MultiDropdown` grouped by family),
  the root and the direction, then the pattern and figures.
- **A source without a key closes the figures that play the key's triads** (`playsKeyTriads`, `needsKey`), as a
  source without a tune closes the melody's.
- **Practice has Exercises**, the chromatic walk its first; a chord the table names opens it from the Chords
  reference.
- **Decided against:** repeat signs and endings in the chart format (a written-out repeat plays and reads the same);
  a fixed right-hand layout for the walk (the Player voice-leads, 3‑5‑7‑9 or 7‑9‑3‑5 for a 9th, as the course plays
  it); built chords the table does not name in the walk (a Chart chord is a table quality); a 9ths lesson (the owner
  kept this change to the song and the walk).

## Consequences

- More course songs are written as sectioned progressions and grow with the chord size.
- Sub-project 7's exercises join Practice's Exercises group; a generated exercise is one more hook filling
  `PlayerLayout`, and one without a key passes `keyed={false}`.
```

- [ ] **Step 4: The roadmap**

In `docs/superpowers/specs/2026-09-25-next-features-roadmap-design.md`:

- In the Status bullet, append: `Revised 2026-09-29: «Ромашковые поля» written as the course writes it and the
  chromatic walk (ADR 0015), from three pages of Vasily Gorshkov's accompaniment course.`
- §10.1, replace `«Daisy fields» among the progressions` with `«Daisy fields» (the whole song, verse and both
  endings, only its 7th chords growing) among the progressions`.
- §10.5's table, a new first row: `| Chords by semitones (built) | Any chord qualities root by root, a semitone at a
  time, up, down or up and back, in the Player (the chromatic walk, ADR 0015) |`
- §7, after "**On colour, type and the icon …**", add a paragraph: `**On 9th chords and the course's song
  (2026-09-29):** "look at this and update the informations if they are wrong and update this song with the needed
  cords … also i want to be able to walk different types or selected types of chords chromaticaly not just in the
  specific key or scale."`

- [ ] **Step 5: CLAUDE.md**

In `CLAUDE.md`'s architecture:

- **app/**: `the Player's `/play/$pieceId` and `/play/walk`` → `the Player's `/play/$pieceId`, `/play/walk` and
  `/play/chromatic``.
- **pages/<x>/ui/**: after "`WalkPlayerPage` (`useWalkPlayer`, `walk-search.ts`, `WalkSetup`)" add "and
  `ChromaticPlayerPage` (`useChromaticPlayer`, `chromatic-search.ts`, `ChromaticSetup`)".
- **features/<x>/** `practice`: after "`PractiseChords` (…)" add "; the chromatic walk (`CHROMATIC`,
  `chromaticChart`, `arrangeChromatic`, `readChords`, `ChromaticWalkLink`)".
- **entities/<x>/** `piece`: after "chart and progression parsers" add "(a progression in one line or in sections)".
- **shared/** `ui`: "`MultiDropdown` (the pop-up that checks several)" → "`MultiDropdown` (the pop-up that checks
  several, grouped like `Dropdown`)"; `lib/arrangement`: "`arrange`, a chart → a Performance" gains ", `playsKeyTriads`".

- [ ] **Step 6: Verify the whole change**

Run: `npm run typecheck && npm run lint && npm run test && npm run build`
Expected: every step passes; the coverage gate (90% lines on `src/shared/lib/**` and `src/entities/*/model/**`)
holds (`npm run test:cov` if the run reports coverage).

- [ ] **Step 7: Format and commit**

```bash
npx prettier --write docs/CONTENT.md docs/UBIQUITOUS_LANGUAGE.md docs/adr/0015-progressions-in-sections-and-a-chromatic-walk.md docs/superpowers/specs/2026-09-25-next-features-roadmap-design.md CLAUDE.md
git add docs CLAUDE.md
git commit -m "$(printf 'Record progressions in sections and the chromatic walk: CONTENT, the glossary, ADR 0015, the roadmap and CLAUDE.md\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>')"
```
