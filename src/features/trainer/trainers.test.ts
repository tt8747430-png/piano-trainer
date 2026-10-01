import { describe, expect, it } from 'vitest'
import { drawRound } from './draw'
import { choiceAnswer, isChoice } from './round-machine'
import { levelOf, runKeyOf, trainerOf } from './trainers'
import { CUSTOM, TRAINER_IDS, type TrainerView } from './trainer-view'
import { scripted } from './testing/asks'

const TEN: TrainerView = { rounds: 10 }

describe('every trainer', () => {
  it.each(TRAINER_IDS)('%s draws rounds at every level and Custom, each answerable', (id) => {
    const trainer = trainerOf(id)
    const levels = [...trainer.levels, ...(trainer.custom.length > 0 ? [CUSTOM] : [])]
    const random = scripted(0.05, 0.35, 0.65, 0.95, 0.5, 0.2, 0.8)
    for (const level of levels.length > 0 ? levels : ['']) {
      const asks = trainer.asks(level, TEN, ['chord:m7', 'scale:dorian'])
      let previous = null
      for (let index = 0; index < 12; index++) {
        const question = drawRound(asks, { index, random, previous })
        if (isChoice(question)) {
          expect(question.options, `${id} ${level}`).toContain(choiceAnswer(question))
          expect(new Set(question.options).size, `${id} ${level}`).toBe(question.options.length)
          expect(question.options.length, `${id} ${level}`).toBeGreaterThanOrEqual(2)
        }
        previous = question
      }
    }
  })
})

describe('Custom', () => {
  it('asks the chord families a chord trainer’s URL names', () => {
    const asks = trainerOf('build-chord').asks(CUSTOM, { ...TEN, families: 'six' }, [])
    expect(asks).toMatchObject({ kind: 'skills', chords: 'build-chord' })
    expect(asks.kind === 'skills' && asks.skills).toEqual([
      'chord:six',
      'chord:m6',
      'chord:s69',
      'chord:m69',
      'chord:add9',
    ])
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

  it('hears chords one note at a time and scales coming down when the URL says so', () => {
    expect(trainerOf('chords-by-ear').asks(CUSTOM, { ...TEN, arpeggio: true }, [])).toMatchObject({
      arpeggio: true,
    })
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

  it('keeps each level’s record under the trainer and level, My gaps under one', () => {
    expect(runKeyOf(trainerOf('name-chord'), 'c-main')).toBe('name-chord:c-main')
    expect(runKeyOf(trainerOf('gaps'), '')).toBe('gaps:all')
  })
})
