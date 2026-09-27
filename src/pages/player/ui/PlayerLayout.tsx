import { SlidersHorizontal } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { MidiButton } from '@/features/connect-midi'
import { LiveKeyboard } from '@/features/live-keyboard'
import type { Performance } from '@/shared/lib/arrangement'
import { RoundButton } from '@/shared/ui'
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
  headings,
  onSetup,
}: {
  title: string
  onClose: () => void
  view: PracticeView
  player: PracticePlayer
  performance: Performance
  /** Each section's name, by section: shown at its first bar. */
  headings: readonly string[]
  onSetup: () => void
}) {
  const { t } = useTranslation('player')
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
        <RoundButton label={t('setup')} icon={SlidersHorizontal} onClick={onSetup} />
      </PlayerArea>
      <PlayerArea area="keys" className="flex">
        <LiveKeyboard
          range={player.range}
          inView={player.inView}
          marks={player.marks}
          wrong={player.wrong}
          onKeyPress={player.tapKey}
          height="fill"
          className="min-h-0 flex-1"
        />
      </PlayerArea>
      <PlayerArea area="sheet">
        <SheetMusic
          performance={performance}
          headings={headings}
          current={practice.state.beatGroup}
          loop={player.loop}
          fingers={player.fingers}
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
