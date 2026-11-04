import { useTranslation } from 'react-i18next'
import { chordInversions, placeChord, type Tone, printedNote } from '@/shared/lib/music'
import { Segmented } from '@/shared/ui'

/**
 * The note on top of a chord shared between the hands (R29-P3): what a pianist decides, the melody
 * note a voicing is named by in the voicing books and when harmonising a tune. Each choice is the
 * right hand's top note and its degree ("D · 9"); choosing it lays the right hand so that note is on
 * top (the same inversion of the right hand the URL keeps, ADR 0046).
 */
export function TopNote({
  tones,
  value,
  onChange,
}: {
  tones: readonly Tone[]
  value: number
  onChange: (inversion: number) => void
}) {
  const { t } = useTranslation('practice')
  return (
    <Segmented
      label={t('chords.builder.topNote')}
      value={value}
      options={chordInversions(tones).flatMap((inversion) => {
        const top = placeChord(tones, { inversion, bothHands: true }).rh.at(-1)
        return top
          ? [
              {
                value: inversion,
                label: `${printedNote(top.tone.note)} · ${top.tone.degree}`,
              },
            ]
          : []
      })}
      onChange={onChange}
    />
  )
}
