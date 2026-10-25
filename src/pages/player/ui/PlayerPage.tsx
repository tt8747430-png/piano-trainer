import { Link, useParams, useSearch } from '@tanstack/react-router'
import { useEffect, useEffectEvent } from 'react'
import { useTranslation } from 'react-i18next'
import {
  entryTitles,
  isDegreePiece,
  isLeadSheet,
  useRepertoire,
  type Piece,
} from '@/entities/piece'
import { beatGroupInBar, writtenBarAt } from '@/features/practice'
import { useLocale } from '@/shared/i18n'
import { useViewChange } from '@/shared/lib'
import { isCompound } from '@/shared/lib/music'
import { ButtonLink, NotFound } from '@/shared/ui'
import { ModeSwitch } from '@/widgets/mode-switch'
import { useClose } from '../model/use-close'
import type { PlayerSearch } from '../model/player-search'
import { usePlayer } from '../model/use-player'
import { PieceChart } from './PieceChart'
import { PieceSetup } from './PieceSetup'
import { PlayerLayout } from './PlayerLayout'

function PiecePlayer({ piece }: { piece: Piece }) {
  const locale = useLocale()
  const search = useSearch({ from: '/full-screen/play/$pieceId' })
  const close = useClose(piece)
  const setSearch = useViewChange<PlayerSearch>()
  const { choice, performance, player, fit, headings, changeSetup } = usePlayer(
    piece,
    search,
    setSearch,
  )
  const title = entryTitles(piece, locale).primary
  // The bar as written the cursor is in, and the cursor taken to one (ADR 0090).
  const bar = writtenBarAt(performance, player.practice.state.beatGroup)
  const { jumpToBeatGroup } = player.practice
  const goToBar = (written: number) => {
    const group = beatGroupInBar(performance, written)
    if (group !== null) jumpToBeatGroup(group)
  }
  // Opened at a bar (Practise from the editor's caret, ADR 0090): the cursor goes there, once, and
  // the URL forgets it, so the view remembered never holds it.
  const openAt = useEffectEvent((at: number) => {
    goToBar(at - 1)
    setSearch({ bar: undefined })
  })
  useEffect(() => {
    if (search.bar !== undefined) openAt(search.bar)
  }, [search.bar])
  return (
    <PlayerLayout
      title={title}
      onClose={close}
      view={search}
      player={player}
      performance={performance}
      headings={headings}
      // A song that hides its piano is a lead sheet (ADR 0083).
      piano={!isLeadSheet(piece)}
      // A piece written in degrees has the piano's staves alone.
      staves={isDegreePiece(piece) ? undefined : piece.staves}
      modes={
        // A piece written in degrees has no score to edit.
        isDegreePiece(piece) ? null : (
          <ModeSwitch pieceId={piece.id} mode="practise" bar={bar + 1} />
        )
      }
      chart={
        <PieceChart
          title={title}
          performance={performance}
          headings={headings}
          playing={bar}
          onBar={goToBar}
        />
      }
      setup={
        <PieceSetup
          piece={piece}
          choice={choice}
          fit={fit}
          swing={isCompound(piece.meter) ? null : search.swing}
          onChange={changeSetup}
          onSwing={player.setSwing}
        />
      }
    />
  )
}

/** A piece in the Player: the route's piece, its choices from the URL. */
export function PlayerPage() {
  const { pieceId } = useParams({ from: '/full-screen/play/$pieceId' })
  const { t } = useTranslation('common')
  const piece = useRepertoire().piece(pieceId)
  if (!piece) {
    // An own song deleted in another tab.
    return (
      <NotFound>
        <ButtonLink render={<Link to="/songs" />}>{t('notFound.toSongs')}</ButtonLink>
      </NotFound>
    )
  }
  return <PiecePlayer key={piece.id} piece={piece} />
}
