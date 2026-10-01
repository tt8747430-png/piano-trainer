import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Settings } from 'lucide-react'
import { describe, expect, it, vi } from 'vitest'
import { note, noteName, noteParam, rootSpelling } from '@/shared/lib/music'
import { ButtonLink } from './ButtonLink'
import { ChordSizeField } from './ChordSizeField'
import { Dropdown } from './Dropdown'
import { InversionChoice } from './InversionChoice'
import { LevelMark } from './LevelMark'
import { NamedSegmented } from './NamedSegmented'
import { NoteDropdown } from './NoteDropdown'
import { PlayLabel } from './PlayLabel'
import { RatingMark } from './RatingMark'
import { RoundButton } from './RoundButton'
import { RoundLink } from './RoundLink'
import { RowGroup } from './RowGroup'
import { RowLink } from './RowLink'
import { ScreenHeader } from './ScreenHeader'
import { Segmented } from './Segmented'
import { SwitchRow } from './SwitchRow'
import { ToneChip } from './ToneChip'
import { TypedField } from './TypedField'

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

describe('PlayLabel', () => {
  it('says what its button plays, and Stop while it sounds', () => {
    const { rerender } = render(
      <button type="button">
        <PlayLabel playing={false}>Play up and down</PlayLabel>
      </button>,
    )
    expect(screen.getByRole('button', { name: 'Play up and down' })).toBeInTheDocument()
    rerender(
      <button type="button">
        <PlayLabel playing>Play up and down</PlayLabel>
      </button>,
    )
    expect(screen.getByRole('button', { name: 'Stop' })).toBeInTheDocument()
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
    expect(screen.getByRole('radiogroup', { name: 'Mode' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Step' })).toHaveAttribute('aria-checked', 'true')
    await user.click(screen.getByRole('radio', { name: 'Wait' }))
    expect(onChange).toHaveBeenCalledWith('wait')
  })

  it('keeps a choice when the chosen segment is pressed again', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Segmented label="Mode" value="step" options={MODES} onChange={onChange} />)
    await user.click(screen.getByRole('radio', { name: 'Step' }))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('moves to the next segment with the arrows, choosing it', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Segmented label="Mode" value="step" options={MODES} onChange={onChange} />)
    screen.getByRole('radio', { name: 'Step' }).focus()
    await user.keyboard('{ArrowRight}')
    expect(onChange).toHaveBeenCalledWith('wait')
  })

  it('hands a number back as a number', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const inversions = [
      { value: 0, label: 'Root' },
      { value: 1, label: '1st' },
    ]
    render(<Segmented label="Inversion" value={0} options={inversions} onChange={onChange} />)
    await user.click(screen.getByRole('radio', { name: '1st' }))
    expect(onChange).toHaveBeenCalledWith(1)
  })
})

describe('NamedSegmented', () => {
  it('shows its name beside the segments, and is named by it once', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<NamedSegmented label="Mode" value="step" options={MODES} onChange={onChange} />)
    expect(screen.getByText('Mode')).toBeVisible()
    expect(screen.getByRole('radiogroup', { name: 'Mode' })).toBeInTheDocument()
    await user.click(screen.getByRole('radio', { name: 'Wait' }))
    expect(onChange).toHaveBeenCalledWith('wait')
  })
})

describe('InversionChoice', () => {
  it('offers root position and each inversion the chord has, at most three', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const { rerender } = render(<InversionChoice notes={3} value={0} onChange={onChange} />)
    const group = screen.getByRole('radiogroup', { name: 'Inversion' })
    expect(
      within(group)
        .getAllByRole('radio')
        .map((b) => b.textContent),
    ).toEqual(['Root', '1st', '2nd'])
    await user.click(screen.getByRole('radio', { name: '2nd' }))
    expect(onChange).toHaveBeenCalledWith(2)
    rerender(<InversionChoice notes={7} value={0} onChange={onChange} />)
    expect(within(group).getAllByRole('radio')).toHaveLength(4)
  })
})

