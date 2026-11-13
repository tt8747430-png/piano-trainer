import { useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { entryTitles, shownCredits, type Piece } from '@/entities/piece'
import { useLocale } from '@/shared/i18n'
import { useElementSize } from '@/shared/lib'
import { LazyScoreView } from '@/shared/ui'
import { openingScore } from '../model/incipit'

/** The bars on each line of the first page: two, as a phone's page holds them legibly. */
const BARS_A_LINE = 2

/** The lines the first page shows: the opening, enough to know and start the song by. */
const LINES = 3

/** The engraving's scale per pixel of the page's width: a 360 px page draws at 0.6. */
const SCALE_PER_PX = 1 / 600

/**
 * A song's page's cover (canvas 125, R39-2): its first page as printed, on white paper: the title
 * centred in serif, who wrote the music at its right, then its opening lines engraved with their
 * chords and words, so the music is the picture.
 */
export function PieceFirstPage({ piece }: { piece: Piece }) {
  const { t } = useTranslation('piece')
  const locale = useLocale()
  const box = useRef<HTMLDivElement>(null)
  const { width } = useElementSize(box)
  const score = useMemo(() => openingScore(piece, BARS_A_LINE * LINES), [piece])
  const lines = Array.from({ length: LINES }, (_, index) => ({
    ...score,
    measures: score.measures.slice(index * BARS_A_LINE, (index + 1) * BARS_A_LINE),
  })).filter((line) => line.measures.length > 0)
  const time = score.measures[0]?.time
  const [writer] = shownCredits(piece)
  return (
    <figure
      role="img"
      aria-label={t('firstPage')}
      className="card flex flex-col gap-1 px-4 pt-4 pb-3"
    >
      <div aria-hidden className="grid grid-cols-[1fr_auto_1fr] items-baseline gap-2">
        <span />
        <span className="font-display text-lg">{entryTitles(piece, locale).primary}</span>
        <span className="truncate text-right text-xs">
          {writer && 'names' in writer ? writer.names : null}
        </span>
      </div>
      <div ref={box} aria-hidden className="flex flex-col">
        {width > 0
          ? lines.map((line, index) => (
              <LazyScoreView
                key={index}
                score={line}
                scale={width * SCALE_PER_PX}
                fill={width}
                {...(index > 0 && time ? { timeBefore: time } : {})}
              />
            ))
          : null}
      </div>
    </figure>
  )
}
