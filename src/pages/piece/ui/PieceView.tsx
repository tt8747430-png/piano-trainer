import { Link } from '@tanstack/react-router'
import { Play } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { pieceStepId } from '@/entities/path'
import { entryTitles, usePieceHeadings, type Piece } from '@/entities/piece'
import { LiveKeyboard } from '@/features/live-keyboard'
import { LearnedToggle } from '@/features/mark-learned'
import { arrangePiece, ownChoice, playerRange } from '@/features/practice'
import { useLocale } from '@/shared/i18n'
import { audibleHands, barSounds } from '@/shared/lib/schedule'
import { usePlay } from '@/shared/lib/services'
import { ButtonLink, Pinned } from '@/shared/ui'
import { ChordChart } from '@/widgets/chord-chart'
import { PieceSkills } from '@/widgets/piece-skills'
import { PieceFacts } from './PieceFacts'

/**
 * A piece with a chart: its facts, Practise and the learned toggle, its chords, and the chart to
 * tap and hear, under a pinned keyboard that shows what sounds.
 */
export function PieceView({ piece }: { piece: Piece }) {
  const { t } = useTranslation(['piece', 'common'])
  const play = usePlay()
  const locale = useLocale()
  const performance = useMemo(() => arrangePiece(piece, ownChoice(piece)), [piece])
  const headings = usePieceHeadings(piece)
  const hearBar = (bar: number) =>
    play(barSounds(performance, bar, { tempo: piece.tempo, hands: audibleHands('both') }))

  return (
    <div className="flex flex-col gap-8 pb-4">
      <PieceFacts entry={piece} />
      <div className="flex flex-wrap items-center gap-3">
        <ButtonLink
          size="pill"
          className="flex-1"
          render={<Link to="/play/$pieceId" params={{ pieceId: piece.id }} />}
        >
          <Play data-icon="inline-start" />
          {t('piece:practise')}
        </ButtonLink>
        <LearnedToggle
          step={pieceStepId(piece.id)}
          title={entryTitles(piece, locale).primary}
          variant="text"
        />
      </div>
      <PieceSkills piece={piece} performance={performance} />
      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-bold">{t('piece:chart')}</h2>
        <Pinned>
          <LiveKeyboard
            label={t('common:keyboard')}
            range={playerRange(performance)}
            className="h-32"
          />
        </Pinned>
        <ChordChart
          performance={performance}
          headings={headings}
          meter={piece.meter}
          layout="lines"
          onBar={hearBar}
        />
      </section>
    </div>
  )
}
