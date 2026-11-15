import { CircleCheck } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { selectKeyboard, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setKeyboard } from '@/features/set-preference'
import { useLocale } from '@/shared/i18n'
import { useOnline } from '@/shared/lib'
import { ActionRow, ConfirmDialog, DangerRow, SettingsGroup, VolumeSlider } from '@/shared/ui'
import { usePianoSound } from '../model/use-piano-sound'

/** Bytes as a learner reads them: megabytes to one decimal. */
const megabytes = (bytes: number, locale: string) =>
  new Intl.NumberFormat(locale, {
    style: 'unit',
    unit: 'megabyte',
    maximumFractionDigits: 1,
  }).format(bytes / 1_000_000)

/**
 * On-screen piano's Sound (loop round 24, canvas v203: "the sound settings go to the storage and
 * backup"): the grand, how much of it this device keeps and Download for offline use with its
 * progress until all of it is kept (offline it waits, saying it needs the internet); the piano's
 * Volume; and Remove downloaded piano samples, asked first, once some are kept. Where the browser
 * keeps no caches, the Volume alone.
 */
export function PianoSoundGroup() {
  const { t } = useTranslation(['settings', 'common', 'player'])
  const locale = useLocale()
  const online = useOnline()
  const store = useSettingsStoreApi()
  const keyboard = useSettings(selectKeyboard)
  const piano = usePianoSound()
  const [removing, setRemoving] = useState(false)
  const { sound } = piano
  return (
    <SettingsGroup flush title={t('piano.sound')} info={t('pianoSound.info')}>
      {sound.state === 'reading' ? (
        <p className="px-4 py-3 text-muted-foreground">{t('pianoSound.reading')}</p>
      ) : sound.state === 'known' ? (
        <>
          <p className="flex items-baseline justify-between gap-3 px-4 pt-3 pb-1">
            <span className="font-semibold">{t('player:pianoSheet.grand')}</span>
            <span className="text-sm whitespace-nowrap text-muted-foreground tabular-nums">
              {t('pianoSound.kept', {
                kept: megabytes(sound.kept, locale),
                total: megabytes(sound.total, locale),
              })}
            </span>
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
                  sound.downloading !== null
                    ? t('pianoSound.downloading', {
                        percent: Math.floor(sound.downloading * 100),
                      })
                    : online
                      ? undefined
                      : t('pianoSound.needsInternet')
                }
                // Offline it can only fail: it says what it needs and waits for the network.
                disabled={sound.downloading !== null || !online}
                onClick={() => void piano.download()}
              />
              {sound.failed ? (
                <p role="alert" className="px-4 pt-1 pb-3 text-sm text-muted-foreground">
                  {t('pianoSound.failed')}
                </p>
              ) : null}
            </>
          )}
        </>
      ) : null}
      <div className="px-4 pt-1 pb-3">
        <VolumeSlider
          setting="keyboard.volume"
          label={t('common:keyboardSettings.volume')}
          value={keyboard.volume}
          onChange={(volume) => setKeyboard(store, { volume })}
        />
      </div>
      {sound.state === 'known' && sound.kept > 0 ? (
        <DangerRow title={t('pianoSound.remove')} onClick={() => setRemoving(true)} />
      ) : null}
      <ConfirmDialog
        open={removing}
        onOpenChange={setRemoving}
        title={t('pianoSound.title')}
        body={t('pianoSound.body')}
        action={t('pianoSound.confirm')}
        cancel={t('pianoSound.cancel')}
        onConfirm={() => void piano.remove()}
      />
    </SettingsGroup>
  )
}
