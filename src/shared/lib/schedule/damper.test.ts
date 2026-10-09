import { describe, expect, it } from 'vitest'
import { midi } from '@/shared/lib/music'
import { damp, QUIET_DAMPER, type Damper, type DamperEvent } from './damper'

const C = midi(60)
const E = midi(64)
const G = midi(67)

const press = (key: typeof C): DamperEvent => ({ kind: 'press', midi: key })
const release = (key: typeof C): DamperEvent => ({ kind: 'release', midi: key })
const pedal = (kind: 'sustain' | 'soft' | 'sostenuto', down: boolean): DamperEvent => ({
  kind: 'pedal',
  pedal: kind,
  down,
})

/** The damper after each event in turn, and the keys stopped by the last. */
function after(...events: DamperEvent[]): { damper: Damper; stopped: readonly number[] } {
  let damper = QUIET_DAMPER
  let stopped: readonly number[] = []
  for (const event of events) ({ damper, stopped } = damp(damper, event))
  return { damper, stopped }
}

describe('damp', () => {
  it('holds and sounds a key pressed, stopping nothing', () => {
    const { damper, stopped } = after(press(C))
    expect([...damper.held]).toEqual([C])
    expect([...damper.sounding]).toEqual([C])
    expect(stopped).toEqual([])
  })

  it('stops a key let go', () => {
    const { damper, stopped } = after(press(C), release(C))
    expect(stopped).toEqual([C])
    expect(damper.sounding.size).toBe(0)
  })

  it('keeps a key let go under the sustain sounding', () => {
    const { damper, stopped } = after(pedal('sustain', true), press(C), release(C))
    expect(stopped).toEqual([])
    expect([...damper.sounding]).toEqual([C])
  })

  it('stops the keys let go as the sustain comes up, and keeps the ones still held', () => {
    const { damper, stopped } = after(
      pedal('sustain', true),
      press(C),
      press(E),
      release(C),
      pedal('sustain', false),
    )
    expect(stopped).toEqual([C])
    expect([...damper.sounding]).toEqual([E])
  })

  it('holds with the sostenuto only the keys down as it went down', () => {
    const struck = after(press(C), pedal('sostenuto', true), press(E), release(E))
    expect(struck.stopped).toEqual([E])
    const letGo = damp(struck.damper, release(C))
    expect(letGo.stopped).toEqual([])
    expect([...letGo.damper.sounding]).toEqual([C])
    const up = damp(letGo.damper, pedal('sostenuto', false))
    expect(up.stopped).toEqual([C])
    expect(up.damper.caught.size).toBe(0)
  })

  it('stops nothing as the sostenuto comes up while the sustain is down', () => {
    const { damper, stopped } = after(
      press(C),
      pedal('sostenuto', true),
      pedal('sustain', true),
      release(C),
      pedal('sostenuto', false),
    )
    expect(stopped).toEqual([])
    expect([...damper.sounding]).toEqual([C])
  })

  it('stops nothing with the soft pedal', () => {
    expect(after(press(C), pedal('soft', true)).stopped).toEqual([])
    const { damper, stopped } = after(press(C), pedal('soft', true), pedal('soft', false))
    expect(stopped).toEqual([])
    expect(damper.pedals.soft).toBe(false)
  })

  it('keeps a key struck again sounding', () => {
    const { damper, stopped } = after(pedal('sustain', true), press(G), release(G), press(G))
    expect(stopped).toEqual([])
    expect([...damper.sounding]).toEqual([G])
    expect([...damper.held]).toEqual([G])
  })

  it('keeps the pedals the same object until a pedal changes', () => {
    const before = after(pedal('sustain', true)).damper
    const { damper } = damp(before, press(C))
    expect(damper.pedals).toBe(before.pedals)
    expect(damp(damper, pedal('sustain', false)).damper.pedals).not.toBe(before.pedals)
  })
})
