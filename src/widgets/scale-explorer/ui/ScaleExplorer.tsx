import { selectKeyboard, useSettings } from '@/entities/settings'
import { useKeyName, useScaleName } from '@/shared/i18n'
import { noteFromParam, placeScale, spellScale } from '@/shared/lib/music'
import { walkSounds } from '@/shared/lib/schedule'
import { usePlay } from '@/shared/lib/services'
import { keyOfScale } from '../model/scale-key'
import type { ScaleView } from '../model/scale-view'
import { ChordsView } from './ChordsView'
import { KeyView } from './KeyView'
import { RunView } from './RunView'
import { ScaleChoice } from './ScaleChoice'
import { ScaleFacts } from './ScaleFacts'

/** How fast a scale chosen sounds as it is chosen: a quick run up its octave. */
const CHOSEN_TEMPO = 360

/**
 * Any scale on any root, in the view its page's tab chose. A scale chosen (its root or its kind)
 * plays up its octave as it is chosen, unless Settings › Keyboard turns that off. Scale: its run from any note, fingered, on
 * the keys and on the staff, and its exercises. Chords: each degree's chord on its key, walked, and
 * the chords that hold a note. Key (a major or minor scale): its key on the circle of fifths, its
 * signature, relative and modes, the chords it borrows, and a melody note harmonised in it.
 */
export function ScaleExplorer({
  scale,
  onChange,
}: {
  scale: ScaleView
  onChange: (change: Partial<ScaleView>) => void
}) {
  const scaleName = useScaleName()
  const keyName = useKeyName()
  const play = usePlay()
  const { autoplay } = useSettings(selectKeyboard)
  const root = noteFromParam(scale.root)
  const name = scaleName(root, scale.kind)
  const choose = (change: Partial<ScaleView>) => {
    onChange(change)
    if (!autoplay) return
    const keys = placeScale(noteFromParam(change.root ?? scale.root), change.kind ?? scale.kind, 0)
    play(
      walkSounds(
        keys.map((key) => [key.midi]),
        { arpeggio: false, tempo: CHOSEN_TEMPO },
      ),
    )
  }
  const choice = <ScaleChoice scale={scale} onChange={choose} />
  const musicKey = scale.show === 'key' ? keyOfScale(scale.root, scale.kind) : null
  // The Key view is the key's: named as the key, whichever of its scales chose it.
  if (musicKey)
    return (
      <KeyView
        scale={scale}
        name={keyName(musicKey)}
        musicKey={musicKey}
        choice={choice}
        onChange={onChange}
      />
    )
  const facts = <ScaleFacts root={root} kind={scale.kind} tones={spellScale(root, scale.kind)} />
  return scale.show === 'chords' ? (
    <ChordsView scale={scale} name={name} onChange={onChange} choice={choice} facts={facts} />
  ) : (
    <RunView scale={scale} name={name} onChange={onChange} choice={choice} facts={facts} />
  )
}
