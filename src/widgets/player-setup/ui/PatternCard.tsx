import { AudioWaveform, ChevronRight, Hand, RotateCcw } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { LEFT_FIGURES, RIGHT_FIGURES, usePatternBook } from '@/entities/pattern'
import { localText, useLocale } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import { PAINT } from '@/shared/ui'
import { InversionField } from './InversionField'
import { useSetup, type SetupPage } from './setup-context'

/**
 * A hand of the pattern, a row of its own: the hand, the figure it plays by name (the pattern's own
 * until the learner changes it, written whole) and a chevron, opening that hand's list; changed, a way
 * back to the pattern's own beside it. The left hand's icon is the right hand's mirrored.
 */
function HandFigure({
  page,
  label,
  figure,
  changed,
  onReset,
}: {
  page: Extract<SetupPage, 'rh' | 'lh'>
  label: string
  figure: string
  changed: boolean
  onReset: () => void
}) {
  const { t } = useTranslation('player')
  const { openPage } = useSetup()
  return (
    <div className="flex min-w-0 items-stretch">
      <button
        type="button"
        data-setup-page={page}
        aria-label={`${label}: ${figure}`}
        onClick={() => openPage(page)}
        className="flex min-h-14 min-w-0 flex-1 items-center gap-3 px-3 py-2 text-left transition-colors duration-200 ease-out hover:bg-muted focus-visible:-outline-offset-3"
      >
        <Hand
          aria-hidden
          className={cn('size-5 shrink-0 text-muted-foreground', page === 'lh' && '-scale-x-100')}
        />
        <span className="min-w-0 flex-1">
          <span className="block text-sm text-muted-foreground">{label}</span>
          <span className="block font-semibold text-pretty">{figure}</span>
        </span>
        <ChevronRight aria-hidden className="size-5 shrink-0 text-muted-foreground" />
      </button>
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

/** Which of the pattern's hands the learner changed, if any. */
const changedHands = ({ lh, rh }: { lh: unknown; rh: unknown }) =>
  lh !== null && rh !== null ? 'both' : lh !== null ? 'lh' : rh !== null ? 'rh' : null

/**
 * The pattern as what it is: a name over its two hands. The pattern's row opens the list of
 * patterns, and says when a hand no longer plays the pattern's own; under it each hand, a row of its
 * own, shows the figure it plays and opens that hand's list, so changing a hand reads as changing a
 * part of the pattern; then the inversion the right hand's chord keeps.
 */
export function PatternCard() {
  const { t } = useTranslation('player')
  const locale = useLocale()
  const { figures, openPage, onFigures } = useSetup()
  const book = usePatternBook()
  const pattern = figures.pattern === 'chart' ? null : book.require(figures.pattern)
  const own = (name: string | undefined) => name ?? t('fromChart')
  const name = pattern ? localText(pattern.name, locale) : t('fromChart')
  const changed = changedHands(figures)
  const about = changed
    ? t(`changed.${changed}`)
    : pattern
      ? localText(pattern.idea, locale)
      : t('fromChartDescription')
  return (
    <>
      <section aria-label={t('pattern')} className="overflow-hidden card">
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
            <span className="block truncate text-lg font-semibold">{name}</span>
            <span
              className={cn(
                'block truncate text-sm',
                changed ? 'font-semibold text-foreground' : 'text-muted-foreground',
              )}
            >
              {about}
            </span>
          </span>
          <ChevronRight aria-hidden className="size-5 shrink-0 text-muted-foreground" />
        </button>
        <div className="grid divide-hairline border-t border-hairline max-sm:divide-y sm:grid-cols-2 sm:divide-x">
          <HandFigure
            page="lh"
            label={t('lh')}
            figure={
              figures.lh
                ? localText(LEFT_FIGURES[figures.lh].name, locale)
                : own(pattern ? localText(LEFT_FIGURES[pattern.lh].name, locale) : undefined)
            }
            changed={figures.lh !== null}
            onReset={() => onFigures({ lh: undefined })}
          />
          <HandFigure
            page="rh"
            label={t('rh')}
            figure={
              figures.rh
                ? localText(RIGHT_FIGURES[figures.rh].name, locale)
                : own(pattern ? localText(RIGHT_FIGURES[pattern.rh].name, locale) : undefined)
            }
            changed={figures.rh !== null}
            onReset={() => onFigures({ rh: undefined })}
          />
        </div>
      </section>
      <InversionField />
    </>
  )
}
