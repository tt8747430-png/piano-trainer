import { describe, expect, it, vi } from 'vitest'

import { createAppUpdate } from './app-update'

const worker = (waits: boolean | Error) => ({
  look: vi.fn(() => (waits instanceof Error ? Promise.reject(waits) : Promise.resolve(waits))),
  install: vi.fn(),
})

describe('the app update', () => {
  it('is current until a version is found', () => {
    const update = createAppUpdate({ online: () => true })
    expect(update.status()).toBe('current')
    update.found()
    expect(update.status()).toBe('ready')
  })

  it('looks when asked, saying checking until the look ends', async () => {
    const update = createAppUpdate({ online: () => true })
    const registered = worker(true)
    update.connect(registered)
    const looked = update.check()
    expect(update.status()).toBe('checking')
    await looked
    expect(update.status()).toBe('ready')
  })

  it('is up to date when the look finds nothing', async () => {
    const update = createAppUpdate({ online: () => true })
    update.connect(worker(false))
    await update.check()
    expect(update.status()).toBe('current')
  })

  it("can't look offline, and says so", async () => {
    const update = createAppUpdate({ online: () => false })
    const registered = worker(true)
    update.connect(registered)
    await update.check()
    expect(update.status()).toBe('offline')
    expect(registered.look).not.toHaveBeenCalled()
  })

  it('says a failed look failed', async () => {
    const update = createAppUpdate({ online: () => true })
    update.connect(worker(new Error('network')))
    await update.check()
    expect(update.status()).toBe('failed')
  })

  it('installs only a version that waits', () => {
    const update = createAppUpdate({ online: () => true })
    const registered = worker(true)
    update.connect(registered)
    update.install()
    expect(registered.install).not.toHaveBeenCalled()
    update.found()
    update.install()
    expect(registered.install).toHaveBeenCalledOnce()
  })

  it('tells its listeners each change, and stops when asked', () => {
    const update = createAppUpdate({ online: () => true })
    const heard = vi.fn()
    const stop = update.subscribe(heard)
    update.found()
    stop()
    update.found()
    expect(heard).toHaveBeenCalledOnce()
  })
})
