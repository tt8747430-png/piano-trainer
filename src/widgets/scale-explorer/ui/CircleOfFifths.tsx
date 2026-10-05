import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useKeyName } from '@/shared/i18n'
import { cn, IN_PLACE } from '@/shared/lib'
import {
  CIRCLE_OF_FIFTHS,
  circleFunctions,
  keyMode,
  keyScale,
  keySymbol,
  noteParam,
  sameKey,
  type CircleRing,
  type Key,
} from '@/shared/lib/music'
import { cellCentre, signatureCount, wedgePath } from '../model/circle-layout'

const RINGS: readonly CircleRing[] = ['major', 'minor']
/** A wedge's fill: the key's own place in the tonic's wash, its other chords' in the scale's, the rest plain. */
const WEDGE = {
  tonic: 'fill-key-tonic',
  chord: 'fill-key-scale',
  plain: 'fill-card',
} as const

/**
 * The circle of fifths as the Key view's chooser: every key a link to its scale (a minor key its
 * natural minor, or the minor already shown), its signature's count under its name; the key shown
 * and the places of its seven chords wear the keys' marks and carry their numerals (I IV V outside
 * and ii iii vi vii° inside for C).
 */
export function CircleOfFifths({ current }: { current: Key }) {
  const { t } = useTranslation('learn')
  const functions = circleFunctions(current)
  const numeral = (place: number, ring: CircleRing) =>
    functions.find((at) => at.place === place && at.ring === ring)?.numeral
  const name = useKeyName()
  return (
    <nav aria-label={t('keys.circle')} className="relative mx-auto aspect-square w-full max-w-sm">
      <svg viewBox="0 0 100 100" aria-hidden className="absolute inset-0 size-full">
        {CIRCLE_OF_FIFTHS.flatMap((place, i) =>
          RINGS.map((ring) => (
            <path
              key={`${ring} ${i}`}
              d={wedgePath(i, ring)}
              strokeWidth={0.3}
              className={cn(
                'stroke-border',
                WEDGE[
                  sameKey(place[ring], current) ? 'tonic' : numeral(i, ring) ? 'chord' : 'plain'
                ],
              )}
            />
          )),
        )}
      </svg>
      <p
        aria-hidden
        className="absolute inset-0 grid place-content-center font-display text-lg font-semibold"
      >
        {name(current)}
      </p>
      <ul>
        {CIRCLE_OF_FIFTHS.flatMap((place, i) =>
          RINGS.map((ring) => {
            const key = place[ring]
            const { x, y } = cellCentre(i, ring)
            const mark = numeral(i, ring)
            return (
              <li
                key={`${ring} ${i}`}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                <Link
                  from="/practice/scales"
                  to="/practice/scales"
                  search={(prev) => ({
                    ...prev,
                    root: noteParam(key.tonic),
                    kind:
                      keyMode(prev.kind) === (key.minor ? 'minor' : 'major')
                        ? prev.kind
                        : keyScale(key),
                  })}
                  {...IN_PLACE}
                  // Only the key shown is where the learner is: C's link names no param the URL lacks.
                  activeOptions={{ exact: true }}
                  aria-label={name(key)}
                  aria-current={sameKey(key, current) ? 'page' : undefined}
                  className={cn(
                    'grid size-11 place-content-center gap-0.5 rounded-full text-center leading-none transition-colors duration-200 ease-out hover:bg-muted aria-[current=page]:bg-card aria-[current=page]:ring-1 aria-[current=page]:ring-input',
                    mark ? 'text-foreground' : 'text-muted-foreground',
                  )}
                >
                  <span className="text-sm font-semibold">{keySymbol(key)}</span>
                  <span className="text-xs tabular-nums">{mark ?? signatureCount(key)}</span>
                </Link>
              </li>
            )
          }),
        )}
      </ul>
    </nav>
  )
}
