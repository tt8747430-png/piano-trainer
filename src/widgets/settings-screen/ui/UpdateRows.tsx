import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'
import { useAppUpdate } from '@/shared/lib/app-update'
import { ActionRow } from '@/shared/ui'

/**
 * About's Software update (the board's): where the next version stands, a dot beside it (grass when
 * current, honey when one waits, ochre while it works), then the one act there is: Check for
 * updates, or Install and restart when one waits, the banner's same install, so the banner put off
 * with Later is never the only way to it.
 */
export function UpdateRows() {
  const { t } = useTranslation('settings')
  const { status, check, install } = useAppUpdate()
  const busy = status === 'checking' || status === 'downloading' || status === 'installing'
  const waiting = status === 'ready' || status === 'installing'
  return (
    <>
      <p role="status" className="flex min-h-13 items-center gap-2.5 px-4 py-2">
        <span
          aria-hidden
          className={cn(
            'size-2 shrink-0 rounded-pill',
            status === 'ready'
              ? 'bg-primary'
              : busy
                ? 'bg-paint-tile-yellow'
                : status === 'current'
                  ? 'bg-learned'
                  : 'bg-muted-foreground',
          )}
        />
        {t(`about.update.${status}`)}
      </p>
      <ActionRow
        title={t(waiting ? 'about.update.install' : 'about.update.check')}
        disabled={busy}
        onClick={waiting ? install : check}
      />
    </>
  )
}
