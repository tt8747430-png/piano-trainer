import { useTranslation } from 'react-i18next'
import type { PublicEntry } from '@/shared/api/public-library'

/** Who published an item, as Explore names them: their public name, else a learner (D12). */
export function useAuthorName(entry: Pick<PublicEntry, 'authorName'>): string {
  const { t } = useTranslation('songs')
  return entry.authorName || t('explore.learner')
}
