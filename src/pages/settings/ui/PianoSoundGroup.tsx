import { CircleCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useLocale } from '@/shared/i18n'
import { ActionRow, SettingsGroup } from '@/shared/ui'
import type { PianoSound } from '../model/use-piano-sound'

/** Bytes as a learner reads them: megabytes to one decimal. */
const megabytes = (bytes: number, locale: string) =>
  new Intl.NumberFormat(locale, {
    style: 'unit',
    unit: 'megabyte',
    maximumFractionDigits: 1,
  }).format(bytes / 1_000_000)

/**
 * Storage and backup's Piano sound (A27): how much of the recorded grand this device keeps, and
 * Download for offline, with its progress, until all of it is kept. Its Remove is in the page's
 * danger group. Where the browser keeps no caches, there is nothing to show.
 */
export function PianoSoundGroup({
  sound,
  onDownload,
}: {
  sound: PianoSound
  onDownload: () => void
}) {
  const { t } = useTranslation('settings')
  const locale = useLocale()
  if (sound.state === 'none') return null
  return (
    <SettingsGroup flush title={t('pianoSound.label')} info={t('pianoSound.info')}>
      {sound.state === 'reading' ? (
        <p className="px-4 py-3 text-muted-foreground">{t('pianoSound.reading')}</p>
      ) : (
        <>
          <p className="px-4 pt-3 pb-1">
            {t('pianoSound.kept', {
              kept: megabytes(sound.kept, locale),
              total: megabytes(sound.total, locale),
            })}
          </p>
          {sound.kept >= sound.total ? (
            <p role="status" className="flex items-center gap-2 px-4 pt-1 pb-3 font-medium">
              <CircleCheck aria-hidden className="size-5 shrink-0 text-learned" />
              {t('pianoSound.ready')}
            </p>
          ) : (
            <>
              <ActionRow
                title={t('pianoSound.download')}
                status={
                  sound.downloading === null
                    ? undefined
                    : t('pianoSound.downloading', {
                        percent: Math.floor(sound.downloading * 100),
                      })
                }
                disabled={sound.downloading !== null}
                onClick={onDownload}
              />
              {sound.failed ? (
                <p role="alert" className="px-4 pt-1 pb-3 text-sm text-muted-foreground">
                  {t('pianoSound.failed')}
                </p>
              ) : null}
            </>
          )}
        </>
      )}
    </SettingsGroup>
  )
}
