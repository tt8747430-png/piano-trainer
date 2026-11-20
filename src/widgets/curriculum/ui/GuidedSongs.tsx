import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import type { Course } from '@/entities/course'
import { PieceLink, pieceById, type Entry } from '@/entities/piece'
import { RowLink } from '@/shared/ui'
import { PieceMark } from '@/widgets/piece-cover'
import { useEntryFace } from '@/widgets/piece-list'

/**
 * A guided song's row (the canvas's SONGROWS): its first notes as its cover, 40 on a phone and 44 on
 * a laptop, its title over its composer and key, 76 tall with 8 above and below.
 */
function GuidedSong({ entry }: { entry: Entry }) {
  const { face } = useEntryFace(entry)
  return (
    <li>
      <RowLink {...face} mark={<PieceMark entry={entry} />} render={<PieceLink entry={entry} />} />
    </li>
  )
}

/**
 * A course's guided songs, as the courses-app ends a course, each to play in the Player: one card of
 * rows on a phone; on a laptop they stand bare on the lessons' four columns, 24 apart, as the lessons
 * do (one kind of list, one shape), each row the link with no chevron.
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
      <h2 id={id} className="font-sans text-xl leading-[normal] font-bold">
        {t('course.songs')}
      </h2>
      <ul className="flex flex-col rows-hairline overflow-hidden card lg:grid lg:grid-cols-[repeat(auto-fill,minmax(max(12.5rem,calc((100%-4.5rem)/4)),1fr))] lg:gap-x-6 lg:overflow-visible lg:rounded-none lg:ring-0 lg:bg-transparent lg:[&>li]:after:hidden lg:[&_[data-slot=row-chevron]]:hidden [&_a]:min-h-19 [&_a]:py-2 [&_a]:pl-3 lg:[&_a]:px-0 [&_[data-slot=row-tile]]:size-10 lg:[&_[data-slot=row-tile]]:size-11">
        {songs.map((piece) => (
          <GuidedSong key={piece.id} entry={piece} />
        ))}
      </ul>
    </section>
  )
}
