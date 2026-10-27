import { Check, Piano } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { PieceId } from '@/entities/piece'
import { CHORD_HOLDS, selectHolds, useProgress, useProgressStoreApi } from '@/entities/progress'
import { usePieceInversions } from '@/features/choose-diagram-inversion'
import { diagramChord } from '@/features/practice'
import { recordHold } from '@/features/record-lesson'
import type { Performance } from '@/shared/lib/arrangement'
import { printedSymbol } from '@/shared/lib/music'
import { RowButton, RowGroup, type Paint } from '@/shared/ui'
import { ChordSheet } from '@/widgets/chord-diagrams'
import type { ChordLesson } from '../model/section-lessons'

/**
 * A chord to learn as a row (ADR 0111): "Learn C♯m⁷", its tile in the section's paint with
 * the piano, a check on it once learned; its holds so far, "1 of 3", at its end until then.
 */
function ChordLessonRow({
  lesson,
  paint,
  onOpen,
}: {
  lesson: ChordLesson
  paint: Paint
  onOpen: () => void
}) {
  const { t } = useTranslation('piece')
  const held = useProgress(selectHolds(lesson.key))
  const learned = held >= CHORD_HOLDS
  return (
    <li>
      {/* It opens a sheet over the page, not another page: a button with no chevron. */}
      <RowButton
        title={t('learnSection.learnChord', { chord: printedSymbol(lesson.symbol) })}
        icon={learned ? Check : Piano}
        paint={paint}
        trailing={
          learned ? (
            // The check says it to the eye alone.
            <span className="sr-only">{t('learnSection.done')}</span>
          ) : held > 0 ? (
            <span className="shrink-0 text-sm text-muted-foreground tabular-nums">
              {t('learnSection.held', { held, needed: CHORD_HOLDS })}
            </span>
          ) : undefined
        }
        onClick={onOpen}
      />
    </li>
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
  paint,
}: {
  pieceId: PieceId
  /** The piece as the Player plays it: what the sheet draws each chord from. */
  performance: Performance
  chords: readonly ChordLesson[]
  paint: Paint
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
      <RowGroup
        title={t('learnSection.chords')}
        info={t('learnSection.chordsInfo', { count: CHORD_HOLDS })}
      >
        {chords.map((lesson) => (
          <ChordLessonRow
            key={lesson.key}
            lesson={lesson}
            paint={paint}
            onOpen={() => setShown({ lesson, open: true })}
          />
        ))}
      </RowGroup>
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
