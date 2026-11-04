import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { LESSONS, lessonPlace } from '@/entities/lesson'
import { createFakeAuth, type AccountRole } from '@/shared/api/auth'
import { createFakeContentEditing } from '@/shared/api/content-editing'
import { folderOf } from './routes/songs-screens'
import { pickIn, pickMenu } from '@/shared/test/pickers'
import { renderApp } from './testing/render-app'

// Back (rule 26): to the screen the learner came from in the app, else up to the parent. Each place
// walked down a path and Back pressed to its foot; a phone's: the test's matchMedia answers no to the
// laptop's width.

const OWNER = { id: 'ed', email: 'ed@example.com', password: 'secret-pass', name: 'Ed' }

async function signedInAs(role: AccountRole) {
  const auth = createFakeAuth({ accounts: [{ ...OWNER, role }] })
  await auth.signIn(OWNER.email, OWNER.password)
  return auth
}

/** Where the router is: its path, and its entry in the history. */
const at = (router: Awaited<ReturnType<typeof renderApp>>['router']) => ({
  path: router.state.location.pathname,
  entry: router.history.location.state.__TSR_index,
})

const back = async (user: ReturnType<typeof userEvent.setup>) =>
  user.click(await screen.findByRole('button', { name: /^Back\b/ }))

describe('Back goes up, on every place', () => {
  it('Songs: folder → song → Settings, then Back ×3 lands in Songs', async () => {
    const user = userEvent.setup()
    const { router, piecesStore, libraryStore } = await renderApp('/songs')
    await screen.findByRole('heading', { level: 1, name: 'Songs' })
    const folderId = folderOf(piecesStore.getState(), libraryStore.getState(), 'bz5')
    expect(folderId).not.toBeNull()
    await act(() =>
      router.navigate({ to: '/songs/folders/$folderId', params: { folderId: folderId! } }),
    )
    await act(() => router.navigate({ to: '/songs/$pieceId', params: { pieceId: 'bz5' } }))
    await act(() => router.navigate({ to: '/songs/$pieceId/settings', params: { pieceId: 'bz5' } }))
    await back(user)
    await waitFor(() => expect(at(router)).toEqual({ path: '/songs/bz5', entry: 2 }))
    await back(user)
    await waitFor(() => expect(at(router).path).toBe(`/songs/folders/${folderId}`))
    await back(user)
    await waitFor(() => expect(at(router)).toEqual({ path: '/songs', entry: 0 }))
  })

  it('Learn: lesson → Edit → Done, then Back lands in Learn on the lesson’s level', async () => {
    const user = userEvent.setup()
    const lesson = LESSONS.find((each) => lessonPlace(each.id))!
    const auth = await signedInAs('editor')
    const contentEditing = createFakeContentEditing({
      items: [{ kind: 'lesson', id: lesson.id, body: lesson, meta: {} }],
    })
    const { router } = await renderApp('/', { auth, contentEditing })
    await screen.findByRole('heading', { level: 1, name: 'Learn' })
    await act(() => router.navigate({ to: '/lessons/$lessonId', params: { lessonId: lesson.id } }))
    await user.click(await screen.findByRole('button', { name: 'Edit' }))
    await waitFor(() =>
      expect(at(router)).toEqual({ path: `/lessons/${lesson.id}/edit`, entry: 1 }),
    )
    await user.click(await screen.findByRole('button', { name: 'Done' }))
    await waitFor(() => expect(at(router)).toEqual({ path: `/lessons/${lesson.id}`, entry: 1 }))
    await back(user)
    await waitFor(() => expect(at(router)).toEqual({ path: '/', entry: 0 }))
  })

  it('Practice: Chords, its root and chord changed, then Back lands in Practice', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice')
    await user.click(await screen.findByRole('link', { name: /^Chords / }))
    await screen.findByRole('heading', { level: 1, name: 'Chords' })
    await pickIn(user, 'Root', 'D')
    await pickMenu(user, 'Chord', 'Dm')
    await waitFor(() => expect(router.state.location.search).toMatchObject({ root: 'D' }))
    expect(at(router).entry).toBe(1)
    await back(user)
    await waitFor(() => expect(at(router)).toEqual({ path: '/practice', entry: 0 }))
  })

  it('Profile: Settings → Account, then Back ×2 lands in the Profile', async () => {
    const user = userEvent.setup()
    const auth = await signedInAs('learner')
    const { router } = await renderApp('/profile', { auth })
    await user.click(
      within(await screen.findByRole('main')).getAllByRole('link', { name: 'Settings' })[0]!,
    )
    await screen.findByRole('heading', { level: 1, name: 'Settings' })
    await act(() => router.navigate({ to: '/settings/account' }))
    await back(user)
    await waitFor(() => expect(at(router)).toEqual({ path: '/settings', entry: 1 }))
    await back(user)
    await waitFor(() => expect(at(router)).toEqual({ path: '/profile', entry: 0 }))
  })

  it('returns to the screen a song was opened from, not to Songs', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice')
    await screen.findByRole('heading', { level: 1, name: 'Practice' })
    await act(() => router.navigate({ to: '/songs/$pieceId', params: { pieceId: 'bz5' } }))
    await back(user)
    await waitFor(() => expect(at(router)).toEqual({ path: '/practice', entry: 0 }))
  })

  it('opened from a link, goes up to the parent and stays in the app', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/songs/bz5/settings')
    await back(user)
    await waitFor(() => expect(at(router).path).toBe('/songs/bz5'))
    await back(user)
    await waitFor(() => expect(at(router).path).toMatch(/^\/songs/))
  })
})
