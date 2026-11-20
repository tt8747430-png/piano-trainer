import { useTranslation } from 'react-i18next'
import { usePieces, type Entry } from '@/entities/piece'
import { selectIsLearned, selectPractised, selectSongPlay, useProgress } from '@/entities/progress'
import { pieceStepId } from '@/entities/step'
import { useLocale } from '@/shared/i18n'
import { daySaid, useNow } from '@/shared/lib'

/**
 * Where a song stands, in two parts (the R72 board's "Bar 9 of 16" and "Today"): Learned, the bar it
 * stopped at, Learning, or Not started; then when it was last played, or, for a song of the learner's
 * never played, when it was added ("Added 4 Nov"); none for the app's songs never played.
 */
export function useSongStanding(entry: Entry): { status: string; when: string | null } {
  const { t } = useTranslation(['songs', 'common'])
  const locale = useLocale()
  const now = useNow()
  const learned = useProgress(selectIsLearned(pieceStepId(entry.id)))
  const at = useProgress((state) => selectPractised(state)[entry.id])
  const play = useProgress(selectSongPlay(entry.id))
  const added = usePieces((state) => state.songs.find((song) => song.id === entry.id)?.added)
  const stopped = play && play.at > 0 && play.at < play.bars ? play : undefined
  const status = learned
    ? t('common:learned.done')
    : stopped
      ? t('continue.bar', { bar: stopped.at + 1, total: stopped.bars })
      : at
        ? t('row.learning')
        : t('row.notStarted')
  const when = at
    ? daySaid(at, locale, now)
    : added
      ? t('row.added', { when: daySaid(added, locale, now, false) })
      : null
  return { status, when }
}

/** A song's row's third line (the R72 board's "Bar 9 of 16 · Today"): where it stands, then when. */
export function useSongStatus(entry: Entry): string {
  const { status, when } = useSongStanding(entry)
  return when === null ? status : `${status} · ${when}`
}
