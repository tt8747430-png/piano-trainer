import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { EditableTitle } from './EditableTitle'

/** A title renamed in place, its editing held as a page holds it. */
function Title({ onRename }: { onRename: (name: string) => void }) {
  const [name, setName] = useState('Sunday')
  const [editing, setEditing] = useState(false)
  return (
    <h1>
      <EditableTitle
        value={name}
        label="Setlist name"
        hint="Rename"
        editing={editing}
        onEditingChange={setEditing}
        onRename={(next) => {
          onRename(next)
          setName(next)
        }}
      />
    </h1>
  )
}

describe('EditableTitle', () => {
  it('shows the name, a button that says it renames', () => {
    render(<Title onRename={() => {}} />)
    const title = screen.getByRole('button', { name: 'Sunday' })
    expect(title).toHaveAccessibleDescription('Rename')
    expect(screen.getByRole('heading', { name: 'Sunday' })).toContainElement(title)
  })

  it('edits on Enter, and saves a new name on Enter, giving the focus back', async () => {
    const user = userEvent.setup()
    const onRename = vi.fn()
    render(<Title onRename={onRename} />)
    act(() => screen.getByRole('button', { name: 'Sunday' }).focus())
    await user.keyboard('{Enter}')
    const field = screen.getByRole('textbox', { name: 'Setlist name' })
    expect(field).toHaveFocus()
    await user.clear(field)
    await user.type(field, '  Easter {Enter}')
    expect(onRename).toHaveBeenCalledWith('Easter')
    expect(screen.getByRole('button', { name: 'Easter' })).toHaveFocus()
  })

  it('edits on a double tap, not on one', async () => {
    const user = userEvent.setup()
    render(<Title onRename={() => {}} />)
    await user.click(screen.getByRole('button', { name: 'Sunday' }))
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    await user.dblClick(screen.getByRole('button', { name: 'Sunday' }))
    expect(screen.getByRole('textbox', { name: 'Setlist name' })).toHaveValue('Sunday')
  })

  it('keeps the old name on Escape, or for an empty one', async () => {
    const user = userEvent.setup()
    const onRename = vi.fn()
    render(<Title onRename={onRename} />)
    await user.dblClick(screen.getByRole('button', { name: 'Sunday' }))
    await user.type(screen.getByRole('textbox'), 'day{Escape}')
    expect(screen.getByRole('button', { name: 'Sunday' })).toHaveFocus()
    await user.dblClick(screen.getByRole('button', { name: 'Sunday' }))
    await user.clear(screen.getByRole('textbox'))
    await user.keyboard('{Enter}')
    expect(onRename).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Sunday' })).toBeInTheDocument()
  })

  it('saves what it holds as the field is left', async () => {
    const user = userEvent.setup()
    const onRename = vi.fn()
    render(<Title onRename={onRename} />)
    await user.dblClick(screen.getByRole('button', { name: 'Sunday' }))
    await user.type(screen.getByRole('textbox'), ' best')
    await user.click(document.body)
    expect(onRename).toHaveBeenCalledWith('Sunday best')
  })
})
