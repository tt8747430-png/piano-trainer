import { useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Credits, entryTitles, shownCredits, type Piece } from '@/entities/piece'
import { useLocale } from '@/shared/i18n'
import { useElementSize } from '@/shared/lib'
import { LazyScoreView } from '@/shared/ui'
import { LabelRow, labelRow, labelScale } from '@/shared/ui/score'
import { openingScore } from '../model/incipit'

/** The bars on each line of the first page, as the Song board's cover sets them: three, then three, then two. */
const BARS_A_LINE = 3

/** The lines the first page shows: the opening, enough to know and start the song by. */
const LINES = 3

/** The bars the first page holds: the opening eight (a pickup counts as one), as the board's cover. */
const OPENING = 8

/** The engraving's staff, as the Song board's cover draws it at both sizes (`COVER_BIG`): a staff space of 8 px. */
const SCALE = 0.8

/**
 * A song's page's cover (canvas 125, R39-2): its first page as printed, on white paper: the title
 * centred in serif, its credits on their own line under it at the right as the editor prints
 * them ("Words: John Newton · Music: New Britain"), then its opening lines engraved with their
 * chords and words, so the music is the picture.
 */
export function PieceFirstPage({ piece }: { piece: Piece }) {
  const { t } = useTranslation('piece')
  const locale = useLocale()
  const box = useRef<HTMLDivElement>(null)
  const { width } = useElementSize(box)
  const score = useMemo(() => openingScore(piece, OPENING), [piece])
  const lines = Array.from({ length: LINES }, (_, index) => ({
    ...score,
    measures: score.measures.slice(index * BARS_A_LINE, (index + 1) * BARS_A_LINE),
  })).filter((line) => line.measures.length > 0)
  const time = score.measures[0]?.time
  const credits = shownCredits(piece)
  const scale = SCALE
  // The chord symbols' row over each line, as the Player prints it (canvas 125: G over its bar).
  const row = labelRow(true, scale)
  return (
    <figure
      role="img"
      aria-label={t('firstPage')}
      className="card flex flex-col gap-1 p-4 shadow-[0_0_0_1px_var(--color-border),0_14px_30px_-18px_color-mix(in_oklab,var(--shade)_45%,transparent)]"
    >
      <div aria-hidden className="flex flex-col gap-0.5">
        <span className="text-center font-display text-lg">
          {entryTitles(piece, locale).primary}
        </span>
        {credits.length > 0 ? (
          <Credits
            credits={credits}
            className="truncate text-right text-xs text-muted-foreground"
          />
        ) : null}
      </div>
      <div ref={box} aria-hidden className="flex flex-col">
        {width > 0
          ? lines.map((line, index) => (
              <div key={index} style={{ paddingTop: row }}>
                <LazyScoreView
                  score={line}
                  scale={scale}
                  fill={width}
                  {...(index > 0 && time ? { timeBefore: time } : {})}
                >
                  {(layout) => (
                    <LabelRow
                      layout={layout}
                      labels={[]}
                      headings={[]}
                      chords={line.measures.flatMap((measure) =>
                        measure.chords.map((chord) => ({
                          startTick: chord.tick,
                          symbol: chord.symbol,
                        })),
                      )}
                      meter={line.meter}
                      row={row}
                      size={labelScale(scale)}
                    />
                  )}
                </LazyScoreView>
              </div>
            ))
          : null}
      </div>
    </figure>
  )
}
