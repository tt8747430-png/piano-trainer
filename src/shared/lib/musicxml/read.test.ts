import { describe, expect, it } from 'vitest'
import { note, parseChordSymbol, TICKS_PER_BEAT } from '@/shared/lib/music'
import { NotAScoreError, readMusicXml } from './read'
import { XmlError } from './xml'

const B = TICKS_PER_BEAT

const pitch = (step: string, octave: number, alter = 0) =>
  `<pitch><step>${step}</step>${alter ? `<alter>${alter}</alter>` : ''}<octave>${octave}</octave></pitch>`

/** A piano piece as another app (MuseScore's shape) writes it: 480 divisions a quarter. */
const PIANO = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 4.0 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">
<score-partwise version="4.0">
  <identification><creator type="composer">J. S. Bach</creator></identification>
  <credit page="1"><credit-words>Minuet</credit-words></credit>
  <part-list><score-part id="P1"><part-name>Piano</part-name></score-part></part-list>
  <part id="P1">
    <measure number="1">
      <attributes><divisions>480</divisions><key><fifths>-1</fifths></key>
        <time symbol="common"><beats>4</beats><beat-type>4</beat-type></time><staves>2</staves>
        <clef number="1"><sign>G</sign><line>2</line></clef><clef number="2"><sign>F</sign><line>4</line></clef></attributes>
      <direction placement="above"><direction-type><words>Allegro</words></direction-type><sound tempo="120"/></direction>
      <direction placement="above"><direction-type><metronome><beat-unit>quarter</beat-unit><per-minute>120</per-minute></metronome></direction-type></direction>
      <direction placement="below"><direction-type><dynamics><p/></dynamics></direction-type><staff>1</staff></direction>
      <harmony><root><root-step>F</root-step></root><kind>major</kind></harmony>
      <note>${pitch('F', 4)}<duration>960</duration><voice>1</voice><type>half</type><staff>1</staff>
        <notations><slur type="start" number="1"/><technical><fingering>1</fingering></technical></notations>
        <lyric number="1"><syllabic>begin</syllabic><text>Hal</text></lyric></note>
      <note><chord/>${pitch('A', 4)}<duration>960</duration><voice>1</voice><type>half</type><staff>1</staff></note>
      <harmony><root><root-step>C</root-step></root><kind>dominant</kind><offset>480</offset></harmony>
      <note>${pitch('G', 4)}<duration>160</duration><voice>1</voice><type>eighth</type>
        <time-modification><actual-notes>3</actual-notes><normal-notes>2</normal-notes></time-modification><staff>1</staff>
        <lyric number="1"><syllabic>end</syllabic><text>lo</text><extend/></lyric></note>
      <note>${pitch('A', 4)}<duration>160</duration><voice>1</voice><type>eighth</type><staff>1</staff></note>
      <note>${pitch('B', 4, -1)}<duration>160</duration><voice>1</voice><type>eighth</type><staff>1</staff>
        <notations><slur type="stop" number="1"/></notations></note>
      <note>${pitch('C', 5)}<duration>480</duration><tie type="start"/><voice>1</voice><type>quarter</type><staff>1</staff>
        <notations><tied type="start"/><articulations><staccato/><detached-legato/></articulations></notations></note>
      <backup><duration>1920</duration></backup>
      <direction placement="below"><direction-type><pedal type="start"/></direction-type><staff>2</staff></direction>
      <note>${pitch('F', 2)}<duration>1920</duration><voice>5</voice><type>whole</type><staff>2</staff></note>
    </measure>
    <measure number="2">
      <barline location="left"><bar-style>heavy-light</bar-style><repeat direction="forward"/><ending number="1" type="start"/></barline>
      <direction><direction-type><dynamics><sfz/></dynamics></direction-type><staff>1</staff></direction>
      <note>${pitch('C', 5)}<duration>480</duration><tie type="stop"/><voice>1</voice><type>quarter</type><staff>1</staff></note>
      <note><grace slash="yes"/>${pitch('E', 5)}<voice>1</voice><type>eighth</type><staff>1</staff></note>
      <note>${pitch('D', 5)}<duration>480</duration><voice>1</voice><type>quarter</type><staff>1</staff></note>
      <note>${pitch('E', 5)}<duration>96</duration><voice>1</voice><type>16th</type><staff>1</staff></note>
      <note>${pitch('F', 5)}<duration>96</duration><voice>1</voice><type>16th</type><staff>1</staff></note>
      <note>${pitch('G', 5)}<duration>96</duration><voice>1</voice><type>16th</type><staff>1</staff></note>
      <note>${pitch('A', 5)}<duration>96</duration><voice>1</voice><type>16th</type><staff>1</staff></note>
      <note>${pitch('B', 5, -1)}<duration>96</duration><voice>1</voice><type>16th</type><staff>1</staff></note>
      <note><rest/><duration>480</duration><voice>1</voice><type>quarter</type><staff>1</staff></note>
      <backup><duration>1920</duration></backup>
      <note><rest measure="yes"/><duration>1920</duration><voice>5</voice><staff>2</staff></note>
      <barline location="right"><bar-style>light-heavy</bar-style><ending number="1" type="stop"/><repeat direction="backward"/></barline>
    </measure>
    <measure number="3">
      <print new-system="yes"/>
      <attributes><key><fifths>2</fifths><mode>major</mode></key><clef number="2"><sign>G</sign><line>2</line></clef></attributes>
      <direction placement="above"><direction-type><rehearsal>B</rehearsal></direction-type></direction>
      <direction placement="above"><direction-type><octave-shift type="down" size="8"/></direction-type><staff>1</staff></direction>
      <note>${pitch('D', 6)}<duration>1920</duration><voice>1</voice><type>whole</type><staff>1</staff></note>
      <direction><direction-type><octave-shift type="stop" size="8"/></direction-type><staff>1</staff></direction>
      <backup><duration>1920</duration></backup>
      <note>${pitch('F', 4, 1)}<duration>1920</duration><voice>5</voice><type>whole</type><staff>2</staff></note>
      <barline location="right"><bar-style>light-heavy</bar-style></barline>
    </measure>
  </part>
