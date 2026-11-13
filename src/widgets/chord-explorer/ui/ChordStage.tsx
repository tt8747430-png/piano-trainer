import { useMemo } from 'react'
import { selectScoreView, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setScoreView } from '@/features/set-preference'
import { PinnedKeyboard } from '@/features/live-keyboard'
import type { Midi } from '@/shared/lib/music'
import { Pinned, type ShownKeys } from '@/shared/ui'
import { PianoHands } from '@/widgets/piano-hands'
import { chordPerformance, type ChordView } from '../model/chord-view'

/** The stage's height on the canvas: the hands at the keys, 220 under the bar. */
const STAGE_HEIGHT = 220

/** Nothing held by the learner on a page that shows a chord. */
const NONE: ReadonlySet<Midi> = new Set<Midi>()

/**
 * The chord's stage under the bar, as the canvas's Chords page has it: the hands at a 3D piano
 * playing it, each key pressed by its finger, edge to edge; with the hands off (or where 3D cannot
 * be drawn), the keys, marked by role.
 */
export function ChordStage({ chord, shown }: { chord: ChordView; shown: ShownKeys }) {
  const { hands } = useSettings(selectScoreView)
  const settings = useSettingsStoreApi()
  const notes = useMemo(() => chordPerformance(chord), [chord])
  if (!hands) return <PinnedKeyboard shown={shown} place="top" />
  const midis = notes.map((note) => note.midi)
  const low = midis.reduce((a, b) => (b < a ? b : a))
  const high = midis.reduce((a, b) => (b > a ? b : a))
  return (
    <Pinned bleed className="vt-keys">
      <PianoHands
        height={STAGE_HEIGHT}
        notes={notes}
        perSecond={1}
        now={() => 0}
        playing={false}
        held={NONE}
        marks={shown.marks}
        wrong={undefined}
        faded={null}
        range={{ low, high }}
        onShowKeys={() => setScoreView(settings, { hands: false })}
      />
    </Pinned>
  )
}
