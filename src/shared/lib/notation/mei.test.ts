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

const marked = (marks: TimedNote['marks'], finger?: TimedNote['finger']): TimedNote => ({
  ...n(72, note('C'), 'rh', 0, 24),
  ...(marks ? { marks } : {}),
  ...(finger ? { finger } : {}),
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
  { title: 'Wonderful Grace', chordSymbols: true },
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

describe('scoreToMei, a note’s marks and the options', () => {
  const c = (startTick: number, marks?: TimedNote['marks'], finger?: TimedNote['finger']) => ({
    ...marked(marks, finger),
    startTick,
  })
  const plain = (notes: TimedNote[]) => notate(music(notes, { chords: [] }))

  it('writes a slur from its note to the one it ends on, a dynamic, the pedal and an expression', () => {
    const written = scoreToMei(
      plain([
        c(0, { slurStart: true, dynamic: 'mf', pedal: 'down', expression: 'dolce' }),
        c(24, { slurEnd: true, pedal: 'up' }),
      ]),
    )
    expect(written).toContain('<slur staff="1" startid="#n-treble-0-0" endid="#n-treble-24-0"/>')
    expect(written).toMatch(/<dynam staff="1" startid="#n-treble-0-0"[^>]*>mf<\/dynam>/)
    expect(written).toContain('<pedal staff="1" startid="#n-treble-0-0" dir="down"/>')
    expect(written).toContain('<pedal staff="1" startid="#n-treble-24-0" dir="up"/>')
    expect(written).toMatch(/<rend fontstyle="italic">dolce<\/rend>/)
  })

  it('writes an articulation on its note, a hairpin to where it ends and an octave line over its notes', () => {
    const written = scoreToMei(
      plain([
        c(0, { articulations: ['staccato'], hairpin: 'cresc', octave: '8va' }),
        c(24, { octave: '8va' }),
        c(48, { hairpin: 'end' }),
      ]),
    )
    expect(written).toMatch(/<note xml:id="n-treble-0-0"[^>]*><artic artic="stacc"\/><\/note>/)
    expect(written).toContain(
      '<hairpin staff="1" form="cres" startid="#n-treble-0-0" endid="#n-treble-48-0"/>',
    )
    expect(written).toMatch(
      /<octave staff="1" startid="#n-treble-0-0" endid="#n-treble-24-0" dis="8" dis.place="above"\/>/,
    )
  })

  it('writes fingers only where asked, and only the staves asked for', () => {
    const score = plain([c(0, undefined, 3), { ...n(48, note('C'), 'lh', 0, 24) }])
    expect(scoreToMei(score)).not.toContain('<fing')
    expect(scoreToMei(score, { fingers: true })).toContain(
      '<fing startid="#n-treble-0-0" place="above">3</fing>',
    )
    const bass = scoreToMei(score, { staves: ['bass'] })
    expect(bass).toMatch(/<staffDef n="1"[^>]*clef\.shape="F"/)
    expect(bass).not.toContain('n-treble')
    expect(bass).not.toContain('symbol="brace"')
  })

  it('writes a blank staff’s rests as hidden ones, each named by its staff and tick', () => {
    const tune = scoreToMei(
      notate(music([c(0)], { chords: [], bars: [{ startTick: 0, beats: 4, blank: ['bass'] }] })),
    )
    expect(tune).toMatch(/<rest xml:id="h-bass-0" dur="1" type="hidden"\/>/)
  })

  it('hides the time on a line that goes on in it, and shows it where it changes', () => {
    const score = plain([c(0)])
    expect(scoreToMei(score, { timeBefore: { count: 4, unit: 4 } })).toContain(
      'meter.visible="false"',
    )
    expect(scoreToMei(score, { timeBefore: { count: 3, unit: 4 } })).not.toContain('meter.visible')
  })
})
