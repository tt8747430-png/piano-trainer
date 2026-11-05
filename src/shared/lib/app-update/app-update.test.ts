import { describe, expect, it, vi } from 'vitest'

import { createAppUpdate } from './app-update'

const worker = (found: 'ready' | 'downloading' | 'none' | Error) => ({
  look: vi.fn(() => (found instanceof Error ? Promise.reject(found) : Promise.resolve(found))),
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
    const registered = worker('ready')
    update.connect(registered)
    const looked = update.check()
    expect(update.status()).toBe('checking')
    await looked
    expect(update.status()).toBe('ready')
  })

  it('is up to date when the look finds nothing', async () => {
    const update = createAppUpdate({ online: () => true })
    update.connect(worker('none'))
    await update.check()
    expect(update.status()).toBe('current')
  })

  it("can't look offline, and says so", async () => {
    const update = createAppUpdate({ online: () => false })
    const registered = worker('ready')
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

  it('says a version still downloading is downloading, then ready once it has come', async () => {
    const update = createAppUpdate({ online: () => true })
    update.connect(worker('downloading'))
    await update.check()
    expect(update.status()).toBe('downloading')
    // A second look while it downloads asks nothing more of the worker.
    await update.check()
    update.found()
    expect(update.status()).toBe('ready')
  })

  it('says a download that came to nothing failed', async () => {
    const update = createAppUpdate({ online: () => true })
    update.connect(worker('downloading'))
    await update.check()
    update.lost()
    expect(update.status()).toBe('failed')
  })

  it('says it is installing once asked, and installs once', () => {
    const update = createAppUpdate({ online: () => true })
    const registered = worker('ready')
    update.connect(registered)
    update.found()
    update.install()
    expect(update.status()).toBe('installing')
    update.install()
    expect(registered.install).toHaveBeenCalledOnce()
  })

  it('installs only a version that waits', () => {
    const update = createAppUpdate({ online: () => true })
    const registered = worker('ready')
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
