import type { HandId } from '@/entities/piece'
import { isHandLayer, type Draft, type DraftNote } from './draft'
import type { EditorAction, EditorState } from './state'

/** A staff's voice the notes are written in (ADR 0114, Flat's and Dorico's V): the second stems down. */
export type Voice = 1 | 2

/**
 * The edits made inside one voice of a piano staff: a key played, a rest, Delete and the pitch and
 * mark edits reach only the notes of the voice chosen, as Dorico's do. Bars, the clipboard and the
 * caret's moves act on the whole staff.
 */
const IN_A_VOICE: ReadonlySet<EditorAction['type']> = new Set([
  'key',
  'addNote',
  'rest',
  'delete',
  'repeat',
  'step',
  'shift',
  'respell',
  'accidental',
  'grace',
  'fingers',
  'mark',
  'line',
  'syllable',
  'tie',
  'interval',
])

const inVoice = (voice: Voice) => (n: DraftNote) => (n.voice ?? 1) === voice

/** A note written in `voice`: the second's marked, the first's with no mark. */
function writtenIn(n: DraftNote, voice: Voice): DraftNote {
  if (voice === 2) return n.voice === 2 ? n : { ...n, voice: 2 }
  if (n.voice === undefined) return n
  const { voice: _second, ...first } = n
  return first
}

const withHand = (draft: Draft, hand: HandId, notes: readonly DraftNote[]): Draft => ({
  ...draft,
  hands: { ...draft.hands, [hand]: notes },
})

const byTime = (a: DraftNote, b: DraftNote) => a.startTick - b.startTick || a.midi - b.midi

/**
 * The editor after `action` made in the voice chosen: the hand's other voice set aside, the edit
 * made on what is left, the other voice put back. Undo brings back both voices.
 */
export function editedInVoice(
  state: EditorState,
  action: EditorAction,
  edit: (state: EditorState, action: EditorAction) => EditorState,
): EditorState {
  const { draft, layer, voice } = state
  if (!isHandLayer(layer) || !IN_A_VOICE.has(action.type)) return edit(state, action)
  const notes = draft.hands[layer]
  const other = notes.filter((n) => !inVoice(voice)(n))
  if (voice === 1 && other.length === 0) return edit(state, action)
  const alone = withHand(draft, layer, notes.filter(inVoice(voice)))
  const next = edit({ ...state, draft: alone }, action)
  if (next.draft === alone) return { ...next, draft }
  const written = next.draft.hands[layer].map((n) => writtenIn(n, voice))
  const merged = withHand(next.draft, layer, [...written, ...other].sort(byTime))
  // The step pushed for this edit holds the hand's two voices, as it was.
  const pushed = next.past.length > state.past.length ? next.past.at(-1) : undefined
  const past = pushed ? [...next.past.slice(0, -1), { ...pushed, draft }] : next.past
  return { ...next, draft: merged, past }
}
