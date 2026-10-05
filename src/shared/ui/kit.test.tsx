import { act, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Settings } from 'lucide-react'
import { describe, expect, it, vi } from 'vitest'
import { keyParam, note, noteName, noteParam, rootSpelling } from '@/shared/lib/music'
import { ButtonLink } from './ButtonLink'
import { ChordSizeField } from './ChordSizeField'
import { Dropdown } from './Dropdown'
import { InversionChoice } from './InversionChoice'
import { LevelMark } from './LevelMark'
import { NamedSegmented } from './NamedSegmented'
import { KeyPicker } from './KeyPicker'
import { NotePicker } from './NotePicker'
import { Pinned } from './Pinned'
import { PlayLabel } from './PlayLabel'
import { RatingMark } from './RatingMark'
import { RoundButton } from './RoundButton'
import { RoundLink } from './RoundLink'
import { RowGroup } from './RowGroup'
import { RowLink } from './RowLink'
import { ScreenBarProvider } from './ScreenBarProvider'
import { ScreenHeader } from './ScreenHeader'
import { Segmented } from './Segmented'
import { SwitchRow } from './SwitchRow'
import { ToggleChips } from './ToggleChips'
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
  const scrollTo = (y: number) => {
    vi.spyOn(window, 'scrollY', 'get').mockReturnValue(y)
    act(() => void window.dispatchEvent(new Event('scroll')))
  }
  const renderBar = () => {
    render(
      <ScreenBarProvider>
        <ScreenHeader title="Chords" back={<button type="button">Back</button>} />
        <Pinned>The keys</Pinned>
      </ScreenBarProvider>,
    )
    const bar = screen.getByRole('heading', { level: 1, name: 'Chords' }).closest('header')
    const pinned = screen.getByText('The keys')
    // jsdom lays nothing out: the pinned keys' `top` is the bar's height through `--screen-bar`.
    const under = () =>
      pinned
        .closest<HTMLElement>('[data-slot="screen-bar-root"]')
        ?.style.getPropertyValue('--screen-bar')
    expect(pinned).toHaveClass('top-screen-bar')
    return { bar, under }
  }

  it('hides while the page scrolls down and comes back on the way up, the pinned keys under it', async () => {
    const { bar, under } = renderBar()
    await waitFor(() => expect(under()).toBe('64px'))
    expect(bar).not.toHaveAttribute('data-hidden')
    scrollTo(120)
    expect(bar).toHaveAttribute('data-hidden')
    expect(under()).toBe('0px')
    scrollTo(80)
    expect(bar).not.toHaveAttribute('data-hidden')
    expect(under()).toBe('64px')
  })

  it('stays while focus is inside it', async () => {
    const user = userEvent.setup()
    const { bar } = renderBar()
    await user.click(screen.getByRole('button', { name: 'Back' }))
    scrollTo(300)
    expect(bar).not.toHaveAttribute('data-hidden')
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

  it('shows its value alone under a printed name, still named for a screen reader', () => {
    render(<Dropdown bare label="Root" value="C" options={ROOTS} onChange={vi.fn()} />)
    const trigger = screen.getByRole('combobox', { name: 'Root' })
    expect(trigger).toHaveTextContent('C')
    expect(trigger).not.toHaveTextContent('Root')
  })
})

describe('ToggleChips', () => {
  const SIGNS = [
    { value: 'b9', label: '♭9', title: 'Flat 9th' },
    { value: 's9', label: '#9' },
    { value: 's11', label: '#11' },
  ] as const

  it('shows every choice as a chip, the chosen ones pressed', () => {
    render(<ToggleChips label="Alterations" value={['s9']} options={SIGNS} onChange={vi.fn()} />)
    const chips = within(screen.getByRole('group', { name: 'Alterations' })).getAllByRole('button')
    expect(chips.map((chip) => chip.textContent)).toEqual(['♭9', '#9', '#11'])
    expect(chips.map((chip) => chip.getAttribute('aria-pressed'))).toEqual([
      'false',
      'true',
      'false',
    ])
    expect(screen.getByRole('button', { name: 'Flat 9th' })).toBe(chips[0])
  })

  it('turns one on or off, reporting the chosen in the options’ order', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<ToggleChips label="Alterations" value={['s9']} options={SIGNS} onChange={onChange} />)
    await user.click(screen.getByRole('button', { name: 'Flat 9th' }))
    expect(onChange).toHaveBeenLastCalledWith(['b9', 's9'])
    await user.click(screen.getByRole('button', { name: '#9' }))
    expect(onChange).toHaveBeenLastCalledWith([])
  })
})

describe('NotePicker', () => {
  it('shows the twelve notes as its rule spells them, and reports the one tapped', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <NotePicker
        label="Root"
        value={noteParam(note('C'))}
        spell={(pc) => rootSpelling(pc, false)}
        onChange={onChange}
      />,
    )
    const notes = within(screen.getByRole('radiogroup', { name: 'Root' })).getAllByRole('radio')
    expect(notes).toHaveLength(12)
    await user.click(screen.getByRole('radio', { name: 'D♭' }))
    expect(onChange).toHaveBeenCalledWith(noteParam(note('D', -1)))
  })

  it('names each note by its own rule where it gives one', () => {
    render(
      <NotePicker
        label="Key"
        value={noteParam(note('C'))}
        spell={(pc) => rootSpelling(pc, false)}
        name={(tonic) => `${noteName(tonic)} major`}
        onChange={() => {}}
      />,
    )
    expect(screen.getByRole('radio', { name: 'C major' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'E♭ major' })).toBeInTheDocument()
  })
})

describe('KeyPicker', () => {
  const C_MAJOR = keyParam({ tonic: note('C'), minor: false })
  const C_SHARP_MINOR = keyParam({ tonic: note('C', 1), minor: true })

  it('shows all 24 keys at once, each under its one name, the major keys over the minor', () => {
    render(<KeyPicker value={C_MAJOR} onChange={() => {}} />)
    const keys = within(screen.getByRole('radiogroup', { name: 'Key' })).getAllByRole('radio')
    expect(keys.map((key) => key.textContent)).toEqual([
      ...['C', 'D♭', 'D', 'E♭', 'E', 'F', 'F#', 'G', 'A♭', 'A', 'B♭', 'B'],
      ...['Cm', 'C#m', 'Dm', 'D#m', 'Em', 'Fm', 'F#m', 'Gm', 'G#m', 'Am', 'B♭m', 'Bm'],
    ])
    expect(screen.getByRole('radio', { name: 'C major' })).toBeChecked()
  })

  it('reports the key tapped, and keeps every name when the key shown is minor', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const { rerender } = render(<KeyPicker value={C_MAJOR} onChange={onChange} />)
    const names = () => screen.getAllByRole('radio').map((key) => key.textContent)
    const before = names()
    await user.click(screen.getByRole('radio', { name: 'C# minor' }))
    expect(onChange).toHaveBeenCalledWith(C_SHARP_MINOR)
    rerender(<KeyPicker value={C_SHARP_MINOR} onChange={onChange} />)
    expect(names()).toEqual(before)
    expect(screen.getByRole('radio', { name: 'C# minor' })).toBeChecked()
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
        render={<a href="/practice/chords" />}
      />,
    )
    const link = screen.getByRole('link', { name: 'Chords Beginner' })
    expect(link).toHaveAttribute('href', '/practice/chords')
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
