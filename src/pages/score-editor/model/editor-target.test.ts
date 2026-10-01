import { describe, expect, it } from 'vitest'
import { musicOf, pieceById, type PiecesState } from '@/entities/piece'
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
    if (!amazing || amazing.kind === 'progression') throw new Error('a song')
    const target = editorTarget(NONE, 'amazing')
    expect(target).toMatchObject({
      kind: 'version',
      id: 'amazing',
      entry: amazing,
      hasVersion: false,
    })
    expect(target?.music).toEqual(musicOf(amazing))
    expect(target?.kind === 'version' && target.original).toEqual(musicOf(amazing))
  })

  it('edits the learner’s version where there is one', () => {
    const version = { ...SONG, key: 'G' as const, meter: '3/4' as const }
    const target = editorTarget({ ...NONE, versions: { amazing: version } }, 'amazing')
    expect(target?.music).toEqual(version)
    expect(target?.hasVersion).toBe(true)
  })

  it('starts a listing’s chart in its key and meter, which is its original', () => {
    const target = editorTarget(NONE, 'bz4')
    expect(target?.music).toMatchObject({
      key: 'Cm',
      meter: '3/4',
      sections: [{ kind: 'verse', lines: ['Cm Cm Cm Cm'] }],
    })
    expect(target?.kind === 'version' && target.original).toEqual(target?.music)
  })

  it('edits an own song, and nothing for a progression or what is not there', () => {
    expect(editorTarget({ ...NONE, songs: [SONG] }, 'my-1')).toMatchObject({
      kind: 'song',
      id: 'my-1',
    })
    expect(editorTarget(NONE, 'twofive')).toBeUndefined()
    expect(editorTarget(NONE, 'my-1')).toBeUndefined()
    expect(editorTarget(NONE, 'nothing')).toBeUndefined()
  })
})
