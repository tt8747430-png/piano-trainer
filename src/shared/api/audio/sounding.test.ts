import { describe, expect, it, vi } from 'vitest'
import { midi } from '@/shared/lib/music'
import { chordSounds } from '@/shared/lib/schedule'
import { createSoundingKeys } from './sounding'

const C_MAJOR = [60, 64, 67].map(midi)

function setUp({ frames = false } = {}) {
  let clock = 0
  const queued: (() => void)[] = []
  const keys = createSoundingKeys({
    now: () => clock,
    ...(frames ? { frame: (look: () => void) => void queued.push(look) } : {}),
  })
  return {
    keys,
    queued,
    at(seconds: number) {
      clock = seconds
      keys.update()
    },
    tick(seconds: number) {
      clock = seconds
      queued.shift()?.()
    },
  }
}

const setUpWithFrames = () => setUp({ frames: true })

describe('createSoundingKeys', () => {
  it('puts keys down as their notes start and lets them up as they end', () => {
    const { keys, at } = setUp()
    keys.add(chordSounds(C_MAJOR, { arpeggio: true }), 1)
    expect(keys.current().size).toBe(0)
    at(1.3)
    expect([...keys.current()]).toEqual([60, 64])
    at(2.45)
    expect([...keys.current()]).toEqual([64, 67])
    at(5)
    expect(keys.current().size).toBe(0)
  })

  it('tells its listeners only when the keys change, and keeps the same set until then', () => {
    const { keys, at } = setUp()
    const onChange = vi.fn()
    keys.subscribe(onChange)
    keys.add(chordSounds(C_MAJOR, { arpeggio: false }), 0)
    const struck = keys.current()
    at(0.5)
    expect(onChange).toHaveBeenCalledOnce()
    expect(keys.current()).toBe(struck)
  })

  it('silences every key at once', () => {
    const { keys, at } = setUp()
    keys.add(chordSounds(C_MAJOR, { arpeggio: false }), 0)
    at(0.5)
    keys.clear()
    expect(keys.current().size).toBe(0)
    at(0.6)
    expect(keys.current().size).toBe(0)
  })

  it('looks again every frame while a note sounds and someone listens, then stops', () => {
    const { keys, queued, tick } = setUp({ frames: true })
    const onChange = vi.fn()
    keys.subscribe(onChange)
    keys.add(chordSounds([midi(60)], { arpeggio: false }), 0)
    expect(queued).toHaveLength(1)
    tick(0.5)
    expect([...keys.current()]).toEqual([60])
    expect(queued).toHaveLength(1)
    tick(2)
    expect(keys.current().size).toBe(0)
    expect(queued).toHaveLength(0)
  })

  it('asks for no frames while nobody listens', () => {
    const { keys, queued } = setUp({ frames: true })
    keys.add(chordSounds([midi(60)], { arpeggio: false }), 0)
    expect(queued).toHaveLength(0)
    const stop = keys.subscribe(() => {})
    expect(queued).toHaveLength(1)
    stop()
  })

  it('says which keys were struck last, the same set until they change', () => {
    const { keys, at } = setUp()
    keys.add(chordSounds(C_MAJOR, { arpeggio: true }), 1)
    at(1.3)
    expect([...keys.struck()]).toEqual([64])
    const struck = keys.struck()
    at(1.35)
    expect(keys.struck()).toBe(struck)
    at(2.45)
    expect([...keys.struck()]).toEqual([67])
  })

  it('plays a play until its last note ends', () => {
    const { keys, at } = setUp()
    const onChange = vi.fn()
    keys.subscribe(onChange)
    const play = keys.add(chordSounds(C_MAJOR, { arpeggio: true }), 1)
    expect(keys.isPlaying(play)).toBe(true)
    at(2.8)
    expect(keys.isPlaying(play)).toBe(true)
    onChange.mockClear()
    at(2.85)
    expect(keys.isPlaying(play)).toBe(false)
    expect(onChange).toHaveBeenCalledOnce()
  })

  it('cuts every play off on clear, and says so before any note sounded', () => {
    const { keys } = setUp()
    const onChange = vi.fn()
    keys.subscribe(onChange)
    const play = keys.add(chordSounds(C_MAJOR, { arpeggio: false }), 1)
    keys.clear()
    expect(keys.isPlaying(play)).toBe(false)
    expect(onChange).toHaveBeenCalledOnce()
  })

  it('never plays a play with no notes', () => {
    const { keys } = setUp()
    expect(keys.isPlaying(keys.add([{ kind: 'click', at: 0, accent: true }], 0))).toBe(false)
  })

  it('plays a hand’s play without showing its keys: the hand that holds them shows them', () => {
    const { keys, at } = setUp()
    const onChange = vi.fn()
    keys.subscribe(onChange)
    const play = keys.add(chordSounds([midi(60)], { arpeggio: false }), 1, { byHand: true })
    at(1.5)
    expect(keys.current().size).toBe(0)
    expect(keys.struck().size).toBe(0)
    expect(keys.isPlaying(play)).toBe(true)
    at(5)
    expect(keys.isPlaying(play)).toBe(false)
    expect(onChange).toHaveBeenCalledOnce()
  })

  it('looks again every frame while only a hand’s play sounds, so its end is heard', () => {
    const { keys, queued, tick } = setUpWithFrames()
    keys.subscribe(() => {})
    const play = keys.add(chordSounds([midi(60)], { arpeggio: false }), 0, { byHand: true })
    expect(queued).toHaveLength(1)
    tick(5)
    expect(keys.isPlaying(play)).toBe(false)
  })
})
