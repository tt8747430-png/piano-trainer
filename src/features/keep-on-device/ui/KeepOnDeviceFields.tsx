import { ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { DeviceStorage } from '@/shared/api/device-storage'
import { useLocale } from '@/shared/i18n'
import { ActionRow } from '@/shared/ui'
import { useDeviceStorage } from '../model/use-device-storage'

/** Bytes as a learner reads them: a megabyte to one decimal, at least 0.1. */
const megabytes = (bytes: number, locale: string) =>
  new Intl.NumberFormat(locale, {
    style: 'unit',
    unit: 'megabyte',
    maximumFractionDigits: 1,
  }).format(Math.max(0.1, bytes / 1_000_000))

/**
 * What this device keeps of the app (its songs, progress and the offline copy): how much, and whether
 * the browser keeps it safe; Keep them safe asks it to, so a phone short of space does not clear them.
 */
export function KeepOnDeviceFields({ storage }: { storage?: DeviceStorage }) {
  const { t } = useTranslation('settings')
  const locale = useLocale()
  const { kept, refused, keepSafe } = useDeviceStorage(storage)
  if (kept.state === 'unknown')
    return <p className="px-4 py-3 text-muted-foreground">{t('storage.reading')}</p>
  return (
    <>
      {kept.used === null ? null : (
        <p className="px-4 pt-3 pb-1">
          {t('storage.used', { size: megabytes(kept.used, locale) })}
        </p>
      )}
      {kept.safe ? (
        <p role="status" className="flex items-center gap-2 px-4 pt-1 pb-3 font-medium">
          <ShieldCheck aria-hidden className="size-5 shrink-0 text-learned" />
          {t('storage.safe')}
        </p>
      ) : (
        <>
          <ActionRow title={t('storage.keepSafe')} onClick={() => void keepSafe()} />
          {refused ? (
            <p role="status" className="px-4 pb-3 text-sm text-muted-foreground">
              {t('storage.refused')}
            </p>
          ) : null}
        </>
      )}
    </>
  )
}
