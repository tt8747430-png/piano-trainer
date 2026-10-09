import { useKeyName, useScaleName } from '@/shared/i18n'
import { noteFromParam, spellScale } from '@/shared/lib/music'
import { keyOfScale } from '../model/scale-key'
import type { ScaleView } from '../model/scale-view'
import { ChordsView } from './ChordsView'
import { KeyView } from './KeyView'
import { RunView } from './RunView'
import { ScaleChoice } from './ScaleChoice'
import { ScaleFacts } from './ScaleFacts'

/**
 * Any scale on any root, in the view its page's tab chose. Scale: its run from any note, fingered, on
 * the keys and on the staff, and its exercises. Chords: each degree's chord on its key, walked, and
 * the chords that hold a note. Key (a major or minor scale): its key on the circle of fifths, its
 * signature, relative and modes, and the chords it borrows.
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
  const root = noteFromParam(scale.root)
  const name = scaleName(root, scale.kind)
  const choice = <ScaleChoice scale={scale} onChange={onChange} />
  const musicKey = scale.show === 'key' ? keyOfScale(scale.root, scale.kind) : null
  // The Key view is the key's: named as the key, whichever of its scales chose it.
  if (musicKey)
    return <KeyView scale={scale} name={keyName(musicKey)} musicKey={musicKey} choice={choice} />
  const facts = <ScaleFacts root={root} kind={scale.kind} tones={spellScale(root, scale.kind)} />
  return scale.show === 'chords' ? (
    <ChordsView scale={scale} name={name} onChange={onChange} choice={choice} facts={facts} />
  ) : (
    <RunView scale={scale} name={name} onChange={onChange} choice={choice} facts={facts} />
  )
}
