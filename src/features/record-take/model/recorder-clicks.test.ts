import { describe, expect, it } from 'vitest'
import { recorderClicks } from './recorder-clicks'

/** Each click as its time and whether it is accented: `2!` a bar's first beat at 2 s. */
const heard = (sounds: readonly { at: number; accent: boolean }[]) =>
  sounds.map(({ at, accent }) => `${at}${accent ? '!' : ''}`)

describe('recorderClicks', () => {
  it('counts in a bar of the meter, then clicks on the piece’s bars, the meter’s past its end', () => {
    // At 120 a beat is half a second: a bar of 4/4, then a bar of two beats, then the meter's.
    const clicks = recorderClicks({
      barTicks: [48, 24],
      meter: '4/4',
      tempo: 120,
      click: true,
      longest: 6,
    })
    expect(clicks.downbeat).toBe(2)
    expect(heard(clicks.sounds)).toEqual([
      ...['0!', '0.5', '1', '1.5'],
      ...['2!', '2.5', '3', '3.5'],
      ...['4!', '4.5'],
      ...['5!', '5.5', '6', '6.5'],
      // The take stops itself 6 s after the downbeat: no click past it.
      ...['7!', '7.5'],
    ])
    expect(clicks.barStarts).toEqual([0, 2, 3, 5])
  })

  it('counts in alone when the click is off, and still knows where the bars start', () => {
    const clicks = recorderClicks({
      barTicks: [36],
      meter: '3/4',
      tempo: 60,
      click: false,
      longest: 7,
    })
    expect(heard(clicks.sounds)).toEqual(['0!', '1', '2'])
    expect(clicks.downbeat).toBe(3)
    expect(clicks.barStarts).toEqual([0, 3, 6])
  })

  it('counts a compound meter in its dotted quarters', () => {
    const clicks = recorderClicks({
      barTicks: [],
      meter: '6/8',
      tempo: 60,
      click: true,
      longest: 3,
    })
    expect(heard(clicks.sounds)).toEqual(['0!', '1', '2!', '3', '4!'])
    expect(clicks.barStarts).toEqual([0, 2])
  })
})
