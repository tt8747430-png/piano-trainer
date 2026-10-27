import { useMemo, useState, type ReactNode } from 'react'
import { useStaffNames, type StaffName } from '@/entities/piece'
import { selectKeyboard, selectScoreView, useSettings } from '@/entities/settings'
import { MidiButton } from '@/features/connect-midi'
import { LiveKeyboard } from '@/features/live-keyboard'
import type { Performance } from '@/shared/lib/arrangement'
import type { Recording } from '@/shared/lib/schedule'
import type { MenuAction } from '@/shared/ui'
import { ChordView, shownView, viewNeeds } from '@/widgets/chord-views'
import {
  CountInBeat,
  HandsButton,
  LoopButton,
  PlayerArea,
  PlayerScreen,
  PlayerClose,
  PlayerDock,
  PlayerTools,
  ScoreBar,
  SoundButton,
  TempoButton,
  usePlayerShortcuts,
  WaitLine,
  type PracticePlayer,
  type PracticeView,
} from '@/widgets/practice-player'
import { SheetMusic } from '@/widgets/sheet-music'
import { SongPrint } from '@/widgets/song-print'
import { useChordKeys } from '../model/use-chord-keys'
import { PlayerMore } from './PlayerMore'
import { PlayerViewMenu } from './PlayerViewMenu'

/** A walk or a progression: one section, named nowhere. */
const NO_HEADINGS: readonly string[] = []
/** A walk or a progression: the piano's staves alone. */
const NO_STAVES: readonly { readonly name?: StaffName }[] = []

/**
 * The Player's screen over any Performance (Flowkey's shape, ADR 0061): its bar (`ScoreBar`, ADR
 * 0115: Close, Practise · Edit, then MIDI, Setup and More, ADR 0099; its tools, ADR 0102: the View,
 * named by the view shown, then the music's own tools, a piece's Transpose and Simplify, ADR 0104);
 * the music under its title (ADR 0094) as the View
 * shows it (ADR 0099: the sheet music, Chords over lyrics, Diagrams or the Grid), Wait mode's line,
 * the transport floating under it (the tempo, ‹ ▶ ›, the loop, the Sound and the hands), the
 * count-in's beat large over it all while Listen counts in (ADR 0105), and the keys at the
 * foot, or under the tools row where the keyboard settings dock them at the top; the computer's keys
 * drive it (`usePlayerShortcuts`). More's Print puts the music as the View shows it in print
 * (`SongPrint`, ADR 0107).
 */
