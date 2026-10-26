import { AudioWaveform, ListMusic, MoveRight } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePatternName } from '@/entities/pattern'
import type { Piece } from '@/entities/piece'
import type { BarRange } from '@/features/practice'
import { useLocale } from '@/shared/i18n'
import type { Performance } from '@/shared/lib/arrangement'
import { printedSymbol } from '@/shared/lib/music'
import { FoldSection, RowGroup, type Fold, type Paint } from '@/shared/ui'
import type { SectionLessons } from '../model/section-lessons'
import { ChordLessons } from './ChordLessons'
import { LessonRow } from './LessonRow'

/**
 * A section's lessons as its page teaches them (spec §3.2), in the section's paint: its chords, each
 * learned in its sheet; then, folded until asked for (ADR 0100, amended), its changes (each chord
 * sequence in time, then one change at a time where there is more than one) and the pattern its
 * chords are played by, each a row into the Player looping it.
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
  const locale = useLocale()
  const patternName = usePatternName()
  const changesFold = useClosedFold()
  const patternFold = useClosedFold()
  // One change alone is the sequence itself: its own row adds nothing.
  const oneAtATime = changes.length > 1 ? changes : []
  // English names a sequence by its ordinal: 1st, 2nd, 3rd, 4th.
  const ordinal = new Intl.PluralRules(locale, { type: 'ordinal' })
  const sequenceName = (n: number) => t(`learnSection.sequence.${ordinal.select(n)}`, { n })
  const barsName = ({ first, last }: BarRange) =>
    first === last
      ? t('learnSection.bar', { n: first + 1 })
      : t('learnSection.bars', { first: first + 1, last: last + 1 })
  return (
    <>
      <ChordLessons pieceId={piece.id} performance={performance} chords={chords} paint={paint} />
      {sequences.length + oneAtATime.length > 0 ? (
        <FoldSection title={t('learnSection.changes')} fold={changesFold}>
          {sequences.length > 0 ? (
            <RowGroup title={t('learnSection.inTime')} level={3}>
              {sequences.map((sequence, i) => (
                <LessonRow
                  key={sequence.key}
                  pieceId={piece.id}
                  lesson={sequence}
                  title={
                    sequences.length > 1 ? sequenceName(i + 1) : t('learnSection.wholeSection')
                  }
                  detail={sequence.symbols.map(printedSymbol).join(' · ')}
                  icon={ListMusic}
                  paint={paint}
                />
              ))}
            </RowGroup>
          ) : null}
          {oneAtATime.length > 0 ? (
            <RowGroup title={t('learnSection.oneChange')} level={3}>
              {oneAtATime.map((change) => (
                <LessonRow
                  key={`${change.from} ${change.to}`}
                  pieceId={piece.id}
                  lesson={change}
                  title={t('learnSection.change', {
                    from: printedSymbol(change.from),
                    to: printedSymbol(change.to),
                  })}
                  detail={barsName(change.bars)}
                  icon={MoveRight}
                  paint={paint}
                />
              ))}
            </RowGroup>
          ) : null}
        </FoldSection>
      ) : null}
      {patterns.length > 0 ? (
        <FoldSection
          title={t('learnSection.pattern', { count: patterns.length })}
          fold={patternFold}
        >
          <ul className="grid-cards gap-2 *:card">
            {/* A pattern is named by what it is; where it is looped, by its chord and bar. */}
            {patterns.map((pattern) => (
              <LessonRow
                key={pattern.pattern}
                pieceId={piece.id}
                lesson={pattern}
                title={patternName(pattern.pattern) ?? t('learnSection.pattern', { count: 1 })}
                detail={t('learnSection.patternAt', {
                  chord: printedSymbol(pattern.symbol),
                  bars: barsName(pattern.bars),
                })}
                icon={AudioWaveform}
                paint={paint}
              />
            ))}
          </ul>
        </FoldSection>
      ) : null}
    </>
  )
}

/** A group of lessons that starts folded: the section's chords come first, the rest on asking. */
function useClosedFold(): Fold {
  const [open, setOpen] = useState(false)
  return { open, toggle: () => setOpen((was) => !was) }
}
