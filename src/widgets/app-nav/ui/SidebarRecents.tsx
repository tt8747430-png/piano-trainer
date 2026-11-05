import { Music } from 'lucide-react'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { entryTitles, PieceLink, useRepertoire } from '@/entities/piece'
import { byLastOpened, selectPractised, useProgress } from '@/entities/progress'
import { useLocale } from '@/shared/i18n'

/** How many songs the sidebar's Recents lists (Claude's: the latest few, one line each). */
const RECENTS = 5

/**
 * Recents (R32, Claude's sidebar): the songs the learner opened last, a line each, ellipsised, each
 * opening where it was left; nothing while none has been opened.
 */
export function SidebarRecents() {
  const { t } = useTranslation('common')
  const locale = useLocale()
  const practised = useProgress(selectPractised)
  const repertoire = useRepertoire()
  const id = useId()
  const recent = byLastOpened(practised)
    .flatMap((pieceId) => {
      const entry = repertoire.entry(pieceId)
      return entry ? [entry] : []
    })
    .slice(0, RECENTS)
  if (recent.length === 0) return null
  return (
    <section aria-labelledby={id} className="flex min-h-0 flex-col gap-0.5 overflow-y-auto pt-4">
      <h2 id={id} className="px-3 pb-1 font-sans text-sm font-semibold text-muted-foreground">
        {t('nav.recents')}
      </h2>
      <ul className="flex flex-col gap-0.5">
        {recent.map((entry) => (
          <li key={entry.id}>
            <PieceLink
              entry={entry}
              className="flex h-10 items-center gap-3 rounded-control px-3 text-foreground transition-colors duration-200 ease-out hover:bg-muted focus-visible:-outline-offset-3"
            >
              <Music aria-hidden className="size-4 shrink-0 text-muted-foreground" />
              <span className="min-w-0 truncate">{entryTitles(entry, locale).primary}</span>
            </PieceLink>
          </li>
        ))}
      </ul>
    </section>
  )
}
