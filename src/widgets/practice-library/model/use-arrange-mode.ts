import { useState } from 'react'
import type { EditAction } from '@/shared/ui'

/**
 * A library's Edit (R32): the bar's glass Edit word beside its title, as every bar's, Done in its
 * place while the places and rows are arranged. The page passes `edit` to its bar and `editing` to
 * the library.
 */
export function useArrangeMode(): { readonly editing: boolean; readonly edit: EditAction } {
  const [editing, setEditing] = useState(false)
  return {
    editing,
    edit: {
      editing,
      onEdit: () => setEditing(true),
      onDone: () => setEditing(false),
    },
  }
}
