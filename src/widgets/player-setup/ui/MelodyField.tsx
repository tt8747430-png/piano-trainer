import { MicVocal, Music, VolumeX } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { MELODY_SOURCES, useSettingsStoreApi, type MelodySource } from '@/entities/settings'
import { setMelody } from '@/features/set-preference'
import { Labelled, Segmented } from '@/shared/ui'
import type { Melody } from '../model/melody'

const ICONS = { none: VolumeX, staff: Music, recording: MicVocal } as const

/**
 * The Setup's Melody (ADR 0115): what plays the song's tune along with the hands, one of None, the
 * song's top staff by its name, and its Recording, saved for every song. One the song has not is
 * greyed, why its tooltip; where the music comes from, its ⓘ.
 */
export function MelodyField({
  melody,
  staff,
  ownKey,
}: {
  melody: Melody
  /** The top single staff's name, as its chip in the View names it. */
  staff: string
  /** The song's own key, named: where its recording plays. */
  ownKey: string
}) {
  const { t } = useTranslation('player')
  const store = useSettingsStoreApi()
  const why = (source: MelodySource) => {
    const greyed = melody.greyed[source]
    return greyed === undefined ? undefined : t(`melody.why.${greyed}`, { key: ownKey })
  }
  return (
    <Labelled label={t('melody.label')} info={t('melody.about', { staff })}>
      <Segmented
        label={t('melody.label')}
        value={melody.shown}
        options={MELODY_SOURCES.map((source) => {
          const Icon = ICONS[source]
          return {
            value: source,
            label: source === 'staff' ? staff : t(`melody.${source}`),
            icon: <Icon aria-hidden className="size-5" />,
            reason: why(source),
          }
        })}
        onChange={(source) => setMelody(store, source)}
      />
    </Labelled>
  )
}
