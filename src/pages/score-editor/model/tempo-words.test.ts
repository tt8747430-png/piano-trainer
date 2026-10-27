import { describe, expect, it } from 'vitest'
import { PIECE_TEMPO } from '@/entities/piece'
import { TEMPO_WORDS, tempoWord } from './tempo-words'

describe('the tempo words', () => {
  it('name the tempo, slowest first, each within the tempos a piece is written at', () => {
    const bpms = TEMPO_WORDS.map(([, bpm]) => bpm)
    expect(bpms).toEqual([...bpms].sort((a, b) => a - b))
    for (const bpm of bpms) {
      expect(bpm).toBeGreaterThanOrEqual(PIECE_TEMPO.min)
      expect(bpm).toBeLessThanOrEqual(PIECE_TEMPO.max)
    }
  })

  it('names a mark by the last word it has reached (ADR 0114)', () => {
    expect([40, 50, 64, 94, 110, 200].map(tempoWord)).toEqual([
      'largo',
      'largo',
      'larghetto',
      'andante',
      'moderato',
      'presto',
    ])
  })
})
