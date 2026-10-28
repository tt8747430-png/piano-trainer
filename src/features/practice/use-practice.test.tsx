import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { arrange, parseFigure, type Performance } from '@/shared/lib/arrangement'
import { createFakeAudio, type FakeAudio } from '@/shared/api/audio'
import { createFakeMidi, type FakeMidi } from '@/shared/api/midi'
import { midi, note, parseChordSymbol, TICKS_PER_BEAT } from '@/shared/lib/music'
import type { NoteSound, Sound } from '@/shared/lib/schedule'
import { ServicesProvider } from '@/shared/lib/services'
import { FULL_MIX } from './mix'
import { ONE_BAR, TWO_BARS } from './testing/performances'
import { usePractice, type PracticeSetup } from './use-practice'

const B = TICKS_PER_BEAT

const LISTEN: PracticeSetup = {
  mode: 'listen',
  hands: 'both',
  tempo: 60,
  ownTempo: 60,
  speedTraining: false,
  swing: 'straight',
  loop: null,
  metronome: false,
  countIn: false,
  recording: null,
  mix: FULL_MIX,
}

let audio: FakeAudio
let keyboard: FakeMidi

function renderPractice(performance: Performance, setup: Partial<PracticeSetup> = {}) {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <ServicesProvider services={{ audio, midi: keyboard }}>{children}</ServicesProvider>
  )
  return renderHook(
    (props: { performance: Performance; setup: PracticeSetup }) =>
      usePractice(props.performance, props.setup),
    { wrapper, initialProps: { performance, setup: { ...LISTEN, ...setup } } },
  )
}

/** Moves the audio clock and lets the transport's timer see it. */
const clockTo = (seconds: number) =>
  act(() => {
    audio.setNow(seconds)
    vi.advanceTimersByTime(25)
  })
const wait = (ms: number) => act(() => vi.advanceTimersByTime(ms))

const notesOf = (sounds: readonly Sound[]) =>
  sounds.filter((sound): sound is NoteSound => sound.kind === 'note')
const keysOf = (sounds: readonly Sound[]) => notesOf(sounds).map((sound) => sound.midi)
/** The parts a play's notes are of, each once. */
const partsOf = (sounds: readonly Sound[] = []) =>
  [...new Set(notesOf(sounds).map((sound) => sound.part))].sort()
const VOCAL = { src: 'vocal.m4a', start: 2, tempo: 60 }

beforeEach(() => {
  vi.useFakeTimers()
  audio = createFakeAudio()
  keyboard = createFakeMidi()
})
afterEach(() => vi.useRealTimers())

