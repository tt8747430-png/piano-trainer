import { useTranslation } from 'react-i18next'
import { useKeyName } from '@/shared/i18n'
import {
  keyFromParam,
  keyParam,
  noteFromParam,
  noteParam,
  writtenKey,
  writtenKeyAccidentals,
  type KeyParam,
} from '@/shared/lib/music'
import { NoteChoice } from './NoteChoice'
import { Segmented } from './Segmented'

const MODES = ['major', 'minor'] as const

/**
 * A key as it is written: its tonic's letter and accidental, then Major or Minor. Only the accidentals
 * a key signature writes are offered (D♭ major, C♯ minor), so the key chosen is the key named; the
 * other mode keeps the tonic, respelled only where no signature writes it (D♭ major → C♯ minor).
 */
export function KeyChoice({
  value,
  onChange,
}: {
  value: KeyParam
  onChange: (key: KeyParam) => void
}) {
  const { t } = useTranslation('music')
  const keyName = useKeyName()
  const key = keyFromParam(value)
  const write = (next: KeyParam) => (next === value ? undefined : onChange(next))
  return (
    <NoteChoice
      label={t('key.label')}
      value={noteParam(key.tonic)}
      accidentals={(letter) => writtenKeyAccidentals(letter, key.minor)}
      name={(tonic) => keyName({ tonic, minor: key.minor })}
      onChange={(tonic) => write(keyParam({ tonic: noteFromParam(tonic), minor: key.minor }))}
    >
      <div className="@2xl:w-48 @2xl:shrink-0">
        <Segmented
          label={t('key.mode')}
          value={key.minor ? 'minor' : 'major'}
          options={MODES.map((mode) => ({ value: mode, label: t(`key.${mode}Mode`) }))}
          onChange={(mode) =>
            write(keyParam(writtenKey({ tonic: key.tonic, minor: mode === 'minor' })))
          }
        />
      </div>
    </NoteChoice>
  )
}
