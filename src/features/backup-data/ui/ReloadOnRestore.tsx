import { useEffect } from 'react'
import { onRestoreElsewhere } from '../model/restore-channel'

const reloadApp = () => window.location.reload()

/** Opens the app again when another tab restores a backup, so this tab's stores read it. */
export function ReloadOnRestore({ reload = reloadApp }: { reload?: () => void }) {
  useEffect(() => onRestoreElsewhere(reload), [reload])
  return null
}
