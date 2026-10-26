import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { cloneElement } from 'react'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import type { PieceMusic } from '@/entities/piece'
import { createEditorStore, placesIn, readDraft, tapsIn, type Layer } from '@/features/score-editor'
import { stubBox } from '@/shared/test/layout'
import { loadScoreView } from '@/shared/ui'
import type { EditPrinted, Printed } from '../model/printed'
import { ScoreSheet } from './ScoreSheet'

const writtenMusic = {
  key: 'G',
  meter: '4/4',
  tempo: 90,
  pattern: 'r1',
  sections: [
    { kind: 'verse', lines: ['G C-D', 'Em'] },
    { kind: 'chorus', lines: ['C D'] },
  ],
  staves: [{ notes: 'B4/4 | C5/2 A4/2' }],
  hands: { lh: 'r/4 | r/4 | E3/4 | r/4 | r/4' },
} as const satisfies PieceMusic
const draft = readDraft(writtenMusic)

/** What edits a thing printed, in a test: a click on its button says what it is. */
const editing =
  (edited: (printed: Printed) => void): EditPrinted =>
  (printed, trigger) =>
    cloneElement(trigger, { onClick: () => edited(printed) })

const sheet = (
  layer: Layer,
  onPlace = vi.fn(),
  chordNames = true,
  edited = vi.fn(),
  onDeselect = vi.fn(),
) =>
  render(
    <ScoreSheet
      draft={draft}
      caret={96}
      layer={layer}
      tapsOf={(to) => tapsIn(createEditorStore(draft, vi.fn()).getState(), to)}
      selection={null}
      onPlace={onPlace}
      onReach={vi.fn()}
      onDeselect={onDeselect}
      placesOf={(to) => placesIn(createEditorStore(draft, vi.fn()).getState(), to)}
      chordNames={chordNames}
      edit={editing(edited)}
      title={() => null}
    />,
  )

