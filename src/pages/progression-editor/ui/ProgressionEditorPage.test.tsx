import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { progressionById } from '@/entities/progression-library'
import { createFakeAuth, type AccountRole } from '@/shared/api/auth'
import { createFakeContentEditing } from '@/shared/api/content-editing'

const OWNER = { id: 'ed', email: 'ed@example.com', password: 'secret-pass', name: 'Ed' }
const DOO_WOP = progressionById('doo-wop')!

async function signedInAs(role: AccountRole) {
  const auth = createFakeAuth({ accounts: [{ ...OWNER, role }] })
  await auth.signIn(OWNER.email, OWNER.password)
  return auth
}

describe('the progression editor (content as data)', () => {
  it('is in an editor’s Progressions bar, never a learner’s', async () => {
    await renderApp('/practice/progressions', { auth: await signedInAs('editor') })
    expect(await screen.findByRole('link', { name: 'New progression' })).toHaveAttribute(
      'href',
      '/practice/progressions/new',
    )
  })

  it('is not in a learner’s', async () => {
    await renderApp('/practice/progressions', { auth: await signedInAs('learner') })
    await screen.findByRole('heading', { level: 1 })
    expect(screen.queryByRole('link', { name: 'New progression' })).not.toBeInTheDocument()
  })

  it('edits a progression’s words and lines, and publishes it', async () => {
    const user = userEvent.setup()
    const content = createFakeContentEditing({
      items: [{ kind: 'progression', id: DOO_WOP.id, body: DOO_WOP, meta: {} }],
    })
    await renderApp(`/practice/progressions/${DOO_WOP.id}/edit`, {
      auth: await signedInAs('editor'),
      contentEditing: content,
    })
    const major = await screen.findByRole('textbox', { name: 'In a major key' })
    await user.clear(major)
    await user.type(major, 'I vi ii V')
    const strip = document.body
    await within(strip).findByText('Draft · saved', {}, { timeout: 3000 })
    await user.click(within(strip).getByRole('button', { name: 'Publish' }))
    await user.click(
      within(await screen.findByRole('alertdialog')).getByRole('button', { name: 'Publish' }),
    )
    await screen.findByText('Published. Learners get it the next time the app starts.')
    expect(content.body('progression', DOO_WOP.id)).toMatchObject({ major: 'I vi ii V' })
  })

  it('makes a new progression, unpublished, and opens its editor', async () => {
    const user = userEvent.setup()
    const content = createFakeContentEditing()
    const { router } = await renderApp('/practice/progressions/new', {
      auth: await signedInAs('editor'),
      contentEditing: content,
    })
    await user.type(await screen.findByRole('textbox', { name: 'Name' }), 'Gospel walk')
    await user.click(screen.getByRole('button', { name: 'Create progression' }))
    await waitFor(() =>
      expect(router.state.location.pathname).toBe('/practice/progressions/gospel-walk/edit'),
    )
    const draft = await content.draft('progression', 'gospel-walk')
    expect(draft.ok && draft.value?.body).toMatchObject({
      id: 'gospel-walk',
      name: { en: 'Gospel walk' },
    })
    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent('Edit progression')
    expect(await screen.findByDisplayValue('Gospel walk')).toBeInTheDocument()
  })
})