export function PlayerLayout({
  title,
  onClose,
  view,
  player,
  performance,
  headings = NO_HEADINGS,
  setup,
  tools,
  modes,
  piano = true,
  staves = NO_STAVES,
  recording,
  more,
  status,
  openView = false,
}: {
  /**
   * Whether the sheet writes the piano's staves: not for a song that hides them, a lead sheet (ADR
   * 0083). The keys and what plays are the same.
   */
  piano?: boolean
  /** The piece's single staves, top down, each printed and switched in the View by its name (ADR 0097). */
  staves?: readonly { readonly name?: StaffName }[]
  /**
   * The piece's recording: the Sound offers its volume (ADR 0105), More its MIDI time aligned to it
   * (ADR 0107).
   */
  recording?: Recording | undefined
  title: string
  onClose: () => void
  view: PracticeView
  player: PracticePlayer
  performance: Performance
  /** Each section's name, by section: shown at its first bar; none for music with one section. */
  headings?: readonly string[]
  /** The Setup: its button, in the toolbar, and the sheet it opens. */
  setup: ReactNode
  /** The tools row's after the View: a piece's Transpose and Simplify (ADR 0104); none for a walk. */
  tools?: ReactNode
  /** Practise · Edit (ADR 0090), after Close: a piece's own, none for a walk. */
  modes?: ReactNode
  /** The music's own in More, before Print: a piece's Song information, Sections and Share (ADR 0107). */
  more?: readonly MenuAction[] | undefined
  /** What the screen says beside Wait mode's line: what a piece's Share said. */
  status?: ReactNode
  /** The View open as the screen opens: a piece's, where the learner asks each time (ADR 0102). */
  openView?: boolean
}) {
  const { practice } = player
  const dock = useSettings((state) => selectKeyboard(state).dock)
  const scoreView = useSettings(selectScoreView)
  const names = useStaffNames(staves)
  // The score's single staves as the View switches them: each its clef as the music reads it.
  const viewed = (performance.staves ?? []).map(({ clef }, place) => ({
    clef,
    name: staves[place]?.name,
  }))
  // The view saved, where the music can show it, else the one it falls back to (ADR 0102).
  const needs = useMemo(() => viewNeeds(performance), [performance])
  const shown = shownView(scoreView.music, needs)
  usePlayerShortcuts(player, view, onClose)
  // More's Print (ADR 0107): the music printed as the View shows it, while its render stands.
  const [printing, setPrinting] = useState(false)
  // A chord view's keys in Listen: the chord sounding as its diagram draws it (ADR 0101); a pattern
  // lesson's, each note as it sounds, whatever the view (ADR 0111).
  const chordKeys = useChordKeys(
    performance,
    practice.state,
    shown !== 'sheet' && view.keys !== true,
  )
  const keys = !player.keys ? null : (
    <PlayerArea area="keys">
      <LiveKeyboard
        range={player.range}
        inView={chordKeys ? chordKeys.inView : player.inView}
        // Wait mode's chord across both hands is all in sight, the keys narrowing to hold it.
        fitInView
        marks={chordKeys?.marks ?? player.marks}
        wrong={player.wrong}
        onKeyPress={player.tapKey}
        // Space is Play here: the pedal is the rail's, or a MIDI keyboard's.
        spacePedal={false}
      />
    </PlayerArea>
  )
  return (
    // While Diagrams plays, the bar and the tools row step aside (ADR 0102).
    <PlayerScreen keys={dock} aside={shown === 'diagrams' && practice.state.playing}>
      {/* The score's bar, the editor's in shape (ADR 0090, 0110, 0115): Close, then Practise · Edit;
          MIDI, Setup and More; the View and the music's tools. The loop is the transport's (ADR
          0099). */}
      <ScoreBar
        lead={
          <>
            <PlayerClose onClose={onClose} />
            {modes}
          </>
        }
        actions={
          <>
            <MidiButton variant="tool" />
            {setup}
            <PlayerMore
              music={{ performance, title, tempo: player.tempo }}
              recording={recording}
              staves={names}
              actions={more}
              onPrint={() => setPrinting(true)}
            />
          </>
        }
        tools={
          <PlayerTools>
            <PlayerViewMenu
              shown={shown}
              needs={needs}
              staves={viewed}
              piano={piano}
              openAtStart={openView}
              keys={player.keys}
              onKeys={player.setKeys}
            />
            {tools}
          </PlayerTools>
        }
      />
      {dock === 'top' ? keys : null}
      <PlayerArea area="sheet">
        {shown === 'sheet' ? (
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
            view={shown}
            title={title}
            performance={performance}
            headings={headings}
            practice={practice}
            loop={player.loop}
            words={scoreView.lyrics}
            mode={scoreView.diagrams}
            pinned={scoreView.pinned}
            textSize={scoreView.textSize}
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
          sheet, and its seven controls (the tempo's value the longest) need the screen's width. */}
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
          sound={
            <SoundButton
              staves={viewed.length > 0}
              recording={recording !== undefined}
              click={player.click}
              onClick={player.setClick}
            />
          }
          hands={<HandsButton hands={view.hands} onChange={player.setHands} />}
        />
      </PlayerArea>
      {dock === 'top' ? null : keys}
      <CountInBeat count={practice.counting} />
      {printing ? (
        <SongPrint
          view={shown}
          title={title}
          performance={performance}
          headings={headings}
          sheet={{
            view: scoreView,
            piano,
            staffNames: names,
            fingers: player.fingers,
            names: player.names,
            positions: player.positions,
          }}
          onDone={() => setPrinting(false)}
        />
      ) : null}
    </PlayerScreen>
  )
}
