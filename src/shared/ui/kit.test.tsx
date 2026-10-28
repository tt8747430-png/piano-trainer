import { act, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Settings } from 'lucide-react'
import { describe, expect, it, vi } from 'vitest'
import { keyParam, note, noteName, noteParam, writtenKeyAccidentals } from '@/shared/lib/music'
import { ButtonLink } from './ButtonLink'
import { ChordSizeField } from './ChordSizeField'
import { Dropdown } from './Dropdown'
import { FactCard } from './FactCard'
import { InversionChoice } from './InversionChoice'
import { RankMark } from './RankMark'
import { NamedSegmented } from './NamedSegmented'
import { KeyChoice } from './KeyChoice'
import { Labelled } from './Labelled'
import { MenuSection } from './MenuSection'
import { NoteChoice } from './NoteChoice'
import { optionName } from './option'
import { Pinned } from './Pinned'
import { PlayLabel } from './PlayLabel'
import { RatingMark } from './RatingMark'
import { RoundButton } from './RoundButton'
import { RoundLink } from './RoundLink'
import { RowButton } from './RowButton'
import { RowCheck } from './RowCheck'
import { RowGroup } from './RowGroup'
import { RowLink } from './RowLink'
import { ScreenBarProvider } from './ScreenBarProvider'
import { ScreenHeader } from './ScreenHeader'
import { Segmented } from './Segmented'
import { SettingField } from './SettingField'
import { SwitchRow } from './SwitchRow'
import { ToggleChips } from './ToggleChips'
import { ToggleTile } from './ToggleTile'
import { TypedField } from './TypedField'

const MODES = [
  { value: 'listen', label: 'Listen' },
  { value: 'step', label: 'Step' },
  { value: 'wait', label: 'Wait' },
] as const

