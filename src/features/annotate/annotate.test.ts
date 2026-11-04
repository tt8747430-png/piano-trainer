// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { createPiecesStore } from '@/entities/piece'
import { createMemoryStorage } from '@/shared/lib'
import { clearAnnotations, setAnnotation } from './annotate'

const store = () =>
  createPiecesStore({ storage: createMemoryStorage(), otherTabs: new EventTarget() })

describe('annotating a song (R29 B8)', () => {
  it('sets a mark, replacing one of its kind at its place', () => {
    const pieces = store()
    setAnnotation(pieces, 'bz1', { at: 0, staff: 'treble', kind: 'fingering', value: 1 })
    setAnnotation(pieces, 'bz1', { at: 0, staff: 'treble', kind: 'fingering', value: 4 })
    setAnnotation(pieces, 'bz1', { at: 0, staff: 'treble', kind: 'pause' })
    expect(pieces.getState().annotations.bz1).toEqual([
      { at: 0, staff: 'treble', kind: 'fingering', value: 4 },
      { at: 0, staff: 'treble', kind: 'pause' },
    ])
  })

  it('clears every mark at a place, and the song’s list once empty', () => {
    const pieces = store()
    setAnnotation(pieces, 'bz1', { at: 0, staff: 'treble', kind: 'pause' })
    setAnnotation(pieces, 'bz1', { at: 24, staff: 'treble', kind: 'breath' })
    clearAnnotations(pieces, 'bz1', 0, 'treble')
    expect(pieces.getState().annotations.bz1).toEqual([{ at: 24, staff: 'treble', kind: 'breath' }])
    clearAnnotations(pieces, 'bz1', 24, 'treble')
    expect(pieces.getState().annotations).toEqual({})
  })
})
