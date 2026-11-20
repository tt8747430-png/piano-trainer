import { CloudOff, Globe, TriangleAlert } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { SongsHome } from '../model/explore-view'
import type { NetFailure } from '@/shared/api/network'
import { useSetSearch } from '@/shared/lib'
import { Said } from '@/shared/ui'
import { EXPLORE_COLUMNS } from '@/widgets/song-preview'
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

/**
 * Explore's list while it is asked, in the loaded list's shape (the Explore boards' Loading): on a phone the one
 * card of rows (the 56 tile, the title and its line, the hairline from the title's edge), on a laptop the table's
 * head and its 60 rows; said once, to a screen reader.
 */
export function ExploreLoading({ head, rows }: { head?: ReactNode; rows: number }) {
  const { t } = useTranslation('songs')
  const bar = 'rounded-pill bg-muted'
  return (
    <div aria-busy className="motion-safe:animate-pulse">
      <p role="status" className="sr-only">
        {t('explore.loading')}
      </p>
      {head ? (
        <div aria-hidden className="border-t border-border">
          {head}
          {Array.from({ length: rows }, (_, i) => (
            <div key={i} className={`${EXPLORE_COLUMNS} h-15 border-b border-border`}>
              <span className="flex items-center gap-4">
                <span className="size-10 shrink-0 rounded-[0.5625rem] bg-muted" />
                <span className={`h-3.5 w-1/2 ${bar}`} />
              </span>
              <span className={`h-3.5 w-3/5 ${bar}`} />
              <span className="h-7 w-22 rounded-lg bg-muted" />
              <span className={`h-3.5 w-3/5 ${bar}`} />
              <span className={`h-3.5 w-9 ${bar}`} />
              <span />
            </div>
          ))}
        </div>
      ) : (
        <ul
          aria-hidden
          className="card flex flex-col overflow-hidden [&>li+li]:relative [&>li+li]:before:absolute [&>li+li]:before:top-0 [&>li+li]:before:right-0 [&>li+li]:before:left-21 [&>li+li]:before:h-px [&>li+li]:before:bg-border [&>li+li]:before:content-['']"
        >
          {Array.from({ length: rows }, (_, i) => (
            <li key={i} className="flex h-22 items-center gap-4 py-3 ps-3 pe-1">
              <span className="size-14 shrink-0 rounded-xl bg-muted" />
              <span className="flex flex-1 flex-col gap-2">
                <span className={`h-4 w-3/5 ${bar}`} />
                <span className={`h-3.5 w-2/5 ${bar}`} />
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
