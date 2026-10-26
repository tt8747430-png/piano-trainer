import { Link, useParams, useSearch } from '@tanstack/react-router'
import { Info, ListTree, Share2 } from 'lucide-react'
import { useEffect, useEffectEvent, useMemo, useState } from 'react'
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
import { useFavouriteAction, useSongActions } from '@/features/manage-library'
import { PieceInversions } from '@/features/choose-diagram-inversion'
import { beatGroupInBar, writtenBarAt } from '@/features/practice'
import { ShareSaid, useShareSong, type SongToShare } from '@/features/share-song'
import { useLocale } from '@/shared/i18n'
import { useViewChange } from '@/shared/lib'
import { isCompound, noteParam } from '@/shared/lib/music'
import { ButtonLink, NotFound, type MenuAction } from '@/shared/ui'
import { ModeSwitch } from '@/widgets/mode-switch'
import { useClose } from '../model/use-close'
import type { PlayerSearch } from '../model/player-search'
import { sectionAt, sectionStarts } from '../model/section-starts'
import { usePlayer } from '../model/use-player'
import { MoreActions } from './more-actions'
import { PieceSetup } from './PieceSetup'
import { PlayerLayout } from './PlayerLayout'
import { SectionsSheet } from './SectionsSheet'
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
  // More's own (ADR 0099, 0107): the piece's information and its sections as sheets, and Share, as
  // its page shares it, saying so where the status line is.
  const [showing, setShowing] = useState<'info' | 'sections' | null>(null)
  const sheetOf = (sheet: 'info' | 'sections') => ({
    open: showing === sheet,
    onOpenChange: (open: boolean) => setShowing(open ? sheet : null),
  })
  const starts = useMemo(() => sectionStarts(performance), [performance])
  const shared = useShareSong()
  // An own song carries its music, one of the app's is a link to itself as it is played.
  const sharing: SongToShare | null = !isOwnSongId(piece.id)
    ? {
        kind: 'piece',
        id: piece.id,
        title,
        played: { key: noteParam(choice.tonic), simple: choice.simple && simplifies },
      }
    : isDegreePiece(piece)
      ? null
      : { kind: 'own', song: { title, music: musicOf(piece) } }
  const more: MenuAction[] = [
    {
      key: 'info',
      label: t(`player:info.${piece.kind}`),
      icon: Info,
      onSelect: () => setShowing('info'),
    },
    {
      key: 'sections',
      label: t('player:sections.title'),
      icon: ListTree,
      onSelect: () => setShowing('sections'),
      disabled: starts.length < 2,
      reason: t(`player:sections.one.${piece.kind}`),
    },
    ...(sharing
      ? [
          {
            key: 'share',
            label: t('piece:share'),
            icon: Share2,
            onSelect: () => shared.share(sharing),
          },
        ]
      : []),
  ]
  // Its place in the learner's library (ADR 0106), first in More; a study is in none.
  const favourite = useFavouriteAction(piece.id)
  const library = useSongActions(piece)
  const inLibrary = piece.kind !== 'study'
  const askView = useSettings((state) => selectScoreView(state).askOnOpen)
  return (
    // Its chords drawn in the inversions chosen for them in this piece (ADR 0101).
    <PieceInversions pieceId={piece.id}>
      <MoreActions value={inLibrary ? [favourite, ...library.actions] : []}>
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
          recording={piece.recording}
          // Every piece is edited: one written in degrees as its chart in its key (ADR 0110).
          modes={<ModeSwitch pieceId={piece.id} mode="practise" bar={bar + 1} />}
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
          more={more}
          status={<ShareSaid said={shared.said} />}
          // Chordify's "Show this when opening a song" (ADR 0102): the View, to choose how it shows.
          openView={askView}
        />
        <SongInfo piece={piece} performance={performance} {...sheetOf('info')} />
        <SectionsSheet
          starts={starts}
          headings={headings}
          current={sectionAt(performance, player.practice.state.beatGroup)}
          onGo={goToBar}
          {...sheetOf('sections')}
        />
        {inLibrary ? library.sheet : null}
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
