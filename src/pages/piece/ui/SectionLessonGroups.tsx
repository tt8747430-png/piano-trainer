import { AudioWaveform, ListMusic, MoveRight } from 'lucide-react'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { usePatternName } from '@/entities/pattern'
import type { Piece } from '@/entities/piece'
import type { BarRange } from '@/features/practice'
import { useLocale } from '@/shared/i18n'
import type { Performance } from '@/shared/lib/arrangement'
import { RowGroup, type Paint } from '@/shared/ui'
import type { SectionLessons } from '../model/section-lessons'
import { ChordLessons } from './ChordLessons'
import { LessonRow } from './LessonRow'

/**
 * A section's lessons as its page teaches them (spec §3.2), in the section's paint: its chords, each
 * learned in its sheet; its changes (each chord sequence in time, then one change at a time) and the
 * pattern its chords are played by, each a row into the Player looping it. A song of one section
 * shows them on its own page.
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
  const changesId = useId()
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
      {sequences.length + changes.length > 0 ? (
        <section aria-labelledby={changesId} className="flex flex-col gap-4">
          <h2 id={changesId} className="text-2xl">
            {t('learnSection.changes')}
          </h2>
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
                  detail={sequence.symbols.join(' · ')}
                  icon={ListMusic}
                  paint={paint}
                />
              ))}
            </RowGroup>
          ) : null}
          {changes.length > 0 ? (
            <RowGroup title={t('learnSection.oneChange')} level={3}>
              {changes.map((change) => (
                <LessonRow
                  key={`${change.from} ${change.to}`}
                  pieceId={piece.id}
                  lesson={change}
                  title={t('learnSection.change', { from: change.from, to: change.to })}
                  detail={barsName(change.bars)}
                  icon={MoveRight}
                  paint={paint}
                />
              ))}
            </RowGroup>
          ) : null}
        </section>
      ) : null}
      {patterns.length > 0 ? (
        <RowGroup title={t('learnSection.pattern', { count: patterns.length })}>
          {/* A pattern is named by what it is; where it is looped, by its chord and bar. */}
          {patterns.map((pattern) => (
            <LessonRow
              key={pattern.pattern}
              pieceId={piece.id}
              lesson={pattern}
              title={patternName(pattern.pattern) ?? t('learnSection.pattern', { count: 1 })}
              detail={t('learnSection.patternAt', {
                chord: pattern.symbol,
                bars: barsName(pattern.bars),
              })}
              icon={AudioWaveform}
              paint={paint}
            />
          ))}
        </RowGroup>
      ) : null}
    </>
  )
}
