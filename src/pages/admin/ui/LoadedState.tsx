import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/primitives/button'
import type { Loaded } from '../model/use-loaded'

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
        <p role="alert">
          {loaded.reason === 'offline'
            ? t('offline')
            : loaded.reason === 'refused'
              ? t('refused')
              : t('failed')}
        </p>
        <Button variant="outline" onClick={reload}>
          {t('again')}
        </Button>
      </div>
    )
  return <>{children(loaded.value)}</>
}
