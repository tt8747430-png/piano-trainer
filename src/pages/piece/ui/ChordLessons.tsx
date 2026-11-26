import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import type { PieceId } from '@/entities/piece'
import { CHORD_HOLDS, selectHolds, useProgress, useProgressStoreApi } from '@/entities/progress'
import { usePieceInversions } from '@/features/choose-diagram-inversion'
import { diagramChord } from '@/features/practice'
import { recordHold } from '@/features/record-lesson'
import type { Performance } from '@/shared/lib/arrangement'
import { printedSymbol } from '@/shared/lib/music'
import { RowButton, SettingsGroup } from '@/shared/ui'
import { ChordSheet } from '@/widgets/chord-diagrams'
import type { ChordLesson } from '../model/section-lessons'
import { LessonStatus } from './LessonStatus'

/**
 * A chord to learn as a row, as the Section board draws it: "Learn C♯m⁷", then its holds so far at its
 * end ("1 of 3"), Done in the learned green once learned; it opens the chord's sheet.
 */
function ChordLessonRow({ lesson, onOpen }: { lesson: ChordLesson; onOpen: () => void }) {
  const { t } = useTranslation('piece')
  const held = useProgress(selectHolds(lesson.key))
  const learned = held >= CHORD_HOLDS
  return (
    <RowButton
      title={
        <Trans
          t={t}
          i18nKey="learnSection.learnChord"
          values={{ chord: printedSymbol(lesson.symbol) }}
          components={{ b: <b className="font-semibold" /> }}
        />
      }
      trailing={
        <LessonStatus
          done={learned}
          count={t('learnSection.held', { held, needed: CHORD_HOLDS })}
        />
      }
      opens
      onClick={onOpen}
    />
  )
}

/**
 * A section's chords to learn (ADR 0111), each a row opening the chord's sheet, drawn in the
 * inversion chosen for it in the piece (ADR 0108), where its keys held together (on a MIDI keyboard
 * or the sheet's own) three times, let go between, learn it.
 */
export function ChordLessons({
  pieceId,
  performance,
  chords,
}: {
  pieceId: PieceId
  /** The piece as the Player plays it: what the sheet draws each chord from. */
  performance: Performance
  chords: readonly ChordLesson[]
}) {
  const { t } = useTranslation('piece')
  const store = useProgressStoreApi()
  // The chord last opened stays in its sheet as the sheet closes.
  const [shown, setShown] = useState<{ lesson: ChordLesson; open: boolean } | null>(null)
  const held = useProgress(selectHolds(shown?.lesson.key ?? `${pieceId}:chord:`))
  const chosen = usePieceInversions()?.chosen
  const chord = shown ? diagramChord(performance, shown.lesson.chord, chosen) : null
  if (chords.length === 0) return null
  return (
    <>
      <SettingsGroup
        title={t('learnSection.chords')}
        info={t('learnSection.chordsInfo', { count: CHORD_HOLDS })}
        flush
      >
        {chords.map((lesson) => (
          <ChordLessonRow
            key={lesson.key}
            lesson={lesson}
            onOpen={() => setShown({ lesson, open: true })}
          />
        ))}
      </SettingsGroup>
      {shown && chord ? (
        <ChordSheet
          chord={chord}
          open={shown.open}
          onOpenChange={(open) => setShown({ ...shown, open })}
          learn={{
            held,
            needed: CHORD_HOLDS,
            onHeld: () => recordHold(store, pieceId, shown.lesson.symbol, new Date()),
          }}
        />
      ) : null}
    </>
  )
}
