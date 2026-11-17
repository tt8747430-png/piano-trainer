import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'
import type { LibraryPage } from '../model/use-library-page'
import { useNewActions } from './NewActions'

/** The order (the Songs board's CREATE): the first-made and most wanted last on a laptop's bar, nearest the eye. */
const ORDER = ['import', 'record', 'song'] as const

/**
 * Songs' ways to make a song, always in sight (owner, 2026-11-17: the New ▾ "is not very visible", and a
 * strip of four wide cards "i still dont like"): labelled buttons sized to their words, never stretched.
 * On a laptop they sit in the bar beside the search, New song in honey last (Google Drive's and Flat's
 * New); on a phone one row of pills under the search, New song first. New folder is the folders' own
 * last tile, New group is with the groups.
 */
export function CreateButtons({
  page,
  onImport,
  bar = false,
}: {
  page: LibraryPage
  onImport: () => void
  /** In a laptop's bar, New song last; otherwise a phone's row, New song first. */
  bar?: boolean
}) {
  const { t } = useTranslation('songs')
  const actions = useNewActions({ page, folder: null, onImport })
  const order = bar ? ORDER : [...ORDER].reverse()
  const shown = order.flatMap((key) => actions.filter((action) => action.key === key))
  if (shown.length === 0) return null
  return (
    <div
      role="group"
      aria-label={t('create.label')}
      className={cn(
        'flex items-center gap-2',
        !bar && '-mx-gutter overflow-x-auto px-gutter [scrollbar-width:none]',
      )}
    >
      {shown.map(({ key, label, icon: Icon, onSelect }) => (
        <button
          key={key}
          type="button"
          onClick={onSelect}
          className={cn(
            'flex h-11 shrink-0 items-center gap-2 rounded-pill px-4 text-[0.9375rem] font-semibold whitespace-nowrap transition-colors duration-150 ease-out focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none',
            key === 'song'
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : 'bg-card text-foreground ring-1 ring-border hover:bg-muted',
          )}
        >
          {Icon ? <Icon aria-hidden className="size-4.5" /> : null}
          {label}
        </button>
      ))}
    </div>
  )
}
