import { CloudOff, Globe, TriangleAlert } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { SongsHome } from '../model/explore-view'
import type { NetFailure } from '@/shared/api/network'
import { useSetSearch } from '@/shared/lib'
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
      primary={!offline}
      action={
        offline ? (
          <Button variant="soft" onClick={() => show({ view: 'mine' })}>
            {t('explore.views.mine')}
          </Button>
        ) : (
          <Button onClick={onRetry}>{t('explore.again')}</Button>
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

/** The feed's cards, grey, while Explore is asked (R72's skeleton): said once, to a screen reader. */
export function CardsLoading({ count }: { count: number }) {
  const { t } = useTranslation('songs')
  return (
    <div aria-busy>
      <p role="status" className="sr-only">
        {t('explore.loading')}
      </p>
      <ul
        aria-hidden
        className="grid items-start gap-3 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(17rem,1fr))] lg:gap-5"
      >
        {Array.from({ length: count }, (_, i) => (
          <li key={i} className="card flex flex-col overflow-hidden">
            <span className="aspect-[16/9] bg-muted motion-safe:animate-pulse max-lg:hidden" />
            <span className="flex flex-col gap-2 p-3">
              <span className="h-4 w-3/4 rounded-pill bg-muted motion-safe:animate-pulse" />
              <span className="h-3.5 w-1/2 rounded-pill bg-muted motion-safe:animate-pulse" />
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
