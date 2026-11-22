import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { COURSES, courseRecord } from '@/entities/course'
import { LESSONS } from '@/entities/lesson'
import {
  isDegreePiece,
  isPiece,
  PIECES,
  PIECES_STORAGE_KEY,
  PIECES_VERSION,
  pieceRecordBody,
  type ChartPiece,
} from '@/entities/piece'
import { progressionById } from '@/entities/progression-library'
import { createFakeAuth, type AccountRole, type AuthGateway } from '@/shared/api/auth'
import type { ContentKind } from '@/shared/api/content'
import { createFakeContentEditing, type ContentEditingPort } from '@/shared/api/content-editing'
import { createFakePublicLibrary } from '@/shared/api/public-library'
import { createMemoryStorage, OPEN_PUBLISH, OPEN_SETTINGS } from '@/shared/lib'
import { confirmAsked } from '@/shared/test/confirm'

const OWNER = { email: 'ed@example.com', password: 'secret-pass', name: 'Ed' }

async function signedInAs(role: AccountRole) {
  const auth = createFakeAuth({ accounts: [{ ...OWNER, role }] })
  await auth.signIn(OWNER.email, OWNER.password)
  return auth
}

const LESSON = LESSONS[0]!
const COURSE = COURSES[0]!
const DOO_WOP = progressionById('doo-wop')!
const SONG = PIECES.find(
  (piece): piece is ChartPiece =>
    isPiece(piece) && !isDegreePiece(piece) && piece.kind === 'song' && !piece.recording,
) as ChartPiece

/**
 * A thing's page with its Settings' window open over it on `page`, as its ··· or the editor's
 * Publish opens it: the window is the history entry's, never the address's.
 */
async function windowOf(
  path: string,
  page: typeof OPEN_SETTINGS | typeof OPEN_PUBLISH,
  options: { auth: AuthGateway; contentEditing: ContentEditingPort },
) {
  const { router } = await renderApp(path, options)
  await act(() => router.navigate({ href: path, state: page }))
  return screen.findByRole('dialog')
}

/** An item of the app's an editor publishes to everyone, with a change drafted. */
interface Drafted {
  name: string
  kind: ContentKind
  id: string
  body: unknown
  changed: unknown
  path: string
}

/** The kinds with a Publish page in their Settings' window, and where its View goes. */
const PAGES: readonly (Drafted & { view: string })[] = [
  {
    name: 'song',
    kind: 'piece',
    id: SONG.id,
    body: pieceRecordBody(SONG),
    changed: pieceRecordBody({ ...SONG, tempo: (SONG.tempo ?? 90) + 1 }),
    path: `/songs/${SONG.id}`,
    view: `/songs/${SONG.id}`,
  },
  {
    name: 'progression',
    kind: 'progression',
    id: DOO_WOP.id,
    body: DOO_WOP,
    changed: { ...DOO_WOP, major: 'I vi ii V' },
    path: `/practice/progressions/${DOO_WOP.id}/edit`,
    view: `/practice/progressions/${DOO_WOP.id}`,
  },
]

/** The kinds published from their Settings' Publishing in one tap. */
const ROWS: readonly Drafted[] = [
  {
    name: 'lesson',
    kind: 'lesson',
    id: LESSON.id,
    body: LESSON,
    changed: { ...LESSON, title: { ...LESSON.title, en: `${LESSON.title.en}!` } },
    path: `/lessons/${LESSON.id}`,
  },
  {
    name: 'course',
    kind: 'course',
    id: COURSE.id,
    body: courseRecord(COURSE),
    changed: { ...courseRecord(COURSE), title: { ...COURSE.title, en: `${COURSE.title.en}!` } },
    path: `/courses/${COURSE.id}`,
  },
]

const PUBLISHED = 'Published. Learners will receive it the next time they open the app.'

