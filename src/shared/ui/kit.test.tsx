import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Settings } from 'lucide-react'
import { describe, expect, it, vi } from 'vitest'
import { ButtonLink } from './ButtonLink'
import { ChipRow } from './ChipRow'
import { LevelMark } from './LevelMark'
import { RatingMark } from './RatingMark'
import { RoleLegend } from './RoleLegend'
import { RoundButton } from './RoundButton'
import { RoundLink } from './RoundLink'
import { ScreenHeader } from './ScreenHeader'
import { Segmented } from './Segmented'

const MODES = [
  { value: 'listen', label: 'Listen' },
  { value: 'step', label: 'Step' },
  { value: 'turn', label: 'Your turn' },
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
    await user.click(screen.getByRole('button', { name: 'Your turn' }))
    expect(onChange).toHaveBeenCalledWith('turn')
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

describe('ChipRow', () => {
  it('names chips by their title when they have one', () => {
    render(
      <ChipRow
        label="Quality"
        value="d7"
        options={[
          { value: 'maj7', label: 'Maj7', title: 'Major 7th' },
          { value: 'd7', label: '7', title: 'Dominant 7th' },
        ]}
        onChange={() => {}}
      />,
    )
    expect(screen.getByRole('button', { name: 'Dominant 7th' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByRole('group', { name: 'Quality' })).toBeInTheDocument()
  })

  it('scrolls the chosen chip into view within the row', () => {
    const roots = ['C', 'D', 'E', 'F', 'G', 'A', 'B'].map((note) => ({ value: note, label: note }))
    const row = (value: string) => (
      <ChipRow label="Root" value={value} options={roots} onChange={() => {}} />
    )
    const { rerender } = render(row('C'))
    const group = screen.getByRole('group', { name: 'Root' })
    // jsdom lays nothing out: give the row a width to scroll in.
    Object.defineProperties(group, { scrollWidth: { value: 800 }, clientWidth: { value: 300 } })
    const scrollTo = vi.fn()
    group.scrollTo = scrollTo
    rerender(row('G'))
    expect(scrollTo).toHaveBeenCalledOnce()
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

  it('lists the roles it is given, in that order', () => {
    render(<RoleLegend roles={['root', '3rd', '5th', '7th']} />)
    expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toEqual([
      'Root',
      '3rd',
      '5th',
      '7th',
    ])
  })
})
