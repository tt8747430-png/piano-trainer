import { describe, expect, it } from 'vitest'
import { midi, note, noteParam } from '@/shared/lib/music'
import { runShown, scaleRunOf } from './scale-run'

const C = noteParam(note('C'))
const view = { root: C, kind: 'major', start: 1, rhythm: 'even', hands: 'rh' } as const

describe('scaleRunOf', () => {
  it('holds the run coming down, melodic minor’s natural 6th and 7th to mark', () => {
    const run = scaleRunOf({ ...view, root: noteParam(note('A')), kind: 'melodic' })
    const pcs = (tones: readonly { midi: number }[]) => tones.map((tone) => tone.midi % 12)
    expect(pcs(run.placed)).toContain(6)
    expect(pcs(run.down.placed)).toEqual(expect.arrayContaining([5, 7]))
  })

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

  it('brings melodic minor back down as natural minor, each note with its finger there', () => {
    const run = scaleRunOf({ ...view, root: noteParam(note('A')), kind: 'melodic' })
    expect(run.music.notes.map((n) => n.midi)).toEqual([
      69, 71, 72, 74, 76, 78, 80, 81, 79, 77, 76, 74, 72, 71, 69,
    ])
    expect(run.music.notes.map((n) => n.finger).join('')).toBe('123123454321321')
  })

  it('writes the run in its scale’s key, a mode in its parent’s', () => {
    expect(scaleRunOf({ ...view, root: noteParam(note('D')), kind: 'dorian' }).music.key).toEqual({
      tonic: note('C'),
      minor: false,
    })
  })
})

describe('runShown', () => {
  it('marks the playing hand’s keys with their degrees and that hand’s fingers', () => {
    for (const hands of ['rh', 'lh', 'both'] as const) {
      const run = scaleRunOf({ ...view, hands })
      const shown = runShown(run, hands)
      const played = new Set(run.music.notes.map((n) => n.midi))
      expect(new Set(shown.keys)).toEqual(played)
      expect([...shown.marks.keys()].every((key) => played.has(key))).toBe(true)
    }
    const lh = runShown(scaleRunOf({ ...view, hands: 'lh' }), 'lh')
    expect(lh.marks.get(midi(48))?.finger).toBe(5)
    expect(lh.marks.get(midi(60))?.finger).toBe(1)
    const rh = runShown(scaleRunOf(view), 'rh')
    expect(rh.marks.get(midi(60))?.finger).toBe(1)
  })
})
