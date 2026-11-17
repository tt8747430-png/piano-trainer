import { usePatternBook } from '@/entities/pattern'
import { useEffect, useEffectEvent, useMemo, useState } from 'react'
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
import { useProgressStoreApi, withWaitScore } from '@/entities/progress'
import { WEAK } from '@/entities/take'
import {
  arrangePiece,
  readStaves,
  simplifies,
  stavesParam,
  type SongVersion,
  trackOf,
  withTrack,
  writtenBarAt,
  writtenBarOf,
  type PlayerStaves,
  type PracticeChoice,
  type TrackChoice,
  type TrackId,
  waitsForNotes,
} from '@/features/practice'
import { syncRecording } from '@/features/edit-piece'
import { recordPass } from '@/features/record-lesson'
import {
  recordPractised,
  useAtTheKeys,
  usePracticeClock,
  useSongPlayRecord,
} from '@/features/record-practised'
import type { SetupChange } from '@/widgets/player-setup'
import {
  controlsFor,
  passReport,
  usePracticePlayer,
  type PlayerControl,
} from '@/widgets/practice-player'
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
  /** The song's best Wait pass with these hands before the pass just finished; none before the first. */
  readonly bestBefore: number | null
}

/** A pass good enough to count a lesson done, per cent: the takes' weak share (ADR 0111). */
const GOOD_PASS = WEAK * 100

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
  // The time practised (B1): while the transport runs, and in Wait mode up to 30 seconds past the
  // learner's last key (the research's item 6), so a learner who walks away adds no minutes.
  const { state } = player.practice
  const waiting = state.playing && waitsForNotes(state.mode)
  const atTheKeys = useAtTheKeys(
    state.playing && !waiting,
    waiting,
    `${state.beatGroup}:${state.received.length}:${state.ahead.length}:${state.wrongHere.length}`,
  )
  usePracticeClock(atTheKeys)
  // Practised once the music really starts (research item 12): the first Play, or the first right
  // key in Wait mode, never the opening alone; so Recently played and Learning hold what was played.
  useEffect(() => {
    if (atTheKeys) recordPractised(progress, piece.id, new Date())
  }, [atTheKeys, progress, piece.id])
  // The song's place (canvas 125): the bars played through and where Continue opens next.
  const lastBar = writtenBarOf(performance, performance.bars.length - 1)
  useSongPlayRecord(
    piece.id,
    atTheKeys,
    writtenBarAt(performance, player.practice.state.beatGroup),
    lastBar,
  )
  // A pass's score (research items 2, 4): a lesson is done from a good one, 80 % as the takes'
  // weak bar (ADR 0111, research item 15); a whole pass's kept as the song's best with these hands,
  // the best before it said beside the score, so the line can say New best.
  const [bestBefore, setBestBefore] = useState<number | null>(null)
  const recordFinished = useEffectEvent(() => {
    const { lastPassSlips, loop, hands } = state
    if (lastPassSlips === null) return
    const { score } = passReport(performance, hands, lastPassSlips, loop)
    const whole = { first: 0, last: performance.bars.length - 1 }
    if (score >= GOOD_PASS) recordPass(progress, piece.id, player.loop ?? whole, new Date())
    if (loop) return
    const { songs } = progress.getState()
    setBestBefore(songs[piece.id]?.best[hands] ?? null)
    const next = withWaitScore(songs, piece.id, hands, score, lastBar + 1, new Date())
    if (next !== songs) progress.setState({ songs: next })
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
    bestBefore,
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