describe('usePractice: Listen', () => {
  it('plays a pass of the piece', () => {
    const { result } = renderPractice(ONE_BAR)
    act(() => result.current.play())
    expect(result.current.state.playing).toBe(true)
    expect(audio.played).toHaveLength(1)
    expect(audio.played[0]?.at).toBeCloseTo(0.1)
    expect(notesOf(audio.played[0]?.sounds ?? [])).toHaveLength(ONE_BAR.notes.length)
  })

  it('follows the music', () => {
    const { result } = renderPractice(ONE_BAR)
    act(() => result.current.play())
    clockTo(0.1 + 2)
    expect(result.current.state.beatGroup).toBe(2)
  })

  it('says where its music is between the beat groups while it plays: the playhead’s clock (ADR 0096)', () => {
    const { result } = renderPractice(ONE_BAR)
    expect(result.current.clock).toBeNull()
    act(() => result.current.play())
    clockTo(0.1 + 0.5)
    expect(result.current.clock?.()).toBe(0.5 * B)
    act(() => audio.setNow(0.1 + 2.75))
    expect(result.current.clock?.()).toBe(2.75 * B)
    act(() => result.current.stop())
    expect(result.current.clock).toBeNull()
  })

  it('loops, queueing the next pass half a second before the end', () => {
    const { result } = renderPractice(ONE_BAR)
    act(() => result.current.play())
    clockTo(0.1 + 3.4)
    expect(audio.played).toHaveLength(1)
    clockTo(0.1 + 3.5)
    expect(audio.played).toHaveLength(2)
    expect(audio.played[1]?.at).toBeCloseTo(4.1)
    clockTo(4.1 + 1)
    expect(result.current.state.beatGroup).toBe(1)
  })

  it('counts in with a bar of clicks, and clicks every beat with the metronome', () => {
    const counted = renderPractice(ONE_BAR, { countIn: true })
    act(() => counted.result.current.play())
    expect(audio.played[0]?.sounds.slice(0, 4).map((sound) => sound.kind)).toEqual([
      'click',
      'click',
      'click',
      'click',
    ])
    counted.unmount()
    audio = createFakeAudio()
    const clicked = renderPractice(ONE_BAR, { metronome: true })
    act(() => clicked.result.current.play())
    expect(audio.played[0]?.sounds.filter((sound) => sound.kind === 'click')).toHaveLength(4)
  })

  it('counts in when Play starts, never when a move starts the pass again', () => {
    const { result } = renderPractice(TWO_BARS, { countIn: true })
    act(() => result.current.play())
    act(() => result.current.jumpToBeatGroup(4))
    expect(audio.played).toHaveLength(2)
    expect(audio.played[1]?.sounds.some((sound) => sound.kind === 'click')).toBe(false)
  })

  it('plays on when the count-in is switched while it plays', () => {
    const { result, rerender } = renderPractice(ONE_BAR)
    act(() => result.current.play())
    rerender({ performance: ONE_BAR, setup: { ...LISTEN, countIn: true } })
    expect(audio.played).toHaveLength(1)
  })

  it('stops the sound and stops following', () => {
    const { result } = renderPractice(ONE_BAR)
    act(() => result.current.play())
    act(() => result.current.stop())
    expect(audio.stops).toBe(1)
    expect(result.current.state.playing).toBe(false)
    clockTo(0.1 + 2)
    expect(result.current.state.beatGroup).toBe(0)
  })

  it('starts a new pass from where the learner jumps while playing', () => {
    const { result } = renderPractice(TWO_BARS)
    act(() => result.current.play())
    act(() => result.current.jumpToBeatGroup(4))
    expect(result.current.state.beatGroup).toBe(4)
    expect(audio.played).toHaveLength(2)
    const second = notesOf(audio.played[1]?.sounds ?? [])
    expect(second[0]?.at).toBe(0)
    expect(new Set(second.map((sound) => sound.midi % 12))).toEqual(new Set([7, 11, 2]))
  })

  it('starts over from the current beat group when the tempo changes while playing', () => {
    const { result, rerender } = renderPractice(ONE_BAR)
    act(() => result.current.play())
    clockTo(0.1 + 2)
    rerender({ performance: ONE_BAR, setup: { ...LISTEN, tempo: 120 } })
    expect(audio.played).toHaveLength(2)
    expect(notesOf(audio.played[1]?.sounds ?? [])).toHaveLength(
      ONE_BAR.notes.filter((n) => n.startTick >= 2 * B).length,
    )
  })

  it('sounds the beat group moved to while stopped', () => {
    const { result } = renderPractice(ONE_BAR)
    act(() => result.current.next())
    expect(result.current.state.beatGroup).toBe(1)
    expect(keysOf(audio.played[0]?.sounds ?? [])).toEqual([60, 64, 67])
  })
})

