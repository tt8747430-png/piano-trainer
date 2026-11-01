import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { isDegreePiece, isPiece, PIECES, pieceRecordBody, type ChartPiece } from '@/entities/piece'
import { createFakeAuth, type AccountRole } from '@/shared/api/auth'
import { createFakeContentEditing } from '@/shared/api/content-editing'

/** A built-in song written as a chart: an original an editor changes. */
const SONG = PIECES.find(
  (piece): piece is ChartPiece =>
    isPiece(piece) && !isDegreePiece(piece) && piece.kind === 'song' && !piece.recording,
) as ChartPiece
const OWNER = { id: 'ed', email: 'ed@example.com', password: 'secret-pass', name: 'Ed' }

async function signedInAs(role: AccountRole) {
  const auth = createFakeAuth({ accounts: [{ ...OWNER, role }] })
  await auth.signIn(OWNER.email, OWNER.password)
  return auth
}

const editing = () =>
  createFakeContentEditing({
    items: [{ kind: 'piece', id: SONG.id, body: pieceRecordBody(SONG), meta: {} }],
  })

async function writeChord(user: ReturnType<typeof userEvent.setup>, symbol: string) {
  await user.click(await screen.findByRole('button', { name: /^Bar 1(:|$)/ }))
  const field = await screen.findByRole('textbox', { name: 'Chord symbol' })
  await user.clear(field)
  await user.type(field, `${symbol}{Enter}`)
  await user.keyboard('{Escape}')
}

describe('an editor’s draft of a built-in song’s original (ADR 0116)', () => {
  it('opens from the song’s Settings, an editor’s alone, its draft where it stands there', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp(`/songs/${SONG.id}/settings`, {
      auth: await signedInAs('editor'),
    })
    await user.click(await screen.findByRole('link', { name: /^Edit the original/ }))
    await waitFor(() => expect(router.state.location.pathname).toBe(`/edit/${SONG.id}`))
    expect(router.state.location.search).toMatchObject({ original: true })
  })

  it('is not in a learner’s Settings', async () => {
    await renderApp(`/songs/${SONG.id}/settings`, { auth: await signedInAs('learner') })
    await screen.findByRole('heading', { level: 1, name: 'Settings' })
    expect(screen.queryByRole('link', { name: /^Edit the original/ })).not.toBeInTheDocument()
  })

  it('is an editor’s alone: a learner is told so, with the way back to the song', async () => {
    await renderApp(`/edit/${SONG.id}?original=true`, { auth: await signedInAs('learner') })
    expect(await screen.findByText('Only an editor edits a song’s original.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Back to the song' })).toBeInTheDocument()
  })

  it('saves a change to the draft, never the learner’s version, then publishes it', async () => {
    const user = userEvent.setup()
    const content = editing()
    const { piecesStore } = await renderApp(`/edit/${SONG.id}?original=true`, {
      auth: await signedInAs('editor'),
      contentEditing: content,
    })
    await screen.findByRole('button', { name: 'The draft’s menu' })
    const strip = document.body
    expect(within(strip).getByText('Published', { selector: 'span' })).toBeInTheDocument()
    // Publish is the draft menu's first command (round 26): greyed while nothing is changed.
    await user.click(screen.getByRole('button', { name: 'The draft’s menu' }))
    expect(await screen.findByRole('menuitem', { name: 'Publish' })).toHaveAttribute(
      'aria-disabled',
      'true',
    )
    await user.keyboard('{Escape}')

    await writeChord(user, 'Dm7')
    await within(strip).findByText('Draft · saved', {}, { timeout: 3000 })
    const draft = await content.draft('piece', SONG.id)
    expect(JSON.stringify(draft.ok && draft.value?.body)).toContain('Dm7')
    expect(piecesStore.getState().versions).toEqual({})

    await user.click(screen.getByRole('button', { name: 'The draft’s menu' }))
    await user.click(await screen.findByRole('menuitem', { name: 'Publish' }))
    const asked = await screen.findByRole('alertdialog')
    await user.click(within(asked).getByRole('button', { name: 'Publish' }))
    expect(
      await screen.findByText('Published. Learners get it the next time the app starts.'),
    ).toBeInTheDocument()
    expect(JSON.stringify(content.body('piece', SONG.id))).toContain('Dm7')
    expect(await content.draft('piece', SONG.id)).toEqual({ ok: true, value: null })
  })

  it('opens on the draft kept, and discarding it opens the song as published again', async () => {
    const user = userEvent.setup()
    const content = editing()
    const changed = { ...SONG, sections: [{ kind: 'verse' as const, lines: ['Em7 Em7 Em7 Em7'] }] }
    await content.saveDraft('piece', SONG.id, { body: pieceRecordBody(changed), meta: {} })
    await renderApp(`/edit/${SONG.id}?original=true`, {
      auth: await signedInAs('editor'),
      contentEditing: content,
    })
    await screen.findByRole('button', { name: 'The draft’s menu' })
    const strip = document.body
    expect(within(strip).getByText('Draft · not published')).toBeInTheDocument()

    await user.click(within(strip).getByRole('button', { name: 'The draft’s menu' }))
    // On a narrow screen the menu is a sheet of buttons.
    await user.click(await screen.findByRole('menuitem', { name: 'Discard the draft' }))
    const asked = await screen.findByRole('alertdialog')
    await user.click(within(asked).getByRole('button', { name: 'Discard the draft' }))
    expect(await screen.findByText('Draft discarded')).toBeInTheDocument()
    await waitFor(() =>
      expect(screen.getByText('Published', { selector: 'span' })).toBeInTheDocument(),
    )
    expect(await content.draft('piece', SONG.id)).toEqual({ ok: true, value: null })
  })

  it('lists the versions kept, and restores one', async () => {
    const user = userEvent.setup()
    const content = editing()
    await content.saveDraft('piece', SONG.id, {
      body: pieceRecordBody({ ...SONG, tempo: SONG.tempo + 10 }),
      meta: {},
    })
    await content.publish('piece', SONG.id)
    await renderApp(`/edit/${SONG.id}?original=true`, {
      auth: await signedInAs('editor'),
      contentEditing: content,
    })
    await screen.findByRole('button', { name: 'The draft’s menu' })
    const strip = document.body
    await user.click(within(strip).getByRole('button', { name: 'The draft’s menu' }))
    await user.click(await screen.findByRole('menuitem', { name: 'Versions' }))
    const versions = await screen.findByRole('alertdialog')
    expect(within(versions).getByText('Newest')).toBeInTheDocument()
    await user.click(within(versions).getByRole('button', { name: 'Restore' }))
    expect(
      await screen.findByText('Restored. Learners get it the next time the app starts.'),
    ).toBeInTheDocument()
    expect(content.body('piece', SONG.id)).toEqual(pieceRecordBody(SONG))
  })

  it('says it is offline rather than opening on what may be old', async () => {
    const content = createFakeContentEditing({ online: () => false })
    await renderApp(`/edit/${SONG.id}?original=true`, {
      auth: await signedInAs('admin'),
      contentEditing: content,
    })
    expect(
      await screen.findByText('You’re offline: the draft opens once you’re back online.'),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument()
  })
})
