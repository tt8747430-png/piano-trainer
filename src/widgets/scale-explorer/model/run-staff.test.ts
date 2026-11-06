import { describe, expect, it } from 'vitest'
import { DEFAULT_SCALE_STAFF } from '@/entities/settings'
import { note, noteParam } from '@/shared/lib/music'
import { runStaff, type RunStaffWords } from './run-staff'
import type { StaffMarks } from './scale-view'
import { scaleRunOf } from './scale-run'

const words: RunStaffWords = {
  whole: 'W',
  half: 'H',
  wholeAndHalf: 'W+H',
  tonic: 'Tonic',
  leading: 'Leading note',
  lower: 'Lower tetrachord',
  upper: 'Upper tetrachord',
  characteristic: 'Characteristic',
}
const view = {
  root: noteParam(note('C')),
  kind: 'major',
  start: 1,
  octaves: 1,
  rhythm: 'even',
  hands: 'rh',
  direction: 'up',
} as const

const marked = (
  marks: StaffMarks,
  layers = DEFAULT_SCALE_STAFF,
  kind: 'major' | 'harmonic' = 'major',
) => {
  const run = scaleRunOf({ ...view, kind })
  return runStaff(run.music, 'rh', run.placed, marks, layers, words).notes.map((each) => each.marks)
}

describe('runStaff', () => {
  it('sits the degree numbers under each note, and no step with them (R34)', () => {
    expect(marked('degrees').map((each) => each?.numeral)).toEqual([
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '1',
    ])
    expect(marked('degrees').some((each) => each?.step)).toBe(false)
  })

  it('names W W H W W W H between the notes of C major', () => {
    expect(marked('steps').map((each) => each?.step)).toEqual([
      'W',
      'W',
      'H',
      'W',
      'W',
      'W',
      'H',
      undefined,
    ])
  })

  it('names harmonic minor’s step and a half', () => {
    expect(marked('steps', DEFAULT_SCALE_STAFF, 'harmonic').map((each) => each?.step)[5]).toBe(
      'W+H',
    )
  })

  it('names the tonic, the leading note and the tetrachords where switched on', () => {
    const texts = marked('fingers', { tonic: true, tetrachords: true }).map((each) => each?.text)
    expect(texts[0]).toBe('Tonic · Lower tetrachord')
    expect(texts[4]).toBe('Upper tetrachord')
    expect(texts[6]).toBe('Leading note')
    expect(texts[7]).toBe('Tonic')
  })

  it('marks B as D Dorian’s characteristic note', () => {
    const run = scaleRunOf({ ...view, root: noteParam(note('D')), kind: 'dorian' })
    const off = { tonic: false, tetrachords: false }
    const notes = runStaff(run.music, 'rh', run.placed, 'fingers', off, words, '6').notes
    expect(
      notes.filter((each) => each.marks?.text === 'Characteristic').map((each) => each.spelled),
    ).toEqual([note('B')])
  })

  it('writes C minor’s E♭ A♭ B♭ over the notes compared with them', () => {
    const run = scaleRunOf(view)
    const off = { tonic: false, tetrachords: false }
    const compared = new Map([
      ['3', 'E♭'],
      ['6', 'A♭'],
      ['7', 'B♭'],
    ])
    const texts = runStaff(
      run.music,
      'rh',
      run.placed,
      'fingers',
      off,
      words,
      undefined,
      compared,
    ).notes.map((each) => each.marks?.text)
    expect(texts).toEqual([undefined, undefined, 'E♭', undefined, undefined, 'A♭', 'B♭', undefined])
  })

  it('leaves the music alone with the fingers its labels and every layer off', () => {
    const run = scaleRunOf(view)
    const off = { tonic: false, tetrachords: false }
    expect(runStaff(run.music, 'rh', run.placed, 'fingers', off, words)).toBe(run.music)
  })
})
