import { useNavigate } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { useMidiKeyDown } from '@/features/connect-midi'
import {
  diagramMarksParam,
  IN_PLACE,
  markKey,
  readDiagramMarks,
  type DiagramColour,
  type DiagramMark,
  type DiagramMarks,
} from '@/shared/lib'
import type { Finger, Midi } from '@/shared/lib/music'
import { EMPTY_TRAIL, strike, type Trail } from '@/widgets/live-score'
import type { FreePlayView } from './free-play-view'

/** Free play's keys (spec 2026-10-09 §5): Play's trail, or Mark's diagram, and Clear. */
export interface FreePlay {
  /** What the live score writes: Play's trail, or Mark's marked keys as one chord. */
  readonly chords: readonly (readonly Midi[])[]
  /** Mark's marks, as the URL holds them. */
  readonly marks: DiagramMarks
  /** The mark a key tapped in Mark takes: its colour and finger. */
  readonly mark: DiagramMark
  setColour(colour: DiagramColour): void
  setFinger(finger: Finger | null): void
  /** A key tapped or typed: struck now, or marked. */
  press(key: Midi): void
  clear(): void
}

export function useFreePlay(view: FreePlayView): FreePlay {
  const navigate = useNavigate({ from: '/practice/free-play' })
  const [trail, setTrail] = useState<Trail>(EMPTY_TRAIL)
  const [colour, setColour] = useState<DiagramColour>('a')
  const [finger, setFinger] = useState<Finger | null>(null)
  const mark: DiagramMark = finger === null ? { colour } : { colour, finger }
  const marks = useMemo(() => readDiagramMarks(view.marks), [view.marks])

  /** Each change of the marks reads the URL's latest, so keys marked at once all stay. */
  const writeMarks = (change: (marks: DiagramMarks) => DiagramMarks) =>
    void navigate({
      search: (prev) => ({
        ...prev,
        marks: diagramMarksParam(change(readDiagramMarks(prev.marks))),
      }),
      ...IN_PLACE,
    })

  const press = (key: Midi, time: number) => {
    if (view.mode === 'mark') writeMarks((current) => markKey(current, key, mark))
    else setTrail((current) => strike(current, key, time))
  }
  useMidiKeyDown(press)

  const chords = useMemo(
    () =>
      view.mode === 'mark'
        ? marks.size === 0
          ? []
          : [[...marks.keys()].sort((a, b) => a - b)]
        : trail.map((chord) => chord.keys),
    [view.mode, marks, trail],
  )
  return {
    chords,
    marks,
    mark,
    setColour,
    setFinger,
    press: (key) => press(key, performance.now()),
    clear: () => (view.mode === 'mark' ? writeMarks(() => new Map()) : setTrail(EMPTY_TRAIL)),
  }
}
