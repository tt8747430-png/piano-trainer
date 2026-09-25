import { useNavigate, useParams, useSearch } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { pieceById, pieceKey, usePieceHeadings, type Piece } from '@/entities/piece'
import { LiveKeyboard } from '@/features/live-keyboard'
import { PRACTICE_MODES } from '@/features/practice'
import { keyName } from '@/shared/lib/music'
import { Segmented } from '@/shared/ui'
import { ChordChart } from '@/widgets/chord-chart'
import { PlayerSetup } from '@/widgets/player-setup'
import { usePlayer } from '../model/use-player'
import { NoteGrid } from './NoteGrid'
import { NowPanel } from './NowPanel'
import { PlayerTopBar } from './PlayerTopBar'
import { Transport } from './Transport'

function Player({ piece }: { piece: Piece }) {
  const { t } = useTranslation(['player', 'common'])
  const search = useSearch({ from: '/full-screen/play/$pieceId' })
  const navigate = useNavigate({ from: '/play/$pieceId' })
  const [setupOpen, setSetupOpen] = useState(false)
  const player = usePlayer(
    piece,
    search,
    (patch) => void navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true }),
  )
  const { practice, performance } = player
  const { state } = practice
  const bar = performance.beatGroups[state.beatGroup]?.bar ?? 0
  const headings = usePieceHeadings(piece)
  const summary = t('player:summary', {
    key: keyName({ tonic: player.choice.tonic, mode: pieceKey(piece).mode }),
    tempo: player.tempo,
    hands: t(`common:hands.${search.hands}`),
  })

  return (
    <div className="flex flex-1 flex-col gap-4 pt-2 landscape-phone:min-h-0 landscape-phone:gap-2 landscape-phone:pt-1">
      {/* Upright the parts stack; on a phone on its side they share two columns: the top bar, the
          chord now and the transport on the left; the modes, the chart strip and the note grid on
          the right. */}
      <div className="contents landscape-phone:grid landscape-phone:min-h-0 landscape-phone:flex-1 landscape-phone:grid-cols-2 landscape-phone:content-start landscape-phone:gap-x-4 landscape-phone:gap-y-2 landscape-phone:overflow-y-auto">
        <div className="landscape-phone:col-start-1 landscape-phone:row-start-1">
          <PlayerTopBar piece={piece} summary={summary} onSetup={() => setSetupOpen(true)} />
        </div>
        <div className="landscape-phone:col-start-2 landscape-phone:row-start-1">
          <Segmented
            label={t('player:modes.label')}
            value={search.mode}
            options={PRACTICE_MODES.map((m) => ({ value: m, label: t(`player:modes.${m}`) }))}
            onChange={player.setMode}
          />
        </div>
        <div className="landscape-phone:col-start-2 landscape-phone:row-start-2">
          <ChordChart
            performance={performance}
            headings={headings}
            meter={piece.meter}
            layout="strip"
            current={bar}
            onBar={practice.jumpToBar}
          />
        </div>
        <div className="landscape-phone:col-start-1 landscape-phone:row-start-2">
          <NowPanel
            performance={performance}
            state={state}
            feedback={player.feedback}
            onAgain={practice.restart}
          />
        </div>
        <div className="landscape-phone:col-start-2 landscape-phone:row-start-3">
          <NoteGrid
            performance={performance}
            bar={bar}
            current={state.beatGroup}
            onJump={practice.jumpToBeatGroup}
          />
        </div>
        <div className="order-last landscape-phone:col-start-1 landscape-phone:row-start-3">
          <Transport practice={practice} onHear={player.hear} />
        </div>
      </div>
      <LiveKeyboard
        label={t('common:keyboard')}
        range={player.range}
        inView={player.inView}
        marks={player.marks}
        wrong={state.wrong === null ? undefined : new Set([state.wrong])}
        onKeyPress={player.tapKey}
        className="mt-auto max-h-80 min-h-48 flex-1 landscape-phone:mt-0 landscape-phone:max-h-none landscape-phone:min-h-0 landscape-phone:flex-none landscape-phone:h-2/5"
      />
      <PlayerSetup
        open={setupOpen}
        onOpenChange={setSetupOpen}
        piece={piece}
        choice={player.choice}
        tempo={player.tempo}
        hands={search.hands}
        onChange={player.change}
      />
    </div>
  )
}

export function PlayerPage() {
  const { pieceId } = useParams({ from: '/full-screen/play/$pieceId' })
  const piece = pieceById(pieceId)
  return piece ? <Player key={piece.id} piece={piece} /> : null
}
