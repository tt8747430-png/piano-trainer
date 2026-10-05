import { BUILT_IN_PATTERNS } from '@/entities/pattern'
import { Link } from '@tanstack/react-router'
import { PencilLine, Play } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { pieceStepId } from '@/entities/path'
import {
  entryTitles,
  isDegreePiece,
  isOwnSongId,
  selectHasVersion,
  usePieceHeadings,
  usePieces,
  type Piece,
} from '@/entities/piece'
import { LiveKeyboard } from '@/features/live-keyboard'
import { LearnedButton } from '@/features/mark-learned'
import { arrangePiece, ownChoice, playerRange } from '@/features/practice'
import { audibleHands, barSounds } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'
import { useLocale } from '@/shared/i18n'
import { ButtonLink, Pinned } from '@/shared/ui'
import { ChordChart } from '@/widgets/chord-chart'
import { PieceChords } from '@/widgets/piece-chords'
import { PieceAbout } from './PieceAbout'
import { PieceFacts } from './PieceFacts'
import { OwnMusicActions } from './OwnMusicActions'
import { PieceHeader } from './PieceHeader'
import { OPEN_PLAINLY } from '@/shared/lib'

/**
 * A piece with a chart, in one column: its facts, Practise with the learned toggle and Edit on one
 * line (Edit its pencil alone on a phone), the
 * keyboard pinned, showing what sounds, over the chords it plays and its chart, each to tap and hear;
 * then what is printed about it and, for the learner's own music, its way back.
 */
export function PieceView({ piece }: { piece: Piece }) {
  const { t } = useTranslation('piece')
  const locale = useLocale()
  const playback = usePlayback<number>()
  const own = isOwnSongId(piece.id) ? piece.id : null
  const hasVersion = usePieces((state) => selectHasVersion(state, piece.id))
  const title = entryTitles(piece, locale).primary
  const performance = useMemo(
    () => arrangePiece(piece, ownChoice(piece), BUILT_IN_PATTERNS),
    [piece],
  )
  const headings = usePieceHeadings(piece)
  const toggleBar = (bar: number) =>
    playback.toggle(bar, () =>
      barSounds(performance, bar, { tempo: piece.tempo, hands: audibleHands('both') }),
    )

  return (
    <div className="flex flex-col gap-6 pb-4">
      <PieceHeader entry={piece} />
      <PieceFacts entry={piece} />
      <div className="flex items-center gap-3">
        <ButtonLink
          size="pill"
          className="min-w-0 flex-1 sm:max-w-xs"
          render={<Link to="/play/$pieceId" params={{ pieceId: piece.id }} state={OPEN_PLAINLY} />}
        >
          <Play data-icon="inline-start" />
          {t('practise')}
        </ButtonLink>
        {own ? null : <LearnedButton step={pieceStepId(piece.id)} />}
        {isDegreePiece(piece) ? null : (
          <ButtonLink
            variant="outline"
            aria-label={t('edit')}
            className="max-sm:w-11 max-sm:px-0"
            render={<Link to="/edit/$pieceId" params={{ pieceId: piece.id }} />}
          >
            <PencilLine aria-hidden data-icon="inline-start" />
            <span className="max-sm:hidden">{t('edit')}</span>
          </ButtonLink>
        )}
      </div>
      <Pinned>
        <LiveKeyboard range={playerRange(performance)} spotlight />
      </Pinned>
      <PieceChords piece={piece} performance={performance} />
      <section className="flex flex-col gap-3">
        <h2 className="text-2xl">{t('chart')}</h2>
        <ChordChart
          performance={performance}
          headings={headings}
          onBar={toggleBar}
          playing={playback.playing}
        />
      </section>
      <PieceAbout entry={piece} />
      {own ? (
        <div className="flex">
          <OwnMusicActions piece={{ kind: 'song', id: own, title }} />
        </div>
      ) : hasVersion ? (
        <div className="flex">
          <OwnMusicActions piece={{ kind: 'version', id: piece.id, title }} />
        </div>
      ) : null}
    </div>
  )
}
