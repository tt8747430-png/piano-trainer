import type { ReactNode } from 'react'
import { useStaffNames, type StaffName } from '@/entities/piece'
import {
  selectKeyboard,
  selectScoreView,
  useSettings,
  useSettingsStoreApi,
  type MusicView,
} from '@/entities/settings'
import { MidiButton } from '@/features/connect-midi'
import { LiveKeyboard } from '@/features/live-keyboard'
import { setScoreView } from '@/features/set-preference'
import type { Performance } from '@/shared/lib/arrangement'
import type { MenuAction } from '@/shared/ui'
import { ChordView, ViewTiles } from '@/widgets/chord-views'
import {
  HandsButton,
  LoopButton,
  PlayerArea,
  PlayerScreen,
  PlayerClose,
  PlayerDock,
  TempoButton,
  usePlayerShortcuts,
  WaitLine,
  type PracticePlayer,
  type PracticeView,
} from '@/widgets/practice-player'
import { SCORE_PARTS, ScoreViewMenu, type ScorePart } from '@/widgets/score-view-menu'
import { SheetMusic } from '@/widgets/sheet-music'
import { PlayerMore } from './PlayerMore'
import { PracticeSwitches } from './PracticeSwitches'

/** A walk or a progression: one section, named nowhere. */
const NO_HEADINGS: readonly string[] = []
/** A walk or a progression: the piano's staves alone. */
const NO_STAVES: readonly { readonly name?: StaffName }[] = []

/**
 * What of the score each view of the music offers in the View (ADR 0099): the sheet music its every
 * part; Diagrams the words it shows under its strip; Chords over lyrics and the Grid none, the chords
 * and the words being the view.
 */
const VIEW_PARTS: Readonly<Record<MusicView, readonly ScorePart[]>> = {
  sheet: SCORE_PARTS,
  lyrics: [],
  diagrams: ['lyrics'],
  grid: [],
}

/**
 * The Player's screen over any Performance (Flowkey's shape, ADR 0061): the toolbar, one row from a
 * 360px phone up (Close, Practise · Edit, then the View, MIDI, Setup and More, ADR 0099), the music
 * under its title (ADR 0094) as the View shows it (ADR 0099: the sheet music, Chords over lyrics,
 * Diagrams or the Grid), Wait mode's line, the transport floating under it (the tempo, ‹ ▶ ›, the loop
 * and the hands) and the keys at the foot, or under the toolbar where the keyboard settings dock them
 * at the top; the computer's keys drive it (`usePlayerShortcuts`).
 */
