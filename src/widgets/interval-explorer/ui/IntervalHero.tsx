import { Play, Square } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useLocale } from '@/shared/i18n'
import { INTERVALS, printedNote, spellAbove, type SpelledNote } from '@/shared/lib/music'
import type { notate } from '@/shared/lib/notation'
import { InfoTip, LazyScoreView } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { INVERSIONS, type RowInterval } from '../model/interval-rows'
import { intervalSongs } from '../model/interval-songs'
import { useIntervalName } from './use-interval-name'

/**
 * The interval chosen, the page's subject (canvas 170): its name and, behind its ⓘ, what it sounds
 * like, a song it rises in and one it falls in, and what it inverts to; under the name its size and
 * its two notes; then the card of its staff and the song it sounds like, with Hear it.
 */
export function IntervalHero({
  name,
  root,
  score,
  playing,
  onPlay,
}: {
  name: RowInterval
  root: SpelledNote
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
  const upper = spellAbove(root, INTERVALS[name])
  const facts: { label: string; value: string }[] = []
  if (songs) {
    const up = songs.down ? t('intervals.songsUp') : t('intervals.songs')
    facts.push({ label: up, value: songs.up[locale].join(' · ') })
    if (songs.down)
      facts.push({ label: t('intervals.songsDown'), value: songs.down[locale].join(' · ') })
  }
  if (inverse) facts.push({ label: t('intervals.inverts'), value: said(inverse).title })
  const heard = songs?.up[locale][0]
  return (
    <section aria-labelledby="interval-chosen" className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1">
          <h2 id="interval-chosen" className="font-serif text-3xl font-semibold text-balance">
            {title}
          </h2>
          <InfoTip name={title}>
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
        <p className="text-muted-foreground">
          {t('intervals.semitones', { count: INTERVALS[name].semitones })} ·{' '}
          {t('intervals.upTo', { low: printedNote(root), high: printedNote(upper) })}
        </p>
      </div>
      <div className="flex flex-col gap-3 card p-4">
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
            variant="soft"
            size="icon"
            className="rounded-full"
            aria-label={t('intervals.play', { name: title })}
            aria-pressed={playing}
            onClick={onPlay}
          >
            {playing ? <Square aria-hidden /> : <Play aria-hidden />}
          </Button>
        </div>
      </div>
    </section>
  )
}
