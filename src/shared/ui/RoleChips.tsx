import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'
import {
  isStrongMove,
  printedSymbol,
  rootMoveText,
  type RoleOf,
  type RootMove,
} from '@/shared/lib/music'
import { InfoTip } from './InfoTip'
import { PAINT, ROLE_PAINT } from './paint'

/**
 * A progression with why it works drawn on its chords (A23, layout B): each chord a chip, its role
 * in one word under it, an arrow between each two with how the root moves. Wraps on a narrow screen,
 * each arrow staying with the chord it leads to.
 */
export function RoleChips({ label, children }: { label: string; children: ReactNode }) {
  return (
    <ol aria-label={label} className="flex flex-wrap items-start gap-y-3">
      {children}
    </ol>
  )
}

/**
 * One chord of the row: the arrow from the chord before (none for the first), then the chord as a
 * chip, its numeral or symbol over its role (home · away · tension) and the colour it brings (sad,
 * soft, bright) in its role's paint; at full strength while it sounds. A tap plays the chord.
 */
export function RoleChip({
  name,
  role,
  sounding,
  label,
  move,
  onClick,
}: {
  /** The numeral, Nashville number or chord symbol, as the row names its chords. */
  name: string
  role: RoleOf
  sounding: boolean
  /** What a screen reader says: the chord and what it does. */
  label: string
  /** The arrow before it, leading from the chord before; none for the first. */
  move?: ReactNode
  onClick: () => void
}) {
  const { t } = useTranslation('music')
  const look = PAINT[ROLE_PAINT[role.role]]
  return (
    <li className="flex items-start">
      {move}
      <button
        type="button"
        aria-label={label}
        aria-pressed={sounding}
        onClick={onClick}
        className={cn(
          'flex min-h-16 min-w-16 flex-col items-center justify-center rounded-control px-2 py-1.5 leading-tight transition-colors duration-200 ease-out focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring',
          sounding
            ? cn(look.full, 'text-on-paint-full')
            : cn(look.fill, look.ink, 'hover:brightness-95'),
        )}
      >
        <span className="max-w-full truncate font-display text-lg font-semibold">
          {printedSymbol(name)}
        </span>
        <span className="text-sm font-semibold">{t(`harmony.role.${role.role}`)}</span>
        {role.colour ? <span className="text-xs">{t(`harmony.colour.${role.colour}`)}</span> : null}
      </button>
    </li>
  )
}

/**
 * The arrow between two chords: how the root moves (↓5, ↑2), the strong moves bold and the ones that
 * step back soft; its meaning in its name. A tap plays the two chords. Where the bass keeps its
 * letter, a plain arrow.
 */
export function MoveArrow({
  move,
  label,
  onClick,
}: {
  move: RootMove | null
  label: string
  onClick: () => void
}) {
  const strong = move !== null && isStrongMove(move)
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn(
        'flex min-h-16 min-w-11 flex-col items-center justify-center rounded-control px-1 text-sm tabular-nums transition-colors hover:bg-muted focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring',
        strong ? 'font-bold text-foreground' : 'text-muted-foreground',
      )}
    >
      <span aria-hidden>{move ? rootMoveText(move) : ''}</span>
      <span aria-hidden className="text-base leading-none">
        →
      </span>
    </button>
  )
}

/**
 * What the row's words and arrows mean, in one line under it, its colours as the chips': the terms
 * theory books use, and what each move does, behind its ⓘ; and a way to test oneself, where given.
 */
export function RoleLegend({ action }: { action?: ReactNode }) {
  const { t } = useTranslation('music')
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
      <span className="flex flex-wrap items-center gap-x-3">
        {(['home', 'away', 'tension'] as const).map((role) => (
          <span key={role} className="flex items-center gap-1.5">
            <span aria-hidden className={cn('size-3 rounded-pill', PAINT[ROLE_PAINT[role]].full)} />
            {t(`harmony.role.${role}`)}
          </span>
        ))}
        <span>{t('harmony.legend.arrows')}</span>
        <InfoTip name={t('harmony.legend.name')}>
          <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5">
            {(['home', 'away', 'tension', 'sad', 'fifth', 'third', 'second', 'back'] as const).map(
              (term) => (
                <div key={term} className="contents">
                  <dt className="font-semibold whitespace-nowrap">
                    {t(`harmony.legend.terms.${term}.name`)}
                  </dt>
                  <dd>{t(`harmony.legend.terms.${term}.text`)}</dd>
                </div>
              ),
            )}
          </dl>
        </InfoTip>
      </span>
      {action}
    </div>
  )
}