export function PlayerLayout({
  title,
  onClose,
  view,
  player,
  performance,
  headings = NO_HEADINGS,
  setup,
  modes,
  piano = true,
  staves = NO_STAVES,
  info,
  share,
  status,
}: {
  /**
   * Whether the sheet writes the piano's staves: not for a song that hides them, a lead sheet (ADR
   * 0083). The keys and what plays are the same.
   */
  piano?: boolean
  /** The piece's single staves, top down, each printed and switched in the View by its name (ADR 0097). */
  staves?: readonly { readonly name?: StaffName }[]
  title: string
  onClose: () => void
  view: PracticeView
  player: PracticePlayer
  performance: Performance
  /** Each section's name, by section: shown at its first bar; none for music with one section. */
  headings?: readonly string[]
  /** The Setup: its button, in the toolbar, and the sheet it opens. */
  setup: ReactNode
  /** Practise · Edit (ADR 0090), after Close: a piece's own, none for a walk. */
  modes?: ReactNode
  /** A piece's Song information (ADR 0099): More's first action, before Export to MIDI. */
  info?: MenuAction | undefined
  /** An own song's Share (ADR 0099): More's last action. */
  share?: MenuAction | undefined
  /** What the screen says beside Wait mode's line: what an own song's Share said. */
  status?: ReactNode
}) {
  const { practice } = player
  const dock = useSettings((state) => selectKeyboard(state).dock)
  const settings = useSettingsStoreApi()
  const scoreView = useSettings(selectScoreView)
  const names = useStaffNames(staves)
  // The score's single staves as the View switches them: each its clef as the music reads it.
  const viewed = (performance.staves ?? []).map(({ clef }, place) => ({
    clef,
    name: staves[place]?.name,
  }))
  usePlayerShortcuts(player, view, onClose)
  const keys = !scoreView.keys ? null : (
    <PlayerArea area="keys">
      <LiveKeyboard
        range={player.range}
        inView={player.inView}
        // Wait mode's chord across both hands is all in sight, the keys narrowing to hold it.
        fitInView
        marks={player.marks}
        wrong={player.wrong}
        onKeyPress={player.tapKey}
        // Space is Play here: the pedal is the rail's, or a MIDI keyboard's.
        spacePedal={false}
      />
    </PlayerArea>
  )
  return (
    <PlayerScreen keys={dock}>
      {/* Close, then Practise · Edit, as the editor's bar has them (ADR 0090, 0094), level with the
          bar's first row of buttons where they wrap. Closer on a phone held upright, as the
          editor's bar is there, so the bar keeps one row from 360px. */}
      <PlayerArea area="lead" className="flex items-center gap-2 self-start max-sm:gap-1">
        <PlayerClose onClose={onClose} />
        {modes}
      </PlayerArea>
      {/* Where the bar is too narrow for them all (a phone under 360px), its buttons wrap rather
          than cover Close. The loop is the transport's (ADR 0099). */}
      <PlayerArea
        area="actions"
        className="flex flex-wrap items-center justify-end gap-2 self-start max-sm:gap-1"
      >
        <ScoreViewMenu
          keys={{ shown: scoreView.keys, show: (on) => setScoreView(settings, { keys: on }) }}
          staves={viewed}
          piano={piano}
          views={
            <ViewTiles
              value={scoreView.music}
              onChange={(music) => setScoreView(settings, { music })}
            />
          }
          parts={VIEW_PARTS[scoreView.music]}
        >
          {scoreView.music === 'sheet' ? <PracticeSwitches /> : null}
        </ScoreViewMenu>
        <MidiButton />
        {setup}
        <PlayerMore
          music={{ performance, title, tempo: player.tempo }}
          staves={names}
          info={info}
          share={share}
        />
      </PlayerArea>
      {dock === 'top' ? keys : null}
      <PlayerArea area="sheet">
        {scoreView.music === 'sheet' ? (
          <SheetMusic
            view={scoreView}
            piano={piano}
            staffNames={names}
            title={title}
            performance={performance}
            headings={headings}
            current={practice.state.beatGroup}
            clock={practice.clock}
            loop={player.loop}
            fingers={player.fingers}
            names={player.names}
            positions={player.positions}
            muted={player.muted}
            onJump={practice.jumpToBeatGroup}
            playing={practice.state.playing}
            onLoopChange={player.setLoop}
          />
        ) : (
          <ChordView
            view={scoreView.music}
            title={title}
            performance={performance}
            headings={headings}
            practice={practice}
            loop={player.loop}
            words={scoreView.lyrics}
            onSheet={() => setScoreView(settings, { music: 'sheet' })}
          />
        )}
      </PlayerArea>
      <PlayerArea
        area="status"
        className="text-center landscape-phone:max-w-[45vw] landscape-phone:self-center"
      >
        {view.mode === 'wait' ? (
          <WaitLine feedback={player.feedback} onAgain={practice.play} onLoop={player.setLoop} />
        ) : null}
        {status}
      </PlayerArea>
      {/* On a phone held upright the transport may stand into the gutters: it floats over the
          sheet, and its six controls (the tempo's value the longest) need the screen's width. */}
      <PlayerArea
        area="dock"
        className="flex justify-center max-sm:-mx-gutter landscape-phone:items-center"
      >
        <PlayerDock
          practice={practice}
          tempo={
            <TempoButton
              mode={view.mode}
              tempo={player.tempo}
              shownTempo={player.shownTempo}
              ownTempo={player.ownTempo}
              speedTraining={view.speedTraining}
              onWait={() => player.setMode('wait')}
              onTempo={player.listenAt}
              onSpeedTraining={player.setSpeedTraining}
            />
          }
          loop={<LoopButton looped={player.loop !== null} onToggle={player.toggleLoop} />}
          hands={<HandsButton hands={view.hands} onChange={player.setHands} />}
        />
      </PlayerArea>
      {dock === 'top' ? null : keys}
    </PlayerScreen>
  )
}
