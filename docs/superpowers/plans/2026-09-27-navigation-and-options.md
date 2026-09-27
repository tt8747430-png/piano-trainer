# Navigation and options Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or
> superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build sub-project 2: the four places Path · Songs · Learn · Practice, Learn's first lesson and references,
Practice's quiz, studies and progressions, pop-up buttons in place of chip rows, and the Scales reference's Chords view.

**Architecture:** Feature-Sliced Design as enforced by lint. New pure logic in the music kernel and widget models,
tested without React; one new entity (`lesson`); one new widget (`lesson-view`); kit components `Dropdown` (over
shadcn's Base UI `select`), `RowLink`, `RowGroup` and `PAINT`; the keyboard learns what a key plays. Routes stay
code-based TanStack Router routes over lazy screen chunks.

**Tech Stack:** React 19, Vite, strict TypeScript 6, TanStack Router, Base UI via shadcn, Tailwind v4, zustand,
i18next, Vitest 4 + Testing Library + jsdom.

**Spec:** `docs/superpowers/specs/2026-09-27-navigation-and-options-design.md` (read it first; this plan argues
from it).

## Global Constraints

- Prettier: no semicolons, single quotes, trailing commas `all`, printWidth 100. Format only touched files:
  `npx prettier --write <files>`; never `npm run format`.
- Strict TS: `noUncheckedIndexedAccess`, `verbatimModuleSyntax` (`import type`), no `any`, no casts to silence types.
- Vitest `globals: false`: import `describe/it/expect/vi` from `vitest`.
- Every interface string in `en` and `ru`; Russian typed against English.
- FSD: import from your own layer or below; another slice only through its `index.ts`.
- shadcn primitives are added with the CLI (`npx shadcn@latest add <name>`), then fitted to the kit (44px targets).
- Semantic Tailwind utilities only; variants are lookup maps of full class strings; 44px targets.
- No redirects from `/theory/*`; no store changes shape.
- Verify each task: `npm run typecheck && npm run lint && npm run test`; routing and config tasks also `npm run build`.
- Commit on `main` after each task, message ending with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

1. **A stale or hand-edited URL** (`/learn/scales?show=chords&kind=blues`, `?keysPlay=x`, `/songs?collection=studies`,
   `/practice/quiz/nope`, `/songs/ex3`, `/practice/studies/bz5`): falls back to the default or shows not found, never
   crashes. Pinned in Tasks 6, 7 and 8.
2. **A degree's key pressed in Chords view while spotlight struck keys ring** (tap a list chord, then tap a key):
   the tap's chord keys go down and sound on top; nothing throws. Pinned in Task 8.
3. **Keys play Notes with a note outside the scale** (C♯ in C major) and after the scale changes: the line says no
   chord holds it; changing root, scale, size or Keys play clears the note. Pinned in Task 8.
4. **Russian at 360px:** four nav labels and pop-up values fit; long Russian values truncate inside the trigger, not
   past it. Pinned by `min-w-0 truncate` on the value in Task 4 and the visual check in Task 10.
5. **Back from a page opened directly** (a study's page, a lesson, a reference, a quiz): Back leads to its place
   (`/practice` or `/learn`), not to Songs. Pinned in Tasks 6 and 7.

---

## File Structure

| File | Responsibility |
| ---- | -------------- |
| `src/shared/lib/music/{scale,chord,place}.ts` | `scaleHasChords`, `chordHolds`, `placeScaleChords` |
| `src/shared/lib/schedule/sounds.ts` | `keySounds(keys)` (replaces `keySound`) |
| `src/shared/lib/services/use-play.ts` | `useSoundKeys()` (replaces `useSoundKey`) |
| `src/shared/ui/piano-keyboard/{key-look.ts,Key.tsx,PianoKeyboard.tsx}` | a mark's `caption`; `keyPlays` |
| `src/features/live-keyboard/ui/{LiveKeyboard,ExplorerKeyboard}.tsx` | `keyPlays`, `outlined`, `range` |
| `src/features/connect-midi/use-midi-key-down.ts` | `useMidiKeyDown(onKey)` |
| `src/shared/ui/primitives/select.tsx` | shadcn's Base UI select, fitted |
| `src/shared/ui/{Dropdown.tsx,RowLink.tsx,RowGroup.tsx,paint.ts,option.ts}` | the pop-up button, rows, paints |
| `src/entities/lesson/**` | lesson model, the first lesson, `lessonById`, catalog test |
| `src/widgets/lesson-view/**` | a lesson's sections and blocks, chord examples on a pinned keyboard |
| `src/entities/piece/content/index.ts`, `ui/PieceLink.tsx` | shelves: song collections, studies, progressions; where a piece's page is |
| `src/pages/{learn,chords,scales,lesson,practice,theory-quiz}` | the screens |
| `src/app/router.tsx`, `src/app/routes/*` | routes and chunks |
| `src/widgets/scale-explorer/**` | Scale view and Chords view |
| `src/shared/i18n/locales/{en,ru}/{music,learn,practice}.ts` | the split of `theory` |

---

### Task 1: The kernel: scales with chords, chords that hold a note, the scale's chords placed

**Files:**
- Modify: `src/shared/lib/music/scale.ts`, `src/shared/lib/music/chord.ts`, `src/shared/lib/music/place.ts`,
  `src/shared/lib/music/index.ts`
- Test: `src/shared/lib/music/scale.test.ts`, `src/shared/lib/music/chord.test.ts`, `src/shared/lib/music/place.test.ts`

**Interfaces:**
- Produces: `scaleHasChords(kind: ScaleKind): boolean`; `chordHolds(chord: Chord, pc: PitchClass): boolean`;
  `interface PlacedScaleChord extends DiatonicChord { readonly key: Midi; readonly tones: readonly PlacedTone[] }`;
  `placeScaleChords(root: SpelledNote, kind: ScaleKind, size: 3 | 4): PlacedScaleChord[]`.

- [ ] **Step 1: Write the failing tests**

`scale.test.ts` (append):

```ts
describe('scaleHasChords', () => {
  it('is true for the seven-note scales and false for the pentatonics and the blues', () => {
    expect(SCALE_KINDS.filter(scaleHasChords)).toEqual(['major', 'natural', 'harmonic', 'melodic'])
  })
})
```

`chord.test.ts` (append; the reharmonisation table's G row, roadmap §10.3, is the oracle):

```ts
describe('chordHolds', () => {
  const G = pitchClassOf(note('G'))
  const chord = (symbol: string) => parseChordSymbol(symbol)

  it.each(['EbMaj7', 'AbMaj7', 'Em7', 'Am7', 'Eb7', 'A7', 'C', 'G'])('%s holds G', (symbol) => {
    expect(chordHolds(chord(symbol), G)).toBe(true)
  })

  it.each(['Dm', 'F', 'Bdim', 'DMaj7'])('%s does not hold G', (symbol) => {
    expect(chordHolds(chord(symbol), G)).toBe(false)
  })

  it('counts the bass of a slash chord', () => {
    expect(chordHolds(chord('C/D'), pitchClassOf(note('D')))).toBe(true)
  })
})
```

`place.test.ts` (append):

```ts
describe('placeScaleChords', () => {
  it('stands each triad of C major on its degree’s key, with its numeral', () => {
    const chords = placeScaleChords(note('C'), 'major', 3)
    expect(chords.map((c) => c.roman)).toEqual(['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'])
    expect(chords.map((c) => c.key)).toEqual([60, 62, 64, 65, 67, 69, 71])
    expect(chords[1]?.tones.map((t) => t.midi)).toEqual([62, 65, 69])
  })

  it('stacks a 7th chord from its degree’s key, even past the octave', () => {
    const iii = placeScaleChords(note('A'), 'major', 4)[2]
    expect(iii?.chord).toEqual({ root: note('C', 1), quality: 'm7' })
    expect(iii?.key).toBe(73)
    expect(iii?.tones.map((t) => t.midi)).toEqual([73, 76, 80, 83])
  })

  it('has none for a scale without seven notes', () => {
    expect(placeScaleChords(note('C'), 'blues', 3)).toEqual([])
  })
})
```

Add the imports each file needs (`scaleHasChords`, `SCALE_KINDS`; `chordHolds`, `parseChordSymbol`, `note`,
`pitchClassOf`; `placeScaleChords`, `note`).

- [ ] **Step 2: Run the tests to see them fail**

Run: `npx vitest run src/shared/lib/music`
Expected: FAIL, `scaleHasChords`, `chordHolds`, `placeScaleChords` are not exported.

- [ ] **Step 3: Implement**

`scale.ts` (after `scaleIntervals`):

```ts
/** Whether a chord stands on each degree: a scale of seven notes (its numerals run I to VII). */
export const scaleHasChords = (kind: ScaleKind): boolean => scaleIntervals(kind).length === 7
```

`chord.ts` (after `spellChord`):

```ts
/** Whether a note, in any octave, is one of the chord's notes (its tones, or the bass after a slash). */
export function chordHolds(chord: Chord, pc: PitchClass): boolean {
  if (chord.bass && pitchClassOf(chord.bass) === pc) return true
  return spellChord(chord.root, chord.quality).some((tone) => pitchClassOf(tone.note) === pc)
}
```

`place.ts` (after `placeScale`; import `diatonicChords` and `type DiatonicChord` from `./diatonic`, `sameNote` from
`./note`):

```ts
/** A chord of a scale where the keyboard shows the scale: on its degree's key, stacked upwards from it. */
export interface PlacedScaleChord extends DiatonicChord {
  /** The degree's key, as `placeScale` places it. */
  readonly key: Midi
  /** The chord's tones in root position from that key. */
  readonly tones: readonly PlacedTone[]
}

/** The triads (3) or 7th chords (4) of a seven-note scale, each on its degree's key. */
export function placeScaleChords(
  root: SpelledNote,
  kind: ScaleKind,
  size: 3 | 4,
): PlacedScaleChord[] {
  const degrees = placeScale(root, kind)
  return diatonicChords(spellScale(root, kind), size).flatMap((diatonic) => {
    const degree = degrees.find((placed) => sameNote(placed.tone.note, diatonic.chord.root))
    if (!degree) return []
    const tones = spellChord(diatonic.chord.root, diatonic.chord.quality).map((tone) => ({
      tone,
      midi: midi(degree.midi + tone.semitones),
    }))
    return [{ ...diatonic, key: degree.midi, tones }]
  })
}
```

`index.ts`: export `chordHolds` (chord block), `scaleHasChords` (scale block), `placeScaleChords` and
`type PlacedScaleChord` (place block).

- [ ] **Step 4: Run the tests to see them pass**

Run: `npx vitest run src/shared/lib/music`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
npx prettier --write src/shared/lib/music
git add src/shared/lib/music
git commit -m "Say which scales have chords, which chords hold a note, and place a scale's chords on its keys"
```

---

### Task 2: A hand plays any number of keys

**Files:**
- Modify: `src/shared/lib/schedule/sounds.ts`, `src/shared/lib/schedule/index.ts`,
  `src/shared/lib/services/use-play.ts`, `src/shared/lib/services/index.ts`,
  `src/features/live-keyboard/ui/LiveKeyboard.tsx`
- Test: `src/shared/lib/schedule/sounds.test.ts`, `src/shared/lib/services/use-play.test.tsx`

**Interfaces:**
- Produces: `keySounds(keys: readonly Midi[]): NoteSound[]`; `useSoundKeys(): (keys: readonly Midi[]) => void`.
  `keySound` and `useSoundKey` are removed.

- [ ] **Step 1: Write the failing tests**

`sounds.test.ts`: replace the `keySound` block with

```ts
describe('keySounds', () => {
  it('sounds a tapped key now, ringing on', () => {
    const [sound] = keySounds([midi(66)])
    expect(sound).toMatchObject({ kind: 'note', midi: 66, at: 0 })
    expect(sound?.duration).toBeGreaterThan(0.5)
  })

  it('sounds a chord a key stands for at once, each note softer than a lone key', () => {
    const chord = keySounds([midi(62), midi(65), midi(69)])
    expect(chord.map((s) => [s.midi, s.at])).toEqual([
      [62, 0],
      [65, 0],
      [69, 0],
    ])
    expect(chord[0]?.velocity).toBeLessThan(keySounds([midi(62)])[0]?.velocity ?? 0)
  })
})
```

`use-play.test.tsx`: rename `useSoundKey` to `useSoundKeys`; every call passes an array (`soundKeys([midi(66)])`);
add

```ts
  it('sounds every key a hand plays at once, as one play', () => {
    const { audio, current: soundKeys } = setup(useSoundKeys)
    soundKeys([midi(62), midi(65), midi(69)])
    expect(audio.played).toHaveLength(1)
    expect(keysPlayed(audio.played[0]?.sounds ?? [])).toEqual([62, 65, 69])
  })
```

- [ ] **Step 2: Run to see them fail**

Run: `npx vitest run src/shared/lib/schedule/sounds.test.ts src/shared/lib/services/use-play.test.tsx`
Expected: FAIL, `keySounds` and `useSoundKeys` do not exist.

- [ ] **Step 3: Implement**

`sounds.ts`: replace `keySound` with

```ts
/** The keys a hand plays at once, now: a tap's key, or the chord a key stands for, each softer. */
export const keySounds = (keys: readonly Midi[]): NoteSound[] =>
  keys.map((key) => ({
    kind: 'note',
    midi: key,
    at: 0,
    duration: TAP.duration,
    velocity: keys.length > 1 ? BLOCK.velocity : TAP.velocity,
  }))
```

`schedule/index.ts`: export `keySounds` in place of `keySound`.

`use-play.ts`: replace `useSoundKey` with

```ts
/**
 * Sounds the keys a hand plays now, on top of whatever sounds: a tap is one key, or the chord a key
 * stands for, with nothing to schedule ahead. The keyboard shows them while the hand holds its key.
 */
export function useSoundKeys(): (keys: readonly Midi[]) => void {
  const { audio } = useServices()
  return useCallback(
    (keys) => {
      void audio.unlock()
      audio.play(keySounds(keys), audio.now(), { byHand: true })
    },
    [audio],
  )
}
```

`services/index.ts`: `export { usePlay, useSoundKeys } from './use-play'`.

`LiveKeyboard.tsx`: `const soundKeys = useSoundKeys()` and in `play`: `soundKeys([key])`.

- [ ] **Step 4: Run to see them pass**

Run: `npx vitest run src/shared/lib src/features/live-keyboard`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
npx prettier --write src/shared/lib/schedule src/shared/lib/services src/features/live-keyboard
git add -A src/shared/lib/schedule src/shared/lib/services src/features/live-keyboard
git commit -m "Let a hand's play sound any number of keys at once"
```

---

### Task 3: The keyboard: what a key plays, a mark's caption, a MIDI key going down

**Files:**
- Modify: `src/shared/ui/piano-keyboard/key-look.ts`, `Key.tsx`, `PianoKeyboard.tsx`;
  `src/features/live-keyboard/ui/LiveKeyboard.tsx`, `ExplorerKeyboard.tsx`,
  `src/features/live-keyboard/testing/render-live-keyboard.tsx`; `src/features/connect-midi/index.ts`
- Create: `src/features/connect-midi/use-midi-key-down.ts`
- Test: `src/shared/ui/piano-keyboard/key-look.test.ts`, `PianoKeyboard.test.tsx`,
  `src/features/live-keyboard/ui/LiveKeyboard.test.tsx`, `src/features/connect-midi/use-midi-key-down.test.tsx`

**Interfaces:**
- Consumes: `useSoundKeys` (Task 2).
- Produces: `KeyMark.caption?: string`; `KeyLabel.caption?: string`; `PianoKeyboard` and `LiveKeyboard` prop
  `keyPlays?: (key: Midi) => readonly Midi[]`; `ExplorerKeyboard` props
  `{ keys, marks, range?, keyPlays?, outlined?, onKeyPress?, className? }`; `useMidiKeyDown(onKey: (key: Midi) => void): void`.

- [ ] **Step 1: Write the failing tests**

`key-look.test.ts`:

```ts
  it('carries a mark’s caption on its label: a degree’s numeral over its chord', () => {
    const marks = new Map([[midi(62), { tone: 'scale' as const, label: 'Dm', caption: 'ii' }]])
    expect(keyLook(midi(62), { marks }, TEXT).label).toEqual({
      kind: 'mark',
      text: 'Dm',
      caption: 'ii',
    })
  })

  it('tells two looks apart by their caption', () => {
    const a = keyLook(midi(62), { marks: new Map([[midi(62), { tone: 'scale' as const, label: 'Dm', caption: 'ii' }]]) }, TEXT)
    const b = keyLook(midi(62), { marks: new Map([[midi(62), { tone: 'scale' as const, label: 'Dm', caption: 'II' }]]) }, TEXT)
    expect(sameLook(a, b)).toBe(false)
  })
```

(`TEXT` is the file's existing `{ namedKeys: 'c' }` constant; add it if the file names it otherwise.)

`PianoKeyboard.test.tsx`:

```ts
  it('draws a mark’s caption over its label', () => {
    renderKeyboard({ marks: new Map([[midi(62), { tone: 'scale', label: 'Dm', caption: 'ii' }]]) })
    expect(screen.getByRole('button', { name: 'D4' })).toHaveTextContent('iiDm')
  })

  it('holds down every key a pressed key plays', () => {
    const chordOnD = (key: Midi) => (key === 62 ? [midi(62), midi(65), midi(69)] : [key])
    renderKeyboard({ keyPlays: chordOnD })
    fireEvent.pointerDown(screen.getByRole('button', { name: 'D4' }), { pointerId: 1 })
    expect(screen.getByRole('button', { name: 'F4' })).toHaveAttribute('data-down')
    expect(screen.getByRole('button', { name: 'A4' })).toHaveAttribute('data-down')
    expect(screen.getByRole('button', { name: 'E4' })).not.toHaveAttribute('data-down')
  })
```

(`renderKeyboard` is the file's existing helper; give it `marks` and `keyPlays` pass-through props if it lacks them.)

`LiveKeyboard.test.tsx`:

```ts
  it('sounds what a key plays and holds all of it down while the key is held', () => {
    const { audio } = setUp({ keyPlays: (key) => (key === 62 ? [midi(62), midi(65), midi(69)] : [key]) })
    fireEvent.pointerDown(screen.getByRole('button', { name: 'D4' }), { pointerId: 1 })
    expect(notesOf(audio.played.at(-1)?.sounds ?? [])).toEqual([62, 65, 69])
    expect(screen.getByRole('button', { name: 'A4' })).toHaveAttribute('data-down')
  })
```

(`notesOf` maps note sounds to their `midi`; add it to the file if missing.)

`use-midi-key-down.test.tsx`:

```tsx
import { renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { createFakeAudio } from '@/shared/api/audio'
import { createFakeMidi } from '@/shared/api/midi'
import { midi } from '@/shared/lib/music'
import { ServicesProvider } from '@/shared/lib/services'
import { useMidiKeyDown } from './use-midi-key-down'

describe('useMidiKeyDown', () => {
  it('calls back for each key going down on the MIDI keyboard, not for one let go', () => {
    const keyboard = createFakeMidi()
    const onKey = vi.fn()
    const wrapper = ({ children }: { children: ReactNode }) => (
      <ServicesProvider services={{ audio: createFakeAudio(), midi: keyboard }}>{children}</ServicesProvider>
    )
    renderHook(() => useMidiKeyDown(onKey), { wrapper })
    keyboard.press(midi(64))
    keyboard.release(midi(64))
    expect(onKey.mock.calls).toEqual([[64]])
  })

  it('does nothing where the browser has no Web MIDI', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <ServicesProvider services={{ audio: createFakeAudio(), midi: null }}>{children}</ServicesProvider>
    )
    expect(() => renderHook(() => useMidiKeyDown(vi.fn()), { wrapper })).not.toThrow()
  })
})
```

- [ ] **Step 2: Run to see them fail**

Run: `npx vitest run src/shared/ui/piano-keyboard src/features/live-keyboard src/features/connect-midi`
Expected: FAIL (no `caption`, no `keyPlays`, no `use-midi-key-down`).

- [ ] **Step 3: Implement**

`key-look.ts`: `KeyMark` gains

```ts
  /** A second, smaller line over the label: a degree's numeral over its chord. */
  readonly caption?: string
```

`KeyLabel` gains `readonly caption?: string`; `labelOf` returns
`{ kind: 'mark', text: mark.label, ...(mark.caption ? { caption: mark.caption } : {}) }` for a mark; `sameLook` adds
`a.label?.caption === b.label?.caption`.

`Key.tsx`: the label becomes

```tsx
      {look.label ? (
        <span aria-hidden className="relative flex flex-col items-center leading-tight">
          {look.label.caption ? (
            <span className="text-xs font-semibold">{look.label.caption}</span>
          ) : null}
          <span
            className={cn(
              'font-bold tabular-nums',
              look.label.kind === 'name' || look.label.caption ? 'text-xs' : 'text-sm',
            )}
          >
            {look.label.text}
          </span>
        </span>
      ) : null}
```

`PianoKeyboard.tsx`: a prop

```ts
  /**
   * What a key plays when a hand presses it: the key alone, unless the screen makes it more (a
   * degree's key its chord). All of it is down while the key is held.
   */
  keyPlays?: ((key: Midi) => readonly Midi[]) | undefined
```

and the `down` memo becomes

```ts
  const down = useMemo(() => {
    if (pointers.pressed.size === 0) return states.down
    const pressed = keyPlays ? [...pointers.pressed].flatMap(keyPlays) : pointers.pressed
    return new Set([...(states.down ?? []), ...pressed])
  }, [states.down, pointers.pressed, keyPlays])
```

`LiveKeyboard.tsx`: take `keyPlays` (documented as in `PianoKeyboard`), keep a module constant
`const ALONE = (key: Midi): readonly Midi[] => [key]`, `const plays = keyPlays ?? ALONE`; `play(key)` calls
`soundKeys(plays(key))` then `onKeyPress?.(key)`; the typed keys held join `down` as
`[...typed.held].flatMap(plays)`; pass `keyPlays={keyPlays}` to `PianoKeyboard`. Omit `'keyPlays'` from the
`Omit<ComponentProps<typeof PianoKeyboard>, …>` list only if TypeScript needs it (the prop passes straight through).

`ExplorerKeyboard.tsx`:

```tsx
/**
 * An explorer's keyboard, pinned while the page scrolls: `range` fills its width (by default the
 * middle octaves grown to hold `keys`), and it keeps `keys` in view.
 */
export function ExplorerKeyboard({
  keys,
  marks,
  range,
  keyPlays,
  outlined,
  onKeyPress,
  className,
}: {
  keys: readonly Midi[]
  marks: ReadonlyMap<Midi, KeyMark>
  range?: KeyRange
  /** What a key plays (Chords view: a degree's chord). */
  keyPlays?: (key: Midi) => readonly Midi[]
  /** Keys ringed inside: the chords that hold the note. */
  outlined?: ReadonlySet<Midi>
  /** What a key means besides its sound (Notes view: the note). */
  onKeyPress?: (key: Midi) => void
  className?: string
}) {
  return (
    <Pinned className={className}>
      <LiveKeyboard
        range={range ?? keyboardRange(keys, MIDDLE_OCTAVES)}
        inView={rangeOf(keys)}
        marks={marks}
        outlined={outlined}
        keyPlays={keyPlays}
        onKeyPress={onKeyPress}
        spotlight
      />
    </Pinned>
  )
}
```

`use-midi-key-down.ts`:

```ts
import { useEffect, useLayoutEffect, useRef } from 'react'
import type { Midi } from '@/shared/lib/music'
import { useServices } from '@/shared/lib/services'

/** Calls `onKey` for each key going down on the MIDI keyboard; nothing where there is none. */
export function useMidiKeyDown(onKey: (key: Midi) => void): void {
  const { midi } = useServices()
  const latest = useRef(onKey)
  useLayoutEffect(() => {
    latest.current = onKey
  })
  useEffect(
    () =>
      midi?.onNote((event) => {
        if (event.on) latest.current(event.midi)
      }),
    [midi],
  )
}
```

`connect-midi/index.ts`: `export { useMidiKeyDown } from './use-midi-key-down'`.
`render-live-keyboard.tsx`: accept `keyPlays` and pass it through.

- [ ] **Step 4: Run to see them pass**

Run: `npx vitest run src/shared/ui src/features`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
npx prettier --write src/shared/ui/piano-keyboard src/features/live-keyboard src/features/connect-midi
git add -A src/shared/ui/piano-keyboard src/features/live-keyboard src/features/connect-midi
git commit -m "Let a key play what the screen makes it, carry a caption over its label, and hear a MIDI key go down"
```

---

### Task 4: The kit: the pop-up button, a row that leads somewhere, paints

**Files:**
- Create (CLI): `src/shared/ui/primitives/select.tsx`
- Create: `src/shared/ui/Dropdown.tsx`, `src/shared/ui/RowLink.tsx`, `src/shared/ui/RowGroup.tsx`, `src/shared/ui/paint.ts`
- Modify: `src/shared/ui/option.ts`, `src/shared/ui/index.ts`, `src/entities/path/ui/step-paint.ts`
- Test: `src/shared/ui/kit.test.tsx`

**Interfaces:**
- Produces: `Option<V>.detail?: string`; `interface OptionGroup<V> { label: string; options: readonly Option<V>[] }`;
  `Dropdown<V>({ label, value, onChange, className?, options } | { …, groups })`;
  `type Paint = 'sand' | 'sky' | 'grass' | 'yellow' | 'lilac'`; `PAINT: Record<Paint, { fill: string; ink: string }>`;
  `RowLink({ title, detail?, icon, paint, render })`; `RowGroup({ title, children })`.

- [ ] **Step 1: Add the primitive**

Run: `npx shadcn@latest add select`
Then fit it to the kit in `src/shared/ui/primitives/select.tsx`: import `cn` from `'cn'` as the other primitives
do; drop the `size` prop and its `sm` classes; the trigger
`flex h-11 min-w-0 items-center gap-2 rounded-xl border border-input bg-card px-3 text-base whitespace-nowrap transition-colors duration-200 ease-out outline-none select-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0`
with a `ChevronsUpDown` icon (`size-4 text-muted-foreground`); the popup
`max-h-(--available-height) min-w-(--anchor-width) overflow-y-auto rounded-xl bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10`
(keep the CLI's open and close animation classes); an item
`relative flex min-h-11 w-full cursor-default items-center gap-3 rounded-lg py-2 pr-10 pl-3 text-base outline-hidden select-none data-highlighted:bg-muted data-disabled:opacity-50`
with a `Check` indicator `absolute right-3 size-5 text-selected`; the group label
`px-3 pt-2 pb-1 text-sm font-semibold text-muted-foreground`; the separator `my-1 h-px bg-hairline`.

- [ ] **Step 2: Write the failing tests** (`kit.test.tsx`)

```tsx
const ROOTS = [
  { value: 'C', label: 'C' },
  { value: 'D', label: 'D' },
] as const

describe('Dropdown', () => {
  it('shows its label and the current value, and reports another choice', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Dropdown label="Root" value="C" options={ROOTS} onChange={onChange} />)
    const trigger = screen.getByRole('combobox', { name: 'Root' })
    expect(trigger).toHaveTextContent('RootC')
    await user.click(trigger)
    await user.click(await screen.findByRole('option', { name: 'D' }))
    expect(onChange).toHaveBeenCalledWith('D')
  })

  it('checks the chosen item and reports nothing when it is chosen again', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Dropdown label="Root" value="C" options={ROOTS} onChange={onChange} />)
    await user.click(screen.getByRole('combobox', { name: 'Root' }))
    const chosen = await screen.findByRole('option', { name: 'C' })
    expect(chosen).toHaveAttribute('aria-selected', 'true')
    await user.click(chosen)
    expect(onChange).not.toHaveBeenCalled()
  })

  it('lists groups under their names, an item with its detail, and hands a number back', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <Dropdown
        label="Chord"
        value={0}
        groups={[
          { label: 'Triads', options: [{ value: 0, label: 'Major', detail: 'M' }] },
          { label: '7th chords', options: [{ value: 1, label: 'Minor 7th', detail: 'm7' }] },
        ]}
        onChange={onChange}
      />,
    )
    expect(screen.getByRole('combobox', { name: 'Chord' })).toHaveTextContent('Major')
    await user.click(screen.getByRole('combobox', { name: 'Chord' }))
    expect(await screen.findByRole('group', { name: '7th chords' })).toBeInTheDocument()
    await user.click(screen.getByRole('option', { name: 'Minor 7th m7' }))
    expect(onChange).toHaveBeenCalledWith(1)
  })
})