describe('usePractice: the count-in', () => {
  it('counts its bar down as it sounds, for the screen to show, then none once the music plays', () => {
    const { result } = renderPractice(ONE_BAR, { countIn: true })
    expect(result.current.counting).toBeNull()
    act(() => result.current.play())
    const counted: (number | null)[] = []
    for (const now of [0.1, 1.1, 2.1, 3.1, 4.1]) {
      clockTo(now)
      counted.push(result.current.counting)
    }
    expect(counted).toEqual([4, 3, 2, 1, null])
  })

  it('counts nothing once stopped, nor without a count-in', () => {
    const counted = renderPractice(ONE_BAR, { countIn: true })
    act(() => counted.result.current.play())
    clockTo(0.1)
    act(() => counted.result.current.stop())
    expect(counted.result.current.counting).toBeNull()
    counted.unmount()
    const plain = renderPractice(ONE_BAR)
    act(() => plain.result.current.play())
    clockTo(0.1)
    expect(plain.result.current.counting).toBeNull()
  })

  it('counts its bar in unheard with the click turned right down (ADR 0105)', () => {
    const { result } = renderPractice(ONE_BAR, {
      countIn: true,
      metronome: true,
      mix: { ...FULL_MIX, click: 0 },
    })
    act(() => result.current.play())
    expect(audio.played[0]?.sounds.some((sound) => sound.kind === 'click')).toBe(false)
    clockTo(1.1)
    expect(result.current.counting).toBe(3)
  })
})

describe('usePractice: the mix (ADR 0105)', () => {
  it('plays each part as loud as the mix says, a change heard without starting again', () => {
    const { result, rerender } = renderPractice(ONE_BAR, { mix: { ...FULL_MIX, rh: 0.25 } })
    act(() => result.current.play())
    const pass = audio.played[0]
    const rh = notesOf(pass?.sounds ?? []).find((sound) => sound.part === 'rh')
    expect(rh && pass?.gain?.(rh)).toBe(0.25)
    rerender({ performance: ONE_BAR, setup: { ...LISTEN, mix: { ...FULL_MIX, rh: 0.64 } } })
    expect(audio.played).toHaveLength(1)
    expect(audio.stops).toBe(0)
    expect(rh && pass?.gain?.(rh)).toBe(0.64)
  })

  it('plays no part turned right down, and brings one turned up again in from where it plays', () => {
    const { result, rerender } = renderPractice(ONE_BAR, { mix: { ...FULL_MIX, lh: 0 } })
    act(() => result.current.play())
    expect(partsOf(audio.played[0]?.sounds)).toEqual(['rh'])
    clockTo(0.1 + 2)
    rerender({ performance: ONE_BAR, setup: { ...LISTEN, mix: { ...FULL_MIX, lh: 0.5 } } })
    expect(audio.played).toHaveLength(2)
    expect(partsOf(audio.played[1]?.sounds)).toEqual(['lh', 'rh'])
  })

  it('clicks as loud as the click’s volume, and not at all turned right down', () => {
    const clicked = renderPractice(ONE_BAR, { metronome: true, mix: { ...FULL_MIX, click: 0.36 } })
    act(() => clicked.result.current.play())
    const click = audio.played[0]?.sounds.find((sound) => sound.kind === 'click')
    expect(click && audio.played[0]?.gain?.(click)).toBe(0.36)
    clicked.unmount()
    audio = createFakeAudio()
    const silent = renderPractice(ONE_BAR, { metronome: true, mix: { ...FULL_MIX, click: 0 } })
    act(() => silent.result.current.play())
    expect(audio.played[0]?.sounds.some((sound) => sound.kind === 'click')).toBe(false)
  })

  it('plays the recording at its volume, and none turned right down', () => {
    const heard = renderPractice(ONE_BAR, {
      recording: VOCAL,
      mix: { ...FULL_MIX, recording: 0.49 },
    })
    act(() => heard.result.current.play())
    expect(audio.recordings[0]?.volume?.()).toBe(0.49)
    heard.unmount()
    audio = createFakeAudio()
    const silent = renderPractice(ONE_BAR, { recording: VOCAL, mix: { ...FULL_MIX, recording: 0 } })
    act(() => silent.result.current.play())
    expect(audio.recordings).toEqual([])
  })

  it('sounds a beat group moved to as loud as the mix says', () => {
    const { result } = renderPractice(ONE_BAR, { mix: { ...FULL_MIX, lh: 0.16 } })
    // Beat 3: the right hand's G and the left hand's octave.
    act(() => result.current.jumpToBeatGroup(2))
    const moved = audio.played[0]
    const lh = notesOf(moved?.sounds ?? []).find((sound) => sound.part === 'lh')
    expect(partsOf(moved?.sounds)).toEqual(['lh', 'rh'])
    expect(lh && moved?.gain?.(lh)).toBe(0.16)
  })

  it('accompanies Wait mode as loud as the mix says', () => {
    const { result } = renderPractice(ONE_BAR, {
      mode: 'wait',
      hands: 'rh',
      mix: { ...FULL_MIX, lh: 0.16 },
    })
    act(() => result.current.play())
    act(() => {
      keyboard.press(midi(60))
      keyboard.press(midi(64))
      keyboard.press(midi(67))
    })
    const accompanied = audio.played[0]
    const lh = notesOf(accompanied?.sounds ?? []).find((sound) => sound.part === 'lh')
    expect(partsOf(accompanied?.sounds)).toEqual(['lh'])
    expect(lh && accompanied?.gain?.(lh)).toBe(0.16)
  })

  it('leaves a hand turned right down out of Wait mode’s accompaniment', () => {
    const { result } = renderPractice(ONE_BAR, {
      mode: 'wait',
      hands: 'rh',
      mix: { ...FULL_MIX, lh: 0 },
    })
    act(() => result.current.play())
    act(() => {
      keyboard.press(midi(60))
      keyboard.press(midi(64))
      keyboard.press(midi(67))
    })
    expect(result.current.state.outcome).toBe('correct')
    expect(audio.played.flatMap((play) => keysOf(play.sounds))).toEqual([])
  })
})

