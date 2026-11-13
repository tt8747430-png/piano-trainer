import { useNavigate, useSearch } from '@tanstack/react-router'
import { Library, Plus } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { editsContent, useAccount } from '@/shared/lib/account'
import { C_MAJOR, keyParam } from '@/shared/lib/music'
import { BackButton, ScreenHeader, type MenuAction } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { NewProgressionSheet } from '@/widgets/content-editor'
import { PracticeLibrary, useArrangeMode, useLibraryNew } from '@/widgets/practice-library'
import { SettingsGear } from '@/widgets/practice-pages'
import { KeepProgressionSheet } from '@/widgets/progression-explorer'
import { useProgressionLibrary } from '../model/use-progression-library'

/** A new progression starts from the library's first line, in C. */
const NEW_LINE = { name: '', line: 'I-V-vi-IV', key: keyParam(C_MAJOR) }

/** What is open over the library: nothing, New progression, or an editor's new one in the library. */
type Open = 'none' | 'mine' | 'library'

/**
 * Progressions (R30-4): the library is the page, the Songs library's shape, each style a place, Mine
 * what the learner keeps; a row opens the progression's own page. New makes a progression of the
 * learner's, kept in Mine, or a folder; an editor's New adds one to the library too: the honey + on
 * a phone, New ▾ in the bar on a laptop (canvas 169).
 */
export function ProgressionsPage() {
  const { t } = useTranslation('practice')
  const view = useSearch({ from: '/shell/practice/progressions' })
  const { account } = useAccount()
  const navigate = useNavigate()
  const { groups, items } = useProgressionLibrary()
  const { editing, edit } = useArrangeMode()
  const [open, setOpen] = useState<Open>('none')
  const editor = editsContent(account)
  const newMine = () => setOpen('mine')
  const creates: MenuAction[] = [
    { key: 'mine', label: t('progressions.mine.new'), icon: Plus, onSelect: newMine },
    {
      key: 'library',
      label: t('progressions.edit.new'),
      icon: Library,
      hidden: !editor,
      onSelect: () => setOpen('library'),
    },
  ]
  const made = useLibraryNew('progressions', creates)
  return (
    <div className="flex flex-col gap-4 pb-4">
      <ScreenHeader
        title={t('pages.progressions')}
        back={<BackButton />}
        edit={edit}
        tools={editing ? undefined : made.menu}
        settings={<SettingsGear page="progressions" />}
      />
      <PracticeLibrary
        kind="progressions"
        view={view}
        items={items}
        groups={groups}
        groupWord="style"
        levels={false}
        extra={t('library.table.numerals')}
        mine={{
          empty: (
            <Button variant="soft" onClick={newMine}>
              <Plus data-icon="inline-start" aria-hidden />
              {t('progressions.mine.new')}
            </Button>
          ),
        }}
        screen={t('pages.progressions')}
        editing={editing}
      />
      {editing ? null : made.dial}
      {open === 'mine' ? (
        <KeepProgressionSheet
          open
          onOpenChange={(next) => setOpen(next ? 'mine' : 'none')}
          start={NEW_LINE}
          onKept={(progressionId, key) =>
            void navigate({
              to: '/practice/progressions/$progressionId',
              params: { progressionId },
              search: { key },
            })
          }
        />
      ) : null}
      {editor ? (
        <NewProgressionSheet
          open={open === 'library'}
          onOpenChange={(next) => setOpen(next ? 'library' : 'none')}
        />
      ) : null}
    </div>
  )
}
