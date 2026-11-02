import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { NetFailure } from '@/shared/api/network'
import { Button } from '@/shared/ui/primitives/button'
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
  if (loaded.kind === 'loading')
    return (
      <p role="status" className="text-muted-foreground">
        {t('loading')}
      </p>
    )
  if (loaded.kind === 'failed')
    return (
      <div className="flex flex-col items-start gap-3">
        <FailureLine reason={loaded.reason} />
        <Button variant="outline" onClick={reload}>
          {t('again')}
        </Button>
      </div>
    )
  return <>{children(loaded.value)}</>
}
