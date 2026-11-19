import { Play, Square } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useLocale } from '@/shared/i18n'
import { INTERVALS, spanInterval } from '@/shared/lib/music'
import type { notate } from '@/shared/lib/notation'
import { InfoTip, LazyScoreView } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { INVERSIONS, type RowInterval } from '../model/interval-rows'
import { intervalSongs } from '../model/interval-songs'
import { useIntervalName } from './use-interval-name'

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
        <section
          aria-label={t('intervals.written')}
          className="flex w-full min-w-40 justify-center"
        >
          <LazyScoreView score={score} />
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
              <Square aria-hidden className="fill-current" />
            ) : (
              <Play aria-hidden className="fill-current" />
            )}
          </Button>
        </div>
      </figure>
    </section>
  )
}
