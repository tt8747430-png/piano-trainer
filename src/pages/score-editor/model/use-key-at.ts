import { useTranslation } from 'react-i18next'
import { useShallow } from 'zustand/react/shallow'
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

/** The key in force where the picker changes it: the song's own at its head, a section's after. */
export const useKeyAt = (bar: number | undefined, song?: boolean) => {
  const at = useSignatureFrom(bar)
  const whole = song ?? at.song
  return useEditorState(
    useShallow((state) => (whole ? state.draft.key : sectionKey(state.draft, at.section))),
  )
}
