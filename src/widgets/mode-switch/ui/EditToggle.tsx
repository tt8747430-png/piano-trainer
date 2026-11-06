import { PencilLine } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/primitives/button'

/**
 * The score's Edit · Done in its toolbar (the Player's and the editor's, ADR 0115), at the bar's end in
 * both modes so it never moves: a pencil enters Edit; in Edit the word Done leaves it (a check would
 * read as Learned). A page's bar has its own, the pencil beside its title (`ScreenHeader`'s `edit`).
 */
export function EditToggle({
  editing,
  onEdit,
  onDone,
  disabled = false,
}: {
  editing: boolean
  onEdit: () => void
  onDone: () => void
  disabled?: boolean
}) {
  const { t } = useTranslation('common')
  if (editing)
    return (
      <Button
        variant="tool"
        disabled={disabled}
        className="shrink-0 rounded-pill px-4 font-semibold max-sm:px-2.5"
        onClick={onDone}
      >
        {t('editMode.done')}
      </Button>
    )
  const label = t('editMode.edit')
  return (
    <Button
      variant="tool"
      size="icon"
      aria-label={label}
      title={label}
      disabled={disabled}
      className="shrink-0"
      onClick={onEdit}
    >
      <PencilLine aria-hidden />
    </Button>
  )
}
