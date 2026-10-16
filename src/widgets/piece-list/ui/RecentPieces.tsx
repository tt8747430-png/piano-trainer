import { useId, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useRepertoire } from '@/entities/piece'
import { byLastOpened, selectPractised, useProgress } from '@/entities/progress'
import { EntryRow } from './EntryRow'

/** How many of the pieces opened last the Path lists. */
const RECENT = 3

/**
 * The pieces opened last in the Player, latest first, to go back to; nothing before the first. A
 * piece no longer there (an own song deleted) is passed over.
 */
export function RecentPieces() {
  const { t } = useTranslation('learn')
  const headingId = useId()
  const practised = useProgress(selectPractised)
  const repertoire = useRepertoire()
  const opened = useMemo(() => byLastOpened(practised), [practised])
  const entries = opened
    .flatMap((id) => {
      const entry = repertoire.entry(id)
      return entry ? [entry] : []
    })
    .slice(0, RECENT)
  if (entries.length === 0) return null
  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-3">
      <h2 id={headingId} className="text-2xl">
        {t('recent')}
      </h2>
      <ul className="grid-cards gap-2 *:card">
        {entries.map((entry) => (
          <EntryRow key={entry.id} entry={entry} />
        ))}
      </ul>
    </section>
  )
}