describe('RowLink', () => {
  it('is a link named by its title and detail, leading on with a chevron', () => {
    render(
      <RowLink title="Chords" detail="Beginner" icon={Settings} paint="sand" render={<a href="/learn/chords" />} />,
    )
    const link = screen.getByRole('link', { name: 'Chords Beginner' })
    expect(link).toHaveAttribute('href', '/learn/chords')
    expect(link.querySelector('[data-slot="row-tile"]')).toHaveClass('bg-paint-sand')
  })
})

describe('RowGroup', () => {
  it('titles a card of rows', () => {
    render(
      <RowGroup title="References">
        <li>Chords</li>
      </RowGroup>,
    )
    expect(screen.getByRole('region', { name: 'References' })).toContainElement(screen.getByText('Chords'))
  })
})
```

- [ ] **Step 3: Run to see them fail**

Run: `npx vitest run src/shared/ui/kit.test.tsx`
Expected: FAIL, the components do not exist.

- [ ] **Step 4: Implement**

`option.ts`:

```ts
export interface Option<V extends OptionValue> {
  readonly value: V
  readonly label: string
  /** The accessible name, when the label alone is not enough (`7` → "Dominant 7th"). */
  readonly title?: string
  /** A pop-up item's second word, in soft ink after its label ("Minor 7th · m7"). */
  readonly detail?: string
}

/** Options under a name: a pop-up button's group (a chord family). */
export interface OptionGroup<V extends OptionValue> {
  readonly label: string
  readonly options: readonly Option<V>[]
}
```

`Dropdown.tsx`:

```tsx
import { Fragment } from 'react'
import type { Option, OptionGroup, OptionValue } from './option'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './primitives/select'

