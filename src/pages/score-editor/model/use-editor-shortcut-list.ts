import { useTranslation } from 'react-i18next'
import { modifierCaps, useShortcuts, useShortcutsPlatform } from '@/shared/lib/shortcuts'
import { toolCaps, type Tool } from './shortcuts'

/**
 * The score editor's keys, listed in the shortcuts' sheet: `shortcutOf` reads them, layer by layer,
 * so here they are only named, with the caps this keyboard prints; the tools' from the table their
 * tooltips print too (`TOOL_SHORTCUTS`).
 */
export function useEditorShortcutList(): void {
  const { t } = useTranslation('editor')
  const caps = modifierCaps(useShortcutsPlatform())
  const { mod, alt, shift } = caps
  const keys = (...tools: Tool[]) =>
    tools.flatMap((tool, i) => {
      const each = toolCaps(tool, caps)
      // The modifiers once, before the first: ⇧ < >.
      return i === 0 ? each : each.slice(-1)
    })
  useShortcuts(t('shortcuts.group'), [
    { label: t('shortcuts.value'), shown: ['1', '–', '7'] },
    { label: t('shortcuts.dot'), shown: keys('dot') },
    { label: t('shortcuts.rest'), shown: keys('rest') },
    { label: t('shortcuts.grace'), shown: keys('grace') },
    { label: t('shortcuts.accidentals'), shown: keys('natural', 'sharp', 'flat') },
    { label: t('shortcuts.respell'), shown: keys('respell') },
    { label: t('shortcuts.tie'), shown: keys('tie') },
    { label: t('shortcuts.tuplet'), shown: [shift, '2', '–', '9'] },
    { label: t('shortcuts.annotation'), shown: keys('annotation') },
    { label: t('shortcuts.numeral'), shown: keys('numeral') },
    { label: t('shortcuts.mode'), shown: keys('mode') },
    { label: t('shortcuts.slur'), shown: keys('slur') },
    { label: t('shortcuts.hairpins'), shown: keys('cresc', 'dim') },
    { label: t('shortcuts.octaveLines'), shown: keys('8va', '8vb') },
    { label: t('shortcuts.trill'), shown: keys('trill') },
    { label: t('shortcuts.pedal'), shown: keys('pedal') },
    { label: t('shortcuts.barAfter'), shown: keys('barAfter') },
    { label: t('shortcuts.barDelete'), shown: keys('barDelete') },
    { label: t('shortcuts.newLine'), shown: keys('newLine') },
    { label: t('shortcuts.repeats'), shown: keys('repeatStart', 'repeatEnd') },
    { label: t('shortcuts.step'), shown: ['←', '→'] },
    { label: t('shortcuts.bar'), shown: [alt, '←', '→'] },
    { label: t('shortcuts.line'), shown: ['Enter'] },
    { label: t('shortcuts.lineBack'), shown: [shift, 'Enter'] },
    { label: t('shortcuts.ends'), shown: ['Home', 'End'] },
    { label: t('shortcuts.extend'), shown: [shift, '←', '→'] },
    { label: t('shortcuts.extendBar'), shown: [shift, alt, '←', '→'] },
    { label: t('shortcuts.extendEnds'), shown: [shift, 'Home', 'End'] },
    { label: t('shortcuts.deselect'), shown: ['Esc'] },
    { label: t('shortcuts.staff'), shown: [alt, '↑', '↓'] },
    { label: t('shortcuts.keyStep'), shown: ['↑', '↓'] },
    { label: t('shortcuts.semitone'), shown: [shift, '↑', '↓'] },
    { label: t('shortcuts.octave'), shown: [mod, '↑', '↓'] },
    { label: t('shortcuts.delete'), shown: ['Backspace'] },
    { label: t('shortcuts.chord'), shown: keys('chord') },
    { label: t('shortcuts.lyrics'), shown: keys('lyrics') },
    { label: t('shortcuts.fingering'), shown: keys('fingering') },
    { label: t('shortcuts.undo'), shown: [mod, 'Z'] },
    { label: t('shortcuts.redo'), shown: [shift, mod, 'Z'] },
    { label: t('shortcuts.clip'), shown: [mod, 'C', 'X', 'V'] },
  ])
}
