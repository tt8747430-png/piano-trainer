import { AudioWaveform, ChevronRight, Hand, RotateCcw } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { LEFT_FIGURES, RIGHT_FIGURES, usePatternBook } from '@/entities/pattern'
import { localText, useLocale } from '@/shared/i18n'
import type { Figure } from '@/shared/lib/arrangement'
import { cn } from '@/shared/lib'
import { Labelled, MenuSection, PAINT } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { FigureRoll } from './FigureRoll'
import { InversionField } from './InversionField'
import { useSetup, type SetupPage } from './setup-context'

/**
 * A hand of the pattern, a row of its own: the hand, the part it plays by name with a picture of its
 * bar (`figure`; none where the chart plays its own), and a chevron opening that hand's list; changed
 * from the pattern's own, it says so, and a way back to the pattern's own part stands beside it. The
 * left hand's icon is the right hand's mirrored.
 */
function HandFigure({
  page,
  label,
  name,
  figure,
  changed,
  onReset,
}: {
  page: Extract<SetupPage, 'rh' | 'lh'>
  label: string
  name: string
  figure: Figure | null
  changed: boolean
  onReset: () => void
}) {
  const { t } = useTranslation('player')
  return (
    <div className="flex min-w-0 items-stretch">
      <HandButton page={page} label={label} name={name} figure={figure} changed={changed} />
      {changed ? (
        <button
          type="button"
          aria-label={t('ownFigureOf', { hand: label })}
          title={t('ownFigureOf', { hand: label })}
          onClick={onReset}
          className="grid w-12 shrink-0 place-items-center border-l border-hairline text-muted-foreground transition-colors duration-200 ease-out hover:bg-muted hover:text-foreground focus-visible:-outline-offset-3"
        >
          <RotateCcw aria-hidden className="size-5" />
        </button>
      ) : null}
    </div>
  )
}

/** A hand's row: what opens its list. */
function HandButton({
  page,
  label,
  name,
  figure,
  changed,
}: {
  page: Extract<SetupPage, 'rh' | 'lh'>
  label: string
  name: string
  figure: Figure | null
  changed: boolean
}) {
  const { t } = useTranslation('player')
  const { openPage } = useSetup()
  return (
    <button
      type="button"
      data-setup-page={page}
      aria-label={`${label}: ${name}${changed ? `, ${t('yourPart')}` : ''}`}
      onClick={() => openPage(page)}
      className="flex min-h-16 min-w-0 flex-1 items-center gap-3 px-3 py-2 text-left transition-colors duration-200 ease-out hover:bg-muted focus-visible:-outline-offset-3"
    >
      <Hand
        aria-hidden
        className={cn('size-5 shrink-0 text-muted-foreground', page === 'lh' && '-scale-x-100')}
      />
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2 text-sm text-muted-foreground">
          {label}
          {changed ? (
            <span className="rounded-full bg-muted px-2 text-xs font-semibold text-foreground">
              {t('yourPart')}
            </span>
          ) : null}
        </span>
        <span className="block font-semibold text-pretty">{name}</span>
      </span>
      {figure ? <FigureRoll hand={page} figure={figure} className="text-muted-foreground" /> : null}
      <ChevronRight aria-hidden className="size-5 shrink-0 text-muted-foreground" />
    </button>
  )
}

/** Which of the pattern's hands the learner changed, if any. */
const changedHands = ({ lh, rh }: { lh: unknown; rh: unknown }) =>
  lh !== null && rh !== null ? 'both' : lh !== null ? 'lh' : rh !== null ? 'rh' : null

/**
 * The pattern as what it is (ADR 0115): what the two hands play together, a name over its two hands,
 * what that means its ⓘ. The pattern's row opens the list of patterns; under it each hand, a row of
 * its own, names the part it plays and draws its bar, and opens that hand's list: choosing one
 * changes that hand alone, at once in the music, and makes the pattern the learner's own mix, which
 * the pattern's row says; Back to the pattern brings its own parts back. Then the position the right
 * hand's chords start in. All of it under Accompaniment, as How it plays follows it.
 */
export function PatternCard() {
  const { t } = useTranslation('player')
  const locale = useLocale()
  const { figures, openPage, onFigures } = useSetup()
  const book = usePatternBook()
  const pattern = figures.pattern === 'chart' ? null : book.require(figures.pattern)
  const name = pattern ? localText(pattern.name, locale) : t('fromChart')
  const changed = changedHands(figures)
  const about = changed
    ? t(`changed.${changed}`)
    : pattern
      ? localText(pattern.idea, locale)
      : t('fromChartDescription')
  const left = figures.lh ? LEFT_FIGURES[figures.lh] : pattern ? LEFT_FIGURES[pattern.lh] : null
  const right = figures.rh ? RIGHT_FIGURES[figures.rh] : pattern ? RIGHT_FIGURES[pattern.rh] : null
  return (
    <MenuSection title={t('accompaniment')} className="gap-5">
      <section aria-label={t('pattern')}>
        <Labelled label={t('pattern')} info={t('patternAbout')}>
          <div className="overflow-hidden card">
            <button
              type="button"
              data-setup-page="pattern"
              aria-label={`${t('pattern')}: ${name}${changed ? `, ${t(`changed.${changed}`).toLowerCase()}` : ''}`}
              onClick={() => openPage('pattern')}
              className="flex min-h-18 w-full items-center gap-3 px-3 py-2 text-left transition-colors duration-200 ease-out hover:bg-muted focus-visible:-outline-offset-3"
            >
              <span
                aria-hidden
                className={cn(
                  'grid size-12 shrink-0 place-items-center rounded-2xl',
                  PAINT.yellow.fill,
                  PAINT.yellow.ink,
                )}
              >
                <AudioWaveform className="size-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-lg font-semibold">
                  {changed ? t('yourMix', { pattern: name }) : name}
                </span>
                <span
                  className={cn(
                    // Its idea in two lines at most: a phone reads it whole, never cut mid-word.
                    'line-clamp-2 text-sm text-pretty',
                    changed ? 'font-semibold text-foreground' : 'text-muted-foreground',
                  )}
                >
                  {about}
                </span>
              </span>
              <ChevronRight aria-hidden className="size-5 shrink-0 text-muted-foreground" />
            </button>
            <div className="grid divide-y divide-hairline border-t border-hairline">
              <HandFigure
                page="lh"
                label={t('lh')}
                name={left ? localText(left.name, locale) : t('fromChart')}
                figure={left?.figure ?? null}
                changed={figures.lh !== null}
                onReset={() => onFigures({ lh: undefined })}
              />
              <HandFigure
                page="rh"
                label={t('rh')}
                name={right ? localText(right.name, locale) : t('fromChart')}
                figure={right?.figure ?? null}
                changed={figures.rh !== null}
                onReset={() => onFigures({ rh: undefined })}
              />
            </div>
          </div>
          {changed ? (
            <Button
              variant="outline"
              className="self-start"
              onClick={() => onFigures({ lh: undefined, rh: undefined })}
            >
              <RotateCcw data-icon="inline-start" aria-hidden />
              {t('backToPattern')}
            </Button>
          ) : null}
        </Labelled>
      </section>
      <InversionField />
    </MenuSection>
  )
}