describe('ScreenHeader', () => {
  it('titles the screen with its level-1 heading and holds its actions', () => {
    render(<ScreenHeader title="Learn" actions={<button type="button">Settings</button>} />)
    expect(screen.getByRole('heading', { level: 1, name: 'Learn' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Settings' })).toBeInTheDocument()
  })

  it('holds a subject’s tabs in the bar, under the title', () => {
    render(<ScreenHeader title="Chords" tabs={<nav aria-label="Chords" />} />)
    const bar = screen.getByRole('banner')
    expect(within(bar).getByRole('navigation', { name: 'Chords' })).toBeInTheDocument()
  })

  it('keeps the title beside one or two actions, and under three or more on a phone, two lines at most', () => {
    const { rerender } = render(
      <ScreenHeader
        title="Wonderful Grace of Jesus"
        actions={<button type="button">Edit</button>}
      />,
    )
    const title = screen.getByRole('heading', { level: 1 })
    expect(title).not.toHaveClass('max-sm:basis-full')
    rerender(
      <ScreenHeader
        title="Wonderful Grace of Jesus"
        crowded
        actions={
          <>
            <button type="button">Edit</button>
            <button type="button">Learned</button>
            <button type="button">More</button>
          </>
        }
      />,
    )
    expect(title).toHaveClass('max-sm:order-last', 'max-sm:basis-full', 'max-sm:line-clamp-2')
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

  it('stays until the page has scrolled past it', async () => {
    const { bar, under } = renderBar()
    await waitFor(() => expect(under()).toBe('64px'))
    scrollTo(40)
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
  it('is named by its label, not its icon, and says it when pointed at, as a round link does', () => {
    render(<RoundButton label="Settings" icon={Settings} />)
    const button = screen.getByRole('button', { name: 'Settings' })
    expect(button).toHaveClass('rounded-full')
    expect(button).toHaveAttribute('title', 'Settings')
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

  it('greys a segment that cannot be chosen, saying why in its tooltip and to a screen reader', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const options = [
      { value: 0, label: 'Root' },
      { value: 1, label: '1st', reason: 'Its keys run past B4' },
    ]
    render(<Segmented label="Inversion" value={0} options={options} onChange={onChange} />)
    const greyed = screen.getByRole('radio', { name: '1st' })
    expect(greyed).toHaveAttribute('data-disabled')
    expect(greyed).toHaveAttribute('title', 'Its keys run past B4')
    expect(greyed).toHaveAccessibleDescription('Its keys run past B4')
    await user.click(greyed)
    expect(onChange).not.toHaveBeenCalled()
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

  it('greys each inversion that cannot be chosen with its reason, and may choose none', () => {
    render(
      <InversionChoice
        notes={3}
        value={null}
        greyed={(inversion) => (inversion === 2 ? 'Its keys run past B4' : undefined)}
        onChange={vi.fn()}
      />,
    )
    const radios = screen.getAllByRole('radio')
    expect(radios.map((radio) => radio.getAttribute('title'))).toEqual([
      null,
      null,
      'Its keys run past B4',
    ])
    expect(radios.every((radio) => radio.getAttribute('aria-checked') === 'false')).toBe(true)
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
  it('is a switch named by its label alone, turned by a tap anywhere on its row', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(<SwitchRow label="Metronome" checked={false} onCheckedChange={onCheckedChange} />)
    expect(screen.getByRole('switch', { name: 'Metronome' })).toBeInTheDocument()
    await user.click(screen.getByText('Metronome'))
    expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything())
  })

  it('says what it does in a popover beside its name, never in a line under it', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(
      <SwitchRow
        label="Metronome"
        info="The beat goes on after the count-in"
        checked={false}
        onCheckedChange={onCheckedChange}
      />,
    )
    expect(screen.getByRole('switch', { name: 'Metronome' })).toBeInTheDocument()
    expect(screen.queryByText('The beat goes on after the count-in')).toBeNull()
    await user.click(screen.getByRole('button', { name: 'About Metronome' }))
    expect(await screen.findByRole('dialog', { name: 'Metronome' })).toHaveTextContent(
      'The beat goes on after the count-in',
    )
    // The ⓘ opens the explanation and turns nothing.
    expect(onCheckedChange).not.toHaveBeenCalled()
  })

  it('turns nothing while disabled', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(
      <SwitchRow label="Recording" checked={false} disabled onCheckedChange={onCheckedChange} />,
    )
    const toggle = screen.getByRole('switch', { name: 'Recording' })
    expect(toggle).toHaveAttribute('aria-disabled', 'true')
    await user.click(toggle)
    await user.click(screen.getByText('Recording'))
    expect(onCheckedChange).not.toHaveBeenCalled()
  })
})

describe('a choice’s explanation', () => {
  const TOUCH = 'How hard a key must be struck to sound loud'
  const touch = (
    <Segmented
      label="Touch"
      value="normal"
      options={[
        { value: 'light', label: 'Light' },
        { value: 'normal', label: 'Normal' },
      ]}
      onChange={() => {}}
    />
  )

  it.each([
    [
      'a setting',
      <SettingField key="setting" label="Touch" info={TOUCH}>
        {touch}
      </SettingField>,
    ],
    [
      'a labelled field',
      <Labelled key="labelled" label="Touch" info={TOUCH}>
        {touch}
      </Labelled>,
    ],
    [
      'a menu’s group',
      <MenuSection key="menu" title="Touch" info={TOUCH}>
        {touch}
      </MenuSection>,
    ],
  ])('is a popover beside %s’s name, never a line under it', async (_, field) => {
    const user = userEvent.setup()
    render(field)
    expect(screen.getByText('Touch')).toBeInTheDocument()
    expect(screen.getByRole('radiogroup', { name: 'Touch' })).toBeInTheDocument()
    expect(screen.queryByText(TOUCH)).toBeNull()
    await user.click(screen.getByRole('button', { name: 'About Touch' }))
    expect(await screen.findByRole('dialog', { name: 'Touch' })).toHaveTextContent(TOUCH)
  })

  it('is left out where a choice has none', () => {
    render(
      <SettingField label="Touch">
        <span>Light</span>
      </SettingField>,
    )
    expect(screen.queryByRole('button', { name: /^About/ })).toBeNull()
  })
})

describe('ToggleTile', () => {
  it('says what it does in its tooltip, never in a line on it', () => {
    render(
      <ToggleTile
        label="Glissando"
        tip="A swipe plays the keys"
        icon={Settings}
        pressed={false}
        onPressedChange={() => {}}
      />,
    )
    const tile = screen.getByRole('button', { name: 'Glissando' })
    expect(tile).toHaveAccessibleDescription('A swipe plays the keys')
    expect(tile).toHaveAttribute('title', 'A swipe plays the keys')
    expect(tile).not.toHaveTextContent('A swipe plays the keys')
  })

  it('closed, still says why when pointed at', () => {
    render(
      <ToggleTile
        label="Recording"
        tip="Only in D minor"
        icon={Settings}
        pressed={false}
        disabled
        onPressedChange={() => {}}
      />,
    )
    const tile = screen.getByRole('button', { name: 'Recording' })
    expect(tile).toBeDisabled()
    expect(tile).toHaveAccessibleDescription('Only in D minor')
  })
})

describe('marks', () => {
  it('names a rating in words', () => {
    render(<RatingMark rating="gap" />)
    expect(screen.getByText('Gap')).toHaveClass('sr-only')
  })

  it('names a rank by its label', () => {
    render(<RankMark rank={2} label="Intermediate" />)
    expect(screen.getByRole('img', { name: 'Intermediate' })).toBeInTheDocument()
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

  it('takes a choice typed on its closed button', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Dropdown label="Root" value="C" options={ROOTS} onChange={onChange} />)
    await user.tab()
    expect(screen.getByRole('combobox', { name: 'Root' })).toHaveFocus()
    // The list is in the page, hidden, a moment after the button takes the focus.
    await screen.findByRole('option', { name: 'D', hidden: true })
    await user.keyboard('d')
    expect(onChange).toHaveBeenCalledExactlyOnceWith('D')
  })

  it('reports no choice when its owner changes the list and the value together', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const own = { value: 'own', label: 'I–I–IV' }
    const { rerender } = render(
      <Dropdown label="Root" value="C" options={ROOTS} onChange={onChange} />,
    )
    await user.click(screen.getByRole('combobox', { name: 'Root' }))
    await user.click(await screen.findByRole('option', { name: 'D' }))
    expect(onChange).toHaveBeenCalledExactlyOnceWith('D')
    rerender(<Dropdown label="Root" value="own" options={[own, ...ROOTS]} onChange={onChange} />)
    rerender(<Dropdown label="Root" value="D" options={ROOTS} onChange={onChange} />)
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('combobox', { name: 'Root' })).toHaveTextContent('RootD')
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
    expect(screen.getByRole('button', { name: '♭9 · Flat 9th' })).toBe(chips[0])
  })

  it('turns one on or off, reporting the chosen in the options’ order', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<ToggleChips label="Alterations" value={['s9']} options={SIGNS} onChange={onChange} />)
    await user.click(screen.getByRole('button', { name: '♭9 · Flat 9th' }))
    expect(onChange).toHaveBeenLastCalledWith(['b9', 's9'])
    await user.click(screen.getByRole('button', { name: '#9' }))
    expect(onChange).toHaveBeenLastCalledWith([])
  })
})

describe('NoteChoice', () => {
  it('chooses a note from a strip of its spellings, both of a black key side by side', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<NoteChoice label="Root" value={noteParam(note('D'))} onChange={onChange} />)
    const root = screen.getByRole('group', { name: 'Root' })
    expect(
      within(root)
        .getAllByRole('radio')
        .map((each) => each.textContent),
    ).toEqual([
      'C',
      'C#',
      'D♭',
      'D',
      'D#',
      'E♭',
      'E',
      'F',
      'F#',
      'G♭',
      'G',
      'G#',
      'A♭',
      'A',
      'A#',
      'B♭',
      'B',
    ])
    expect(within(root).getByRole('radio', { name: 'D' })).toBeChecked()
    await user.click(within(root).getByRole('radio', { name: 'D♭' }))
    expect(onChange).toHaveBeenLastCalledWith(noteParam(note('D', -1)))
  })

  it('steps along the strip with ‹ and ›', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<NoteChoice label="Root" value={noteParam(note('D'))} onChange={onChange} />)
    await user.click(screen.getByRole('button', { name: 'Next: Root' }))
    expect(onChange).toHaveBeenLastCalledWith(noteParam(note('D', 1)))
    await user.click(screen.getByRole('button', { name: 'Previous: Root' }))
    expect(onChange).toHaveBeenLastCalledWith(noteParam(note('D', -1)))
  })

  it('offers only the spellings a key may take', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <NoteChoice
        label="Key"
        value={noteParam(note('C', 1))}
        accidentals={(letter) => writtenKeyAccidentals(letter, true)}
        name={(tonic) => `${noteName(tonic)} minor`}
        onChange={onChange}
      />,
    )
    const key = screen.getByRole('group', { name: 'Key' })
    expect(within(key).queryByRole('radio', { name: 'D♭' })).not.toBeInTheDocument()
    expect(screen.getByText('C# minor')).toBeInTheDocument()
    await user.click(within(key).getByRole('radio', { name: 'D#' }))
    expect(onChange).toHaveBeenLastCalledWith(noteParam(note('D', 1)))
  })
})