type Choices<V extends OptionValue> =
  | { readonly options: readonly Option<V>[]; readonly groups?: never }
  | { readonly groups: readonly OptionGroup<V>[]; readonly options?: never }

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
  const groups: readonly { readonly label?: string; readonly options: readonly Option<V>[] }[] =
    choices.groups ?? [{ options: choices.options }]
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
        <SelectValue className="min-w-0 flex-1 truncate text-left font-semibold" />
      </SelectTrigger>
      <SelectContent>
        {groups.map((group, i) => (
          <Fragment key={group.label ?? i}>
            {i > 0 ? <SelectSeparator /> : null}
            <SelectGroup>
              {group.label ? <SelectLabel>{group.label}</SelectLabel> : null}
              {group.options.map((option) => (
                <SelectItem key={String(option.value)} value={option.value} aria-label={option.title}>
                  {option.label}
                  {option.detail ? (
                    <span className="text-muted-foreground">{option.detail}</span>
                  ) : null}
                </SelectItem>
              ))}
            </SelectGroup>
          </Fragment>
        ))}
      </SelectContent>
    </Select>
  )
}
```

`paint.ts`:

```ts
/** The chrome's paints that name places and kinds of step (DESIGN.md, the paint set). */
export type Paint = 'sand' | 'sky' | 'grass' | 'yellow' | 'lilac'

/** A paint as the book prints it on a place: its wash as a tile's fill, its deep shade as the icon on it. */
export const PAINT: Readonly<Record<Paint, { readonly fill: string; readonly ink: string }>> = {
  sand: { fill: 'bg-paint-sand', ink: 'text-on-paint-sand' },
  sky: { fill: 'bg-paint-sky', ink: 'text-on-paint-sky' },
  grass: { fill: 'bg-paint-grass', ink: 'text-on-paint-grass' },
  yellow: { fill: 'bg-paint-yellow', ink: 'text-on-paint-yellow' },
  lilac: { fill: 'bg-paint-lilac', ink: 'text-on-paint-lilac' },
}
```

`RowLink.tsx`:

```tsx
import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import { ChevronRight, type LucideIcon } from 'lucide-react'
import { cn } from '@/shared/lib'
import { PAINT, type Paint } from './paint'

/**
 * A list row that leads to a page: a tile in its paint with an icon, a title, an optional detail,
 * and a chevron (Apple's disclosure indicator). `render` is the link (a router `Link`).
 */
export function RowLink({
  title,
  detail,
  icon: Icon,
  paint,
  render,
}: {
  title: string
  detail?: string | undefined
  icon: LucideIcon
  paint: Paint
  render: useRender.RenderProp
}) {
  return useRender({
    defaultTagName: 'a',
    render,
    props: mergeProps<'a'>({
      className:
        'flex min-h-16 min-w-0 items-center gap-4 rounded-2xl px-1 py-1.5 transition-colors duration-200 ease-out outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring',
      children: (
        <>
          <span
            data-slot="row-tile"
            className={cn('grid size-12 shrink-0 place-items-center rounded-2xl', PAINT[paint].fill, PAINT[paint].ink)}
          >
            <Icon aria-hidden className="size-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-lg font-semibold">{title}</span>
            {detail ? (
              <span className="block truncate text-sm text-muted-foreground">{detail}</span>
            ) : null}
          </span>
          <ChevronRight aria-hidden className="size-5 shrink-0 text-muted-foreground" />
        </>
      ),
    }),
  })
}
```

`RowGroup.tsx`:

```tsx
import { useId, type ReactNode } from 'react'

/** A titled card of rows, parted by hairlines: Learn's and Practice's lists. */
export function RowGroup({ title, children }: { title: string; children: ReactNode }) {
  const id = useId()
  return (
    <section aria-labelledby={id} className="flex flex-col gap-2">
      <h2 id={id} className="text-2xl">
        {title}
      </h2>
      <ul className="flex flex-col divide-y divide-hairline rounded-3xl border border-border bg-card px-2">
        {children}
      </ul>
    </section>
  )
}
```

`index.ts`: export `Dropdown`, `type OptionGroup`, `PAINT`, `type Paint`, `RowGroup`, `RowLink`.

`step-paint.ts`:

```ts
import { PAINT } from '@/shared/ui'
import type { StepKind } from './use-step-title'

/** Each kind of step in its own paint (a step's tile, the Continue card's band). */
export const STEP_PAINT: Readonly<Record<StepKind, (typeof PAINT)[keyof typeof PAINT]>> = {
  chords: PAINT.sand,
  scale: PAINT.sky,
  study: PAINT.grass,
  song: PAINT.yellow,
  progression: PAINT.lilac,
}
```

- [ ] **Step 5: Run to see them pass**

Run: `npx vitest run src/shared/ui src/entities/path src/widgets` then `npm run typecheck && npm run lint`
Expected: PASS. (If Base UI names the options differently in jsdom, read the rendered roles with `screen.debug()`
and fix the test's query, not the component.)

- [ ] **Step 6: Commit**

```bash
npx prettier --write src/shared/ui src/entities/path/ui/step-paint.ts
git add -A src/shared/ui src/entities/path/ui/step-paint.ts package.json package-lock.json
git commit -m "Add the pop-up button, a row that leads somewhere, a titled group of rows and the paints to the kit"
```

---

### Task 5: Lessons as content, and a lesson's view

**Files:**
- Create: `src/entities/lesson/model/types.ts`, `src/entities/lesson/model/selectors.ts`,
  `src/entities/lesson/content/reading-chord-symbols.ts`, `src/entities/lesson/content/index.ts`,
  `src/entities/lesson/content/catalog.test.ts`, `src/entities/lesson/index.ts`
- Create: `src/widgets/lesson-view/model/chord-example.ts` (+ `.test.ts`), `src/widgets/lesson-view/ui/LessonView.tsx`,
  `src/widgets/lesson-view/ui/LessonBlock.tsx`, `src/widgets/lesson-view/ui/ChordExamples.tsx`,
  `src/widgets/lesson-view/ui/LessonView.test.tsx`, `src/widgets/lesson-view/index.ts`
- Modify: `src/entities/path/model/types.ts` (export `LEVEL_NAME`), `src/entities/path/index.ts`,
  `src/widgets/path-levels/ui/PathLevels.tsx` (import it)

**Interfaces:**
- Consumes: `ExplorerKeyboard` (Task 3), `Level` from `@/entities/path`, `LocalText` from `@/shared/i18n`.
- Produces: `Lesson`, `LessonBlock`, `LessonSection`, `LessonCategory`, `LESSON_CATEGORIES`, `LESSONS`,
  `lessonById(id: string): Lesson | undefined` from `@/entities/lesson`; `LEVEL_NAME: Record<Level, 'beginner' |
  'elementary' | 'intermediate' | 'advanced'>` from `@/entities/path`; `LessonView({ lesson })` from
  `@/widgets/lesson-view`; `placeExample(symbol): ChordExample` (widget model).

- [ ] **Step 1: Write the failing tests**

`src/entities/lesson/content/catalog.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { parseChordSymbol } from '@/shared/lib/music'
import { lessonById, LESSONS } from '../index'
import type { Lesson } from '../model/types'

const texts = (lesson: Lesson) => [
  lesson.title,
  lesson.summary,
  ...lesson.sections.flatMap((section) => [
    section.heading,
    ...section.blocks.flatMap((block) => {
      switch (block.kind) {
        case 'text':
          return block.lead ? [block.lead, block.text] : [block.text]
        case 'note':
          return [block.text]
        case 'steps':
          return block.steps
        case 'chords':
          return []
      }
    }),
  ]),
]

describe('the lessons', () => {
  it('have unique ids, each found by its id', () => {
    const ids = LESSONS.map((lesson) => lesson.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const lesson of LESSONS) expect(lessonById(lesson.id)).toBe(lesson)
    expect(lessonById('nothing')).toBeUndefined()
  })

  it('say everything in English and Russian', () => {
    for (const lesson of LESSONS) {
      for (const text of texts(lesson)) {
        expect(text.en.trim(), lesson.id).not.toBe('')
        expect(text.ru.trim(), lesson.id).not.toBe('')
      }
    }
  })

  it('give only chord examples the kernel reads', () => {
    for (const lesson of LESSONS) {
      for (const section of lesson.sections) {
        for (const block of section.blocks) {
          if (block.kind !== 'chords') continue
          for (const symbol of block.symbols) expect(() => parseChordSymbol(symbol), symbol).not.toThrow()
        }
      }
    }
  })

  it('open with reading chord symbols, a beginner’s chords lesson', () => {
    expect(LESSONS[0]).toMatchObject({ id: 'reading-chord-symbols', level: 1, category: 'chords' })
  })
})
```

`src/widgets/lesson-view/model/chord-example.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { placeExample } from './chord-example'

describe('placeExample', () => {
  it('places a chord from middle C, each tone marked by role and degree', () => {
    const example = placeExample('Cm7')
    expect(example.name).toBe('Cm7')
    expect(example.keys).toEqual([60, 63, 67, 70])
    expect(example.marks.get(63)).toEqual({ tone: '3rd', label: '♭3' })
  })

  it('puts a slash chord’s bass in the octave below, unmarked when it is no chord tone', () => {
    const example = placeExample('C/D')
    expect(example.name).toBe('C/D')
    expect(example.keys).toEqual([50, 60, 64, 67])
    expect(example.marks.has(50)).toBe(false)
  })

  it('marks a bass that is a chord tone as that tone', () => {
    const example = placeExample('F6/D')
    expect(example.keys[0]).toBe(50)
    expect(example.marks.get(50)?.label).toBe('6')
  })
})
```

`src/widgets/lesson-view/ui/LessonView.test.tsx`:

```tsx
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { lessonById } from '@/entities/lesson'
import { createSettingsStore, SettingsStoreProvider } from '@/entities/settings'
import { createFakeAudio } from '@/shared/api/audio'
import { createFakeMidi } from '@/shared/api/midi'
import { createMemoryStorage } from '@/shared/lib'
import { ServicesProvider } from '@/shared/lib/services'
import { LessonView } from './LessonView'

function renderLesson() {
  const lesson = lessonById('reading-chord-symbols')
  if (!lesson) throw new Error('the first lesson is missing')
  const audio = createFakeAudio()
  const store = createSettingsStore({ storage: createMemoryStorage(), languages: ['en'], finePointer: false })
  render(
    <SettingsStoreProvider store={store}>
      <ServicesProvider services={{ audio, midi: createFakeMidi() }}>
        <LessonView lesson={lesson} />
      </ServicesProvider>
    </SettingsStoreProvider>,
  )
  return { audio }
}

const notes = (sounds: readonly { kind: string; midi?: number }[]) =>
  sounds.flatMap((sound) => (sound.kind === 'note' && sound.midi !== undefined ? [sound.midi] : []))

describe('LessonView', () => {
  it('reads its sections in order', () => {
    renderLesson()
    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual([
      'Reading chord symbols',
      'Chord numbers: 2 or 9? 6 or 13?',
      'Naming any chord in 7 steps',
    ])
  })

  it('plays a chord example and marks its tones on the keys', async () => {
    const user = userEvent.setup()
    const { audio } = renderLesson()
    const cm = screen.getByRole('button', { name: 'Cm' })
    await user.click(cm)
    expect(notes(audio.played.at(-1)?.sounds ?? [])).toEqual([60, 63, 67])
    expect(cm).toHaveAttribute('aria-pressed', 'true')
    const keyboard = screen.getByRole('group', { name: 'Keyboard' })
    expect(within(keyboard).getByRole('button', { name: 'D sharp 4' })).toHaveTextContent('♭3')
  })

  it('stops an example on a second tap', async () => {
    const user = userEvent.setup()
    const { audio } = renderLesson()
    await user.click(screen.getByRole('button', { name: 'C9' }))
    await user.click(screen.getByRole('button', { name: 'C9' }))
    expect(audio.stops).toBeGreaterThan(0)
    expect(screen.getByRole('button', { name: 'C9' })).toHaveAttribute('aria-pressed', 'false')
  })
})
```

- [ ] **Step 2: Run to see them fail**

Run: `npx vitest run src/entities/lesson src/widgets/lesson-view`
Expected: FAIL, the modules do not exist.

- [ ] **Step 3: Implement the entity**

`src/entities/path/model/types.ts` (after `Level`):

```ts
/** Each level's name in the interface strings (`common:levelName.*`). */
export const LEVEL_NAME = {
  1: 'beginner',
  2: 'elementary',
  3: 'intermediate',
  4: 'advanced',
} as const satisfies Record<Level, string>
```

Export it from `src/entities/path/index.ts`; `PathLevels.tsx` imports it from `@/entities/path` and drops its own.

`src/entities/lesson/model/types.ts`:

```ts
import type { Level } from '@/entities/path'
import type { LocalText } from '@/shared/i18n'

/** What a lesson teaches, as Learn will filter lessons (roadmap §3.4). */
export const LESSON_CATEGORIES = [
  'chords',
  'scales',
  'theory',
  'accompaniment',
  'jazz',
  'gospel',
] as const
export type LessonCategory = (typeof LESSON_CATEGORIES)[number]

/** One part of a lesson's section: prose, numbered steps, a note to read, or chords that play. */
export type LessonBlock =
  | { readonly kind: 'text'; readonly lead?: LocalText; readonly text: LocalText }
  | { readonly kind: 'steps'; readonly steps: readonly LocalText[] }
  | { readonly kind: 'note'; readonly text: LocalText }
  | { readonly kind: 'chords'; readonly symbols: readonly string[] }

export interface LessonSection {
  readonly heading: LocalText
  readonly blocks: readonly LessonBlock[]
}

/** A Learn page that teaches music, in both languages, with examples that play (content as code, ADR 0002). */
export interface Lesson {
  readonly id: string
  readonly title: LocalText
  readonly summary: LocalText
  /** On the Path's scale, so a lesson and a step say "Beginner" alike. */
  readonly level: Level
  readonly category: LessonCategory
  readonly sections: readonly LessonSection[]
}
```

`src/entities/lesson/content/reading-chord-symbols.ts`: the reading notes, moved from `theory.symbols` (English
from `locales/en/theory.ts`, Russian from `locales/ru/theory.ts`, word for word), in this shape:

```ts
import type { Lesson } from '../model/types'

const readingChordSymbols: Lesson = {
  id: 'reading-chord-symbols',
  title: { en: 'How to read chord symbols', ru: 'Как читать буквенные обозначения' },
  summary: {
    en: 'What each part of a chord symbol says, what its numbers mean, and how to name any chord.',
    ru: 'Что говорит каждая часть обозначения аккорда, что значат его числа и как назвать любой аккорд.',
  },
  level: 1,
  category: 'chords',
  sections: [
    {
      heading: { en: 'Reading chord symbols', ru: 'Чтение обозначений аккордов' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Left part = triad, right part = extras.', ru: 'Левая часть — трезвучие, правая — добавки.' },
          text: {
            en: 'C is major, Cm or C− is minor, C° or Cdim is diminished, C+ or Caug is augmented.',
            ru: 'C — мажор, Cm или C− — минор, C° или Cdim — уменьшённое, C+ или Caug — увеличенное.',
          },
        },
        { kind: 'chords', symbols: ['C', 'Cm', 'C°', 'C+'] },
        // numbers (text), then sevenths (text) + chords ['C7', 'CMaj7', 'Cm(maj7)'],
        // sixth (text) + chords ['C6', 'Cm6'], sus (text) + chords ['Csus2', 'Csus4'],
        // slash (text) + chords ['C/D'], alterations (text) + chords ['C7♭9#5']
      ],
    },
    {
      heading: { en: 'Chord numbers: 2 or 9? 6 or 13?', ru: 'Числа в аккордах: 2 или 9? 6 или 13?' },
      // twoNames (text); addOnly (text) + chords ['C2', 'Cadd9', 'C6']; upTo (text) + chords ['C9'];
      // thirteenth (text) + chords ['C13']
      blocks: [],
    },
    {
      heading: { en: 'Naming any chord in 7 steps', ru: 'Как назвать любой аккорд за 7 шагов' },
      // steps: the seven `naming.steps` in order; note: `naming.careful`; chords ['Dm7', 'F6/D']
      blocks: [],
    },
  ],
}

