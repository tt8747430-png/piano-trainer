import { Link, useNavigate } from '@tanstack/react-router'
import { Ellipsis, PencilLine, Play, RotateCcw, Share2, Target, Trash2 } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BUILT_IN_PATTERNS } from '@/entities/pattern'
import { pieceStepId } from '@/entities/step'
import {
  entryTitles,
  isDegreePiece,
  isOwnSongId,
  musicOf,
  selectHasVersion,
  usePieceHeadings,
  usePieces,
  type Piece,
} from '@/entities/piece'
import { LearnedButton } from '@/features/mark-learned'
import { arrangePiece, ownChoice } from '@/features/practice'
import { ShareSaid, useShareSong } from '@/features/share-song'
import { OPEN_PLAINLY } from '@/shared/lib'
import { useLocale } from '@/shared/i18n'
import { ActionMenu, FabLink, FloatingActions, RoundLink } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { PieceAbout, PieceCredits } from './PieceAbout'
import { PieceFacts } from './PieceFacts'
import { PieceForm } from './PieceForm'
import { OwnMusicAsk } from './OwnMusicAsk'
import { PieceHeader } from './PieceHeader'

/**
 * A piece with a chart, in one column, saying what the song is (ADR 0098): its bar (Back, the title,
 * then Edit the score, Learned and More: Check these chords, and for the learner's own music Share
 * and its way back, asked first); its facts (key, time, tempo) and who wrote it; its form, the
 * sections in order, each opening the Player there; then its note and the way to its key's scale.
 * Its chords and chart are the Player's (with the sheet music off), so the page plays nothing and
 * shows no keys. Practise, what the page is for, floats in the thumb's reach.
 */
export function PieceView({ piece }: { piece: Piece }) {
  const { t } = useTranslation('piece')
  const locale = useLocale()
  const own = isOwnSongId(piece.id) ? piece.id : null
  const hasVersion = usePieces((state) => selectHasVersion(state, piece.id))
  const title = entryTitles(piece, locale).primary
  // As the Player plays it, its repeats taken: each section of the form loops the bars it plays.
  const performance = useMemo(
    () => arrangePiece(piece, ownChoice(piece), BUILT_IN_PATTERNS, { unfold: true }),
    [piece],
  )
  const headings = usePieceHeadings(piece)
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
      <PieceFacts entry={piece} />
      <PieceCredits entry={piece} />
      <ShareSaid said={shared.said} />
      <PieceForm pieceId={piece.id} performance={performance} headings={headings} />
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
