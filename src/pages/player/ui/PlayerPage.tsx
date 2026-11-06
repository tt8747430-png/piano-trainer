import { Link, useParams, useSearch } from '@tanstack/react-router'
import { Drum, Info, ListTree, PenLine } from 'lucide-react'
import { useEffect, useEffectEvent, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  entryTitles,
  isDegreePiece,
  isLeadSheet,
  isOwnSongId,
  isPiece,
  musicOf,
  selectHasVersion,
  usePieces,
  usePiecesStoreApi,
  useRepertoire,
  type Annotation,
  type Piece,
} from '@/entities/piece'
import { clearAnnotations, setAnnotation } from '@/features/annotate'
import { selectScoreView, useSettings } from '@/entities/settings'
import { PieceInversions } from '@/features/choose-diagram-inversion'
import {
  beatGroupInBar,
  isSingleStaff,
  stavesParam,
  trackOf,
  withTrack,
  writtenBarAt,
} from '@/features/practice'
import { singleStaff } from '@/shared/lib/notation'
import { ShareSaid, useShareSong, type SongToShare } from '@/features/share-song'
import { useSongExport } from '@/features/song-files'
import { useLocale } from '@/shared/i18n'
import { useUp, useSetSearch } from '@/shared/lib'
import { isCompound } from '@/shared/lib/music'
import { ButtonLink, NotFound, type MenuAction } from '@/shared/ui'
import { ScoreEditToggle } from '@/widgets/mode-switch'
import { SwingField, useScoreTracks } from '@/widgets/practice-player'
import type { PlayerSearch } from '../model/player-search'
import { sectionAt, sectionStarts } from '../model/section-starts'
import { usePlayer } from '../model/use-player'
import { usePlayerTakes } from '../model/use-player-takes'
import { PieceSetup } from './PieceSetup'
import { PlayerLayout } from './PlayerLayout'
import { SectionsSheet } from './SectionsSheet'
import { SongInfo } from './SongInfo'
import { ClefChoice } from './ClefChoice'
import { TransposeTool } from './TransposeTool'
import { VersionSheet, type VersionChoice } from './VersionSheet'
import { VersionTool } from './VersionTool'
import { AnnotateBar } from './AnnotateBar'

/** A song with no typed marks. */
const NO_MARKS: readonly Annotation[] = []

