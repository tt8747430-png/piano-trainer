import { VerovioToolkit } from 'verovio/esm'
import { describe, expect, it, vi } from 'vitest'
import { loadToolkit } from './toolkit'

describe('loadToolkit', () => {
  it('makes one toolkit, and takes it again when its module is loaded afresh', async () => {
    const toolkit = await loadToolkit()
    // A test file's fresh modules: Verovio's own, a package's, stay as they were.
    vi.resetModules()
    const fresh = await import('./toolkit')
    // Compared, never printed: a toolkit holds all of Verovio's memory.
    expect((await fresh.loadToolkit()) === toolkit).toBe(true)
    expect(VerovioToolkit.instances.length).toBe(1)
  })
})
