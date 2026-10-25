import type { ScoreViewSettings } from '@/entities/settings'
import { singsHere, sungFrom, type EditorState } from '@/features/score-editor'
import type { SheetField } from '@/widgets/score-sheet'

/**
 * Why a field cannot open where the caret is (ADR 0096), its palette key greyed, saying it: the View
 * hides what it writes, the words go on another staff (ADR 0093), the tune has no note to sing.
 */
export type FieldReason =
  'chordsHidden' | 'lyricsHidden' | 'lyricsOn.melody' | 'lyricsOn.rh' | 'noTune'

/** What the View shows that a field writes: the chord symbols, the words. */
type Shown = Pick<ScoreViewSettings, 'chordNames' | 'lyrics'>

/**
 * Why a field cannot open where the caret is (ADR 0096), its key greyed with the reason as its
 * tooltip; null where it opens: the chord symbol's in the chord row, the Lyrics field on the staff
 * the words go on, each where the View shows what it writes.
 */
export function fieldClosedBy(
  kind: SheetField['kind'],
  { draft, layer, caret }: Pick<EditorState, 'draft' | 'layer' | 'caret'>,
  shown: Shown,
): FieldReason | null {
  switch (kind) {
    case 'chord':
      return shown.chordNames ? null : 'chordsHidden'
    case 'lyrics':
      if (!shown.lyrics) return 'lyricsHidden'
      if (!singsHere(draft, layer)) return `lyricsOn.${draft.lyricsOn}`
      return sungFrom(draft, caret) === null ? 'noTune' : null
  }
}

/** The field a key or a shortcut opens: the words' at their first verse. */
export const fieldOf = (kind: SheetField['kind']): SheetField =>
  kind === 'lyrics' ? { kind, verse: 0 } : { kind }
