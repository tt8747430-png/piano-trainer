import { Layers } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { SongVersion } from '@/features/practice'
import { PlayerTool } from '@/widgets/practice-player'

/**
 * The tools row's Version (R29 B8, in Simplify's place): the version playing, opening the Version
 * sheet, Chordify's Simplify one of its rows.
 */
export function VersionTool({ version, onOpen }: { version: SongVersion; onOpen: () => void }) {
  const { t } = useTranslation('player')
  const level = t(`version.level.${version}`)
  return (
    <PlayerTool
      icon={Layers}
      label={t('version.of', { level })}
      // The version playing is its name, shortened like the row's others where room is short.
      name={level}
      aria-haspopup="dialog"
      onClick={onOpen}
    />
  )
}
