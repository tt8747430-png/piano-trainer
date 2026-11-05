import { Music2, Rows3 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { choosableChordSize, type Piece } from '@/entities/piece'
import type { PatternFit } from '@/entities/pattern'
import type { PlayerStaves, PracticeChoice, TrackChoice, TrackId } from '@/features/practice'
import type { SwingFeel } from '@/shared/lib/schedule'
import { ChordSizeField, Labelled } from '@/shared/ui'
import {
  PatternCard,
  PlayerSetup,
  StavesSection,
  type MusicPage,
  type SetupChange,
} from '@/widgets/player-setup'
import { SwingField, type PlayerControl, type ScoreTrack } from '@/widgets/practice-player'
import { trackOf } from '@/features/practice'

/**
 * A piece's own pages of the Player's Settings (A35, R31-P): Staves, each track played, shown and how
 * loud; then, for a chord chart alone, Accompaniment: its chord size (a song's written in degrees,
 * greyed while Simplify plays every chord as its triad, its ⓘ saying so), the pattern and its two
 * hands, and Swing. A score plays its staves as written: nothing of a pattern's is offered it
 * (`controls`), its Swing is on Playback. Its key is the foot's Transpose (ADR 0105).
 */
export function PieceSetup({
  piece,
  controls,
  choice,
  fit,
  swing,
  simple,
  tracks,
  staves,
  recordingWhy,
  onChange,
  onStaves,
  onSwing,
}: {
  piece: Piece
  /** What this kind of music is offered (`controlsFor`). */
  controls: ReadonlySet<PlayerControl>
  choice: PracticeChoice
  /** What the piece, as it is played, has for its patterns. */
  fit: PatternFit
  /** Null where the meter cannot swing. */
  swing: SwingFeel | null
  /** Whether Simplify plays the piece's chords as triads. */
  simple: boolean
  tracks: readonly ScoreTrack[]
  staves: PlayerStaves
  /** Why the recording cannot play now, where it cannot. */
  recordingWhy?: string | undefined
  onChange: (change: SetupChange) => void
  onStaves: (id: TrackId, change: Partial<TrackChoice>) => void
  onSwing: (feel: SwingFeel) => void
}) {
  const { t } = useTranslation(['player', 'music'])
  const chordSize = controls.has('chordSize') ? choosableChordSize(piece) : null
  const playing = tracks
    .filter((track) => track.id !== 'recording' || recordingWhy === undefined)
    .filter((track) => trackOf(staves, track.id).play)
  const pages: MusicPage[] = [
    {
      id: 'staves',
      label: t('staves.title'),
      icon: Rows3,
      detail:
        playing.length === 0
          ? t('staves.none')
          : playing.length === tracks.length
            ? t('staves.all')
            : playing.map((track) => track.label).join(', '),
      content: (
        <StavesSection
          tracks={tracks}
          staves={staves}
          recordingWhy={recordingWhy}
          onChange={onStaves}
        />
      ),
    },
  ]
  if (controls.has('accompaniment'))
    pages.push({
      id: 'accompaniment',
      label: t('settingsPage.accompaniment'),
      icon: Music2,
      content: (
        <Accompaniment
          chordSize={chordSize}
          choice={choice}
          simple={simple}
          swing={controls.has('swing') ? swing : null}
          onChange={onChange}
          onSwing={onSwing}
        />
      ),
    })
  return <PlayerSetup figures={choice} fit={fit} onFigures={onChange} pages={pages} />
}

/** A chord chart's Accompaniment page: its chord size, the pattern and its hands, its Swing. */
function Accompaniment({
  chordSize,
  choice,
  simple,
  swing,
  onChange,
  onSwing,
}: {
  chordSize: ReturnType<typeof choosableChordSize>
  choice: PracticeChoice
  simple: boolean
  swing: SwingFeel | null
  onChange: (change: SetupChange) => void
  onSwing: (feel: SwingFeel) => void
}) {
  const { t } = useTranslation(['player', 'music'])
  return (
    <>
      {chordSize ? (
        <Labelled
          label={t('music:chordSize.label')}
          info={simple ? t('simplify.chordSize') : undefined}
        >
          <ChordSizeField
            value={choice.chordSize ?? chordSize}
            disabled={simple}
            onChange={(next) => onChange({ chordSize: next })}
          />
        </Labelled>
      ) : null}
      <PatternCard>
        {swing === null ? null : <SwingField swing={swing} onSwing={onSwing} />}
      </PatternCard>
    </>
  )
}
