import { act, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { safeLocalStorage } from '@/shared/lib'
import { renderRouted } from '../testing/render-routed'
import { StorageFullNotice } from './StorageFullNotice'

// The storage is chosen once a page, and a file before this one in its worker may have chosen it:
// this file loads the app's modules afresh, as a page would.
vi.hoisted(() => vi.resetModules())

describe('StorageFullNotice', () => {
  it('says the device is out of room when a save is lost, leads to Settings, and closes', async () => {
    await renderRouted(<StorageFullNotice />)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    const storage = safeLocalStorage()
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('full', 'QuotaExceededError')
    })
    act(() => storage.setItem('pt-takes', '{}'))
    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('This device is out of room: your last change was not saved.')
    expect(screen.getByRole('link', { name: 'Settings' })).toHaveAttribute('href', '/settings')
    await userEvent.setup().click(screen.getByRole('button', { name: 'Close the notice' }))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
