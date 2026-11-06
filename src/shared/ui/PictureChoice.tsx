import type { ReactNode } from 'react'
import { PictureTiles, type PictureTile } from './PictureTiles'
import { SettingField } from './SettingField'

/**
 * A setting that changes how something looks (R21), shown as iOS's Light/Dark and macOS's Dock
 * position show theirs: its name (and its ⓘ where the name can't say it), then each option as a small
 * drawing over a one- or two-word label, the chosen one in the one selected style (R15). Its
 * drawings are `SettingPictures`.
 */
export function PictureChoice<V extends string>({
  label,
  description,
  info,
  setting,
  value,
  options,
  onChange,
}: {
  label: string
  /** What it does, in one line under its name (R32). */
  description?: string | undefined
  info?: ReactNode
  /** The preference it sets (`data-setting`), as every settings row carries it. */
  setting?: string
  value: V
  options: readonly PictureTile<V>[]
  onChange: (value: V) => void
}) {
  return (
    <SettingField label={label} description={description} info={info} setting={setting}>
      <PictureTiles
        label={label}
        value={value}
        tiles={options}
        columns={options.length === 2 ? 2 : options.length === 3 ? 3 : 4}
        onChange={onChange}
      />
    </SettingField>
  )
}
