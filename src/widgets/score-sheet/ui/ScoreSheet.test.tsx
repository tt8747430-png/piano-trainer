import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { createEditorStore, placesIn, readDraft, tapsIn, type Layer } from '@/features/score-editor'
import { stubBox } from '@/shared/test/layout'
import { loadScoreView } from '@/shared/ui'
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
  hands: { lh: '- | - | E3/4 | - | -' },
})

const sheet = (layer: Layer, onPlace = vi.fn(), chordNames = true, onSignature = vi.fn()) =>
  render(
    <ScoreSheet
      draft={draft}
      caret={96}
      layer={layer}
      tapsOf={(to) => tapsIn(createEditorStore(draft, vi.fn()).getState(), to)}
      selection={null}
      onPlace={onPlace}
      placesOf={(to) => placesIn(createEditorStore(draft, vi.fn()).getState(), to)}
      heading={(section) => <h3>{section === 0 ? 'Verse' : 'Chorus'}</h3>}
      chordNames={chordNames}
      onSignature={onSignature}
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

  it('marks the bars a hand leaves to the pattern, in that hand’s layer', async () => {
    sheet('lh')
    await screen.findByRole('button', { name: 'Bar 1: G' })
    expect(screen.getAllByText('Pattern')).toHaveLength(4)
  })

  it('says Pattern inside the hand’s empty staff, not in the labels over it', async () => {
    sheet('rh')
    await screen.findByRole('button', { name: 'Bar 1: G' })
    for (const mark of screen.getAllByText('Pattern')) {
      expect(mark.closest('[data-slot="line-labels"]')).toBeNull()
    }
  })

  it('numbers each line at its head, the tempo beside it, its row only as tall as what it holds', async () => {
    sheet('rh', vi.fn(), false)
    await screen.findByRole('button', { name: 'Bar 1: G' })
    const rows = [...document.querySelectorAll<HTMLElement>('[data-slot="line-labels"]')]
    // The tempo in the row, not a row of its own over the staff (ADR 0074).
    expect(rows.map((row) => row.textContent)).toEqual(['1\u{1D15F}= 90', '3', '4'])
    // No chord names: the row holds a number alone, not the chords' room (ADR 0072).
    expect(rows.every((row) => row.style.height === '20px')).toBe(true)
  })

  it('draws the bars chosen as one box on each line they are on', async () => {
    render(
      <ScoreSheet
        draft={draft}
        caret={0}
        layer="rh"
        tapsOf={() => []}
        selection={{ from: 0, to: 2 }}
        onPlace={vi.fn()}
        placesOf={() => []}
        heading={() => null}
        chordNames
        onSignature={vi.fn()}
      />,
    )
    await screen.findByRole('button', { name: 'Bar 1: G' })
    // Bars 1–2 on the verse's first line, bar 3 on its second: a box each, the chorus none.
    await waitFor(() =>
      expect(document.querySelectorAll('[data-slot="bars-chosen"]')).toHaveLength(2),
    )
  })

  it('writes a click over the staff into the tune when chord names are hidden', async () => {
    const user = userEvent.setup()
    const onPlace = vi.fn()
    sheet('melody', onPlace, false)
    const [bar] = await screen.findAllByRole('button', { name: /^Bar 1/ })
    if (!bar) throw new Error('no bar')
    await user.click(bar)
    expect(onPlace).toHaveBeenCalledWith(expect.any(Number), 'melody', false)
  })

  it('opens what changes the clef, key and time from a line’s head', async () => {
    const user = userEvent.setup()
    const onSignature = vi.fn()
    sheet('melody', vi.fn(), true, onSignature)
    const [head] = await screen.findAllByRole('button', { name: 'Key and time signature' })
    if (!head) throw new Error('no line head')
    await user.click(head)
    expect(onSignature).toHaveBeenCalled()
  })

  it('puts a click on a note, never on an empty step beside it, and on a bar’s start where its row writes nothing', async () => {
    const onPlace = vi.fn()
    sheet('melody', onPlace, false)
    const click = async (name: RegExp) => {
      const [bar] = await screen.findAllByRole('button', { name })
      if (!bar) throw new Error('no bar')
      stubBox(bar, { width: 400, height: 200 })
      // Far right in the bar: the room after its whole note (bar 1), an empty bar (bar 3).
      fireEvent.click(bar, { clientX: 399, clientY: 0, detail: 1 })
    }
    await click(/^Bar 1/)
    expect(onPlace).toHaveBeenLastCalledWith(0, 'melody', false)
    await click(/^Bar 3/)
    expect(onPlace).toHaveBeenLastCalledWith(192, 'melody', false)
  })

  it('marks the caret on notes as a box, and in a bar the pattern plays as a line, never a box on empty staff', async () => {
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
      placesOf: () => [],
      heading: () => null,
      chordNames: true,
      onSignature: vi.fn(),
    }
    const { rerender } = render(<ScoreSheet {...props} caret={96} />)
    await screen.findByRole('button', { name: 'Bar 2: C D' })
    expect(scrolled).not.toHaveBeenCalled()
    rerender(<ScoreSheet {...props} caret={288} />)
    expect(scrolled).toHaveBeenCalledWith({ block: 'nearest' })
  })
})
