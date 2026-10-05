import { useTranslation } from 'react-i18next'
import { useKeyName } from '@/shared/i18n'
import {
  circleKey,
  keyFromParam,
  keyParam,
  noteFromParam,
  noteParam,
  pitchClassOf,
  type KeyParam,
} from '@/shared/lib/music'
import { NotePicker } from './NotePicker'
import { Segmented } from './Segmented'

const MODES = ['major', 'minor'] as const

/**
 * One of the 24 keys, in two taps at most: its tonic among the twelve notes, spelled as the circle
 * of fifths spells that key, and Major or Minor.
 */
export function KeyPicker({
  value,
  onChange,
}: {
  value: KeyParam
  onChange: (key: KeyParam) => void
}) {
  const { t } = useTranslation('music')
  const keyName = useKeyName()
  const key = keyFromParam(value)
  return (
    <div className="flex flex-col gap-2">
      <NotePicker
        label={t('key.label')}
        value={noteParam(key.tonic)}
        spell={(pc) => circleKey(pc, key.minor).tonic}
        name={(tonic) => keyName({ tonic, minor: key.minor })}
        onChange={(tonic) =>
          onChange(keyParam(circleKey(pitchClassOf(noteFromParam(tonic)), key.minor)))
        }
      />
      <Segmented
        label={t('key.mode')}
        value={key.minor ? 'minor' : 'major'}
        options={MODES.map((mode) => ({ value: mode, label: t(`key.${mode}Mode`) }))}
        onChange={(mode) =>
          onChange(keyParam(circleKey(pitchClassOf(key.tonic), mode === 'minor')))
        }
      />
    </div>
  )
}
