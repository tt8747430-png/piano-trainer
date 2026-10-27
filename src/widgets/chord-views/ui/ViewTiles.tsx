import { useTranslation } from 'react-i18next'
import { MUSIC_VIEWS, type MusicView } from '@/entities/settings'
import { PictureTiles } from '@/shared/ui'
import type { ViewNeeds } from '../model/view-needs'
import { ViewPicture } from './ViewPicture'

/**
 * The Player's views of the music as tiles (ADR 0099), the top of its View: each a picture of the
 * view drawn in its own style over its name, two by two, the one shown chosen, as the layouts' tiles
 * are (ADR 0115). A view the music cannot show is greyed, what it needs its tooltip (ADR 0102:
 * words, chord symbols).
 */
export function ViewTiles({
  value,
  needs,
  onChange,
}: {
  /** The view shown. */
  value: MusicView
  needs: ViewNeeds
  onChange: (view: MusicView) => void
}) {
  const { t } = useTranslation('player')
  return (
    <PictureTiles
      label={t('views.label')}
      value={value}
      columns={2}
      tiles={MUSIC_VIEWS.map((view) => {
        const need = needs[view]
        return {
          value: view,
          label: t(`views.${view}`),
          picture: <ViewPicture view={view} />,
          reason: need === undefined ? undefined : t(`needs.${need}`),
        }
      })}
      onChange={onChange}
    />
  )
}