describe('usePractice: moving', () => {
  it('sounds every beat group moved to, in the audible hands', () => {
    const { result } = renderPractice(TWO_BARS, { hands: 'lh' })
    act(() => result.current.jumpToBeatGroup(4))
    act(() => result.current.jumpToBeatGroup(0))
    expect(audio.played.map((play) => keysOf(play.sounds))).toEqual([
      [31, 43],
      [36, 48],
    ])
  })
})

describe('usePractice: Wait mode', () => {
  it('has no clock: the playhead stands at the notes awaited', () => {
    const { result } = renderPractice(ONE_BAR, { mode: 'wait', hands: 'rh' })
    act(() => result.current.play())
    expect(result.current.clock).toBeNull()
  })

  it('waits for the practised hand, then plays the other and moves on', () => {
    const { result } = renderPractice(ONE_BAR, { mode: 'wait', hands: 'rh' })
    expect(result.current.state.expected).toEqual([0, 4, 7])
    act(() => result.current.play())
    act(() => result.current.press(midi(60)))
    act(() => keyboard.press(midi(76)))
    expect(audio.played).toHaveLength(0)
    act(() => keyboard.press(midi(55)))
    expect(result.current.state.outcome).toBe('correct')
    expect(keysOf(audio.played[0]?.sounds ?? [])).toEqual([36, 48])
    wait(149)
    expect(result.current.state.beatGroup).toBe(0)
    wait(1)
    expect(result.current.state.beatGroup).toBe(1)
  })

  it('plays through a beat group the practised hand has nothing in', () => {
    const { result } = renderPractice(ONE_BAR, { mode: 'wait', hands: 'lh' })
    act(() => result.current.play())
    act(() => result.current.press(midi(48)))
    wait(150)
    expect(result.current.state).toMatchObject({ beatGroup: 1, expected: [] })
    expect(keysOf(audio.played[1]?.sounds ?? [])).toEqual([60, 64, 67])
    wait(999)
    expect(result.current.state.beatGroup).toBe(1)
    wait(1)
    expect(result.current.state).toMatchObject({ beatGroup: 2, expected: [7] })
  })

  it('plays the other hand once, however often Play is tapped meanwhile', () => {
    const { result } = renderPractice(ONE_BAR, { mode: 'wait', hands: 'rh' })
    act(() => result.current.play())
    act(() => {
      keyboard.press(midi(60))
      keyboard.press(midi(64))
      keyboard.press(midi(67))
    })
    act(() => result.current.play())
    expect(audio.played).toHaveLength(1)
  })

  it('keeps a run of rests on the audio clock, each where the last ends', () => {
    const { result } = renderPractice(TWO_BARS, { mode: 'wait', hands: 'lh' })
    act(() => result.current.play())
    act(() => keyboard.press(midi(48)))
    wait(150)
    wait(1000)
    expect(result.current.state.beatGroup).toBe(2)
    expect(audio.played.map((play) => play.at)).toEqual([0.1, 0.1, 1.1])
  })

  it('keeps a run of rests on the swung grid the music is heard on', () => {
    const eighths = arrange(
      {
        key: { tonic: note('C'), minor: false },
        meter: '4/4',
        sections: [{ lines: [[{ chords: [{ ...parseChordSymbol('C'), beats: 4 }], beats: 4 }]] }],
      },
      {
        tonic: note('C'),
        pattern: {
          id: 'eighths',
          rh: { kind: 'events', events: parseFigure('0/2 C,2/2 C,4/2 C,6/2 C') },
          lh: { kind: 'events', events: parseFigure('0/16 L1') },
        },
      },
    )
    const { result } = renderPractice(eighths, { mode: 'wait', hands: 'lh', swing: 'medium' })
    act(() => result.current.play())
    act(() => keyboard.press(midi(48)))
    wait(150)
    wait(334)
    // The audio clock stands still here: the wait runs from the start of the chain.
    wait(1000)
    expect(result.current.state.beatGroup).toBe(3)
    // The off-beat 8th (beat group 1) is short and the 8th on the beat long: 1/3 then 2/3 of a beat.
    expect(audio.played.map((play) => Number(play.at.toFixed(4)))).toEqual([0.1, 0.1, 0.4333, 1.1])
  })

  it('sounds nothing where the learner moves while it waits: the learner plays it', () => {
    const { result } = renderPractice(TWO_BARS, { mode: 'wait', hands: 'rh' })
    act(() => result.current.play())
    act(() => result.current.next())
    expect(result.current.state.beatGroup).toBe(1)
    expect(audio.played).toHaveLength(0)
  })

  it('shows a wrong key and waits', () => {
    const { result } = renderPractice(ONE_BAR, { mode: 'wait', hands: 'rh' })
    act(() => result.current.play())
    act(() => result.current.press(midi(61)))
    wait(1000)
    expect(result.current.state).toMatchObject({ outcome: 'wrong', wrong: 61, beatGroup: 0 })
    expect(audio.played).toHaveLength(0)
  })

  it('plays nothing more once the piece is finished', () => {
    const { result } = renderPractice(ONE_BAR, { mode: 'wait', hands: 'lh' })
    act(() => result.current.play())
    act(() => result.current.jumpToBeatGroup(3))
    wait(1000)
    expect(result.current.state.outcome).toBe('finished')
    const played = audio.played.length
    wait(5000)
    expect(audio.played).toHaveLength(played)
  })
})

