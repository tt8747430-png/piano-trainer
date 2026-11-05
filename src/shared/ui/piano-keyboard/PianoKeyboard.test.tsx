import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ComponentProps } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { shownText } from '@/shared/test/shown-text'
import { midi, type Midi } from '@/shared/lib/music'
import { stubScrolling } from '@/shared/test/layout'
import type { KeyMark } from './key-look'
import { PianoKeyboard } from './PianoKeyboard'

const C4 = midi(60)
const ONE_OCTAVE = { from: C4, to: midi(71) }

const renderKeyboard = (props: Partial<ComponentProps<typeof PianoKeyboard>> = {}) =>
  render(
    <>
      <PianoKeyboard range={ONE_OCTAVE} onKeyPress={() => {}} {...props} />
      <button type="button">After</button>
    </>,
  )

describe('PianoKeyboard', () => {
  it('is a group named Keyboard holding the whole piano, its keys named by note', () => {
    renderKeyboard()
    const keys = within(screen.getByRole('group', { name: 'Keyboard' })).getAllByRole('button')
    expect(keys).toHaveLength(88)
    expect(keys[0]).toHaveAccessibleName('A0')
    expect(keys[1]).toHaveAccessibleName('A sharp 0')
    expect(keys.at(-1)).toHaveAccessibleName('C8')
  })

  it('reports a pressed key', async () => {
    const user = userEvent.setup()
    const onKeyPress = vi.fn()
    renderKeyboard({ onKeyPress })
    await user.click(screen.getByRole('button', { name: 'F sharp 4' }))
    expect(onKeyPress).toHaveBeenCalledWith(66)
  })

  it('is one tab stop, from the start of its range, and the arrow keys walk the keys', async () => {
    const user = userEvent.setup()
    renderKeyboard()
    screen.getByRole('button', { name: 'After' }).focus()
    await user.tab({ shift: true })
    expect(screen.getByRole('button', { name: 'C4' })).toHaveFocus()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('button', { name: 'C sharp 4' })).toHaveFocus()
    await user.keyboard('{ArrowLeft}{ArrowLeft}')
    expect(screen.getByRole('button', { name: 'B3' })).toHaveFocus()
    await user.keyboard('{End}')
    expect(screen.getByRole('button', { name: 'C8' })).toHaveFocus()
    await user.keyboard('{Home}')
    expect(screen.getByRole('button', { name: 'A0' })).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus()
  })

  it('makes the key last pressed the tab stop', async () => {
    const user = userEvent.setup()
    renderKeyboard()
    await user.click(screen.getByRole('button', { name: 'G4' }))
    // A click takes no focus (Space after it is the pedal's), yet Tab comes back to the key clicked.
    expect(screen.getByRole('button', { name: 'G4' })).not.toHaveFocus()
    screen.getByRole('button', { name: 'After' }).focus()
    await user.tab({ shift: true })
    expect(screen.getByRole('button', { name: 'G4' })).toHaveFocus()
  })

  it('shows a mark with its label, in its colour’s wash while it is quiet', () => {
    renderKeyboard({ marks: new Map<Midi, KeyMark>([[midi(62), { tone: 'root', label: '1' }]]) })
    const d = screen.getByRole('button', { name: 'D4' })
    expect(d).toHaveTextContent('1')
    expect(d).toHaveClass('bg-role-root-wash')
  })

  it('names a marked key’s note under its degree, unless marked notes go unnamed', () => {
    const marks = new Map<Midi, KeyMark>([[midi(64), { tone: '3rd', label: '3', note: 'E' }]])
    const { rerender } = renderKeyboard({ marks })
    expect(shownText(screen.getByRole('button', { name: 'E4' }))).toMatch(/3E$/)
    rerender(
      <PianoKeyboard range={ONE_OCTAVE} onKeyPress={() => {}} marks={marks} markNotes={false} />,
    )
    expect(shownText(screen.getByRole('button', { name: 'E4' }))).not.toContain('E')
  })

  it('colours a scale’s keys whole, black keys too, each with its degree', () => {
    renderKeyboard({
      marks: new Map<Midi, KeyMark>([
        [C4, { tone: 'tonic', label: '1' }],
        [midi(63), { tone: 'scale', label: '♭3' }],
      ]),
    })
    expect(screen.getByRole('button', { name: 'C4' })).toHaveClass('bg-key-tonic')
    const eFlat = screen.getByRole('button', { name: 'D sharp 4' })
    expect(eFlat).toHaveClass('bg-key-scale')
    expect(shownText(eFlat)).toContain('♭3')
  })

  it('names every C by default, all keys or none when asked', () => {
    const { rerender } = renderKeyboard()
    expect(shownText(screen.getByRole('button', { name: 'C4' }))).toContain('C4')
    expect(shownText(screen.getByRole('button', { name: 'D4' }))).toBe('')
    rerender(<PianoKeyboard range={ONE_OCTAVE} onKeyPress={() => {}} namedKeys="all" />)
    expect(shownText(screen.getByRole('button', { name: 'C sharp 4' }))).toContain('C#')
    rerender(<PianoKeyboard range={ONE_OCTAVE} onKeyPress={() => {}} namedKeys="none" />)
    expect(shownText(screen.getByRole('button', { name: 'C4' }))).toBe('')
  })

  it('shows the typing letters on their keys', () => {
    renderKeyboard({ letters: new Map([[C4, 'A']]) })
    expect(shownText(screen.getByRole('button', { name: 'C4' }))).toContain('A')
  })

  it('keeps every mark while keys are down, a finger’s key among them', () => {
    const marks = new Map<Midi, KeyMark>([
      [C4, { tone: 'root', label: '1' }],
      [midi(64), { tone: '3rd', label: '3' }],
    ])
    renderKeyboard({ marks, down: new Set([midi(67)]) })
    const c = screen.getByRole('button', { name: 'C4' })
    const e = screen.getByRole('button', { name: 'E4' })
    fireEvent.pointerDown(e, { pointerId: 1, pointerType: 'touch' })
    expect(e).toHaveAttribute('data-down')
    expect(c).toHaveClass('bg-role-root-wash')
    expect(shownText(c)).toContain('1')
  })

  it('makes keys toggles when it holds a selection, and fills the selected ones yellow', () => {
    renderKeyboard({ selected: new Set([C4]) })
    const c = screen.getByRole('button', { name: 'C4' })
    expect(c).toHaveAttribute('aria-pressed', 'true')
    expect(c).toHaveClass('bg-primary')
    expect(screen.getByRole('button', { name: 'D4' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('keeps its keys plain buttons without a selection', () => {
    renderKeyboard()
    expect(screen.getByRole('button', { name: 'C4' })).not.toHaveAttribute('aria-pressed')
  })

  it('puts a key down: a plain one turns the down colour, a marked one its full colour', () => {
    const marks = new Map<Midi, KeyMark>([
      [C4, { tone: 'root', label: '1' }],
      [midi(64), { tone: 'scale', label: '3' }],
      [midi(65), { tone: 'tonic', label: '1' }],
    ])
    renderKeyboard({ marks, down: new Set([C4, midi(62), midi(64), midi(65)]) })
    const c = screen.getByRole('button', { name: 'C4' })
    expect(c).toHaveAttribute('data-down')
    expect(c).toHaveClass('bg-role-root')
    expect(screen.getByRole('button', { name: 'E4' })).toHaveClass('bg-key-scale-down')
    expect(screen.getByRole('button', { name: 'F4' })).toHaveClass('bg-key-tonic-down')
    const d = screen.getByRole('button', { name: 'D4' })
    expect(d).toHaveAttribute('data-down')
    expect(d).toHaveClass('bg-key-down')
    expect(screen.getByRole('button', { name: 'G4' })).not.toHaveAttribute('data-down')
  })

  it('lights Name chord’s keys yellow', () => {
    renderKeyboard({ lit: new Set([C4]) })
    expect(screen.getByRole('button', { name: 'C4' })).toHaveClass('bg-primary')
  })

  it('shows a wrong key and an outlined one', () => {
    renderKeyboard({ wrong: new Set([midi(64)]), outlined: new Set([midi(67)]) })
    expect(screen.getByRole('button', { name: 'E4' })).toHaveClass('bg-destructive')
    expect(screen.getByRole('button', { name: 'G4' })).toHaveClass('ring-ring')
  })

  it('is its keys alone: no rail, no buttons of its own, nothing under the keys (R34)', () => {
    renderKeyboard({ keySize: 'fit' })
    const scroller = document.querySelector('[data-slot="keys-scroller"]')
    const buttons = within(scroller as HTMLElement).getAllByRole('button')
    expect(buttons).toHaveLength(88)
    expect(screen.queryByRole('button', { name: /Octave|Settings|Sustain/ })).toBeNull()
  })

  it('is never longer than the screen’s share for the keys, though that is under the shortest keys', () => {
    renderKeyboard()
    const keys = screen.getByRole('group', { name: 'Keyboard' })
    // A phone on its side keeps the music more room than the shortest keys would leave it.
    expect(keys.style.height).toMatch(
      /^clamp\(min\(56px, var\(--keys-most\)\), .*, var\(--keys-most\)\)$/,
    )
  })

  it('narrows Fit’s keys, past their usual narrowest, until the keys asked to be in sight fit', () => {
    // C2 to G4: nineteen white keys asked for, wider than the octave the keys fill.
    const asked = { from: midi(36), to: midi(67) }
    const { rerender } = renderKeyboard({ inView: asked, fitInView: true })
    const keys = screen.getByRole('group', { name: 'Keyboard' })
    expect(keys.style.height).toContain('100cqw / 19')
    // A narrower span asked next leaves the keys as they are: they hold still (ADR 0062).
    rerender(
      <PianoKeyboard
        range={ONE_OCTAVE}
        inView={{ from: C4, to: midi(64) }}
        fitInView
        onKeyPress={() => {}}
      />,
    )
    expect(keys.style.height).toContain('100cqw / 19')
  })

  it('keeps Fit’s narrowest keys where it is not asked to fit what is in sight', () => {
    renderKeyboard({ inView: { from: midi(36), to: midi(67) } })
    expect(screen.getByRole('group', { name: 'Keyboard' }).style.height).not.toContain('/ 19')
  })

  it('stands as tall as the divider set it, its keys as wide as ever', () => {
    renderKeyboard({ height: 120 })
    const keys = screen.getByRole('group', { name: 'Keyboard' })
    expect(keys.style.height).toBe('120px')
    expect(keys.style.width).toContain('100cqw')
  })

  it('keeps the keys that matter in view when its key size changes', () => {
    const { scrolls } = stubScrolling({ clientWidth: 390, scrollWidth: 52 * 28 })
    const { rerender } = renderKeyboard()
    const opened = scrolls.length
    rerender(<PianoKeyboard range={ONE_OCTAVE} onKeyPress={() => {}} keySize="large" />)
    expect(scrolls).toHaveLength(opened + 1)
  })

  it('draws a mark’s caption over its label', () => {
    renderKeyboard({
      marks: new Map<Midi, KeyMark>([[midi(62), { tone: 'scale', label: 'Dm', caption: 'ii' }]]),
    })
    expect(shownText(screen.getByRole('button', { name: 'D4' }))).toContain('iiDm')
  })

  it('holds down every key a pressed key plays', () => {
    const chordOnD = (key: Midi): readonly Midi[] =>
      key === 62 ? [midi(62), midi(65), midi(69)] : [key]
    renderKeyboard({ keyPlays: chordOnD })
    fireEvent.pointerDown(screen.getByRole('button', { name: 'D4' }), { pointerId: 1 })
    expect(screen.getByRole('button', { name: 'F4' })).toHaveAttribute('data-down')
    expect(screen.getByRole('button', { name: 'A4' })).toHaveAttribute('data-down')
    expect(screen.getByRole('button', { name: 'E4' })).not.toHaveAttribute('data-down')
  })

  it('describes what a key prints and what it is: its role, its degree, a wrong or a missing note', () => {
    renderKeyboard({
      marks: new Map<Midi, KeyMark>([[C4, { tone: 'root', label: '1', caption: 'I' }]]),
      wrong: new Set([midi(61)]),
      outlined: new Set([midi(64)]),
    })
    expect(screen.getByRole('button', { name: 'C4' })).toHaveAccessibleDescription('Root, I, 1')
    expect(screen.getByRole('button', { name: 'C sharp 4' })).toHaveAccessibleDescription('Wrong')
    expect(screen.getByRole('button', { name: 'E4' })).toHaveAccessibleDescription('Missing')
    expect(screen.getByRole('button', { name: 'D4' })).not.toHaveAccessibleDescription()
  })
})