export default readingChordSymbols
```

The comments above name each `lead`/`rest` pair of `theory.symbols.*` that becomes a `text` block (`lead` → `lead`,
`rest` → `text`) and where each chord row goes; write every block out in full, with no comment left in the file.

`src/entities/lesson/content/index.ts`:

```ts
import type { Lesson } from '../model/types'
import readingChordSymbols from './reading-chord-symbols'

/** Every lesson, in the order Learn lists them. */
export const LESSONS: readonly Lesson[] = [readingChordSymbols]
```

`src/entities/lesson/model/selectors.ts`:

```ts
import { LESSONS } from '../content'
import type { Lesson } from './types'

const LESSON_BY_ID = new Map(LESSONS.map((lesson) => [lesson.id, lesson]))

export const lessonById = (id: string): Lesson | undefined => LESSON_BY_ID.get(id)
```

`src/entities/lesson/index.ts`:

```ts
export {
  LESSON_CATEGORIES,
  type Lesson,
  type LessonBlock,
  type LessonCategory,
  type LessonSection,
} from './model/types'
export { lessonById } from './model/selectors'
export { LESSONS } from './content'
```

- [ ] **Step 4: Implement the widget**

`src/widgets/lesson-view/model/chord-example.ts`:

```ts
import {
  chordSymbol,
  midi,
  MIDDLE_C,
  parseChordSymbol,
  pitchClassOf,
  placeChord,
  type Midi,
} from '@/shared/lib/music'
import type { KeyMark } from '@/shared/ui'

/** A lesson's chord example as the keys show it. */
export interface ChordExample {
  readonly name: string
  readonly keys: readonly Midi[]
  readonly marks: ReadonlyMap<Midi, KeyMark>
}

/**
 * A chord symbol from a lesson, placed as the Chords reference places it (root position from middle
 * C), its bass after a slash in the octave below; each chord tone marked by role and degree, a bass
 * that is a chord tone as that tone.
 */
export function placeExample(symbol: string): ChordExample {
  const chord = parseChordSymbol(symbol)
  const { rh } = placeChord(chord.root, chord.quality, { inversion: 0, bothHands: false })
  const marks = new Map<Midi, KeyMark>(
    rh.map((placed) => [placed.midi, { tone: placed.tone.role, label: placed.tone.degree }]),
  )
  const keys = rh.map((placed) => placed.midi)
  const bass = chord.bass
  if (!bass) return { name: chordSymbol(chord), keys, marks }
  const bassKey = midi(MIDDLE_C - 12 + pitchClassOf(bass))
  const asTone = rh.find((placed) => pitchClassOf(placed.tone.note) === pitchClassOf(bass))
  if (asTone) marks.set(bassKey, { tone: asTone.tone.role, label: asTone.tone.degree })
  return { name: chordSymbol(chord), keys: [bassKey, ...keys], marks }
}
```

`src/widgets/lesson-view/ui/ChordExamples.tsx`:

```tsx
import { Square } from 'lucide-react'
import { chordSounds } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'
import { Button } from '@/shared/ui/primitives/button'
import { placeExample } from '../model/chord-example'

/** A row of chords a lesson names: a tap plays one and shows it on the keys, a second tap stops it. */
export function ChordExamples({
  symbols,
  onShow,
}: {
  symbols: readonly string[]
  onShow: (symbol: string) => void
}) {
  const playback = usePlayback<string>()
  return (
    <div className="flex flex-wrap gap-2">
      {symbols.map((symbol) => {
        const example = placeExample(symbol)
        const playing = playback.playing === symbol
        return (
          <Button
            key={symbol}
            variant="outline"
            aria-pressed={playing}
            className="relative h-12 min-w-16 px-4 aria-pressed:bg-secondary aria-pressed:text-secondary-foreground"
            onClick={() => {
              onShow(symbol)
              playback.toggle(symbol, chordSounds(example.keys, { arpeggio: false }))
            }}
          >
            {playing ? <Square aria-hidden className="absolute top-1.5 right-1.5 size-3" /> : null}
            <span className="font-display text-xl font-semibold">{example.name}</span>
          </Button>
        )
      })}
    </div>
  )
}
```

`src/widgets/lesson-view/ui/LessonBlock.tsx`:

```tsx
import type { LessonBlock as Block } from '@/entities/lesson'
import { localText, useLocale } from '@/shared/i18n'
import { ChordExamples } from './ChordExamples'

/** One block of a lesson: prose with its bold lead, numbered steps, a note on sand, or chords that play. */
export function LessonBlock({ block, onShow }: { block: Block; onShow: (symbol: string) => void }) {
  const locale = useLocale()
  switch (block.kind) {
    case 'text':
      return (
        <p>
          {block.lead ? <strong>{localText(block.lead, locale)} </strong> : null}
          {localText(block.text, locale)}
        </p>
      )
    case 'steps':
      return (
        <ol className="flex list-decimal flex-col gap-1 pl-5">
          {block.steps.map((step, i) => (
            <li key={i}>{localText(step, locale)}</li>
          ))}
        </ol>
      )
    case 'note':
      return <p className="rounded-3xl bg-muted p-4">{localText(block.text, locale)}</p>
    case 'chords':
      return <ChordExamples symbols={block.symbols} onShow={onShow} />
  }
}
```

`src/widgets/lesson-view/ui/LessonView.tsx`:

```tsx
import { useState } from 'react'
import type { Lesson } from '@/entities/lesson'
import { ExplorerKeyboard } from '@/features/live-keyboard'
import { localText, useLocale } from '@/shared/i18n'
import type { Midi } from '@/shared/lib/music'
import type { KeyMark } from '@/shared/ui'
import { placeExample } from '../model/chord-example'
import { LessonBlock } from './LessonBlock'

const NO_MARKS: ReadonlyMap<Midi, KeyMark> = new Map()

/** A lesson read top to bottom under a pinned keyboard that shows the chord last played from it. */
export function LessonView({ lesson }: { lesson: Lesson }) {
  const locale = useLocale()
  const [shown, setShown] = useState<string | null>(null)
  const example = shown === null ? null : placeExample(shown)
  return (
    <div className="flex flex-col gap-8">
      <ExplorerKeyboard keys={example?.keys ?? []} marks={example?.marks ?? NO_MARKS} />
      {lesson.sections.map((section) => (
        <section
          key={section.heading.en}
          className="flex max-w-prose flex-col gap-3 text-lg leading-relaxed"
        >
          <h2 className="text-2xl">{localText(section.heading, locale)}</h2>
          {section.blocks.map((block, i) => (
            <LessonBlock key={i} block={block} onShow={setShown} />
          ))}
        </section>
      ))}
    </div>
  )
}
```

`src/widgets/lesson-view/index.ts`: `export { LessonView } from './ui/LessonView'`.

- [ ] **Step 5: Run to see them pass**

Run: `npx vitest run src/entities src/widgets` then `npm run typecheck && npm run lint`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
npx prettier --write src/entities/lesson src/entities/path src/widgets/lesson-view src/widgets/path-levels
git add -A src/entities/lesson src/entities/path src/widgets/lesson-view src/widgets/path-levels
git commit -m "Make the chord-symbol reading notes the first lesson, with chord examples that play on the keys"
```

---

### Task 6: Shelves: Songs holds songs, Practice holds studies and progressions

**Files:**
- Modify: `src/entities/piece/model/types.ts` (`COLLECTION_IDS` order), `src/entities/piece/content/index.ts`,
  `src/entities/piece/model/selectors.ts`, `src/entities/piece/index.ts`, `src/entities/piece/content/catalog.test.ts`
- Create: `src/entities/piece/ui/PieceLink.tsx`
- Modify: `src/widgets/piece-list/ui/EntryRow.tsx`, `PieceList.tsx`; `src/widgets/path-levels/ui/StepRow.tsx`;
  `src/pages/piece/ui/PiecePage.tsx`, `PieceFacts.tsx`; `src/pages/player/ui/PlayerTopBar.tsx`;
  `src/pages/songs/ui/SongsPage.tsx`; `src/app/routes/search.ts`; `src/app/router.tsx`;
  `src/widgets/app-nav/ui/AppNav.tsx`; `src/shared/i18n/index.ts`, `locales/{en,ru}/index.ts`, `locales/{en,ru}/common.ts`
- Create: `src/app/routes/practice-screens.ts`, `src/pages/practice/{index.ts,ui/PracticePage.tsx,ui/PracticePage.test.tsx}`,
  `src/shared/i18n/locales/{en,ru}/practice.ts`
- Test: `src/app/router.test.tsx`, `src/app/routes/search.test.ts`, `src/pages/songs/ui/SongsPage.test.tsx`,
  `src/pages/piece/ui/PiecePage.test.tsx`

**Interfaces:**
- Consumes: `Dropdown`, `RowGroup` (Task 4).
- Produces: `SONG_COLLECTIONS: readonly Collection[]`, `STUDIES: Collection`, `PROGRESSIONS: Collection`,
  `isSongCollectionId(value: unknown): value is CollectionId`, `PieceLink({ entry, ...anchorProps })` from
  `@/entities/piece`; routes `/practice`, `/practice/studies/$pieceId`, `/practice/progressions/$pieceId`;
  `practice-screens.ts` exporting `PracticePage`.

- [ ] **Step 1: Write the failing tests**

`router.test.tsx`: add to `ROUTES`
`['/practice', '/practice'], ['/practice/studies/ex3', '/practice/studies/$pieceId'], ['/practice/progressions/flow', '/practice/progressions/$pieceId']`, and

```ts
describe('shelves', () => {
  it.each(['/songs/ex3', '/songs/flow', '/practice/studies/bz5', '/practice/progressions/ex3'])(
    'show not found for a piece on the wrong shelf: %s',
    async (path) => {
      await renderApp(path)
      expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
    },
  )

  it('opens a study on Practice, which the navigation marks', async () => {
    await renderApp('/practice/studies/ex3')
    const nav = await screen.findByRole('navigation', { name: 'Main navigation' })
    expect(within(nav).getByRole('link', { name: 'Practice' })).toHaveAttribute('aria-current', 'page')
  })

  it('goes back from a study opened directly to Practice', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/studies/ex3')
    await user.click(await screen.findByRole('button', { name: 'Back' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/practice'))
  })

  it('closes a progression’s Player, opened directly, to its page on Practice', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/play/flow')
    await user.click(await screen.findByRole('button', { name: 'Close' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/practice/progressions/flow'))
  })
})
```

`search.test.ts`: `expect(await searchAt('/songs?collection=studies')).toEqual(SONGS_DEFAULTS)`.

`SongsPage.test.tsx`: the tests that clicked collection or level chips now open the pop-up and pick an option, e.g.

```ts
    await user.click(screen.getByRole('combobox', { name: 'Collection' }))
    await user.click(await screen.findByRole('option', { name: 'Hymns' }))
    expect(router.state.location.search).toMatchObject({ collection: 'hymns' })
```

and add

```ts
  it('lists songs only: no study or progression', async () => {
    await renderApp('/songs')
    expect(await screen.findByRole('heading', { name: 'Hymns' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Studies' })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Progressions' })).not.toBeInTheDocument()
  })
```

`src/pages/practice/ui/PracticePage.test.tsx`:

```tsx
import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'

describe('Practice', () => {
  it('lists the studies and the progressions, each opening on Practice', async () => {
    await renderApp('/practice')
    expect(await screen.findByRole('heading', { level: 1, name: 'Practice' })).toBeInTheDocument()
    const studies = screen.getByRole('region', { name: 'Studies' })
    const first = within(studies).getAllByRole('link')[0]
    expect(first?.getAttribute('href')).toMatch(/^\/practice\/studies\//)
    const progressions = screen.getByRole('region', { name: 'Progressions' })
    expect(within(progressions).getAllByRole('link')[0]?.getAttribute('href')).toMatch(
      /^\/practice\/progressions\//,
    )
  })
})
```

(`PieceList` sections get `aria-labelledby` their heading, so they are regions; add it there.)

- [ ] **Step 2: Run to see them fail**

Run: `npx vitest run src/app src/pages/songs src/pages/practice src/pages/piece`
Expected: FAIL (routes and shelves do not exist).

- [ ] **Step 3: Implement the shelves**

