import type { ScoreViewSettings } from '@/entities/settings'
import {
  fingeredAt,
  isHandLayer,
  singsHere,
  sungFrom,
  type EditorState,
} from '@/features/score-editor'
import type { SheetField } from '@/widgets/score-sheet'

/**
 * Why a field cannot open where the caret is (ADR 0096), its palette key greyed, saying it: the View
 * hides what it writes, the words go on another staff (ADR 0093), the tune has no note to sing,
 * fingers go on the piano's staves (ADR 0091), on a note.
 */
export type FieldReason =
  | 'chordsHidden'
  | 'lyricsHidden'
  | 'fingersHidden'
  | 'lyricsOn.melody'
  | 'lyricsOn.rh'
  | 'noTune'
  | 'hand'
  | 'chooseNote'

/** What the View shows that a field writes: the chord symbols, the words, the notes' fingers. */
export type FieldsShown = Pick<ScoreViewSettings, 'chordNames' | 'lyrics'> & {
  readonly fingers: boolean
}

/**
 * Why a field cannot open where the caret is (ADR 0096), its key greyed with the reason as its
 * tooltip; null where it opens: the chord symbol's in the chord row, the Lyrics field on the staff
 * the words go on, each where the View shows what it writes; the fingering field on a note of a
 * hand's staff, a chord's too.
 */
export function fieldClosedBy(
  kind: SheetField['kind'],
  state: Pick<EditorState, 'draft' | 'layer' | 'caret' | 'chordNote'>,
  shown: FieldsShown,
): FieldReason | null {
  const { draft, layer, caret } = state
  switch (kind) {
    case 'chord':
      return shown.chordNames ? null : 'chordsHidden'
    case 'lyrics':
      if (!shown.lyrics) return 'lyricsHidden'
      if (!singsHere(draft, layer)) return `lyricsOn.${draft.lyricsOn}`
      return sungFrom(draft, caret) === null ? 'noTune' : null
    case 'fingering':
      if (!shown.fingers) return 'fingersHidden'
      if (!isHandLayer(layer)) return 'hand'
      return fingeredAt(state).length > 0 ? null : 'chooseNote'
  }
}

/** The field a key or a shortcut opens: the words' at their first verse. */
export const fieldOf = (kind: SheetField['kind']): SheetField =>
  kind === 'lyrics' ? { kind, verse: 0 } : { kind }
