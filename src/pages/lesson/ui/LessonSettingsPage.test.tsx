import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { tickAndPublish } from '@/shared/test/publish'
import { renderApp } from '@/app/testing/render-app'
import { COURSES } from '@/entities/course'
import { LESSONS, lessonPlace } from '@/entities/lesson'
import { createFakeAuth, type AccountRole } from '@/shared/api/auth'
import { createFakeContentEditing } from '@/shared/api/content-editing'
import { expectLastAndAlone } from '@/shared/test/danger'

/** The screen bar's Settings (the gear), not the sidebar's. */
async function openSettings(user: ReturnType<typeof userEvent.setup>) {
  await screen.findByRole('heading', { level: 1 })
  const bar = document.querySelector<HTMLElement>('[data-slot="screen-bar"]')!
  await user.click(within(bar).getByRole('link', { name: 'Settings' }))
}

const LESSON = LESSONS.find((lesson) => lessonPlace(lesson.id))!
const COURSE = COURSES.find((course) => course.lessons.length > 0)!
const OWNER = { id: 'ed', email: 'ed@example.com', password: 'secret-pass', name: 'Ed' }

async function signedInAs(role: AccountRole) {
  const auth = createFakeAuth({ accounts: [{ ...OWNER, role }] })
  await auth.signIn(OWNER.email, OWNER.password)
  return auth
}

describe('a lesson’s Settings (round 28)', () => {
  it('opens from the lesson’s bar: its title, how lessons read, Share link, and its progress', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp(`/lessons/${LESSON.id}`)
    await openSettings(user)
    await waitFor(() =>
      expect(router.state.location.pathname).toBe(`/lessons/${LESSON.id}/settings`),
    )
    expect(await screen.findByText(LESSON.title.en)).toBeInTheDocument()
    // How lessons read is chosen here, its one home (R29 Decided 23), not on Settings › General.
    const reading = await screen.findByRole('radiogroup', { name: 'Lessons read as' })
    expect(within(reading).getByRole('radio', { name: /One page/ })).toBeChecked()
    expect(document.querySelector('[data-setting="lessonReading"]')).not.toBeNull()
    expect(screen.getByRole('button', { name: 'Share link' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reset progress' })).toBeInTheDocument()
    // An editor's rows are an editor's alone.
    expect(screen.queryByRole('link', { name: /Level/ })).not.toBeInTheDocument()
    expect(screen.queryByText('Written in')).not.toBeInTheDocument()
  })

  it('chooses how lessons read, and saves it', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp(`/lessons/${LESSON.id}/settings`)
    const reading = await screen.findByRole('radiogroup', { name: 'Lessons read as' })
    await user.click(within(reading).getAllByRole('radio')[1]!)
    expect(settingsStore.getState().lessonReading).toBe('sections')
  })

  it('resets the lesson’s progress once asked, and no other lesson’s', async () => {
    const user = userEvent.setup()
    const other = LESSONS.find((each) => each.id !== LESSON.id && lessonPlace(each.id))!
    const { progressStore } = await renderApp(`/lessons/${LESSON.id}/settings`)
    progressStore.setState({
      learned: { [`lesson:${LESSON.id}`]: '2026-10-01', [`lesson:${other.id}`]: '2026-10-01' },
      read: { [`lesson:${LESSON.id}`]: [0, 1] },
    })
    expectLastAndAlone(await screen.findByRole('button', { name: 'Reset progress' }))
    await user.click(await screen.findByRole('button', { name: 'Reset progress' }))
    const ask = await screen.findByRole('alertdialog', { name: 'Reset this lesson’s progress?' })
    await user.click(within(ask).getByRole('button', { name: 'Reset' }))
    expect(progressStore.getState().learned).toEqual({ [`lesson:${other.id}`]: '2026-10-01' })
    expect(progressStore.getState().read).toEqual({})
    expect(await screen.findByText('Progress reset')).toBeInTheDocument()
  })

  it('copies the lesson’s link where the browser has no share sheet', async () => {
    const user = userEvent.setup()
    await renderApp(`/lessons/${LESSON.id}/settings`)
    await user.click(await screen.findByRole('button', { name: 'Share link' }))
    expect(await screen.findByText('Link copied')).toBeInTheDocument()
    expect(await navigator.clipboard.readText()).toBe(
      `${window.location.origin}/lessons/${LESSON.id}`,
    )
  })

  it('gives an editor its level and chapter, its languages, and the lessons to read first, published', async () => {
    const user = userEvent.setup()
    const content = createFakeContentEditing({
      items: [{ kind: 'lesson', id: LESSON.id, body: LESSON, meta: {} }],
    })
    await renderApp(`/lessons/${LESSON.id}/settings`, {
      auth: await signedInAs('editor'),
      contentEditing: content,
    })
    const place = lessonPlace(LESSON.id)!
    expect(
      await screen.findByRole('link', { name: new RegExp(`Level.*${place.journey.title.en}`) }),
    ).toHaveAttribute('href', `/?journey=${place.journey.id}&edit=true`)
    expect(screen.getByText(place.chapter.title.en)).toBeInTheDocument()
    expect(await screen.findByText('English, Русский')).toBeInTheDocument()
    const other = LESSONS.find((each) => each.id !== LESSON.id && !LESSON.after?.includes(each.id))!
    await user.click(screen.getByRole('combobox', { name: 'Read first' }))
    await user.click(await screen.findByRole('option', { name: other.title.en }))
    await user.keyboard('{Escape}')
    // Publish… says where it stands, and opens its Publish page (R29 B6).
    const row = await screen.findByRole('link', { name: /^Publish…/ })
    await waitFor(() => expect(row).toHaveTextContent('Changed since it was published'), {
      timeout: 3000,
    })
    await user.click(row)
    await tickAndPublish(user)
    await waitFor(() =>
      expect(content.body('lesson', LESSON.id)).toMatchObject({
        after: [...(LESSON.after ?? []), other.id],
        sections: LESSON.sections,
      }),
    )
  })

  it('gives a course’s lesson its course, from its own bar', async () => {
    const user = userEvent.setup()
    const lesson = COURSE.lessons[0]!
    const { router } = await renderApp(`/courses/${COURSE.id}/${lesson.id}`, {
      auth: await signedInAs('editor'),
      contentEditing: createFakeContentEditing({
        items: [{ kind: 'lesson', id: `${COURSE.id}/${lesson.id}`, body: lesson, meta: {} }],
      }),
    })
    await openSettings(user)
    await waitFor(() =>
      expect(router.state.location.pathname).toBe(`/courses/${COURSE.id}/${lesson.id}/settings`),
    )
    expect(
      await screen.findByRole('link', { name: new RegExp(`Course.*${COURSE.title.en}`) }),
    ).toHaveAttribute('href', `/courses/${COURSE.id}/edit`)
    expect(screen.queryByRole('combobox', { name: 'Read first' })).not.toBeInTheDocument()
  })
})