function PiecePlayer({ piece, own }: { piece: Piece; own: boolean }) {
  const { t } = useTranslation(['player', 'piece', 'songs', 'editor'])
  const locale = useLocale()
  const search = useSearch({ from: '/full-screen/play/$pieceId' })
  const close = useUp()
  const setSearch = useSetSearch<PlayerSearch>()
  const {
    choice,
    performance,
    player,
    fit,
    headings,
    controls,
    staves,
    simplifies,
    changeSetup,
    changeTrack,
  } = usePlayer(piece, search, setSearch)
  // The Version sheet (R29 B8): the learner's version or the app's, the voice's staves heard and
  // shown or not, at a level.
  const [versionOpen, setVersionOpen] = useState(false)
  const [transposing, setTransposing] = useState(false)
  // Annotate (R29 B8): the learner's typed marks, shown as Display says; the bar while marking.
  const pieces = usePiecesStoreApi()
  const marks = usePieces((state) => state.annotations[piece.id]) ?? NO_MARKS
  const marksShown = useSettings((state) => selectScoreView(state).annotations)
  const [annotating, setAnnotating] = useState(false)
  // The Rhythm game (R29 B8): a take judged on its timing alone, any key counting.
  const [rhythm, setRhythm] = useState(false)
  const singles = (performance.staves ?? []).map((_, place) => singleStaff(place))
  const solo =
    singles.length > 0 &&
    singles.every((id) => !trackOf(staves, id).play && !trackOf(staves, id).show)
  const chosenVersion: VersionChoice = {
    group: own && !search.app ? 'own' : solo || singles.length === 0 ? 'solo' : 'voice',
    version: choice.version,
  }
  const chooseVersion = ({ group, version }: VersionChoice) => {
    const voiced = group !== 'solo'
    const next = singles.reduce(
      (kept, id) => withTrack(kept, id, { play: voiced, show: voiced }),
      staves,
    )
    setSearch({
      version,
      app: own && group !== 'own' ? true : undefined,
      staves: group === 'own' ? search.staves : stavesParam(next),
    })
  }
  // The tracks the Setup lists: each staff by its name and clef, the piano's, the recording (A35).
  const tracks = useScoreTracks({
    staves: (performance.staves ?? []).map(({ clef }, place) => ({
      clef,
      name: isDegreePiece(piece) ? undefined : piece.staves?.[place]?.name,
    })),
    piano: !isLeadSheet(piece),
    recording: piece.recording !== undefined,
  })
  const title = entryTitles(piece, locale).primary
  // The bar as written the cursor is in, and the cursor taken to one (ADR 0115).
  const bar = writtenBarAt(performance, player.practice.state.beatGroup)
  const { jumpToBeatGroup } = player.practice
  const goToBar = (written: number) => {
    const group = beatGroupInBar(performance, written)
    if (group !== null) jumpToBeatGroup(group)
  }
  // The song's takes (R29 B8): recorded from the bar the cursor is in, judged against the music.
  const takes = usePlayerTakes(piece.id, performance, { bar, tempo: player.tempo, rhythm })
  // Opened at a bar (Practise from the editor's caret, ADR 0115): the cursor goes there, once, and
  // the URL forgets it, so the view remembered never holds it.
  const openAt = useEffectEvent((at: number) => {
    goToBar(at - 1)
    setSearch({ bar: undefined })
  })
  useEffect(() => {
    if (search.bar !== undefined) openAt(search.bar)
  }, [search.bar])
  // Its own acts in Settings (ADR 0108, 0107): the piece's information and its sections as sheets; Export…'s link
  // shares as its page does, saying so where the status line is.
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
        played: { transpose: search.transpose ?? 0, version: choice.version },
      }
    : isDegreePiece(piece)
      ? null
      : { kind: 'own', song: { title, music: musicOf(piece) } }
  const more: MenuAction[] = [
    {
      key: 'sections',
      label: t('player:sections.title'),
      icon: ListTree,
      onSelect: () => setShowing('sections'),
      disabled: starts.length < 2,
      reason: t(`player:sections.one.${piece.kind}`),
    },
    {
      key: 'info',
      label: t(`player:info.${piece.kind}`),
      icon: Info,
      onSelect: () => setShowing('info'),
    },
  ]
  // Its link, a way out in Export… as on its page (ADR 0107).
  const share = sharing
    ? {
        onSelect: () => shared.share(sharing),
      }
    : undefined
  const askView = useSettings((state) => selectScoreView(state).askOnOpen)
  const files = useSongExport(piece)
  return (
    // Its chords drawn in the inversions chosen for them in this piece (ADR 0108).
    <PieceInversions pieceId={piece.id}>
      <PlayerLayout
        title={title}
        credits={isDegreePiece(piece) ? undefined : piece.header}
        layout={isDegreePiece(piece) ? undefined : piece.layout}
        onClose={close}
        view={search}
        player={player}
        performance={performance}
        headings={headings}
        // A song that hides its piano is a lead sheet (ADR 0114).
        piano={!isLeadSheet(piece)}
        // A piece written in degrees has the piano's staves alone.
        staves={isDegreePiece(piece) ? undefined : piece.staves}
        recording={piece.recording}
        // Every piece is edited: one written in degrees as its chart in its key (ADR 0115).
        modes={<ScoreEditToggle pieceId={piece.id} editing={false} bar={bar + 1} />}
        setup={
          <PieceSetup
            piece={piece}
            controls={controls}
            choice={choice}
            fit={fit}
            swing={isCompound(piece.meter) ? null : search.swing}
            simple={choice.version === 'simple' && simplifies}
            tracks={tracks}
            staves={staves}
            onChange={changeSetup}
            onStaves={changeTrack}
            onSwing={player.setSwing}
          />
        }
        // Chordify's toolbar after the View (ADR 0105): the key the piece is played in, and Simplify.
        tools={
          <>
            <TransposeTool
              piece={piece}
              tonic={choice.tonic}
              signature={choice.signature}
              chordSymbols={choice.chordSymbols}
              onChange={changeSetup}
              open={transposing}
              onOpenChange={setTransposing}
            />
            {controls.has('simplify') ? (
              <VersionTool version={choice.version} onOpen={() => setVersionOpen(true)} />
            ) : null}
          </>
        }
        more={more}
        musicXml={files.musicXml}
        share={share}
        status={<ShareSaid said={shared.said} />}
        // Chordify's "Show this when opening a song" (ADR 0108): the View, to choose how it shows.
        openView={askView}
        display={
          isSingleStaff(piece) ? (
            <ClefChoice value={choice.clef} onChange={(clef) => changeSetup({ clef })} />
          ) : undefined
        }
        playback={
          !controls.has('accompaniment') && controls.has('swing') && !isCompound(piece.meter) ? (
            <SwingField swing={search.swing} onSwing={player.setSwing} />
          ) : undefined
        }
        takes={takes}
        annotations={marksShown || annotating ? marks : undefined}
        annotating={
          annotating ? (
            <AnnotateBar
              at={performance.beatGroups[player.practice.state.beatGroup]?.tick ?? 0}
              staves={isLeadSheet(piece) ? singles : ['treble', 'bass']}
              onMark={(mark) => setAnnotation(pieces, piece.id, mark)}
              onClear={(at, staff) => clearAnnotations(pieces, piece.id, at, staff)}
              onDone={() => setAnnotating(false)}
            />
          ) : null
        }
        // The music's own acts in the foot's More (R31-P): Annotate, and the Rhythm game.
        moreActs={[
          {
            key: 'annotations',
            part: 'practice',
            label: t('player:annotate.label'),
            icon: PenLine,
            onSelect: () => setAnnotating(true),
          },
          {
            key: 'rhythm',
            part: 'listening',
            label: t('player:rhythm.label'),
            icon: Drum,
            checked: rhythm,
            onSelect: () => setRhythm(!rhythm),
          },
        ]}
      />
      <SongInfo piece={piece} performance={performance} {...sheetOf('info')} />
      <VersionSheet
        open={versionOpen}
        onOpenChange={setVersionOpen}
        chosen={chosenVersion}
        own={own}
        voice={singles.length > 0}
        simplifies={simplifies}
        onChoose={chooseVersion}
      />
      <SectionsSheet
        starts={starts}
        headings={headings}
        current={sectionAt(performance, player.practice.state.beatGroup)}
        onGo={goToBar}
        {...sheetOf('sections')}
      />
    </PieceInversions>
  )
}

/** A piece in the Player: the route's piece, its choices from the URL. */
export function PlayerPage() {
  const { pieceId } = useParams({ from: '/full-screen/play/$pieceId' })
  const { t } = useTranslation('common')
  const { app } = useSearch({ from: '/full-screen/play/$pieceId' })
  const repertoire = useRepertoire()
  const own = usePieces((state) => selectHasVersion(state, pieceId))
  // The app's own song where the Version sheet chose it over the learner's version (R29 B8).
  const original = own && app ? repertoire.original(pieceId) : undefined
  const piece = original && isPiece(original) ? original : repertoire.piece(pieceId)
  if (!piece) {
    // An own song deleted in another tab.
    return (
      <NotFound>
        <ButtonLink render={<Link to="/songs" />}>{t('notFound.toSongs')}</ButtonLink>
      </NotFound>
    )
  }
  return <PiecePlayer key={piece.id} piece={piece} own={own} />
}
