import { noteFromParam, spellScale } from '@/shared/lib/music'
import type { ScaleView } from '../model/scale-view'
import { ChordsView } from './ChordsView'
import { RunView } from './RunView'
import { ScaleChoice } from './ScaleChoice'
import { ScaleFacts } from './ScaleFacts'

/**
 * Any scale on any root. Scale view: its run from any note, fingered, on the keys and on the staff,
 * and practised. Chords view: each degree's chord on its key, played by it, and the chords that hold
 * a note. Both: what the scale is made of.
 */
export function ScaleExplorer({
  scale,
  onChange,
}: {
  scale: ScaleView
  onChange: (change: Partial<ScaleView>) => void
}) {
  const root = noteFromParam(scale.root)
  const choice = <ScaleChoice scale={scale} onChange={onChange} />
  const facts = <ScaleFacts root={root} kind={scale.kind} tones={spellScale(root, scale.kind)} />
  return scale.show === 'chords' ? (
    <ChordsView scale={scale} onChange={onChange} choice={choice} facts={facts} />
  ) : (
    <RunView scale={scale} onChange={onChange} choice={choice} facts={facts} />
  )
}
