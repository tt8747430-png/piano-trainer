import { describe, expect, it } from 'vitest'
import { note } from '@/shared/lib/music'
import { vampSounds } from './vamp'

describe('vampSounds', () => {
  it('swings D Dorian between Dm and G, twice, home on Dm', () => {
    const sounds = vampSounds(note('D'), 'dorian')
    const starts = [...new Set(sounds.map((each) => each.at))]
    expect(starts).toHaveLength(5)
    const at = (time: number) =>
      sounds
        .filter((each) => each.at === time)
        .map((each) => each.midi % 12)
        .sort((a, b) => a - b)
    expect(at(starts[0] ?? 0)).toEqual([2, 2, 5, 9])
    expect(at(starts[1] ?? 0)).toEqual([2, 7, 7, 11])
  })

  it('plays nothing for the major scale', () => {
    expect(vampSounds(note('C'), 'major')).toEqual([])
  })
})
