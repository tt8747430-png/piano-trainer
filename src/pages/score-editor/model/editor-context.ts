import { createContext, use } from 'react'
import { useStore } from 'zustand'
import type { EditorAction, EditorState, EditorStore } from '@/features/score-editor'
import type { Midi } from '@/shared/lib/music'

/** What the editor's parts share (composition: each reads what it needs, none knows how it is kept). */
export interface ScoreEditorValue {
  readonly store: EditorStore
  readonly actions: {
    readonly dispatch: (action: EditorAction) => void
    /** A key played on the keys, the computer keyboard or MIDI: written at the caret. */
    readonly play: (key: Midi) => void
    /** Play from the caret's bar to the end, or Stop. */
    readonly togglePlay: () => void
    /** The caret's bar of its hand written out from what the pattern plays. */
    readonly writeOut: () => void
    readonly close: () => void
    /** An own song's title, given anew; an empty one changes nothing. */
    readonly rename: (title: string) => void
  }
  readonly meta: {
    readonly title: string
    readonly hasVersion: boolean
    readonly playing: boolean
    /** Whose music: an own song has a title of its own. */
    readonly kind: 'version' | 'song'
    /** The Chord field's ref: Enter in the chords puts the focus there. */
    readonly chordFieldRef: (field: HTMLInputElement | null) => void
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
