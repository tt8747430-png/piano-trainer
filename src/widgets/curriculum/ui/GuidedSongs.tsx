import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import type { Course } from '@/entities/course'
import { pieceById } from '@/entities/piece'
import { EntryRow } from '@/widgets/piece-list'

/**
 * A course's guided songs (the canvas's SONGROWS), as the courses-app ends a course, each to play in
 * the Player: one card of rows on a phone; on a laptop they stand bare on the lessons' four columns,
 * as the lessons do (one kind of list, one shape), each row the link with no chevron.
 */
export function GuidedSongs({ course }: { course: Course }) {
  const { t } = useTranslation('learn')
  const id = useId()
  const songs = course.songs.flatMap((songId) => {
    const piece = pieceById(songId)
    return piece ? [piece] : []
  })
  if (songs.length === 0) return null
  return (
    <section aria-labelledby={id} className="flex flex-col gap-3">
      <h2 id={id} className="font-sans text-xl font-bold">
        {t('course.songs')}
      </h2>
      <ul className="flex flex-col rows-hairline overflow-hidden card lg:grid lg:grid-cols-[repeat(auto-fill,minmax(max(12.5rem,calc((100%-4.5rem)/4)),1fr))] lg:gap-x-6 lg:overflow-visible lg:rounded-none lg:ring-0 lg:bg-transparent lg:[&>li]:after:hidden lg:[&>li>*]:px-0 lg:[&_[data-slot=row-chevron]]:hidden">
        {songs.map((piece) => (
          <EntryRow key={piece.id} entry={piece} />
        ))}
      </ul>
    </section>
  )
}
