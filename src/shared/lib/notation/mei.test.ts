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

  it('types a staff the pattern plays in a bar, so it is drawn in soft ink (ADR 0083)', () => {
    const played = scoreToMei(
      notate(
        music([c(0)], { chords: [], bars: [{ startTick: 0, beats: 4, pattern: ['treble'] }] }),
      ),
    )
    expect(played).toMatch(/<staff n="1" type="pattern">/)
    expect(played).toMatch(/<staff n="2">/)
  })

  it('beams eighths by the meter, as LilyPond: four to the half bar in 4/4 (ADR 0084)', () => {
    const eighths = [0, 12, 24, 36].map((tick) => c(tick))
    const written = scoreToMei(plain(eighths.map((e) => ({ ...e, durationTicks: 12 }))))
    expect(written.match(/<beam>/g)).toHaveLength(1)
    expect(written).toMatch(/<beam>(<note[^>]*\/>){4}<\/beam>/)
  })

  it('writes each beat of triplets as its own tuplet, its eighths beamed', () => {
    const triplets = [0, 8, 16, 24, 32, 40].map((tick) => ({ ...c(tick), durationTicks: 8 }))
    const written = scoreToMei(plain(triplets))
    expect(
      written.match(/<tuplet num="3" numbase="2"><beam>(<note[^>]*\/>){3}<\/beam><\/tuplet>/g),
    ).toHaveLength(2)
  })

  it('hides the time on a line that goes on in it, and shows it where it changes', () => {
    const score = plain([c(0)])
    expect(scoreToMei(score, { timeBefore: { count: 4, unit: 4 } })).toContain(
      'meter.visible="false"',
    )
    expect(scoreToMei(score, { timeBefore: { count: 3, unit: 4 } })).not.toContain('meter.visible')
  })

  describe('a courtesy signature at the line’s end, as LilyPond prints one before a change', () => {
    const score = plain([c(0)])
    const last = score.measures.at(-1)!
    // What follows the line's last measure: a page break, the next line's signature, a measure of it.
    const courtesy = (written: string) =>
      written.match(/<\/measure><pb\/>(<scoreDef[^]*?)<measure xml:id="m-next"/)?.[1]

    it('ends the line with the key and time the next line starts in', () => {
      const written = scoreToMei(score, {
        next: { time: { count: 3, unit: 4 }, key: { tonic: note('D'), minor: false } },
      })
      expect(courtesy(written)).toBe('<scoreDef meter.count="3" meter.unit="4" key.sig="2s"/>')
      // Drawn on a page of its own, the next line's measure holds no note to be read back.
      expect(written).toMatch(
        /<measure xml:id="m-next"[^>]*>(<staff n="\d"><layer n="1"><mSpace\/><\/layer><\/staff>)+<\/measure><\/section>/,
      )
    })

    it('prints only what changes: the key alone, or the time alone', () => {
      expect(
        courtesy(scoreToMei(score, { next: { ...last, key: { tonic: note('E'), minor: false } } })),
      ).toBe('<scoreDef key.sig="4s"/>')
      expect(courtesy(scoreToMei(score, { next: { ...last, time: { count: 2, unit: 4 } } }))).toBe(
        '<scoreDef meter.count="2" meter.unit="4"/>',
      )
    })

    it('prints the clef a staff changes to', () => {
      expect(courtesy(scoreToMei(score, { next: { ...last, clefs: { treble: 'bass' } } }))).toBe(
        '<scoreDef><staffGrp><staffDef n="1" clef.shape="F" clef.line="4"/></staffGrp></scoreDef>',
      )
    })

    it('writes nothing after the line when the next goes on as it ends', () => {
      const written = scoreToMei(score, { next: last })
      expect(written).not.toContain('m-next')
      expect(written).not.toContain('<pb/>')
    })
  })
})
