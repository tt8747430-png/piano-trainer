import { describe, expect, it } from 'vitest'
import {
  isDegreePiece,
  musicOf,
  PIECES,
  pieceById,
  sameMusic,
  type PiecesState,
} from '@/entities/piece'
import { readDraft, writeDraft } from '@/features/score-editor'
import { editorTarget } from './editor-target'

const NONE: PiecesState = { versions: {}, songs: [], nextSong: 1 }
const SONG = {
  id: 'my-1' as const,
  title: 'Morning',
  key: 'G' as const,
  meter: '4/4' as const,
  tempo: 90,
  pattern: 'r1' as const,
  sections: [{ kind: 'verse' as const, lines: ['G C D G'] }],
}

describe('editorTarget', () => {
  it('edits a song’s version against its original, from the original when there is none yet', () => {
    const amazing = pieceById('amazing')
    if (!amazing || isDegreePiece(amazing)) throw new Error('a song')
    const target = editorTarget(NONE, 'amazing')
    expect(target).toMatchObject({
      kind: 'version',
      id: 'amazing',
      entry: amazing,
    })
    // The original as the editor writes it: every bar written out (ADR 0114).
    const original = writeDraft(readDraft(musicOf(amazing)))
    expect(target?.music).toEqual(original)
    expect(target?.kind === 'version' && target.original).toEqual(original)
  })

  it.each(PIECES.map((piece) => [piece.id]))(
    'opens %s, and knows it written back unchanged as its original, however the book writes it',
    (id) => {
      const target = editorTarget(NONE, id)
      if (target?.kind !== 'version') throw new Error(`${id} has a version to edit`)
      expect(sameMusic(writeDraft(readDraft(target.music)), target.original)).toBe(true)
    },
  )

  it('opens a song written in degrees as its chart in its key, its chords as the Player plays them', () => {
    const target = editorTarget(NONE, 'romashki')
    if (target?.kind !== 'version') throw new Error('romashki has a version to edit')
    expect(target.music).toMatchObject({ key: 'Dm', meter: '4/4' })
    expect(target.music.sections.map((section) => section.kind)).toEqual([
      'verse',
      'chorus',
      'chorus',
    ])
    expect(target.music.sections[0]?.lines[0]).toMatch(/^Dm7 /)
  })

  it('edits the learner’s version where there is one', () => {
    const version = { ...SONG, key: 'G' as const, meter: '3/4' as const }
    const target = editorTarget({ ...NONE, versions: { amazing: version } }, 'amazing')
    expect(target?.music).toEqual(version)
  })

  it('starts a listing’s chart in its key and meter, its bars of no chord, which is its original', () => {
    const target = editorTarget(NONE, 'bz4')
    expect(target?.music).toMatchObject({
      key: 'Cm',
      meter: '3/4',
      sections: [{ kind: 'verse', lines: ['_ _ _ _'] }],
    })
    expect(target?.kind === 'version' && target.original).toEqual(target?.music)
  })

  it('edits an own song, and nothing for what is not there', () => {
    expect(editorTarget({ ...NONE, songs: [SONG] }, 'my-1')).toMatchObject({
      kind: 'song',
      id: 'my-1',
    })
    expect(editorTarget(NONE, 'my-1')).toBeUndefined()
    expect(editorTarget(NONE, 'nothing')).toBeUndefined()
  })
})
