import { useTranslation } from 'react-i18next'
import type { Duration } from '@/shared/lib/notation'
import { caretSaid } from '../model/caret-said'
import { useEditorState } from '../model/editor-context'
import { VALUE_WORDS } from '../model/value-words'

/** One line saying where the caret is and what is there; a screen reader hears it as it moves. */
export function CaretLine() {
  const { t } = useTranslation('editor')
  const draft = useEditorState((state) => state.draft)
  const caret = useEditorState((state) => state.caret)
  const layer = useEditorState((state) => state.layer)
  const said = caretSaid({ draft, caret, layer })
  const valueWord = ({ value, dots, triplet }: Duration) => {
    const word = t(`caret.values.${VALUE_WORDS[value]}`)
    if (dots === 1) return t('caret.dotted', { value: word })
    return triplet ? t('caret.triplet', { value: word }) : word
  }
  const text = (() => {
    if (said.kind === 'end') return t('caret.end')
    const { bar, beat, what } = said
    if (said.kind !== 'notes') return t(`caret.${said.kind}`, { bar, beat, what })
    return said.value
      ? t('caret.notes', { bar, beat, what, value: valueWord(said.value) })
      : t('caret.at', { bar, beat, what })
  })()
  return (
    <p role="status" className="truncate text-sm text-muted-foreground tabular-nums">
      {text}
    </p>
  )
}
