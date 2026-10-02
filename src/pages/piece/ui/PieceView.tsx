import { BUILT_IN_PATTERNS } from '@/entities/pattern'
import { Link } from '@tanstack/react-router'
import { PencilLine, Play } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { pieceStepId } from '@/entities/path'
import {
  entryTitles,
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
import { PieceSkills } from '@/widgets/piece-skills'
import { PieceFacts } from './PieceFacts'
import { OwnMusicActions } from './OwnMusicActions'
import { PieceHeader } from './PieceHeader'
import { OPEN_PLAINLY } from '@/shared/lib'

/**
 * A piece with a chart: its facts, Practise and the learned toggle, its chords, and the chart to
 * tap and hear, under a pinned keyboard that shows what sounds.
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
    <div className="flex flex-col pb-4">
      <PieceHeader entry={piece} />
      <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start lg:gap-x-10">
        {/* On a laptop the facts stay beside the chart, under the screen's bar while it shows. */}
        <div className="flex flex-col gap-8 lg:sticky lg:top-screen-bar-8">
          <PieceFacts entry={piece} />
          <div className="flex flex-wrap items-center gap-3">
            <ButtonLink
              size="pill"
              className="flex-1"
              render={
                <Link to="/play/$pieceId" params={{ pieceId: piece.id }} state={OPEN_PLAINLY} />
              }
            >
              <Play data-icon="inline-start" />
              {t('practise')}
            </ButtonLink>
            {own ? null : <LearnedButton step={pieceStepId(piece.id)} />}
            {piece.kind === 'progression' ? null : (
              <ButtonLink
                variant="outline"
                render={<Link to="/edit/$pieceId" params={{ pieceId: piece.id }} />}
              >
                <PencilLine data-icon="inline-start" />
                {t('edit')}
              </ButtonLink>
            )}
          </div>
          {own ? (
            <div className="flex">
              <OwnMusicActions piece={{ kind: 'song', id: own, title }} />
            </div>
          ) : hasVersion ? (
            <div className="flex">
              <OwnMusicActions piece={{ kind: 'version', id: piece.id, title }} />
            </div>
          ) : null}
          <PieceSkills piece={piece} performance={performance} />
        </div>
        <section className="flex flex-col gap-3 lg:pt-4">
          <h2 className="text-2xl">{t('chart')}</h2>
          <Pinned>
            <LiveKeyboard range={playerRange(performance)} spotlight />
          </Pinned>
          <ChordChart
            performance={performance}
            headings={headings}
            onBar={toggleBar}
            playing={playback.playing}
          />
        </section>
      </div>
    </div>
  )
}
