import { Music } from 'lucide-react'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import type { Piece } from '@/entities/piece'
import { selectLessons, useProgress } from '@/entities/progress'
import { RowLink } from '@/shared/ui'
import { lessonKeys, type SectionLessons } from '../model/section-lessons'
import { sectionPaint } from '../model/section-paint'
import { progressOf } from '../model/song-progress'
import { SectionLink } from './SectionLink'

/**
 * A song's sections in order, in one card (spec §3.1): each a row to its page, its tile in its paint
 * with a note, its name, and its lessons done of all.
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
  const lessons = useProgress(selectLessons)
  return (
    <section aria-labelledby={id} className="flex flex-col gap-3">
      <h2 id={id} className="text-2xl">
        {t('learnSong.sections')}
      </h2>
      <ul className="flex flex-col gap-1 card p-2">
        {headings.map((heading, section) => {
          const each = sections[section]
          const { done, total } = progressOf(each ? lessonKeys(each) : [], lessons)
          return (
            <li key={section}>
              <RowLink
                title={heading}
                detail={
                  total === 0
                    ? t('learnSong.noLessons')
                    : t('learnSong.lessonsDone', {
                        lessons: t('learnSong.lessons', { count: total }),
                        done,
                      })
                }
                icon={Music}
                paint={sectionPaint(heading)}
                render={<SectionLink piece={piece} section={section} />}
              />
            </li>
          )
        })}
      </ul>
    </section>
  )
}
