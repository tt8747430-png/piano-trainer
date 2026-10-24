import { useMemo, type ReactNode } from 'react'
import {
  selectKeyboard,
  selectScoreView,
  useSettings,
  useSettingsStoreApi,
} from '@/entities/settings'
import { MidiButton } from '@/features/connect-midi'
import { LiveKeyboard } from '@/features/live-keyboard'
import { setScoreView } from '@/features/set-preference'
import type { Performance } from '@/shared/lib/arrangement'
import { PIANO_STAVES } from '@/shared/lib/notation'
import { SheetTitle } from '@/shared/ui'
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
import { ScoreViewMenu } from '@/widgets/score-view-menu'
import { SheetMusic } from '@/widgets/sheet-music'
import { PracticeSwitches } from './PracticeSwitches'

/** A walk or a progression: one section, named nowhere. */
const NO_HEADINGS: readonly string[] = []

/**
 * The Player's screen over any Performance (Flowkey's shape, ADR 0061): the toolbar with the loop,
 * MIDI and Setup, the sheet music, Wait mode's line, the transport floating under it (the tempo, ‹ ▶ ›
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
}: {
  /**
   * Whether the sheet writes the piano's staves: not for a song that hides them, a lead sheet, its
   * tune on its own staff (ADR 0083). The keys and what plays are the same.
   */
  piano?: boolean
  title: string
  onClose: () => void
  view: PracticeView
  player: PracticePlayer
  performance: Performance
  /** Each section's name, by section: shown at its first bar; none for music with one section. */
  headings?: readonly string[]
  /** The Setup: its button, in the toolbar, and the sheet it opens. */
  setup: ReactNode
  /** Practise · Edit (ADR 0090), first of the bar's buttons: a piece's own, none for a walk. */
  modes?: ReactNode
}) {
  const { practice } = player
  const dock = useSettings((state) => selectKeyboard(state).dock)
  const settings = useSettingsStoreApi()
  const scoreView = useSettings(selectScoreView)
  const shown = useMemo(
    () =>
      piano
        ? scoreView
        : { ...scoreView, melodyStaff: true, hidden: [...scoreView.hidden, ...PIANO_STAVES] },
    [scoreView, piano],
  )
  usePlayerShortcuts(player, view, onClose)
  const keys = !shown.keys ? null : (
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
      <PlayerArea area="lead">
        <PlayerClose onClose={onClose} />
      </PlayerArea>
      <PlayerArea area="actions" className="flex items-center justify-end gap-2 narrow-phone:gap-1">
        {modes}
        <LoopButton looped={player.loop !== null} onToggle={player.toggleLoop} />
        <ScoreViewMenu
          keys={{ shown: scoreView.keys, show: (on) => setScoreView(settings, { keys: on }) }}
        >
          <PracticeSwitches />
        </ScoreViewMenu>
        <MidiButton />
        {setup}
      </PlayerArea>
      {dock === 'top' ? keys : null}
      <PlayerArea area="sheet">
        {shown.notation ? (
          <SheetMusic
            view={shown}
            title={title}
            performance={performance}
            headings={headings}
            current={practice.state.beatGroup}
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
          // No notation: the title alone where the sheet was (ADR 0094).
          <SheetTitle title={title} place="lines" />
        )}
      </PlayerArea>
      <PlayerArea
        area="status"
        className="landscape-phone:max-w-[45vw] landscape-phone:self-center"
      >
        {view.mode === 'wait' ? (
          <WaitLine feedback={player.feedback} onAgain={practice.play} onLoop={player.setLoop} />
        ) : null}
      </PlayerArea>
      <PlayerArea area="dock" className="flex justify-center landscape-phone:items-center">
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
          hands={<HandsButton hands={view.hands} onChange={player.setHands} />}
        />
      </PlayerArea>
      {dock === 'top' ? null : keys}
    </PlayerScreen>
  )
}