describe('ChordSizeField', () => {
  it('chooses how much of each chord plays: triads, 7ths or 9ths', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<ChordSizeField value="triads" onChange={onChange} />)
    expect(screen.getByRole('radiogroup', { name: 'Chord size' })).toBeInTheDocument()
    await user.click(screen.getByRole('radio', { name: '9ths' }))
    expect(onChange).toHaveBeenCalledWith('ninths')
  })
})

describe('ToneChip', () => {
  it('shows a tone’s degree in its colour, then its note', () => {
    render(
      <>
        <ToneChip face="3rd" degree="♭3" note="E♭" />
        <ToneChip face="tonic" degree="1" note="C" />
      </>,
    )
    expect(screen.getByText('♭3')).toHaveClass('bg-role-3rd')
    expect(screen.getByText('♭3').parentElement).toHaveTextContent('♭3E♭')
    expect(screen.getByText('1')).toHaveClass('bg-key-tonic')
  })
})

describe('TypedField', () => {
  it('reports what is typed, and says under it why it cannot be read', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const { rerender } = render(
      <TypedField label="From" value="C" error={null} onChange={onChange} />,
    )
    const field = screen.getByRole('textbox', { name: 'From' })
    expect(field).toHaveAttribute('aria-invalid', 'false')
    await user.type(field, 'm')
    expect(onChange).toHaveBeenCalledWith('Cm')
    rerender(
      <TypedField label="From" value="Qx" error="This chord can’t be read." onChange={onChange} />,
    )
    expect(field).toHaveAttribute('aria-invalid', 'true')
    expect(field).toHaveAccessibleDescription('This chord can’t be read.')
  })

  it('says nothing while the field is empty: the learner is typing again', () => {
    render(
      <TypedField label="From" value=" " error="This chord can’t be read." onChange={() => {}} />,
    )
    expect(screen.getByRole('textbox', { name: 'From' })).toHaveAttribute('aria-invalid', 'false')
    expect(screen.queryByText('This chord can’t be read.')).toBeNull()
  })
})

describe('SwitchRow', () => {
  it('is a switch named by its label, its note under the label', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(
      <SwitchRow
        label="Recording"
        detail="Only in G major"
        checked={false}
        disabled
        onCheckedChange={onCheckedChange}
      />,
    )
    const toggle = screen.getByRole('switch', { name: /^Recording/ })
    expect(screen.getByText('Only in G major')).toBeInTheDocument()
    expect(toggle).toHaveAttribute('aria-disabled', 'true')
    await user.click(toggle)
    expect(onCheckedChange).not.toHaveBeenCalled()
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

describe('NoteDropdown', () => {
  it('offers the twelve notes as its rule spells them, and reports the one chosen', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <NoteDropdown
        label="Root"
        value={noteParam(note('C'))}
        spell={(pc) => rootSpelling(pc, false)}
        onChange={onChange}
      />,
    )
    await user.click(screen.getByRole('combobox', { name: 'Root' }))
    expect(await screen.findAllByRole('option')).toHaveLength(12)
    await user.click(screen.getByRole('option', { name: 'D♭' }))
    expect(onChange).toHaveBeenCalledWith(noteParam(note('D', -1)))
  })

  it('names each note by its own rule where it gives one', async () => {
    const user = userEvent.setup()
    render(
      <NoteDropdown
        label="Key"
        value={noteParam(note('C'))}
        spell={(pc) => rootSpelling(pc, false)}
        name={(tonic) => `${noteName(tonic)} major`}
        onChange={() => {}}
      />,
    )
    expect(screen.getByRole('combobox', { name: 'Key' })).toHaveTextContent('C major')
    await user.click(screen.getByRole('combobox', { name: 'Key' }))
    expect(await screen.findByRole('option', { name: 'E♭ major' })).toBeInTheDocument()
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
