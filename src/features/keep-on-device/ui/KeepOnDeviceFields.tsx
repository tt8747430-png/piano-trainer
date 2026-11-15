import { useTranslation } from 'react-i18next'
import type { DeviceStorage } from '@/shared/api/device-storage'
import { useLocale } from '@/shared/i18n'
import { SettingsGroup, SwitchRow } from '@/shared/ui'
import { useDeviceStorage } from '../model/use-device-storage'

/** Bytes as a learner reads them: a megabyte to one decimal, at least 0.1 where anything is kept. */
const megabytes = (bytes: number, locale: string) =>
  new Intl.NumberFormat(locale, {
    style: 'unit',
    unit: 'megabyte',
    maximumFractionDigits: 1,
  }).format(bytes === 0 ? 0 : Math.max(0.1, bytes / 1_000_000))

/**
 * What this device keeps of the app (the board's Device storage): how much, in bold over a bar parted
 * into the learner's songs and takes and the piano's samples (`piano`, bytes) with its legend; then
 * Protect from clearing, a switch that asks the browser to keep it all (once granted it stays on: a
 * browser keeps no way to take it back), and under the card what the browser said. The page's Device storage group, whole.
 */
export function KeepOnDeviceFields({
  storage,
  piano = 0,
}: {
  storage?: DeviceStorage
  piano?: number
}) {
  const { t } = useTranslation('settings')
  const locale = useLocale()
  const { kept, refused, keepSafe } = useDeviceStorage(storage)
  if (kept.state === 'unknown')
    return (
      <SettingsGroup flush title={t('storage.label')} info={t('storage.info')}>
        <p className="px-4 py-3 text-muted-foreground">{t('storage.reading')}</p>
      </SettingsGroup>
    )
  const used = kept.used ?? 0
  const pianoPart = Math.min(piano, used)
  const songs = used - pianoPart
  const share = (bytes: number) => `${used > 0 ? (bytes / used) * 100 : 0}%`
  return (
    <SettingsGroup
      flush
      title={t('storage.label')}
      info={t('storage.info')}
      footnote={kept.safe ? t('storage.safe') : refused ? t('storage.refused') : undefined}
    >
      {kept.used === null ? null : (
        <div className="flex flex-col gap-2 px-4 py-3.5">
          <p className="font-semibold tabular-nums">
            {t('storage.used', { size: megabytes(used, locale) })}
          </p>
          <span aria-hidden className="flex h-1.5 overflow-hidden rounded-pill bg-muted">
            <span className="h-full bg-paint-tile-sky" style={{ width: share(songs) }} />
            <span className="h-full bg-learned" style={{ width: share(pianoPart) }} />
          </span>
          <p className="flex flex-wrap gap-x-4 gap-y-1 text-[0.8125rem] text-muted-foreground tabular-nums">
            <span className="flex items-center gap-1.5">
              <span aria-hidden className="size-2 rounded-pill bg-paint-tile-sky" />
              {t('storage.songs', { size: megabytes(songs, locale) })}
            </span>
            <span className="flex items-center gap-1.5">
              <span aria-hidden className="size-2 rounded-pill bg-learned" />
              {t('storage.piano', { size: megabytes(pianoPart, locale) })}
            </span>
          </p>
        </div>
      )}
      <SwitchRow
        label={t('storage.keepSafe')}
        checked={kept.safe}
        disabled={kept.safe}
        reason={t('storage.safe')}
        onCheckedChange={(on) => {
          if (on) void keepSafe()
        }}
      />
    </SettingsGroup>
  )
}
