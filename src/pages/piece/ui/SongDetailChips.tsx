import { useTranslation } from 'react-i18next'
import type { PieceId } from '@/entities/piece'
import { StageMark } from '@/entities/step'
import { useSongDetails, useSongLevel } from '../model/use-song-details'

/**
 * A song's details as its page reads them (R30 S5): its level by name and mark, its genre and the
 * language of its words, as chips beside its key, time and tempo; its tags are in its Details.
 */
export function SongDetailChips({ id }: { id: PieceId }) {
  const { t } = useTranslation(['piece', 'common'])
  const details = useSongDetails(id)
  const level = useSongLevel(id)
  if (!level && !details.genre && !details.language) return null
  return (
    <ul aria-label={t('piece:details.label')} className="flex flex-wrap items-center gap-2">
      {level ? (
        <li className="flex h-8 items-center gap-2 rounded-pill border border-border bg-card px-3 text-sm">
          <StageMark stage={level} />
          {t(`common:stage.${level}`)}
        </li>
      ) : null}
      {details.genre ? (
        <li className="flex h-8 items-center rounded-pill border border-border bg-card px-3 text-sm">
          {t(`piece:details.genres.${details.genre}`)}
        </li>
      ) : null}
      {details.language ? (
        <li className="flex h-8 items-center rounded-pill border border-border bg-card px-3 text-sm">
          {t(`piece:details.languages.${details.language}`)}
        </li>
      ) : null}
    </ul>
  )
}
