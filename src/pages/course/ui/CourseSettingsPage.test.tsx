import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { COURSES, courseStepIds } from '@/entities/course'
import { createFakeAuth } from '@/shared/api/auth'
import { createFakeContentEditing } from '@/shared/api/content-editing'
import { expectLastAndAlone } from '@/shared/test/danger'

/** The screen bar's Settings (the gear), not the sidebar's. */
async function openSettings(user: ReturnType<typeof userEvent.setup>) {
  await screen.findByRole('heading', { level: 1 })
  const bar = document.querySelector<HTMLElement>('[data-slot="screen-bar"]')!
  await user.click(within(bar).getByRole('link', { name: 'Settings' }))
}

const COURSE = COURSES.find((course) => course.lessons.length > 0)!
const OWNER = { id: 'ed', email: 'ed@example.com', password: 'secret-pass', name: 'Ed' }

describe('a course’s Settings (round 28)', () => {
  it('opens from the course’s bar: Share link, and its progress reset once asked', async () => {
    const user = userEvent.setup()
    const { progressStore, router } = await renderApp(`/courses/${COURSE.id}`)
    const steps = courseStepIds(COURSE)
    progressStore.setState({
      learned: Object.fromEntries(steps.map((step) => [step, '2026-10-01'])),
      read: { [steps[0]!]: [0] },
    })
    await openSettings(user)
    await waitFor(() =>
      expect(router.state.location.pathname).toBe(`/courses/${COURSE.id}/settings`),
    )
    expect(await screen.findByRole('button', { name: 'Share link' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Shelf/ })).not.toBeInTheDocument()
    // Destructive, so last and alone, red, a footnote under it (R25).
    expectLastAndAlone(screen.getByRole('button', { name: 'Reset progress' }))
    await user.click(screen.getByRole('button', { name: 'Reset progress' }))
    const ask = await screen.findByRole('alertdialog', { name: 'Reset this course’s progress?' })
    await user.click(within(ask).getByRole('button', { name: 'Reset' }))
    expect(progressStore.getState().learned).toEqual({})
    expect(progressStore.getState().read).toEqual({})
  })

  it('gives an editor its shelf, a way to Manage courses', async () => {
    const auth = createFakeAuth({ accounts: [{ ...OWNER, role: 'editor' }] })
    await auth.signIn(OWNER.email, OWNER.password)
    await renderApp(`/courses/${COURSE.id}/settings`, {
      auth,
      contentEditing: createFakeContentEditing(),
    })
    expect(await screen.findByRole('link', { name: /Shelf/ })).toHaveAttribute(
      'href',
      '/courses/manage',
    )
    // No changes, no row of them.
    expect(screen.queryByText('Unpublished changes')).not.toBeInTheDocument()
  })
})
