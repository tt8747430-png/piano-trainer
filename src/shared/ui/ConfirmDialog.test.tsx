import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithSettings } from '@/app/testing/render-with-settings'
import { ConfirmDialog } from './ConfirmDialog'

function Asking({ onConfirm, typed }: { onConfirm: () => void; typed?: string }) {
  const [open, setOpen] = useState(true)
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={setOpen}
      title="Archive 3 songs?"
      body="You can restore them from the Archive."
      action="Archive"
      onConfirm={() => {
        onConfirm()
        setOpen(false)
      }}
      {...(typed === undefined ? {} : { typed })}
    />
  )
}

describe('ConfirmDialog', () => {
  it('asks the question, names the act, and does it only when confirmed', async () => {
    const user = userEvent.setup()
    const act = vi.fn()
    renderWithSettings(<Asking onConfirm={act} />)
    const dialog = screen.getByRole('alertdialog', { name: 'Archive 3 songs?' })
    expect(dialog).toHaveTextContent('You can restore them from the Archive.')
    await user.click(screen.getByRole('button', { name: 'Archive' }))
    expect(act).toHaveBeenCalledOnce()
  })

  it('changes nothing on Cancel or Esc', async () => {
    const user = userEvent.setup()
    const act = vi.fn()
    renderWithSettings(<Asking onConfirm={act} />)
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    expect(act).not.toHaveBeenCalled()
  })

  it('waits for the name typed where the act cannot be undone', async () => {
    const user = userEvent.setup()
    const act = vi.fn()
    renderWithSettings(<Asking onConfirm={act} typed="me@example.com" />)
    const archive = screen.getByRole('button', { name: 'Archive' })
    expect(archive).toBeDisabled()
    await user.type(
      screen.getByRole('textbox', { name: 'Type “me@example.com” to confirm' }),
      'me@example.com',
    )
    await user.click(archive)
    expect(act).toHaveBeenCalledOnce()
  })
})
