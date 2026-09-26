import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ComponentProps } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { midi, type Midi } from '@/shared/lib/music'
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

  it('keeps a scale’s keys white or black, their degree in a teal band', () => {
    renderKeyboard({
      marks: new Map<Midi, KeyMark>([
        [midi(62), { tone: 'scale', label: '2' }],
        [midi(63), { tone: 'scale', label: '♭3' }],
      ]),
    })
    const d = screen.getByRole('button', { name: 'D4' })
    expect(d).toHaveClass('bg-key-white')
    expect(within(d).getByText('2')).toHaveClass('bg-key-mark', 'text-on-key-mark')
    expect(screen.getByRole('button', { name: 'D sharp 4' })).toHaveClass('bg-key-black')
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
})
