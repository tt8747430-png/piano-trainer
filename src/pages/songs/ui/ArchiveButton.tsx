import { Link } from '@tanstack/react-router'
import { Archive } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useLibraryLayout } from '@/entities/library'
import { RoundLink } from '@/shared/ui'

/**
 * The archive's way in, in Songs' bar at Home and on a folder's page (Mindscape's header): its icon,
 * named Archive, with a small count while the archive holds anything.
 */
export function ArchiveButton() {
  const { t } = useTranslation('songs')
  const count = useLibraryLayout().archive.length
  const label = count > 0 ? t('archive.openCount', { count }) : t('archive.title')
  return (
    <span className="relative inline-flex">
      <RoundLink label={label} icon={Archive} render={<Link to="/songs/archive" />} />
      {count > 0 ? (
        <span
          aria-hidden
          data-slot="archive-count"
          className="pointer-events-none absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full bg-foreground px-1 text-xs font-semibold text-background tabular-nums"
        >
          {count > 99 ? '99+' : count}
        </span>
      ) : null}
    </span>
  )
}
