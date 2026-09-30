import { describe, expect, it } from 'vitest'
import { note, placeScale, scaleKey } from '@/shared/lib/music'
import { notate, ticksOf, type Score } from '@/shared/lib/notation'
import { noteLine, scaleRun } from '@/shared/lib/schedule'
import { engrave } from '@/shared/ui/score/engrave'
import { LESSONS } from '../index'

const C_MAJOR = { tonic: note('C'), minor: false }

/** Every voice of every measure fills its bar, its events end to end. */
function expectWritten(score: Score) {
  for (const measure of score.measures) {
    for (const voice of [...measure.staves.treble, ...measure.staves.bass]) {
      let at = measure.startTick
      for (const event of voice.events) {
        expect(event.tick).toBe(at)
        at += ticksOf(event.duration, score.meter)
      }
      expect(at).toBe(measure.startTick + measure.ticks)
    }
  }
}

describe('every lesson’s staves', () => {
  it('write each line of notes whole, on its one staff', () => {
    for (const lesson of LESSONS) {
      for (const section of lesson.sections) {
        for (const block of section.blocks) {
          if (block.kind !== 'notes') continue
          const score = notate(
            noteLine(block.notes, {
              hand: block.clef === 'treble' ? 'rh' : 'lh',
              meter: block.meter ?? '4/4',
              key: block.key ?? C_MAJOR,
            }),
          )
          expectWritten(score)
          const host = document.createElement('div')
          engrave(score, host, { scale: 1, fingers: false, names: false, staff: block.clef })
          expect(host.querySelector('svg'), `${lesson.id}: ${block.notes}`).not.toBeNull()
        }
      }
    }
  })

  it('write each scale’s run whole, on the treble staff', () => {
    for (const lesson of LESSONS) {
      for (const section of lesson.sections) {
        for (const block of section.blocks) {
          if (block.kind !== 'scale') continue
          const score = notate(
            scaleRun(
              { notes: placeScale(block.root, block.scale) },
              {
                rhythm: 'even',
                hands: 'rh',
                key: scaleKey(block.root, block.scale),
              },
            ),
          )
          expectWritten(score)
          const host = document.createElement('div')
          engrave(score, host, { scale: 1, fingers: false, names: false, staff: 'treble' })
          expect(host.querySelector('svg'), lesson.id).not.toBeNull()
        }
      }
    }
  })
})
