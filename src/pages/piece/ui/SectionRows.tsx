import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import type { Piece } from '@/entities/piece'
import { GROUPED_LIST, HEADED_SECTION, OpensMark, SectionHead } from '@/shared/ui'
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
}: {
  piece: Pick<Piece, 'id' | 'kind'>
  headings: readonly string[]
  sections: readonly (SectionLessons | null)[]
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
                t('barsFromTo', { first: each.bars.first + 1, last: each.bars.last + 1 }),
              ].join(' · ')
            : null
          return (
            <li key={section}>
              <SectionLink
                piece={piece}
                section={section}
                className="flex min-h-12 items-center gap-3 px-4 transition-colors duration-200 ease-out hover:bg-muted focus-visible:-outline-offset-3"
              >
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
