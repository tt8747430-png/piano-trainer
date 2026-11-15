import { AlignLeft, FileText, LayoutGrid } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSettingsStoreApi, type MusicView } from '@/entities/settings'
import { setScoreView } from '@/features/set-preference'
import { ViewPill, KeysIcon } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/shared/ui/primitives/dropdown-menu'
import type { ViewNeeds } from '@/widgets/chord-views'

/** The views in the order the bar shows them (its canvas): the score first, each with its picture. */
const PICKED = [
  { view: 'sheet', icon: FileText },
  { view: 'diagrams', icon: KeysIcon },
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
      size="views"
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

/**
 * The Player's views on a phone (loop round 24, its canvas): one button in the bar wearing the view
 * shown, opening the four as a menu, the one shown ticked; a view the music cannot show greyed,
 * saying what it needs. It only shows a view: what each shows is Settings › Display's.
 */
export function ViewMenu({ shown, needs }: { shown: MusicView; needs: ViewNeeds }) {
  const { t } = useTranslation('player')
  const settings = useSettingsStoreApi()
  const Shown = PICKED.find(({ view }) => view === shown)?.icon ?? FileText
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="tool"
            size="icon"
            aria-label={t('views.shown', { view: t(`views.short.${shown}`) })}
            title={t('views.label')}
          />
        }
      >
        <Shown aria-hidden />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-55">
        <DropdownMenuRadioGroup
          value={shown}
          onValueChange={(music: MusicView) => setScoreView(settings, { music })}
        >
          {PICKED.map(({ view, icon: Icon }) => {
            const need = needs[view]
            return (
              <DropdownMenuRadioItem
                key={view}
                value={view}
                disabled={need !== undefined}
                title={need === undefined ? undefined : t(`needs.${need}`)}
              >
                <Icon aria-hidden />
                {t(`views.short.${view}`)}
              </DropdownMenuRadioItem>
            )
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
