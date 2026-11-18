import { Archive } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Said } from '@/shared/ui'

/** The archive with nothing in it, the kit's one empty state: what it is for, in a line. */
export function ArchiveEmpty() {
  const { t } = useTranslation('songs')
  return (
    <Said
      icon={Archive}
      title={t('archive.empty.title')}
      description={t('archive.empty.description')}
    />
  )
}
