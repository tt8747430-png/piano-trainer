import { Link } from '@tanstack/react-router'
import { Archive } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useLibraryLayout } from '@/entities/library'
import { ButtonLink } from '@/shared/ui'

/**
 * The archive's way in, in Songs' bar at Home (Mindscape's header; canvas 133): the archive's icon,
 * opening the Archive, with a small count of what is archived on the icon. The Trash is Songs' ···,
 * apart (owner, IMG_6045–6056: "what the trash does in the archive").
 */
export function ArchiveButton() {
  const { t } = useTranslation('songs')
  const count = useLibraryLayout().archive.length
  const label = t('archive.title')
  return (
    <span className="relative inline-flex">
      <ButtonLink
        variant="bar"
        size="icon"
        aria-label={label}
        title={label}
        render={<Link to="/songs/archive" />}
      >
        <Archive aria-hidden />
      </ButtonLink>
      {count > 0 ? (
        <span
          aria-hidden
          data-slot="archive-count"
          className="pointer-events-none absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-pill bg-foreground px-1 text-xs font-semibold text-background tabular-nums"
        >
          {count > 99 ? '99+' : count}
        </span>
      ) : null}
    </span>
  )
}
