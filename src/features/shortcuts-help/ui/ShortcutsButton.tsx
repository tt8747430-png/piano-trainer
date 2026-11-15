import { use } from 'react'
import { useTranslation } from 'react-i18next'
import { GroupLink } from '@/shared/ui'
import { OpenShortcutsContext } from './open-shortcuts'

/** The shortcuts' sheet from a settings group: a row, Shortcuts ›, as the board's link row. */
export function ShortcutsButton() {
  const { t } = useTranslation('common')
  const open = use(OpenShortcutsContext)
  return <GroupLink label={t('shortcuts.title')} onClick={open} />
}
