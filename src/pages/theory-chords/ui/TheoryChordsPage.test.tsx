import { act, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'

describe('Theory → Chords', () => {
  it('shows C major by default, its keys labelled by degree', async () => {
    await renderApp('/theory/chords')
    expect(await screen.findByRole('heading', { level: 2, name: 'C' })).toBeInTheDocument()
    expect(screen.getByText('Major triad')).toBeInTheDocument()
    const keyboard = screen.getByRole('group', { name: 'Keyboard' })
    expect(within(keyboard).getByRole('button', { name: 'E4' })).toHaveTextContent('3')
  })

  it('opens a deep link and moves through the URL, sounding each choice', async () => {
    const user = userEvent.setup()
    const { router, audio } = await renderApp('/theory/chords?root=G&quality=d7')
    expect(await screen.findByRole('heading', { level: 2, name: 'G7' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Minor 7th' }))
    expect(router.state.location.search).toMatchObject({ root: 'G', quality: 'm7' })
    expect(audio.played.length).toBeGreaterThan(0)
  })

  it('rolls an arpeggio, showing only the key struck last', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/theory/chords')
    await user.click(await screen.findByRole('button', { name: 'Arpeggio' }))
    const start = audio.played.at(-1)?.at ?? 0
    const keyboard = screen.getByRole('group', { name: 'Keyboard' })
    const [c4, e4, g4] = ['C4', 'E4', 'G4'].map((name) =>
      within(keyboard).getByRole('button', { name }),
    )
    act(() => audio.setNow(start + 0.05))
    expect(c4).toHaveAttribute('data-down')
    expect(e4).not.toHaveAttribute('data-down')
    act(() => audio.setNow(start + 0.5))
    expect(g4).toHaveAttribute('data-down')
    expect(g4).toHaveClass('bg-role-5th')
    for (const key of [c4, e4]) {
      expect(key).not.toHaveAttribute('data-down')
      expect(key).toHaveClass('bg-key-white')
    }
    act(() => audio.setNow(start + 3))
    expect(c4).toHaveClass('bg-role-root')
  })

  it('turns Play into Stop while the chord sounds, and back when it ends', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/theory/chords')
    await user.click(await screen.findByRole('button', { name: 'Play' }))
    const start = audio.played.at(-1)?.at ?? 0
    expect(screen.getByRole('button', { name: 'Stop' })).toBeInTheDocument()
    act(() => audio.setNow(start + 1.7))
    expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument()
  })

  it('stops the chord on Stop, and Arpeggio takes over from Play', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/theory/chords')
    await user.click(await screen.findByRole('button', { name: 'Play' }))
    await user.click(screen.getByRole('button', { name: 'Arpeggio' }))
    expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument()
    const stops = audio.stops
    await user.click(screen.getByRole('button', { name: 'Stop' }))
    expect(audio.stops).toBe(stops + 1)
    expect(screen.getByRole('button', { name: 'Arpeggio' })).toBeInTheDocument()
  })

  it('sounds a tapped key', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/theory/chords')
    const keyboard = await screen.findByRole('group', { name: 'Keyboard' })
    await user.click(within(keyboard).getByRole('button', { name: 'A4' }))
    expect(audio.played.at(-1)?.sounds).toMatchObject([{ kind: 'note', midi: 69 }])
  })

  it('offers only the inversions the chord has', async () => {
    await renderApp('/theory/chords?quality=maj')
    const inversions = await screen.findByRole('group', { name: 'Inversion' })
    expect(
      within(inversions)
        .getAllByRole('button')
        .map((b) => b.textContent),
    ).toEqual(['Root', '1st', '2nd'])
  })

  it('opened from a path step, offers its check and its learned toggle', async () => {
    const user = userEvent.setup()
    const { progressStore } = await renderApp('/theory/chords?quality=maj7&step=chords:sev')
    const check = await screen.findByRole('link', { name: 'Check yourself' })
    expect(check.getAttribute('href')).toMatch(/^\/check\?of=chords(%3A|:)sev$/)
    await user.click(screen.getByRole('button', { name: 'Learned' }))
    expect(progressStore.getState().learned['chords:sev']).toBeDefined()
  })
})
