import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import type { Course } from '@/entities/course'
import { pieceById } from '@/entities/piece'
import { EntryRow } from '@/widgets/piece-list'

/** A course's guided songs, as the courses-app ends a course: each to play in the Player. */
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
      <div className="flex flex-col gap-1">
        <h2 id={id} className="text-3xl">
          {t('course.songs')}
        </h2>
        <p className="text-muted-foreground text-pretty">{t('course.songsAbout')}</p>
      </div>
      <ul className="grid gap-1 card p-2 lg:grid-cols-2">
        {songs.map((piece) => (
          <EntryRow key={piece.id} entry={piece} />
        ))}
      </ul>
    </section>
  )
}
