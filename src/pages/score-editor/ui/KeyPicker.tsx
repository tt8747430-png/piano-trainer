import { sameKey, type Key } from '@/shared/lib/music'
import { KeySignaturePicker } from '@/shared/ui/pickers/KeySignaturePicker'
import { useScoreEditorContext } from '../model/editor-context'
import { useKeyAt } from '../model/use-key-at'
import { useSignatureFrom } from '../model/use-signature-from'

/**
 * The palette's Key signature (A34, ADR 0114, R32-C, Flat's): the one key picker in the palette's
 * form, one to seven sharps over one to seven flats with Switch to natural, in the song's mode. It
 * changes the key from the first bar chosen's section on (a key signature tapped on the score chooses
 * its bar), as Flat changes it from a bar; in the song's first section, the song's own key.
 */
export function KeyPicker() {
  const { actions } = useScoreEditorContext()
  const { from, song } = useSignatureFrom()
  const key = useKeyAt()
  const choose = (next: Key) =>
    sameKey(next, key) ||
    actions.dispatch(
      song ? { type: 'settings', key: next } : { type: 'sectionKey', bar: from, key: next },
    )
  return <KeySignaturePicker value={key} onChange={choose} />
}
