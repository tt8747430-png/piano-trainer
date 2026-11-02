import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { coursesOn } from '@/entities/course'
import { createFakeAuth, type AccountRole } from '@/shared/api/auth'
import { createFakeContentEditing } from '@/shared/api/content-editing'

const OWNER = { id: 'ed', email: 'ed@example.com', password: 'secret-pass', name: 'Ed' }

async function signedInAs(role: AccountRole) {
  const auth = createFakeAuth({ accounts: [{ ...OWNER, role }] })
  await auth.signIn(OWNER.email, OWNER.password)
  return auth
}

describe('Manage courses, the courses’ order on their shelves (ADR 0116 r25)', () => {
  it('is in an editor’s Courses bar, never a learner’s', async () => {
    await renderApp('/?view=courses', { auth: await signedInAs('editor') })
    expect(await screen.findByRole('link', { name: 'Manage courses' })).toHaveAttribute(
      'href',
      '/courses/manage',
    )
  })

  it('is not on a learner’s', async () => {
    await renderApp('/?view=courses', { auth: await signedInAs('learner') })
    await screen.findByRole('heading', { level: 1 })
    expect(screen.queryByRole('link', { name: 'Manage courses' })).not.toBeInTheDocument()
  })

  it('lists each shelf’s courses as Courses does, each dragged by its handle, none removed', async () => {
    await renderApp('/courses/manage', {
      auth: await signedInAs('editor'),
      contentEditing: createFakeContentEditing(),
    })
    const beginner = await screen.findByRole('region', { name: 'Beginner courses' })
    const rows = within(within(beginner).getByRole('list')).getAllByRole('listitem')
    const courses = coursesOn('beginner')
    expect(rows).toHaveLength(courses.length)
    for (const [at, course] of courses.entries()) {
      expect(rows[at]).toHaveTextContent(course.title.en)
      expect(
        within(rows[at]!).getByRole('button', { name: `Move: ${course.title.en}` }),
      ).toBeInTheDocument()
    }
    // The shelves are the Courses' own: no shelf is dragged, no course removed here.
    expect(within(beginner).queryByRole('button', { name: /^More: / })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Move: Beginner courses' })).not.toBeInTheDocument()
  })

  it('tells a learner it is an editor’s', async () => {
    await renderApp('/courses/manage', { auth: await signedInAs('learner') })
    expect(await screen.findByText('Only an editor manages the courses.')).toBeInTheDocument()
  })
})
