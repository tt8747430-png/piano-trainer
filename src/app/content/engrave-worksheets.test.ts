// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { note, placeScale, scaleKey } from '@/shared/lib/music'
import { notate, ticksOf, type Score } from '@/shared/lib/notation'
import { noteLine, scaleRun, voicingsMusic } from '@/shared/lib/schedule'
import { drawScore } from '@/shared/ui/score/verovio/draw'
import { COURSES } from '@/entities/course'
import { LESSONS } from '@/entities/lesson'

/** Every lesson a learner reads: the journeys', then each course's own. */
const WORKSHEETS = [...LESSONS, ...COURSES.flatMap((course) => course.lessons)]

const C_MAJOR = { tonic: note('C'), minor: false }

/** A score engraved by Verovio on the staves asked, its measures all drawn. */
async function expectEngraved(score: Score, staves: Score['staves'], what: string) {
  const host = document.createElement('div')
  const options = { scale: 1, fingers: false, names: false, staves }
  const layout = await drawScore(score, host, options, new AbortController().signal)
  expect(host.querySelectorAll('g.measure').length, what).toBe(score.measures.length)
  expect(layout?.measures.length, what).toBe(score.measures.length)
}

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

describe('every lesson’s staves, a journey’s or a course’s', () => {
  it('write each line of notes whole, on its one staff', async () => {
    for (const lesson of WORKSHEETS) {
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
          await expectEngraved(score, [block.clef], `${lesson.id}: ${block.notes}`)
        }
      }
    }
  })

  it('write each scale’s run whole, on the treble staff', async () => {
    for (const lesson of WORKSHEETS) {
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
          await expectEngraved(score, ['treble'], lesson.id)
        }
      }
    }
  })

  it('write each row of voicings whole, on the grand staff', async () => {
    for (const lesson of WORKSHEETS) {
      for (const section of lesson.sections) {
        for (const block of section.blocks) {
          if (block.kind !== 'voicings') continue
          const score = notate(voicingsMusic(block.voicings, block.key))
          expectWritten(score)
          await expectEngraved(score, score.staves, `${lesson.id}: ${section.heading.en}`)
        }
      }
    }
  })
})
