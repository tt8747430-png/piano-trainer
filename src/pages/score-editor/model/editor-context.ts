import { createContext, use } from 'react'
import { useStore } from 'zustand'
import type { EditorAction, EditorState, EditorStore } from '@/features/score-editor'
import type { SheetView } from '@/shared/lib'
import type { Midi } from '@/shared/lib/music'
import type { EditorTakes } from './use-editor-takes'

/** What the editor's parts share (composition: each reads what it needs, none knows how it is kept). */
export interface ScoreEditorValue {
  readonly store: EditorStore
  /** The recorder and the piece's takes. */
  readonly takes: EditorTakes
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
    /** The words under the tune, the View's switch (ADR 0093). */
    readonly lyrics: boolean
    /** The verse the Lyrics field writes, from 0, while it is open; null while it is closed. */
    readonly lyricsVerse: number | null
    readonly openLyrics: (verse: number | null) => void
    /**
     * How fast Play plays, as a share of the song's tempo (1 its own): the learner's speed to check
     * what was written at, never the song's tempo (ADR 0089).
     */
    readonly speed: number
    readonly setSpeed: (speed: number) => void
    /** How the score is laid out, the View's: down the screen, on A4 pages, or as one line across. */
    readonly layout: SheetView
  }
  readonly meta: {
    /** The piece's id: its Player's and its editor's. */
    readonly id: string
    readonly title: string
    readonly playing: boolean
    /** Whose music: a catalog piece's version, or an own song. */
    readonly kind: 'version' | 'song'
    /** The Chord field's ref: Enter in the chords puts the focus there. */
    readonly chordFieldRef: (field: HTMLInputElement | null) => void
    /** Counts the times Enter in the chords asked for the field while it was not open: the palette opens it. */
    readonly chordFieldAsked: number
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
