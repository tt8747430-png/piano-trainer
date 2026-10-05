import type { ReactNode } from 'react'
import { MidiButton } from '@/features/connect-midi'
import { LiveKeyboard } from '@/features/live-keyboard'
import type { Performance } from '@/shared/lib/arrangement'
import {
  HandsButton,
  LoopButton,
  PlayerArea,
  PlayerScreen,
  PlayerTitle,
  PlayerTransport,
  TempoButton,
  WaitLine,
  type PracticePlayer,
  type PracticeView,
} from '@/widgets/practice-player'
import { SheetMusic } from '@/widgets/sheet-music'

/** A walk or a progression: one section, named nowhere. */
const NO_HEADINGS: readonly string[] = []

/**
 * The Player's screen over any Performance (Flowkey's shape): the toolbar with the tempo, hands, loop,
 * MIDI and Setup, the keys, the sheet music, Wait mode's line and the transport.
 */
export function PlayerLayout({
  title,
  onClose,
  view,
  player,
  performance,
  headings = NO_HEADINGS,
  setup,
}: {
  title: string
  onClose: () => void
  view: PracticeView
  player: PracticePlayer
  performance: Performance
  /** Each section's name, by section: shown at its first bar; none for music with one section. */
  headings?: readonly string[]
  /** The Setup: its button, in the toolbar, and the sheet it opens. */
  setup: ReactNode
}) {
  const { practice } = player
  return (
    <PlayerScreen>
      <PlayerArea area="lead">
        <PlayerTitle title={title} onClose={onClose} />
      </PlayerArea>
      <PlayerArea area="tempo" className="flex items-center">
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
      </PlayerArea>
      <PlayerArea area="hands" className="flex items-center justify-end">
        <HandsButton hands={view.hands} onChange={player.setHands} />
      </PlayerArea>
      <PlayerArea area="actions" className="flex items-center justify-end gap-2">
        <LoopButton looped={player.loop !== null} onToggle={player.toggleLoop} />
        <MidiButton />
        {setup}
      </PlayerArea>
      <PlayerArea area="keys">
        <LiveKeyboard
          range={player.range}
          inView={player.inView}
          marks={player.marks}
          wrong={player.wrong}
          onKeyPress={player.tapKey}
        />
      </PlayerArea>
      <PlayerArea area="sheet">
        <SheetMusic
          performance={performance}
          headings={headings}
          current={practice.state.beatGroup}
          loop={player.loop}
          fingers={player.fingers}
          names={player.names}
          muted={player.muted}
          onJump={practice.jumpToBeatGroup}
          onLoopChange={player.setLoop}
        />
      </PlayerArea>
      <PlayerArea area="status" className="landscape-phone:self-end">
        {view.mode === 'wait' ? (
          <WaitLine feedback={player.feedback} onAgain={practice.play} />
        ) : null}
      </PlayerArea>
      <PlayerArea area="transport">
        <PlayerTransport practice={practice} />
      </PlayerArea>
    </PlayerScreen>
  )
}
