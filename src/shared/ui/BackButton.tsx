import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useUp } from '@/shared/lib'
import { RoundButton } from './RoundButton'

/** A screen's Back: up to the screen's parent (`useUp`, rule 26), never back through the history. */
export function BackButton() {
  const { t } = useTranslation('common')
  const up = useUp()
  return <RoundButton label={t('back')} icon={ArrowLeft} onClick={up} />
}
