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
import { ONE_BAR, TWO_BARS } from './testing/performances'

const run = (state: PracticeState, ...events: PracticeEvent[]) =>
  events.reduce(practiceReducer, state)
const press = (...keys: number[]): PracticeEvent[] =>
  keys.map((key) => ({ type: 'noteOn', midi: midi(key) }))

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

    it('wraps around at both ends', () => {
      const state = initialPractice(ONE_BAR, 'listen', 'both')
      expect(run(state, { type: 'prev' }).beatGroup).toBe(3)
      expect(run(state, { type: 'prev' }, { type: 'next' }).beatGroup).toBe(0)
    })

    it('ignores keys', () => {
      const state = initialPractice(ONE_BAR, 'listen', 'both')
      expect(run(state, ...press(60))).toBe(state)
    })
  })

  describe('Step', () => {
    it('moves beat by beat, wrapping, and does not play', () => {
      const state = initialPractice(ONE_BAR, 'step', 'both')
      expect(run(state, { type: 'next' }, { type: 'next' }).beatGroup).toBe(2)
      expect(run(state, { type: 'play' }).playing).toBe(false)
      expect(run(state, ...Array(4).fill({ type: 'next' })).beatGroup).toBe(0)
    })

    it('moves bar by bar, wrapping', () => {
      const state = initialPractice(TWO_BARS, 'step', 'both')
      expect(run(state, { type: 'nextBar' }).beatGroup).toBe(4)
      expect(run(state, { type: 'nextBar' }, { type: 'nextBar' }).beatGroup).toBe(0)
    })

    it('jumps to a bar or a beat group', () => {
      const state = initialPractice(TWO_BARS, 'step', 'both')
      expect(run(state, { type: 'jumpToBar', bar: 1 }).beatGroup).toBe(4)
      expect(run(state, { type: 'jumpToBeatGroup', beatGroup: 6 }).beatGroup).toBe(6)
      expect(run(state, { type: 'jumpToBeatGroup', beatGroup: 99 }).beatGroup).toBe(0)
      expect(run(state, { type: 'jumpToBar', bar: 9 }).beatGroup).toBe(0)
    })
  })

  describe('Your turn', () => {
    it.each([
      ['rh', [0, 4, 7]],
      ['lh', [0]],
      ['both', [0, 4, 7]],
    ] as const)('expects what %s plays', (hands, expected) => {
      expect(initialPractice(ONE_BAR, 'turn', hands).expected).toEqual(expected)
    })

    it('counts a key in any octave, and is right once every note is in', () => {
      const state = initialPractice(ONE_BAR, 'turn', 'rh')
      const partway = run(state, ...press(64 + 12, 48))
      expect(partway).toMatchObject({ outcome: 'waiting', received: [4, 0] })
      expect(run(partway, ...press(67)).outcome).toBe('correct')
    })

    it('shows a wrong key and keeps waiting', () => {
      const wrong = run(initialPractice(ONE_BAR, 'turn', 'rh'), ...press(62))
      expect(wrong).toMatchObject({ outcome: 'wrong', wrong: 62, received: [], beatGroup: 0 })
      expect(run(wrong, ...press(60, 64, 67)).outcome).toBe('correct')
    })

    it('ignores keys once the beat group is done', () => {
      const done = run(initialPractice(ONE_BAR, 'turn', 'rh'), ...press(60, 64, 67))
      expect(run(done, ...press(61))).toBe(done)
    })

    it('expects nothing where the practised hand has nothing to play', () => {
      const state = run(initialPractice(ONE_BAR, 'turn', 'lh'), { type: 'next' })
      expect(state).toMatchObject({ beatGroup: 1, expected: [], outcome: 'waiting' })
    })

    it('finishes after the last beat group', () => {
      const last = run(initialPractice(ONE_BAR, 'turn', 'rh'), {
        type: 'jumpToBeatGroup',
        beatGroup: 3,
      })
      const finished = run(last, { type: 'next' })
      expect(finished).toMatchObject({ outcome: 'finished', beatGroup: 3, expected: [] })
      expect(run(finished, ...press(60))).toBe(finished)
    })

    it('stays at the start going back', () => {
      expect(run(initialPractice(ONE_BAR, 'turn', 'rh'), { type: 'prev' }).beatGroup).toBe(0)
    })

    it('starts over from the first beat group', () => {
      const moved = run(initialPractice(TWO_BARS, 'turn', 'rh'), { type: 'nextBar' }, ...press(61))
      expect(run(moved, { type: 'restart' })).toMatchObject({
        beatGroup: 0,
        expected: [0, 4, 7],
        received: [],
        outcome: 'waiting',
        wrong: null,
      })
    })
  })

  describe('configure', () => {
    it('keeps the beat group, clamped to the new performance', () => {
      const state = run(initialPractice(TWO_BARS, 'step', 'both'), {
        type: 'jumpToBeatGroup',
        beatGroup: 6,
      })
      const configured = run(state, {
        type: 'configure',
        performance: ONE_BAR,
        mode: 'step',
        hands: 'both',
      })
      expect(configured.beatGroup).toBe(3)
      expect(configured.performance).toBe(ONE_BAR)
    })

    it('stops playing when the mode changes, and not otherwise', () => {
      const playing = run(initialPractice(ONE_BAR, 'listen', 'both'), { type: 'play' })
      expect(
        run(playing, { type: 'configure', performance: TWO_BARS, mode: 'listen', hands: 'rh' })
          .playing,
      ).toBe(true)
      expect(
        run(playing, { type: 'configure', performance: ONE_BAR, mode: 'step', hands: 'both' })
          .playing,
      ).toBe(false)
    })

    it('recomputes what Your turn expects', () => {
      const state = initialPractice(ONE_BAR, 'turn', 'rh')
      const configured = run(state, {
        type: 'configure',
        performance: ONE_BAR,
        mode: 'turn',
        hands: 'lh',
      })
      expect(configured.expected).toEqual([0])
    })

    it('restarts Listen at the first beat group, stopped', () => {
      const state = run(
        initialPractice(ONE_BAR, 'listen', 'both'),
        { type: 'play' },
        { type: 'reach', beatGroup: 2 },
      )
      expect(run(state, { type: 'restart' })).toMatchObject({ beatGroup: 0, playing: false })
    })
  })
})

describe('the hands of Your turn', () => {
  it.each([
    ['both', { rh: true, lh: true, melody: false }, { rh: false, lh: false, melody: true }],
    ['rh', { rh: true, lh: false, melody: false }, { rh: false, lh: true, melody: true }],
    ['lh', { rh: false, lh: true, melody: false }, { rh: true, lh: false, melody: true }],
  ] as const)('%s: practised and accompanying', (hands, practised, accompanying) => {
    expect(practisedHands(hands)).toEqual(practised)
    expect(accompanyingHands(hands)).toEqual(accompanying)
  })
})
