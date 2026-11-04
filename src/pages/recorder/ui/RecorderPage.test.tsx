import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { midi } from '@/shared/lib/music'

describe('Practice → Recorder (R29 B11)', () => {
  it('says it needs a piano before one is connected', async () => {
    await renderApp('/practice/recorder')
    await screen.findByRole('heading', { level: 1, name: 'Recorder' })
    expect(screen.getByRole('button', { name: 'Record' })).toBeDisabled()
    expect(screen.getByText(/Connect a piano to record/)).toBeInTheDocument()
    expect(screen.getByText(/Nothing recorded yet/)).toBeInTheDocument()
  })

  it('records a free take and makes a song of it', async () => {
    const user = userEvent.setup()
    const app = await renderApp('/practice/recorder')
    await screen.findByRole('heading', { level: 1, name: 'Recorder' })
    await act(() => app.midi.connect())
    await user.click(await screen.findByRole('button', { name: 'Record' }))
    // The count-in at the Metronome's 120 in 4/4: four beats of half a second, from 0.1 s.
    await screen.findByText('Count-in: 1')
    act(() => app.audio.setNow(2.15))
    await screen.findByText(/^Recording: \d+ s$/)
    act(() => app.midi.press(midi(60)))
    act(() => app.audio.setNow(2.6))
    act(() => app.midi.release(midi(60)))
    act(() => app.audio.setNow(3))
    await user.click(screen.getByRole('button', { name: 'Stop recording' }))
    const free = await screen.findByRole('list', { name: 'Free recordings' })
    expect(within(free).getAllByRole('listitem')).toHaveLength(1)
    expect(free).toHaveTextContent('1 note')
    expect(app.takesStore.getState().free).toHaveLength(1)
    expect(app.takesStore.getState().free[0]).toMatchObject({ tempo: 120, meter: '4/4' })

    await user.click(within(free).getByRole('button', { name: /^Actions for/ }))
    await user.click(await screen.findByRole('menuitem', { name: 'Make a song from it' }))
    await waitFor(() => expect(app.router.state.location.pathname).toMatch(/^\/songs\/my-\d+$/))
    expect(app.piecesStore.getState().songs).toHaveLength(1)
  })

  it('renames a recording and deletes it after asking', async () => {
    const user = userEvent.setup()
    const app = await renderApp('/practice/recorder')
    await screen.findByRole('heading', { level: 1, name: 'Recorder' })
    act(() =>
      app.takesStore.setState({
        free: [
          {
            id: 'take-1',
            made: Date.UTC(2026, 10, 4, 9, 0),
            tempo: 90,
            meter: '3/4',
            length: 2000,
            bars: [0, 2000],
            notes: [{ midi: midi(64), at: 0, held: 600, velocity: 80 }],
            pedals: [],
          },
        ],
        nextTake: 2,
      }),
    )
    const free = await screen.findByRole('list', { name: 'Free recordings' })
    await user.click(within(free).getByRole('button', { name: /^Actions for/ }))
    await user.click(await screen.findByRole('menuitem', { name: 'Rename' }))
    const sheet = await screen.findByRole('dialog', { name: 'Rename recording' })
    await user.type(within(sheet).getByRole('textbox', { name: 'Name' }), 'Waltz idea')
    await user.click(within(sheet).getByRole('button', { name: 'Save' }))
    expect(await within(free).findByText('Waltz idea')).toBeInTheDocument()

    await user.click(within(free).getByRole('button', { name: 'Actions for Waltz idea' }))
    await user.click(await screen.findByRole('menuitem', { name: 'Delete' }))
    const ask = await screen.findByRole('alertdialog', { name: 'Delete this recording?' })
    await user.click(within(ask).getByRole('button', { name: 'Delete' }))
    await waitFor(() => expect(app.takesStore.getState().free).toEqual([]))
    expect(await screen.findByText(/Nothing recorded yet/)).toBeInTheDocument()
  })
})
