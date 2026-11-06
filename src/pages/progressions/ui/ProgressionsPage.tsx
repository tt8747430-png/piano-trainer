import { useNavigate, useSearch } from '@tanstack/react-router'
import { Library, Plus } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { editsContent, useAccount } from '@/shared/lib/account'
import { C_MAJOR, keyParam } from '@/shared/lib/music'
import {
  BackButton,
  Fab,
  FloatingActions,
  ScreenHeader,
  SpeedDial,
  SpeedDialAction,
} from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { NewProgressionSheet } from '@/widgets/content-editor'
import { PracticeLibrary, useArrangeMode } from '@/widgets/practice-library'
import { SettingsGear } from '@/widgets/practice-pages'
import { KeepProgressionSheet } from '@/widgets/progression-explorer'
import { useProgressionLibrary } from '../model/use-progression-library'

/** A new progression starts from the library's first line, in C. */
const NEW_LINE = { name: '', line: 'I-V-vi-IV', key: keyParam(C_MAJOR) }

/** What is open over the library: nothing, New progression, or an editor's new one in the library. */
type Open = 'none' | 'mine' | 'library'

/**
 * Progressions (R30-4): the library is the page, the Songs library's shape, each style a place, Mine
 * what the learner keeps; a row opens the progression's own page. New progression floats, the honey
 * +, keeping one typed in Mine; an editor's + adds one to the library too.
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
  return (
    <div className="flex flex-col gap-4 pb-4">
      <ScreenHeader
        title={t('pages.progressions')}
        back={<BackButton />}
        edit={edit}
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
      {editing ? null : (
        <FloatingActions>
          {editor ? (
            <SpeedDial label={t('progressions.mine.new')} icon={Plus} main>
              <SpeedDialAction
                label={t('progressions.edit.new')}
                icon={Library}
                onClick={() => setOpen('library')}
              />
              <SpeedDialAction label={t('progressions.mine.new')} icon={Plus} onClick={newMine} />
            </SpeedDial>
          ) : (
            <Fab label={t('progressions.mine.new')} icon={Plus} onClick={newMine} />
          )}
        </FloatingActions>
      )}
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
