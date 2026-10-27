import { AudioWaveform, ListMusic, MoveRight } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePatternName } from '@/entities/pattern'
import type { Piece } from '@/entities/piece'
import type { Performance } from '@/shared/lib/arrangement'
import { printedSymbol } from '@/shared/lib/music'
import { RowGroup, type Fold, type Paint } from '@/shared/ui'
import type { SectionLessons } from '../model/section-lessons'
import { ChordLessons } from './ChordLessons'
import { LessonRow } from './LessonRow'

/**
 * A section's lessons as its page teaches them (ADR 0111), in the section's paint, each group
 * named by what it does in a word or two and how behind its ⓘ: its chords, each learned in its sheet
 * by holding it three times; then, folded until asked for, its chords in time (each sequence, the
 * Player in Listen with the click), one change at a time where there is more than one (Wait mode on
 * the two chords), and the pattern its chords are played by (a bar of it on one chord, its notes lit).
 * A row names what it plays: its chords, its change, its pattern and the chord it is on.
 */
export function SectionLessonGroups({
  piece,
  performance,
  lessons: { chords, sequences, changes, patterns },
  paint,
}: {
  piece: Pick<Piece, 'id'>
  /** The piece as the Player plays it, its repeats taken: what the lessons were read from. */
  performance: Performance
  lessons: SectionLessons
  paint: Paint
}) {
  const { t } = useTranslation('piece')
  const patternName = usePatternName()
  const inTimeFold = useClosedFold()
  const changesFold = useClosedFold()
  const patternFold = useClosedFold()
  // One change alone is the sequence itself: its own row adds nothing (ADR 0111, amended).
  const oneAtATime = changes.length > 1 ? changes : []
  return (
    <>
      <ChordLessons pieceId={piece.id} performance={performance} chords={chords} paint={paint} />
      {sequences.length > 0 ? (
        <RowGroup
          title={t('learnSection.inTime')}
          info={t('learnSection.inTimeInfo')}
          fold={inTimeFold}
        >
          {sequences.map((sequence) => (
            <LessonRow
              key={sequence.key}
              pieceId={piece.id}
              lesson={sequence}
              title={sequence.symbols.map(printedSymbol).join(' · ')}
              icon={ListMusic}
              paint={paint}
            />
          ))}
        </RowGroup>
      ) : null}
      {oneAtATime.length > 0 ? (
        <RowGroup
          title={t('learnSection.oneChange')}
          info={t('learnSection.oneChangeInfo')}
          fold={changesFold}
        >
          {oneAtATime.map((change) => (
            <LessonRow
              key={`${change.from} ${change.to}`}
              pieceId={piece.id}
              lesson={change}
              title={t('learnSection.change', {
                from: printedSymbol(change.from),
                to: printedSymbol(change.to),
              })}
              icon={MoveRight}
              paint={paint}
            />
          ))}
        </RowGroup>
      ) : null}
      {patterns.length > 0 ? (
        <RowGroup
          title={t('learnSection.pattern', { count: patterns.length })}
          info={t('learnSection.patternInfo')}
          fold={patternFold}
        >
          {patterns.map((pattern) => (
            <LessonRow
              key={pattern.pattern}
              pieceId={piece.id}
              lesson={pattern}
              title={patternName(pattern.pattern) ?? t('learnSection.pattern', { count: 1 })}
              detail={t('learnSection.patternOn', { chord: printedSymbol(pattern.symbol) })}
              icon={AudioWaveform}
              paint={paint}
            />
          ))}
        </RowGroup>
      ) : null}
    </>
  )
}

/** A group of lessons that starts folded: the section's chords come first, the rest on asking. */
function useClosedFold(): Fold {
  const [open, setOpen] = useState(false)
  return { open, toggle: () => setOpen((was) => !was) }
}