`types.ts`: `COLLECTION_IDS = ['bozhe-spasibo', 'called-to-play', 'hymns', 'studies', 'progressions']` (songs first,
then Practice's), comment: "The collections, songs first (in the order Songs lists them), then Practice's".

`content/index.ts`:

```ts
/** The collections Songs lists, in order. */
export const SONG_COLLECTIONS: readonly Collection[] = [bozheSpasibo, calledToPlay, hymns]
/** The method books' lesson pieces, on Practice (roadmap §3.9). */
export const STUDIES: Collection = studies
/** Progressions in one key, on Practice (roadmap §3.9). */
export const PROGRESSIONS: Collection = progressions
/** Every collection, in `COLLECTION_IDS` order. */
export const COLLECTIONS: readonly Collection[] = [...SONG_COLLECTIONS, STUDIES, PROGRESSIONS]
```

`selectors.ts`:

```ts
const SONG_COLLECTION_IDS: ReadonlySet<string> = new Set(SONG_COLLECTIONS.map((c) => c.id))

/** Whether a value names one of the collections Songs lists. */
export const isSongCollectionId = (value: unknown): value is CollectionId =>
  typeof value === 'string' && SONG_COLLECTION_IDS.has(value)
```

`catalog.test.ts`: the collection-order expectation becomes the new order.

`ui/PieceLink.tsx`:

```tsx
import { Link } from '@tanstack/react-router'
import type { ComponentProps } from 'react'
import type { Entry } from '../model/types'

/** The way to an entry's page, on its shelf: a song or listing on Songs, a study or progression on Practice. */
export function PieceLink({
  entry,
  ...props
}: { entry: Pick<Entry, 'id' | 'kind'> } & Omit<ComponentProps<'a'>, 'href'>) {
  const params = { pieceId: entry.id }
  switch (entry.kind) {
    case 'study':
      return <Link to="/practice/studies/$pieceId" params={params} {...props} />
    case 'progression':
      return <Link to="/practice/progressions/$pieceId" params={params} {...props} />
    case 'song':
    case 'listing':
      return <Link to="/songs/$pieceId" params={params} {...props} />
  }
}
```

`index.ts`: export `SONG_COLLECTIONS`, `STUDIES`, `PROGRESSIONS`, `isSongCollectionId`, `PieceLink`.

- [ ] **Step 4: Routes, pages and links**

`router.tsx`: `const practiceScreens = () => import('./routes/practice-screens')`; the songs piece route's
`beforeLoad` becomes

```ts
    const { entryById } = await songsScreens()
    const entry = entryById(params.pieceId)
    if (entry?.kind !== 'song' && entry?.kind !== 'listing') throw notFound()
```

and new shell routes

```ts
const practiceRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/practice',
  component: lazyRouteComponent(practiceScreens, 'PracticePage'),
})
const studyRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/practice/studies/$pieceId',
  beforeLoad: async ({ params }) => {
    const { pieceById } = await songsScreens()
    if (pieceById(params.pieceId)?.kind !== 'study') throw notFound()
  },
  component: lazyRouteComponent(songsScreens, 'PiecePage'),
})
const progressionRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/practice/progressions/$pieceId',
  beforeLoad: async ({ params }) => {
    const { pieceById } = await songsScreens()
    if (pieceById(params.pieceId)?.kind !== 'progression') throw notFound()
  },
  component: lazyRouteComponent(songsScreens, 'PiecePage'),
})
```

added to the shell's children. `songs-screens.ts` also exports `pieceById`. `practice-screens.ts`:
`export { PracticePage } from '@/pages/practice'`.

`PiecePage.tsx`: `const { pieceId } = useParams({ strict: false })`, `const entry = pieceId ? entryById(pieceId) : undefined`.

`PieceFacts.tsx`: Back falls back to the entry's shelf:

```ts
  const toSongs = useGoBack({ to: '/songs' })
  const toPractice = useGoBack({ to: '/practice' })
  const back = entry.kind === 'study' || entry.kind === 'progression' ? toPractice : toSongs
```

(docstring: "Back returns where the learner came from, or to the entry's shelf, Songs or Practice.")

`PlayerTopBar.tsx`: Close falls back to the piece's page:

```ts
  const params = { pieceId: piece.id }
  const closeTo = {
    song: useGoBack({ to: '/songs/$pieceId', params }),
    study: useGoBack({ to: '/practice/studies/$pieceId', params }),
    progression: useGoBack({ to: '/practice/progressions/$pieceId', params }),
  }
  const close = closeTo[piece.kind]
```

(Three `useGoBack` calls in a fixed order each render: hooks rules hold. Each is a closure over the router.)

`EntryRow.tsx`: `<PieceLink entry={entry} className="…">` in place of the `/songs/$pieceId` `Link`.
`PieceList.tsx`: each section gets `aria-labelledby` its heading when it has one (`useId` per group moves into a
small `PieceGroupSection` component in the same file, or give each `h2` an id from the group id:
`id={`pieces-${group.id}`}`); docstring "Pieces by collection, each under its heading while more than one shows."
`StepRow.tsx`: the piece branch becomes

```tsx
      {step.kind === 'piece' ? (
        <PieceLink entry={pieceById(step.pieceId) ?? { id: step.pieceId, kind: 'song' }} className={ROW_LINK}>
          {body}
        </PieceLink>
      ) : (
```

(The path's content test already holds every step to a piece that is there; the fallback only keeps the types honest
for a stale id, which then shows not found.)

`SongsPage.tsx`: groups from `SONG_COLLECTIONS`; the level choices are the levels its songs are on:

```ts
const SONG_LEVELS = LEVELS.filter((level) =>
  SONG_COLLECTIONS.some((c) => c.entries.some((entry) => levelOfEntry(entry) === level)),
)
```

and the two filters are pop-ups in a row:

```tsx
        <div className="flex flex-wrap gap-2">
          <Dropdown<CollectionId | 'all'>
            label={t('songs:collection')}
            value={search.collection}
            options={[
              { value: 'all', label: t('songs:all') },
              ...SONG_COLLECTIONS.map((c) => ({ value: c.id, label: localText(c.name, locale) })),
            ]}
            onChange={(collection) => set({ collection })}
          />
          {SONG_LEVELS.length > 1 ? (
            <Dropdown<Level | 'any'>
              label={t('songs:level')}
              value={search.level}
              options={[
                { value: 'any', label: t('songs:anyLevel') },
                ...SONG_LEVELS.map((level) => ({
                  value: level,
                  label: t(`common:levelName.${LEVEL_NAME[level]}`),
                })),
              ]}
              onChange={(level) => set({ level })}
            />
          ) : null}
        </div>
```

Strings (`songs`): `collections` → `collection: 'Collection'` (ru `Сборник`), `levels` → `level: 'Level'`
(ru `Уровень`), `anyLevel: 'Any'` (ru `Любой`), `all: 'All'` (ru as it is).

`search.ts`: `const isCollection = (value: unknown): value is CollectionId | 'all' => value === 'all' || isSongCollectionId(value)`.

`src/pages/practice/ui/PracticePage.tsx`:

```tsx
import { useTranslation } from 'react-i18next'
import { PROGRESSIONS, STUDIES } from '@/entities/piece'
import { localText, useLocale } from '@/shared/i18n'
import { ScreenHeader } from '@/shared/ui'
import { PieceList } from '@/widgets/piece-list'

/** Practice: the studies and progressions, each opening its page here. */
export function PracticePage() {
  const { t } = useTranslation('practice')
  const locale = useLocale()
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader title={t('title')} />
      <PieceList
        groups={[STUDIES, PROGRESSIONS].map((collection) => ({
          id: collection.id,
          heading: localText(collection.name, locale),
          entries: collection.entries,
        }))}
      />
    </div>
  )
}
```

`src/pages/practice/index.ts`: `export { PracticePage } from './ui/PracticePage'`.

i18n: `practice.ts` (en `{ title: 'Practice' } as const`; ru `{ title: 'Практика' }` typed
`LocaleResources['practice']`), registered in `NAMESPACES` and both `locales/*/index.ts`; `common.nav.practice`
(`Practice`, `Практика`).

`AppNav.tsx`: add `{ to: '/practice', label: 'nav.practice', icon: Metronome, exact: false }` after Theory (Task 7
reorders).

Router test "offers … in the main navigation" expects `['Path', 'Songs', 'Theory', 'Practice']` for now.

- [ ] **Step 5: Run everything**

Run: `npm run typecheck && npm run lint && npm run test && npm run build`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
npx prettier --write $(git diff --name-only; git ls-files --others --exclude-standard)
git add -A src
git commit -m "Keep songs on Songs and put studies and progressions on Practice, each page on its own shelf"
```

---

### Task 7: Learn replaces Theory; the quiz moves to Practice

**Files:**
- Create: `src/shared/i18n/locales/{en,ru}/music.ts`, `src/shared/i18n/locales/{en,ru}/learn.ts`
- Delete: `src/shared/i18n/locales/{en,ru}/theory.ts`, `src/app/TheoryLayout.tsx`, `src/widgets/theory-nav/`,
  `src/pages/theory-symbols/`, `src/app/routes/theory-screens.ts`
- Move: `src/pages/theory-chords` → `src/pages/chords` (`ChordsPage`), `src/pages/theory-scales` → `src/pages/scales`
  (`ScalesPage`)
- Create: `src/pages/learn/{index.ts,ui/LearnPage.tsx,ui/LearnPage.test.tsx}`,
  `src/pages/lesson/{index.ts,ui/LessonPage.tsx,ui/LessonPage.test.tsx}`, `src/app/routes/learn-screens.ts`
- Modify: `src/app/router.tsx`, `src/app/routes/search.ts`, `src/app/routes/practice-screens.ts`,
  `src/pages/theory-quiz/ui/TheoryQuizPage.tsx`, `src/pages/practice/ui/PracticePage.tsx`,
  `src/widgets/app-nav/ui/AppNav.tsx`, `src/widgets/chord-explorer/ui/ChordExplorer.tsx`,
  `src/entities/path/ui/ExplorerLink.tsx`, `src/pages/piece/ui/PieceFacts.tsx`, `src/pages/check/ui/CheckResult.tsx`,
  `src/widgets/piece-skills/ui/PieceSkills.tsx`, every `theory:` user (below), `src/features/quiz/index.ts`
  (`isTheoryQuiz`), `src/app/architecture.test.ts`
- Test: `src/app/router.test.tsx`, `src/app/routes/search.test.ts`, the moved page tests,
  `src/pages/theory-quiz/ui/TheoryQuizPage.test.tsx`, `src/pages/practice/ui/PracticePage.test.tsx`,
  `src/pages/check/ui/CheckPage.test.tsx`

**Interfaces:**
- Consumes: `LessonView`, `lessonById`, `LESSONS`, `LEVEL_NAME` (Task 5); `RowLink`, `RowGroup`, `Dropdown` (Task 4);
  `PieceList`, `STUDIES`, `PROGRESSIONS` (Task 6).
- Produces: routes `/learn`, `/learn/chords`, `/learn/scales`, `/learn/lessons/$lessonId`, `/practice/quiz/$quiz`;
  i18n namespaces `music`, `learn`, `practice` (`theory` gone); `isTheoryQuiz(value: unknown): value is TheoryQuiz`.

- [ ] **Step 1: Write the failing tests**

`router.test.tsx`: `ROUTES` loses the four `/theory/*` rows and gains
`['/learn', '/learn'], ['/learn/chords', '/learn/chords'], ['/learn/scales', '/learn/scales'],
['/learn/lessons/reading-chord-symbols', '/learn/lessons/$lessonId'], ['/practice/quiz/build-chord', '/practice/quiz/$quiz']`;
the stale-param rows use `/learn/chords?step=scale:major` and `/learn/scales?step=chords:tri`; "sends /theory to
Chords" is replaced by

```ts
  it.each(['/theory', '/theory/chords', '/learn/lessons/nothing', '/practice/quiz/nothing'])(
    'shows not found at %s',
    async (path) => {
      await renderApp(path)
      expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
    },
  )
```

the nav test expects `['Path', 'Songs', 'Learn', 'Practice']`; "marks Theory current…" becomes "marks Learn current on
a reference" (`/learn/scales`) and "marks Practice current on a quiz" (`/practice/quiz/gaps`); "opens a deep link to a
Theory section with its tab selected" goes (there are no tabs).

`search.test.ts`: `/theory/…` URLs become `/learn/…`; `QUIZ_DEFAULTS` and its row go.

`src/pages/learn/ui/LearnPage.test.tsx`:

```tsx
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'

describe('Learn', () => {
  it('lists the lessons with their level and category, and the references', async () => {
    await renderApp('/learn')
    const lessons = await screen.findByRole('region', { name: 'Lessons' })
    expect(
      within(lessons).getByRole('link', { name: 'How to read chord symbols Beginner · Chords' }),
    ).toHaveAttribute('href', '/learn/lessons/reading-chord-symbols')
    const references = screen.getByRole('region', { name: 'References' })
    expect(within(references).getByRole('link', { name: 'Chords' })).toHaveAttribute('href', '/learn/chords')
    expect(within(references).getByRole('link', { name: 'Scales' })).toHaveAttribute('href', '/learn/scales')
  })

  it('opens a reference and comes back', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/learn')
    await user.click(await screen.findByRole('link', { name: 'Scales' }))
    expect(await screen.findByRole('heading', { level: 1, name: 'Scales' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Back' }))
    expect(await screen.findByRole('heading', { level: 1, name: 'Learn' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/learn')
  })

  it('speaks Russian', async () => {
    await renderApp('/learn', { locale: 'ru' })
    expect(await screen.findByRole('heading', { level: 1, name: 'Обучение' })).toBeInTheDocument()
  })
})
```

`src/pages/lesson/ui/LessonPage.test.tsx`:

```tsx
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'

describe('A lesson', () => {
  it('shows its title and summary over its sections', async () => {
    await renderApp('/learn/lessons/reading-chord-symbols')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'How to read chord symbols' }),
    ).toBeInTheDocument()
    expect(screen.getByText(/what its numbers mean/)).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Naming any chord in 7 steps' })).toBeInTheDocument()
  })

  it('goes back to Learn when it was opened directly', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/learn/lessons/reading-chord-symbols')
    await user.click(await screen.findByRole('button', { name: 'Back' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/learn'))
  })
})
```

`PracticePage.test.tsx` adds

```tsx
  it('offers the four quizzes, and My gaps says how many gaps there are', async () => {
    const { progressStore } = await renderApp('/practice')
    const quiz = await screen.findByRole('region', { name: 'Theory quiz' })
    expect(within(quiz).getAllByRole('link').map((link) => link.getAttribute('href'))).toEqual([
      '/practice/quiz/build-chord',
      '/practice/quiz/name-chord',
      '/practice/quiz/build-scale',
      '/practice/quiz/gaps',
    ])
    expect(progressStore).toBeDefined()
  })
```

and, for the gaps count, a test that records a wrong answer first (use the feature command the quiz tests use,
`recordAnswer(progressStore, 'chord:m7', false)` from `@/features/record-answer`) then renders `/practice` and
expects the My gaps row named `My gaps Gaps: 1`.

`TheoryQuizPage.test.tsx`: open `/practice/quiz/<mode>`; the title is the quiz's name
(`heading level 1 'Build chord'`); no "Quiz mode" group; "Whole quiz" from My gaps lands on
`/practice/quiz/build-chord`.

Moved page tests: `TheoryChordsPage.test.tsx` → `src/pages/chords/ui/ChordsPage.test.tsx` and
`TheoryScalesPage.test.tsx` → `src/pages/scales/ui/ScalesPage.test.tsx`, paths `/learn/…`, the describe names
`Learn → Chords` / `Learn → Scales`. Chords' chip clicks become pop-up choices:

```ts
    await user.click(screen.getByRole('combobox', { name: 'Chord' }))
    await user.click(await screen.findByRole('option', { name: 'Minor 7th m7' }))
```

and a new test:

```ts
  it('writes the chord every way it is written', async () => {
    await renderApp('/learn/chords?root=C&quality=m7')
    expect(await screen.findByText('Cm7 · Cmin7 · C-7')).toBeInTheDocument()
  })
```

(Take the expected spellings from `qualitySpellings('m7')` if they differ; the test pins what the kernel says.)

`CheckPage.test.tsx`: its "Open in Chords" link expectation becomes `/learn/chords?…`.

- [ ] **Step 2: Run to see them fail**

Run: `npx vitest run src/app src/pages`
Expected: FAIL.

- [ ] **Step 3: Split the strings**

`locales/en/music.ts`: `export const music = { … } as const` holding, moved word for word from `en/theory.ts`: `major`,
`inversion`, `family`, `quality`, `scaleKind`, `scaleName`, `gap` (with their comments). `locales/ru/music.ts`
the same blocks from `ru/theory.ts`, typed `LocaleResources['music']`.

`locales/en/learn.ts`:

```ts
export const learn = {
  title: 'Learn',
  lessons: 'Lessons',
  references: 'References',
  category: {
    chords: 'Chords',
    scales: 'Scales',
    theory: 'Theory',
    accompaniment: 'Accompaniment',
    jazz: 'Jazz',
    gospel: 'Gospel',
  },
  chords: 'Chords',
  scales: 'Scales',
  root: 'Root',
  chordLabel: 'Chord',
  scaleLabel: 'Scale',
  inversionLabel: 'Inversion',
  handsLabel: 'Hands',
  play: 'Play',
  arpeggio: 'Arpeggio',
  // The ways a chord symbol is written on this root.
  written: 'Written',
  checkYourself: 'Check yourself',
  fingers: { label: 'Fingers', none: 'None' },
  fingering: { note: 'Note', rh: 'RH', lh: 'LH', none: 'No standard fingering is taught for this scale.' },
  practice: 'Practice',
  rhythmLabel: 'Rhythm',
  rhythm: {
    even: 'Even',
    'long-short': 'Long, short',
    'short-long': 'Short, long',
    'long-short-short-short': 'Long, 3 short',
    'short-short-short-long': '3 short, long',
  },
  tempo: 'Tempo',
  bpm: '{{tempo}} BPM',
  together: 'Together',
  playUpDown: 'Play up and down',
  chordsIn: 'Chords in this scale',
  chordSize: { label: 'Chord size', triads: 'Triads', sevenths: '7ths' },
  about: { formula: 'Formula', gaps: 'Structure', relative: 'Relative' },
} as const
```

`locales/ru/learn.ts`: the same keys: `title: 'Обучение'`, `lessons: 'Уроки'`, `references: 'Справочник'`,
`category` (`Аккорды`, `Гаммы`, `Теория`, `Аккомпанемент`, `Джаз`, `Госпел`), `chords: 'Аккорды'`,
`scales: 'Гаммы'`, `chordLabel: 'Аккорд'`, `written: 'Пишется'`, `chordSize.label: 'Размер аккорда'`, and every
other value as `ru/theory.ts` has it.

`locales/*/practice.ts` gain `quiz` (`Theory quiz` / `Тест по теории`) and `gaps` (`Gaps: {{count}}` /
`Пробелы: {{count}}`). `quiz.modes.label` goes from both `quiz.ts` files. `common.nav`: `theory` goes; `learn`
(`Learn` / `Обучение`) joins. `NAMESPACES`: `common, path, songs, piece, player, music, learn, practice, quiz,
settings`; both `locales/*/index.ts` likewise; delete both `theory.ts`.

Repoint every user (`grep -rn "theory" src --include=*.ts --include=*.tsx` must end empty but for
`pages/theory-quiz` and `THEORY_QUIZZES`/`TheoryQuiz`/`theoryQuizConfig`/`isTheoryQuiz`):
`use-step-title.ts` and `use-scale-name.ts` → `useTranslation('music')`; `QuizBoard.tsx` →
`['quiz', 'music', 'common']`, `music:quality.*`; `QuizChoiceSheet.tsx` → `music:family.*`, `music:scaleKind.*`;
`PieceSkills.tsx` → `music:quality.*`, `music:major`; `CheckResult.tsx` → `music:quality.*`,
`music:scaleKind.*`; `StepPanel.tsx` → `learn:checkYourself`; `ChordExplorer.tsx`, `ScaleExplorer.tsx`,
`ScaleChords.tsx`, `ScaleFacts.tsx`, `FingeringTable.tsx` → `learn:*` for screen words and `music:*` for
`family`, `quality`, `inversion`, `scaleKind`, `gap`, `major`.

- [ ] **Step 4: Routes and screens**

`router.tsx`: remove `theoryRoute` and its four children, the `TheoryLayout` import and `redirect`;
`const learnScreens = () => import('./routes/learn-screens')`; the `/check` route's `beforeLoad` imports
`practiceScreens`; new shell routes:

```ts
const learnRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/learn',
  component: lazyRouteComponent(learnScreens, 'LearnPage'),
})
const chordsRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/learn/chords',
  validateSearch: validateChordsSearch,
  search: { middlewares: [stripSearchParams(CHORDS_DEFAULTS)] },
  component: lazyRouteComponent(learnScreens, 'ChordsPage'),
})
const scalesRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/learn/scales',
  validateSearch: validateScalesSearch,
  search: { middlewares: [stripSearchParams(SCALES_DEFAULTS)] },
  component: lazyRouteComponent(learnScreens, 'ScalesPage'),
})
const lessonRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/learn/lessons/$lessonId',
  beforeLoad: async ({ params }) => {
    const { lessonById } = await learnScreens()
    if (!lessonById(params.lessonId)) throw notFound()
  },
  component: lazyRouteComponent(learnScreens, 'LessonPage'),
})
const quizRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: '/practice/quiz/$quiz',
  beforeLoad: async ({ params }) => {
    const { isTheoryQuiz } = await practiceScreens()
    if (!isTheoryQuiz(params.quiz)) throw notFound()
  },
  component: lazyRouteComponent(practiceScreens, 'TheoryQuizPage'),
})
```

`learn-screens.ts`:

```ts
export { lessonById } from '@/entities/lesson'
export { ChordsPage } from '@/pages/chords'
export { LearnPage } from '@/pages/learn'
export { LessonPage } from '@/pages/lesson'
export { ScalesPage } from '@/pages/scales'
```

`practice-screens.ts`:

```ts
export { checkPlan, isTheoryQuiz } from '@/features/quiz'
export { CheckPage } from '@/pages/check'
export { PracticePage } from '@/pages/practice'
export { TheoryQuizPage } from '@/pages/theory-quiz'
```

`features/quiz/theory-quizzes.ts`: `export const isTheoryQuiz = isOneOf(THEORY_QUIZZES)` (docstring "Whether a value
names one of Practice's Theory quizzes"), exported from the barrel.

`search.ts`: the Quiz block goes; section comments read `// Learn → Chords` and `// Learn → Scales`.

`AppNav.tsx`: ITEMS are Path (`Route`), Songs (`Music`), Learn (`BookOpen`, `/learn`), Practice (`Metronome`,
`/practice`); comment "The four places."

`ExplorerLink.tsx`, `PieceFacts.tsx`, `CheckResult.tsx`, `PieceSkills.tsx`, `ScaleFacts.tsx`: `/theory/chords` →
`/learn/chords`, `/theory/scales` → `/learn/scales` (and `from="/learn/scales"`).

`git mv src/pages/theory-chords src/pages/chords` and `git mv src/pages/theory-scales src/pages/scales`; rename the
files and components to `ChordsPage` / `ScalesPage`. Each page draws its header:

```tsx
export function ChordsPage() {
  const { t } = useTranslation(['learn', 'common'])
  const { step, ...chord } = useSearch({ from: '/shell/learn/chords' })
  const navigate = useNavigate({ from: '/learn/chords' })
  const back = useGoBack({ to: '/learn' })
  const onChange = (change: Partial<ChordView>) =>
    void navigate({ search: (prev) => ({ ...prev, ...change }), replace: true })
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title={t('learn:chords')}
        back={<RoundButton label={t('common:back')} icon={ArrowLeft} onClick={back} />}
      />
      {step ? <StepPanel step={step} /> : null}
      <ChordExplorer chord={chord} onChange={onChange} />
    </div>
  )
}
```

(`ScalesPage` the same with `/shell/learn/scales`, `learn:scales`, `ScaleExplorer`.)

`src/pages/learn/ui/LearnPage.tsx`:

```tsx
import { Link } from '@tanstack/react-router'
import { BookOpenText, ChartNoAxesColumnIncreasing, KeyboardMusic } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { LESSONS } from '@/entities/lesson'
import { LEVEL_NAME } from '@/entities/path'
import { localText, useLocale } from '@/shared/i18n'
import { RowGroup, RowLink, ScreenHeader } from '@/shared/ui'

/** Learn: the lessons, then the references to look things up in. */
export function LearnPage() {
  const { t } = useTranslation(['learn', 'common'])
  const locale = useLocale()
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader title={t('learn:title')} />
      <div className="flex flex-col gap-8 lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-10">
        <RowGroup title={t('learn:lessons')}>
          {LESSONS.map((lesson) => (
            <li key={lesson.id}>
              <RowLink
                title={localText(lesson.title, locale)}
                detail={`${t(`common:levelName.${LEVEL_NAME[lesson.level]}`)} · ${t(`learn:category.${lesson.category}`)}`}
                icon={BookOpenText}
                paint="grass"
                render={<Link to="/learn/lessons/$lessonId" params={{ lessonId: lesson.id }} />}
              />
            </li>
          ))}
        </RowGroup>
        <RowGroup title={t('learn:references')}>
          <li>
            <RowLink title={t('learn:chords')} icon={KeyboardMusic} paint="sand" render={<Link to="/learn/chords" />} />
          </li>
          <li>
            <RowLink
              title={t('learn:scales')}
              icon={ChartNoAxesColumnIncreasing}
              paint="sky"
              render={<Link to="/learn/scales" />}
            />
          </li>
        </RowGroup>
      </div>
    </div>
  )
}
```

`src/pages/lesson/ui/LessonPage.tsx`:

```tsx
import { useParams } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { lessonById } from '@/entities/lesson'
import { localText, useLocale } from '@/shared/i18n'
import { useGoBack } from '@/shared/lib'
import { RoundButton, ScreenHeader } from '@/shared/ui'
import { LessonView } from '@/widgets/lesson-view'

