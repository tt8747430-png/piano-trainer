import { Link, useNavigate } from '@tanstack/react-router'
import {
  Ellipsis,
  PencilLine,
  Play,
  Printer,
  RotateCcw,
  Share2,
  Target,
  Trash2,
} from 'lucide-react'
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
import { PinnedKeyboard } from '@/features/live-keyboard'
import { LearnedButton } from '@/features/mark-learned'
import { arrangePiece, loopParam, ownChoice, playerRange } from '@/features/practice'
import { ShareSaid, useShareSong } from '@/features/share-song'
import { OPEN_PLAINLY } from '@/shared/lib'
import { useLocale } from '@/shared/i18n'
import { ActionMenu, ButtonLink, FabLink, FloatingActions, NO_KEYS, RoundLink } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { ChordChart, useChartPlayback } from '@/widgets/chord-chart'
import { PieceChords } from '@/widgets/piece-chords'
import { PieceAbout, PieceCredits } from './PieceAbout'
import { PieceFacts } from './PieceFacts'
import { PieceForm } from './PieceForm'
import { OwnMusicAsk } from './OwnMusicAsk'
import { PieceHeader } from './PieceHeader'

/**
 * A piece with a chart, in one column, as a songbook's page reads: its bar (Back, the title, then Edit
 * the score, Learned and More: Check these chords, Print, and for the learner's own music Share and its
 * way back, asked first); its facts (key, time, tempo) and who wrote it; its form, the sections in
 * order, each a link to its place; the chords it plays and its chart by section, each section to
 * practise on its own, every chord and bar to tap and hear on its keys, docked as the keyboard settings
 * say; then its note and the way to its key's scale. Practise, what the page is for, floats in the
 * thumb's reach.
 */
export function PieceView({ piece }: { piece: Piece }) {
  const { t } = useTranslation('piece')
  const locale = useLocale()
  const own = isOwnSongId(piece.id) ? piece.id : null
  const hasVersion = usePieces((state) => selectHasVersion(state, piece.id))
  const title = entryTitles(piece, locale).primary
  const performance = useMemo(
    () => arrangePiece(piece, ownChoice(piece), BUILT_IN_PATTERNS),
    [piece],
  )
  const headings = usePieceHeadings(piece)
  const { playing, toggleBar } = useChartPlayback(performance, piece.tempo)
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

  return (
    <div className="flex flex-col gap-6 pb-4">
      <PieceHeader
        entry={piece}
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
                actions={[
                  {
                    key: 'check',
                    label: t('checkChords'),
                    icon: Target,
                    onSelect: () => void navigate({ to: '/check', search: { of: step } }),
                  },
                  // An installed app has no browser menu to print from.
                  {
                    key: 'print',
                    label: t('print'),
                    icon: Printer,
                    onSelect: () => window.print(),
                  },
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
                ]}
              />
            </div>
          </>
        }
      />
      <PieceFacts entry={piece} />
      <PieceCredits entry={piece} />
      <ShareSaid said={shared.said} />
      <PinnedKeyboard shown={NO_KEYS} range={playerRange(performance)} className="print:hidden" />
      <PieceForm performance={performance} headings={headings} />
      <div className="print:hidden">
        <PieceChords performance={performance} />
      </div>
      <section className="flex flex-col gap-3">
        <h2 className="text-2xl">{t('chart')}</h2>
        <ChordChart
          performance={performance}
          headings={headings}
          onBar={toggleBar}
          playing={playing}
          sectionAction={(bars, section) => (
            <ButtonLink
              variant="outline"
              className="rounded-full print:hidden"
              aria-label={t('practiseSectionOf', { section: headings[section] ?? '' })}
              render={
                <Link
                  to="/play/$pieceId"
                  params={{ pieceId: piece.id }}
                  search={{ loop: loopParam(bars) }}
                  state={OPEN_PLAINLY}
                />
              }
            >
              <Play data-icon="inline-start" aria-hidden />
              {t('practiseSection')}
            </ButtonLink>
          )}
        />
      </section>
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
