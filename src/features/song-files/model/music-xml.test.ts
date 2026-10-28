import { describe, expect, it } from 'vitest'
import {
  isDegreePiece,
  musicOf,
  PIECES,
  readSharedSong,
  versionableEntry,
  type ChartPiece,
  type PieceMusic,
} from '@/entities/piece'
import { readDraft, writeDraft } from '@/features/score-editor'
import { musicXmlOf, type SongFileNames } from './music-xml-of'
import { songOfMusicXml } from './song-of-music-xml'

const NAMES: SongFileNames = { title: 'Song', headings: [], staffNames: [], piano: 'Piano' }

/** Music as the editor writes it and a save reads it. */
const written = (music: PieceMusic) =>
  readSharedSong({ ...writeDraft(readDraft(music)), title: 'Song' })?.music

const chartOf = (id: string) => versionableEntry(id) as ChartPiece

/** A song with every mark, barline, change and staff a song's music holds. */
const RICH: PieceMusic = {
  key: 'F',
  meter: '4/4',
  timeSymbol: true,
  tempo: 72,
  tempoUnit: '8',
  pattern: 'r2',
  sections: [
    { kind: 'verse', n: 2, lines: ['|: F C7 [1 F :|', '[2 F Bb:t1 ||'] },
    {
      kind: 'chorus',
      last: true,
      detail: { en: 'and ending', ru: 'и окончание' },
      key: 'D',
      meter: '3/4',
      lines: ['Segno D A7-Em@1 ToCoda', 'D DS.Coda', 'Coda D |.'],
    },
  ],
  staves: [
    { name: 'Flute', notes: 'C5/2 D5/2 E5/1 F5/1 G5/2' },
    { name: 'Cello', clef: 'bass', notes: 'F2/4 C3/4' },
  ],
  lyrics: ['Hal- le- lu-_ jah', 'Sing ~ out'],
  hands: {
    rh: [
      'F4^1/1[pp,(] G4/1 A4/1[)] C5/1[stacc,acc]',
      'C5+E5/2[arp,cresc] G5/1:3 A5/1:3 Bb5/1:3 C6/1[/hairpin,8va]',
      'F5/4[ferm,f,tr]',
      'F5/2[gr:G5,mord] E5/1[dolce] D5/1[ped]',
      'C5/4[pedup,ff]',
      'D5/3[mf,lmord]',
      'C#5/2[turn,ten] E5/1[marc]',
      'D5/1.5[staccatiss,pedch] E5/.5 F#5/1',
      'D5/3[trem,rit]',
    ].join(' | '),
    lh: [
      'F2/4 A3+C4/1@2 A3+C4/1 A3+C4/1',
      'clef:treble C4/4',
      'clef:bass C3/2.5 r/1.5',
      'Bb2/4[8vb]',
      'F2/4',
      'D3/3',
      'A2/3',
      'D3/1 A2/1 D3/1',
      'D2/3',
    ].join(' | '),
  },
}

describe('a song’s MusicXML, exported then imported', () => {
  it('keeps every mark, barline, change, staff and word a song holds', () => {
    const xml = musicXmlOf(RICH, { ...NAMES, staffNames: ['Flute', 'Cello'] })
    const back = songOfMusicXml(xml, 'x.musicxml')
    expect(back.leftOut).toEqual({})
    expect(back.song.music).toEqual(written(RICH))
  })

  it('keeps a lead sheet’s piano, not printed', () => {
    const lead: PieceMusic = { ...RICH, leadSheet: true }
    const xml = musicXmlOf(lead, { ...NAMES, staffNames: ['Flute', 'Cello'] })
    expect(xml).toContain('<staff-details number="1" print-object="no"/>')
    expect(songOfMusicXml(xml, 'x').song.music).toEqual(written(lead))
  })

  it('keeps a pickup', () => {
    const pickup: PieceMusic = {
      key: 'G',
      meter: '3/4',
      tempo: 90,
      pattern: 'r1',
      sections: [{ kind: 'verse', lines: ['D@1 G D'] }],
      hands: { rh: 'D4/1 | G4/3 | F#4/2 A4/1', lh: 'r/1 | G2/3 | D3/3' },
    }
    const xml = musicXmlOf(pickup, NAMES)
    expect(xml).toContain('<measure number="0" implicit="yes">')
    expect(songOfMusicXml(xml, 'x').song.music).toEqual(written(pickup))
  })

  it('gives the same song for every piece in the catalog', () => {
    const differ: string[] = []
    for (const piece of PIECES) {
      const music = musicOf(isDegreePiece(piece) ? chartOf(piece.id) : piece)
      const back = songOfMusicXml(musicXmlOf(music, NAMES), 'x.musicxml').song.music
      try {
        expect(back).toEqual(written(music))
      } catch {
        differ.push(piece.id)
      }
    }
    expect(differ).toEqual([])
    // Every piece read, written, exported and read back: long on a busy machine.
  }, 120_000)
})
