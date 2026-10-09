import { useTranslation } from 'react-i18next'
import { modifierCaps, useShortcuts, useShortcutsPlatform } from '@/shared/lib/shortcuts'

/**
 * The score editor's keys, listed in the shortcuts' sheet: `shortcutOf` reads them, layer by layer,
 * so here they are only named, with the caps this keyboard prints.
 */
export function useEditorShortcutList(): void {
  const { t } = useTranslation('editor')
  const { mod, alt, shift } = modifierCaps(useShortcutsPlatform())
  useShortcuts(t('shortcuts.group'), [
    { label: t('shortcuts.value'), shown: ['1', '–', '5'] },
    { label: t('shortcuts.dot'), shown: ['.'] },
    { label: t('shortcuts.rest'), shown: ['0'] },
    { label: t('shortcuts.step'), shown: ['←', '→'] },
    { label: t('shortcuts.bar'), shown: [alt, '←', '→'] },
    { label: t('shortcuts.ends'), shown: ['Home', 'End'] },
    { label: t('shortcuts.semitone'), shown: ['↑', '↓'] },
    { label: t('shortcuts.octave'), shown: [mod, '↑', '↓'] },
    { label: t('shortcuts.delete'), shown: ['Backspace'] },
    { label: t('shortcuts.chord'), shown: ['Enter'] },
    { label: t('shortcuts.undo'), shown: [mod, 'Z'] },
    { label: t('shortcuts.redo'), shown: [shift, mod, 'Z'] },
    { label: t('shortcuts.bars'), shown: [mod, 'C', 'X', 'V'] },
  ])
}
