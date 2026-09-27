import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { RoundButton } from '@/shared/ui'

/** Close, and the piece's title: the toolbar's lead. */
export function PlayerTitle({ title, onClose }: { title: string; onClose: () => void }) {
  const { t } = useTranslation('common')
  return (
    <div className="flex min-w-0 items-center gap-3">
      <RoundButton label={t('close')} icon={X} onClick={onClose} />
      <h1 className="min-w-0 flex-1 truncate text-lg">{title}</h1>
    </div>
  )
}
