import { describe, expect, it } from 'vitest'
import { midi, note, type SpelledNote } from '@/shared/lib/music'
import { scoreToMei } from './mei'
import { notate } from './notate'
import type { TimedMusic, TimedNote } from './types'

const n = (
  key: number,
  spelled: SpelledNote,
  hand: TimedNote['hand'],
  startTick: number,
  durationTicks: number,
): TimedNote => ({ midi: midi(key), spelled, hand, startTick, durationTicks })

const music = (notes: TimedNote[], extra: Partial<TimedMusic> = {}): TimedMusic => ({
  key: { tonic: note('D', -1), minor: false },
  meter: '4/4',
  bars: [
    { startTick: 0, beats: 4, tempo: 84 },
    { startTick: 96, beats: 4, barline: 'final' },
  ],
  notes,
  chords: [{ startTick: 0, symbol: 'D♭' }],
  ...extra,
})

const mei = scoreToMei(
  notate(
    music([
      n(61, note('D', -1), 'rh', 0, 24),
      n(65, note('F'), 'rh', 0, 24),
      n(68, note('A', -1), 'rh', 24, 12),
      n(70, note('B', -1), 'rh', 36, 12),
      // Over the barline: written as two notes tied.
      n(73, note('D', -1), 'rh', 48, 96),
      n(37, note('D', -1), 'lh', 0, 192),
    ]),
  ),
  { title: 'Wonderful Grace' },
)

describe('scoreToMei', () => {
  it('writes an MEI document with the title, the key of five flats and 4/4', () => {
    expect(mei).toContain('<mei xmlns="http://www.music-encoding.org/ns/mei"')
    expect(mei).toContain('<title>Wonderful Grace</title>')
    expect(mei).toMatch(/<scoreDef[^>]* key\.sig="5f"/)
    expect(mei).toMatch(/meter\.count="4" meter\.unit="4"/)
  })

  it('braces the grand staff, its treble and bass clefs', () => {
    expect(mei).toMatch(/<staffGrp symbol="brace" bar\.thru="true">/)
    expect(mei).toMatch(/<staffDef n="1"[^>]*clef\.shape="G" clef\.line="2"/)
    expect(mei).toMatch(/<staffDef n="2"[^>]*clef\.shape="F" clef\.line="4"/)
  })

  it('writes a chord, a beamed pair of eighths and a tie into the next bar, each note named by its staff and tick', () => {
    expect(mei).toMatch(
      /<chord xml:id="c-treble-0" dur="4">\s*<note xml:id="n-treble-0-0" pname="d" oct="4" accid\.ges="f"/,
    )
    expect(mei).toMatch(
      /<beam>\s*<note[^>]*pname="a"[^>]*dur="8"[^>]*\/>\s*<note[^>]*pname="b"[^>]*dur="8"/,
    )
    expect(mei).toMatch(/<note xml:id="n-treble-48-0"[^>]*tie="i"/)
    expect(mei).toMatch(/<note xml:id="n-treble-96-0"[^>]*tie="t"/)
  })

  it('numbers each measure by its index, and writes its chord symbol, tempo and final barline', () => {
    expect(mei).toContain('<measure xml:id="m-0" n="1">')
    expect(mei).toContain('<measure xml:id="m-1" n="2" right="end">')
    expect(mei).toMatch(/<harm staff="1" tstamp="1">D♭<\/harm>/)
    expect(mei).toMatch(/<tempo staff="1" tstamp="1" mm="84" mm\.unit="4"/)
  })
})
