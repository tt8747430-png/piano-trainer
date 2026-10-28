import { useTranslation } from 'react-i18next'
import {
  noteName,
  printedSymbol,
  VOICINGS,
  voicingBar,
  type PlacedChord,
  type PlacedTone,
  type Tone,
  type Voicing,
} from '@/shared/lib/music'
import { Labelled, StepStrip } from '@/shared/ui'

/** A hand's keys as printed names, lowest first. */
const named = (keys: readonly PlacedTone[]) =>
  keys.map((key) => printedSymbol(noteName(key.tone.note))).join(' ')

/**
 * How the chord is laid on the keys: a strip of the eight voicings, one the chord cannot take greyed
 * with why. Its ⓘ says in plain words what the chosen voicing is, with its spelling in C, and the
 * keys it lays this chord on, the left hand's before the bar.
 */
export function VoicingField({
  tones,
  placed,
  value,
  onChange,
}: {
  tones: readonly Tone[]
  placed: PlacedChord
  value: Voicing
  onChange: (voicing: Voicing) => void
}) {
  const { t } = useTranslation('practice')
  const label = t('chords.voicing.label')
  const notes = [named(placed.lh), named(placed.rh)].filter(Boolean).join(' | ')
  return (
    <Labelled
      label={label}
      info={
        <>
          <span className="block font-semibold">{t(`chords.voicing.names.${value}`)}</span>
          <span className="block">{t(`chords.voicing.about.${value}`)}</span>
          <span className="mt-2 block">{t('chords.voicing.here', { notes })}</span>
        </>
      }
    >
      <StepStrip
        label={label}
        value={value}
        options={VOICINGS.map((voicing) => {
          const bar = voicingBar(tones, voicing)
          return {
            value: voicing,
            label: t(`chords.voicing.names.${voicing}`),
            reason: bar ? t(`chords.voicing.bar.${bar}`, { count: tones.length }) : undefined,
          }
        })}
        onChange={onChange}
      />
    </Labelled>
  )
}
