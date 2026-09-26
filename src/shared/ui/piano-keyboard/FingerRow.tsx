import { cn, PIANO_LAYOUT } from '@/shared/lib'
import type { Midi } from '@/shared/lib/music'
import type { KeyMark } from './key-look'

/**
 * The finger row: a circle under each key a mark gives a finger, a black key's in the upper line
 * and a white key's in the lower, as the keys stand, so neighbours never overlap.
 */
export function FingerRow({ marks }: { marks: ReadonlyMap<Midi, KeyMark> | undefined }) {
  const fingered = PIANO_LAYOUT.keys.flatMap((key) => {
    const finger = marks?.get(key.midi)?.finger
    return finger === undefined ? [] : [{ key, finger }]
  })
  if (fingered.length === 0) return null
  return (
    <div aria-hidden data-slot="finger-row" className="relative h-9 shrink-0">
      {fingered.map(({ key, finger }) => (
        <span
          key={key.midi}
          className={cn(
            'absolute grid size-5 -translate-x-1/2 place-items-center rounded-full text-xs font-bold tabular-nums',
            key.black
              ? 'top-0 bg-key-scale text-on-key-scale'
              : 'bottom-0 bg-key-white text-on-key-white ring-1 ring-key-bed',
          )}
          style={{ left: `${key.left + key.width / 2}%` }}
        >
          {finger}
        </span>
      ))}
    </div>
  )
}
