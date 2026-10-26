import { Ellipsis, FileMusic } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useStaffTitle } from '@/entities/piece'
import { ActionMenu, type MenuAction } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { exportMidi, type PlayedMusic } from '../model/export-midi'

/**
 * The bar's More (ADR 0099), after the Setup, in the song page's More's look: a piece's Song
 * information (`info`), Export to MIDI (the music as the Player plays it now, at the tempo chosen,
 * saved under its title, each part's track named as the screen names it) and an own song's Share
 * (`share`). A walk, a progression, a chromatic walk or an exercise has Export to MIDI alone.
 */
export function PlayerMore({
  music,
  staves,
  info,
  share,
}: {
  music: Omit<PlayedMusic, 'names'>
  /** Each single staff's own name, top down; none where a staff has none. */
  staves: readonly (string | undefined)[]
  info?: MenuAction | undefined
  share?: MenuAction | undefined
}) {
  const { t } = useTranslation(['player', 'common'])
  const staffTitle = useStaffTitle()
  const names = {
    staff: (place: number) => staffTitle(staves[place], place),
    rh: t('common:hands.rh'),
    lh: t('common:hands.lh'),
  }
  const actions: readonly MenuAction[] = [
    ...(info ? [info] : []),
    {
      key: 'midi',
      label: t('player:exportMidi'),
      icon: FileMusic,
      onSelect: () => exportMidi({ ...music, names }),
    },
    ...(share ? [share] : []),
  ]
  return (
    <ActionMenu
      label={t('player:more')}
      align="end"
      trigger={<Ellipsis aria-hidden />}
      render={
        <Button
          variant="surface"
          size="icon"
          aria-label={t('player:more')}
          title={t('player:more')}
        />
      }
      actions={actions}
    />
  )
}
