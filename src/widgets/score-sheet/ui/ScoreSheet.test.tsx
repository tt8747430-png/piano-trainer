import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { createEditorStore, placesIn, readDraft, type Layer } from '@/features/score-editor'
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

const sheet = (layer: Layer, onPlace = vi.fn()) =>
  render(
    <ScoreSheet
      draft={draft}
      caret={48}
      layer={layer}
      caretTicks={12}
      selection={null}
      onPlace={onPlace}
      placesOf={(to) => placesIn(createEditorStore(draft, vi.fn()).getState(), to)}
      heading={(section) => <h3>{section === 0 ? 'Verse' : 'Chorus'}</h3>}
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
    expect(onPlace).toHaveBeenLastCalledWith(96, 'chords', false)
    await user.keyboard('{Shift>}')
    await user.click(screen.getByRole('button', { name: 'Bar 4: C' }))
    expect(onPlace).toHaveBeenLastCalledWith(144, 'chords', true)
  })

  it('marks the bars a hand leaves to the pattern, in that hand’s layer', async () => {
    sheet('lh')
    await screen.findByRole('button', { name: 'Bar 1: G' })
    expect(screen.getAllByText('Pattern')).toHaveLength(4)
  })
})
