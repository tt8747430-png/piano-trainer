import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { EditAction } from '@/shared/ui'

/**
 * A library's Edit (R32): the pencil beside its title in the page's bar, Done in its place while the
 * places and rows are arranged. The page passes `edit` to its bar and `editing` to the library.
 */
export function useArrangeMode(): { readonly editing: boolean; readonly edit: EditAction } {
  const { t } = useTranslation('practice')
  const [editing, setEditing] = useState(false)
  return {
    editing,
    edit: {
      editing,
      label: t('library.edit.arrange'),
      onEdit: () => setEditing(true),
      onDone: () => setEditing(false),
    },
  }
}
