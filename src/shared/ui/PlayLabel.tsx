import { Square } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

/** A Play button's label: what it plays, or Stop behind its square while that sounds. */
export function PlayLabel({ playing, children }: { playing: boolean; children: ReactNode }) {
  const { t } = useTranslation('common')
  return playing ? (
    <>
      <Square data-icon="inline-start" />
      {t('stop')}
    </>
  ) : (
    children
  )
}
