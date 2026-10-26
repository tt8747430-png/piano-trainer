import { ChevronDown, Eye } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { StaffName } from '@/entities/piece'
import {
  MUSIC_VIEWS,
  selectScoreView,
  useSettings,
  useSettingsStoreApi,
  type MusicView,
} from '@/entities/settings'
import { setScoreView } from '@/features/set-preference'
import type { Clef } from '@/shared/lib/music'
import { MenuSection, SwitchRow } from '@/shared/ui'
import { ViewTiles, type ViewNeeds } from '@/widgets/chord-views'
import { PlayerTool } from '@/widgets/practice-player'
import { KeysSwitch, ScoreViewMenu, ViewSection } from '@/widgets/score-view-menu'

/** Each view of the music in a line, its name first: the ⓘ beside Show the music as. */
function ViewsAbout() {
  const { t } = useTranslation('player')
  return (
    <ul className="flex flex-col gap-1.5">
      {MUSIC_VIEWS.map((view) => (
        <li key={view}>
          <span className="font-semibold">{t(`views.${view}`)}</span>: {t(`views.about.${view}`)}
        </li>
      ))}
    </ul>
  )
}

/**
 * The Player's View (ADR 0099, 0102): the tools row's first tool, named by the view shown with a
 * chevron, opening the View menu from the row's start. Top down: the views as tiles under Show the
 * music as, each named in a line by its ⓘ, a view the music cannot show greyed, and Ask each time a
 * song opens; the view shown's own, headed by its name; then what every view has, the keys.
 */
export function PlayerViewMenu({
  shown,
  needs,
  staves,
  piano,
}: {
  /** The view shown: the one saved, or the one it falls back to where the music cannot show it. */
  shown: MusicView
  /** The views the music cannot show, with what each needs. */
  needs: ViewNeeds
  staves: readonly { readonly name?: StaffName; readonly clef: Clef }[]
  piano: boolean
}) {
  const { t } = useTranslation('player')
  const settings = useSettingsStoreApi()
  const scoreView = useSettings(selectScoreView)
  const name = t(`views.${shown}`)
  return (
    <ScoreViewMenu
      trigger={
        <PlayerTool icon={Eye} label={t('views.shown', { view: name })} name={name}>
          <ChevronDown
            aria-hidden
            className="text-muted-foreground transition-transform duration-200 ease-out group-data-popup-open/button:rotate-180"
          />
        </PlayerTool>
      }
      from="tools"
    >
      <MenuSection title={t('views.label')} info={<ViewsAbout />}>
        <ViewTiles
          value={shown}
          needs={needs}
          onChange={(music) => setScoreView(settings, { music })}
        />
        <SwitchRow
          label={t('views.ask')}
          checked={scoreView.askOnOpen}
          onCheckedChange={(askOnOpen) => setScoreView(settings, { askOnOpen })}
          className="border-b-0"
        />
      </MenuSection>
      <ViewSection view={shown} staves={staves} piano={piano} />
      <MenuSection
        title={t('views.every')}
        className="[&>[data-slot=switch-row]:last-child]:border-b-0"
      >
        <KeysSwitch shown={scoreView.keys} onShow={(keys) => setScoreView(settings, { keys })} />
      </MenuSection>
    </ScoreViewMenu>
  )
}