describe('KeyChoice', () => {
  const D_FLAT = keyParam({ tonic: note('D', -1), minor: false })

  it('chooses the tonic and the mode, writing the key as chosen', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<KeyChoice value={D_FLAT} onChange={onChange} />)
    const key = screen.getByRole('group', { name: 'Key' })
    expect(screen.getByText('D♭ major')).toBeInTheDocument()
    expect(within(key).getByRole('radio', { name: 'Major' })).toBeChecked()
    expect(within(key).getByRole('radio', { name: 'D♭' })).toBeChecked()
    expect(within(key).queryByRole('radio', { name: 'D#' })).not.toBeInTheDocument()
    await user.click(within(key).getByRole('radio', { name: 'E♭' }))
    expect(onChange).toHaveBeenLastCalledWith(keyParam({ tonic: note('E', -1), minor: false }))
  })

  it('takes the other mode on the same keys, respelled only where no signature writes it', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const { rerender } = render(<KeyChoice value={D_FLAT} onChange={onChange} />)
    await user.click(screen.getByRole('radio', { name: 'Minor' }))
    expect(onChange).toHaveBeenLastCalledWith(keyParam({ tonic: note('C', 1), minor: true }))
    rerender(<KeyChoice value={keyParam({ tonic: note('E'), minor: false })} onChange={onChange} />)
    await user.click(screen.getByRole('radio', { name: 'Minor' }))
    expect(onChange).toHaveBeenLastCalledWith(keyParam({ tonic: note('E'), minor: true }))
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

  it('shows what it holds under its title and detail', () => {
    render(
      <RowLink title="Amazing Grace" detail="Hymn" render={<a href="/songs/amazing" />}>
        <span>G G7 C D</span>
      </RowLink>,
    )
    const link = screen.getByRole('link', { name: 'Amazing Grace Hymn G G7 C D' })
    expect(
      within(link).getByText('Hymn').compareDocumentPosition(within(link).getByText('G G7 C D')),
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
  })

  it('wears a chevron, the disclosure of the page it leads to', () => {
    render(<RowLink title="Chords" render={<a href="/practice/chords" />} />)
    expect(
      screen.getByRole('link', { name: 'Chords' }).querySelector('[data-slot="row-chevron"]'),
    ).toBeInTheDocument()
  })
})

