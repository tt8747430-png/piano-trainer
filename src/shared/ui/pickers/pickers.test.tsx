import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { note, pitchClass } from '@/shared/lib/music'
import { KeyCircle } from './KeyCircle'
import { KeyPicker } from './KeyPicker'
import { KeysChecklist } from './KeysChecklist'
import { MenuPicker } from './MenuPicker'
import { NotePicker } from './NotePicker'
import { PickerRow } from './PickerRow'
import { PitchPicker } from './PitchPicker'

const names = (group: HTMLElement) =>
  within(group)
    .getAllByRole('radio')
    .map((each) => each.textContent)

describe('PitchPicker', () => {
  it('opens an octave of twelve keys, each by its usual name, the chosen one checked', async () => {
    const user = userEvent.setup()
    render(<PitchPicker label="Root" value={pitchClass(3)} onChange={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: 'Root: E♭' }))
    const octave = await screen.findByRole('radiogroup', { name: 'Root' })
    expect(names(octave)).toEqual(['C', 'D♭', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'])
    expect(within(octave).getByRole('radio', { name: 'E♭' })).toBeChecked()
  })

  it('moves with the arrows, chooses with Enter and closes', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<PitchPicker label="Root" value={pitchClass(0)} onChange={onChange} />)
    await user.click(screen.getByRole('button', { name: 'Root: C' }))
    const octave = await screen.findByRole('radiogroup', { name: 'Root' })
    within(octave).getByRole('radio', { name: 'C' }).focus()
    await user.keyboard('{ArrowRight}{ArrowDown}')
    expect(within(octave).getByRole('radio', { name: 'F' })).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(onChange).toHaveBeenLastCalledWith(pitchClass(5))
    expect(screen.queryByRole('radiogroup', { name: 'Root' })).not.toBeInTheDocument()
  })

  it('closes on Esc, choosing nothing', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<PitchPicker label="Root" value={pitchClass(0)} onChange={onChange} />)
    await user.click(screen.getByRole('button', { name: 'Root: C' }))
    await screen.findByRole('radiogroup', { name: 'Root' })
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('radiogroup', { name: 'Root' })).not.toBeInTheDocument()
    expect(onChange).not.toHaveBeenCalled()
  })
})

describe('NotePicker', () => {
  it('splits each black key in two, a tap on a half choosing that spelling', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<NotePicker label="Root" value={note('D')} onChange={onChange} />)
    await user.click(screen.getByRole('button', { name: 'Root: D' }))
    const octave = await screen.findByRole('radiogroup', { name: 'Root' })
    // Seventeen spellings, none an impossible one: no E♯, F♭, B♯ or C♭.
    expect(names(octave)).toEqual([
      'C',
      'C♯',
      'D♭',
      'D',
      'D♯',
      'E♭',
      'E',
      'F',
      'F♯',
      'G♭',
      'G',
      'G♯',
      'A♭',
      'A',
      'A♯',
      'B♭',
      'B',
    ])
    expect(within(octave).getByRole('radio', { name: 'D' })).toBeChecked()
    await user.click(within(octave).getByRole('radio', { name: 'C♯' }))
    expect(onChange).toHaveBeenLastCalledWith(note('C', 1))
  })

  it('returns the flat half’s spelling', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<NotePicker label="Root" value={note('D')} onChange={onChange} />)
    await user.click(screen.getByRole('button', { name: 'Root: D' }))
    await user.click(await screen.findByRole('radio', { name: 'D♭' }))
    expect(onChange).toHaveBeenLastCalledWith(note('D', -1))
  })
})

describe('KeyPicker', () => {
  it('opens the key-signature grid: a tap on 5♭ takes D♭ major and closes (R29-P2)', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<KeyPicker value={{ tonic: note('C'), minor: false }} onChange={onChange} />)
    await user.click(screen.getByRole('button', { name: 'Key: C major' }))
    const sharps = await screen.findByRole('group', { name: 'Sharps' })
    expect(within(sharps).getAllByRole('button')).toHaveLength(7)
    expect(
      within(screen.getByRole('group', { name: 'Flats' })).getAllByRole('button'),
    ).toHaveLength(7)
    // One name per key: C♯ is 7♯, D♭ 5♭, each a cell of its own; no circle.
    expect(within(sharps).getByRole('button', { name: 'C♯ major' })).toBeInTheDocument()
    expect(document.querySelector('[data-wedge]')).toBeNull()
    await user.click(screen.getByRole('button', { name: 'D♭ major' }))
    expect(onChange).toHaveBeenLastCalledWith({ tonic: note('D', -1), minor: false })
    expect(screen.queryByRole('group', { name: 'Sharps' })).not.toBeInTheDocument()
  })

  it('names the minor keys in Minor', async () => {
    const user = userEvent.setup()
    render(<KeyPicker value={{ tonic: note('A'), minor: true }} onChange={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: 'Key: A minor' }))
    const sharps = await screen.findByRole('group', { name: 'Sharps' })
    expect(within(sharps).getByRole('button', { name: 'E minor' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /No sharps or flats · A minor/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })
})

