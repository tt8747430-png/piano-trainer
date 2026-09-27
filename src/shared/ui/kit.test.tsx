import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Settings } from 'lucide-react'
import { describe, expect, it, vi } from 'vitest'
import { ButtonLink } from './ButtonLink'
import { Dropdown } from './Dropdown'
import { LevelMark } from './LevelMark'
import { RatingMark } from './RatingMark'
import { RoundButton } from './RoundButton'
import { RoundLink } from './RoundLink'
import { RowGroup } from './RowGroup'
import { RowLink } from './RowLink'
import { ScreenHeader } from './ScreenHeader'
import { Segmented } from './Segmented'

const MODES = [
  { value: 'listen', label: 'Listen' },
  { value: 'step', label: 'Step' },
  { value: 'wait', label: 'Wait' },
] as const

describe('ScreenHeader', () => {
  it('titles the screen with its level-1 heading and holds its actions', () => {
    render(<ScreenHeader title="Path" actions={<button type="button">Settings</button>} />)
    expect(screen.getByRole('heading', { level: 1, name: 'Path' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Settings' })).toBeInTheDocument()
  })
})

describe('RoundButton', () => {
  it('is named by its label, not its icon', () => {
    render(<RoundButton label="Settings" icon={Settings} />)
    expect(screen.getByRole('button', { name: 'Settings' })).toHaveClass('rounded-full')
  })
})

describe('RoundLink', () => {
  it('is a link named by its label, looking like a round button', () => {
    render(<RoundLink label="Settings" icon={Settings} render={<a href="/settings" />} />)
    expect(screen.getByRole('link', { name: 'Settings' })).toHaveClass('rounded-full', 'size-11')
  })
})

describe('ButtonLink', () => {
  it('keeps a link a link while it looks like a button', () => {
    render(<ButtonLink render={<a href="/songs" />}>Songs</ButtonLink>)
    expect(screen.getByRole('link', { name: 'Songs' })).toHaveClass('bg-primary', 'h-11')
  })
})

describe('Segmented', () => {
  it('marks the chosen segment and reports another choice', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Segmented label="Mode" value="step" options={MODES} onChange={onChange} />)
    expect(screen.getByRole('button', { name: 'Step' })).toHaveAttribute('aria-pressed', 'true')
    await user.click(screen.getByRole('button', { name: 'Wait' }))
    expect(onChange).toHaveBeenCalledWith('wait')
  })

  it('keeps a choice when the chosen segment is pressed again', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Segmented label="Mode" value="step" options={MODES} onChange={onChange} />)
    await user.click(screen.getByRole('button', { name: 'Step' }))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('hands a number back as a number', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const inversions = [
      { value: 0, label: 'Root' },
      { value: 1, label: '1st' },
    ]
    render(<Segmented label="Inversion" value={0} options={inversions} onChange={onChange} />)
    await user.click(screen.getByRole('button', { name: '1st' }))
    expect(onChange).toHaveBeenCalledWith(1)
  })
})

describe('marks', () => {
  it('names a rating in words', () => {
    render(<RatingMark rating="gap" />)
    expect(screen.getByText('Gap')).toHaveClass('sr-only')
  })

  it('names a level in words', () => {
    render(<LevelMark level={2} />)
    expect(screen.getByRole('img', { name: 'Level 2' })).toBeInTheDocument()
  })
})

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
  it('is a link named by its title and detail, its tile in its paint', () => {
    render(
      <RowLink
        title="Chords"
        detail="Beginner"
        icon={Settings}
        paint="sand"
        render={<a href="/learn/chords" />}
      />,
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
    expect(screen.getByRole('region', { name: 'References' })).toContainElement(
      screen.getByText('Chords'),
    )
  })
})
