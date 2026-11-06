import { describe, expect, it } from 'vitest'
import { beatsPerBar, beatsToTicks, midi, note, type Meter } from '@/shared/lib/music'
import { notate, type TimedMusic } from '@/shared/lib/notation'
import { readMusicXml } from './read'
import { scoreToMusicXml } from './write'

/** Two bars of a meter, empty, as the score editor writes a new song's. */
const twoBars = (meter: Meter, timeSymbol = false): TimedMusic => {
  const beats = beatsPerBar(meter)
  return {
    key: { tonic: note('C'), minor: false },
    meter,
    bars: [
      { startTick: 0, beats },
      { startTick: beatsToTicks(beats), beats, barline: 'final' },
    ],
    notes: [
      {
        midi: midi(60),
        spelled: note('C'),
        hand: 'rh',
        startTick: 0,
        durationTicks: beatsToTicks(beats),
      },
    ],
    chords: [],
    ...(timeSymbol ? { timeSymbol: true } : {}),
  }
}

describe('scoreToMusicXml’s time signatures (R31-E)', () => {
  it.each(['3/1', '2/1', '5/16', '7/16', '12/16', '15/8', '13/8', '16/4', '11/2', '7/8'] as const)(
    'writes %s by its figures, read back as the same meter',
    (meter) => {
      const xml = scoreToMusicXml(notate(twoBars(meter)))
      const [count, unit] = meter.split('/')
      expect(xml).toContain(`<beats>${count}</beats><beat-type>${unit}</beat-type>`)
      const read = readMusicXml(xml)
      expect(read.meter).toBe(meter)
      expect(read.timeSymbol).toBeUndefined()
    },
  )

  it('writes common and cut time as their signs, read back as the score asked', () => {
    for (const [meter, sign] of [
      ['4/4', 'common'],
      ['2/2', 'cut'],
    ] as const) {
      const xml = scoreToMusicXml(notate(twoBars(meter, true)))
      expect(xml).toContain(`<time symbol="${sign}">`)
      expect(readMusicXml(xml)).toMatchObject({ meter, timeSymbol: true })
      expect(scoreToMusicXml(notate(twoBars(meter)))).not.toContain('symbol=')
    }
  })
})
