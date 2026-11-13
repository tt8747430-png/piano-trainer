import { AlignLeft, FileText, LayoutGrid, Piano } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSettingsStoreApi, type MusicView } from '@/entities/settings'
import { setScoreView } from '@/features/set-preference'
import { ViewPill } from '@/shared/ui'
import type { ViewNeeds } from '@/widgets/chord-views'

/** The views in the order the bar shows them (its canvas): the score first, each with its picture. */
const PICKED = [
  { view: 'sheet', icon: FileText },
  { view: 'diagrams', icon: Piano },
  { view: 'grid', icon: LayoutGrid },
  { view: 'lyrics', icon: AlignLeft },
] as const satisfies readonly { view: MusicView; icon: unknown }[]

/**
 * The Player's views (its canvas, Chordify's Pick your view): one pill in the bar's middle, the
 * one shown filled; a view the music cannot show greyed, saying what it needs. What each view shows
 * is the Player's Settings › Display's.
 */
export function PickView({
  shown,
  needs,
}: {
  /** The view shown: the one saved, or the one it falls back to where the music cannot show it. */
  shown: MusicView
  /** The views the music cannot show, with what each needs. */
  needs: ViewNeeds
}) {
  const { t } = useTranslation('player')
  const settings = useSettingsStoreApi()
  return (
    <ViewPill
      label={t('views.label')}
      value={shown}
      views={PICKED.map(({ view, icon }) => {
        const need = needs[view]
        return {
          value: view,
          label: t(`views.short.${view}`),
          icon,
          reason: need === undefined ? undefined : t(`needs.${need}`),
        }
      })}
      onChange={(music) => setScoreView(settings, { music })}
    />
  )
}
