import { CloudOff, ShieldX, TriangleAlert } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { NetFailure } from '@/shared/api/network'
import { Button } from '@/shared/ui/primitives/button'
import { RowsLoading, Said } from '@/shared/ui'
import type { Loaded } from '../model/use-loaded'

/** Why a call came back without its answer, in words: offline, turned down, or failed. */
export function FailureLine({ reason }: { reason: NetFailure }) {
  const { t } = useTranslation('admin')
  return (
    <p role="alert">
      {t(reason === 'offline' ? 'offline' : reason === 'refused' ? 'refused' : 'failed')}
    </p>
  )
}

/** Why a tab came back empty, by the call's failure: its mark, its title and its line. */
const FAILED = {
  offline: { icon: CloudOff, title: 'offlineTitle', line: 'offlineLine' },
  refused: { icon: ShieldX, title: 'refusedTitle', line: 'refusedLine' },
  failed: { icon: TriangleAlert, title: 'failedTitle', line: 'failedLine' },
} as const satisfies Record<NetFailure, unknown>

/** A tab's answer: loading, why it failed with Try again, or what it holds. */
export function LoadedState<T>({
  loaded,
  reload,
  children,
}: {
  loaded: Loaded<T>
  reload: () => void
  children: (value: T) => ReactNode
}) {
  const { t } = useTranslation('admin')
  if (loaded.kind === 'loading') return <RowsLoading label={t('loading')} />
  if (loaded.kind === 'failed')
    return (
      <Said
        icon={FAILED[loaded.reason].icon}
        title={t(FAILED[loaded.reason].title)}
        description={t(FAILED[loaded.reason].line)}
        primary
        action={<Button onClick={reload}>{t('again')}</Button>}
      />
    )
  return <>{children(loaded.value)}</>
}
