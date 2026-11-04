import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { COURSES } from '@/entities/course'
import { LESSONS } from '@/entities/lesson'
import { isDegreePiece, isPiece, PIECES, type ChartPiece } from '@/entities/piece'
import { createFakeAuth, type AccountRole } from '@/shared/api/auth'
import { createFakeContentEditing } from '@/shared/api/content-editing'

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

/** The rows' names in the order they stand on the page. */
const rowsInOrder = (...names: RegExp[]) =>
  names.map((name) => {
    const row = screen.getByRole(name.source.startsWith('^Publish') ? 'link' : 'button', { name })
    return row
  })

describe('every item’s Settings: Publish…, Share link, then Delete (R29 B6)', () => {
  it.each([
    ['lesson', `/lessons/${LESSONS[0]!.id}/settings`],
    ['course', `/courses/${COURSES[0]!.id}/settings`],
    ['song', `/songs/${SONG.id}/settings`],
  ])('orders a %s’s publishing rows', async (_kind, path) => {
    await renderApp(path, {
      auth: await signedInAs('editor'),
      contentEditing: createFakeContentEditing(),
    })
    await screen.findByRole('link', { name: /^Publish…/ })
    const [publish, share] = rowsInOrder(/^Publish…/, /^Share link/)
    expect(publish!.compareDocumentPosition(share!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('puts a progression’s Delete last, after Publish… and Share link', async () => {
    await renderApp('/practice/progressions/made-here/settings', {
      auth: await signedInAs('editor'),
      contentEditing: createFakeContentEditing(),
    })
    const publish = await screen.findByRole('link', { name: /^Publish…/ })
    const share = screen.getByRole('button', { name: /^Share link/ })
    const remove = screen.getByRole('button', { name: /^Delete/ })
    expect(publish.compareDocumentPosition(share) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(share.compareDocumentPosition(remove) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(screen.getAllByRole('button').at(-1)).toBe(remove)
  })

  it('offers a learner Share link and no Publish… on one of the app’s lessons', async () => {
    await renderApp(`/lessons/${LESSONS[0]!.id}/settings`)
    expect(await screen.findByRole('button', { name: /^Share link/ })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /^Publish…/ })).toBeNull()
  })
})