describe('RowButton', () => {
  it('opens in place as a button, a row’s tile and title with no chevron', async () => {
    const onClick = vi.fn()
    render(<RowButton title="Learn C♯m" icon={Settings} paint="sky" onClick={onClick} />)
    const row = screen.getByRole('button', { name: 'Learn C♯m' })
    expect(row).toHaveAttribute('type', 'button')
    expect(row.querySelector('[data-slot="row-tile"]')).toHaveClass('bg-paint-sky')
    expect(row.querySelector('[data-slot="row-chevron"]')).not.toBeInTheDocument()
    await userEvent.setup().click(row)
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('greys a row that cannot act, saying why', () => {
    render(
      <RowButton title="New folder" onClick={() => {}} disabled reason="No room: delete one." />,
    )
    const row = screen.getByRole('button', { name: 'New folder' })
    expect(row).toBeDisabled()
    expect(row).toHaveAccessibleDescription('No room: delete one.')
    expect(row).toHaveAttribute('title', 'No room: delete one.')
  })
})

describe('RowCheck', () => {
  it('is on or off, a tap turning it', async () => {
    const onCheckedChange = vi.fn()
    const { rerender } = render(
      <RowCheck
        title="Sunday"
        detail="3 songs"
        checked={false}
        onCheckedChange={onCheckedChange}
      />,
    )
    const row = screen.getByRole('checkbox', { name: 'Sunday 3 songs' })
    expect(row).not.toBeChecked()
    await userEvent.setup().click(row)
    expect(onCheckedChange).toHaveBeenCalledWith(true)
    rerender(<RowCheck title="Sunday" detail="3 songs" checked onCheckedChange={onCheckedChange} />)
    expect(row).toBeChecked()
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

  it('heads itself a level down inside a section of its page', () => {
    render(
      <RowGroup title="One change at a time" level={3}>
        <li>From C to G</li>
      </RowGroup>,
    )
    expect(
      screen.getByRole('heading', { level: 3, name: 'One change at a time' }),
    ).toBeInTheDocument()
  })
})

describe('FactCard', () => {
  it('names its fact under its icon, in a list of facts', () => {
    render(
      <dl>
        <FactCard icon={Settings} name="Tempo">
          72 BPM
        </FactCard>
      </dl>,
    )
    expect(screen.getByRole('term')).toHaveTextContent('Tempo')
    expect(screen.getByRole('definition')).toHaveTextContent('72 BPM')
  })
})

describe('optionName', () => {
  it('names an option by its title, holding the label a voice would say (WCAG 2.5.3)', () => {
    expect(optionName({ value: 7, label: '7', title: 'Seventh chord' })).toBe('7 · Seventh chord')
    expect(optionName({ value: 'min', label: 'Minor', title: 'Minor triad' })).toBe('Minor triad')
    expect(optionName({ value: 'maj', label: 'M', title: 'Major triad' })).toBe('M · Major triad')
    expect(optionName({ value: 0, label: '∞', title: 'Until stopped' })).toBe('Until stopped')
    expect(optionName({ value: 'c', label: 'C' })).toBeUndefined()
  })
})
