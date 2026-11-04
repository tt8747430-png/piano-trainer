import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderWithSettings } from '@/app/testing/render-with-settings'
import { stubBox } from '@/shared/test/layout'
import { StaffList, type StaffRow } from './StaffList'

const row = (key: string, name: string, movable = true): StaffRow => ({
  key,
  name,
  movable,
  solo: false,
  shown: true,
  onSolo: vi.fn(),
  onShow: vi.fn(),
  onRename: movable ? vi.fn() : undefined,
  actions: [],
})

describe('the score’s instruments (A40, StaffList)', () => {
  it('solo, show/hide, reorder, New instrument', async () => {
    const user = userEvent.setup()
    const rows = [row('staff0', 'Soprano'), row('staff1', 'Alto'), row('piano', 'Piano', false)]
    const onAll = vi.fn()
    const onMove = vi.fn()
    const added = vi.fn()
    renderWithSettings(
      <StaffList
        label="Instruments"
        rows={rows}
        all
        onAll={onAll}
        onMove={onMove}
        sort={null}
        onNew={[{ key: 'tenor', label: 'Tenor', onSelect: added }]}
      />,
    )
    const list = screen.getByRole('list', { name: 'Instruments' })
    expect(
      within(list)
        .getAllByRole('listitem')
        .map((item) => item.textContent),
    ).toEqual([
      expect.stringContaining('Soprano'),
      expect.stringContaining('Alto'),
      expect.stringContaining('Piano'),
    ])
    // All, S and the eye.
    await user.click(screen.getByRole('switch', { name: 'Play all' }))
    expect(onAll).toHaveBeenCalledWith(false)
    await user.click(screen.getByRole('button', { name: 'Solo Alto' }))
    expect(rows[1]?.onSolo).toHaveBeenCalled()
    await user.click(screen.getByRole('button', { name: 'Hide Piano' }))
    expect(rows[2]?.onShow).toHaveBeenCalledWith(false)
    // The piano stays put: no handle.
    expect(screen.queryByRole('button', { name: 'Move Piano' })).toBeNull()
    // Rename from the ⋯, typed in place.
    await user.click(screen.getByRole('button', { name: 'More for Alto' }))
    await user.click(await screen.findByRole('menuitem', { name: 'Rename' }))
    const name = await screen.findByRole('textbox', { name: 'Name' })
    await user.clear(name)
    await user.type(name, 'Mezzo{Enter}')
    expect(rows[1]?.onRename).toHaveBeenCalledWith('Mezzo')
    // Reorder by the handle: picked up by Space, moved down, dropped.
    const handles = ['Soprano', 'Alto'].map((staff) =>
      screen.getByRole('button', { name: `Move ${staff}` }),
    )
    handles.forEach((handle, i) =>
      stubBox(handle.closest('li') as Element, { top: i * 56, width: 300, height: 56 }),
    )
    const soprano = handles[0] as HTMLElement
    soprano.focus()
    await user.keyboard(' ')
    await new Promise((done) => setTimeout(done, 50))
    await user.keyboard('{ArrowDown}')
    await new Promise((done) => setTimeout(done, 50))
    await user.keyboard(' ')
    await waitFor(() => expect(onMove).toHaveBeenCalledWith(['staff1', 'staff0']))
    // New instrument.
    await user.click(screen.getByRole('button', { name: 'New instrument' }))
    await user.click(await screen.findByRole('menuitem', { name: 'Tenor' }))
    expect(added).toHaveBeenCalled()
  })
})
