import { describe, expect, it } from 'vitest'
import { PIECE_TEMPO } from '@/entities/piece'
import { TEMPO_WORDS } from './song-sheet'

describe('the Song sheet', () => {
  it('names the tempo by its words, slowest first, each within the slider’s range', () => {
    const bpms = TEMPO_WORDS.map(([, bpm]) => bpm)
    expect(bpms).toEqual([...bpms].sort((a, b) => a - b))
    for (const bpm of bpms) {
      expect(bpm).toBeGreaterThanOrEqual(PIECE_TEMPO.min)
      expect(bpm).toBeLessThanOrEqual(PIECE_TEMPO.max)
    }
  })
})
