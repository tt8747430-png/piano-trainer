import { useTranslation } from 'react-i18next'
import {
  circleFunctions,
  keyMode,
  keyScale,
  noteParam,
  sameKey,
  sameNote,
  type Key,
} from '@/shared/lib/music'
import { KeyCircle, type CircleWedge } from '@/shared/ui'
import type { ScaleView } from '../model/scale-view'

/**
 * The Key view's circle of fifths: the key picker in place, a wedge's tap choosing its key at once (a
 * minor key its natural minor, or the minor already shown). The places of the key's seven chords wear
 * the keys' marks, each the chord as the key writes it over its numeral (C, F, G outside and Dm, Em,
 * Am, B° inside for C); where a place is split, the half the key spells (G♭, not F♯, in D♭).
 */
export function CircleOfFifths({
  current,
  kind,
  onChange,
}: {
  current: Key
  /** The scale shown: a key of the same mode keeps it. */
  kind: ScaleView['kind']
  onChange: (change: Partial<ScaleView>) => void
}) {
  const { t } = useTranslation('practice')
  const functions = circleFunctions(current)
  const mark = ({ key, place, ring, part }: CircleWedge) => {
    const chord = functions.find((at) => at.place === place && at.ring === ring)
    // A split place shows the chord on the half the key spells it by (G♭ in D♭), the other plain.
    if (!chord || (part !== 0 && !sameNote(chord.root, key.tonic))) return undefined
    return { symbol: chord.symbol, numeral: chord.numeral }
  }
  return (
    <KeyCircle
      label={t('scales.key.circle')}
      value={current}
      mark={mark}
      onChoose={(key) =>
        sameKey(key, current)
          ? undefined
          : onChange({
              root: noteParam(key.tonic),
              kind: keyMode(kind) === (key.minor ? 'minor' : 'major') ? kind : keyScale(key),
            })
      }
    />
  )
}
