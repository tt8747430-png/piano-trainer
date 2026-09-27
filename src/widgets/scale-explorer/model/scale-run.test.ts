import { describe, expect, it } from 'vitest'
import { note, noteParam } from '@/shared/lib/music'
import { scaleRunOf } from './scale-run'

const C = noteParam(note('C'))
const view = { root: C, kind: 'major', start: 1, rhythm: 'even', hands: 'rh' } as const

describe('scaleRunOf', () => {
  it('fingers a taught scale from its tonic as taught', () => {
    const run = scaleRunOf(view)
    expect(run.own).toBe('scale')
    expect(run.fingers.rh.join('')).toBe('12312345')
    expect(run.fingerings).toEqual(['thumb', 'scale'])
  })

  it('starts on any note, fingered from the thumb there unless the scale’s fingering is chosen', () => {
    const fromE = scaleRunOf({ ...view, start: 3 })
    expect(fromE.fingering).toBe('thumb')
    expect(fromE.placed[0]?.midi).toBe(64)
    expect(fromE.music.notes[0]?.midi).toBe(64)
    expect(scaleRunOf({ ...view, start: 3, fingering: 'scale' }).fingers.rh.join('')).toBe(
      '31234123',
    )
  })

  it('writes the run in its scale’s key, a mode in its parent’s', () => {
    expect(scaleRunOf({ ...view, root: noteParam(note('D')), kind: 'dorian' }).music.key).toEqual({
      tonic: note('C'),
      minor: false,
    })
  })
})
