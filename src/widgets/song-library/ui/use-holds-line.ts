import { useTranslation } from 'react-i18next'
import type { FolderHolds } from './FolderFace'

/** What a folder holds, in a line: "23 songs · 4 learned", "Empty" while it holds nothing. */
export function useHoldsLine(holds: FolderHolds): string {
  const { t } = useTranslation('songs')
  const counted = [
    holds.folders > 0 ? t('folder.folderCount', { count: holds.folders }) : null,
    holds.songs > 0 ? t('folder.songCount', { count: holds.songs }) : null,
    holds.learned ? t('folder.learnedCount', { count: holds.learned }) : null,
  ].filter((part) => part !== null)
  return counted.length > 0 ? counted.join(' · ') : t('folder.empty')
}