</score-partwise>`

describe('readMusicXml', () => {
  it('reads another app’s piano piece: its title, key, meter, tempo, staves and bars', () => {
    const score = readMusicXml(PIANO)
    expect(score).toMatchObject({
      title: 'Minuet',
      composer: 'J. S. Bach',
      key: { tonic: note('F'), minor: false },
      meter: '4/4',
      timeSymbol: true,
      tempo: 120,
      parts: [{ name: 'Piano', staves: [0, 1] }],
      staves: [
        { part: 0, clef: 'treble', hidden: false },
        { part: 0, clef: 'bass', hidden: false },
      ],
    })
    expect(score.bars.map(({ startTick, ticks }) => [startTick, ticks])).toEqual([
      [0, 4 * B],
      [4 * B, 4 * B],
      [8 * B, 4 * B],
    ])
    expect(score.bars[1]).toMatchObject({ repeatStart: true, ending: 1, barline: 'repeat' })
    expect(score.bars[2]).toMatchObject({
      key: { tonic: note('D'), minor: false },
      clefs: { 1: 'treble' },
      lineStart: true,
      rehearsal: 'B',
      barline: 'final',
    })
    expect(score.chords).toEqual([
      { startTick: 0, chord: parseChordSymbol('F') },
      { startTick: 3 * B, chord: parseChordSymbol('C7') },
    ])
  })

  it('reads notes in ticks: chords, triplets, ties joined, grace notes, marks, fingers and words', () => {
    const notes = readMusicXml(PIANO).notes
    const at = (tick: number, staff = 0) =>
      notes.filter((n) => n.startTick === tick && n.staff === staff)
    expect(at(0).map((n) => n.midi)).toEqual([65, 69])
    expect(at(0)[0]).toMatchObject({
      durationTicks: 2 * B,
      finger: 1,
      marks: { dynamic: 'p', slurStart: true },
      lyrics: [{ text: 'Hal', hyphen: true, held: 0 }],
    })
    // A chord's note takes its first note's marks.
    expect(at(0)[1]?.marks).toEqual({ dynamic: 'p', slurStart: true })
    expect(at(2 * B)[0]).toMatchObject({ durationTicks: B / 3, lyrics: [{ text: 'lo', held: 2 }] })
    expect(at((8 * B) / 3)[0]).toMatchObject({ midi: 70, marks: { slurEnd: true } })
    // Tied across the barline: one note.
    expect(at(3 * B)[0]).toMatchObject({
      midi: 72,
      durationTicks: 2 * B,
      marks: { articulations: ['staccato', 'portato'] },
    })
    expect(at(5 * B)[0]?.marks?.grace).toEqual([{ midi: 76, spelled: note('E') }])
    expect(at(0, 1)[0]).toMatchObject({ midi: 41, marks: { pedal: 'down' } })
    // Written an octave under where it sounds: the pitch read is the one heard.
    expect(at(8 * B)[0]).toMatchObject({ midi: 86, marks: { octave: '8va' } })
    expect(at(8 * B, 1)[0]).toMatchObject({ midi: 66, spelled: note('F', 1) })
  })

  it('counts what it leaves out', () => {
    // Nothing: Allegro names the tempo, the quintuplet, the sfz and the detached legato are read
    // (ADR 0097).
    expect(readMusicXml(PIANO).leftOut).toEqual({})
  })

  it('reads a tempo change, a swing mark, a Roman numeral and free text onto their notes', () => {
    const words = (text: string, placement = 'above') =>
      `<direction placement="${placement}"><direction-type><words>${text}</words></direction-type><staff>1</staff></direction>`
    const quarter = `<note>${pitch('C', 5)}<duration>1</duration><voice>1</voice><type>quarter</type><staff>1</staff></note>`
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<score-partwise version="4.0">
  <part-list><score-part id="P1"><part-name>Piano</part-name></score-part></part-list>
  <part id="P1"><measure number="1">
    <attributes><divisions>1</divisions><time><beats>4</beats><beat-type>4</beat-type></time></attributes>
    <direction placement="above"><direction-type><words>Moderato</words></direction-type><direction-type><metronome><beat-unit>quarter</beat-unit><per-minute>100</per-minute></metronome></direction-type><sound tempo="100"/></direction>
    ${quarter}
    <direction placement="above"><direction-type><metronome><beat-unit>quarter</beat-unit><per-minute>72</per-minute></metronome></direction-type><sound tempo="72"/></direction>
    ${words('Swing \u{1D160}\u{1D160}')}${words('con brio, ma')}${words('V7/ii', 'below')}
    ${quarter}
    <direction><direction-type><dynamics><pppp/></dynamics></direction-type><staff>1</staff></direction>
    ${quarter}
    <direction placement="above"><direction-type><metronome><beat-unit>quarter</beat-unit><per-minute>100</per-minute></metronome></direction-type></direction>
    ${quarter}
  </measure></part>
</score-partwise>`
    const read = readMusicXml(xml)
    expect(read.tempo).toBe(100)
    expect(read.notes.map((n) => n.marks)).toEqual([
      undefined,
      { tempo: 72, swing: 'eighths', text: 'con brio, ma', numeral: 'V7/ii' },
      undefined,
      { tempo: 100 },
    ])
    expect(read.leftOut).toEqual({ dynamics: 1 })
  })

  it('refuses what is no score', () => {
    expect(() => readMusicXml('<html><body/></html>')).toThrow(NotAScoreError)
    expect(() => readMusicXml('<score-partwise/>')).toThrow(NotAScoreError)
    expect(() => readMusicXml('MThd')).toThrow(XmlError)
  })

  it('reads a timewise score as its parts', () => {
    const timewise = `<score-timewise><part-list><score-part id="P1"><part-name>Flute</part-name></score-part></part-list>
      <measure number="1"><part id="P1"><attributes><divisions>1</divisions><time><beats>3</beats><beat-type>4</beat-type></time></attributes>
      <note>${pitch('A', 4)}<duration>3</duration><voice>1</voice></note></part></measure></score-timewise>`
    const score = readMusicXml(timewise)
    expect(score.meter).toBe('3/4')
    expect(score.parts).toEqual([{ name: 'Flute', staves: [0] }])
    expect(score.notes).toMatchObject([{ midi: 69, startTick: 0, durationTicks: 3 * B }])
  })
})
