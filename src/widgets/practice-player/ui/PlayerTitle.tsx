import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { keyHint } from '@/shared/lib/shortcuts'
import { RoundButton, usePageHeading } from '@/shared/ui'
import { PLAYER_KEYS } from '../model/player-keys'

/** Close, and the piece's title: the toolbar's lead; on a phone held upright the title's row is its own. */
export function PlayerTitle({ title, onClose }: { title: string; onClose: () => void }) {
  const { t } = useTranslation('common')
  const heading = usePageHeading<HTMLHeadingElement>(title)
  return (
    <div data-slot="player-lead" className="flex min-w-0 items-center gap-3">
      <RoundButton
        label={t('close')}
        title={keyHint(t('close'), PLAYER_KEYS.close)}
        icon={X}
        onClick={onClose}
      />
      <h1
        {...heading}
        className="min-w-0 flex-1 truncate text-lg leading-snug outline-none max-sm:px-1"
      >
        {title}
      </h1>
    </div>
  )
}
