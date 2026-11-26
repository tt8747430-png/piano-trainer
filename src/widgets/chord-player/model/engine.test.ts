import { describe, expect, it } from 'vitest'
import { DEFAULT_SHEET_SETTINGS, type ChordSheetSettings } from '@/entities/chord-sheet'
import { BUILT_IN_STYLES, type Style } from '@/entities/pattern'
import { createFakeAudio } from '@/shared/api/audio'
import { textToSheet, type ChordSheet } from '@/shared/lib/arrangement'
import type { NoteSound, Sound } from '@/shared/lib/schedule'
import { createChordEngine, type PlayPlan } from './engine'

const POP_1 = BUILT_IN_STYLES[0] as Style
const sheetOf = (text: string): ChordSheet => {
  const sheet = textToSheet(text)
  if (!sheet) throw new Error(text)
  return sheet
}

/** An engine over the fake audio, its clock moved by the test and its ticker ticked by hand. */
function setUp(text: string, settings: Partial<ChordSheetSettings> = {}, tempo = 120) {
  const audio = createFakeAudio()
  let tick = () => {}
  let plan: PlayPlan = {
    sheet: sheetOf(text),
    style: POP_1,
    tempo,
    settings: { ...DEFAULT_SHEET_SETTINGS, ...settings },
  }
  const engine = createChordEngine({
    audio,
    ticker: (onTick) => {
      tick = onTick
      return () => {
        tick = () => {}
      }
    },
    plan: () => plan,
  })
  const at = (seconds: number) => {
    audio.setNow(seconds)
    tick()
  }
  return {
    audio,
    engine,
    at,
    replan: (change: Partial<PlayPlan>) => {
      plan = { ...plan, ...change }
    },
  }
}
const heard = (audio: ReturnType<typeof createFakeAudio>) =>
  audio.played.flatMap((play) => play.sounds.map((sound) => ({ ...sound, at: play.at + sound.at })))
const bassAt = (sounds: readonly Sound[], at: number) =>
  sounds.find(
    (s): s is NoteSound =>
      s.kind === 'note' &&
      s.instrument !== undefined &&
      s.instrument !== 'piano' &&
      Math.abs(s.at - at) < 1e-6,
  )

