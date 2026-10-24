import { useTranslation } from 'react-i18next'

/**
 * How many skills wait to be checked (`useGapsCount`), behind the gap's dot: after My gaps' name in
 * Quiz's bar, and at the end of the Quiz row on Practice. Nothing while there are none.
 */
export function GapsBadge({ count }: { count: number }) {
  const { t } = useTranslation('practice')
  if (count === 0) return null
  return (
    <span className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-muted-foreground tabular-nums">
      <span aria-hidden className="size-2.5 rounded-full bg-attention" />
      {t('quiz.gaps', { count })}
    </span>
  )
}
