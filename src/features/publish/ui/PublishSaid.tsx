import { useTranslation } from 'react-i18next'
import type { PublishSaid as Said } from '../model/use-publish'

const WORDS = {
  published: 'public.published',
  updated: 'public.updated',
  unpublished: 'public.unpublished',
  offline: 'public.publishOffline',
  limit: 'public.publishLimit',
  failed: 'public.publishFailed',
} as const

/**
 * What publishing said, in a quiet line that a screen reader hears (a polite live line: the page's
 * one status line is Share's).
 */
export function PublishSaid({ said }: { said: Said }) {
  const { t } = useTranslation('songs')
  return (
    <p aria-live="polite" className="text-sm text-muted-foreground empty:hidden">
      {said ? t(WORDS[said]) : ''}
    </p>
  )
}
