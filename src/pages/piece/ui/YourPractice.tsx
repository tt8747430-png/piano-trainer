import { Link } from '@tanstack/react-router'
import { Gauge, Repeat } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { Piece } from '@/entities/piece'
import { selectPractised, useProgress } from '@/entities/progress'
import { nextStep, practiceSummary, useTakes, type NextStep } from '@/entities/take'
import { loopParam } from '@/features/practice'
import { formatPercent, useLocale } from '@/shared/i18n'
import type { Performance } from '@/shared/lib/arrangement'
import { ButtonLink, SettingsGroup } from '@/shared/ui'

/** A row of the card: its name, then what it says. */
const ROW =
  'flex min-h-12 items-center justify-between gap-4 border-t border-hairline px-4 first:border-t-0'

/**
 * What the app has kept of the learner's practice of a song (R30 S4, R34): the day it was played
 * last and the takes recorded; once a take is in, its share right, the best take's, the last take bar
 * by bar (Piano Forte's meter, in ink: a meter is never a verdict's colour), and the one next step
 * (Piano Forte's pace): the weakest bars looped slower, else the tempo climbed. Play stays the page's
 * one honey control, so the step is a quiet button. Nothing before the first time it is played.
 */
export function YourPractice({ piece, performance }: { piece: Piece; performance: Performance }) {
  const { t } = useTranslation('piece')
  const locale = useLocale()
  const at = useProgress((state) => selectPractised(state)[piece.id])
  const all = useTakes((state) => state.takes)
  const takes = useMemo(() => all.filter((take) => take.pieceId === piece.id), [all, piece.id])
  const summary = useMemo(
    () => practiceSummary(performance, takes, piece.tempo),
    [performance, takes, piece.tempo],
  )
  if (!at && takes.length === 0) return null
  const day = at
    ? new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long' }).format(new Date(at))
    : null
  const step = summary ? nextStep(summary) : null
  const percent = (value: number) => formatPercent(locale, value)
  return (
    <SettingsGroup title={t('practice.title')}>
      <dl className="flex flex-col">
        {day ? (
          <div className={ROW}>
            <dt className="font-medium">{t('practice.last')}</dt>
            <dd className="text-muted-foreground">{day}</dd>
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
            <div className="flex flex-col gap-2 border-t border-hairline px-4 py-3">
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
                          ? t('practice.barNone', { bar: bar + 1 })
                          : t('practice.barSaid', {
                              bar: bar + 1,
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
      {step ? <StepLink piece={piece} step={step} /> : null}
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
        <span
          role="meter"
          aria-label={label}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={value}
          aria-valuetext={t('practice.share', { percent: said(value) })}
          className="block h-2 max-w-40 flex-1 overflow-hidden rounded-pill bg-muted"
        >
          <span
            className={
              solid
                ? 'block h-full rounded-pill bg-foreground'
                : 'block h-full rounded-pill bg-muted-foreground'
            }
            style={{ width: `${value}%` }}
          />
        </span>
        <span className="w-12 text-end text-muted-foreground tabular-nums">{said(value)}</span>
      </dd>
    </div>
  )
}

/** The next step as a quiet link into the Player: the loop and the tempo set. */
function StepLink({ piece, step }: { piece: Piece; step: NextStep }) {
  const { t } = useTranslation('piece')
  const locale = useLocale()
  const speed = formatPercent(locale, Math.round(step.speed * 100))
  const tempo = Math.round(piece.tempo * step.speed)
  const label =
    step.kind === 'tempo'
      ? t('practice.next.tempo', { speed })
      : step.bars.first === step.bars.last
        ? t('practice.next.loopOne', { bar: step.bars.first + 1, speed })
        : t('practice.next.loop', { bars: `${step.bars.first + 1}–${step.bars.last + 1}`, speed })
  return (
    <div className="border-t border-hairline p-3">
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
