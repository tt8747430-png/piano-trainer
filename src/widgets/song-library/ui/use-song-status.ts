import { useTranslation } from 'react-i18next'
import type { Entry } from '@/entities/piece'
import { selectIsLearned, selectPractised, selectSongPlay, useProgress } from '@/entities/progress'
import { pieceStepId } from '@/entities/step'
import { useLocale } from '@/shared/i18n'

/** A day, in milliseconds: how far back "Today", "Yesterday" and "3 days ago" reach. */
const DAY = 86_400_000

/**
 * When a song was last played, as the R72 board says it: within a week the day said in words
 * ("Today", "3 days ago"), then the date ("9 Nov"). Its first letter a capital, as it may open a line.
 */
function playedWhen(at: string, locale: string, now: number): string {
  const then = new Date(at)
  const days = Math.round(
    (new Date(now).setHours(0, 0, 0, 0) - new Date(then).setHours(0, 0, 0, 0)) / DAY,
  )
  const said =
    days < 7
      ? new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(-days, 'day')
      : new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' }).format(then)
  return said.charAt(0).toLocaleUpperCase(locale) + said.slice(1)
}

/**
 * A song's row's third line (the R72 board's "Bar 9 of 16 · Today"): where it stands (Learned, the bar
 * it stopped at, Learning, or Not started), then when it was last played, where it has been.
 */
export function useSongStatus(entry: Entry): string {
  const { t } = useTranslation(['songs', 'common'])
  const locale = useLocale()
  const learned = useProgress(selectIsLearned(pieceStepId(entry.id)))
  const at = useProgress((state) => selectPractised(state)[entry.id])
  const play = useProgress(selectSongPlay(entry.id))
  const stopped = play && play.at > 0 && play.at < play.bars ? play : undefined
  const status = learned
    ? t('common:learned.done')
    : stopped
      ? t('continue.bar', { bar: stopped.at + 1, total: stopped.bars })
      : at
        ? t('table.learning')
        : t('row.notStarted')
  return at ? `${status} · ${playedWhen(at, locale, Date.now())}` : status
}
