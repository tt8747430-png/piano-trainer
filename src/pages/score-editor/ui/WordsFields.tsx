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

/** What a tempo mark may say: whole beats a minute, 20 to 400. */
const TEMPO = { from: 20, to: 400 } as const

/**
 * The tempo mark's field (ADR 0097, Flat's Tempo in Measure): the beats a minute from the notes at
 * the caret on, typed over them; emptied, the mark comes off; one out of range is marked and kept.
 */
export function TempoMarkField({ anchor }: { anchor: HTMLElement | null }) {
  const { t } = useTranslation('editor')
  const {
    actions: { dispatch },
    view,
  } = useScoreEditorContext()
  const shown = useEditorState((state) => String(marksAt(state)?.tempo ?? ''))
  const at = useEditorState(placeOf)
  const { text, setText, wrong, markWrong } = useFieldText(shown, at)
  /** The tempo typed written on the notes; false where it is out of range. */
  const write = (): boolean => {
    if (text === shown) return true
    if (text === '') {
      dispatch({ type: 'tempoChange', tempo: null })
      return true
    }
    const tempo = Number(text)
    if (tempo < TEMPO.from || tempo > TEMPO.to) return false
    dispatch({ type: 'tempoChange', tempo })
    return true
  }
  return (
    <SheetField
      kind="tempo"
      anchor={anchor}
      label={t('words.tempo')}
      text={text}
      onText={(next) => setText(next.replace(/[^0-9]/g, '').slice(0, 3))}
      at={at}
      error={wrong ? t('words.tempoRange', TEMPO) : undefined}
      onGo={() => {
        if (!write()) markWrong()
      }}
      onClose={() => {
        write()
        view.openField(null)
      }}
    />
  )
}
