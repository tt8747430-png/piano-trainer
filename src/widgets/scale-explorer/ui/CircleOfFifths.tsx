import { useTranslation } from 'react-i18next'
import { circleFunctions, sameNote, type Key } from '@/shared/lib/music'
import { KeyCircle, type CircleWedge } from './KeyCircle'

/**
 * The Key view's circle of fifths, a picture (R29-P7): the key lit, its relative and neighbours
 * beside it. The places of the key's seven chords wear
 * the keys' marks, each the chord as the key writes it over its numeral (C, F, G outside and Dm, Em,
 * Am, B° inside for C); where a place is split, the half the key spells (G♭, not F♯, in D♭).
 */
export function CircleOfFifths({ current }: { current: Key }) {
  const { t } = useTranslation('practice')
  const functions = circleFunctions(current)
  const mark = ({ key, place, ring, part }: CircleWedge) => {
    const chord = functions.find((at) => at.place === place && at.ring === ring)
    // A split place shows the chord on the half the key spells it by (G♭ in D♭), the other plain.
    if (!chord || (part !== 0 && !sameNote(chord.root, key.tonic))) return undefined
    return { symbol: chord.symbol, numeral: chord.numeral }
  }
  return (
    <KeyCircle label={t('scales.key.circle')} value={current} mark={mark} />
  )
}