/** A lesson: its title and summary, then the lesson itself. */
export function LessonPage() {
  const { t } = useTranslation('common')
  const locale = useLocale()
  const { lessonId } = useParams({ from: '/shell/learn/lessons/$lessonId' })
  const back = useGoBack({ to: '/learn' })
  const lesson = lessonById(lessonId)
  if (!lesson) return null
  return (
    <div className="flex flex-col gap-4">
      <ScreenHeader
        title={localText(lesson.title, locale)}
        back={<RoundButton label={t('back')} icon={ArrowLeft} onClick={back} />}
      />
      <p className="-mt-3 max-w-prose text-lg text-muted-foreground">{localText(lesson.summary, locale)}</p>
      <LessonView key={lesson.id} lesson={lesson} />
    </div>
  )
}
```

`TheoryQuizPage.tsx`: the page reads its quiz from the path and draws its header; the rest is today's page without
the mode `Segmented`:

```tsx
export function TheoryQuizPage() {
  const { quiz } = useParams({ from: '/shell/practice/quiz/$quiz' })
  return isTheoryQuiz(quiz) ? <QuizScreen key={quiz} quiz={quiz} /> : null
}

function QuizScreen({ quiz }: { quiz: TheoryQuiz }) {
  const { t } = useTranslation(['quiz', 'common'])
  const navigate = useNavigate()
  const back = useGoBack({ to: '/practice' })
  const stats = useProgress(selectQuizStats)
  const toWholeQuiz = () =>
    void navigate({ to: '/practice/quiz/$quiz', params: { quiz: 'build-chord' }, replace: true })
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title={t(`quiz:modes.${quiz}`)}
        back={<RoundButton label={t('common:back')} icon={ArrowLeft} onClick={back} />}
      />
      {quiz === 'gaps' ? <GapsQuiz onWholeQuiz={toWholeQuiz} /> : <ChoiceQuiz mode={quiz} />}
      {/* the stats and the choice sheet, as today */}
    </div>
  )
}
```

(Write the stats `dl` and `QuizChoiceSheet` as the current file has them; nothing else changes.)

`PracticePage.tsx`: the Theory quiz group before the pieces:

```tsx
const QUIZ_ROWS = [
  { quiz: 'build-chord', icon: KeyboardMusic, paint: 'sand' },
  { quiz: 'name-chord', icon: Ear, paint: 'sand' },
  { quiz: 'build-scale', icon: ChartNoAxesColumnIncreasing, paint: 'sky' },
  { quiz: 'gaps', icon: Target, paint: 'lilac' },
] as const satisfies readonly { quiz: TheoryQuiz; icon: LucideIcon; paint: Paint }[]
```

and in the component

```tsx
  const answers = useProgress(selectAllAnswers)
  const practised = useProgress(selectPractised)
  const gaps = useMemo(() => myGaps(answers, practised).length, [answers, practised])
  …
      <div className="flex flex-col gap-8 lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-10">
        <RowGroup title={t('practice:quiz')}>
          {QUIZ_ROWS.map(({ quiz, icon, paint }) => (
            <li key={quiz}>
              <RowLink
                title={t(`quiz:modes.${quiz}`)}
                detail={quiz === 'gaps' && gaps > 0 ? t('practice:gaps', { count: gaps }) : undefined}
                icon={icon}
                paint={paint}
                render={<Link to="/practice/quiz/$quiz" params={{ quiz }} />}
              />
            </li>
          ))}
        </RowGroup>
        <PieceList groups={…as in Task 6…} />
      </div>
```

`ChordExplorer.tsx`: the three `ChipRow`s become two pop-ups in a row:

```tsx
        <div className="flex flex-wrap gap-2">
          <Dropdown
            label={t('learn:root')}
            value={chord.root}
            options={PITCH_CLASSES.map((pc) => {
              const spelled = chordRootSpelling(pc, chord.quality)
              return { value: noteParam(spelled), label: noteName(spelled) }
            })}
            onChange={(root) => change({ root })}
          />
          <Dropdown
            label={t('learn:chordLabel')}
            value={chord.quality}
            groups={CHORD_FAMILIES.map((family) => ({
              label: t(`music:family.${family}`),
              options: qualitiesIn(family).map((quality) => ({
                value: quality,
                label: t(`music:quality.${quality}`),
                detail: qualitySuffix(quality) || t('music:major'),
              })),
            }))}
            onChange={(quality) => change({ quality, inversion: 0 })}
          />
        </div>
```

(`chordFamily` and `family` go.) After the Play and Arpeggio buttons, the *Written* line:

```tsx
        <p className="flex flex-wrap items-baseline gap-x-4">
          <span className="text-muted-foreground">{t('learn:written')}</span>
          <span className="font-display text-xl font-semibold">
            {qualitySpellings(chord.quality)
              .map((suffix) => noteName(root) + suffix)
              .join(' · ')}
          </span>
        </p>
```

`architecture.test.ts`: the same-layer example imports `PieceList` from `@/widgets/piece-list` into
`src/widgets/app-nav/ui/Example.tsx`.

Delete `TheoryLayout.tsx`, `widgets/theory-nav`, `pages/theory-symbols` (page, `QualityRow`, `ReadingSheet`, test) and
`routes/theory-screens.ts`.

- [ ] **Step 5: Run everything**

Run: `npm run typecheck && npm run lint && npm run test && npm run build`
Expected: PASS; `grep -rn "/theory\|TheoryNav\|TheoryLayout\|theory-symbols\|'theory'\|theory:" src` finds nothing.

- [ ] **Step 6: Commit**

```bash
npx prettier --write $(git diff --name-only; git ls-files --others --exclude-standard)
git add -A src
git commit -m "Replace Theory with Learn, its first lesson and two references, and move the quiz to Practice"
```

---

### Task 8: The Scales reference: Scale view and Chords view

**Files:**
- Modify: `src/widgets/scale-explorer/model/scale-view.ts`, `src/widgets/scale-explorer/ui/ScaleExplorer.tsx`,
  `src/widgets/scale-explorer/index.ts`, `src/app/routes/search.ts`, `src/shared/i18n/locales/{en,ru}/learn.ts`
- Create: `src/widgets/scale-explorer/model/scale-keys.ts` (+ `.test.ts`),
  `src/widgets/scale-explorer/model/use-heard-note.ts`, `src/widgets/scale-explorer/ui/KeyChords.tsx`,
  `src/widgets/scale-explorer/ui/ScalePractice.tsx`
- Delete: `src/widgets/scale-explorer/ui/ScaleChords.tsx`
- Test: `src/pages/scales/ui/ScalesPage.test.tsx`, `src/app/routes/search.test.ts`

**Interfaces:**
- Consumes: `placeScaleChords`, `PlacedScaleChord`, `chordHolds`, `scaleHasChords` (Task 1); `ExplorerKeyboard`
  (`range`, `keyPlays`, `outlined`, `onKeyPress`) and `useMidiKeyDown` (Task 3); `Dropdown` (Task 4).
- Produces: `ScaleView` gains `show: 'scale' | 'chords'` and `keysPlay: 'chords' | 'notes'`; model functions
  `scaleMarks(placed, fingering)`, `chordMarks(chords)`, `chordKeyPlays(chords)`, `chordsHolding(chords, note)`,
  `heardName(note, tones)`; hook `useHeardNote(listening, context)`.

- [ ] **Step 1: Write the failing tests**

`scale-keys.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import {
  midi,
  note,
  placeScale,
  placeScaleChords,
  scaleFingering,
  spellScale,
} from '@/shared/lib/music'
import { chordKeyPlays, chordMarks, chordsHolding, heardName, scaleMarks } from './scale-keys'

