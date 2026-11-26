import { act, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { COURSES, courseStepIds } from '@/entities/course'
import { createFakeAuth } from '@/shared/api/auth'
import { createFakeContentEditing } from '@/shared/api/content-editing'
import { OPEN_SETTINGS } from '@/shared/lib'

const COURSE = COURSES.find((course) => course.lessons.length > 0)!
const OWNER = { id: 'ed', email: 'ed@example.com', password: 'secret-pass', name: 'Ed' }

describe('a course’s Settings (round 28)', () => {
  it('opens over the course from its bar’s gear: Share link, and its progress reset with Undo', async () => {
    const user = userEvent.setup()
    const { progressStore, router } = await renderApp(`/courses/${COURSE.id}`)
    await screen.findByRole('heading', { level: 1 })
    const steps = courseStepIds(COURSE)
    const learned = Object.fromEntries(steps.map((step) => [step, '2026-10-01']))
    act(() => progressStore.setState({ learned, read: { [steps[0]!]: [0] } }))
    const bar = document.querySelector<HTMLElement>('[data-slot="screen-bar"]')!
    await user.click(within(bar).getByRole('button', { name: 'Settings' }))
    const window = await screen.findByRole('dialog', { name: 'Settings' })
    // A window over the course, never a page of its own.
    expect(router.state.location.pathname).toBe(`/courses/${COURSE.id}`)
    expect(within(window).getByText(`Course · ${COURSE.lessons.length} lessons`)).toBeVisible()
    expect(within(window).getByRole('button', { name: 'Share link' })).toBeInTheDocument()
    // An editor's Shelf is an editor's alone.
    expect(within(window).queryByRole('link', { name: /^Shelf/ })).not.toBeInTheDocument()
    // Reset progress loses no music: its own group, never a red row, at once with Undo (R31-S, R38).
    const progress = within(window).getByRole('region', { name: 'Your progress' })
    await user.click(within(progress).getByRole('button', { name: /^Reset progress/ }))
    expect(progressStore.getState().learned).toEqual({})
    expect(progressStore.getState().read).toEqual({})
    await user.click(await screen.findByRole('button', { name: 'Undo' }))
    expect(progressStore.getState().learned).toEqual(learned)
  })

  it('gives an editor its shelf, a way to arrange the Courses', async () => {
    const auth = createFakeAuth({ accounts: [{ ...OWNER, role: 'editor' }] })
    await auth.signIn(OWNER.email, OWNER.password)
    const { router } = await renderApp(`/courses/${COURSE.id}`, {
      auth,
      contentEditing: createFakeContentEditing(),
    })
    await act(() => router.navigate({ href: `/courses/${COURSE.id}`, state: OPEN_SETTINGS }))
    const window = await screen.findByRole('dialog', { name: 'Settings' })
    expect(within(window).getByRole('link', { name: /^Shelf/ })).toHaveAttribute(
      'href',
      '/courses?edit=true',
    )
    expect(within(window).getByRole('region', { name: 'Publishing' })).toBeInTheDocument()
  })
})
