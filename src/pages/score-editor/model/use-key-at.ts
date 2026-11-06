import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'
import { sectionKey } from '@/features/score-editor'
import { noteName, printedSymbol, type Key } from '@/shared/lib/music'
import { useEditorState } from './editor-context'
import { useSignatureFrom } from './use-signature-from'

/** A key's names: its tonic printed, the major's alone and the minor's with its m (`E♭`, `Cm`). */
export function useKeyNames() {
  const { t } = useTranslation('music')
  const tonic = (key: Key) => printedSymbol(noteName(key.tonic))
  return {
    /** As a screen reader and a tooltip say it: `E♭ major`. */
    full: (key: Key) => t(key.minor ? 'key.minor' : 'key.major', { tonic: tonic(key) }),
    /** As a tile prints it: `E♭`, `Cm`. */
    short: (key: Key) => `${tonic(key)}${key.minor ? 'm' : ''}`,
  }
}

/**
 * The key in force where the palette's Key signature changes it: the song's own at its head, a
 * section's after.
 */
export const useKeyAt = () => {
  const at = useSignatureFrom()
  // The draft, not the key read from it: a section's key is parsed afresh each time, its tonic a new
  // object, so it is read once per draft (a selector returning it would never settle).
  const draft = useEditorState((state) => state.draft)
  return useMemo(
    () => (at.song ? draft.key : sectionKey(draft, at.section)),
    [at.song, draft, at.section],
  )
}
