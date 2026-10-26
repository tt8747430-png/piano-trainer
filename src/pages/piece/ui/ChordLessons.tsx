import { Check, Piano } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { PieceId } from '@/entities/piece'
import { selectLessons, useProgress, useProgressStoreApi } from '@/entities/progress'
import { diagramChord } from '@/features/practice'
import { recordChord } from '@/features/record-lesson'
import type { Performance } from '@/shared/lib/arrangement'
import { printedSymbol } from '@/shared/lib/music'
import { RowGroup, RowLink, type Paint } from '@/shared/ui'
import { ChordSheet } from '@/widgets/chord-diagrams'
import type { ChordLesson } from '../model/section-lessons'

/**
 * A section's chords to learn (spec §3.2): "Learn C♯m⁷" for each, its tile in the section's paint
 * with the piano, a check on it once done. A row opens the chord's sheet, voiced as it first sounds
 * in the section, where its keys held together (on a MIDI keyboard or the sheet's own) learn it.
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
  const done = useProgress(selectLessons)
  // The chord last opened stays in its sheet as the sheet closes.
  const [shown, setShown] = useState<{ lesson: ChordLesson; open: boolean } | null>(null)
  const chord = shown ? diagramChord(performance, shown.lesson.chord) : null
  if (chords.length === 0) return null
  return (
    <>
      <RowGroup title={t('learnSection.chords')}>
        {chords.map((lesson) => {
          const learned = done[lesson.key] !== undefined
          return (
            <li key={lesson.key}>
              <RowLink
                title={t('learnSection.learnChord', { chord: printedSymbol(lesson.symbol) })}
                icon={learned ? Check : Piano}
                paint={paint}
                // The check says it to the eye alone.
                trailing={
                  learned ? <span className="sr-only">{t('learnSection.done')}</span> : undefined
                }
                // It opens a sheet over the page, not another page: the row is a button.
                render={
                  <button
                    type="button"
                    className="w-full text-left"
                    onClick={() => setShown({ lesson, open: true })}
                  />
                }
              />
            </li>
          )
        })}
      </RowGroup>
      {shown && chord ? (
        <ChordSheet
          chord={chord}
          open={shown.open}
          onOpenChange={(open) => setShown({ ...shown, open })}
          learn={{
            learned: done[shown.lesson.key] !== undefined,
            onLearned: () => recordChord(store, pieceId, shown.lesson.symbol, new Date()),
          }}
        />
      ) : null}
    </>
  )
}
