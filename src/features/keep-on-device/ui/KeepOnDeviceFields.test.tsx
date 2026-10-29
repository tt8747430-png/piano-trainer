import { screen } from '@testing-library/react'
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
    expect(await screen.findByText('12.3 MB kept on this device')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Keep them safe' }))
    expect(
      await screen.findByText('Kept safe: the browser won’t clear them to make room'),
    ).toBeInTheDocument()
  })

  it('says when the browser decides for itself', async () => {
    const user = userEvent.setup()
    await renderWithSettings(<KeepOnDeviceFields storage={device(false, false)} />)
    await user.click(await screen.findByRole('button', { name: 'Keep them safe' }))
    expect(await screen.findByText(/This browser decides for itself/)).toBeInTheDocument()
  })

  it('says it is kept safe already', async () => {
    await renderWithSettings(<KeepOnDeviceFields storage={device(true, true)} />)
    expect(await screen.findByRole('status')).toHaveTextContent('Kept safe')
    expect(screen.queryByRole('button', { name: 'Keep them safe' })).not.toBeInTheDocument()
  })
})
