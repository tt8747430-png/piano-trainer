import { useTranslation } from 'react-i18next'
import { Link } from '@tanstack/react-router'
import type { BarRange } from '@/features/practice'
import { cn } from '@/shared/lib'
import { barNumber, tempoWord } from '@/shared/lib/music'
import { Sheet, SheetContent } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'

/** Bars shown together, each group one button that loops its four (canvas 122). */
const GROUP = 4

/** A bar's slips as a cell's paint: none, one, two, three or more (the board's four steps). */
const SLIP_PAINT = ['bg-slip-0', 'bg-slip-1', 'bg-slip-2', 'bg-slip-3'] as const

/** What a Wait pass played through to its end says (the board's PlayerDone). */
interface PassDone {
  /** The pass's score, a whole percent of steps played right first time. */
  readonly score: number
  /** The weakest bar or two, where they are under the takes' weak share; none, all were strong. */
  readonly hardest: BarRange | null
  /** Each bar's slips, by its index. */
  readonly slips: Readonly<Partial<Record<number, number>>>
  /** Each bar's pauses, steps that took over two beats, by its index. */
  readonly pauses: Readonly<Partial<Record<number, number>>>
  /** The bars of the music. */
  readonly bars: number
}

/**
 * Played through (the board's PlayerDone; research items 2 and 4): the pass's score beside the best
 * before it, its tempo beside the score's, its bars four at a time with their slips and pauses (a tap loops the
 * four), then Practise bars n–m (the weakest, at 70 %, the one rule for the hardest bars), Play
 * again and Try it in Play, and the days in a row. Only at the end of the song, never a loop's lap.
 */
