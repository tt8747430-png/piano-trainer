import { useNavigate } from '@tanstack/react-router'
import { Archive, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useLibraryLayout } from '@/entities/library'
import { ActionMenu } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'

/**
 * The archive's and the Trash's way in, in Songs' bar at Home (Mindscape's header): the archive's
 * icon, a menu of Archive · Trash (R34), each counted while it holds anything, with a small count of
 * both on the icon.
 */
export function ArchiveButton() {
  const { t } = useTranslation('songs')
  const navigate = useNavigate()
  const { archive, trash } = useLibraryLayout()
  const count = archive.length + trash.length
  const label = t('stored')
  return (
    <span className="relative inline-flex">
      <ActionMenu
        label={label}
        align="end"
        trigger={<Archive aria-hidden />}
        render={<Button variant="bar" size="icon" aria-label={label} title={label} />}
        actions={[
          {
            key: 'archive',
            label:
              archive.length > 0
                ? t('archive.openCount', { count: archive.length })
                : t('archive.title'),
            icon: Archive,
            onSelect: () => void navigate({ to: '/songs/archive' }),
          },
          {
            key: 'trash',
            label:
              trash.length > 0 ? t('trash.openCount', { count: trash.length }) : t('trash.title'),
            icon: Trash2,
            onSelect: () => void navigate({ to: '/songs/trash' }),
          },
        ]}
      />
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
