import { describe, expect, it } from 'vitest'
import { midi, note, type Clef, type SpelledNote, TICKS_PER_BEAT } from '@/shared/lib/music'
import { scoreToMei } from './mei'
import { notate } from './notate'
import type { TimedMusic, TimedNote } from './types'

const B = TICKS_PER_BEAT

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
    { startTick: 4 * B, beats: 4, barline: 'final' },
  ],
  notes,
  chords: [{ startTick: 0, symbol: 'D♭' }],
  ...extra,
})

const marked = (marks: TimedNote['marks'], finger?: TimedNote['finger']): TimedNote => ({
  ...n(72, note('C'), 'rh', 0, B),
  ...(marks ? { marks } : {}),
  ...(finger ? { finger } : {}),
})

const mei = scoreToMei(
  notate(
    music([
      n(61, note('D', -1), 'rh', 0, B),
      n(65, note('F'), 'rh', 0, B),
      n(68, note('A', -1), 'rh', B, 0.5 * B),
      n(70, note('B', -1), 'rh', 1.5 * B, 0.5 * B),
      // Over the barline: written as two notes tied.
      n(73, note('D', -1), 'rh', 2 * B, 4 * B),
      n(37, note('D', -1), 'lh', 0, 8 * B),
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

  it('starts the line on a system of its own, the encoded break Verovio lays it out by (ADR 0114)', () => {
    expect(mei).toMatch(/<section><sb\/><measure xml:id="m-0"/)
    expect(mei.match(/<sb\/>/g)).toHaveLength(1)
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
    expect(mei).toMatch(/<note xml:id="n-treble-10080-0"[^>]*tie="i"/)
    expect(mei).toMatch(/<note xml:id="n-treble-20160-0"[^>]*tie="t"/)
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
        c(B, { slurEnd: true, pedal: 'up' }),
      ]),
    )
    expect(written).toContain('<slur staff="1" startid="#n-treble-0-0" endid="#n-treble-5040-0"/>')
    expect(written).toMatch(/<dynam staff="1" startid="#n-treble-0-0"[^>]*>mf<\/dynam>/)
    expect(written).toContain('<pedal staff="1" startid="#n-treble-0-0" dir="down"/>')
    expect(written).toContain('<pedal staff="1" startid="#n-treble-5040-0" dir="up"/>')
    expect(written).toMatch(/<rend fontstyle="italic">dolce<\/rend>/)
  })

  it('writes an articulation on its note, a hairpin to where it ends and an octave line over its notes', () => {
    const written = scoreToMei(
      plain([
        c(0, { articulations: ['staccato'], hairpin: 'cresc', octave: '8va' }),
        c(B, { octave: '8va' }),
        c(2 * B, { hairpin: 'end' }),
      ]),
    )
    expect(written).toMatch(/<note xml:id="n-treble-0-0"[^>]*><artic artic="stacc"\/><\/note>/)
    expect(written).toContain(
      '<hairpin staff="1" form="cres" startid="#n-treble-0-0" endid="#n-treble-10080-0"/>',
    )
    expect(written).toMatch(
      /<octave staff="1" startid="#n-treble-0-0" endid="#n-treble-5040-0" dis="8" dis.place="above"\/>/,
    )
  })

  it('writes Flat’s other marks: 15ma, a glissando, portato, a breath, a caesura, an inverted turn, a tremolo’s strokes, an accent’s dynamic', () => {
    const written = scoreToMei(
      plain([
        c(0, { octave: '15ma', glissando: true, articulations: ['portato', 'breath'] }),
        c(B, { octave: '15ma', ornament: 'inverted-turn', dynamic: 'sfz' }),
        c(2 * B, { ornament: 'tremolo-2', articulations: ['caesura'] }),
      ]),
    )
    expect(written).toMatch(/dis="15" dis.place="above"/)
    expect(written).toContain('<gliss staff="1" startid="#n-treble-0-0" endid="#n-treble-5040-0"/>')
    expect(written).toContain('<artic artic="ten-stacc"/>')
    expect(written).toContain('<breath staff="1" tstamp="2"/>')
    expect(written).toContain('<caesura staff="1" tstamp="4"/>')
    expect(written).toContain('<turn staff="1" startid="#n-treble-5040-0" form="lower"/>')
    expect(written).toMatch(/<note xml:id="n-treble-10080-0"[^>]*stem\.mod="2slash"/)
    expect(written).toMatch(/<dynam[^>]*>sfz<\/dynam>/)
  })

  it('writes a tempo mark mid-song, a swing mark, a Roman numeral under the staff and free text over it', () => {
    const written = scoreToMei(
      plain([
        c(0, { numeral: 'V7/ii', text: 'con <brio>' }),
        c(B, { tempo: 120, swing: 'eighths' }),
      ]),
    )
    expect(written).toMatch(
      /<tempo staff="1" startid="#n-treble-5040-0" mm="120" mm\.unit="4" place="above">\u{1D15F} = 120<\/tempo>/u,
    )
    expect(written).toContain('Swing \u{1D160}\u{1D160}')
    expect(written).toContain('<harm staff="1" startid="#n-treble-0-0" place="below">V7/ii</harm>')
    expect(written).toContain(
      '<dir staff="1" startid="#n-treble-0-0" place="above">con &lt;brio&gt;</dir>',
    )
  })

  it('writes fingers only where asked, and only the staves asked for', () => {
    const score = plain([c(0, undefined, 3), { ...n(48, note('C'), 'lh', 0, B) }])
    expect(scoreToMei(score)).not.toContain('<fing')
    expect(scoreToMei(score, { fingers: true })).toContain(
      '<fing startid="#n-treble-0-0" place="above">3</fing>',
    )
    const bass = scoreToMei(score, { staves: ['bass'] })
    expect(bass).toMatch(/<staffDef n="1"[^>]*clef\.shape="F"/)
    expect(bass).not.toContain('n-treble')
    expect(bass).not.toContain('symbol="brace"')
  })

  it('names the staves drawn at the first line’s head: each single staff’s, the piano’s over its brace (ADR 0114, 0097)', () => {
    const score = notate(
      music(
        [
          c(0),
          { ...n(76, note('E'), 'staff', 0, B), staff: 0 },
          { ...n(43, note('G'), 'staff', 0, B), staff: 1 },
          n(48, note('C'), 'lh', 0, B),
        ],
        { chords: [], staves: [{ clef: 'treble' }, { clef: 'bass' }] },
      ),
    )
    const labels = {
      staff0: { text: 'Voice' },
      staff1: { text: 'Staff 2', placeholder: true },
      piano: { text: 'Piano' },
    } as const
    const named = scoreToMei(score, { labels })
    expect(named).toMatch(
      /<staffDef n="1"[^>]*clef\.shape="G"[^>]*>\s*<label><rend fontsize="small">Voice<\/rend><\/label>\s*<\/staffDef>/,
    )
    // A placeholder for a staff with no name of its own, in italics; the staff's clef its own.
    expect(named).toMatch(
      /<staffDef n="2"[^>]*clef\.shape="F"[^>]*>\s*<label><rend fontsize="small" fontstyle="italic">Staff 2<\/rend><\/label>/,
    )
    expect(named).toMatch(
      /<staffGrp symbol="brace" bar\.thru="true">\s*<label><rend fontsize="small">Piano<\/rend><\/label>\s*<staffDef n="3"/,
    )
    // A staff not drawn has no name; the piano's one staff drawn takes the piano's.
    const bass = scoreToMei(score, { labels, staves: ['bass'] })
    expect(bass).not.toContain('Voice')
    expect(bass).toMatch(/<staffDef n="1"[^>]*>\s*<label><rend fontsize="small">Piano</)
    expect(scoreToMei(score)).not.toContain('<label')
    expect(scoreToMei(score, { labels: { piano: { text: 'A & B' } } })).toContain('A &amp; B')
  })

  it('writes a blank staff’s rests as hidden ones, each named by its staff and tick', () => {
    const tune = scoreToMei(
      notate(music([c(0)], { chords: [], bars: [{ startTick: 0, beats: 4, blank: ['bass'] }] })),
    )
    expect(tune).toMatch(/<rest xml:id="h-bass-0" dur="1" type="hidden"\/>/)
  })

  it('beams eighths by the meter, as LilyPond: four to the half bar in 4/4 (ADR 0087)', () => {
    const eighths = [0, 0.5 * B, B, 1.5 * B].map((tick) => c(tick))
    const written = scoreToMei(plain(eighths.map((e) => ({ ...e, durationTicks: 0.5 * B }))))
    expect(written.match(/<beam>/g)).toHaveLength(1)
    expect(written).toMatch(/<beam>(<note[^>]*\/>){4}<\/beam>/)
  })

  it('writes each beat of triplets as its own tuplet, its eighths beamed', () => {
    const triplets = [0, B / 3, (2 * B) / 3, B, (4 * B) / 3, (5 * B) / 3].map((tick) => ({
      ...c(tick),
      durationTicks: B / 3,
    }))
    const written = scoreToMei(plain(triplets))
    expect(
      written.match(/<tuplet num="3" numbase="2"><beam>(<note[^>]*\/>){3}<\/beam><\/tuplet>/g),
    ).toHaveLength(2)
  })

  it('prints 4/4 as common time where the music asks, and any other meter by its figures (ADR 0114)', () => {
    const common = notate(music([c(0)], { chords: [], timeSymbol: true }))
    expect(common.timeSymbol).toBe(true)
    expect(scoreToMei(common)).toMatch(
      /<scoreDef meter\.count="4" meter\.unit="4" meter\.sym="common"/,
    )
    expect(scoreToMei(plain([c(0)]))).not.toContain('meter.sym')
    const waltz = notate(
      music([c(0)], {
        chords: [],
        meter: '3/4',
        timeSymbol: true,
        bars: [{ startTick: 0, beats: 3 }],
      }),
    )
    expect(scoreToMei(waltz)).not.toContain('meter.sym')
    // A change back to 4/4 prints its C too.
    const changed = notate(
      music([c(0)], {
        chords: [],
        timeSymbol: true,
        bars: [
          { startTick: 0, beats: 3, meter: '3/4' },
          { startTick: 3 * B, beats: 4 },
        ],
      }),
    )
    expect(scoreToMei(changed)).toMatch(
      /<scoreDef meter\.count="4" meter\.unit="4" meter\.sym="common"\/>/,
    )
  })

  it('writes every clef by its sign, line and octave, its notes as they sound (ADR 0114)', () => {
    const inClef = (clef: Clef) =>
      scoreToMei(
        notate(
          music([{ ...n(60, note('C'), 'staff', 0, B), staff: 0 }], {
            chords: [],
            staves: [{ clef }],
          }),
        ),
      )
    expect(inClef('alto')).toMatch(/<staffDef n="1"[^>]*clef\.shape="C" clef\.line="3"/)
    expect(inClef('tenor')).toMatch(/clef\.shape="C" clef\.line="4"/)
    expect(inClef('subbass')).toMatch(/clef\.shape="F" clef\.line="5"/)
    const low = inClef('treble-8vb')
    expect(low).toMatch(/clef\.shape="G" clef\.line="2" clef\.dis="8" clef\.dis\.place="below"/)
    // Its pitch as it sounds: Verovio draws a treble 8vb's middle C an octave up, where C5 stands.
    expect(low).toMatch(/<note xml:id="n-staff0-0-0" pname="c" oct="4"/)
    const high = inClef('bass-15ma')
    expect(high).toMatch(/clef\.dis="15" clef\.dis\.place="above"/)
    expect(high).toMatch(/<note xml:id="n-staff0-0-0" pname="c" oct="4"/)
    expect(inClef('alto')).toMatch(/<note xml:id="n-staff0-0-0" pname="c" oct="4"/)
  })

  it('marks the tempo in its own unit where it has one, else the meter’s beat (ADR 0114)', () => {
    const eighths = scoreToMei(notate(music([c(0)], { tempoUnit: '8' })))
    expect(eighths).toMatch(/<tempo [^>]*mm="168" mm\.unit="8" place="above">\u{1D160} = 168</u)
    const dotted = scoreToMei(notate(music([c(0)], { tempoUnit: '4.' })))
    expect(dotted).toMatch(/mm="56" mm\.unit="4" mm\.dots="1"/)
    const halves = scoreToMei(notate(music([c(0)], { meter: '2/2', tempoUnit: '2' })))
    expect(halves).toMatch(/mm="42" mm\.unit="2"/)
  })

  it('prints 2/2 as cut time where the music asks, else as its figures (ADR 0114)', () => {
    const cut = (timeSymbol: boolean) =>
      scoreToMei(
        notate(
          music([c(0)], {
            chords: [],
            meter: '2/2',
            ...(timeSymbol ? { timeSymbol: true as const } : {}),
          }),
        ),
      )
    expect(cut(true)).toMatch(/<scoreDef meter\.count="2" meter\.unit="2" meter\.sym="cut"/)
    expect(cut(false)).toMatch(/<scoreDef meter\.count="2" meter\.unit="2"/)
    expect(cut(false)).not.toContain('meter.sym')
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

describe('the words (ADR 0097)', () => {
  const sung = (text: string, hyphen = false, held = 0) => ({ text, hyphen, held })
  const verses = (lyrics: (ReturnType<typeof sung> | null)[][]) =>
    scoreToMei(
      notate(
        music(
          lyrics.map((each, i) => ({
            ...n(72, note('C'), 'staff', i * B, B),
            staff: 0,
            lyrics: each,
          })),
          { staves: [{ clef: 'treble' }] },
        ),
      ),
    )

  it('writes each syllable as a verse of its note, named by its staff, tick and verse, its place in the word and what joins it on', () => {
    const mei = verses([
      [sung('A', true)],
      [sung('ma', true)],
      [sung('zing')],
      [sung('grace', false, 1)],
    ])
    expect(mei).toContain(
      '<verse xml:id="v-staff0-0-0" n="1"><syl wordpos="i" con="d">A</syl></verse>',
    )
    expect(mei).toContain(
      '<verse xml:id="v-staff0-5040-0" n="1"><syl wordpos="m" con="d">ma</syl></verse>',
    )
    expect(mei).toContain(
      '<verse xml:id="v-staff0-10080-0" n="1"><syl wordpos="t">zing</syl></verse>',
    )
    expect(mei).toContain('<verse xml:id="v-staff0-15120-0" n="1"><syl con="u">grace</syl></verse>')
    expect(mei).toMatch(/<note xml:id="n-staff0-0-0"[^>]*>\s*<verse xml:id="v-staff0-0-0" n="1">/)
  })

  it('numbers the verses, skipping one that sings nothing on the note, and escapes the text', () => {
    const mei = verses([
      [sung('one'), sung('<eins>')],
      [null, sung('zwei')],
    ])
    expect(mei).toContain(
      '<verse xml:id="v-staff0-0-0" n="1"><syl>one</syl></verse><verse xml:id="v-staff0-0-1" n="2"><syl>&lt;eins&gt;</syl></verse>',
    )
    expect(mei).toContain(
      '<note xml:id="n-staff0-5040-0" pname="c" oct="5" dur="4"><verse xml:id="v-staff0-5040-1" n="2"><syl>zwei</syl></verse></note>',
    )
  })

  it('writes a chord’s syllables inside the chord', () => {
    const mei = scoreToMei(
      notate(
        music([
          { ...n(72, note('C'), 'rh', 0, 4 * B), lyrics: [sung('one')] },
          n(76, note('E'), 'rh', 0, 4 * B),
        ]),
      ),
    )
    expect(mei).toMatch(
      /<chord xml:id="c-treble-0"[^>]*>(<note [^>]*\/>){2}<verse xml:id="v-treble-0-0" n="1"><syl>one<\/syl><\/verse><\/chord>/,
    )
  })
})
