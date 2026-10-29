import { ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { DeviceStorage } from '@/shared/api/device-storage'
import { useLocale } from '@/shared/i18n'
import { Button } from '@/shared/ui/primitives/button'
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
    return <p className="text-muted-foreground">{t('storage.reading')}</p>
  return (
    <div className="flex flex-col gap-3">
      {kept.used === null ? null : (
        <p>{t('storage.used', { size: megabytes(kept.used, locale) })}</p>
      )}
      {kept.safe ? (
        <p role="status" className="flex items-center gap-2 font-medium">
          <ShieldCheck aria-hidden className="size-5 shrink-0 text-learned" />
          {t('storage.safe')}
        </p>
      ) : (
        <>
          <Button variant="soft" className="self-start" onClick={() => void keepSafe()}>
            {t('storage.keepSafe')}
          </Button>
          {refused ? (
            <p role="status" className="text-sm text-muted-foreground">
              {t('storage.refused')}
            </p>
          ) : null}
        </>
      )}
    </div>
  )
}
