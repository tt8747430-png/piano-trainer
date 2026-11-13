import { CloudOff, Globe, TriangleAlert } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { SongsHome } from '../model/explore-view'
import type { NetFailure } from '@/shared/api/network'
import { cn, useSetSearch } from '@/shared/lib'
import { Said } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'

/** Why Explore shows nothing: offline (it works online alone; My songs are all here) or failed (Try again). */
export function ExploreFailed({ reason, onRetry }: { reason: NetFailure; onRetry: () => void }) {
  const { t } = useTranslation('songs')
  const show = useSetSearch<SongsHome>()
  const offline = reason === 'offline'
  // Offline, trying again cannot help: the learner's own songs are all here (R30 S7).
  return (
    <Said
      icon={offline ? CloudOff : TriangleAlert}
      title={offline ? t('explore.offline') : t('explore.failed')}
      description={offline ? t('explore.offlineLine') : t('explore.failedLine')}
      action={
        offline ? (
          <Button variant="soft" onClick={() => show({ view: 'mine' })}>
            {t('explore.views.mine')}
          </Button>
        ) : (
          <Button onClick={onRetry}>
            {t('explore.again')}
          </Button>
        )
      }
    />
  )
}

/** Nothing published yet: said, and how to publish the first (an empty state that teaches). */
export function ExploreEmpty() {
  const { t } = useTranslation('songs')
  return (
    <Said
      icon={Globe}
      title={t('explore.empty')}
      description={t('explore.emptyHint')}
      action={null}
    />
  )
}

/** The cards' places, grey, while Explore is asked: said once, to a screen reader. */
export function CardsLoading({ count, row = false }: { count: number; row?: boolean }) {
  const { t } = useTranslation('songs')
  return (
    <div aria-busy>
      <p role="status" className="sr-only">
        {t('explore.loading')}
      </p>
      <ul
        aria-hidden
        className={cn(
          row
            ? '-mx-gutter flex gap-2 overflow-hidden px-gutter lg:mx-0 lg:grid lg:grid-cols-5 lg:px-0'
            : 'grid grid-cols-[repeat(auto-fill,minmax(var(--card-min-tile),1fr))] gap-2',
        )}
      >
        {Array.from({ length: count }, (_, i) => (
          <li
            key={i}
            className={cn('card flex flex-col gap-2 p-2.5', row && 'w-44 shrink-0 lg:w-auto')}
          >
            <span className="h-16 rounded-control bg-muted motion-safe:animate-pulse" />
            <span className="h-5 w-3/4 rounded-pill bg-muted motion-safe:animate-pulse" />
            <span className="h-3 w-1/2 rounded-pill bg-muted motion-safe:animate-pulse" />
            <span className="h-3 w-1/3 rounded-pill bg-muted motion-safe:animate-pulse" />
          </li>
        ))}
      </ul>
    </div>
  )
}
