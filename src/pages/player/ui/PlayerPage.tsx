import { Link, useParams, useSearch } from '@tanstack/react-router'
import { Info, Share2 } from 'lucide-react'
import { useEffect, useEffectEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  entryTitles,
  isDegreePiece,
  isLeadSheet,
  isOwnSongId,
  musicOf,
  useRepertoire,
  type Piece,
} from '@/entities/piece'
import { selectScoreView, useSettings } from '@/entities/settings'
import { useAddToSetlist, useFavouriteAction } from '@/features/manage-library'
import { PieceInversions } from '@/features/choose-diagram-inversion'
import { beatGroupInBar, writtenBarAt } from '@/features/practice'
import { ShareSaid, useShareSong } from '@/features/share-song'
import { useLocale } from '@/shared/i18n'
import { useViewChange } from '@/shared/lib'
import { isCompound } from '@/shared/lib/music'
import { ButtonLink, NotFound } from '@/shared/ui'
import { ModeSwitch } from '@/widgets/mode-switch'
import { useClose } from '../model/use-close'
import type { PlayerSearch } from '../model/player-search'
import { usePlayer } from '../model/use-player'
import { MoreActions } from './more-actions'
import { PieceSetup } from './PieceSetup'
import { PlayerLayout } from './PlayerLayout'
import { SimplifyTool } from './SimplifyTool'
import { SongInfo } from './SongInfo'
import { TransposeTool } from './TransposeTool'

function PiecePlayer({ piece }: { piece: Piece }) {
  const { t } = useTranslation(['player', 'piece'])
  const locale = useLocale()
  const search = useSearch({ from: '/full-screen/play/$pieceId' })
  const close = useClose(piece)
  const setSearch = useViewChange<PlayerSearch>()
  const { choice, performance, player, fit, headings, simplifies, changeSetup, simplify } =
    usePlayer(piece, search, setSearch)
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
  // More's own (ADR 0099): the piece's information as a sheet, and an own song's Share, as its page
  // shares it, saying so where the status line is.
  const [showingInfo, setShowingInfo] = useState(false)
  const shared = useShareSong()
  const sharing = isOwnSongId(piece.id) && !isDegreePiece(piece)
  // Its place in the learner's library (ADR 0103), first in More.
  const favourite = useFavouriteAction(piece.id)
  const setlist = useAddToSetlist(piece.id)
  const askView = useSettings((state) => selectScoreView(state).askOnOpen)
  return (
    // Its chords drawn in the inversions chosen for them in this piece (ADR 0101).
    <PieceInversions pieceId={piece.id}>
      <MoreActions value={[favourite, setlist.action]}>
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
          setup={
            <PieceSetup
              piece={piece}
              choice={choice}
              fit={fit}
              swing={isCompound(piece.meter) ? null : search.swing}
              simple={choice.simple && simplifies}
              onChange={changeSetup}
              onSwing={player.setSwing}
            />
          }
          // Chordify's toolbar after the View (ADR 0104): the key the piece is played in, and Simplify.
          tools={
            <>
              <TransposeTool
                piece={piece}
                tonic={choice.tonic}
                onChange={(key) => changeSetup({ key })}
              />
              <SimplifyTool on={choice.simple} simplifies={simplifies} onChange={simplify} />
            </>
          }
          info={{
            key: 'info',
            label: t(`player:info.${piece.kind}`),
            icon: Info,
            onSelect: () => setShowingInfo(true),
          }}
          share={
            sharing
              ? {
                  key: 'share',
                  label: t('piece:share'),
                  icon: Share2,
                  onSelect: () => shared.share({ title, music: musicOf(piece) }),
                }
              : undefined
          }
          status={sharing ? <ShareSaid said={shared.said} /> : null}
          // Chordify's "Show this when opening a song" (ADR 0102): the View, to choose how it shows.
          openView={askView}
        />
        <SongInfo
          piece={piece}
          performance={performance}
          open={showingInfo}
          onOpenChange={setShowingInfo}
        />
        {setlist.sheet}
      </MoreActions>
    </PieceInversions>
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
