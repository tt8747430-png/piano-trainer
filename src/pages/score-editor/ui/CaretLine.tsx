import { useTranslation } from 'react-i18next'
import { caretSaid } from '../model/caret-said'
import { useEditorState } from '../model/editor-context'

/** One line saying where the caret is and what is there; a screen reader hears it as it moves. */
export function CaretLine() {
  const { t } = useTranslation('editor')
  const draft = useEditorState((state) => state.draft)
  const caret = useEditorState((state) => state.caret)
  const layer = useEditorState((state) => state.layer)
  const said = caretSaid({ draft, caret, layer })
  const text =
    said.kind === 'end'
      ? t('caret.end')
      : t(`caret.${said.kind}`, { bar: said.bar, beat: said.beat, what: said.what })
  return (
    <p role="status" className="truncate text-sm text-muted-foreground tabular-nums">
      {text}
    </p>
  )
}
