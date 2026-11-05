import { barsOf, chosenBars } from '@/features/score-editor'
import { useEditorState } from './editor-context'

/**
 * Where the palette's Key signature or Time signature changes from (ADR 0114, 0097, R32-C), as Flat
 * changes either from a bar: the first bar chosen (or the caret's; a sign tapped on the score chooses
 * its bar), its section from there on up to the next change; in the song's first section, the song's
 * own.
 */
export function useSignatureFrom() {
  const from = useEditorState((state) => chosenBars(state).from)
  const section = useEditorState((state) => barsOf(state.draft)[from]?.section ?? 0)
  return { from, section, song: section === 0 }
}
