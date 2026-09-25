import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import type { FakeAudio } from '@/shared/api/audio'

describe('Theory → Chords', () => {
  it('shows C major by default, its keys labelled by degree', async () => {
    renderApp('/theory/chords')
    expect(await screen.findByRole('heading', { level: 2, name: 'C' })).toBeInTheDocument()
    expect(screen.getByText('Major triad')).toBeInTheDocument()
    const keyboard = screen.getByRole('group', { name: 'Keyboard' })
    expect(within(keyboard).getByRole('button', { name: 'E4' })).toHaveTextContent('3')
  })

  it('opens a deep link and moves through the URL, sounding each choice', async () => {
    const user = userEvent.setup()
    const { router, services } = renderApp('/theory/chords?root=G&quality=d7')
    expect(await screen.findByRole('heading', { level: 2, name: 'G7' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Minor 7th' }))
    expect(router.state.location.search).toMatchObject({ root: 'G', quality: 'm7' })
    expect((services.audio as FakeAudio).played.length).toBeGreaterThan(0)
  })

  it('offers only the inversions the chord has', async () => {
    renderApp('/theory/chords?quality=maj')
    const inversions = await screen.findByRole('group', { name: 'Inversion' })
    expect(
      within(inversions)
        .getAllByRole('button')
        .map((b) => b.textContent),
    ).toEqual(['Root', '1st', '2nd'])
  })

  it('opened from a path step, offers its check and its learned toggle', async () => {
    const user = userEvent.setup()
    const { progressStore } = renderApp('/theory/chords?quality=maj7&step=chords:sev')
    const check = await screen.findByRole('link', { name: 'Check yourself' })
    expect(check.getAttribute('href')).toMatch(/^\/check\?of=chords(%3A|:)sev$/)
    await user.click(screen.getByRole('button', { name: 'Learned' }))
    expect(progressStore.getState().learned['chords:sev']).toBeDefined()
  })
})