describe('KeyCircle', () => {
  it('reaches both halves of a split wedge, the minors inside', async () => {
    const onChoose = vi.fn()
    const user = userEvent.setup()
    render(<KeyCircle label="Key" value={{ tonic: note('C'), minor: false }} onChoose={onChoose} />)
    const circle = screen.getByRole('radiogroup', { name: 'Key' })
    await user.click(within(circle).getByRole('radio', { name: 'F♯ major' }))
    expect(onChoose).toHaveBeenLastCalledWith({ tonic: note('F', 1), minor: false })
    await user.click(within(circle).getByRole('radio', { name: 'G♭ major' }))
    expect(onChoose).toHaveBeenLastCalledWith({ tonic: note('G', -1), minor: false })
    await user.click(within(circle).getByRole('radio', { name: 'E♭ minor' }))
    expect(onChoose).toHaveBeenLastCalledWith({ tonic: note('E', -1), minor: true })
    expect(within(circle).getAllByRole('radio')).toHaveLength(30)
  })

  it('goes round a ring with ← →, crosses to the minors with ↓, chooses with Enter', async () => {
    const onChoose = vi.fn()
    const user = userEvent.setup()
    render(<KeyCircle label="Key" value={{ tonic: note('C'), minor: false }} onChoose={onChoose} />)
    const c = screen.getByRole('radio', { name: 'C major' })
    expect(c).toBeChecked()
    c.focus()
    await user.keyboard('{ArrowRight}{ArrowDown}{Enter}')
    expect(onChoose).toHaveBeenLastCalledWith({ tonic: note('E'), minor: true })
    await user.keyboard('{ArrowLeft}{ArrowLeft}{Enter}')
    expect(onChoose).toHaveBeenLastCalledWith({ tonic: note('D'), minor: true })
  })
})

describe('MenuPicker', () => {
  const QUALITIES = [
    { value: 'maj', label: 'Major' },
    { value: 'min', label: 'Minor' },
    { value: 'power', label: 'Power', reason: 'Not here' },
  ] as const

  it('shows its value with its name, opens a list and chooses from it', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <PickerRow label="Chord">
        <MenuPicker label="Quality" value="maj" options={QUALITIES} onChange={onChange} />
      </PickerRow>,
    )
    const row = screen.getByRole('group', { name: 'Chord' })
    await user.click(within(row).getByRole('button', { name: 'Quality: Major' }))
    const list = await screen.findByRole('listbox', { name: 'Quality' })
    expect(within(list).getByRole('option', { name: 'Major' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    // What cannot be chosen here is not offered.
    expect(within(list).queryByRole('option', { name: 'Power' })).not.toBeInTheDocument()
    await user.keyboard('{ArrowDown}{Enter}')
    expect(onChange).toHaveBeenLastCalledWith('min')
    expect(screen.queryByRole('listbox', { name: 'Quality' })).not.toBeInTheDocument()
  })
})

describe('KeysChecklist', () => {
  it('lists the fifteen signatures, Select all, Clear all, and applies the keys checked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <KeysChecklist
        label="Keys"
        value={[{ tonic: note('C'), minor: false }]}
        onChange={onChange}
      />,
    )
    await user.click(screen.getByRole('button', { name: /Keys/ }))
    const rows = await screen.findAllByRole('checkbox')
    expect(rows).toHaveLength(15)
    expect(screen.getByRole('checkbox', { name: 'C major / A minor' })).toBeChecked()
    await user.click(screen.getByRole('checkbox', { name: 'D major / B minor' }))
    await user.click(screen.getByRole('button', { name: 'Apply' }))
    expect(onChange).toHaveBeenLastCalledWith([
      { tonic: note('C'), minor: false },
      { tonic: note('D'), minor: false },
    ])
  })

  it('waits for one key at least before it applies', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <KeysChecklist
        label="Keys"
        value={[{ tonic: note('C'), minor: false }]}
        onChange={onChange}
      />,
    )
    await user.click(screen.getByRole('button', { name: /Keys/ }))
    await user.click(await screen.findByRole('button', { name: 'Clear all' }))
    expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled()
    await user.click(screen.getByRole('button', { name: 'Select all' }))
    await user.click(screen.getByRole('button', { name: 'Apply' }))
    expect(onChange.mock.lastCall?.[0]).toHaveLength(15)
  })
})
