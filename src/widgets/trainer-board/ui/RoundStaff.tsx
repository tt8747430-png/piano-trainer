import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { Question } from '@/features/trainer'
import { note, noteName, writtenOctave } from '@/shared/lib/music'
import { notate } from '@/shared/lib/notation'
import { noteLine } from '@/shared/lib/schedule'
import { LazyScoreView } from '@/shared/ui'

const C_MAJOR = { tonic: note('C'), minor: false }

/** What a reading round shows on a staff: a note on its clef, or a key's signature over a bar's rest. */
function staffOf(question: Extract<Question, { mode: 'read-note' | 'key-signature' }>) {
  if (question.mode === 'read-note') {
    const written = `${noteName(question.spelled)}${writtenOctave(question.key, question.spelled)}/1`
    const hand = question.clef === 'treble' ? 'rh' : 'lh'
    return { clef: question.clef, music: noteLine(written, { hand, meter: '4/4', key: C_MAJOR }) }
  }
  return {
    clef: 'treble' as const,
    music: {
      key: question.key,
      meter: '4/4' as const,
      bars: [{ startTick: 0, beats: 4 }],
      notes: [],
      chords: [],
    },
  }
}

/** A reading round's staff: the note to play, or the signature to name. */
export function RoundStaff({
  question,
}: {
  question: Extract<Question, { mode: 'read-note' | 'key-signature' }>
}) {
  const { t } = useTranslation('music')
  const { clef, score } = useMemo(() => {
    const staff = staffOf(question)
    return { clef: staff.clef, score: notate(staff.music) }
  }, [question])
  return (
    <figure aria-label={t('sheet.label')} className="card self-start px-4 py-2">
      <LazyScoreView score={score} staff={clef} scale={1.25} />
    </figure>
  )
}