describe('usePractice: a loop and speed training', () => {
  it('loops the passage, and starts again inside it when the loop changes while playing', () => {
    const { result, rerender } = renderPractice(TWO_BARS)
    act(() => result.current.play())
    rerender({ performance: TWO_BARS, setup: { ...LISTEN, loop: { first: 1, last: 1 } } })
    expect(result.current.state.beatGroup).toBe(4)
    const pass = audio.played.at(-1)
    expect(new Set(notesOf(pass?.sounds ?? []).map((sound) => sound.midi % 12))).toEqual(
      new Set([7, 11, 2]),
    )
  })

  it('says the tempo of the pass sounding while speed training plays', () => {
    const { result } = renderPractice(ONE_BAR, { tempo: 60, ownTempo: 120, speedTraining: true })
    act(() => result.current.play())
    clockTo(0.1 + 1)
    expect(result.current.passTempo).toBe(60)
    clockTo(0.1 + 3.5)
    clockTo(0.1 + 4.2)
    expect(result.current.passTempo).toBe(66)
    act(() => result.current.stop())
    expect(result.current.passTempo).toBeNull()
  })

  it('starts again from the cursor, the climb carried on, when the hands change mid-training', () => {
    const training = { ...LISTEN, tempo: 60, ownTempo: 120, speedTraining: true }
    const { result, rerender } = renderPractice(ONE_BAR, training)
    act(() => result.current.play())
    clockTo(0.1 + 3.5)
    clockTo(0.1 + 4.2 + 1)
    expect(result.current.passTempo).toBe(66)
    const beatGroup = result.current.state.beatGroup
    rerender({ performance: ONE_BAR, setup: { ...training, hands: 'rh' } })
    const restarted = audio.played.at(-1)
    expect(restarted?.at).toBeCloseTo(5.3 + 0.1)
    expect(notesOf(restarted?.sounds ?? [])[0]?.at).toBe(0)
    expect(ONE_BAR.beatGroups[beatGroup]?.tick).toBe(B)
    clockTo(5.3 + 0.1 + 0.5)
    expect(result.current.passTempo).toBe(66)
  })

  it('carries the climb on when the learner moves while training plays', () => {
    const { result } = renderPractice(ONE_BAR, { tempo: 60, ownTempo: 120, speedTraining: true })
    act(() => result.current.play())
    clockTo(0.1 + 3.5)
    clockTo(0.1 + 4.2)
    expect(result.current.passTempo).toBe(66)
    act(() => result.current.next())
    clockTo(4.2 + 0.1 + 0.5)
    expect(result.current.passTempo).toBe(66)
  })

  it('starts the climb over at the chosen tempo when Play starts it again', () => {
    const { result } = renderPractice(ONE_BAR, { tempo: 60, ownTempo: 120, speedTraining: true })
    act(() => result.current.play())
    clockTo(0.1 + 3.5)
    clockTo(0.1 + 4.2)
    act(() => result.current.stop())
    act(() => result.current.play())
    clockTo(4.2 + 0.1 + 0.5)
    expect(result.current.passTempo).toBe(60)
  })

  it('never says the last run’s tempo when played again', () => {
    const { result } = renderPractice(ONE_BAR, { tempo: 60, ownTempo: 120, speedTraining: true })
    act(() => result.current.play())
    clockTo(0.1 + 3.5)
    clockTo(0.1 + 4.2)
    act(() => result.current.stop())
    act(() => result.current.play())
    expect(result.current.passTempo).toBeNull()
  })

  it('goes round a loop in Wait mode', () => {
    const { result } = renderPractice(TWO_BARS, {
      mode: 'wait',
      hands: 'lh',
      loop: { first: 1, last: 1 },
    })
    act(() => result.current.play())
    act(() => result.current.jumpToBeatGroup(7))
    wait(1000)
    expect(result.current.state).toMatchObject({ beatGroup: 4, playing: true })
  })
})

describe('usePractice: unmount', () => {
  it('plays nothing more once gone, with a right answer’s pause still to run', () => {
    const { result, unmount } = renderPractice(ONE_BAR, { mode: 'wait', hands: 'rh' })
    act(() => result.current.play())
    act(() => {
      keyboard.press(midi(60))
      keyboard.press(midi(64))
      keyboard.press(midi(67))
    })
    expect(result.current.state.outcome).toBe('correct')
    const played = audio.played.length
    unmount()
    wait(5000)
    expect(audio.played).toHaveLength(played)
  })

  it('queues no further pass once gone mid-Listen', () => {
    const { result, unmount } = renderPractice(ONE_BAR)
    act(() => result.current.play())
    unmount()
    clockTo(0.1 + 3.6)
    expect(audio.played).toHaveLength(1)
  })
  it('silences the sound and stops listening to the keyboard', () => {
    const { result, unmount } = renderPractice(ONE_BAR, { mode: 'wait', hands: 'rh' })
    act(() => result.current.play())
    act(() => result.current.press(midi(61)))
    unmount()
    expect(audio.stops).toBe(1)
    expect(() => keyboard.press(midi(60))).not.toThrow()
    expect(result.current.state.outcome).toBe('wrong')
  })
})
