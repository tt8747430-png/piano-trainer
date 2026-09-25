import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { midi, type Midi } from '@/shared/lib/music'
import { type KeyMark, PianoKeyboard } from './PianoKeyboard'

const C4 = midi(60)
const ONE_OCTAVE = { from: C4, to: midi(71) }

describe('PianoKeyboard', () => {
  it('is a labelled group of keys named by note', () => {
    render(<PianoKeyboard label="Keyboard" range={ONE_OCTAVE} />)
    const keyboard = screen.getByRole('group', { name: 'Keyboard' })
    const names = within(keyboard)
      .getAllByRole('button')
      .map((key) => key.getAttribute('aria-label'))
    expect(names).toEqual([
      'C4',
      'C sharp 4',
      'D4',
      'D sharp 4',
      'E4',
      'F4',
      'F sharp 4',
      'G4',
      'G sharp 4',
      'A4',
      'A sharp 4',
      'B4',
    ])
  })

  it('reports a pressed key', async () => {
    const user = userEvent.setup()
    const onKeyPress = vi.fn()
    render(<PianoKeyboard label="Keyboard" range={ONE_OCTAVE} onKeyPress={onKeyPress} />)
    await user.click(screen.getByRole('button', { name: 'F sharp 4' }))
    expect(onKeyPress).toHaveBeenCalledWith(66)
  })

  it('shows a mark with its label and colour', () => {
    const marks = new Map<Midi, KeyMark>([[midi(62), { tone: 'root', label: '1' }]])
    render(<PianoKeyboard label="Keyboard" range={ONE_OCTAVE} marks={marks} />)
    const d = screen.getByRole('button', { name: 'D4' })
    expect(d).toHaveTextContent('1')
    expect(d).toHaveClass('bg-role-root')
  })

  it('keeps a scale’s keys white or black, their degree in a teal badge', () => {
    const marks = new Map<Midi, KeyMark>([
      [midi(62), { tone: 'scale', label: '2' }],
      [midi(63), { tone: 'scale', label: '♭3' }],
    ])
    render(<PianoKeyboard label="Keyboard" range={ONE_OCTAVE} marks={marks} />)
    const d = screen.getByRole('button', { name: 'D4' })
    expect(d).toHaveClass('bg-key-white')
    expect(within(d).getByText('2')).toHaveClass('bg-key-mark', 'text-on-key-mark')
    expect(screen.getByRole('button', { name: 'D sharp 4' })).toHaveClass('bg-key-black')
  })

  it('makes keys toggles when they are selectable, and fills the selected ones teal', () => {
    render(
      <PianoKeyboard label="Keyboard" range={ONE_OCTAVE} selectable selected={new Set([C4])} />,
    )
    const c = screen.getByRole('button', { name: 'C4' })
    expect(c).toHaveAttribute('aria-pressed', 'true')
    expect(c).toHaveClass('bg-primary')
    expect(screen.getByRole('button', { name: 'D4' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('lights the key sounding now over its mark', () => {
    const marks = new Map<Midi, KeyMark>([[C4, { tone: 'root', label: '1' }]])
    render(<PianoKeyboard label="Keyboard" range={ONE_OCTAVE} marks={marks} lit={new Set([C4])} />)
    const c = screen.getByRole('button', { name: 'C4' })
    expect(c).toHaveClass('bg-primary')
    expect(c).toHaveTextContent('1')
  })

  it('shows a wrong key and an outlined one', () => {
    render(
      <PianoKeyboard
        label="Keyboard"
        range={ONE_OCTAVE}
        wrong={new Set([midi(64)])}
        outlined={new Set([midi(67)])}
      />,
    )
    expect(screen.getByRole('button', { name: 'E4' })).toHaveClass('bg-destructive')
    expect(screen.getByRole('button', { name: 'G4' })).toHaveClass('ring-primary')
  })
})
