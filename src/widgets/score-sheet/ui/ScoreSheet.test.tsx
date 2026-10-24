import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { cloneElement } from 'react'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { createEditorStore, placesIn, readDraft, tapsIn, type Layer } from '@/features/score-editor'
import { stubBox } from '@/shared/test/layout'
import { loadScoreView } from '@/shared/ui'
import type { EditPrinted, Printed } from '../model/printed'
import { ScoreSheet } from './ScoreSheet'

const draft = readDraft({
  key: 'G',
  meter: '4/4',
  tempo: 90,
  pattern: 'r1',
  sections: [
    { kind: 'verse', lines: ['G C-D', 'Em'] },
    { kind: 'chorus', lines: ['C D'] },
  ],
  melody: 'B4/4 | C5/2 A4/2',
  hands: { lh: 'r/4 | r/4 | E3/4 | r/4 | r/4' },
})

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
      heading={(section) => <h3>{section === 0 ? 'Verse' : 'Chorus'}</h3>}
      chordNames={chordNames}
      edit={editing(edited)}
      title={() => null}
    />,
  )

describe('ScoreSheet', () => {
  beforeAll(loadScoreView)

  it('shows each section’s heading over its lines, each bar named by its chords', async () => {
    sheet('chords')
    expect(screen.getByRole('heading', { name: 'Verse' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Chorus' })).toBeInTheDocument()
    expect(await screen.findByRole('button', { name: 'Bar 2: C D' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Bar 5: D' })).toBeInTheDocument()
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
          heading={() => null}
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

  it('names the staves at the first line’s head alone, the tune’s and the piano’s (ADR 0094)', async () => {
    sheet('melody')
    const names = (line: Element | undefined) =>
      [...(line?.querySelectorAll('[data-slot="score"] g.label') ?? [])]
        .map((label) => label.textContent?.trim())
        .sort()
    await waitFor(() => {
      const lines = [...document.querySelectorAll('[data-slot="sheet-line"]')]
      expect(lines).toHaveLength(3)
      expect(names(lines[0])).toEqual(['Melody', 'Piano'])
      expect(lines.slice(1).map(names)).toEqual([[], []])
    })
  })

  it('puts a button over each staff’s name, opening what edits that staff (ADR 0094)', async () => {
    const user = userEvent.setup()
    const edited = vi.fn()
    sheet('melody', vi.fn(), true, edited)
    await user.click(await screen.findByRole('button', { name: 'Melody staff' }))
    expect(edited).toHaveBeenLastCalledWith({ kind: 'staff', staves: 'melody' })
    await user.click(screen.getByRole('button', { name: 'Piano staves' }))
    expect(edited).toHaveBeenLastCalledWith({ kind: 'staff', staves: 'piano' })
  })

  it('puts the caret where a bar is clicked, Shift keeping the bars chosen', async () => {
    const user = userEvent.setup()
    const onPlace = vi.fn()
    sheet('chords', onPlace)
    await user.click(await screen.findByRole('button', { name: 'Bar 3: Em' }))
    expect(onPlace).toHaveBeenLastCalledWith(192, 'chords', false)
    await user.keyboard('{Shift>}')
    await user.click(screen.getByRole('button', { name: 'Bar 4: C' }))
    expect(onPlace).toHaveBeenLastCalledWith(288, 'chords', true)
  })

  it('numbers each line at its head, the tempo beside it, its row only as tall as what it holds', async () => {
    sheet('rh', vi.fn(), false)
    await screen.findByRole('button', { name: 'Bar 1: G' })
    const rows = [...document.querySelectorAll<HTMLElement>('[data-slot="line-labels"]')]
    expect(rows.map((row) => row.textContent)).toEqual(['1', '3', '4'])
    // The tempo in the row, not a row of its own over the staff (ADR 0074), a button there.
    expect(screen.getByRole('button', { name: 'Tempo: 90 BPM' })).toHaveTextContent('\u{1D15F}= 90')
    // No chord names: the row holds a number alone, not the chords' room (ADR 0072).
    expect(rows.every((row) => row.style.height === '20px')).toBe(true)
  })

  it('draws the notes chosen as one box on each line they are on, and no caret with them', async () => {
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
        heading={() => null}
        chordNames
        edit={editing(vi.fn())}
        title={() => null}
      />,
    )
    await screen.findByRole('button', { name: 'Bar 1: G' })
    // Bars 1–2 on the verse's first line, bar 3 on its second: a box each, the chorus none.
    await waitFor(() =>
      expect(document.querySelectorAll('[data-slot="bars-chosen"]')).toHaveLength(2),
    )
    // While notes are chosen the caret stands aside: the range is the mark (ADR 0088).
    expect(document.querySelector('[data-slot="caret"]')).toBeNull()
  })

  it('writes a click over the staff into the tune when chord names are hidden', async () => {
    const user = userEvent.setup()
    const onPlace = vi.fn()
    sheet('melody', onPlace, false)
    // Bar 3, where the tune writes nothing: its start.
    const [bar] = await screen.findAllByRole('button', { name: /^Bar 3/ })
    if (!bar) throw new Error('no bar')
    await user.click(bar)
    expect(onPlace).toHaveBeenCalledWith(192, 'melody', false)
  })

  it('puts a button over the tempo mark and each clef, key and time signature, edited there (ADR 0094)', async () => {
    const user = userEvent.setup()
    const edited = vi.fn()
    sheet('melody', vi.fn(), true, edited)
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
    // Only the piano's staves change clef: the tune's is printed alone.
    expect(screen.queryByRole('button', { name: /^Clef, Melody/ })).not.toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /^Clef, Upper staff/ })).toHaveLength(3)
  })

  it('chooses nothing on empty staff beside a note, and a bar’s start where its row writes nothing (ADR 0088)', async () => {
    const onPlace = vi.fn()
    const onDeselect = vi.fn()
    sheet('melody', onPlace, false, vi.fn(), onDeselect)
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
    expect(onPlace).toHaveBeenLastCalledWith(192, 'melody', false)
  })

  it('marks the caret on notes as a box, and in an empty bar as a line, never a box on empty staff', async () => {
    sheet('melody')
    await waitFor(() =>
      expect(document.querySelector('[data-slot="caret"]')).toHaveAttribute('data-mark', 'note'),
    )
    sheet('lh')
    await waitFor(() =>
      expect(document.querySelectorAll('[data-slot="caret"]')[1]).toHaveAttribute(
        'data-mark',
        'insert',
      ),
    )
  })

  it('marks the notes at the caret on its staff as the ones chosen', async () => {
    sheet('melody')
    await waitFor(() => expect(document.querySelector('.note-chosen')).toBeInTheDocument())
    expect(document.querySelector('.note-chosen')?.id).toMatch(/^n-melody-/)
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
      heading: () => null,
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
})
