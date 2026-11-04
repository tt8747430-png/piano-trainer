import { useTranslation } from 'react-i18next'
import { ChoiceCard } from '@/shared/ui'
import { PLAYED_CLEFS, type PlayedClef } from '@/widgets/player-setup'

type ClefValue = 'written' | PlayedClef

/**
 * Display's Clef (R29 B7): a single-staff song read in the treble or the bass clef, or as written;
 * kept for the song alone, with its other choices in the Player's URL.
 */
export function ClefChoice({
  value,
  onChange,
}: {
  value: PlayedClef | null
  onChange: (clef: PlayedClef | undefined) => void
}) {
  const { t } = useTranslation('player')
  return (
    <ChoiceCard<ClefValue>
      title={t('clef.label')}
      info={t('clef.info')}
      value={value ?? 'written'}
      options={(['written', ...PLAYED_CLEFS] as const).map((each) => ({
        value: each,
        label: t(`clef.${each}`),
        example: t(`clef.examples.${each}`),
      }))}
      onChange={(next) => onChange(next === 'written' ? undefined : next)}
    />
  )
}
