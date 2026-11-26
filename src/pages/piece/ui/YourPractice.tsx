import { Link } from '@tanstack/react-router'
import { Gauge, Repeat } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { Piece } from '@/entities/piece'
import { selectPractised, useProgress } from '@/entities/progress'
import { HANDS } from '@/shared/lib/schedule'
import { nextStep, practiceSummary, useTakes, type NextStep } from '@/entities/take'
import { loopParam } from '@/features/practice'
import { formatPercent, useLocale } from '@/shared/i18n'
import type { Performance } from '@/shared/lib/arrangement'
import { barNumber, opensOnPickup } from '@/shared/lib/music'
import { ButtonLink, ProgressBar, SettingsGroup } from '@/shared/ui'
import { monthDaySaid } from '@/shared/lib'

/** A row of the card: its name, then what it says. */
const ROW = 'flex min-h-12 items-center justify-between gap-3 py-1.5 ps-4 pe-3'

/**
 * What the app has kept of the learner's practice of a song (R30 S4, R34): the day it was played
 * last, its best Wait-mode pass (with both hands where played so) and the takes recorded; once a take is in, its share right, the best take's, the last take bar
 * by bar (Piano Forte's meter, in ink: a meter is never a verdict's colour), and the one next step
 * (Piano Forte's pace): the weakest bars looped slower, else the tempo climbed. Play stays the page's
 * one honey control, so the step is a quiet button. Nothing before the first time it is played.
 */
export function YourPractice({ piece, performance }: { piece: Piece; performance: Performance }) {
  const pickup = opensOnPickup(performance.bars, performance.meter)
  const { t } = useTranslation('piece')
  const locale = useLocale()
  const { t: common } = useTranslation('common')
  const at = useProgress((state) => selectPractised(state)[piece.id])
  // Wait mode's best pass (research item 11): with both hands where played so, else one hand's.
  const best = useProgress((state) => state.songs[piece.id]?.best)
  const waitHands = HANDS.find((hands) => best?.[hands] !== undefined)
  const waitBest = waitHands ? best?.[waitHands] : undefined
  const all = useTakes((state) => state.takes)
  const takes = useMemo(() => all.filter((take) => take.pieceId === piece.id), [all, piece.id])
  const summary = useMemo(
    () => practiceSummary(performance, takes, piece.tempo),
    [performance, takes, piece.tempo],
  )
  if (!at && takes.length === 0) return null
  const day = at ? monthDaySaid(at, locale) : null
  const step = summary ? nextStep(summary) : null
  const percent = (value: number) => formatPercent(locale, value)
  return (
    <SettingsGroup flush heading title={t('practice.title')}>
      <dl className="flex flex-col rows-hairline">
        {day ? (
          <div className={ROW}>
            <dt className="font-medium">{t('practice.last')}</dt>
            <dd className="text-muted-foreground">{day}</dd>
          </div>
        ) : null}
        {waitHands && waitBest !== undefined ? (
          <div className={ROW}>
            <dt className="font-medium">{t('practice.wait')}</dt>
            <dd className="text-muted-foreground tabular-nums">
              {t('practice.waitBest', {
                percent: percent(waitBest),
                hands: common(`hands.${waitHands}`),
              })}
            </dd>
          </div>
        ) : null}
        {takes.length > 0 ? (
          <div className={ROW}>
            <dt className="font-medium">{t('practice.takes')}</dt>
            <dd className="text-muted-foreground tabular-nums">
              {t('practice.takeCount', { count: takes.length })}
            </dd>
          </div>
        ) : null}
        {summary ? (
          <>
            <ShareRow label={t('practice.lastTake')} value={summary.last} said={percent} solid />
            <ShareRow label={t('practice.bestTake')} value={summary.best} said={percent} />
            <div className="flex flex-col gap-2 py-3 ps-4 pe-3">
              <dt className="font-medium">{t('practice.bars')}</dt>
              <dd>
                <ol className="flex h-9 items-end gap-0.5">
                  {summary.bars.map((share, bar) => (
                    <li
                      key={bar}
                      className={
                        share === null
                          ? 'h-1 min-w-0 flex-1 bg-muted'
                          : 'min-w-0 flex-1 bg-muted-foreground'
                      }
                      style={
                        share === null ? undefined : { height: `${Math.max(12, share * 100)}%` }
                      }
                    >
                      <span className="sr-only">
                        {share === null
                          ? t('practice.barNone', { bar: barNumber(bar, pickup) })
                          : t('practice.barSaid', {
                              bar: barNumber(bar, pickup),
                              percent: percent(Math.round(share * 100)),
                            })}
                      </span>
                    </li>
                  ))}
                </ol>
              </dd>
            </div>
          </>
        ) : null}
      </dl>
      {step ? <StepLink piece={piece} step={step} pickup={pickup} /> : null}
    </SettingsGroup>
  )
}

/** A take's share right: its name, a meter in ink, the percent. */
function ShareRow({
  label,
  value,
  said,
  solid = false,
}: {
  label: string
  value: number
  said: (value: number) => string
  solid?: boolean
}) {
  const { t } = useTranslation('piece')
  return (
    <div className={ROW}>
      <dt className="shrink-0 font-medium">{label}</dt>
      <dd className="flex min-w-0 flex-1 items-center justify-end gap-3">
        <ProgressBar
          done={value}
          total={100}
          label={label}
          said={t('practice.share', { percent: said(value) })}
          tone={solid ? 'ink' : 'soft'}
          className="h-2 min-h-2 max-w-40"
        />
        <span className="w-12 text-end text-muted-foreground tabular-nums">{said(value)}</span>
      </dd>
    </div>
  )
}

/** The next step as a quiet link into the Player: the loop and the tempo set. */
function StepLink({ piece, step, pickup }: { piece: Piece; step: NextStep; pickup: boolean }) {
  const { t } = useTranslation('piece')
  const locale = useLocale()
  const speed = formatPercent(locale, Math.round(step.speed * 100))
  const tempo = Math.round(piece.tempo * step.speed)
  const label =
    step.kind === 'tempo'
      ? t('practice.next.tempo', { speed })
      : step.bars.first === step.bars.last
        ? t('practice.next.loopOne', { bar: barNumber(step.bars.first, pickup), speed })
        : t('practice.next.loop', {
            bars: `${barNumber(step.bars.first, pickup)}–${barNumber(step.bars.last, pickup)}`,
            speed,
          })
  return (
    <div className="p-3">
      <ButtonLink
        variant="outline"
        className="min-h-11 w-full"
        render={
          <Link
            to="/play/$pieceId"
            params={{ pieceId: piece.id }}
            search={step.kind === 'loop' ? { tempo, loop: loopParam(step.bars) } : { tempo }}
          />
        }
      >
        {step.kind === 'loop' ? <Repeat aria-hidden /> : <Gauge aria-hidden />}
        {label}
      </ButtonLink>
    </div>
  )
}
