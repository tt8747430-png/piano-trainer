import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { confirmAsked } from '@/shared/test/confirm'
import { tickAndPublish } from '@/shared/test/publish'
import { openGear } from '@/app/testing/editor-gear'
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
  it('is the song’s one Edit for an editor: Settings shows changes only while some are unpublished', async () => {
    await renderApp(`/songs/${SONG.id}/settings`, { auth: await signedInAs('editor') })
    await screen.findByRole('heading', { level: 1, name: 'Settings' })
    expect(screen.queryByRole('link', { name: /Edit the original/ })).not.toBeInTheDocument()
    expect(screen.queryByText('Unpublished changes')).not.toBeInTheDocument()
  })

  it('is an editor’s alone: a learner edits their own version, with no draft', async () => {
    const user = userEvent.setup()
    await renderApp(`/edit/${SONG.id}`, { auth: await signedInAs('learner') })
    const gear = await openGear(user)
    expect(within(gear).queryByRole('button', { name: /^Publish/ })).not.toBeInTheDocument()
  })

  it('saves a change to the draft, never the learner’s version, then publishes it', async () => {
    const user = userEvent.setup()
    const content = editing()
    const { piecesStore } = await renderApp(`/edit/${SONG.id}`, {
      auth: await signedInAs('editor'),
      contentEditing: content,
    })
    // The gear's last group (R31-E): Publish…, the way to the song's Publish page; nothing said of
    // the draft while the song is as published (round 28).
    const gear = await openGear(user)
    expect(within(gear).getByRole('button', { name: 'Publish…' })).toBeInTheDocument()
    expect(within(gear).queryByRole('status')).not.toBeInTheDocument()
    await user.click(within(gear).getByRole('button', { name: 'Close' }))

    await writeChord(user, 'Dm7')
    // Where the draft stands, beside the gear's title.
    const again = await openGear(user)
    await within(again).findByText('Saved · not published', {}, { timeout: 3000 })
    const draft = await content.draft('piece', SONG.id)
    expect(JSON.stringify(draft.ok && draft.value?.body)).toContain('Dm7')
    expect(piecesStore.getState().versions).toEqual({})

    // Its Publish page (R29 B6): the rights ticked, then Publish new version.
    await user.click(within(again).getByRole('button', { name: 'Publish…' }))
    await tickAndPublish(user)
    expect(
      await screen.findByText(
        'Published. Learners will receive it the next time they open the app.',
      ),
    ).toBeInTheDocument()
    expect(JSON.stringify(content.body('piece', SONG.id))).toContain('Dm7')
    expect(await content.draft('piece', SONG.id)).toEqual({ ok: true, value: null })
  })

  it('opens on the draft kept, and discarding it opens the song as published again', async () => {
    const user = userEvent.setup()
    const content = editing()
    const changed = { ...SONG, sections: [{ kind: 'verse' as const, lines: ['Em7 Em7 Em7 Em7'] }] }
    await content.saveDraft('piece', SONG.id, { body: pieceRecordBody(changed), meta: {} })
    await renderApp(`/edit/${SONG.id}`, {
      auth: await signedInAs('editor'),
      contentEditing: content,
    })
    const gear = await openGear(user)
    expect(await within(gear).findByText('Not published')).toBeInTheDocument()
    await user.click(within(gear).getByRole('button', { name: 'Discard changes' }))
    const asked = await screen.findByRole('alertdialog')
    await user.click(within(asked).getByRole('button', { name: 'Discard changes' }))
    expect(await screen.findByText('Changes discarded')).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByText('Not published')).not.toBeInTheDocument())
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
    // Versions are the Publish page's (R29 B6); a restore asks first.
    await renderApp(`/songs/${SONG.id}/publish`, {
      auth: await signedInAs('editor'),
      contentEditing: content,
    })
    await user.click(await screen.findByRole('button', { name: 'Versions' }))
    const versions = await screen.findByRole('alertdialog')
    expect(within(versions).getByText('Newest')).toBeInTheDocument()
    await user.click(within(versions).getByRole('button', { name: 'Restore' }))
    await confirmAsked(user, 'Restore', 'Restore this version?')
    expect(
      await screen.findByText(
        'Restored. Learners will receive it the next time they open the app.',
      ),
    ).toBeInTheDocument()
    expect(content.body('piece', SONG.id)).toEqual(pieceRecordBody(SONG))
  })

  it('says it is offline rather than opening on what may be old', async () => {
    const content = createFakeContentEditing({ online: () => false })
    await renderApp(`/edit/${SONG.id}`, {
      auth: await signedInAs('admin'),
      contentEditing: content,
    })
    expect(
      await screen.findByText('You’re offline. It will open when you reconnect.'),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument()
  })
})
