import { createContext, use } from 'react'
import { useStore } from 'zustand'
import type { EditorAction, EditorState, EditorStore } from '@/features/score-editor'
import type { PlayHandle } from '@/shared/api/audio'
import type { SheetView } from '@/shared/lib'
import type { Midi } from '@/shared/lib/music'
import type { Scheduled } from '@/shared/lib/schedule'
import type { SheetField } from '@/widgets/score-sheet'
import type { EditorTakes } from './use-editor-takes'

/** What Play plays, while it plays: its pass, and where it started on the audio clock. */
export interface Heard {
  readonly handle: PlayHandle
  readonly pass: Scheduled
}

/** What the editor's parts share (composition: each reads what it needs, none knows how it is kept). */
export interface ScoreEditorValue {
  readonly store: EditorStore
  /** The recorder and the piece's takes. */
  readonly takes: EditorTakes
  /** What Play plays while it plays, which the playhead follows (ADR 0096); null while it does not. */
  readonly heard: Heard | null
  readonly actions: {
    readonly dispatch: (action: EditorAction) => void
    /** A key played on the keys, the computer keyboard or MIDI: written at the caret, unless a take records. */
    readonly play: (key: Midi) => void
    /** Play from the caret's bar to the end, or Stop. */
    readonly togglePlay: () => void
    readonly close: () => void
    /** Closes the notice of a change that could not be saved. */
    readonly dismissUnsaved: () => void
  }
  /** What the sheet shows and which of the page's sheets is open: chosen here, never saved. */
  readonly view: {
    /** Chord names over the staff, and the chord row they are written in. */
    readonly chordNames: boolean
    /** The words under the tune, the View's switch (ADR 0097). */
    readonly lyrics: boolean
    /** The notes' fingers printed, the View's Finger numbers: the fingering field types them there. */
    readonly fingers: boolean
    /**
     * How fast Play plays, as a share of the song's tempo (1 its own): the learner's speed to check
     * what was written at, never the song's tempo (ADR 0114).
     */
    readonly speed: number
    readonly setSpeed: (speed: number) => void
    /** How the score is laid out, the View's: down the screen, on A4 pages, or as one line across. */
    readonly layout: SheetView
    /** The field open over the sheet at the caret, typing what is printed there (ADR 0096); null while none is. */
    readonly field: SheetField | null
    /**
     * Opens a field at the caret where it can open (the chord symbol's taking the caret to its beat in
     * the chord row, the Lyrics field to the tune's note), or closes the one open (null), the caret
     * back on the staff it came from.
     */
    readonly openField: (field: SheetField | null) => void
  }
  readonly meta: {
    /** The piece's id: its Player's and its editor's. */
    readonly id: string
    readonly title: string
    readonly playing: boolean
    /** Whose music: a catalog piece's version, an own song, or a built-in song's original (an editor's). */
    readonly kind: 'version' | 'song' | 'original'
    /**
     * Whether the last change could not be saved (an edit the song's music cannot be written with):
     * the song keeps the music last saved.
     */
    readonly unsaved: boolean
  }
}

export const ScoreEditorContext = createContext<ScoreEditorValue | null>(null)

export function useScoreEditorContext(): ScoreEditorValue {
  const value = use(ScoreEditorContext)
  if (!value) throw new Error('An editor part was rendered outside the score editor')
  return value
}

/** A narrow read of the editor's state: a part re-renders only when what it reads changes. */
export function useEditorState<Selected>(selector: (state: EditorState) => Selected): Selected {
  return useStore(useScoreEditorContext().store, selector)
}
