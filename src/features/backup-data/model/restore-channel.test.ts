import { describe, expect, it, vi } from 'vitest'
import { announceRestore, onRestoreElsewhere } from './restore-channel'

describe('the restore channel', () => {
  it('tells the other tabs listening that a backup was restored, until they stop', async () => {
    const heard = vi.fn()
    const stop = onRestoreElsewhere(heard)
    announceRestore()
    await vi.waitFor(() => expect(heard).toHaveBeenCalledOnce())
    stop()
    announceRestore()
    await new Promise((resolve) => setTimeout(resolve, 20))
    expect(heard).toHaveBeenCalledOnce()
  })
})
