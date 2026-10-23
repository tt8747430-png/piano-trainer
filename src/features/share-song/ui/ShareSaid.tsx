import { useTranslation } from 'react-i18next'
import type { ShareSaid as Said } from '../model/use-share-song'

const WORDS = { copied: 'shareCopied', failed: 'shareFailed', tooLong: 'shareTooLong' } as const

/** What sharing said (copied, failed, too long), in a quiet line that a screen reader hears. */
export function ShareSaid({ said }: { said: Said }) {
  const { t } = useTranslation('piece')
  return (
    <p role="status" className="text-sm text-muted-foreground empty:hidden">
      {said ? t(WORDS[said]) : ''}
    </p>
  )
}
