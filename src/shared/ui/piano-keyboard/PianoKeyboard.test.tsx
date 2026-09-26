import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ComponentProps } from 'react'
import { describe, expect, it, vi } from 'vitest'
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
    // The rail's buttons come before the keys, as they stand above them.
    screen.getByRole('button', { name: 'Octave up' }).focus()
    await user.tab()
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
    await user.tab()
    await user.tab({ shift: true })
    expect(screen.getByRole('button', { name: 'G4' })).toHaveFocus()
  })

  it('shows a mark with its label and colour', () => {
    renderKeyboard({ marks: new Map<Midi, KeyMark>([[midi(62), { tone: 'root', label: '1' }]]) })
    const d = screen.getByRole('button', { name: 'D4' })
    expect(d).toHaveTextContent('1')
    expect(d).toHaveClass('bg-role-root')
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
    expect(eFlat).toHaveTextContent('♭3')
  })

  it('names every C by default, all keys or none when asked', () => {
    const { rerender } = renderKeyboard()
    expect(screen.getByRole('button', { name: 'C4' })).toHaveTextContent('C4')
    expect(screen.getByRole('button', { name: 'D4' }).textContent).toBe('')
    rerender(<PianoKeyboard range={ONE_OCTAVE} onKeyPress={() => {}} namedKeys="all" />)
    expect(screen.getByRole('button', { name: 'C sharp 4' })).toHaveTextContent('C#')
    rerender(<PianoKeyboard range={ONE_OCTAVE} onKeyPress={() => {}} namedKeys="none" />)
    expect(screen.getByRole('button', { name: 'C4' }).textContent).toBe('')
  })

  it('shows the typing letters on their keys', () => {
    renderKeyboard({ letters: new Map([[C4, 'A']]) })
    expect(screen.getByRole('button', { name: 'C4' })).toHaveTextContent('A')
  })

  it('with spotlight, shows only the marks of the keys down, and every mark when none is', () => {
    const marks = new Map<Midi, KeyMark>([
      [C4, { tone: 'root', label: '1' }],
      [midi(64), { tone: '3rd', label: '3' }],
    ])
    const { rerender } = renderKeyboard({ spotlight: true, marks, down: new Set([midi(64)]) })
    const [c, e] = ['C4', 'E4'].map((name) => screen.getByRole('button', { name }))
    expect(e).toHaveClass('bg-role-3rd')
    expect(c).toHaveClass('bg-key-white')
    expect(c).not.toHaveTextContent('1')
    rerender(<PianoKeyboard range={ONE_OCTAVE} onKeyPress={() => {}} spotlight marks={marks} />)
    expect(c).toHaveClass('bg-role-root')
    expect(c).toHaveTextContent('1')
  })

  it('with spotlight, shows only the key a finger holds while it holds it', () => {
    const marks = new Map<Midi, KeyMark>([
      [C4, { tone: 'root', label: '1' }],
      [midi(64), { tone: '3rd', label: '3' }],
    ])
    renderKeyboard({ spotlight: true, marks })
    const c = screen.getByRole('button', { name: 'C4' })
    const e = screen.getByRole('button', { name: 'E4' })
    fireEvent.pointerDown(e, { pointerId: 1, pointerType: 'touch' })
    expect(c).toHaveClass('bg-key-white')
    fireEvent.pointerUp(e, { pointerId: 1, pointerType: 'touch' })
    expect(c).toHaveClass('bg-role-root')
  })

  it('makes keys toggles when they are selectable, and fills the selected ones teal', () => {
    renderKeyboard({ selectable: true, selected: new Set([C4]) })
    const c = screen.getByRole('button', { name: 'C4' })
    expect(c).toHaveAttribute('aria-pressed', 'true')
    expect(c).toHaveClass('bg-primary')
    expect(screen.getByRole('button', { name: 'D4' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('puts a key down: a plain one turns the down colour, a coloured one keeps its colour', () => {
    const marks = new Map<Midi, KeyMark>([[C4, { tone: 'root', label: '1' }]])
    renderKeyboard({ marks, down: new Set([C4, midi(62)]) })
    const c = screen.getByRole('button', { name: 'C4' })
    expect(c).toHaveAttribute('data-down')
    expect(c).toHaveClass('bg-role-root')
    const d = screen.getByRole('button', { name: 'D4' })
    expect(d).toHaveAttribute('data-down')
    expect(d).toHaveClass('bg-key-down')
    expect(screen.getByRole('button', { name: 'E4' })).not.toHaveAttribute('data-down')
  })

  it('lights Name chord’s keys teal', () => {
    renderKeyboard({ lit: new Set([C4]) })
    expect(screen.getByRole('button', { name: 'C4' })).toHaveClass('bg-primary')
  })

  it('shows a wrong key and an outlined one', () => {
    renderKeyboard({ wrong: new Set([midi(64)]), outlined: new Set([midi(67)]) })
    expect(screen.getByRole('button', { name: 'E4' })).toHaveClass('bg-destructive')
    expect(screen.getByRole('button', { name: 'G4' })).toHaveClass('ring-primary')
  })

  it('has ‹ › that move it an octave, in both swipes', async () => {
    const { scrolls } = stubScrolling({ clientWidth: 390, scrollWidth: 52 * 28 })
    const user = userEvent.setup()
    const { rerender } = renderKeyboard({ swipe: 'scroll' })
    const opened = scrolls.at(-1) ?? 0
    await user.click(screen.getByRole('button', { name: 'Octave up' }))
    expect(scrolls.at(-1)).toBe(opened + 7 * 28)
    rerender(<PianoKeyboard range={ONE_OCTAVE} onKeyPress={() => {}} swipe="glissando" />)
    await user.click(screen.getByRole('button', { name: 'Octave down' }))
    expect(scrolls.at(-1)).toBe(opened)
  })

  it('shows the whole piano with nothing to move: no ‹ ›, no map, no finger row', () => {
    renderKeyboard({
      keySize: 'piano',
      map: true,
      marks: new Map<Midi, KeyMark>([[C4, { tone: 'tonic', label: '1', finger: 1 }]]),
    })
    expect(screen.queryByRole('button', { name: 'Octave up' })).not.toBeInTheDocument()
    expect(screen.queryByRole('slider', { name: 'Keys in view' })).not.toBeInTheDocument()
    expect(document.querySelector('[data-slot="finger-row"]')).not.toBeInTheDocument()
  })

  it('holds the controls it is given in its rail', () => {
    renderKeyboard({ children: <button type="button">Settings</button> })
    expect(screen.getByRole('button', { name: 'Settings' })).toBeInTheDocument()
  })

  it('puts fingers in circles under their keys, a black key’s above a white key’s', () => {
    renderKeyboard({
      marks: new Map<Midi, KeyMark>([
        [C4, { tone: 'scale', label: 'x', finger: 3 }],
        [midi(61), { tone: 'scale', label: 'y', finger: 4 }],
      ]),
    })
    const row = document.querySelector('[data-slot="finger-row"]')
    expect(row).toHaveTextContent('34')
    expect(screen.getByText('3')).toHaveClass('bottom-0')
    expect(screen.getByText('4')).toHaveClass('top-0')
  })

  it('keeps the keys that matter in view when its key size changes', () => {
    const { scrolls } = stubScrolling({ clientWidth: 390, scrollWidth: 52 * 28 })
    const { rerender } = renderKeyboard()
    const opened = scrolls.length
    rerender(<PianoKeyboard range={ONE_OCTAVE} onKeyPress={() => {}} keySize="large" />)
    expect(scrolls).toHaveLength(opened + 1)
  })
})
