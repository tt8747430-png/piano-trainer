import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderWithSettings } from '@/app/testing/render-with-settings'
import type { DeviceStorage } from '@/shared/api/device-storage'
import { KeepOnDeviceFields } from './KeepOnDeviceFields'

const device = (safe: boolean, grants: boolean): DeviceStorage => {
  let kept = safe
  return {
    estimate: async () => ({ used: 12_340_000, quota: 1e9 }),
    persisted: async () => kept,
    persist: async () => (kept = grants),
  }
}

describe('KeepOnDeviceFields', () => {
  it('says how much the device keeps, and keeps it safe when asked', async () => {
    const user = userEvent.setup()
    await renderWithSettings(<KeepOnDeviceFields storage={device(false, true)} />)
    expect(await screen.findByText('12.3 MB used on this device')).toBeInTheDocument()
    const keep = screen.getByRole('switch', { name: 'Protect from clearing' })
    await user.click(keep)
    await waitFor(() =>
      expect(screen.getByRole('region', { name: 'Device storage' })).toHaveTextContent(
        'Protected: the browser will not clear this data to free up space',
      ),
    )
    // Once granted it stays on: a browser keeps no way to take it back.
    expect(keep).toBeChecked()
    // Held on, and says why.
    expect(keep).toHaveAccessibleDescription(
      'Protected: the browser will not clear this data to free up space',
    )
  })

  it('says when the browser decides for itself', async () => {
    const user = userEvent.setup()
    await renderWithSettings(<KeepOnDeviceFields storage={device(false, false)} />)
    const keep = await screen.findByRole('switch', { name: 'Protect from clearing' })
    await user.click(keep)
    expect(await screen.findByText(/This browser manages storage itself/)).toBeInTheDocument()
    expect(keep).not.toBeChecked()
  })

  it('says it is kept safe already', async () => {
    await renderWithSettings(<KeepOnDeviceFields storage={device(true, true)} />)
    await waitFor(() =>
      expect(screen.getByRole('region', { name: 'Device storage' })).toHaveTextContent(
        'Protected: the browser will not clear this data to free up space',
      ),
    )
    const keep = screen.getByRole('switch', { name: 'Protect from clearing' })
    expect(keep).toBeChecked()
    // Held on, and says why.
    expect(keep).toHaveAccessibleDescription(
      'Protected: the browser will not clear this data to free up space',
    )
  })
})