const C = note('C')
const TRIADS = placeScaleChords(C, 'major', 3)

describe('scaleMarks', () => {
  it('marks the tonic and the other degrees, with a hand’s fingers under them', () => {
    const marks = scaleMarks(placeScale(C, 'major'), scaleFingering(0 as never, 'major', 'rh'))
    expect(marks.get(midi(60))).toEqual({ tone: 'tonic', label: '1', finger: 1 })
    expect(marks.get(midi(65))).toEqual({ tone: 'scale', label: '4', finger: 1 })
  })

  it('marks without fingers when none are asked for', () => {
    expect(scaleMarks(placeScale(C, 'major'), null).get(midi(62))).toEqual({ tone: 'scale', label: '2' })
  })
})

describe('chordMarks', () => {
  it('puts each degree’s numeral over its chord on its key', () => {
    const marks = chordMarks(TRIADS)
    expect(marks.get(midi(60))).toEqual({ tone: 'tonic', label: 'C', caption: 'I' })
    expect(marks.get(midi(62))).toEqual({ tone: 'scale', label: 'Dm', caption: 'ii' })
    expect(marks.size).toBe(7)
  })
})

describe('chordKeyPlays', () => {
  it('plays a degree’s chord from its key, and any other key alone', () => {
    const plays = chordKeyPlays(TRIADS)
    expect(plays(midi(62))).toEqual([62, 65, 69])
    expect(plays(midi(61))).toEqual([61])
    expect(plays(midi(72))).toEqual([72])
  })
})

describe('chordsHolding', () => {
  it('finds the chords that hold a note, in any octave', () => {
    expect(chordsHolding(TRIADS, midi(64)).map((c) => c.roman)).toEqual(['I', 'iii', 'vi'])
    expect(chordsHolding(TRIADS, midi(76)).map((c) => c.roman)).toEqual(['I', 'iii', 'vi'])
  })

  it('finds none for a note outside the scale', () => {
    expect(chordsHolding(TRIADS, midi(61))).toEqual([])
  })
})

describe('heardName', () => {
  it('spells a note of the scale as the scale does, any other with a sharp', () => {
    const f = spellScale(note('F'), 'major')
    expect(heardName(midi(70), f)).toBe('B♭')
    expect(heardName(midi(66), f)).toBe('F♯')
  })
})
```

(For the fingering argument use `scaleFingering(pitchClassOf(C), 'major', 'rh')`; the `0 as never` above is not
allowed by the constraints: write it with `pitchClassOf`.)

`search.test.ts`:

```ts
  it('read the Scales view, falling back to the scale view where a scale has no chords', async () => {
    expect(SCALES_DEFAULTS).toMatchObject({ show: 'scale', keysPlay: 'chords' })
    expect(await searchAt('/learn/scales?show=chords&keysPlay=notes')).toMatchObject({
      show: 'chords',
      keysPlay: 'notes',
    })
    expect(await searchAt('/learn/scales?kind=blues&show=chords')).toMatchObject({ show: 'scale' })
    expect(await searchAt('/learn/scales?show=x&keysPlay=x')).toMatchObject({
      show: 'scale',
      keysPlay: 'chords',
    })
  })
```

`ScalesPage.test.tsx` (the existing tests keep their assertions on `/learn/scales`; the two about "chords of the
scale" move to Chords view; these are added):

```tsx
  it('chooses the root and the scale from pop-up buttons', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/learn/scales')
    await user.click(await screen.findByRole('combobox', { name: 'Root' }))
    await user.click(await screen.findByRole('option', { name: 'E♭' }))
    await user.click(screen.getByRole('combobox', { name: 'Scale' }))
    await user.click(await screen.findByRole('option', { name: 'Harmonic minor' }))
    expect(router.state.location.search).toMatchObject({ root: 'Eb', kind: 'harmonic' })
  })

  it('shows each degree’s numeral over its chord in Chords view', async () => {
    const user = userEvent.setup()
    await renderApp('/learn/scales')
    await user.click(await screen.findByRole('button', { name: 'Chords' }))
    const keyboard = screen.getByRole('group', { name: 'Keyboard' })
    expect(within(keyboard).getByRole('button', { name: 'D4' })).toHaveTextContent('iiDm')
    expect(within(keyboard).getByRole('button', { name: 'C4' })).toHaveClass('bg-key-tonic')
  })

  it('plays a degree’s chord from its key and holds the chord’s keys down', async () => {
    const { audio } = await renderApp('/learn/scales?show=chords')
    const keyboard = await screen.findByRole('group', { name: 'Keyboard' })
    fireEvent.pointerDown(within(keyboard).getByRole('button', { name: 'D4' }), { pointerId: 1 })
    expect(notes(audio.played.at(-1)?.sounds ?? [])).toEqual([62, 65, 69])
    expect(within(keyboard).getByRole('button', { name: 'A4' })).toHaveAttribute('data-down')
  })

  it('plays a chord of the list from its degree’s key, pressed while it sounds', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/learn/scales?root=A&show=chords&chords=4')
    const iii = await screen.findByRole('button', { name: /^C♯m7/ })
    await user.click(iii)
    expect(notes(audio.played.at(-1)?.sounds ?? [])).toEqual([73, 76, 80, 83])
    expect(iii).toHaveAttribute('aria-pressed', 'true')
  })

  it('in Notes, outlines and names the chords that hold the note a key plays', async () => {
    const { audio } = await renderApp('/learn/scales?show=chords&keysPlay=notes')
    const keyboard = await screen.findByRole('group', { name: 'Keyboard' })
    fireEvent.pointerDown(within(keyboard).getByRole('button', { name: 'E4' }), { pointerId: 1 })
    expect(notes(audio.played.at(-1)?.sounds ?? [])).toEqual([64])
    expect(screen.getByText('E is in C, Em, and Am')).toBeInTheDocument()
    for (const name of ['C4', 'E4', 'A4'])
      expect(within(keyboard).getByRole('button', { name })).toHaveClass('ring-ring')
    expect(screen.getByRole('button', { name: /^Em/ })).toHaveAttribute('data-holds')
    expect(screen.getByRole('button', { name: /^Dm/ })).not.toHaveAttribute('data-holds')
  })

  it('in Notes, hears a MIDI key too, and says when no chord holds a note', async () => {
    const { midi: keyboard } = await renderApp('/learn/scales?show=chords&keysPlay=notes')
    await screen.findByRole('group', { name: 'Keyboard' })
    act(() => keyboard.press(midi(61)))
    expect(screen.getByText('No chord of the scale holds C♯')).toBeInTheDocument()
  })

  it('forgets the note when the scale changes', async () => {
    const user = userEvent.setup()
    await renderApp('/learn/scales?show=chords&keysPlay=notes')
    const keyboard = await screen.findByRole('group', { name: 'Keyboard' })
    fireEvent.pointerDown(within(keyboard).getByRole('button', { name: 'E4' }), { pointerId: 1 })
    await user.click(screen.getByRole('button', { name: '7ths' }))
    expect(screen.queryByText(/is in/)).not.toBeInTheDocument()
  })

  it('has no Chords view for a scale without seven notes', async () => {
    await renderApp('/learn/scales?kind=blues&show=chords')
    await screen.findByRole('group', { name: 'Keyboard' })
    expect(screen.queryByRole('group', { name: 'Show' })).not.toBeInTheDocument()
    expect(screen.getByRole('table')).toBeInTheDocument()
  })
```

(`notes` maps note sounds to `midi` as in the other screen tests; `fireEvent`, `act`, `within` come from
`@testing-library/react` and `midi` from `@/shared/lib/music`. The blues scale's fingering is taught or not per the
kernel: if `FingeringTable` shows its "no standard fingering" line instead of a table, assert that line.)

- [ ] **Step 2: Run to see them fail**

Run: `npx vitest run src/widgets/scale-explorer src/pages/scales src/app/routes`
Expected: FAIL.

- [ ] **Step 3: The view and the model**

`scale-view.ts`:

```ts
/** What the Scales reference shows: the scale, what its keys carry, and how it is practised. */
export interface ScaleView {
  readonly root: NoteParam
  readonly kind: ScaleKind
  /** What the keys carry: the scale's degrees, or the key's chords (a seven-note scale only). */
  readonly show: 'scale' | 'chords'
  /** The fingers under the keys: none, or one hand's (Scale view). */
  readonly fingers: 'none' | 'rh' | 'lh'
  readonly rhythm: PracticeRhythm
  readonly tempo: number
  readonly hands: Hands
  /** Triads or 7th chords (Chords view). */
  readonly chords: 3 | 4
  /** What a degree's key plays in Chords view: its chord, or its own note, lighting the chords that hold it. */
  readonly keysPlay: 'chords' | 'notes'
}
```

`scale-keys.ts`:

```ts
import {
  chordHolds,
  chordSymbol,
  noteName,
  pitchClass,
  pitchClassOf,
  plainSpelling,
  type Finger,
  type Midi,
  type PlacedScaleChord,
  type PlacedTone,
  type Tone,
} from '@/shared/lib/music'
import type { KeyMark } from '@/shared/ui'

/** Scale view: each degree's key, the tonic's in its own colour, with its degree and a hand's finger. */
export function scaleMarks(
  placed: readonly PlacedTone[],
  fingering: readonly Finger[] | null,
): Map<Midi, KeyMark> {
  return new Map(
    placed.map((key, i) => {
      const finger = fingering?.[i]
      return [
        key.midi,
        {
          tone: key.tone.role === 'root' ? 'tonic' : 'scale',
          label: key.tone.degree,
          ...(finger === undefined ? {} : { finger }),
        },
      ]
    }),
  )
}

/** Chords view: each degree's key with its numeral over its chord (The Ultimate Piano's Diatonic). */
export function chordMarks(chords: readonly PlacedScaleChord[]): Map<Midi, KeyMark> {
  return new Map(
    chords.map((placed, i) => [
      placed.key,
      { tone: i === 0 ? 'tonic' : 'scale', label: chordSymbol(placed.chord), caption: placed.roman },
    ]),
  )
}

/** What a key plays in Chords view: a degree's key its chord, stacked from it; any other key itself. */
export function chordKeyPlays(chords: readonly PlacedScaleChord[]): (key: Midi) => readonly Midi[] {
  const byKey = new Map(chords.map((placed) => [placed.key, placed.tones.map((tone) => tone.midi)]))
  return (key) => byKey.get(key) ?? [key]
}

/** The key's chords that hold a note, in any octave, in the scale's order. */
export const chordsHolding = (
  chords: readonly PlacedScaleChord[],
  note: Midi,
): PlacedScaleChord[] => chords.filter((placed) => chordHolds(placed.chord, pitchClass(note)))

/** A key a hand played, named as the scale spells it, or with a sharp when it is not in the scale. */
export function heardName(note: Midi, tones: readonly Tone[]): string {
  const pc = pitchClass(note)
  const inScale = tones.find((tone) => pitchClassOf(tone.note) === pc)
  return noteName(inScale ? inScale.note : plainSpelling(pc, true))
}
```

`use-heard-note.ts`:

```ts
import { useCallback, useState } from 'react'
import { useMidiKeyDown } from '@/features/connect-midi'
import type { Midi } from '@/shared/lib/music'

/**
 * The note: the last key a hand played while `listening` (a tap, a typed key, a MIDI key going
 * down), forgotten when `context` (the scale, the size, what keys play) changes.
 */
export function useHeardNote(
  listening: boolean,
  context: string,
): { readonly note: Midi | null; readonly hear: (key: Midi) => void } {
  const [heard, setHeard] = useState<{ readonly note: Midi; readonly context: string } | null>(null)
  const hear = useCallback((key: Midi) => setHeard({ note: key, context }), [context])
  useMidiKeyDown((key) => {
    if (listening) hear(key)
  })
  return { note: listening && heard?.context === context ? heard.note : null, hear }
}
```

`search.ts`: `SCALES_DEFAULTS` gains `show: 'scale'` and `keysPlay: 'chords'`; the validator writes

```ts
    show: scaleHasChords(kind)
      ? valueOr(isScaleShow, raw.show, SCALES_DEFAULTS.show)
      : SCALES_DEFAULTS.show,
    keysPlay: valueOr(isKeysPlay, raw.keysPlay, SCALES_DEFAULTS.keysPlay),
```

with `const isScaleShow = isOneOf<ScaleView['show']>(['scale', 'chords'])` and
`const isKeysPlay = isOneOf<ScaleView['keysPlay']>(['chords', 'notes'])`.

Strings (`learn`, en / ru): `show: { label: 'Show', scale: 'Scale', chords: 'Chords' }` /
`{ label: 'Показать', scale: 'Гамма', chords: 'Аккорды' }`; `keysPlay: { label: 'Keys play', chords: 'Chords',
notes: 'Notes' }` / `{ label: 'Клавиши играют', chords: 'Аккорды', notes: 'Ноты' }`;
`holds: '{{note}} is in {{chords}}'` / `'{{note}} есть в {{chords}}'`;
`holdsNone: 'No chord of the scale holds {{note}}'` / `'Ни в одном аккорде гаммы нет {{note}}'`.

- [ ] **Step 4: The screens**

`ScalePractice.tsx` (the practice card, moved out of `ScaleExplorer` with its Rhythm chips as a pop-up):

```tsx
import { Square } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PRACTICE_RHYTHM_IDS, TEMPO_RANGE, type NoteSound } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'
import { Dropdown, Segmented } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Slider, SliderLabel } from '@/shared/ui/primitives/slider'
import type { ScaleView } from '../model/scale-view'

/** The scale practised: its rhythm, tempo and hands, and Play up and down, which turns into Stop. */
export function ScalePractice({
  scale,
  run,
  onChange,
}: {
  scale: ScaleView
  run: readonly NoteSound[]
  onChange: (change: Partial<ScaleView>) => void
}) {
  const { t } = useTranslation(['learn', 'common'])
  const playback = usePlayback<'run'>()
  return (
    <section className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-5">
      <h3 className="text-2xl">{t('learn:practice')}</h3>
      <Dropdown
        label={t('learn:rhythmLabel')}
        value={scale.rhythm}
        options={PRACTICE_RHYTHM_IDS.map((r) => ({ value: r, label: t(`learn:rhythm.${r}`) }))}
        onChange={(rhythm) => onChange({ rhythm })}
      />
      {/* the Tempo slider and the Hands segmented control, as ScaleExplorer has them today */}
      <Button size="pill" onClick={() => playback.toggle('run', run)}>
        {playback.playing === 'run' ? (
          <>
            <Square data-icon="inline-start" />
            {t('common:stop')}
          </>
        ) : (
          t('learn:playUpDown')
        )}
      </Button>
    </section>
  )
}
```

(Move the `Slider` and the Hands `Segmented` in verbatim from today's `ScaleExplorer`; no comment stays.)

`KeyChords.tsx`:

```tsx
import { Square } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useLocale } from '@/shared/i18n'
import { chordSymbol, type Midi, type PlacedScaleChord, type Tone } from '@/shared/lib/music'
import { chordSounds } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'
import { Button } from '@/shared/ui/primitives/button'
import { heardName } from '../model/scale-keys'

