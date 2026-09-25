import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { COLLECTIONS } from '@/entities/piece'
import type { FakeAudio } from '@/shared/api/audio'

describe('Piece', () => {
  it('titles a song in English over its printed title, with credits and source', async () => {
    renderApp('/songs/bz5')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Still, my soul, be still' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Мир, душа, храни')).toBeInTheDocument()
    expect(screen.getByText('«Боже, спасибо» · No. 5 · p. 16')).toBeInTheDocument()
  })

  it('lists the song’s chords with their ratings and checks them', async () => {
    renderApp('/songs/bz5')
    const chords = await screen.findByRole('region', { name: 'Chords in this song' })
    expect(within(chords).getAllByRole('link').length).toBeGreaterThan(1)
    expect(
      within(chords).getByRole('link', { name: 'Check these chords' }).getAttribute('href'),
    ).toMatch(/^\/check\?of=piece(%3A|:)bz5$/)
  })

  it('plays a bar when it is tapped', async () => {
    const user = userEvent.setup()
    const { services } = renderApp('/songs/bz5')
    await user.click(await screen.findByRole('button', { name: /^Bar 1: G$/ }))
    expect((services.audio as FakeAudio).played).toHaveLength(1)
  })

  it('offers Practise before the chords and the chart, in the first screenful', async () => {
    renderApp('/songs/bz5')
    const practise = await screen.findByRole('link', { name: 'Practise' })
    const chords = screen.getByRole('region', { name: 'Chords in this song' })
    expect(practise.compareDocumentPosition(chords) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('opens the Player and marks the song learned', async () => {
    const user = userEvent.setup()
    const { progressStore } = renderApp('/songs/bz5')
    expect(await screen.findByRole('link', { name: 'Practise' })).toHaveAttribute(
      'href',
      '/play/bz5',
    )
    await user.click(screen.getByRole('button', { name: 'Learned' }))
    expect(progressStore.getState().learned['piece:bz5']).toBeDefined()
  })

  it('reads in Russian, section headings too', async () => {
    renderApp('/songs/bz5', { locale: 'ru' })
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Мир, душа, храни' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Куплет' })).toBeInTheDocument()
  })

  it('names the chords row by the piece’s kind', async () => {
    renderApp('/songs/twofive')
    expect(
      await screen.findByRole('region', { name: 'Chords in this progression' }),
    ).toBeInTheDocument()
  })

  it('shows a listing without a chart', async () => {
    const listing = COLLECTIONS.flatMap((c) => c.entries).find((e) => e.kind === 'listing')
    if (!listing) throw new Error('the catalogue has no listing')
    renderApp(`/songs/${listing.id}`)
    expect(await screen.findByText('No chart yet')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Practise' })).not.toBeInTheDocument()
  })
})
