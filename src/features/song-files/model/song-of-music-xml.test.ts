import { describe, expect, it } from 'vitest'
import { NotAScoreError } from '@/shared/lib/musicxml'
import { songOfMusicXml, SongFileError, titleOf } from './song-of-music-xml'

const note = (step: string, octave: number, duration: number, extra = '') =>
  `<note><pitch><step>${step}</step><octave>${octave}</octave></pitch><duration>${duration}</duration>${extra}</note>`

/** A song for voice and piano as another app writes it: two quarters a division. */
const VOICE_AND_PIANO = `<score-partwise version="3.1">
  <movement-title>Morning song</movement-title>
  <part-list>
    <score-part id="P1"><part-name>Voice</part-name></score-part>
    <score-part id="P2"><part-name print-object="no">Piano</part-name></score-part>
  </part-list>
  <part id="P1">
    <measure number="1">
      <attributes><divisions>2</divisions><key><fifths>1</fifths></key><time><beats>3</beats><beat-type>4</beat-type></time></attributes>
      ${note('B', 4, 2, '<voice>1</voice><lyric><syllabic>single</syllabic><text>Sing</text></lyric>')}
      ${note('D', 5, 4, '<voice>1</voice><lyric><syllabic>single</syllabic><text>loud</text></lyric>')}
      <backup><duration>6</duration></backup>
      ${note('G', 4, 6, '<voice>2</voice>')}
    </measure>
    <measure number="2">
      <attributes><key><fifths>-1</fifths></key></attributes>
      ${note('C', 5, 6, '<voice>1</voice>')}
    </measure>
  </part>
  <part id="P2">
    <measure number="1">
      <attributes><divisions>2</divisions><staves>2</staves>
        <clef number="1"><sign>G</sign><line>2</line></clef><clef number="2"><sign>F</sign><line>4</line></clef></attributes>
      <harmony><root><root-step>G</root-step></root><kind>major</kind><offset>2</offset></harmony>
      ${note('G', 4, 6, '<voice>1</voice><staff>1</staff>')}
      <backup><duration>6</duration></backup>
      ${note('G', 2, 6, '<voice>5</voice><staff>2</staff>')}
    </measure>
    <measure number="2">
      <harmony><root><root-step>F</root-step></root><kind>major</kind></harmony>
      ${note('A', 4, 6, '<voice>1</voice><staff>1</staff>')}
      <backup><duration>6</duration></backup>
      ${note('F', 2, 6, '<voice>5</voice><staff>2</staff>')}
    </measure>
  </part>
</score-partwise>`

describe('songOfMusicXml', () => {
  it('reads another app’s song: a single staff over the piano, the words on it, a key change its section', () => {
    const { song, leftOut } = songOfMusicXml(VOICE_AND_PIANO, 'morning.musicxml')
    expect(song.title).toBe('Morning song')
    expect(song.music).toMatchObject({
      key: 'G',
      meter: '3/4',
      tempo: 90,
      pattern: 'r1',
      sections: [
        { kind: 'part', label: 'A', lines: ['G'] },
        { kind: 'part', label: 'B', key: 'F', lines: ['F'] },
      ],
      staves: [{ name: 'Voice', notes: 'B4/1 D5/2 | C5/3' }],
      lyrics: ['Sing loud'],
      hands: { rh: 'G4/3 | A4/3', lh: 'G2/3 | F2/3' },
    })
    // A single staff is one line: its second voice is left out.
    expect(leftOut).toEqual({ voices: 1 })
  })

  it('names a song from its file where the file names none', () => {
    expect(titleOf(undefined, 'Ode to joy.mxl')).toBe('Ode to joy')
    expect(titleOf('  ', 'x'.repeat(100))).toHaveLength(80)
  })

  it('refuses a file that is no score, or holds too much', () => {
    expect(() => songOfMusicXml('<svg/>', 'a.xml')).toThrow(NotAScoreError)
    const huge = VOICE_AND_PIANO.replace(
      '</measure>\n  </part>\n  <part id="P2">',
      `</measure>${`<measure>${note('C', 5, 6, '<voice>1</voice>')}</measure>`.repeat(20_001)}</part><part id="P2">`,
    )
    expect(() => songOfMusicXml(huge, 'a.xml')).toThrow(SongFileError)
  })
})
