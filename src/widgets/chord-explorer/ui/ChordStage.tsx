import { useMemo } from 'react'
import {
  selectChords,
  selectScoreView,
  useSettings,
  useSettingsStoreApi,
} from '@/entities/settings'
import { setScoreView } from '@/features/set-preference'
import { PinnedKeyboard, useFoldKeys } from '@/features/live-keyboard'
import { useMediaQuery } from '@/shared/lib'
import { isBlackKey, type Midi } from '@/shared/lib/music'
import { Pinned, type ShownKeys } from '@/shared/ui'
import { PianoHands, type KeyTag } from '@/widgets/piano-hands'
import { chordKeyLabels } from '../model/chord-labels'
import { chordPerformance, viewChord, type ChordView } from '../model/chord-view'

/** The stage's height on the canvas: the hands at the keys, 220 under a phone's bar, 286 on a laptop. */
const STAGE_HEIGHT = { phone: 220, laptop: 286 } as const

/**
 * The chord's stage under the bar, as the canvas's Chords page has it: the hands at a 3D piano
 * playing it, edge to edge, each key held down in its chord tone's colour with its note's name in a
 * tag over its far end; with the hands off (or where 3D cannot
 * be drawn), the keys, marked by role; nothing where the Piano sheet hides the piano.
 */
export function ChordStage({ chord, shown }: { chord: ChordView; shown: ShownKeys }) {
  const { hands } = useSettings(selectScoreView)
  const settings = useSettingsStoreApi()
  const notes = useMemo(() => chordPerformance(chord), [chord])
  const { labels } = useSettings(selectChords)
  const { held, tags } = useMemo(() => {
    const { placed, fingers } = viewChord(chord)
    const keys = [...placed.lh, ...placed.rh]
    const labelled = chordKeyLabels(placed, fingers, labels)
    return {
      held: new Set<Midi>(keys.map((key) => key.midi)),
      tags: keys
        .filter((key, at) => keys.findIndex((other) => other.midi === key.midi) === at)
        .filter((key) => labelled.get(key.midi))
        .map((key): KeyTag => ({
          key: key.midi,
          black: isBlackKey(key.midi),
          label: labelled.get(key.midi) ?? '',
          colour: `var(--role-${key.tone.role})`,
        })),
    }
  }, [chord, labels])
  const { folded } = useFoldKeys()
  const laptop = useMediaQuery('(min-width: 48rem)')
  // The Piano sheet's Show the piano off: neither the hands nor the keys.
  if (folded) return null
  if (!hands) return <PinnedKeyboard shown={shown} place="top" />
  const midis = notes.map((note) => note.midi)
  const low = midis.reduce((a, b) => (b < a ? b : a))
  const high = midis.reduce((a, b) => (b > a ? b : a))
  return (
    <Pinned bleed className="vt-keys">
      <PianoHands
        height={laptop ? STAGE_HEIGHT.laptop : STAGE_HEIGHT.phone}
        notes={notes}
        perSecond={1}
        now={() => 0}
        playing={false}
        held={held}
        pressedPaint="tone"
        tags={tags}
        marks={shown.marks}
        wrong={undefined}
        faded={null}
        range={{ low, high }}
        onShowKeys={() => setScoreView(settings, { hands: false })}
      />
    </Pinned>
  )
}
