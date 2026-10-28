import { describe, expect, it } from 'vitest'
import { TEMPO_LADDER, TEMPO_TERMS, TEMPO_WORDS, tempoTerm, tempoWord } from './tempo-words'

describe('the tempo words', () => {
  it('gives every word a range, slowest first', () => {
    expect(TEMPO_TERMS.map((term) => term.word)).toEqual(TEMPO_WORDS)
    const froms = TEMPO_TERMS.map((term) => term.from)
    expect(froms).toEqual([...froms].sort((a, b) => a - b))
    for (const term of TEMPO_TERMS) if (term.to) expect(term.to).toBeGreaterThan(term.from)
  })

  it('names a tempo by the last word of the ladder it has reached (ADR 0114)', () => {
    expect([30, 40, 50, 64, 70, 94, 110, 130, 160, 170, 200].map(tempoWord)).toEqual([
      'grave',
      'largo',
      'largo',
      'larghetto',
      'adagio',
      'andante',
      'moderato',
      'allegro',
      'vivace',
      'presto',
      'prestissimo',
    ])
    expect(tempoWord(10)).toBe('grave')
  })

  it('names a tempo only by a word of the ladder, never by a shade between', () => {
    expect(TEMPO_LADDER.map((term) => term.word)).not.toContain('andantino')
    expect(tempoTerm('andantino')).toEqual({ word: 'andantino', from: 80, to: 108 })
  })

  it('keeps the ladder’s steps apart enough to read on a ruler', () => {
    for (let at = 1; at < TEMPO_LADDER.length; at += 1)
      expect(
        (TEMPO_LADDER[at]?.from ?? 0) - (TEMPO_LADDER[at - 1]?.from ?? 0),
      ).toBeGreaterThanOrEqual(6)
  })
})
