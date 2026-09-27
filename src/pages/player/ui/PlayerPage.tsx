import { useNavigate, useParams, useSearch } from '@tanstack/react-router'
import { SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { entryTitles, pieceById, usePieceHeadings, type Piece } from '@/entities/piece'
import { MidiButton } from '@/features/connect-midi'
import { LiveKeyboard } from '@/features/live-keyboard'
import { useLocale } from '@/shared/i18n'
import { isCompound } from '@/shared/lib/music'
import { RoundButton } from '@/shared/ui'
import { PlayerSetup } from '@/widgets/player-setup'
import {
  HandsButton,
  LoopButton,
  PlayerArea,
  PlayerScreen,
  PlayerTitle,
  PlayerTransport,
  PlayingFields,
  TempoButton,
  WaitLine,
} from '@/widgets/practice-player'
import { SheetMusic } from '@/widgets/sheet-music'
import { useClose } from '../model/use-close'
import { usePlayer } from '../model/use-player'

function Player({ piece }: { piece: Piece }) {
  const { t } = useTranslation('player')
  const locale = useLocale()
  const search = useSearch({ from: '/full-screen/play/$pieceId' })
  const navigate = useNavigate({ from: '/play/$pieceId' })
  const [setupOpen, setSetupOpen] = useState(false)
  const close = useClose(piece)
  const headings = usePieceHeadings(piece)
  const { choice, performance, player, changeSetup } = usePlayer(
    piece,
    search,
    (patch) => void navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true }),
  )
  const { practice } = player
  return (
    <>
      <PlayerScreen>
        <PlayerArea area="lead">
          <PlayerTitle title={entryTitles(piece, locale).primary} onClose={close} />
        </PlayerArea>
        <PlayerArea area="tempo" className="flex items-center">
          <TempoButton
            mode={search.mode}
            tempo={player.tempo}
            shownTempo={player.shownTempo}
            ownTempo={player.ownTempo}
            speedTraining={search.speedTraining}
            onWait={() => player.setMode('wait')}
            onTempo={player.listenAt}
            onSpeedTraining={player.setSpeedTraining}
          />
        </PlayerArea>
        <PlayerArea area="hands" className="flex items-center justify-end">
          <HandsButton hands={search.hands} onChange={player.setHands} />
        </PlayerArea>
        <PlayerArea area="actions" className="flex items-center justify-end gap-2">
          <LoopButton looped={player.loop !== null} onToggle={player.toggleLoop} />
          <MidiButton />
          <RoundButton
            label={t('setup')}
            icon={SlidersHorizontal}
            onClick={() => setSetupOpen(true)}
          />
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
          {search.mode === 'wait' ? (
            <WaitLine feedback={player.feedback} onAgain={practice.play} />
          ) : null}
        </PlayerArea>
        <PlayerArea area="transport">
          <PlayerTransport practice={practice} />
        </PlayerArea>
      </PlayerScreen>
      <PlayerSetup
        open={setupOpen}
        onOpenChange={setSetupOpen}
        piece={piece}
        choice={choice}
        onChange={changeSetup}
      >
        <PlayingFields
          swing={isCompound(piece.meter) ? null : search.swing}
          onSwing={player.setSwing}
        />
      </PlayerSetup>
    </>
  )
}

export function PlayerPage() {
  const { pieceId } = useParams({ from: '/full-screen/play/$pieceId' })
  const piece = pieceById(pieceId)
  return piece ? <Player key={piece.id} piece={piece} /> : null
}
