import { screen, waitFor, within } from '@testing-library/react'
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
import { createFakeAuth, type AccountRole } from '@/shared/api/auth'
import type { ContentKind } from '@/shared/api/content'
import { createFakeContentEditing } from '@/shared/api/content-editing'
import { createFakePublicLibrary } from '@/shared/api/public-library'
import { createMemoryStorage } from '@/shared/lib'
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

/** Each of the app's kinds an editor publishes to everyone, at its Publish page, with a change drafted. */
const CATALOG: readonly {
  name: string
  kind: ContentKind
  id: string
  body: unknown
  changed: unknown
  path: string
  view: string
}[] = [
  {
    name: 'song',
    kind: 'piece',
    id: SONG.id,
    body: pieceRecordBody(SONG),
    changed: pieceRecordBody({ ...SONG, tempo: (SONG.tempo ?? 90) + 1 }),
    path: `/songs/${SONG.id}/publish`,
    view: `/songs/${SONG.id}`,
  },
  {
    name: 'lesson',
    kind: 'lesson',
    id: LESSON.id,
    body: LESSON,
    changed: { ...LESSON, title: { ...LESSON.title, en: `${LESSON.title.en}!` } },
    path: `/lessons/${LESSON.id}/publish`,
    view: `/lessons/${LESSON.id}`,
  },
  {
    name: 'course',
    kind: 'course',
    id: COURSE.id,
    body: courseRecord(COURSE),
    changed: { ...courseRecord(COURSE), title: { ...COURSE.title, en: `${COURSE.title.en}!` } },
    path: `/courses/${COURSE.id}/publish`,
    view: `/courses/${COURSE.id}`,
  },
  {
    name: 'progression',
    kind: 'progression',
    id: DOO_WOP.id,
    body: DOO_WOP,
    changed: { ...DOO_WOP, major: 'I vi ii V' },
    path: `/practice/progressions/${DOO_WOP.id}/publish`,
    view: '/practice/progressions',
  },
]

describe('one Publish page for every item (R29 B6)', () => {
  it.each(CATALOG)(
    'publishes a $name only once the rights are ticked, then shows its link, View and Versions',
    async ({ kind, id, body, changed, path, view }) => {
      const user = userEvent.setup()
      const content = createFakeContentEditing({ items: [{ kind, id, body, meta: {} }] })
      await content.saveDraft(kind, id, { body: changed, meta: {} })
      await renderApp(path, { auth: await signedInAs('editor'), contentEditing: content })
      expect(await screen.findByRole('heading', { level: 1, name: 'Publish' })).toBeInTheDocument()
      expect(await screen.findByText('Has changes')).toBeInTheDocument()
      const publish = screen.getByRole('button', { name: 'Publish new version' })
      expect(publish).toBeDisabled()
      await user.click(screen.getByRole('checkbox', { name: /I confirm/ }))
      expect(publish).toBeEnabled()
      await user.click(publish)
      await screen.findByText(
        'Published. Learners will receive it the next time they open the app.',
      )
      expect(content.body(kind, id)).toEqual(changed)
      // Ticked each time: unticked again once published.
      expect(screen.getByRole('checkbox', { name: /I confirm/ })).not.toBeChecked()
      expect(screen.getByRole('button', { name: 'Copy link' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'View' }).getAttribute('href')).toMatch(
        new RegExp(`^${view}`),
      )
      expect(screen.getByRole('button', { name: 'Versions' })).toBeInTheDocument()
      // One the app ships with stays: no Unpublish.
      expect(screen.queryByRole('button', { name: 'Unpublish' })).toBeNull()
    },
  )

  it('asks before it unpublishes an item made in the app, Unpublish last', async () => {
    const user = userEvent.setup()
    const made = { ...DOO_WOP, id: 'made-here' }
    const content = createFakeContentEditing({
      items: [{ kind: 'progression', id: made.id, body: made, meta: {} }],
    })
    await renderApp(`/practice/progressions/${made.id}/publish`, {
      auth: await signedInAs('editor'),
      contentEditing: content,
    })
    const unpublish = await screen.findByRole('button', { name: 'Unpublish' })
    const buttons = screen.getAllByRole('button')
    expect(buttons.at(-1)).toBe(unpublish)
    await user.click(unpublish)
    await confirmAsked(user, 'Unpublish')
    await waitFor(() => expect(content.body('progression', made.id)).toBeUndefined())
    expect(await screen.findByText('Not published')).toBeInTheDocument()
  })

  // A learner's own pattern goes the same way: PatternPage.test publishes and unpublishes one.
  it('publishes a learner’s own song to Explore only once the rights are ticked', async () => {
    {
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
      await renderApp('/songs/my-1/publish', {
        storage,
        auth,
        publicLibrary: createFakePublicLibrary({ author: () => ({ id: 'ed', name: 'Ed' }) }),
      })
      expect(await screen.findByText('Not published')).toBeInTheDocument()
      await user.type(
        screen.getByRole('textbox', { name: 'Description' }),
        'A slow morning song for two hands, in G.',
      )
      const publish = screen.getByRole('button', { name: 'Publish' })
      expect(publish).toBeDisabled()
      await user.click(screen.getByRole('checkbox', { name: /I confirm/ }))
      expect(publish).toBeEnabled()
      await user.click(publish)
      expect(await screen.findByRole('button', { name: 'Copy link' })).toBeInTheDocument()
      const foot = screen.getByRole('button', { name: 'Unpublish' })
      await user.click(foot)
      expect(await screen.findByRole('alertdialog')).toBeInTheDocument()
      await user.click(
        within(screen.getByRole('alertdialog')).getByRole('button', { name: 'Cancel' }),
      )
    }
  })
})
