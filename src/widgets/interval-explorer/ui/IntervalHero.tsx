import { Play, Square } from 'lucide-react'
import { useLayoutEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocale } from '@/shared/i18n'
import { useElementSize } from '@/shared/lib'
import { INTERVALS, spanInterval } from '@/shared/lib/music'
import type { notate } from '@/shared/lib/notation'
import { InfoTip, LazyScoreView } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { INVERSIONS, type RowInterval } from '../model/interval-rows'
import { intervalSongs } from '../model/interval-songs'
import { useIntervalName } from './use-interval-name'

/** The width at which the engraving's lines stand the board's 7 units apart (11 at 370): its scale 1. */
const STAFF_WIDTH = 343
/** The board's room is 238 units wide and its staff's top line 48 under its top (`STAFF61`). */
const TOP_LINE = 48 / 238

/** Hands the engraving's top line up to the hero once it is drawn, to stand it where the board does. */
function TopLine({ at, onAt }: { at: number; onAt: (at: number) => void }) {
  useLayoutEffect(() => onAt(at), [at, onAt])
  return null
}

/**
 * The interval chosen, the page's subject (canvas 170): its name and, behind its ⓘ, what it sounds
 * like, a song it falls in and what it inverts to (its size and notes are the keys' and the tiles');
 * then its staff on the paper and the song it sounds like, with Hear it.
 */
export function IntervalHero({
  name,
  score,
  playing,
  onPlay,
}: {
  name: RowInterval
  score: ReturnType<typeof notate>
  playing: boolean
  onPlay: () => void
}) {
  const { t } = useTranslation('practice')
  const locale = useLocale()
  const staff = useRef<HTMLElement>(null)
  const { width } = useElementSize(staff)
  const [topLine, setTopLine] = useState<number>()
  const said = useIntervalName()
  const { title } = said(name)
  const songs = intervalSongs(name)
  const inverse = INVERSIONS[name]
  // The ⓘ says what Sounds like and the keys do not: the song it falls in, and what it inverts to.
  const facts: { label: string; value: string }[] = []
  if (songs?.down)
    facts.push({ label: t('intervals.songsDown'), value: songs.down[locale].join(' · ') })
  if (inverse) facts.push({ label: t('intervals.inverts'), value: said(inverse).title })
  // A compound interval sounds as its simple one an octave wider, as the board says it (r41_practice).
  const { semitones } = INTERVALS[name]
  const heard =
    songs?.up[locale][0] ??
    (semitones === 24
      ? t('intervals.twoOctaves')
      : semitones > 12
        ? t('intervals.octaveWider', {
            name: said(spanInterval(semitones - 12)).title.toLocaleLowerCase(locale),
          })
        : undefined)
  return (
    <section aria-labelledby="interval-chosen" className="flex flex-col gap-2 lg:gap-3">
      <div className="flex items-center gap-0.5">
        <h2
          id="interval-chosen"
          className="font-serif text-[2.25rem] leading-[1.1] font-bold tracking-[-0.02em] text-balance"
        >
          {title}
        </h2>
        <InfoTip name={title} className="ms-2 [&_svg]:size-5">
          <div className="flex flex-col gap-3">
            <p className="text-pretty">{t(`intervals.meaning.${name}`)}</p>
            <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1.5">
              {facts.map(({ label, value }) => (
                <div key={label} className="contents">
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="font-semibold">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </InfoTip>
      </div>
      {/* The page's subject (canvas, "The interval leads Intervals"): its notes on the staff at
          reading size on the paper, no card round it, what it sounds like and Hear it under it. */}
      <figure className="flex flex-col gap-3">
        {/* The staff spans the column, to the board's 560 (`STAFF61`), its two notes spread along it, in
            the board's picture: a room 238 by 102 of its units, 7 between the lines, so it grows with the
            width (159 tall at 370, 240 at 560). Its top line stands where the board's does, the room above it
            kept for notes over the staff, so the staff holds still whichever interval it shows. */}
        <section
          ref={staff}
          aria-label={t('intervals.written')}
          className="mx-auto flex aspect-[238/102] w-full max-w-140 min-w-40 items-start justify-center"
          style={
            topLine === undefined
              ? undefined
              : { paddingTop: Math.max(0, width * TOP_LINE - topLine) }
          }
        >
          {width > 0 ? (
            <LazyScoreView score={score} fill={width} scale={width / STAFF_WIDTH}>
              {(layout) => <TopLine at={layout.staffTop} onAt={setTopLine} />}
            </LazyScoreView>
          ) : null}
        </section>
        <div className="flex items-center gap-3">
          <div className="flex min-w-0 flex-1 flex-col">
            {heard ? (
              <>
                <span className="text-sm text-muted-foreground">{t('intervals.soundsLike')}</span>
                <span className="font-semibold">{heard}</span>
              </>
            ) : null}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="size-11 shrink-0 rounded-full bg-muted hover:bg-muted/70"
            aria-label={t('intervals.play', { name: title })}
            aria-pressed={playing}
            onClick={onPlay}
          >
            {playing ? (
              <Square aria-hidden className="size-3.5 fill-current" />
            ) : (
              <Play aria-hidden className="size-3.5 fill-current" />
            )}
          </Button>
        </div>
      </figure>
    </section>
  )
}
