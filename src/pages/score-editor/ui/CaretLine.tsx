import { useTranslation } from 'react-i18next'
import { verseCount } from '@/features/score-editor'
import { useLayerName } from '@/widgets/score-sheet'
import { caretSaid } from '../model/caret-said'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { useStaffHeads } from '../model/use-staff-heads'
import { useValueWord } from './use-value-word'

/**
 * One line saying which part the caret writes (what the field open over the sheet types, ADR 0096;
 * the verse, while the Lyrics field is open, ADR 0097), where it is and what is there, and the
 * editing mode where it is not Replace (ADR 0114): a screen reader's alone, heard as the caret
 * moves, at every size; the sheet shows the same (ADR 0114).
 */
export function CaretLine() {
  const { t } = useTranslation('editor')
  const { view } = useScoreEditorContext()
  const draft = useEditorState((state) => state.draft)
  const caret = useEditorState((state) => state.caret)
  const layer = useEditorState((state) => state.layer)
  const chordNote = useEditorState((state) => state.chordNote)
  const mode = useEditorState((state) => state.mode)
  const said = caretSaid({ draft, caret, layer, chordNote, mode })
  const valueWord = useValueWord()
  const layerName = useLayerName(useStaffHeads())
  const where = (() => {
    if (said.kind === 'end') return t('caret.end')
    if (said.kind === 'noChord') return t('caret.noChord', { bar: said.bar, beat: said.beat })
    const { bar, beat, what } = said
    if (said.kind !== 'notes') return t(`caret.${said.kind}`, { bar, beat, what })
    return said.value
      ? t('caret.notes', { bar, beat, what, value: valueWord(said.value) })
      : t('caret.at', { bar, beat, what })
  })()
  // Where the caret writes first: a click on the sheet chose it, so the line says which part it is;
  // a field open, what it types; the words being written, the verse.
  const { field } = view
  const part =
    field?.kind === 'chord'
      ? t('chord.symbol')
      : field?.kind === 'lyrics'
        ? `${t('lyrics.label')} · ${t('lyrics.verse', { n: Math.min(field.verse, verseCount(draft)) + 1 })}`
        : field?.kind === 'fingering'
          ? `${t('fingering')} · ${layerName(layer)}`
          : layerName(layer)
  const placed = said.kind === 'end' ? where : `${part} · ${where}`
  const text = said.mode
    ? `${placed} · ${t('caret.mode', { mode: t(`mode.${said.mode}`) })}`
    : placed
  return (
    <p role="status" aria-live="polite" className="sr-only">
      {text}
    </p>
  )
}
