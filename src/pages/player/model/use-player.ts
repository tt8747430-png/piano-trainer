import { usePatternBook } from '@/entities/pattern'
import { useEffect, useEffectEvent, useMemo } from 'react'
import {
  hasWrittenStaves,
  keyShift,
  pieceFit,
  selectRecordingSync,
  usePieceHeadings,
  usePieces,
  usePiecesStoreApi,
  type Piece,
} from '@/entities/piece'
import { useProgressStoreApi } from '@/entities/progress'
import {
  arrangePiece,
  readStaves,
  simplifies,
  stavesParam,
  type SongVersion,
  trackOf,
  withTrack,
  type PlayerStaves,
  type PracticeChoice,
  type TrackChoice,
  type TrackId,
} from '@/features/practice'
import { syncRecording } from '@/features/edit-piece'
import { recordPass } from '@/features/record-lesson'
import { recordPractised, usePracticeClock } from '@/features/record-practised'
import type { SetupChange } from '@/widgets/player-setup'
import { controlsFor, usePracticePlayer, type PlayerControl } from '@/widgets/practice-player'
import { resolveChoice, searchPatch, type PlayerSearch } from './player-search'
import type { WalkingPlayerOf } from './player-of'

/** A piece's Player: a walking Player's, and its tools row's Simplify (ADR 0105). */
export interface PiecePlayerOf extends WalkingPlayerOf<PracticeChoice, SetupChange> {
  /** What this piece is offered: a score's or a chord chart's controls (A35). */
  readonly controls: ReadonlySet<PlayerControl>
  /** Which tracks play and show (A35). */
  readonly staves: PlayerStaves
  /** Whether Simplified changes the piece as chosen: where it would not, it is greyed. */
  readonly simplifies: boolean
  /** The version played (R29 B8). */
  setVersion(version: SongVersion): void
  /** A track played or shown, or not. */
  changeTrack(id: TrackId, change: Partial<TrackChoice>): void
  /** How far the learner moved the recording against the music, in milliseconds (R34). */
  readonly recordingSync: number
  /** Moves it: later where positive. */
  syncRecording(ms: number): void
}

/** The piece as the Player plays it: its URL's choices arranged, practised from the widget's hook. */
export function usePlayer(
  piece: Piece,
  search: PlayerSearch,
  setSearch: (patch: Partial<PlayerSearch>) => void,
): PiecePlayerOf {
  // Read once a piece: the Player renders each beat, and a fit reads the piece's chart.
  const fit = useMemo(() => pieceFit(piece), [piece])
  const controls = useMemo(() => controlsFor(hasWrittenStaves(piece) ? 'score' : 'chart'), [piece])
  const staves = useMemo(() => readStaves(search.staves), [search.staves])
  const progress = useProgressStoreApi()
  const book = usePatternBook()
  const {
    transpose,
    tkey,
    tchords,
    clef,
    pattern,
    rh,
    lh,
    inversion,
    nearest,
    chordSize,
    version,
  } = search
  const choice = useMemo(
    () =>
      resolveChoice(
        piece,
        { transpose, tkey, tchords, clef, pattern, rh, lh, inversion, nearest, chordSize, version },
        book,
      ),
    [
      piece,
      transpose,
      tkey,
      tchords,
      clef,
      pattern,
      rh,
      lh,
      inversion,
      nearest,
      chordSize,
      version,
      book,
    ],
  )
  // The Player plays the repeats taken, the bars unrolled as they are played.
  const performance = useMemo(
    () => arrangePiece(piece, choice, book, { unfold: true }),
    [piece, choice, book],
  )
  const headings = usePieceHeadings(piece)
  useEffect(() => recordPractised(progress, piece.id, new Date()), [progress, piece.id])
  // The recording plays along in any key, shifted as far as the music is (R34): stretched, the singer
  // moves with the chords. Its track's Play turns it on or off (A35).
  // Moved by the learner's Sync where a device hears it off the notes: later, its bar 1 comes later.
  const semitones = keyShift(piece, choice.tonic)
  const playsRecording = trackOf(staves, 'recording').play
  const pieces = usePiecesStoreApi()
  const sync = usePieces((state) => selectRecordingSync(state, piece.id))
  const recording = useMemo(
    () =>
      playsRecording && piece.recording
        ? {
            recording: { ...piece.recording, start: piece.recording.start - sync / 1000 },
            semitones,
          }
        : null,
    [playsRecording, piece.recording, semitones, sync],
  )
  const player = usePracticePlayer(performance, search, setSearch, piece.tempo, recording, staves)
  // A pass played through in Wait mode is a lesson done: its loop's bars, or the whole piece's
  // (ADR 0111). Read as it is counted, never a reason to record again.
  const { passes } = player.practice.state
  // The time practised (B1): while the transport runs or waits for the learner's notes.
  usePracticeClock(player.practice.state.playing)
  const recordFinished = useEffectEvent(() => {
    const whole = { first: 0, last: performance.bars.length - 1 }
    recordPass(progress, piece.id, player.loop ?? whole, new Date())
  })
  useEffect(() => {
    if (passes > 0) recordFinished()
  }, [passes])
  // Read once a chart: the piece at the chord size chosen.
  const size = choice.chordSize
  const simplified = useMemo(() => simplifies(piece, size), [piece, size])
  return {
    choice,
    performance,
    player,
    fit,
    headings,
    controls,
    staves,
    simplifies: simplified,
    changeSetup: (change) => setSearch(searchPatch(piece, change)),
    setVersion: (next) => setSearch({ version: next }),
    changeTrack: (id, change) => setSearch({ staves: stavesParam(withTrack(staves, id, change)) }),
    recordingSync: sync,
    syncRecording: (ms) => syncRecording(pieces, piece.id, ms),
  }
}
