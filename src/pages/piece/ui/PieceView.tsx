import { Link } from '@tanstack/react-router'
import { Play } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { entryTitles, useSectionHeading, type Piece } from '@/entities/piece'
import { LearnedToggle } from '@/features/mark-learned'
import { arrangePiece, ownChoice } from '@/features/practice'
import { useLocale } from '@/shared/i18n'
import { audibleHands, barSounds } from '@/shared/lib/schedule'
import { usePlay } from '@/shared/lib/services'
import { ButtonLink } from '@/shared/ui'
import { ChordChart } from '@/widgets/chord-chart'
import { PieceSkills } from '@/widgets/piece-skills'
import { PieceFacts } from './PieceFacts'

/** A piece with a chart: its facts, its chords, the chart to tap and hear, Practise and the learned toggle. */
export function PieceView({ piece }: { piece: Piece }) {
  const { t } = useTranslation('piece')
  const heading = useSectionHeading()
  const play = usePlay()
  const locale = useLocale()
  const performance = useMemo(() => arrangePiece(piece, ownChoice(piece)), [piece])
  const headings = piece.kind === 'progression' ? [t('progression')] : piece.sections.map(heading)
  const hearBar = (bar: number) =>
    play(barSounds(performance, bar, { tempo: piece.tempo, hands: audibleHands('both') }))

  return (
    <div className="flex flex-col gap-8 pb-4">
      <PieceFacts entry={piece} />
      <PieceSkills piece={piece} performance={performance} />
      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-bold">{t('chart')}</h2>
        <ChordChart
          performance={performance}
          headings={headings}
          meter={piece.meter}
          layout="lines"
          onBar={hearBar}
        />
      </section>
      <div className="flex flex-wrap items-center gap-3">
        <ButtonLink
          size="pill"
          className="flex-1"
          render={<Link to="/play/$pieceId" params={{ pieceId: piece.id }} />}
        >
          <Play data-icon="inline-start" />
          {t('practise')}
        </ButtonLink>
        <LearnedToggle
          step={`piece:${piece.id}`}
          title={entryTitles(piece, locale).primary}
          variant="text"
        />
      </div>
    </div>
  )
}
