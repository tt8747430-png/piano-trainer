import { describe, expect, it } from 'vitest'
import { PIECE_TEMPO } from '@/entities/piece'
import { TEMPO_WORDS } from './tempo-words'

describe('the tempo words', () => {
  it('name the tempo, slowest first, each within the tempos a piece is written at', () => {
    const bpms = TEMPO_WORDS.map(([, bpm]) => bpm)
    expect(bpms).toEqual([...bpms].sort((a, b) => a - b))
    for (const bpm of bpms) {
      expect(bpm).toBeGreaterThanOrEqual(PIECE_TEMPO.min)
      expect(bpm).toBeLessThanOrEqual(PIECE_TEMPO.max)
    }
  })
})
