import { Upload } from 'lucide-react'
import type { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import type { ContentKind } from '@/shared/api/content'
import { RowLink } from '@/shared/ui'
import { useStanding } from '../model/use-standing'

/**
 * An item's Publish… on its Settings page (R29 B6), first of its publishing rows: a link to its
 * Publish page, where it stands as its value.
 */
export function PublishRow({
  kind,
  id,
  draft,
  link,
}: {
  kind: ContentKind
  id: string
  draft: { readonly drafted: boolean; readonly opened: number }
  /** A router `Link` to its Publish page. */
  link: ReactElement
}) {
  const { t } = useTranslation('editor')
  const { published, standing } = useStanding(kind, id, draft)
  return (
    <RowLink
      title={t('publishPage.open')}
      value={published === null ? undefined : t(`publishPage.standing.${standing}`)}
      icon={Upload}
      paint="sky"
      render={link}
    />
  )
}
