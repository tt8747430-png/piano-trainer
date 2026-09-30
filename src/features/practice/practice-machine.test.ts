import { describe, expect, it } from 'vitest'
import { midi } from '@/shared/lib/music'
import {
  accompanyingHands,
  initialPractice,
  practiceReducer,
  practisedHands,
  type PracticeEvent,
  type PracticeState,
} from './practice-machine'
import { ONE_BAR, TWO_BARS, TWO_BARS_IN_HALVES } from './testing/performances'

const run = (state: PracticeState, ...events: PracticeEvent[]) =>
  events.reduce(practiceReducer, state)
const press = (...keys: number[]): PracticeEvent[] =>
  keys.map((key) => ({ type: 'noteOn', midi: midi(key) }))
const waiting = (hands: 'rh' | 'lh' | 'both') =>
  run(initialPractice(ONE_BAR, 'wait', hands), { type: 'play' })

describe('the practice machine', () => {
  it('starts at the first beat group, stopped', () => {
    const state = initialPractice(ONE_BAR, 'listen', 'both')
    expect(state).toMatchObject({ beatGroup: 0, playing: false, outcome: 'waiting', wrong: null })
  })

  describe('Listen', () => {
    it('plays and stops', () => {
      const state = initialPractice(ONE_BAR, 'listen', 'both')
      expect(run(state, { type: 'play' }).playing).toBe(true)
      expect(run(state, { type: 'play' }, { type: 'stop' }).playing).toBe(false)
    })

    it('follows the music to the beat group it reached', () => {
      const state = run(initialPractice(ONE_BAR, 'listen', 'both'), { type: 'play' })
      expect(run(state, { type: 'reach', beatGroup: 2 }).beatGroup).toBe(2)
      expect(run(state, { type: 'reach', beatGroup: 0 })).toBe(state)
    })

    it('steps beat by beat, wrapping at both ends', () => {
      const state = initialPractice(ONE_BAR, 'listen', 'both')
      expect(run(state, { type: 'prev' }).beatGroup).toBe(3)
      expect(run(state, { type: 'next' }, { type: 'next' }).beatGroup).toBe(2)
      expect(run(state, ...Array(4).fill({ type: 'next' })).beatGroup).toBe(0)
    })

    it('jumps to a bar or a beat group', () => {
      const state = initialPractice(TWO_BARS, 'listen', 'both')
      expect(run(state, { type: 'jumpToBar', bar: 1 }).beatGroup).toBe(4)
      expect(run(state, { type: 'jumpToBeatGroup', beatGroup: 6 }).beatGroup).toBe(6)
      expect(run(state, { type: 'jumpToBeatGroup', beatGroup: 99 }).beatGroup).toBe(0)
      expect(run(state, { type: 'jumpToBar', bar: 9 }).beatGroup).toBe(0)
    })

    it('ignores keys', () => {
      const state = initialPractice(ONE_BAR, 'listen', 'both')
      expect(run(state, ...press(60))).toBe(state)
    })
  })

  describe('a loop', () => {
    const looped = initialPractice(TWO_BARS, 'listen', 'both', { first: 4, last: 7 })

    it('keeps the cursor inside it', () => {
      expect(looped.beatGroup).toBe(4)
      expect(run(looped, { type: 'jumpToBeatGroup', beatGroup: 1 }).beatGroup).toBe(4)
      expect(run(looped, { type: 'prev' }).beatGroup).toBe(7)
      expect(run(looped, ...Array(4).fill({ type: 'next' })).beatGroup).toBe(4)
    })

    it('follows the music only inside it', () => {
      const playing = run(looped, { type: 'play' })
      expect(run(playing, { type: 'reach', beatGroup: 2 })).toBe(playing)
      expect(run(playing, { type: 'reach', beatGroup: 5 }).beatGroup).toBe(5)
    })

    it('takes Wait mode round it instead of finishing', () => {
      const last = run(
        initialPractice(TWO_BARS, 'wait', 'rh', { first: 4, last: 7 }),
        { type: 'play' },
        { type: 'jumpToBeatGroup', beatGroup: 7 },
      )
      expect(run(last, { type: 'next' })).toMatchObject({
        beatGroup: 4,
        outcome: 'waiting',
        playing: true,
      })
    })
  })

  describe('Wait mode', () => {
    it.each([
      ['rh', [0, 4, 7]],
      ['lh', [0]],
      ['both', [0, 4, 7]],
    ] as const)('expects what %s plays', (hands, expected) => {
      expect(initialPractice(ONE_BAR, 'wait', hands).expected).toEqual(expected)
    })

    it('takes keys only while playing', () => {
      const stopped = initialPractice(ONE_BAR, 'wait', 'rh')
      expect(run(stopped, ...press(60, 64, 67))).toBe(stopped)
    })

    it('counts a key in any octave, and is right once every note is in', () => {
      const partway = run(waiting('rh'), ...press(64 + 12, 48))
      expect(partway).toMatchObject({ outcome: 'waiting', received: [4, 0] })
      expect(run(partway, ...press(67)).outcome).toBe('correct')
    })

    it('shows a wrong key and keeps waiting', () => {
      const wrong = run(waiting('rh'), ...press(62))
      expect(wrong).toMatchObject({ outcome: 'wrong', wrong: 62, received: [], beatGroup: 0 })
      expect(run(wrong, ...press(60, 64, 67)).outcome).toBe('correct')
    })

    it('never marks a key played once the beat group is done wrong', () => {
      const done = run(waiting('rh'), ...press(60, 64, 67))
      expect(run(done, ...press(61))).toMatchObject({ outcome: 'correct', wrong: null })
    })

    it('keeps a key played during the pause for the beat group it belongs to', () => {
      const ahead = run(waiting('rh'), ...press(60, 64, 67), ...press(64))
      expect(run(ahead, { type: 'advance' })).toMatchObject({
        beatGroup: 1,
        received: [4],
        outcome: 'waiting',
      })
    })

    it('is right at once when the keys played ahead complete the next beat group', () => {
      const ahead = run(waiting('rh'), ...press(60, 64, 67), ...press(60, 64, 67))
      expect(run(ahead, { type: 'advance' })).toMatchObject({ beatGroup: 1, outcome: 'correct' })
    })

    it('carries a key played through a rest to the beat group it belongs to', () => {
      const rest = run(waiting('lh'), ...press(48), { type: 'advance' })
      expect(rest.expected).toEqual([])
      const next = run(rest, ...press(43), { type: 'advance' })
      expect(next).toMatchObject({ beatGroup: 2, expected: [7], outcome: 'correct' })
    })

    it('forgets keys played ahead when the learner moves', () => {
      const ahead = run(waiting('rh'), ...press(60, 64, 67), ...press(64))
      expect(run(ahead, { type: 'next' })).toMatchObject({ beatGroup: 1, received: [] })
    })

    it('expects nothing where the practised hand has nothing to play', () => {
      const state = run(waiting('lh'), { type: 'next' })
      expect(state).toMatchObject({ beatGroup: 1, expected: [], outcome: 'waiting' })
    })

    it('finishes after the last beat group, stopped, and plays again from the start', () => {
      const last = run(waiting('rh'), { type: 'jumpToBeatGroup', beatGroup: 3 })
      const finished = run(last, { type: 'next' })
      expect(finished).toMatchObject({
        outcome: 'finished',
        beatGroup: 3,
        playing: false,
        expected: [],
      })
      expect(run(finished, ...press(60))).toBe(finished)
      expect(run(finished, { type: 'play' })).toMatchObject({
        beatGroup: 0,
        playing: true,
        outcome: 'waiting',
      })
    })

    it('stays at the start going back', () => {
      expect(run(waiting('rh'), { type: 'prev' }).beatGroup).toBe(0)
    })
  })

  describe('configure', () => {
    const configure = (
      performance: PracticeState['performance'],
      mode: PracticeState['mode'],
      hands: PracticeState['hands'],
      loop: PracticeState['loop'] = null,
    ): PracticeEvent => ({ type: 'configure', performance, mode, hands, loop })

    it('keeps the beat group, clamped to the new performance', () => {
      const state = run(initialPractice(TWO_BARS, 'listen', 'both'), {
        type: 'jumpToBeatGroup',
        beatGroup: 6,
      })
      const configured = run(state, configure(ONE_BAR, 'listen', 'both'))
      expect(configured.beatGroup).toBe(3)
      expect(configured.performance).toBe(ONE_BAR)
    })

    it('keeps its moment in the music when a new arrangement cuts the bars differently', () => {
      // Bar 2, beat 2 in beats: in halves, bar 2's first half holds it.
      const state = run(initialPractice(TWO_BARS, 'listen', 'both'), {
        type: 'jumpToBeatGroup',
        beatGroup: 5,
      })
      const configured = run(state, configure(TWO_BARS_IN_HALVES, 'listen', 'both'))
      expect(TWO_BARS_IN_HALVES.beatGroups[configured.beatGroup]?.tick).toBe(48)
    })

    it('stops playing when the mode changes, and not otherwise', () => {
      const playing = run(initialPractice(ONE_BAR, 'listen', 'both'), { type: 'play' })
      expect(run(playing, configure(TWO_BARS, 'listen', 'rh')).playing).toBe(true)
      expect(run(playing, configure(ONE_BAR, 'wait', 'both')).playing).toBe(false)
    })

    it('recomputes what Wait mode expects', () => {
      const configured = run(
        initialPractice(ONE_BAR, 'wait', 'rh'),
        configure(ONE_BAR, 'wait', 'lh'),
      )
      expect(configured.expected).toEqual([0])
    })

    it('moves the cursor into a new loop', () => {
      const state = initialPractice(TWO_BARS, 'listen', 'both')
      expect(
        run(state, configure(TWO_BARS, 'listen', 'both', { first: 4, last: 7 })).beatGroup,
      ).toBe(4)
    })

    it('moves a cursor past a new loop to the loop’s start', () => {
      const past = run(initialPractice(TWO_BARS, 'listen', 'both'), {
        type: 'jumpToBeatGroup',
        beatGroup: 6,
      })
      expect(
        run(past, configure(TWO_BARS, 'listen', 'both', { first: 0, last: 3 })).beatGroup,
      ).toBe(0)
    })
  })
})

describe('the hands of Wait mode', () => {
  it.each([
    ['both', { rh: true, lh: true, melody: false }, { rh: false, lh: false, melody: true }],
    ['rh', { rh: true, lh: false, melody: false }, { rh: false, lh: true, melody: true }],
    ['lh', { rh: false, lh: true, melody: false }, { rh: true, lh: false, melody: true }],
  ] as const)('%s: practised and accompanying', (hands, practised, accompanying) => {
    expect(practisedHands(hands)).toEqual(practised)
    expect(accompanyingHands(hands)).toEqual(accompanying)
  })
})
