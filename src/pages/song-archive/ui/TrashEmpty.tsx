import { Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Said } from '@/shared/ui'

/** The Trash with nothing in it, the kit's one empty state: what it is for, in a line. */
export function TrashEmpty() {
  const { t } = useTranslation('songs')
  return (
    <Said icon={Trash2} title={t('trash.empty.title')} description={t('trash.empty.description')} />
  )
}
