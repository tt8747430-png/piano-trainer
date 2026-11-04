import { useTranslation } from 'react-i18next'
import { notesOf, type EditorState } from '@/features/score-editor'
import type { NoteMarks } from '@/shared/lib/music'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { useFieldText } from '../model/use-field-text'
import { SheetField } from './SheetField'

/** The marks of the notes at the caret, on its staff: none in the chord row. */
const marksAt = (state: EditorState): NoteMarks | undefined =>
  state.layer === 'chords'
    ? undefined
    : notesOf(state.draft, state.layer).find((n) => n.startTick === state.caret)?.marks

/** Where the caret is, as a field keeps what it types per place. */
const placeOf = (state: EditorState) => `${state.layer} ${state.caret}`

/**
 * The free text field (ADR 0097, Flat's annotation, ⌘E): the words over the notes at the caret,
 * typed where they print; written as it is left, emptied taking them off.
 */
export function TextField({ anchor }: { anchor: HTMLElement | null }) {
  const { t } = useTranslation('editor')
  const {
    actions: { dispatch },
    view,
  } = useScoreEditorContext()
  const shown = useEditorState((state) => marksAt(state)?.text ?? '')
  const at = useEditorState(placeOf)
  const { text, setText } = useFieldText(shown, at)
  const write = () => {
    if (text.trim() !== shown) dispatch({ type: 'text', text })
  }
  return (
    <SheetField
      kind="text"
      anchor={anchor}
      label={t('words.text')}
      text={text}
      onText={setText}
      at={at}
      maxLength={60}
      onGo={write}
      onClose={() => {
        write()
        view.openField(null)
      }}
    />
  )
}
