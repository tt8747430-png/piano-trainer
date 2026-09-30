import type { RegisteredRouter, ValidateNavigateOptions } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useGoBack } from '@/shared/lib'
import { RoundButton } from './RoundButton'

/** A screen's Back: the way the learner came in, or, opened directly, `fallback` (`useGoBack`). */
export function BackButton<TOptions>({
  fallback,
}: {
  fallback: ValidateNavigateOptions<RegisteredRouter, TOptions>
}) {
  const { t } = useTranslation('common')
  const back = useGoBack(fallback)
  return <RoundButton label={t('back')} icon={ArrowLeft} onClick={back} />
}
