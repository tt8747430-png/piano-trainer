import { LAPTOP, useMediaQuery } from '@/shared/lib'
import { midi, type Midi } from '@/shared/lib/music'
import type { ShownKeys } from '@/shared/ui'
import { LiveKeyboard } from './LiveKeyboard'

/** Where an example's keys start before it has shown any. */
const MIDDLE_C = 60

/**
 * An example's own keys, under its name (the Lesson boards' PKEYS): from its lowest key shown (else
 * middle C) up a tenth and more on a phone (17 keys, 101 tall with the felt), three octaves around it on a laptop
 * (36 keys, 155 tall); in the boards' dark frame, its corners 20. Its marks hold still while the
 * example sounds, so one example's run never moves another's keys; a tap sounds its key; the
 * computer's letters play none of a page's many examples.
 */
export function ExampleKeys({
  shown,
  selected,
  wrong,
  onKeyPress,
}: {
  shown: ShownKeys
  /** A question's chosen keys: the keys become toggles. */
  selected?: ReadonlySet<Midi> | undefined
  wrong?: ReadonlySet<Midi> | undefined
  onKeyPress?: ((key: Midi) => void) | undefined
}) {
  const laptop = useMediaQuery(LAPTOP)
  const low = shown.keys.length > 0 ? Math.min(...shown.keys) : MIDDLE_C
  const from = midi(laptop ? low - 12 : low)
  const to = midi(laptop ? low + 23 : low + 16)
  return (
    <div className="overflow-hidden rounded-[20px] bg-key-black elevation-1">
      <LiveKeyboard
        range={{ from, to }}
        marks={shown.marks}
        selected={selected}
        wrong={wrong}
        onKeyPress={onKeyPress}
        showsSound={false}
        typable={false}
        spacePedal={false}
        height={laptop ? 155 : 101}
      />
    </div>
  )
}
