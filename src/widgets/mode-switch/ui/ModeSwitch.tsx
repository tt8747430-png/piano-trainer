import { useNavigate } from '@tanstack/react-router'
import { BookLock, Music, PencilLine, type LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { hasEditableOriginal } from '@/entities/piece'
import { editsContent, useAccount } from '@/shared/lib/account'
import { Dropdown } from '@/shared/ui'

/**
 * The modes of a piece's one score: practised in the Player, written in the editor, and, an editor's
 * alone, its original changed for everyone (ADR 0116).
 */
export type ScoreMode = 'practise' | 'edit' | 'original'

const ICONS: Readonly<Record<ScoreMode, LucideIcon>> = {
  practise: Music,
  edit: PencilLine,
  original: BookLock,
}

/**
 * Practise · Edit · Edit the original (ADR 0115): a piece's score in its modes, chosen from one
 * pop-up button, first in both bars, its face the mode's icon and name. The other mode opens at `bar`
 * (as printed, from 1: the Player's cursor's, the editor's caret's), in place of this one in the
 * history, so Close still goes back where the learner came from. The original is offered to an
 * editor, for a song that has one. While a take records, the way out waits for Stop (`disabled`).
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
  const navigate = useNavigate()
  const { account } = useAccount()
  const modes: ScoreMode[] = [
    'practise',
    'edit',
    ...(editsContent(account) && hasEditableOriginal(pieceId) ? (['original'] as const) : []),
  ]
  // The first bar is where either opens: a URL never says so.
  const at = bar > 1 ? { bar } : {}
  const open = (next: ScoreMode) =>
    void navigate(
      next === 'practise'
        ? { to: '/play/$pieceId', params: { pieceId }, search: at, replace: true }
        : {
            to: '/edit/$pieceId',
            params: { pieceId },
            search: next === 'original' ? { ...at, original: true } : at,
            replace: true,
          },
    )
  const face = (each: ScoreMode) => {
    const Icon = ICONS[each]
    return (
      <span className="flex items-center gap-2">
        <Icon aria-hidden className="size-5 shrink-0" />
        <span className="truncate max-sm:sr-only">{t(`mode.${each}`)}</span>
      </span>
    )
  }
  return (
    <Dropdown
      label={t('mode.label')}
      bare
      value={mode}
      disabled={disabled}
      face={face}
      align="start"
      className="w-auto shrink-0 gap-1 border-transparent bg-muted/70 px-3 hover:bg-muted"
      options={modes.map((each) => ({
        value: each,
        label: t(`mode.${each}`),
        icon: (() => {
          const Icon = ICONS[each]
          return <Icon />
        })(),
      }))}
      onChange={open}
    />
  )
}
