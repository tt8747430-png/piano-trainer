import { BookOpen, PencilLine, type LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Dropdown } from '@/shared/ui'

export type ReadMode = 'read' | 'edit'

const ICONS: Readonly<Record<ReadMode, LucideIcon>> = { read: BookOpen, edit: PencilLine }

/**
 * Read · Edit (round 25): an editor's lesson or course in its two modes, chosen from one pop-up in its
 * bar as a song's Practise · Edit is, its face the mode's icon and name. The other mode opens in
 * place of this one in the history, so Back still goes where the editor came from: the page enters
 * Edit, it does not go to another.
 */
export function ReadEditSwitch({
  mode,
  read,
  edit,
}: {
  mode: ReadMode
  /** Opens the page to read, in place of this one in the history. */
  read: () => void
  /** Opens it in Edit, in place of this one in the history. */
  edit: () => void
}) {
  const { t } = useTranslation('learn')
  const face = (each: ReadMode) => {
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
      face={face}
      align="end"
      className="w-auto shrink-0 gap-1 border-transparent bg-muted/70 px-3 hover:bg-muted"
      options={(['read', 'edit'] as const).map((each) => {
        const Icon = ICONS[each]
        return { value: each, label: t(`mode.${each}`), icon: <Icon /> }
      })}
      onChange={(next) => (next === mode ? undefined : next === 'read' ? read() : edit())}
    />
  )
}
