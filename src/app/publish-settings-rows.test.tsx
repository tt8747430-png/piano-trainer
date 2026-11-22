import { act, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { COURSES } from '@/entities/course'
import { LESSONS } from '@/entities/lesson'
import { progressionById } from '@/entities/progression-library'
import { isDegreePiece, isPiece, PIECES, type ChartPiece } from '@/entities/piece'
import { createFakeAuth, type AccountRole, type AuthGateway } from '@/shared/api/auth'
import { createFakeContentEditing } from '@/shared/api/content-editing'
import { OPEN_SETTINGS } from '@/shared/lib'

const OWNER = { email: 'ed@example.com', password: 'secret-pass', name: 'Ed' }

async function signedInAs(role: AccountRole) {
  const auth = createFakeAuth({ accounts: [{ ...OWNER, role }] })
  await auth.signIn(OWNER.email, OWNER.password)
  return auth
}

const SONG = PIECES.find(
  (piece): piece is ChartPiece =>
    isPiece(piece) && !isDegreePiece(piece) && piece.kind === 'song' && !piece.recording,
) as ChartPiece

/** A thing's page with its Settings' window open over it, as its ··· or gear opens it. */
async function settingsOf(path: string, auth?: AuthGateway) {
  const content = createFakeContentEditing()
  const { router } = await renderApp(path, auth ? { auth, contentEditing: content } : {})
  await act(() => router.navigate({ href: path, state: OPEN_SETTINGS }))
  return screen.findByRole('dialog')
}

/** Whether `later` stands after `first` on the page. */
const follows = (first: Element, later: Element) =>
  Boolean(first.compareDocumentPosition(later) & Node.DOCUMENT_POSITION_FOLLOWING)

describe('every item’s Settings: its publishing beside Share link (R29 B6)', () => {
  it.each([
    ['lesson', `/lessons/${LESSONS[0]!.id}`],
    ['course', `/courses/${COURSES[0]!.id}`],
  ])('puts a %s’s Publishing, its status and Versions, after Share link', async (_kind, path) => {
    const window = await settingsOf(path, await signedInAs('editor'))
    const share = await within(window).findByRole('button', { name: /^Share link/ })
    const publishing = await within(window).findByRole('region', { name: 'Publishing' })
    expect(follows(share, publishing)).toBe(true)
    expect(within(publishing).getByRole('button', { name: 'Versions' })).toBeInTheDocument()
  })

  it('puts a song’s Publish… before Share link', async () => {
    const window = await settingsOf(`/songs/${SONG.id}`, await signedInAs('editor'))
    const publish = await within(window).findByRole('button', { name: /^Publish…/ })
    const share = within(window).getByRole('button', { name: /^Share link/ })
    expect(follows(publish, share)).toBe(true)
  })

  it('puts a progression’s Delete last, after Publish… and Share link', async () => {
    const made = { ...progressionById('doo-wop')!, id: 'made-here' }
    const auth = await signedInAs('editor')
    const content = createFakeContentEditing({
      items: [{ kind: 'progression', id: made.id, body: made, meta: {} }],
    })
    const path = `/practice/progressions/${made.id}/edit`
    const { router } = await renderApp(path, { auth, contentEditing: content })
    await act(() => router.navigate({ href: path, state: OPEN_SETTINGS }))
    const window = await screen.findByRole('dialog')
    const publish = await within(window).findByRole('button', { name: /^Publish…/ })
    const share = within(window).getByRole('button', { name: /^Share link/ })
    const remove = within(window).getByRole('button', { name: /^Delete/ })
    expect(follows(publish, share)).toBe(true)
    expect(follows(share, remove)).toBe(true)
    expect(within(window).getAllByRole('button').at(-1)).toBe(remove)
  })

  it('offers a learner Share link and no Publishing on one of the app’s lessons', async () => {
    const window = await settingsOf(`/lessons/${LESSONS[0]!.id}`)
    expect(await within(window).findByRole('button', { name: /^Share link/ })).toBeInTheDocument()
    expect(within(window).queryByRole('region', { name: 'Publishing' })).toBeNull()
    expect(within(window).queryByRole('button', { name: /^Publish/ })).toBeNull()
  })
})
