import { Link } from '@tanstack/react-router'
import { Play } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Piece } from '@/entities/piece'
import { selectSongPlay, useProgress } from '@/entities/progress'
import { cn, OPEN_PLAINLY } from '@/shared/lib'
import { ButtonLink } from '@/shared/ui'

/**
 * Where the learner is in a song (canvas 125), once the Player has played it: Continue from the bar
 * it stopped at in honey and From the start beside it, or From the start alone once it was played to
 * its end; then its bars, one cell each, played through in copper, the next ringed, the rest sand,
 * with how often and how long under them. Before its first play, Play alone in the same place (the
 * SongLaptop board's row), so the action never moves between the song's states.
 */
export function SongPlace({ piece, bars }: { piece: Piece; bars: number }) {
  const { t } = useTranslation('piece')
  const play = useProgress(selectSongPlay(piece.id))
  if (bars === 0) return null
  if (!play)
    return (
      <div className="flex">
        <ButtonLink
          size="lg"
          className="min-w-0 flex-1 [&_svg]:size-4.5"
          render={<Link to="/play/$pieceId" params={{ pieceId: piece.id }} state={OPEN_PLAINLY} />}
        >
          <Play aria-hidden className="fill-current" />
          {t('practise')}
        </ButtonLink>
      </div>
    )
  const played = new Set(play.played.filter((bar) => bar < bars))
  const goesOn = play.at > 0 && play.at < bars
  const minutes = Math.round(play.seconds / 60)
  const from = (bar: number) => (
    <Link
      to="/play/$pieceId"
      params={{ pieceId: piece.id }}
      search={{ bar }}
      state={OPEN_PLAINLY}
    />
  )
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2.5">
        {goesOn ? (
          <ButtonLink
            size="lg"
            className="min-w-0 flex-1 [&_svg]:size-4.5"
            render={from(play.at + 1)}
          >
            <Play aria-hidden className="fill-current" />
            {t('place.continue', { bar: play.at + 1 })}
          </ButtonLink>
        ) : null}
        <ButtonLink
          size="lg"
          variant={goesOn ? 'ghost' : 'default'}
          className={cn(
            'min-w-0',
            goesOn
              ? 'flex-none bg-muted hover:bg-muted hover:brightness-95'
              : 'flex-1 [&_svg]:size-4.5',
          )}
          render={from(1)}
        >
          {goesOn ? null : <Play aria-hidden className="fill-current" />}
          {t('place.start')}
        </ButtonLink>
      </div>
      <div
        role="img"
        aria-label={
          goesOn
            ? t('place.said', { played: played.size, total: bars, next: play.at + 1 })
            : t('place.saidAll', { played: played.size, total: bars })
        }
        className="flex flex-col gap-1.5"
      >
        <div className={cn('flex', bars > 32 ? 'gap-px' : 'gap-[3px]')}>
          {Array.from({ length: bars }, (_, bar) => (
            <span
              key={bar}
              className={cn(
                'h-3.5 min-w-0 flex-1 rounded-[3px]',
                goesOn && bar === play.at
                  ? 'bg-card shadow-[inset_0_0_0_2px_var(--color-played)]'
                  : played.has(bar)
                    ? 'bg-played'
                    : 'bg-muted',
              )}
            />
          ))}
        </div>
        <p className="flex justify-between gap-2 text-[0.8125rem] text-muted-foreground tabular-nums">
          <span>{t('place.first')}</span>
          <span className="truncate">
            {[
              t('place.played', { count: play.times }),
              minutes > 0 ? t('place.minutes', { count: minutes }) : null,
            ]
              .filter(Boolean)
              .join(' · ')}
          </span>
          <span>{t('place.last', { bar: bars })}</span>
        </p>
      </div>
    </div>
  )
}
