import { describe, expect, it } from 'vitest'
import { midi, noteName, parseChordSymbol, TICKS_PER_BEAT } from '@/shared/lib/music'
import { chordsMusic } from './chords-music'

const BAR = 4 * TICKS_PER_BEAT
const row = (symbol: string, keys: number[]) => ({
  chord: parseChordSymbol(symbol),
  symbol,
  keys: keys.map(midi),
})

describe('chordsMusic', () => {
  it('writes each chord as a whole bar, its symbol over it, the bass under middle C', () => {
    const music = chordsMusic([row('C', [48, 60, 64, 67]), row('F/C', [48, 60, 65, 69])])
    expect(music.bars.map((bar) => bar.startTick)).toEqual([0, BAR])
    expect(music.chords).toEqual([
      { startTick: 0, symbol: 'C' },
      { startTick: BAR, symbol: 'F/C' },
    ])
    expect(music.notes.filter((n) => n.startTick === 0).map((n) => n.hand)).toEqual([
      'lh',
      'rh',
      'rh',
      'rh',
    ])
  })

  it('spells each key as its chord spells it, a slash chord’s bass as written', () => {
    const music = chordsMusic([row('E♭', [51, 63, 67, 70]), row('C/D', [50, 60, 64, 67])])
    expect(music.notes.map((n) => noteName(n.spelled))).toEqual([
      'E♭',
      'E♭',
      'G',
      'B♭',
      'D',
      'C',
      'E',
      'G',
    ])
  })
})
