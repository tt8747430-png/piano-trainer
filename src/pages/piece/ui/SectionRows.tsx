import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import type { Piece } from '@/entities/piece'
import { barNumber } from '@/shared/lib/music'
import { GROUPED_LIST, HEADED_SECTION, OpensMark, ROW_CLASS, SectionHead } from '@/shared/ui'
import type { SectionLessons } from '../model/section-lessons'
import { SectionLink } from './SectionLink'

/**
 * A song's sections in order, in one card as the Song board's SECTS: each a row to its page, its
 * name, then how often its chords go round and its bars ("2× · bars 1–16"), and its chevron.
 */
export function SectionRows({
  piece,
  headings,
  sections,
  pickup,
}: {
  piece: Pick<Piece, 'id' | 'kind'>
  headings: readonly string[]
  sections: readonly (SectionLessons | null)[]
  /** Whether the song opens on a pickup: its bars numbered from the first full one. */
  pickup: boolean
}) {
  const { t } = useTranslation('piece')
  const id = useId()
  return (
    <section aria-labelledby={id} className={HEADED_SECTION}>
      <SectionHead id={id} title={t('learnSong.sections')} />
      <ul className={GROUPED_LIST}>
        {headings.map((heading, section) => {
          const each = sections[section]
          const said = each
            ? [
                ...(each.rounds > 1 ? [t('learnSection.rounds', { n: each.rounds })] : []),
                t('barsFromTo', {
                  first: barNumber(each.bars.first, pickup),
                  last: barNumber(each.bars.last, pickup),
                }),
              ].join(' · ')
            : null
          return (
            <li key={section}>
              <SectionLink piece={piece} section={section} className={ROW_CLASS}>
                <span className="min-w-0 flex-1 truncate">{heading}</span>
                {said ? (
                  <span className="shrink-0 whitespace-nowrap text-muted-foreground tabular-nums">
                    {said}
                  </span>
                ) : null}
                <OpensMark />
              </SectionLink>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