describe('ScoreSheet', () => {
  beforeAll(loadScoreView)

  it('names each section in the labels’ row at its first bar, no heading over its lines (ADR 0095)', async () => {
    const user = userEvent.setup()
    const edited = vi.fn()
    sheet('chords', vi.fn(), true, edited)
    expect(await screen.findByRole('button', { name: 'Bar 2: C D' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Bar 5: D' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Verse' })).not.toBeInTheDocument()
    // Printed where it starts, a button opening the section's menu.
    const chorus = screen.getByRole('button', { name: 'Chorus' })
    expect(chorus.closest('[data-slot="line-labels"]')).not.toBeNull()
    await user.click(chorus)
    expect(edited).toHaveBeenLastCalledWith({ kind: 'section', section: 1 })
    await user.click(screen.getByRole('button', { name: 'Verse' }))
    expect(edited).toHaveBeenLastCalledWith({ kind: 'section', section: 0 })
  })

  it.each(['scroll', 'pages', 'horizontal'] as const)(
    'prints the title it is given at the sheet’s head, %s (ADR 0094)',
    async (view) => {
      render(
        <ScoreSheet
          draft={draft}
          caret={0}
          layer="rh"
          tapsOf={() => []}
          selection={null}
          onPlace={vi.fn()}
          onReach={vi.fn()}
          onDeselect={vi.fn()}
          placesOf={() => []}
          chordNames
          edit={editing(vi.fn())}
          view={view}
          title={() => <h1>Morning</h1>}
        />,
      )
      await screen.findAllByRole('button', { name: /^Bar 1/ })
      const sheet = screen.getByRole('region', { name: 'Score' })
      expect(within(sheet).getByRole('heading', { level: 1, name: 'Morning' })).toBeInTheDocument()
    },
  )

  it('names the staves at the first line’s head alone, a nameless one by its place, muted (ADR 0094, 0097)', async () => {
    sheet('staff0')
    const names = (line: Element | undefined) =>
      [...(line?.querySelectorAll('[data-slot="score"] g.label') ?? [])]
        .map((label) => label.textContent?.trim())
        .sort()
    await waitFor(() => {
      const lines = [...document.querySelectorAll('[data-slot="sheet-line"]')]
      expect(lines).toHaveLength(3)
      expect(names(lines[0])).toEqual(['Piano', 'Staff 1'])
      expect(lines.slice(1).map(names)).toEqual([[], []])
    })
    // The staff of no name shows its place's in italics, as an empty score's placeholder.
    const placeholder = document.querySelector('[data-slot="score"] g.label [font-style="italic"]')
    expect(placeholder?.textContent?.trim()).toBe('Staff 1')
  })

  it('names each staff by its own name, over the piano (ADR 0097)', async () => {
    const named = readDraft({
      ...writtenMusic,
      staves: [
        { name: 'Voice', notes: 'B4/4 | C5/2 A4/2' },
        { clef: 'bass', notes: 'G2/4' },
      ],
    })
    render(
      <ScoreSheet
        draft={named}
        caret={0}
        layer="rh"
        tapsOf={() => []}
        selection={null}
        onPlace={vi.fn()}
        onReach={vi.fn()}
        onDeselect={vi.fn()}
        placesOf={() => []}
        chordNames
        edit={editing(vi.fn())}
        title={() => null}
      />,
    )
    expect(await screen.findByRole('button', { name: 'Voice' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Staff 2' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Piano staves' })).toBeInTheDocument()
    // Top down, each measure's: the single staves over the piano's.
    const [first] = document.querySelectorAll('[data-slot="sheet-line"]')
    const drawn = [...(first?.querySelectorAll('g.staff') ?? [])]
    expect([...new Set(drawn.map((staff) => staff.getAttribute('data-staff')))]).toEqual([
      'staff0',
      'staff1',
      'treble',
      'bass',
    ])
  })

  it('puts a button over each staff’s name, opening what edits that staff (ADR 0094)', async () => {
    const user = userEvent.setup()
    const edited = vi.fn()
    sheet('staff0', vi.fn(), true, edited)
    await user.click(await screen.findByRole('button', { name: 'Staff 1' }))
    expect(edited).toHaveBeenLastCalledWith({ kind: 'staff', staves: 'staff0' })
    await user.click(screen.getByRole('button', { name: 'Piano staves' }))
    expect(edited).toHaveBeenLastCalledWith({ kind: 'staff', staves: 'piano' })
  })

  it('draws one piano staff alone where the View hides the other (ADR 0094)', async () => {
    render(
      <ScoreSheet
        draft={draft}
        caret={0}
        layer="rh"
        tapsOf={() => []}
        selection={null}
        onPlace={vi.fn()}
        onReach={vi.fn()}
        onDeselect={vi.fn()}
        placesOf={() => []}
        chordNames
        edit={editing(vi.fn())}
        title={() => null}
        hidden={['bass']}
      />,
    )
    await waitFor(() =>
      expect(
        document.querySelectorAll('[data-slot="score"] g.staff[data-staff="treble"]').length,
      ).toBeGreaterThan(0),
    )
    expect(
      document.querySelectorAll('[data-slot="score"] g.staff[data-staff="bass"]'),
    ).toHaveLength(0)
    expect(
      document.querySelectorAll('[data-slot="score"] g.staff[data-staff="staff0"]').length,
    ).toBeGreaterThan(0)
  })

  it('writes the line double-clicked in its bar’s own key: F♯ on the F line where a section is in E', async () => {
    const changing = readDraft({
      key: 'C',
      meter: '4/4',
      tempo: 90,
      pattern: 'r1',
      sections: [
        { kind: 'verse', lines: ['C'] },
        { kind: 'chorus', key: 'E', lines: ['E'] },
      ],
      hands: { rh: 'r/4 | r/4', lh: 'r/4 | r/4' },
    })
    const onWrite = vi.fn()
    render(
      <ScoreSheet
        draft={changing}
        caret={0}
        layer="rh"
        tapsOf={() => []}
        selection={null}
        onPlace={vi.fn()}
        onReach={vi.fn()}
        onDeselect={vi.fn()}
        placesOf={() => []}
        chordNames
        edit={editing(vi.fn())}
        title={() => null}
        onWrite={onWrite}
      />,
    )
    // jsdom lays nothing out: the bar's top is the chord row's, 44px over the line's engraving,
    // whose treble top line (F5) Verovio draws 30px down.
    const chorus = await screen.findByRole('button', { name: 'Bar 2: E' })
    fireEvent.doubleClick(chorus, { clientY: 74, detail: 2 })
    expect(onWrite).toHaveBeenCalledWith(96, 'rh', 78)
    // The verse, in C: F♮.
    fireEvent.doubleClick(screen.getByRole('button', { name: 'Bar 1: C' }), {
      clientY: 74,
      detail: 2,
    })
    expect(onWrite).toHaveBeenLastCalledWith(0, 'rh', 77)
  })

  it('opens the chord-symbol field where the chord row is clicked, Shift choosing the bars (ADR 0096)', async () => {
    const user = userEvent.setup()
    const onPlace = vi.fn()
    const onField = vi.fn()
    render(
      <ScoreSheet
        draft={draft}
        caret={96}
        layer="chords"
        tapsOf={(to) => tapsIn(createEditorStore(draft, vi.fn()).getState(), to)}
        selection={null}
        onPlace={onPlace}
        onReach={vi.fn()}
        onDeselect={vi.fn()}
        placesOf={(to) => placesIn(createEditorStore(draft, vi.fn()).getState(), to)}
        chordNames
        edit={editing(vi.fn())}
        title={() => null}
        onField={onField}
      />,
    )
    // jsdom lays nothing out: a click lands at the bar's top left, in the chord row at its first beat.
    await user.click(await screen.findByRole('button', { name: 'Bar 3: Em' }))
    expect(onField).toHaveBeenLastCalledWith({ kind: 'chord' }, 192, 'chords')
    expect(onPlace).not.toHaveBeenCalled()
    await user.keyboard('{Shift>}')
    await user.click(screen.getByRole('button', { name: 'Bar 4: C' }))
    expect(onPlace).toHaveBeenLastCalledWith(288, 'chords', true)
    expect(onField).toHaveBeenCalledTimes(1)
  })

  it.each(['scroll', 'pages', 'horizontal'] as const)(
    'puts the open field’s place over the chord row at the caret’s beat, on its line, %s (ADR 0096)',
    async (view) => {
      const anchors: (HTMLElement | null)[] = []
      render(
        <ScoreSheet
          draft={draft}
          caret={240}
          layer="chords"
          tapsOf={() => []}
          selection={null}
          onPlace={vi.fn()}
          onReach={vi.fn()}
          onDeselect={vi.fn()}
          placesOf={() => []}
          chordNames
          edit={editing(vi.fn())}
          title={() => null}
          view={view}
          field={{ kind: 'chord' }}
          fieldAnchor={(element) => {
            anchors.push(element)
          }}
        />,
      )
      await screen.findAllByRole('button', { name: /^Bar 3/ })
      await waitFor(() => expect(anchors.at(-1)).toBeInstanceOf(HTMLElement))
      const anchor = anchors.at(-1)
      // Bar 3's third beat, on the verse's second line down the screen and on a page; across, the one line.
      const lines = [...document.querySelectorAll('[data-slot="sheet-line"]')]
      expect(anchor?.closest('[data-slot="sheet-line"]')).toBe(
        view === 'horizontal' ? lines[0] : lines[1],
      )
      expect(anchor).toHaveAttribute('data-slot', 'field-anchor')
      expect(anchor?.style.top).toMatch(/^-\d/)
    },
  )

  it('puts the Lyrics field’s place on the syllable printed, and opens it from a tap there (ADR 0096)', async () => {
    const sung = readDraft({
      key: 'G',
      meter: '4/4',
      tempo: 90,
      pattern: 'r1',
      sections: [{ kind: 'verse', lines: ['G C'] }],
      staves: [{ notes: 'B4/4 | C5/4' }],
      lyrics: ['One two'],
      hands: { rh: 'r/4 | r/4', lh: 'r/4 | r/4' },
    })
    const onField = vi.fn()
    const anchors: (HTMLElement | null)[] = []
    render(
      <ScoreSheet
        draft={sung}
        caret={96}
        layer="staff0"
        tapsOf={() => []}
        selection={null}
        onPlace={vi.fn()}
        onReach={vi.fn()}
        onDeselect={vi.fn()}
        placesOf={() => []}
        chordNames
        edit={editing(vi.fn())}
        title={() => null}
        field={{ kind: 'lyrics', verse: 0 }}
        fieldAnchor={(element) => {
          anchors.push(element)
        }}
        onField={onField}
      />,
    )
    await waitFor(() => expect(anchors.at(-1)).toBeInstanceOf(HTMLElement))
    const place = anchors.at(-1)
    if (!place) throw new Error('the field’s place')
    // Under the staff, on bar 2's syllable: a tap there opens its field, on its note and verse.
    const bar = screen.getByRole('button', { name: 'Bar 2: C' })
    const width = Number.parseFloat(bar.style.width)
    vi.spyOn(bar, 'offsetWidth', 'get').mockReturnValue(width)
    stubBox(bar, { width, height: 200 })
    fireEvent.click(bar, {
      clientX: Number.parseFloat(place.style.left) + 4 - Number.parseFloat(bar.style.left),
      clientY: Number.parseFloat(place.style.top) + 4 - Number.parseFloat(bar.style.top),
      detail: 1,
    })
    expect(onField).toHaveBeenLastCalledWith({ kind: 'lyrics', verse: 0 }, 96, 'staff0')
  })

  it('numbers each line at its head, a section’s name and the tempo beside it, its row only as tall as what it holds', async () => {
    sheet('rh', vi.fn(), false)
    await screen.findByRole('button', { name: 'Bar 1: G' })
    const rows = [...document.querySelectorAll<HTMLElement>('[data-slot="line-labels"]')]
    // As the Player prints them (ADR 0095).
    expect(rows.map((row) => row.textContent)).toEqual([
      '1 · Verse · \u{1D15F}= 90',
      '3',
      '4 · Chorus',
    ])
    // The tempo in the row, not a row of its own over the staff (ADR 0074), a button there.
    expect(screen.getByRole('button', { name: 'Tempo: 90 BPM' })).toHaveTextContent('\u{1D15F}= 90')
    // No chord names: the row holds a number alone, not the chords' room (ADR 0072).
    expect(rows.every((row) => row.style.height === '20px')).toBe(true)
  })

  it.each([
    ['scroll', 2],
    ['pages', 2],
    ['horizontal', 1],
  ] as const)(
    'draws the notes chosen as one band on each line they are on, coloured, no caret with them, %s (ADR 0096)',
    async (view, lines) => {
      render(
        <ScoreSheet
          draft={draft}
          caret={0}
          layer="rh"
          tapsOf={() => []}
          selection={{ from: 0, to: 288 }}
          onPlace={vi.fn()}
          onReach={vi.fn()}
          onDeselect={vi.fn()}
          placesOf={() => []}
          chordNames
          edit={editing(vi.fn())}
          title={() => null}
          view={view}
        />,
      )
      await screen.findByRole('button', { name: 'Bar 1: G' })
      // Bars 1–2 on the verse's first line, bar 3 on its second (across, all on one): a band each,
      // the chorus none.
      await waitFor(() =>
        expect(document.querySelectorAll('[data-slot="notes-chosen"]')).toHaveLength(lines),
      )
      for (const band of document.querySelectorAll('[data-slot="notes-chosen"]'))
        expect(band).toHaveAttribute('data-mark', 'band')
      // The notes chosen themselves coloured, on the right hand's staff.
      await waitFor(() =>
        expect(document.querySelector('g.note.note-chosen')?.id).toMatch(/^n-treble-/),
      )
      // While notes are chosen the caret stands aside: the range is the mark (ADR 0088).
      expect(document.querySelector('[data-slot="caret"]')).toBeNull()
    },
  )

  it('writes a click over the staff into the tune when chord names are hidden', async () => {
    const user = userEvent.setup()
    const onPlace = vi.fn()
    sheet('staff0', onPlace, false)
    // Bar 3, where the tune writes nothing: its start.
    const [bar] = await screen.findAllByRole('button', { name: /^Bar 3/ })
    if (!bar) throw new Error('no bar')
    await user.click(bar)
    expect(onPlace).toHaveBeenCalledWith(192, 'staff0', false)
  })

  it('puts a button over the tempo mark and each clef, key and time signature, edited there (ADR 0094)', async () => {
    const user = userEvent.setup()
    const edited = vi.fn()
    sheet('staff0', vi.fn(), true, edited)
    await user.click(await screen.findByRole('button', { name: 'Tempo: 90 BPM' }))
    expect(edited).toHaveBeenLastCalledWith({ kind: 'tempo' })
    // The verse's first line's head, each sign on each staff it is printed on.
    const [key] = await screen.findAllByRole('button', { name: 'Key signature, bar 1' })
    if (!key) throw new Error('no key signature')
    await user.click(key)
    expect(edited).toHaveBeenLastCalledWith({ kind: 'key', bar: 0 })
    const [time] = screen.getAllByRole('button', { name: 'Time signature, bar 1' })
    if (!time) throw new Error('no time signature')
    await user.click(time)
    expect(edited).toHaveBeenLastCalledWith({ kind: 'time', bar: 0 })
    // The verse's second line starts at bar 3: its lower staff's clef.
    await user.click(screen.getByRole('button', { name: 'Clef, Lower staff, bar 3' }))
    expect(edited).toHaveBeenLastCalledWith({ kind: 'clef', bar: 2, staff: 'bass' })
    // A single staff's clef is a target too, the whole staff's (ADR 0097).
    await user.click(screen.getAllByRole('button', { name: 'Clef, Staff 1, bar 1' })[0]!)
    expect(edited).toHaveBeenLastCalledWith({ kind: 'clef', bar: 0, staff: 'staff0' })
    expect(screen.getAllByRole('button', { name: /^Clef, Upper staff/ })).toHaveLength(3)
  })

  it('stands what is printed over the grip of the caret’s notes, a tap on a sign beside them opening it', async () => {
    render(
      <ScoreSheet
        draft={draft}
        caret={0}
        layer="staff0"
        tapsOf={(to) => tapsIn(createEditorStore(draft, vi.fn()).getState(), to)}
        selection={null}
        onPlace={vi.fn()}
        onReach={vi.fn()}
        onDeselect={vi.fn()}
        placesOf={(to) => placesIn(createEditorStore(draft, vi.fn()).getState(), to)}
        chordNames
        edit={editing(vi.fn())}
        title={() => null}
        onDrag={vi.fn()}
      />,
    )
    const [time] = await screen.findAllByRole('button', { name: 'Time signature, bar 1' })
    const grip = document.querySelector('[data-slot="note-grip"]')
    if (!time || !grip) throw new Error('the first note is a grip, the time signature a button')
    // On one layer, what comes later in the page is drawn over what comes before: the grip first.
    for (const printed of [time, screen.getByRole('button', { name: 'Staff 1' })]) {
      expect(grip.compareDocumentPosition(printed) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    }
  })

  it('chooses nothing on empty staff beside a note, and a bar’s start where its row writes nothing (ADR 0088)', async () => {
    const onPlace = vi.fn()
    const onDeselect = vi.fn()
    sheet('staff0', onPlace, false, vi.fn(), onDeselect)
    const click = async (name: RegExp, x: number) => {
      const [bar] = await screen.findAllByRole('button', { name })
      if (!bar) throw new Error('no bar')
      vi.spyOn(bar, 'offsetWidth', 'get').mockReturnValue(400)
      stubBox(bar, { width: 400, height: 200 })
      fireEvent.click(bar, { clientX: x, clientY: 30, detail: 1 })
    }
    // Far right in bar 1, past its whole note's head: empty staff, nothing chosen.
    await click(/^Bar 1/, 399)
    expect(onPlace).not.toHaveBeenCalled()
    expect(onDeselect).toHaveBeenCalledTimes(1)
    // Anywhere in an empty bar: its start, as a line where the next note goes.
    await click(/^Bar 3/, 5)
    expect(onPlace).toHaveBeenLastCalledWith(192, 'staff0', false)
  })

  it('marks the caret as a line on its staff, on notes and in an empty bar, never a box (ADR 0096)', async () => {
    sheet('staff0')
    await waitFor(() =>
      expect(document.querySelector('[data-slot="caret"]')).toHaveAttribute('data-mark', 'line'),
    )
    sheet('lh')
    await waitFor(() =>
      expect(document.querySelectorAll('[data-slot="caret"]')[1]).toHaveAttribute(
        'data-mark',
        'line',
      ),
    )
    expect(document.querySelector('[data-mark="band"]')).toBeNull()
  })

  it('prints the fingers written on the notes where the View shows them, a chord’s each on its own note (ADR 0096)', async () => {
    const fingered = readDraft({
      key: 'C',
      meter: '4/4',
      tempo: 90,
      pattern: 'r1',
      sections: [{ kind: 'verse', lines: ['C'] }],
      hands: { rh: 'C4^1+E4^3+G4^5/4', lh: 'C3^5/4' },
    })
    render(
      <ScoreSheet
        draft={fingered}
        caret={0}
        layer="rh"
        tapsOf={() => []}
        selection={null}
        onPlace={vi.fn()}
        onReach={vi.fn()}
        onDeselect={vi.fn()}
        placesOf={() => []}
        chordNames
        fingers
        edit={editing(vi.fn())}
        title={() => null}
      />,
    )
    await waitFor(() =>
      expect(
        [...document.querySelectorAll('[data-slot="score"] g.fing')].map((g) =>
          g.textContent?.trim(),
        ),
      ).toEqual(['1', '3', '5', '5']),
    )
  })

  it('colours the notes at the caret on its staff as the ones chosen', async () => {
    sheet('staff0')
    await waitFor(() => expect(document.querySelector('g.note.note-chosen')).toBeInTheDocument())
    expect(document.querySelector('g.note.note-chosen')?.id).toMatch(/^n-staff0-/)
  })

  it('opens where it is with the caret’s line in sight, and brings a line the caret moves onto into view', async () => {
    const scrolled = vi.mocked(Element.prototype.scrollIntoView)
    scrolled.mockClear()
    const props = {
      draft,
      layer: 'chords' as const,
      tapsOf: () => [],
      selection: null,
      onPlace: vi.fn(),
      onReach: vi.fn(),
      onDeselect: vi.fn(),
      placesOf: () => [],
      chordNames: true,
      edit: editing(vi.fn()),
      title: () => null,
    }
    const { rerender } = render(<ScoreSheet {...props} caret={96} />)
    await screen.findByRole('button', { name: 'Bar 2: C D' })
    expect(scrolled).not.toHaveBeenCalled()
    rerender(<ScoreSheet {...props} caret={288} />)
    expect(scrolled).toHaveBeenCalledWith({ block: 'nearest' })
  })

  it.each(['scroll', 'pages', 'horizontal'] as const)(
    'draws the playhead on the line Play is on, over its staves, apart from the caret, %s (ADR 0096)',
    async (view) => {
      const props = {
        draft,
        caret: 0,
        layer: 'rh' as const,
        tapsOf: () => [],
        selection: null,
        onPlace: vi.fn(),
        onReach: vi.fn(),
        onDeselect: vi.fn(),
        placesOf: () => [],
        chordNames: true,
        edit: editing(vi.fn()),
        title: () => null,
        view,
      }
      const { rerender } = render(
        <ScoreSheet {...props} playhead={{ tick: 192, clock: () => null }} />,
      )
      await screen.findAllByRole('button', { name: /^Bar 3/ })
      await waitFor(() =>
        expect(document.querySelectorAll('[data-slot="playhead"]')).toHaveLength(1),
      )
      const playhead = document.querySelector('[data-slot="playhead"]')
      const lines = [...document.querySelectorAll('[data-slot="sheet-line"]')]
      // Bar 3 opens the verse's second line down the screen and on a page; across, the one line.
      expect(playhead?.closest('[data-slot="sheet-line"]')).toBe(
        view === 'horizontal' ? lines[0] : lines[1],
      )
      // The caret stays at bar 1, the playhead apart from it.
      expect(lines[0]?.querySelector('[data-slot="caret"]')).not.toBeNull()
      rerender(<ScoreSheet {...props} playhead={null} />)
      expect(document.querySelector('[data-slot="playhead"]')).toBeNull()
    },
  )
})