describe('the chord player’s transport', () => {
  it('plays chord by chord a little ahead, lighting each box as its time comes', () => {
    const { audio, engine, at } = setUp('C 4/4; verse: C G')
    engine.play()
    expect(engine.state().playing).toBe(true)
    // At 120 a bar is 2 s: the first chord is queued at once, the second only near its time.
    expect(audio.played).toHaveLength(1)
    const start = audio.played[0]?.at ?? 0
    expect(engine.state().lit).toEqual({ section: 0, index: 0 })
    at(start + 1.95)
    expect(audio.played).toHaveLength(2)
    expect(engine.state().lit).toEqual({ section: 0, index: 0 })
    at(start + 2.01)
    expect(engine.state().lit).toEqual({ section: 0, index: 1 })
  })
  it('plays the band: the piano, the bass and the drums, each named', () => {
    const { audio, engine } = setUp('C 4/4; verse: C')
    engine.play()
    const sounds = heard(audio)
    expect(sounds.some((s) => s.kind === 'note' && s.instrument === 'piano')).toBe(true)
    expect(sounds.some((s) => s.kind === 'note' && s.instrument === 'bassElectric')).toBe(true)
    expect(sounds.some((s) => s.kind === 'drum' && s.piece === 'kick')).toBe(true)
  })
  it('an edit while playing lands at the next chord', () => {
    const { audio, engine, at, replan } = setUp('C 4/4; verse: C G')
    engine.play()
    const start = audio.played[0]?.at ?? 0
    replan({ sheet: sheetOf('C 4/4; verse: C F') })
    at(start + 1.95)
    const second = bassAt(heard(audio), start + 2)
    expect(second?.midi && second.midi % 12).toBe(5)
  })
  it('turns a part off or down as it sounds, and the volume over all', () => {
    const { audio, engine } = setUp('C 4/4; verse: C', {
      drums: { on: false, level: 70 },
      bass: { on: true, level: 50 },
      volume: 50,
    })
    engine.play()
    const play = audio.played[0]
    const drum = play?.sounds.find((s) => s.kind === 'drum')
    const bass = play?.sounds.find((s) => s.kind === 'note' && s.instrument === 'bassElectric')
    expect(drum && play?.gain?.(drum)).toBe(0)
    expect(bass && play?.gain?.(bass)).toBeCloseTo(0.25)
  })
  it('counts a bar in on the metronome’s click, its first accented', () => {
    const { audio, engine, at } = setUp('C 3/4; verse: C', { countIn: 1 })
    engine.play()
    at(1.55)
    const clicks = heard(audio).filter((s) => s.kind === 'click')
    expect(clicks.map((c) => c.kind === 'click' && c.accent)).toEqual([true, false, false])
    const firstNote = heard(audio).find((s) => s.kind === 'note')
    expect(firstNote && firstNote.at - (clicks[0]?.at ?? 0)).toBeCloseTo(1.5)
  })
  it('Stop fades the sound out over 2 beats, then silences it', () => {
    const { audio, engine, at } = setUp('C 4/4; verse: C G Am F')
    engine.play()
    // Play cut off what sounded before it.
    const stops = audio.stops
    const start = audio.played[0]?.at ?? 0
    at(start + 0.5)
    engine.stop()
    expect(engine.state().playing).toBe(false)
    const gain = audio.played[0]?.gain
    const note = (when: number): Sound => ({
      kind: 'note',
      midi: 60 as never,
      at: when,
      duration: 0.1,
      velocity: 1,
      instrument: 'piano',
    })
    // Asked at 0.5 s into a 1 s fade, a sound is half as loud as it was.
    audio.setNow(start + 1)
    const half = gain?.(note(0)) ?? 0
    audio.setNow(start + 0.5)
    const full = gain?.(note(0)) ?? 0
    expect(half).toBeCloseTo(full / 2)
    expect(audio.stops).toBe(stops)
    at(start + 1.6)
    expect(audio.stops).toBe(stops + 1)
  })
  it('repeats the sheet until Stop, or ends on the last chord ringing 3 s', () => {
    const repeating = setUp('C 4/4; verse: C')
    repeating.engine.play()
    const start = repeating.audio.played[0]?.at ?? 0
    repeating.at(start + 1.95)
    expect(repeating.audio.played).toHaveLength(2)
    expect(repeating.engine.state().playing).toBe(true)

    const once = setUp('C 4/4; verse: C', { plays: 1 })
    once.engine.play()
    const piano = heard(once.audio).filter((s) => s.kind === 'note' && s.instrument === 'piano')
    expect(
      Math.max(...piano.map((s) => (s.kind === 'note' ? s.at + s.duration : 0))),
    ).toBeGreaterThan(start + 2 + 2.9)
    once.at(start + 1.95)
    expect(once.audio.played).toHaveLength(1)
    once.at(start + 5.2)
    expect(once.engine.state().playing).toBe(false)
  })
  it('a sound started elsewhere stops it', () => {
    const { audio, engine, at } = setUp('C 4/4; verse: C G')
    engine.play()
    audio.stop()
    at(0.2)
    expect(engine.state().playing).toBe(false)
  })
  it('loops one section, its repeats, again and again', () => {
    const { audio, engine, at } = setUp('C 4/4; verse: C; chorus: F')
    engine.play({ loop: 1 })
    const start = audio.played[0]?.at ?? 0
    expect(engine.state().lit).toEqual({ section: 1, index: 0 })
    at(start + 1.95)
    const second = bassAt(heard(audio), start + 2)
    expect(second?.midi && second.midi % 12).toBe(5)
  })
})
