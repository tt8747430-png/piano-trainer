import { FolderPlus } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { NewDial, type MenuAction } from '@/shared/ui'
import type { LibraryKind } from '../model/library-words'
import { NameSheet } from './ArrangeSheets'

/**
 * A Practice library's New (canvas 169: one dial on every library): what the page makes (a pattern, a
 * progression) and New folder, the floating honey + at the bottom right on a phone and a laptop alike
 * (canvas 2026-11-17, "what creates or adds floats"), with New folder's sheet, rendered once on the
 * page.
 */
export function useLibraryNew(kind: LibraryKind, creates: readonly MenuAction[]): ReactNode {
  const { t } = useTranslation('practice')
  const [folder, setFolder] = useState(false)
  const actions: MenuAction[] = [
    ...creates,
    {
      key: 'folder',
      label: t('library.edit.newFolder'),
      icon: FolderPlus,
      onSelect: () => setFolder(true),
    },
  ]
  return (
    <>
      <NewDial label={t('library.new')} actions={actions} />
      {folder ? (
        <NameSheet sheet={{ kind: 'newFolder' }} onClose={() => setFolder(false)} kind={kind} />
      ) : null}
    </>
  )
}
