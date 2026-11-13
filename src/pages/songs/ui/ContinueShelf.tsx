import { useTranslation } from 'react-i18next'
import { useLibrary } from '@/entities/library'
import { entryTitles, PieceLink, useRepertoire } from '@/entities/piece'
import { byLastOpened, selectPractised, useProgress } from '@/entities/progress'
import { useLocale } from '@/shared/i18n'
import { PieceCover } from '@/widgets/piece-cover'

/** How many songs Continue shows: two whole cards across a phone. */
const SHOWN = 2

/** A day as the learner's language says it near today: Today, Yesterday, else its date. */
function useDayWords(): (at: string) => string {
  const { t } = useTranslation('songs')
  const locale = useLocale()
  return (at) => {
    const day = new Date(at)
    const today = new Date()
    const days = Math.round(
      (new Date(today.toDateString()).getTime() - new Date(day.toDateString()).getTime()) /
        86_400_000,
    )
    if (days === 0) return t('continue.today')
    if (days === 1) return t('continue.yesterday')
    return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' }).format(day)
  }
}

/**
 * Songs' Continue (R30 S3, Apple Music's Recently played): the last songs played, as whole cards (each
 * its cover and title, and the day it was played), a tap back into the song. Nothing before the first.
 */
export function ContinueShelf() {
  const { t } = useTranslation('songs')
  const locale = useLocale()
  const repertoire = useRepertoire()
  const practised = useProgress(selectPractised)
  const archived = useLibrary((state) => state.archive)
  const dayOf = useDayWords()
  const gone = new Set(archived.flatMap((entry) => (entry.kind === 'song' ? [entry.id] : [])))
  const recent = byLastOpened(practised)
    .filter((id) => !gone.has(id))
    .flatMap((id) => {
      const entry = repertoire.entry(id)
      return entry && entry.kind !== 'listing' ? [entry] : []
    })
    .slice(0, SHOWN)
  if (recent.length === 0) return null
  return (
    <section aria-labelledby="songs-continue" className="flex flex-col gap-3">
      <h2 id="songs-continue" className="font-sans text-xl font-bold">
        {t('continue.title')}
      </h2>
      <ul className="grid grid-cols-2 gap-3">
        {recent.map((entry) => {
          const at = practised[entry.id]
          return (
            <li key={entry.id}>
              <PieceLink
                entry={entry}
                className="flex h-full flex-col gap-2 card p-3 transition-colors duration-200 hover:bg-muted focus-visible:-outline-offset-3"
              >
                <PieceCover
                  entry={entry}
                  decorative
                  className="aspect-auto h-20 w-full rounded-control text-3xl"
                />
                <span className="line-clamp-2 font-semibold text-balance">
                  {entryTitles(entry, locale).primary}
                </span>
                {at ? <span className="text-sm text-muted-foreground">{dayOf(at)}</span> : null}
              </PieceLink>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
