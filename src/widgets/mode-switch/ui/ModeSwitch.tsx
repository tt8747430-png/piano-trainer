import { Link } from '@tanstack/react-router'
import { Music, PencilLine, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'

/** The two modes of a piece's one score: practised in the Player, written in the editor. */
export type ScoreMode = 'practise' | 'edit'

const ICONS: Readonly<Record<ScoreMode, LucideIcon>> = { practise: Music, edit: PencilLine }

// Drawn 36px on the 44px track; its reach grows to the track's edge (a 44px touch target, CODE_STYLE §5).
const SEGMENT =
  'relative inline-flex size-9 items-center justify-center rounded-lg border border-transparent text-muted-foreground transition-colors duration-200 ease-out select-none before:absolute before:-inset-1 before:content-[""] [&_svg]:size-5'

/**
 * One mode, its icon at every size, its name its tooltip and a screen reader's (ADR 0114): the one
 * shown a card on the track, the other a link to it.
 */
function Segment({
  mode,
  current,
  disabled,
  link,
}: {
  mode: ScoreMode
  current: boolean
  disabled: boolean
  link: (children: ReactNode, className: string, label: string) => ReactNode
}) {
  const { t } = useTranslation('player')
  const Icon = ICONS[mode]
  const label = t(`mode.${mode}`)
  const children = (
    <>
      <Icon aria-hidden />
      <span className="sr-only">{label}</span>
    </>
  )
  if (current)
    return (
      <span
        aria-current="page"
        title={label}
        className={cn(SEGMENT, 'border-input bg-chosen text-foreground')}
      >
        {children}
      </span>
    )
  if (disabled)
    return (
      <span aria-disabled title={label} className={cn(SEGMENT, 'opacity-50')}>
        {children}
      </span>
    )
  return link(children, cn(SEGMENT, 'hover:text-foreground'), label)
}

/**
 * Practise · Edit (ADR 0115): a piece's score in its two modes, the Player and the score editor, as
 * one screen's (Flat's Composing and Read-only), first of the round buttons in both bars. The other
 * mode opens at `bar` (as printed, from 1: the Player's cursor's, the editor's caret's), in place of
 * this one in the history, so Close still goes back where the learner came from. Only for a piece
 * whose score can be edited; while a take records, the way out waits for Stop (`disabled`).
 */
export function ModeSwitch({
  pieceId,
  mode,
  bar,
  disabled = false,
}: {
  pieceId: string
  mode: ScoreMode
  bar: number
  disabled?: boolean
}) {
  const { t } = useTranslation('player')
  const params = { pieceId }
  // The first bar is where either opens: a URL never says so.
  const search = bar > 1 ? { bar } : {}
  return (
    <nav
      aria-label={t('mode.label')}
      className="flex shrink-0 items-center gap-0.5 rounded-xl bg-muted p-1"
    >
      <Segment
        mode="practise"
        current={mode === 'practise'}
        disabled={disabled}
        link={(children, className, label) => (
          <Link
            to="/play/$pieceId"
            params={params}
            search={search}
            replace
            aria-label={label}
            title={label}
            className={className}
          >
            {children}
          </Link>
        )}
      />
      <Segment
        mode="edit"
        current={mode === 'edit'}
        disabled={disabled}
        link={(children, className, label) => (
          <Link
            to="/edit/$pieceId"
            params={params}
            search={search}
            replace
            aria-label={label}
            title={label}
            className={className}
          >
            {children}
          </Link>
        )}
      />
    </nav>
  )
}
