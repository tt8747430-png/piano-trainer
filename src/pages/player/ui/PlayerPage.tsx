import { useNavigate, useParams, useSearch } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { pieceById, pieceKey, useSectionHeading, type Piece } from '@/entities/piece'
import { PRACTICE_MODES } from '@/features/practice'
import { keyName } from '@/shared/lib/music'
import { PianoKeyboard, Segmented } from '@/shared/ui'
import { ChordChart } from '@/widgets/chord-chart'
import { PlayerSetup } from '@/widgets/player-setup'
import { usePlayer } from '../model/use-player'
import { NoteGrid } from './NoteGrid'
import { NowPanel } from './NowPanel'
import { PlayerTopBar } from './PlayerTopBar'
import { Transport } from './Transport'

function Player({ piece }: { piece: Piece }) {
  const { t } = useTranslation(['player', 'piece', 'common'])
  const search = useSearch({ from: '/full-screen/play/$pieceId' })
  const navigate = useNavigate({ from: '/play/$pieceId' })
  const heading = useSectionHeading()
  const [setupOpen, setSetupOpen] = useState(false)
  const player = usePlayer(
    piece,
    search,
    (patch) => void navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true }),
  )
  const { practice, performance } = player
  const { state } = practice
  const bar = performance.beatGroups[state.beatGroup]?.bar ?? 0
  const headings =
    piece.kind === 'progression' ? [t('piece:progression')] : piece.sections.map(heading)
  const summary = t('player:summary', {
    key: keyName({ tonic: player.choice.tonic, mode: pieceKey(piece).mode }),
    tempo: player.tempo,
    hands: t(`common:hands.${search.hands}`),
  })

  return (
    <div className="flex flex-1 flex-col gap-4 pt-2 landscape-phone:min-h-0 landscape-phone:gap-2 landscape-phone:pt-1">
      <div className="contents landscape-phone:grid landscape-phone:min-h-0 landscape-phone:flex-1 landscape-phone:grid-cols-2 landscape-phone:content-start landscape-phone:gap-x-4 landscape-phone:gap-y-2 landscape-phone:overflow-y-auto">
        <PlayerTopBar piece={piece} summary={summary} onSetup={() => setSetupOpen(true)} />
        <Segmented
          label={t('player:modes.label')}
          value={search.mode}
          options={PRACTICE_MODES.map((m) => ({ value: m, label: t(`player:modes.${m}`) }))}
          onChange={player.setMode}
        />
        <div className="landscape-phone:col-span-2">
          <ChordChart
            performance={performance}
            headings={headings}
            meter={piece.meter}
            layout="strip"
            current={bar}
            onBar={practice.jumpToBar}
          />
        </div>
        <NowPanel
          performance={performance}
          state={state}
          feedback={player.feedback}
          onAgain={practice.restart}
        />
        <div className="landscape-phone:row-span-2">
          <NoteGrid
            performance={performance}
            bar={bar}
            current={state.beatGroup}
            onJump={practice.jumpToBeatGroup}
          />
        </div>
        <div className="order-last landscape-phone:order-none">
          <Transport practice={practice} onHear={player.hear} />
        </div>
      </div>
      <PianoKeyboard
        label={t('common:keyboard')}
        range={player.range}
        marks={player.marks}
        pressed={player.held}
        wrong={state.wrong === null ? undefined : new Set([state.wrong])}
        minWhiteWidth={28}
        centre={[...player.marks.keys()][0] ?? null}
        onKeyPress={player.tapKey}
        className="mt-auto h-48 landscape-phone:mt-0 landscape-phone:h-1/2"
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
