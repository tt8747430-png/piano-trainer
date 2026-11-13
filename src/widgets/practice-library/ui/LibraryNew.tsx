import { FolderPlus } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from '@/shared/lib'
import { LIBRARY_PANES, NewDial, NewMenu, type MenuAction } from '@/shared/ui'
import type { LibraryKind } from '../model/library-words'
import { NameSheet } from './ArrangeSheets'

/**
 * A Practice library's New (canvas 169: one dial on every library): what the page makes (a pattern, a
 * progression) and New folder, a honey New ▾ in the bar on a laptop (`menu`, for the bar's tools) and
 * the floating dial on a phone (`dial`, with New folder's sheet, rendered once on the page).
 */
export function useLibraryNew(
  kind: LibraryKind,
  creates: readonly MenuAction[],
): { menu: ReactNode; dial: ReactNode } {
  const { t } = useTranslation('practice')
  const wide = useMediaQuery(LIBRARY_PANES)
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
  return {
    menu: wide ? <NewMenu label={t('library.new')} actions={actions} /> : null,
    dial: (
      <>
        {wide ? null : <NewDial label={t('library.new')} actions={actions} />}
        {folder ? (
          <NameSheet sheet={{ kind: 'newFolder' }} onClose={() => setFolder(false)} kind={kind} />
        ) : null}
      </>
    ),
  }
}
