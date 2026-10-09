import { useTranslation } from 'react-i18next'
import { chordInversions, noteName, placeChord, type Tone } from '@/shared/lib/music'
import { Segmented } from '@/shared/ui'

/**
 * Where the right hand of a chord of five notes or more starts, its root left to the bass (ADR 0035):
 * each start named as the keys name it, its degree and its note (`3 E`, `♭7 B♭`).
 */
export function RightHandFrom({
  tones,
  value,
  onChange,
}: {
  tones: readonly Tone[]
  value: number
  onChange: (inversion: number) => void
}) {
  const { t } = useTranslation('learn')
  return (
    <Segmented
      label={t('builder.handFrom')}
      value={value}
      options={chordInversions(tones).flatMap((inversion) => {
        const [start] = placeChord(tones, { inversion, bothHands: true }).rh
        return start
          ? [{ value: inversion, label: `${start.tone.degree} ${noteName(start.tone.note)}` }]
          : []
      })}
      onChange={onChange}
    />
  )
}
