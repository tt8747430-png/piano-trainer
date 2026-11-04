import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { createFakeContentEditing } from '@/shared/api/content-editing'
import { ContentEditingProvider } from '@/shared/lib/content-editing'
import { renderWithSettings } from '@/app/testing/render-with-settings'
import { RemoveGroup } from './RemoveGroup'

async function made({ publish }: { publish: boolean }) {
  const editing = createFakeContentEditing()
  await editing.create('course', 'jazz', { body: { id: 'jazz' }, meta: { title: 'Jazz' } })
  if (publish) await editing.publish('course', 'jazz')
  return editing
}

function render(editing: ReturnType<typeof createFakeContentEditing>, onDeleted = vi.fn()) {
  renderWithSettings(
    <ContentEditingProvider editing={editing}>
      <RemoveGroup kind="course" id="jazz" title="Jazz" onDeleted={onDeleted} />
    </ContentEditingProvider>,
  )
  return onDeleted
}

describe('RemoveGroup (round 28)', () => {
  it('asks a published one’s title typed before it deletes it', async () => {
    const user = userEvent.setup()
    const editing = await made({ publish: true })
    render(editing)
    // Unpublish is the Publish page's (R29 B6): Delete alone here.
    await user.click(await screen.findByRole('button', { name: /Delete/ }))
    expect(screen.queryByRole('button', { name: /Unpublish/ })).not.toBeInTheDocument()
    const asked = await screen.findByRole('alertdialog')
    await waitFor(() =>
      expect(within(asked).getByRole('button', { name: 'Delete' })).toBeDisabled(),
    )
  })

  it('deletes one not published once asked', async () => {
    const user = userEvent.setup()
    const editing = await made({ publish: false })
    const onDeleted = render(editing)
    await user.click(await screen.findByRole('button', { name: /Delete/ }))
    expect(screen.queryByRole('button', { name: /Unpublish/ })).not.toBeInTheDocument()
    await user.click(
      within(await screen.findByRole('alertdialog')).getByRole('button', { name: 'Delete' }),
    )
    await waitFor(() => expect(onDeleted).toHaveBeenCalled())
    expect(await editing.draft('course', 'jazz')).toEqual({ ok: true, value: null })
  })
})
