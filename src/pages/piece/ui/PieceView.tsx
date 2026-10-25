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
  selectHasVersion,
  usePieces,
  type Piece,
} from '@/entities/piece'
import { LearnedButton } from '@/features/mark-learned'
import { ShareSaid, useShareSong } from '@/features/share-song'
import { OPEN_PLAINLY } from '@/shared/lib'
import { useLocale } from '@/shared/i18n'
import { ActionMenu, FabLink, FloatingActions, RoundLink } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { sectionPaint } from '../model/section-paint'
import { useSongLessons } from '../model/use-song-lessons'
import { LearnCard } from './LearnCard'
import { PieceAbout, PieceCredits } from './PieceAbout'
import { PieceFactCards } from './PieceFactCards'
import { OwnMusicAsk } from './OwnMusicAsk'
import { PieceHeader } from './PieceHeader'
import { PlayAlong } from './PlayAlong'
import { SectionLessonGroups } from './SectionLessonGroups'
import { SectionRows } from './SectionRows'

/**
 * A piece with a chart, in one column: Learn the song (ADR 0100). Its bar (Back, the title, then
 * Edit the score, Learned and More: Check these chords, and for the learner's own music Share and
 * its way back, asked first); the learning card, where to go next and its lessons done; its key, time
 * and tempo as cards, and who wrote it; its sections, each a row to its page of lessons (a song of
 * one section shows that section's lessons here); Play along, the whole song; then its note and the
 * way to its key's scale. Its chords and chart are the Player's, so the page plays nothing and shows
 * no keys. Practise floats in the thumb's reach, opening the Player as it was left.
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
  const ownMusic = own
    ? ({ kind: 'song', id: own, title } as const)
    : hasVersion
      ? ({ kind: 'version', id: piece.id, title } as const)
      : null
  const actions = [
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
            {/* More holds nothing for a catalog song of no chord symbol: then it is not there. */}
            {actions.length > 0 ? (
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
            ) : null}
          </>
        }
      />
      <LearnCard piece={piece} headings={headings} sections={sections} />
      <PieceFactCards piece={piece} />
      <PieceCredits entry={piece} />
      <ShareSaid said={shared.said} />
      {/*
       * CHORDS (spec §3.1, round 3's chord part): the chord summary, headed "Chords", each chord's
       * diagram opening its `ChordSheet` (`ChordSummary` from `widgets/chord-diagrams`), goes here
       * once the diagrams are in; a piece of no chord symbol has none.
       */}
      {only ? (
        <SectionLessonGroups piece={piece} lessons={only} paint={sectionPaint(headings[0] ?? '')} />
      ) : (
        <SectionRows piece={piece} headings={headings} sections={sections} />
      )}
      <PlayAlong piece={piece} />
      <PieceAbout entry={piece} />
      {ownMusic ? (
        <OwnMusicAsk piece={ownMusic} open={asking} onOpenChange={setAsking} returnTo={more} />
      ) : null}
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
