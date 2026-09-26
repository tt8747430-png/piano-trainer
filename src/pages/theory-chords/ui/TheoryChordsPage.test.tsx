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

  it('rolls an arpeggio, its keys going down one by one', async () => {
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
    expect(e4).toHaveAttribute('data-down')
    expect(g4).toHaveAttribute('data-down')
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
