import { Ellipsis, FileMusic } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ActionMenu, type MenuAction } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { exportMidi, type PlayedMusic } from '../model/export-midi'

/**
 * The bar's More (ADR 0099), after the Setup, in the song page's More's look: a piece's Song
 * information (`info`), Export to MIDI (the music as the Player plays it now, at the tempo chosen,
 * saved under its title) and an own song's Share (`share`). A walk, a progression, a chromatic walk
 * or an exercise has Export to MIDI alone.
 */
export function PlayerMore({
  music,
  info,
  share,
}: {
  music: PlayedMusic
  info?: MenuAction | undefined
  share?: MenuAction | undefined
}) {
  const { t } = useTranslation('player')
  const actions: readonly MenuAction[] = [
    ...(info ? [info] : []),
    { key: 'midi', label: t('exportMidi'), icon: FileMusic, onSelect: () => exportMidi(music) },
    ...(share ? [share] : []),
  ]
  return (
    <ActionMenu
      label={t('more')}
      align="end"
      trigger={<Ellipsis aria-hidden />}
      render={<Button variant="surface" size="icon" aria-label={t('more')} title={t('more')} />}
      actions={actions}
    />
  )
}
