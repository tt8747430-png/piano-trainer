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
  // Opened at a bar (Practise from the editor's caret, ADR 0090): the cursor goes there, once, and
  // the URL forgets it, so the view remembered never holds it.
  const { jumpToBeatGroup } = player.practice
  const openAt = useEffectEvent((bar: number) => {
    const group = beatGroupInBar(performance, bar - 1)
    if (group !== null) jumpToBeatGroup(group)
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
      modes={
        // A piece written in degrees has no score to edit.
        isDegreePiece(piece) ? null : (
          <ModeSwitch
            pieceId={piece.id}
            mode="practise"
            bar={writtenBarAt(performance, player.practice.state.beatGroup) + 1}
          />
        )
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
