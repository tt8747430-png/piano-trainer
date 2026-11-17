import { useKeyName, useScaleName } from '@/shared/i18n'
import { noteFromParam, placeScale } from '@/shared/lib/music'
import { walkSounds } from '@/shared/lib/schedule'
import { usePlay } from '@/shared/lib/services'
import { keyOfScale } from '../model/scale-key'
import type { ScaleView } from '../model/scale-view'
import { ScaleSettingsProvider, type ScaleSettingsSheet } from '../model/settings-sheet'
import { RunView } from './RunView'
import { ScaleChoice } from './ScaleChoice'

/** How fast a scale chosen sounds as it is chosen: a quick run up its octave. */
const CHOSEN_TEMPO = 360

/**
 * Any scale on any root, on one page (the Scales board, R60: "do we need the tabs"): its two pickers,
 * then its run engraved with its fingers, its chords, its key's place on the circle of fifths and its
 * exercises in the Player. A scale chosen (its root or its kind) plays up its octave as it is chosen.
 */
export function ScaleExplorer({
  scale,
  onChange,
  settings,
}: {
  scale: ScaleView
  onChange: (change: Partial<ScaleView>) => void
  /** Scale settings, the sheet the page's gear opens. */
  settings: ScaleSettingsSheet
}) {
  const scaleName = useScaleName()
  const keyName = useKeyName()
  const play = usePlay()
  const root = noteFromParam(scale.root)
  const musicKey = keyOfScale(scale.root, scale.kind)
  const choose = (change: Partial<ScaleView>) => {
    onChange(change)
    const keys = placeScale(noteFromParam(change.root ?? scale.root), change.kind ?? scale.kind, 0)
    play(
      walkSounds(
        keys.map((key) => [key.midi]),
        { arpeggio: false, tempo: CHOSEN_TEMPO },
      ),
    )
  }
  return (
    <ScaleSettingsProvider value={settings}>
      <RunView
        scale={scale}
        onChange={onChange}
        choice={
          <ScaleChoice
            scale={scale}
            name={musicKey ? keyName(musicKey) : scaleName(root, scale.kind)}
            onChange={choose}
          />
        }
      />
    </ScaleSettingsProvider>
  )
}
