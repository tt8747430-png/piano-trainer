import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { type Key, printedNote } from '@/shared/lib/music'

/** A key's name in the learner's language: "F♯ minor". */
export function useKeyName(): (key: Key) => string {
  const { t } = useTranslation('music')
  return useCallback(
    (key) => t(key.minor ? 'key.minor' : 'key.major', { tonic: printedNote(key.tonic) }),
    [t],
  )
}
