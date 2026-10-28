import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { StaffQuestion } from './staff-question'
import { C_MAJOR, placeChord, TICKS_PER_BEAT, writtenName } from '@/shared/lib/music'
import { notate, type StaffId, type TimedMusic } from '@/shared/lib/notation'
import { chordBar, noteLine } from '@/shared/lib/schedule'
import { cn } from '@/shared/lib'
import { LazyScoreView } from '@/shared/ui'

const WHOLE_BAR = 4 * TICKS_PER_BEAT

/**
 * What a round shows on a staff: a note on its clef, a key's signature over a bar's rest, a chord
 * held for a bar as the keys place it, or an interval's two notes together.
 */
function staffOf(question: StaffQuestion): { clef: StaffId; music: TimedMusic } {
  switch (question.mode) {
    case 'read-note': {
      const written = `${writtenName(question.key, question.spelled)}/1`
      const hand = question.clef === 'treble' ? 'rh' : 'lh'
      return {
        clef: question.clef,
        music: noteLine(written, { hand, meter: '4/4', key: C_MAJOR }),
      }
    }
    case 'key-signature':
      return {
        clef: 'treble',
        music: {
          key: question.key,
          meter: '4/4',
          bars: [{ startTick: 0, beats: 4 }],
          notes: [],
          chords: [],
        },
      }
    case 'name-chord':
    case 'chord-card': {
      const { rh } = placeChord(question.tones, {
        inversion: question.inversion ?? 0,
        bothHands: false,
      })
      return { clef: 'treble', music: chordBar({ lh: [], rh }) }
    }
    case 'name-interval':
    case 'interval-card':
      return {
        clef: 'treble',
        music: {
          key: C_MAJOR,
          meter: '4/4',
          bars: [{ startTick: 0, beats: 4 }],
          notes: [
            {
              midi: question.low,
              spelled: question.lowNote,
              hand: 'rh',
              startTick: 0,
              durationTicks: WHOLE_BAR,
            },
            {
              midi: question.high,
              spelled: question.highNote,
              hand: 'rh',
              startTick: 0,
              durationTicks: WHOLE_BAR,
            },
          ],
          chords: [],
        },
      }
  }
}

/**
 * A round's staff: the note to play, the signature to name, the chord or interval asked. Hidden (a
 * card's other side, a round by ear before its answer), it keeps its place under a "?", so nothing
 * on the board moves when it is turned over.
 */
export function RoundStaff({
  question,
  hidden = false,
}: {
  question: StaffQuestion
  hidden?: boolean
}) {
  const { t } = useTranslation('music')
  const { clef, score } = useMemo(() => {
    const staff = staffOf(question)
    return { clef: staff.clef, score: notate(staff.music) }
  }, [question])
  return (
    <figure
      aria-label={hidden ? undefined : t('sheet.label')}
      className="relative card self-stretch px-4 py-2 sm:self-start"
    >
      <div aria-hidden={hidden} className={cn(hidden && 'invisible')}>
        <LazyScoreView score={score} staff={clef} scale={1.25} />
      </div>
      {hidden ? (
        <span
          aria-hidden
          className="absolute inset-0 grid place-items-center rounded-3xl bg-muted font-display text-4xl font-semibold text-muted-foreground"
        >
          ?
        </span>
      ) : null}
    </figure>
  )
}