/**
 * The key's chords: a tap plays one from its degree's key, pressed while it sounds. Listening for a
 * note (Keys play Notes), the chords that hold it are outlined and named.
 */
export function KeyChords({
  chords,
  tones,
  listening,
  note,
  holding,
}: {
  chords: readonly PlacedScaleChord[]
  tones: readonly Tone[]
  listening: boolean
  note: Midi | null
  holding: readonly PlacedScaleChord[]
}) {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const playback = usePlayback<string>()
  const holds = new Set(holding.map((placed) => placed.roman))
  const said =
    note === null
      ? ''
      : holding.length === 0
        ? t('holdsNone', { note: heardName(note, tones) })
        : t('holds', {
            note: heardName(note, tones),
            chords: new Intl.ListFormat(locale, { type: 'conjunction' }).format(
              holding.map((placed) => chordSymbol(placed.chord)),
            ),
          })
  return (
    <section aria-label={t('chordsIn')} className="flex flex-col gap-3">
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
        {chords.map(({ roman, chord, tones: placed }) => (
          <Button
            key={roman}
            variant="outline"
            aria-pressed={playback.playing === roman}
            data-holds={holds.has(roman) ? '' : undefined}
            className="relative h-16 flex-col gap-0 aria-pressed:bg-secondary aria-pressed:text-secondary-foreground data-holds:ring-3 data-holds:ring-ring data-holds:ring-inset"
            onClick={() =>
              playback.toggle(
                roman,
                chordSounds(
                  placed.map((tone) => tone.midi),
                  { arpeggio: false },
                ),
              )
            }
          >
            {playback.playing === roman ? (
              <Square aria-hidden className="absolute top-1.5 right-1.5 size-3" />
            ) : null}
            <span className="font-display text-2xl font-semibold">{chordSymbol(chord)}</span>
            <span className="text-sm text-muted-foreground">{roman}</span>
          </Button>
        ))}
      </div>
      {listening ? (
        <p aria-live="polite" className="min-h-7 text-lg">
          {said}
        </p>
      ) : null}
    </section>
  )
}
```

`ScaleExplorer.tsx` (the container; Scale view below the keys is the fingering table and the practice card, Chords
view the list):

```tsx
const FINGERS = [
  { value: 'none', label: 'learn:fingers.none' },
  { value: 'rh', label: 'common:hands.rh' },
  { value: 'lh', label: 'common:hands.lh' },
] as const
const SHOW = ['scale', 'chords'] as const
const SIZES = [
  { value: 3, name: 'triads' },
  { value: 4, name: 'sevenths' },
] as const
const KEYS_PLAY = ['chords', 'notes'] as const

/** Any scale on any root: its degrees or its chords on the keys, its fingering, practice and facts. */
export function ScaleExplorer({ scale, onChange }: { scale: ScaleView; onChange: (change: Partial<ScaleView>) => void }) {
  const { t } = useTranslation(['learn', 'music', 'common'])
  const scaleName = useScaleName()
  const root = noteFromParam(scale.root)
  const tones = spellScale(root, scale.kind)
  const placed = placeScale(root, scale.kind)
  const scaleKeys = placed.map((key) => key.midi)
  const hasChords = scaleHasChords(scale.kind)
  const showChords = scale.show === 'chords' && hasChords
  const listening = showChords && scale.keysPlay === 'notes'
  const { note, hear } = useHeardNote(
    listening,
    [scale.root, scale.kind, scale.chords, scale.keysPlay, scale.show].join(' '),
  )
  const chords = useMemo(
    () => (showChords ? placeScaleChords(noteFromParam(scale.root), scale.kind, scale.chords) : []),
    [showChords, scale.root, scale.kind, scale.chords],
  )
  const keyPlays = useMemo(
    () => (showChords && scale.keysPlay === 'chords' ? chordKeyPlays(chords) : undefined),
    [showChords, scale.keysPlay, chords],
  )
  const holding = note === null ? [] : chordsHolding(chords, note)
  const rh = scaleFingering(pitchClassOf(root), scale.kind, 'rh')
  const lh = scaleFingering(pitchClassOf(root), scale.kind, 'lh')
  const fingering = scale.fingers === 'rh' ? rh : scale.fingers === 'lh' ? lh : null
  const run = scaleRun(scaleKeys, { rhythm: scale.rhythm, tempo: scale.tempo, hands: scale.hands })

  return (
    <div className="flex flex-col gap-6 lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-10">
      <div className="flex flex-col gap-4">
        <h2 className="text-5xl">{scaleName(root, scale.kind)}</h2>
        <div className="flex flex-wrap gap-2">
          <Dropdown
            label={t('learn:root')}
            value={scale.root}
            options={PITCH_CLASSES.map((pc) => {
              const spelled = scaleRootSpelling(pc, scale.kind)
              return { value: noteParam(spelled), label: noteName(spelled) }
            })}
            onChange={(value) => onChange({ root: value })}
          />
          <Dropdown
            label={t('learn:scaleLabel')}
            value={scale.kind}
            options={SCALE_KINDS.map((kind) => ({ value: kind, label: t(`music:scaleKind.${kind}`) }))}
            onChange={(kind) => onChange({ kind })}
          />
        </div>
        {hasChords ? (
          <Segmented
            label={t('learn:show.label')}
            value={showChords ? 'chords' : 'scale'}
            options={SHOW.map((value) => ({ value, label: t(`learn:show.${value}`) }))}
            onChange={(show) => onChange({ show })}
          />
        ) : null}
        {showChords ? (
          <div className="flex flex-col gap-4 sm:flex-row">
            <Segmented
              label={t('learn:chordSize.label')}
              value={scale.chords}
              options={SIZES.map(({ value, name }) => ({ value, label: t(`learn:chordSize.${name}`) }))}
              onChange={(size) => onChange({ chords: size })}
            />
            <Segmented
              label={t('learn:keysPlay.label')}
              value={scale.keysPlay}
              options={KEYS_PLAY.map((value) => ({ value, label: t(`learn:keysPlay.${value}`) }))}
              onChange={(keysPlay) => onChange({ keysPlay })}
            />
          </div>
        ) : rh && lh ? (
          <Segmented
            label={t('learn:fingers.label')}
            value={scale.fingers}
            options={FINGERS.map(({ value, label }) => ({ value, label: t(label) }))}
            onChange={(fingers) => onChange({ fingers })}
          />
        ) : null}
      </div>
      {showChords ? (
        <ExplorerKeyboard
          keys={scaleKeys}
          range={rangeOf(scaleKeys)}
          marks={chordMarks(chords)}
          keyPlays={keyPlays}
          outlined={new Set(holding.map((placed) => placed.key))}
          onKeyPress={listening ? hear : undefined}
          className="lg:order-first lg:col-span-2"
        />
      ) : (
        <ExplorerKeyboard
          keys={run.map((sound) => sound.midi)}
          marks={scaleMarks(placed, fingering)}
          className="lg:order-first lg:col-span-2"
        />
      )}
      <div className="flex flex-col gap-6">
        {showChords ? (
          <KeyChords chords={chords} tones={tones} listening={listening} note={note} holding={holding} />
        ) : (
          <>
            <FingeringTable notes={placed.map((key) => noteName(key.tone.note))} rh={rh} lh={lh} />
            <ScalePractice scale={scale} run={run} onChange={onChange} />
          </>
        )}
        <ScaleFacts root={root} kind={scale.kind} tones={tones} />
      </div>
    </div>
  )
}
```

`ExplorerKeyboard`'s `range`, `keyPlays` and `onKeyPress` types take `| undefined`, so the calls above type-check with
the project's settings. Delete `ScaleChords.tsx`.

- [ ] **Step 5: Run everything**

Run: `npm run typecheck && npm run lint && npm run test`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
npx prettier --write src/widgets/scale-explorer src/pages/scales src/app/routes src/shared/i18n
git add -A src
git commit -m "Give the Scales reference a Chords view: each degree's chord on its key, and the chords that hold a note"
```

---

### Task 9: The Player's key as a pop-up; no chip row left

**Files:**
- Modify: `src/widgets/player-setup/ui/SetupMain.tsx`, `src/widgets/player-setup/ui/PlayerSetup.test.tsx`,
  `src/shared/ui/index.ts`, `src/shared/ui/kit.test.tsx`, `src/shared/ui/primitives/toggle.tsx`
- Delete: `src/shared/ui/ChipRow.tsx`

- [ ] **Step 1: Write the failing test** (`PlayerSetup.test.tsx`, replacing the key chips' use)

```tsx
  it('changes the key from its pop-up, which names the key the piece is played in', async () => {
    const user = userEvent.setup()
    const { onChange } = setUp()
    const key = screen.getByRole('combobox', { name: 'Key' })
    expect(key).toHaveTextContent('G major')
    await user.click(key)
    await user.click(await screen.findByRole('option', { name: 'A major' }))
    expect(onChange).toHaveBeenCalledWith({ key: 'A' })
  })
```

(Use the file's own helper and the piece it renders; take the expected key name from it.)

- [ ] **Step 2: Run to see it fail**

Run: `npx vitest run src/widgets/player-setup`
Expected: FAIL.

- [ ] **Step 3: Implement**

`SetupMain.tsx`: the key's label row and `ChipRow` become

```tsx
      <Dropdown
        label={t('player:key')}
        value={noteParam(choice.tonic)}
        options={PITCH_CLASSES.map((pc) => {
          const tonic = tonicSpelling(pc, minor)
          return {
            value: noteParam(tonic),
            label: t(minor ? 'player:keyOf.minor' : 'player:keyOf.major', { tonic: noteName(tonic) }),
          }
        })}
        onChange={(key) => onChange({ key })}
      />
```

Delete `ChipRow.tsx`, its export and its tests in `kit.test.tsx`; remove the `chip` variant from
`primitives/toggle.tsx`'s `toggleVariants`.

- [ ] **Step 4: Run everything**

Run: `npm run typecheck && npm run lint && npm run test`
and `grep -rn "ChipRow\|variant=\"chip\"\|chip:" src` → nothing.
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
npx prettier --write src/widgets/player-setup src/shared/ui
git add -A src
git commit -m "Choose the Player's key from a pop-up and drop the chip row from the kit"
```

---

### Task 10: The records, and the whole app checked

**Files:**
- Modify: `DESIGN.md`, `docs/CODE_STYLE.md`, `PRODUCT.md`, `docs/UBIQUITOUS_LANGUAGE.md`, `CLAUDE.md`,
  `docs/superpowers/specs/2026-09-24-piano-trainer-rewrite-design.md` (§5),
  `docs/superpowers/specs/2026-09-25-next-features-roadmap-design.md` (status)
- Create: `docs/adr/0012-learn-and-practice-and-pop-up-choices.md`
- Delete (after the build is verified, as sub-project 1's were): this plan and its spec

- [ ] **Step 1: DESIGN.md**

Front matter: `chip` and `chip-selected` give way to `popup-button` (paper card, ink, control type, control radius,
44px, `0 12px`) and `popup-item-selected` (text umber); `row-link` (paper card row, 64px, tile 48px). Prose:
Layout (the sidebar's four places; Learn and Practice two columns from 1024px; the references and a lesson pin their
keyboard); Components → **Pop-up buttons and segments** (the trigger, the popup, the check, groups; the choosing
rule: ≤5 short nouns a segmented control, else a pop-up; a popover only beside the keys); **Rows** (the row link and
its group); Navigation (four places, Path · Songs · Learn · Practice, icons Route, Music, BookOpen, Metronome); the
keyboard (a mark's caption; what a key plays; Spotlight on the references and a lesson); sheets (Setup and quiz
choice); Do's and Don'ts: "an umber chip" → "an umber check".

- [ ] **Step 2: CODE_STYLE.md**

§1: the kit list (`Dropdown`, `RowLink`, `RowGroup`, `PAINT`; no `ChipRow`); add **Every page earns its place**
("a screen does its job in place, or is a link the learner chose knowing where it goes; no middle man, no redirect,
no 'coming soon'"); the choosing rule; `LiveKeyboard`'s `keyPlays`; §5 "A chosen segment or Theory tab" → "A chosen
segment"; §8 `useSoundKey` → `useSoundKeys`; §10 the exception is **lessons** (a lesson teaches music, never a button).

- [ ] **Step 3: PRODUCT.md, the glossary, CLAUDE.md, the master spec, the roadmap**

PRODUCT.md Capabilities: "Screens: Path (Continue + levels 1–4), Songs, Piece, Player (Listen · Step · Wait), Learn
(lessons; the Chords and Scales references), Practice (the Theory quiz with My gaps; studies and progressions),
Settings." Glossary: add Learn, Practice, Reference, Lesson, Scale view / Chords view, Keys play, Holds, Pop-up
button; Explorer and Theory quiz reworded; Symbols and Theory gone. CLAUDE.md architecture: `app` (no
`TheoryLayout`; routes `learn-screens`, `practice-screens`), widgets (no `theory-nav`; `lesson-view`), entities
(`lesson`), shared ui kit (`Dropdown`, `RowLink`, `RowGroup`, `PAINT`), services (`useSoundKeys`), i18n
(`music`, `learn`, `practice`). Master spec §5: the navigation line and the route table as built now, marked
"revised by sub-project 2 (2026-09-27)". Roadmap status: "**Built:** sub-projects 1 and 2 …", pointing to ADR 0012 and
DESIGN.md.

- [ ] **Step 4: ADR 0012**

Context (the owner's asks; Theory's tabs; chips everywhere; Symbols repeating Chords; the HIG research), Decision
(four places; Learn and Practice; shelves; pop-up buttons and segments with the rule; the Scales reference's views;
the keyboard's `keyPlays` and caption; no redirects), Consequences (old `/theory` links are not found; later
sub-projects build in these places; the keyboard settings' popover stays as the exception).

- [ ] **Step 5: Verify the whole app**

Run: `npm run typecheck && npm run lint && npm run test && npm run build`
Expected: PASS. Then run the app (`npm run dev`) and look at, on a phone width (390px) and a laptop width (1280px),
in both languages and both themes: the nav, Learn, a lesson (tap examples), Chords (pop-ups), Scales (Chords view,
Notes), Practice, a study's page, Songs' filters, the Player's Setup key. Fix what reads wrong.

- [ ] **Step 6: Commit the records; remove the built spec and plan**

```bash
npx prettier --write DESIGN.md PRODUCT.md CLAUDE.md docs
git add -A DESIGN.md PRODUCT.md CLAUDE.md docs
git commit -m "Record sub-project 2: the four places, pop-up buttons, the Chords view; ADR 0012"
git rm docs/superpowers/specs/2026-09-27-navigation-and-options-design.md docs/superpowers/plans/2026-09-27-navigation-and-options.md
git commit -m "Remove sub-project 2's built spec and plan (git log finds them)"
```
