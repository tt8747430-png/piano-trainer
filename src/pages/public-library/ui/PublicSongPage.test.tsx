import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'
import { createFakeAuth } from '@/shared/api/auth'
import { createFakePublicLibrary } from '@/shared/api/public-library'

const MUSIC = {
  key: 'G',
  meter: '3/4',
  tempo: 80,
  pattern: 'r2',
  sections: [{ kind: 'verse', lines: ['Em D C G'] }],
}
const ANA = { email: 'ana@example.com', name: 'Ana', password: 'correct horse' }

async function signedIn() {
  const auth = createFakeAuth({ accounts: [ANA] })
  await auth.signIn(ANA.email, ANA.password)
  return auth
}

/** Explore with one song Bo published, rated by two learners, its author's words with it. */
const withSong = () =>
  createFakePublicLibrary({
    author: () => ({ id: 'ana', name: 'Ana' }),
    items: [
      {
        id: 'public-1',
        title: 'Morning',
        authorName: 'Bo',
        meta: { key: 'G', meter: '3/4', description: 'A waltz to start the day with.' },
        stars: [5, 4],
        body: { title: 'Morning', ...MUSIC },
      },
    ],
  })

const withPattern = () =>
  createFakePublicLibrary({
    author: () => ({ id: 'ana', name: 'Ana' }),
    items: [
      {
        id: 'public-9',
        kind: 'pattern',
        title: 'Waltz of mine',
        authorName: 'Bo',
        meta: { rh: 'b1', lh: 'r' },
        body: { name: 'Waltz of mine', rh: 'b1', lh: 'r' },
      },
    ],
  })

describe('an item of Explore', () => {
  it('reads as not yours: who shared it, its ratings, its words, its key and time', async () => {
    await renderApp('/songs/public/public-1', { publicLibrary: withSong() })
    expect(await screen.findByRole('heading', { level: 1, name: 'Morning' })).toBeVisible()
    expect(screen.getByText('From Explore · not in your library')).toBeVisible()
    expect(screen.getByText('Shared by').nextElementSibling).toHaveTextContent('Bo')
    expect(screen.getByText('2 ratings')).toBeVisible()
    expect(screen.getByRole('region', { name: 'About this song' })).toHaveTextContent(
      'A waltz to start the day with.',
    )
    expect(screen.getByText('Key').nextElementSibling).toHaveTextContent('G')
    expect(screen.getByText('Time').nextElementSibling).toHaveTextContent('3/4')
    // Signed out, no stars to give: the way to sign in.
    expect(screen.queryByRole('radiogroup', { name: 'Your rating' })).toBeNull()
    expect(screen.getByRole('link', { name: 'Sign in to rate' })).toHaveAttribute(
      'href',
      '/account/sign-in',
    )
  })

  it('Add to my library copies it and then reads Open in my library', async () => {
    const user = userEvent.setup()
    const publicLibrary = withSong()
    const { router, piecesStore } = await renderApp('/songs/public/public-1', {
      publicLibrary,
      auth: await signedIn(),
    })
    await user.click(await screen.findByRole('button', { name: 'Add to my library' }))
    expect(piecesStore.getState().songs).toMatchObject([
      { id: 'my-1', title: 'Morning', author: 'Bo', publicId: 'public-1' },
    ])
    expect(await screen.findByText('In your library')).toBeVisible()
    const item = await publicLibrary.item('public-1')
    expect(item.ok && item.value?.entry.saves).toBe(1)
    await user.click(screen.getByRole('button', { name: 'Open in my library' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/songs/my-1'))
  })

  it('rates once', async () => {
    const user = userEvent.setup()
    const publicLibrary = withSong()
    await renderApp('/songs/public/public-1', { publicLibrary, auth: await signedIn() })
    const stars = await screen.findByRole('radiogroup', { name: 'Your rating' })
    await user.click(within(stars).getByRole('radio', { name: '5 stars' }))
    // Three ratings: the average shows.
    expect(await screen.findByText('3 ratings')).toBeVisible()
    expect(screen.getByText('4.7')).toBeVisible()
    await user.click(within(stars).getByRole('radio', { name: '3 stars' }))
    await waitFor(() => expect(screen.getByText('4.0')).toBeVisible())
    expect(screen.getByText('3 ratings')).toBeVisible()
    expect(await publicLibrary.myRating('public-1')).toEqual({ ok: true, value: 3 })
  })

  it('adds a pattern to the learner’s patterns, then opens it', async () => {
    const user = userEvent.setup()
    const { router, patternsStore } = await renderApp('/songs/public/public-9', {
      publicLibrary: withPattern(),
      auth: await signedIn(),
    })
    expect(await screen.findByText('Right hand')).toBeVisible()
    await user.click(screen.getByRole('button', { name: 'Add to my library' }))
    expect(patternsStore.getState().own).toMatchObject([
      { id: 'my-1', name: 'Waltz of mine', rh: 'b1', lh: 'r' },
    ])
    await user.click(await screen.findByRole('button', { name: 'Open in my library' }))
    await waitFor(() =>
      expect(router.state.location.pathname).toBe('/practice/accompaniment/patterns/my-1'),
    )
  })

  it('says a song no longer there is gone, with the way to Explore', async () => {
    await renderApp('/songs/public/nothing')
    expect(await screen.findByText('This song is no longer in the Public library.')).toBeVisible()
    expect(screen.getByRole('link', { name: 'Explore' })).toHaveAttribute(
      'href',
      '/songs?view=explore',
    )
  })

  it('reports a song to the editors, signed in', async () => {
    const user = userEvent.setup()
    const publicLibrary = withSong()
    await renderApp('/songs/public/public-1', { publicLibrary, auth: await signedIn() })
    await user.click(await screen.findByRole('button', { name: 'Report' }))
    const dialog = await screen.findByRole('alertdialog', { name: 'Report this song?' })
    await user.click(within(dialog).getByRole('radio', { name: 'Spam' }))
    await user.click(within(dialog).getByRole('button', { name: 'Send report' }))
    expect(await within(dialog).findByText('Thanks: the song is reported.')).toBeVisible()
    expect(publicLibrary.reports).toEqual([{ id: 'public-1', reason: 'spam', note: '' }])
  })

  it('reads in Russian', async () => {
    await renderApp('/songs/public/public-1', { locale: 'ru', publicLibrary: withSong() })
    await screen.findByText('Из обзора · не в вашей библиотеке')
    expect(untranslated(document.body)).toEqual([])
  })
})
