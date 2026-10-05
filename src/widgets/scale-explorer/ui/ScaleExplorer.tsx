import { noteFromParam, spellScale } from '@/shared/lib/music'
import { keyOfScale } from '../model/scale-key'
import type { ScaleView } from '../model/scale-view'
import { ChordsView } from './ChordsView'
import { KeyView } from './KeyView'
import { RunView } from './RunView'
import { ScaleChoice } from './ScaleChoice'
import { ScaleFacts } from './ScaleFacts'

/**
 * Any scale on any root. Scale view: its run from any note, fingered, on the keys and on the staff,
 * and practised. Chords view: each degree's chord on its key, played by it, and the chords that hold
 * a note. Key view (a major or minor scale): its key on the circle of fifths, its signature, relative
 * and modes, and the chords it borrows.
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
  const musicKey = scale.show === 'key' ? keyOfScale(scale.root, scale.kind) : null
  if (musicKey) return <KeyView scale={scale} musicKey={musicKey} choice={choice} />
  const facts = <ScaleFacts root={root} kind={scale.kind} tones={spellScale(root, scale.kind)} />
  return scale.show === 'chords' ? (
    <ChordsView scale={scale} onChange={onChange} choice={choice} facts={facts} />
  ) : (
    <RunView scale={scale} onChange={onChange} choice={choice} facts={facts} />
  )
}
