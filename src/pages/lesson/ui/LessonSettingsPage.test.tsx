import { act, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { COURSES } from '@/entities/course'
import { LESSONS, lessonPlace } from '@/entities/lesson'
import { createFakeAuth, type AccountRole } from '@/shared/api/auth'
import { createFakeContentEditing } from '@/shared/api/content-editing'
import { OPEN_SETTINGS } from '@/shared/lib'

const LESSON = LESSONS.find((lesson) => lessonPlace(lesson.id))!
const COURSE = COURSES.find((course) => course.lessons.length > 0)!
const OWNER = { id: 'ed', email: 'ed@example.com', password: 'secret-pass', name: 'Ed' }

async function signedInAs(role: AccountRole) {
  const auth = createFakeAuth({ accounts: [{ ...OWNER, role }] })
  await auth.signIn(OWNER.email, OWNER.password)
  return auth
}

/** A lesson's page with its Settings' window open over it, as its gear opens it. */
async function settingsOf(path: string, options: Parameters<typeof renderApp>[1] = {}) {
  const rendered = await renderApp(path, options)
  await act(() => rendered.router.navigate({ href: path, state: OPEN_SETTINGS }))
  return { ...rendered, window: await screen.findByRole('dialog', { name: 'Settings' }) }
}

describe('a lesson’s Settings (round 28)', () => {
  it('opens over the lesson from its bar’s gear: its name, its place, Share link and its progress', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp(`/lessons/${LESSON.id}`)
    await screen.findByRole('heading', { level: 1 })
    const bar = document.querySelector<HTMLElement>('[data-slot="screen-bar"]')!
    await user.click(within(bar).getByRole('button', { name: 'Settings' }))
    const window = await screen.findByRole('dialog', { name: 'Settings' })
    // A window over the lesson, never a page of its own.
    expect(router.state.location.pathname).toBe(`/lessons/${LESSON.id}`)
    const place = lessonPlace(LESSON.id)!
    expect(within(window).getByText(LESSON.title.en)).toBeInTheDocument()
    expect(
      within(window).getByText(`Lesson ${place.n} of ${place.total} · ${place.journey.title.en}`),
    ).toBeInTheDocument()
    expect(within(window).getByRole('button', { name: 'Share link' })).toBeInTheDocument()
    expect(within(window).getByRole('button', { name: /^Reset progress/ })).toBeInTheDocument()
    // An editor's Publishing is an editor's alone.
    expect(within(window).queryByRole('region', { name: 'Publishing' })).not.toBeInTheDocument()
  })

  it('links its Place to its level’s page, by level, chapter and number', async () => {
    const { window } = await settingsOf(`/lessons/${LESSON.id}`)
    const place = lessonPlace(LESSON.id)!
    const row = within(window).getByRole('link', { name: /^Place/ })
    expect(row).toHaveAttribute('href', `/levels/${place.journey.id}`)
    expect(row).toHaveTextContent(
      `${place.journey.title.en} · ${place.chapter.title.en} · Lesson ${place.n}`,
    )
  })

  it('resets the lesson’s progress at once, and no other lesson’s, with Undo', async () => {
    const user = userEvent.setup()
    const other = LESSONS.find((each) => each.id !== LESSON.id && lessonPlace(each.id))!
    const { progressStore } = await settingsOf(`/lessons/${LESSON.id}`)
    act(() =>
      progressStore.setState({
        learned: { [`lesson:${LESSON.id}`]: '2026-10-01', [`lesson:${other.id}`]: '2026-10-01' },
        read: { [`lesson:${LESSON.id}`]: [0, 1] },
      }),
    )
    // Reset progress loses no music: its own group, Your progress, never a red row (R31-S).
    const window = await screen.findByRole('dialog', { name: 'Settings' })
    const progress = within(window).getByRole('region', { name: 'Your progress' })
    await user.click(within(progress).getByRole('button', { name: /^Reset progress/ }))
    expect(progressStore.getState().learned).toEqual({ [`lesson:${other.id}`]: '2026-10-01' })
    expect(progressStore.getState().read).toEqual({})
    expect(await screen.findByText('Progress reset')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Undo' }))
    expect(progressStore.getState().learned[`lesson:${LESSON.id}`]).toBe('2026-10-01')
  })

  it('copies the lesson’s link where the browser has no share sheet', async () => {
    const user = userEvent.setup()
    const { window } = await settingsOf(`/lessons/${LESSON.id}`)
    await user.click(within(window).getByRole('button', { name: 'Share link' }))
    expect(await screen.findByText('Link copied')).toBeInTheDocument()
    expect(await navigator.clipboard.readText()).toBe(
      `${window.ownerDocument.location.origin}/lessons/${LESSON.id}`,
    )
  })

  it('gives an editor its Publishing', async () => {
    const { window } = await settingsOf(`/lessons/${LESSON.id}`, {
      auth: await signedInAs('editor'),
      contentEditing: createFakeContentEditing({
        items: [{ kind: 'lesson', id: LESSON.id, body: LESSON, meta: {} }],
      }),
    })
    const publishing = await within(window).findByRole('region', { name: 'Publishing' })
    expect(within(publishing).getByRole('button', { name: 'Versions' })).toBeInTheDocument()
  })

  it('gives a course’s lesson its course, published with its course', async () => {
    const lesson = COURSE.lessons[0]!
    const { window } = await settingsOf(`/courses/${COURSE.id}/${lesson.id}`, {
      auth: await signedInAs('editor'),
      contentEditing: createFakeContentEditing({
        items: [{ kind: 'lesson', id: `${COURSE.id}/${lesson.id}`, body: lesson, meta: {} }],
      }),
    })
    const row = within(window).getByRole('link', { name: /^Course/ })
    expect(row).toHaveTextContent(COURSE.title.en)
    expect(row).toHaveAttribute('href', `/courses/${COURSE.id}/edit`)
    expect(within(window).queryByRole('region', { name: 'Publishing' })).not.toBeInTheDocument()
  })
})
