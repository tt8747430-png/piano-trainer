import { useTranslation } from 'react-i18next'
import { caretSaid } from '../model/caret-said'
import { useEditorState } from '../model/editor-context'
import { useValueWord } from './use-value-word'

/**
 * One line saying which part the caret writes, where it is and what is there, and the editing mode
 * where it is not Replace (ADR 0092); a screen reader hears it as it moves.
 */
export function CaretLine() {
  const { t } = useTranslation('editor')
  const draft = useEditorState((state) => state.draft)
  const caret = useEditorState((state) => state.caret)
  const layer = useEditorState((state) => state.layer)
  const chordNote = useEditorState((state) => state.chordNote)
  const mode = useEditorState((state) => state.mode)
  const said = caretSaid({ draft, caret, layer, chordNote, mode })
  const valueWord = useValueWord()
  const where = (() => {
    if (said.kind === 'end') return t('caret.end')
    const { bar, beat, what } = said
    if (said.kind !== 'notes') return t(`caret.${said.kind}`, { bar, beat, what })
    return said.value
      ? t('caret.notes', { bar, beat, what, value: valueWord(said.value) })
      : t('caret.at', { bar, beat, what })
  })()
  // Where the caret writes first: a click on the sheet chose it, so the line says which part it is.
  const placed = said.kind === 'end' ? where : `${t(`layers.${layer}`)} · ${where}`
  const text = said.mode
    ? `${placed} · ${t('caret.mode', { mode: t(`mode.${said.mode}`) })}`
    : placed
  return (
    <p
      role="status"
      className="text-sm leading-snug text-pretty text-muted-foreground tabular-nums"
    >
      {text}
    </p>
  )
}
