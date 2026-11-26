import { useTranslation } from 'react-i18next'

/**
 * A lesson's state at its row's end, as the Section board draws it: Done in the learned green, or how
 * far it has come ("1 of 3") in soft ink, where it counts.
 */
export function LessonStatus({ done, count }: { done: boolean; count?: string }) {
  const { t } = useTranslation('piece')
  if (done) return <span className="shrink-0 text-sm text-learned">{t('learnSection.done')}</span>
  return count ? (
    <span className="shrink-0 text-sm text-muted-foreground tabular-nums">{count}</span>
  ) : null
}
