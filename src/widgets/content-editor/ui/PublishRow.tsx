import { useTranslation } from 'react-i18next'
import type { ContentKind } from '@/shared/api/content'
import { RowButton } from '@/shared/ui'
import { useStanding } from '../model/use-standing'

/**
 * An item's Publish in its Settings window (R29 B6), first of its publishing rows: it opens the
 * window's Publish page, where it stands as its value.
 */
export function PublishRow({
  kind,
  id,
  draft,
  onOpen,
}: {
  kind: ContentKind
  id: string
  draft: { readonly drafted: boolean; readonly opened: number }
  /** Opens the window's Publish page. */
  onOpen: () => void
}) {
  const { t } = useTranslation('editor')
  const { published, standing } = useStanding(kind, id, draft)
  return (
    <RowButton
      title={t('publishPage.open')}
      value={published === null ? undefined : t(`publishPage.standing.${standing}`)}
      opens
      onClick={onOpen}
    />
  )
}