export function PlayedThrough({
  open,
  onOpenChange,
  pass,
  hands,
  bestBefore,
  tempo,
  ownTempo,
  streak,
  onPractise,
  onLoopBars,
  onAgain,
  onTryPlay,
  pickup,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Whether the song opens on a pickup: its bars numbered from the first full one, its fours from there. */
  pickup: boolean
  pass: PassDone
  /** The hands practised, as named. */
  hands: string
  /** The song's best pass with these hands before this one, if any. */
  bestBefore: number | null
  tempo: number
  ownTempo: number
  /** The days practised in a row, today's included. */
  streak: number
  onPractise: (bars: BarRange) => void
  onLoopBars: (bars: BarRange) => void
  onAgain: () => void
  onTryPlay: () => void
}) {
  const { t } = useTranslation('player')
  const { t: tMusic } = useTranslation('music')
  // Fours as the bars are numbered: a pickup goes with the first.
  const lead = pickup ? 1 : 0
  const groups = Array.from({ length: Math.ceil((pass.bars - lead) / GROUP) }, (_, i) => {
    const first = i === 0 ? 0 : i * GROUP + lead
    const last = Math.min(pass.bars, (i + 1) * GROUP + lead) - 1
    const slips = Array.from({ length: last - first + 1 }, (_, k) => pass.slips[first + k] ?? 0)
    let pauses = 0
    for (let bar = first; bar <= last; bar++) pauses += pass.pauses[bar] ?? 0
    return { first, last, slips, total: slips.reduce((sum, n) => sum + n, 0), pauses }
  })
  const weak = pass.hardest
  const comparison =
    bestBefore === null
      ? null
      : pass.score > bestBefore
        ? t('newBest')
        : t('bestScore', { score: bestBefore })
  const close = (act: () => void) => () => {
    onOpenChange(false)
    act()
  }
  const range = (bars: BarRange) =>
    bars.first === bars.last
      ? t('done.practiseBar', { first: barNumber(bars.first, pickup) })
      : t('done.practiseBars', {
          first: barNumber(bars.first, pickup),
          last: barNumber(bars.last, pickup),
        })
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent title={t('done.title')} description={t('done.of', { hands })} floating>
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1 card px-4 py-3">
              <span className="text-[1.875rem] leading-tight font-bold tracking-[-0.02em] tabular-nums">
                {t('done.percent', { score: pass.score })}
              </span>
              <span className="text-sm text-foreground/80">{t('done.scoreLabel')}</span>
              {comparison ? (
                <span className="text-xs font-semibold tabular-nums">{comparison}</span>
              ) : null}
            </div>
            <div className="flex flex-col gap-1 card px-4 py-3">
              <span className="text-[1.875rem] leading-tight font-bold tracking-[-0.02em] tabular-nums">
                {tempo}
              </span>
              <span className="text-sm text-foreground/80">
                {t('done.bpm', { mark: tMusic(`tempoWord.${tempoWord(tempo)}.name`) })}
              </span>
              <span className="text-xs text-muted-foreground tabular-nums">
                {tempo === ownTempo
                  ? t('done.scoreTempo')
                  : t('done.scoreTempoWas', { tempo: ownTempo })}
              </span>
            </div>
          </div>
          <p className="mx-1 mt-2 -mb-1 text-sm font-semibold tracking-[0.04em] text-muted-foreground uppercase">
            {t('done.bars')}
          </p>
          <div role="group" aria-label={t('done.barsLabel')} className="grid grid-cols-4 gap-3">
            {groups.map((group) => {
              const ringed = weak !== null && weak.first >= group.first && weak.first <= group.last
              const label = t('done.group', {
                first: barNumber(group.first, pickup),
                last: barNumber(group.last, pickup),
              })
              const slips = t('done.slips', { count: group.total })
              const pauses = group.pauses > 0 ? t('done.pauses', { count: group.pauses }) : null
              return (
                <button
                  key={group.first}
                  type="button"
                  aria-label={
                    pauses
                      ? t('done.groupAriaPauses', { bars: label, slips, pauses })
                      : t('done.groupAria', { bars: label, slips })
                  }
                  onClick={close(() => onLoopBars({ first: group.first, last: group.last }))}
                  className={cn(
                    'flex min-h-18 min-w-0 flex-col items-stretch gap-1 rounded-control p-2 text-left transition-colors duration-150 ease-out',
                    ringed
                      ? 'bg-honey-wash ring-2 ring-honey-ring'
                      : 'bg-card ring-1 ring-hairline hover:bg-muted',
                  )}
                >
                  <span className="text-sm font-semibold tabular-nums">{label}</span>
                  <span aria-hidden className="grid grid-cols-4 gap-0.5">
                    {group.slips.map((count, k) => (
                      <span
                        key={k}
                        className={cn(
                          'h-3 rounded-mark',
                          SLIP_PAINT[Math.min(count, SLIP_PAINT.length - 1)],
                        )}
                      />
                    ))}
                  </span>
                  <span
                    className={cn(
                      'text-xs tabular-nums',
                      group.total === 0 ? 'text-muted-foreground' : 'text-foreground',
                    )}
                  >
                    {slips}
                  </span>
                  {pauses ? (
                    <span className="-mt-1 text-xs text-muted-foreground tabular-nums">
                      {pauses}
                    </span>
                  ) : null}
                </button>
              )
            })}
          </div>
          <div className="flex flex-col gap-2 pt-1">
            {weak ? (
              <Button size="lg" onClick={close(() => onPractise(weak))}>
                {range(weak)}
              </Button>
            ) : null}
            <div className="grid grid-cols-2 gap-2">
              <Button size="lg" variant={weak ? 'soft' : 'default'} onClick={close(onAgain)}>
                {t('done.again')}
              </Button>
              <Button size="lg" variant="soft" onClick={close(onTryPlay)}>
                {t('done.tryPlay')}
              </Button>
            </div>
          </div>
          {streak > 0 ? (
            <Link
              to="/profile/streak"
              className="flex min-h-10 items-center justify-center gap-2 text-sm text-foreground/80 tabular-nums hover:underline"
            >
              {t('done.streak', { count: streak })}
              <span aria-hidden className="text-base text-muted-foreground">
                ›
              </span>
            </Link>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  )
}