describe('publishing every item from its Settings (R29 B6)', () => {
  it.each(PAGES)(
    'publishes a $name only once the rights are ticked, then shows its link, View and Versions',
    async ({ kind, id, body, changed, path, view }) => {
      const user = userEvent.setup()
      const content = createFakeContentEditing({ items: [{ kind, id, body, meta: {} }] })
      await content.saveDraft(kind, id, { body: changed, meta: {} })
      const window = await windowOf(path, OPEN_PUBLISH, {
        auth: await signedInAs('editor'),
        contentEditing: content,
      })
      expect(within(window).getByRole('heading', { name: 'Publish' })).toBeInTheDocument()
      expect(await within(window).findByText('Has changes')).toBeInTheDocument()
      const publish = within(window).getByRole('button', { name: 'Publish new version' })
      expect(publish).toBeDisabled()
      await user.click(within(window).getByRole('checkbox', { name: /I confirm/ }))
      expect(publish).toBeEnabled()
      await user.click(publish)
      await screen.findByText(PUBLISHED)
      expect(content.body(kind, id)).toEqual(changed)
      // Ticked each time: unticked again once published.
      expect(within(window).getByRole('checkbox', { name: /I confirm/ })).not.toBeChecked()
      expect(within(window).getByRole('button', { name: 'Copy link' })).toBeInTheDocument()
      expect(within(window).getByRole('link', { name: 'View' }).getAttribute('href')).toMatch(
        new RegExp(`^${view}`),
      )
      expect(within(window).getByRole('button', { name: 'Versions' })).toBeInTheDocument()
      // One the app ships with stays: no Unpublish.
      expect(within(window).queryByRole('button', { name: 'Unpublish' })).toBeNull()
    },
  )

  it.each(ROWS)(
    'publishes a $name’s changes in one tap from its Settings’ Publishing',
    async ({ kind, id, body, changed, path }) => {
      const user = userEvent.setup()
      const content = createFakeContentEditing({ items: [{ kind, id, body, meta: {} }] })
      await content.saveDraft(kind, id, { body: changed, meta: {} })
      const window = await windowOf(path, OPEN_SETTINGS, {
        auth: await signedInAs('editor'),
        contentEditing: content,
      })
      const publishing = await within(window).findByRole('region', { name: 'Publishing' })
      expect(await within(publishing).findByText('Has changes')).toBeInTheDocument()
      await user.click(await within(window).findByRole('button', { name: 'Publish changes' }))
      await screen.findByText(PUBLISHED)
      expect(content.body(kind, id)).toEqual(changed)
    },
  )

  it('asks before it unpublishes an item made in the app, Unpublish last', async () => {
    const user = userEvent.setup()
    const made = { ...DOO_WOP, id: 'made-here' }
    const content = createFakeContentEditing({
      items: [{ kind: 'progression', id: made.id, body: made, meta: {} }],
    })
    const window = await windowOf(`/practice/progressions/${made.id}/edit`, OPEN_PUBLISH, {
      auth: await signedInAs('editor'),
      contentEditing: content,
    })
    const unpublish = await within(window).findByRole('button', { name: 'Unpublish' })
    expect(within(window).getAllByRole('button').at(-1)).toBe(unpublish)
    await user.click(unpublish)
    await confirmAsked(user, 'Unpublish')
    await waitFor(() => expect(content.body('progression', made.id)).toBeUndefined())
    expect(await within(window).findByText('Not published')).toBeInTheDocument()
  })

  // A learner's own pattern goes the same way: PatternPage.test publishes and unpublishes one.
  it('publishes a learner’s own song to Explore only once the rights are ticked', async () => {
    const user = userEvent.setup()
    const storage = createMemoryStorage()
    storage.setItem(
      PIECES_STORAGE_KEY,
      JSON.stringify({
        state: {
          songs: [
            {
              id: 'my-1',
              title: 'Morning',
              key: 'G',
              meter: '4/4',
              tempo: 90,
              pattern: 'r1',
              added: '2026-11-01T10:00:00Z',
              sections: [{ kind: 'verse', lines: ['G C D G'] }],
            },
          ],
          nextSong: 2,
        },
        version: PIECES_VERSION,
      }),
    )
    const auth = createFakeAuth({ accounts: [OWNER] })
    await auth.signIn(OWNER.email, OWNER.password)
    const { router } = await renderApp('/songs/my-1', {
      storage,
      auth,
      publicLibrary: createFakePublicLibrary({ author: () => ({ id: 'ed', name: 'Ed' }) }),
    })
    await act(() => router.navigate({ href: '/songs/my-1', state: OPEN_PUBLISH }))
    await user.type(
      await screen.findByRole('textbox', { name: 'Description' }),
      'A slow morning song for two hands, in G.',
    )
    const publish = screen.getByRole('button', { name: 'Publish' })
    expect(publish).toBeDisabled()
    await user.click(screen.getByRole('checkbox', { name: /I confirm/ }))
    expect(publish).toBeEnabled()
    await user.click(publish)
    expect(await screen.findByRole('button', { name: 'Copy link' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Unpublish' }))
    expect(await screen.findByRole('alertdialog')).toBeInTheDocument()
    await user.click(
      within(screen.getByRole('alertdialog')).getByRole('button', { name: 'Cancel' }),
    )
  })
})
