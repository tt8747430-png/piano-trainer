import { describe, expect, it, vi } from 'vitest'
import { createMidiLog } from './log'

describe('createMidiLog', () => {
  it('keeps each message with its keyboard and time, newest last', () => {
    const log = createMidiLog()
    log.add('Piano', [0x90, 60, 100], 5)
    log.add('Pads', [0x80, 60, 0], 9)
    expect(log.entries()).toEqual([
      { id: 1, device: 'Piano', data: [0x90, 60, 100], time: 5 },
      { id: 2, device: 'Pads', data: [0x80, 60, 0], time: 9 },
    ])
  })

  it('keeps only the newest it has room for', () => {
    const log = createMidiLog(2)
    for (const time of [1, 2, 3]) log.add('Piano', [0xf8], time)
    expect(log.entries().map((entry) => entry.time)).toEqual([2, 3])
  })

  it('hands out one list until a message comes, and tells its listeners', () => {
    const log = createMidiLog()
    const heard = vi.fn()
    const stop = log.subscribe(heard)
    const before = log.entries()
    expect(log.entries()).toBe(before)
    log.add('Piano', [0xf8], 1)
    expect(log.entries()).not.toBe(before)
    expect(heard).toHaveBeenCalledTimes(1)
    log.clear()
    expect(log.entries()).toEqual([])
    expect(heard).toHaveBeenCalledTimes(2)
    stop()
    log.add('Piano', [0xf8], 2)
    expect(heard).toHaveBeenCalledTimes(2)
  })
})
