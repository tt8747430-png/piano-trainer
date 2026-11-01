import { PencilLine } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/primitives/button'

/**
 * Edit mode's one button (Noji's, iOS's Edit · Done), at the bar's end in both modes so it never moves:
 * a pencil, Edit, enters it; in Edit the word Done leaves it (a check would read as Learned). A page enters Edit in place, it
 * does not open another (round 26). `tool` is the score's bar's look, `bar` a page's.
 */
export function EditToggle({
  editing,
  onEdit,
  onDone,
  variant = 'bar',
  disabled = false,
}: {
  editing: boolean
  onEdit: () => void
  onDone: () => void
  variant?: 'bar' | 'tool'
  disabled?: boolean
}) {
  const { t } = useTranslation('common')
  if (editing)
    return (
      <Button
        variant={variant}
        disabled={disabled}
        className="shrink-0 rounded-full px-4 font-semibold"
        onClick={onDone}
      >
        {t('editMode.done')}
      </Button>
    )
  const label = t('editMode.edit')
  return (
    <Button
      variant={variant}
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
