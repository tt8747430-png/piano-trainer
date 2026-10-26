import { Link, useNavigate } from '@tanstack/react-router'
import { Ellipsis, PencilLine, Play, RotateCcw, Share2, Target, Trash2 } from 'lucide-react'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { pieceStepId } from '@/entities/step'
import {
  entryTitles,
  isDegreePiece,
  isOwnSongId,
  musicOf,
  PieceFactCards,
  selectHasVersion,
  usePieces,
  type Piece,
} from '@/entities/piece'
import { FavouriteButton, useSongActions } from '@/features/manage-library'
import { LearnedButton } from '@/features/mark-learned'
import { ShareSaid, useShareSong } from '@/features/share-song'
import { OPEN_PLAINLY } from '@/shared/lib'
import { useLocale } from '@/shared/i18n'
import { ActionMenu, FabLink, FloatingActions, RoundLink } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { sectionPaint } from '../model/section-paint'
import { useSongLessons } from '../model/use-song-lessons'
import { PieceAbout } from './PieceAbout'
import { PieceByline } from './PieceByline'
import { PieceChords } from './PieceChords'
import { OwnMusicAsk } from './OwnMusicAsk'
import { PieceHeader } from './PieceHeader'
import { PlayAlong } from './PlayAlong'
import { SectionLessonGroups } from './SectionLessonGroups'
import { SectionRows } from './SectionRows'

/**
 * A piece with a chart, in one column: Learn the song (ADR 0100). Its bar (Back, the title, then
 * Edit the score, Learned, its ♡ (ADR 0103) and More: Move to… and Archive (Restore while it is
 * archived; a study is in no library, ADR 0106), Check these chords, and for
 * the learner's own music Share and its way back, asked first); under the title its byline (what else it is called, Your version, its
 * stage, who wrote it); its key, time and
 * tempo as cards; its chords as diagrams, each opening its sheet, and its sections, each a row to its
 * page of lessons (a song of one section has that section's lessons here, its chords to learn among
 * them); Play along, the whole song; then its note and the way to its key's scale. Its chart is the
 * Player's: the page shows no keys but a chord's sheet's. Practise floats in the thumb's reach,
 * opening the Player as it was left.
 */
export function PieceView({ piece }: { piece: Piece }) {
  const { t } = useTranslation('piece')
  const locale = useLocale()
  const own = isOwnSongId(piece.id) ? piece.id : null
  const hasVersion = usePieces((state) => selectHasVersion(state, piece.id))
  const title = entryTitles(piece, locale).primary
  const { performance, headings, sections } = useSongLessons(piece)
  const [only] = sections.length === 1 ? sections : []
  const shared = useShareSong()
  const [asking, setAsking] = useState(false)
  // More, which takes the focus back from a dialog it opened: the action chosen is folded away.
  const more = useRef<HTMLDivElement>(null)
  const step = pieceStepId(piece.id)
  const navigate = useNavigate()
  // A song's place in the library (ADR 0106); a study, on Practice, is in none.
  const library = useSongActions(piece)
  const inLibrary = piece.kind !== 'study'
  const ownMusic = own
    ? ({ kind: 'song', id: own, title } as const)
    : hasVersion
      ? ({ kind: 'version', id: piece.id, title } as const)
      : null
  const actions = [
    ...(inLibrary ? library.actions : []),
    // A piece of no chord symbol has none to check (ADR 0094).
    ...(performance.chords.length > 0
      ? [
          {
            key: 'check',
            label: t('checkChords'),
            icon: Target,
            onSelect: () => void navigate({ to: '/check', search: { of: step } }),
          },
        ]
      : []),
    ...(own && !isDegreePiece(piece)
      ? [
          {
            key: 'share',
            label: t('share'),
            icon: Share2,
            onSelect: () => shared.share({ title, music: musicOf(piece) }),
          },
        ]
      : []),
    ...(ownMusic
      ? [
          {
            key: 'back',
            label: t(ownMusic.kind === 'song' ? 'delete' : 'reset'),
            icon: ownMusic.kind === 'song' ? Trash2 : RotateCcw,
            destructive: true,
            onSelect: () => setAsking(true),
          },
        ]
      : []),
  ]

  return (
    <div className="flex flex-col gap-6 pb-4">
      <PieceHeader
        entry={piece}
        crowded
        actions={
          <>
            {isDegreePiece(piece) ? null : (
              <RoundLink
                label={t('edit')}
                icon={PencilLine}
                render={<Link to="/edit/$pieceId" params={{ pieceId: piece.id }} />}
              />
            )}
            {own ? null : <LearnedButton step={step} round />}
            {inLibrary ? <FavouriteButton piece={piece.id} /> : null}
            <div ref={more} className="contents">
              <ActionMenu
                label={t('more')}
                align="end"
                trigger={<Ellipsis aria-hidden />}
                render={
                  <Button
                    variant="surface"
                    size="icon"
                    className="rounded-full"
                    aria-label={t('more')}
                    title={t('more')}
                  />
                }
                actions={actions}
              />
            </div>
          </>
        }
      />
      <PieceByline piece={piece} />
      <ShareSaid said={shared.said} />
      <PieceFactCards piece={piece} />
      {/* A song of one section has its lessons here, its chords among them to learn. */}
      {only ? (
        <SectionLessonGroups
          piece={piece}
          performance={performance}
          lessons={only}
          paint={sectionPaint(headings[0] ?? '')}
        />
      ) : (
        <>
          <PieceChords performance={performance} />
          <SectionRows piece={piece} headings={headings} sections={sections} />
        </>
      )}
      <PlayAlong piece={piece} />
      <PieceAbout entry={piece} />
      {ownMusic ? (
        <OwnMusicAsk piece={ownMusic} open={asking} onOpenChange={setAsking} returnTo={more} />
      ) : null}
      {inLibrary ? library.sheet : null}
      <FloatingActions>
        <FabLink
          label={t('practise')}
          icon={Play}
          render={<Link to="/play/$pieceId" params={{ pieceId: piece.id }} state={OPEN_PLAINLY} />}
        />
      </FloatingActions>
    </div>
  )
}
