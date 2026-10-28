import { describe, expect, it } from 'vitest'
import { note, noteName } from '@/shared/lib/music'
import { drawRound } from './draw'
import { choiceAnswer, isChoice } from './round-machine'
import { levelOf, ownTrainerView, runKeyOf, trainerOf } from './trainers'
import { CUSTOM, TRAINER_IDS, type TrainerView } from './trainer-view'
import { scripted } from './testing/asks'

const TEN: TrainerView = { rounds: 10 }

describe('every trainer', () => {
  it.each(TRAINER_IDS)('%s draws rounds at every level and Custom, each answerable', (id) => {
    const trainer = trainerOf(id)
    const levels = [...trainer.levels, ...(trainer.custom.length > 0 ? [CUSTOM] : [])]
    const random = scripted(0.05, 0.35, 0.65, 0.95, 0.5, 0.2, 0.8)
    const drills = trainer.drills.length > 0 ? trainer.drills : [undefined]
    for (const [level, drill] of (levels.length > 0 ? levels : ['']).flatMap((each) =>
      drills.map((way) => [each, way] as const),
    )) {
      const asks = trainer.asks(level, { ...TEN, drill }, ['chord:m7', 'scale:dorian'])
      let previous = null
      for (let index = 0; index < 12; index++) {
        const question = drawRound(asks, { index, random, previous })
        if (isChoice(question)) {
          const at = `${id} ${level} ${drill ?? ''}`
          expect(question.options, at).toContain(choiceAnswer(question))
          expect(new Set(question.options).size, at).toBe(question.options.length)
          expect(question.options.length, at).toBeGreaterThanOrEqual(2)
        }
        previous = question
      }
    }
  })
})

describe('Custom', () => {
  it('asks each chord the URL names on each root it names, in its inversions where asked', () => {
    const asks = trainerOf('chords').asks(
      CUSTOM,
      { ...TEN, drill: 'quiz', chords: 'maj.m7', roots: 'C.F#', inversions: true },
      [],
    )
    expect(asks).toMatchObject({ kind: 'chords', drill: 'quiz' })
    if (asks.kind !== 'chords') throw new Error('expected chords')
    expect(asks.chords).toHaveLength(2 * 3 + 2 * 4)
    expect(asks.chords[0]).toEqual({ root: note('C'), quality: 'maj', inversion: 0 })
    expect(asks.chords.map((chord) => noteName(chord.root))).toContain('F#')
  })

  it('asks major and minor triads on the naturals before the learner chooses, any voicing', () => {
    const asks = trainerOf('chords').asks(CUSTOM, TEN, [])
    if (asks.kind !== 'chords') throw new Error('expected chords')
    expect(asks.drill).toBe('flashcards')
    expect(new Set(asks.chords.map((chord) => chord.quality))).toEqual(new Set(['maj', 'min']))
    expect(asks.chords).toHaveLength(14)
    expect(asks.chords.every((chord) => chord.inversion === null)).toBe(true)
  })

  it('asks Custom’s intervals up from its roots, heard the ways it names', () => {
    const asks = trainerOf('intervals').asks(
      CUSTOM,
      { ...TEN, drill: 'ear', intervals: 'P5.m9', roots: 'Bb', ways: 'together' },
      [],
    )
    expect(asks).toEqual({
      kind: 'intervals',
      drill: 'ear',
      show: 'name',
      intervals: ['P5', 'm9'],
      ways: ['together'],
      roots: [note('B', -1)],
    })
  })

  it('asks its own when the URL names nothing it knows', () => {
    const asks = trainerOf('build-scale').asks(CUSTOM, { ...TEN, scales: 'bogus' }, [])
    expect(asks.kind === 'skills' && asks.skills).toEqual([
      'scale:major',
      'scale:natural',
      'scale:harmonic',
    ])
  })

  it('reads Reading notes’ range either way round, with its sharps and flats', () => {
    const asks = trainerOf('reading-notes').asks(
      CUSTOM,
      { ...TEN, from: 'D4', to: 'C4', accidentals: true },
      [],
    )
    expect(asks.kind === 'notes' && asks.notes.map((n) => n.key)).toEqual([60, 61, 61, 62])
  })

  it('ignores an end of Reading notes’ range off the piano', () => {
    const keys = (from: string, to: string) => {
      const asks = trainerOf('reading-notes').asks(CUSTOM, { ...TEN, from, to }, [])
      return asks.kind === 'notes' ? asks.notes.map((n) => n.key) : []
    }
    expect(keys('C-1', 'D4')).toEqual([60, 62])
    expect(keys('C4', 'C9')).toEqual([60, 62, 64, 65, 67, 69, 71, 72])
    expect(keys('A0', 'C8')).toHaveLength(52)
  })

  it('hears chords one note at a time and scales coming down when the URL says so', () => {
    expect(
      trainerOf('chords').asks(CUSTOM, { ...TEN, drill: 'ear', arpeggio: true }, []),
    ).toMatchObject({ arpeggio: true })
    expect(trainerOf('scales-by-ear').asks(CUSTOM, { ...TEN, descending: true }, [])).toMatchObject(
      { descending: true },
    )
  })
})

describe('levelOf and runKeyOf', () => {
  it('opens an unknown level, or Custom where there is none, at the first', () => {
    expect(levelOf(trainerOf('key-signatures'), { ...TEN, level: CUSTOM })).toBe('up-to-two')
    expect(levelOf(trainerOf('chord-role'), { ...TEN, level: 'minor' })).toBe('minor')
    expect(levelOf(trainerOf('gaps'), TEN)).toBe('')
  })

  it('writes a URL’s level as its trainer has it: none for its first or one it lacks', () => {
    const view = { ...TEN, level: 'sevenths' }
    expect(ownTrainerView(trainerOf('chords'), view)).toBe(view)
    expect(ownTrainerView(trainerOf('chords'), { ...TEN, level: 'c-main' })).toEqual(TEN)
    expect(ownTrainerView(trainerOf('chords'), { ...TEN, level: 'everything' })).toEqual(TEN)
    expect(ownTrainerView(trainerOf('intervals'), { ...TEN, level: CUSTOM })).toEqual({
      ...TEN,
      level: CUSTOM,
    })
    expect(ownTrainerView(trainerOf('gaps'), { ...TEN, level: CUSTOM })).toEqual(TEN)
    expect(ownTrainerView(trainerOf('gaps'), TEN)).toBe(TEN)
  })

  it('keeps each level’s record under the trainer, its drill and level, My gaps under one', () => {
    expect(runKeyOf(trainerOf('chords'), 'c-main', 'quiz')).toBe('chords:quiz:c-main')
    expect(runKeyOf(trainerOf('build-scale'), 'major')).toBe('build-scale:major')
    expect(runKeyOf(trainerOf('gaps'), '')).toBe('gaps:all')
  })
})
