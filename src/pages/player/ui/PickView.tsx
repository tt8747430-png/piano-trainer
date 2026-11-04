import { ChevronDown, Eye } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSettingsStoreApi, type MusicView } from '@/entities/settings'
import { setScoreView } from '@/features/set-preference'
import { Segmented } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from '@/shared/ui/primitives/popover'
import { ViewPicture, type ViewNeeds } from '@/widgets/chord-views'
import { PlayerTool } from '@/widgets/practice-player'

/** The views in the order Pick your view lists them (R29, Chordify's): the score first. */
const PICKED: readonly MusicView[] = ['sheet', 'grid', 'diagrams', 'lyrics']

/**
 * The Player's view (R29, Chordify's Pick your view): the tools row's first tool, named by the view
 * shown with a chevron, opening a panel from the row: the views side by side (one the music cannot
 * show greyed, saying what it needs), a picture of the one chosen, Show this when opening a song,
 * and Done. What each view shows is the Player's Settings › Display's.
 */
export function PickView({
  shown,
  needs,
  openAtStart,
}: {
  /** The view shown: the one saved, or the one it falls back to where the music cannot show it. */
  shown: MusicView
  /** The views the music cannot show, with what each needs. */
  needs: ViewNeeds
  /** Open as the screen opens: a piece's, where the learner asks for it. */
  openAtStart: boolean
}) {
  const { t } = useTranslation('player')
  const settings = useSettingsStoreApi()
  const [open, setOpen] = useState(openAtStart)
  const name = t(`views.short.${shown}`)
  // What a greyed view needs, said in the panel: a phone shows no tooltip.
  const greyed = PICKED.flatMap((view) => {
    const need = needs[view]
    return need === undefined ? [] : [[view, need] as const]
  })
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <PlayerTool icon={Eye} label={t('views.shown', { view: name })} name={name}>
            <ChevronDown
              aria-hidden
              className="text-muted-foreground transition-transform duration-200 ease-out group-data-popup-open/button:rotate-180"
            />
          </PlayerTool>
        }
      />
      <PopoverContent
        aria-label={t('views.pick')}
        align="start"
        className="w-[min(24rem,calc(100vw-2rem))] items-center gap-3 p-4 text-center"
      >
        <PopoverTitle className="font-display text-lg font-semibold">
          {t('views.pick')}
        </PopoverTitle>
        <p className="text-sm text-muted-foreground">{t('views.pickNote')}</p>
        <Segmented
          label={t('views.label')}
          value={shown}
          options={PICKED.map((view) => {
            const need = needs[view]
            return {
              value: view,
              label: t(`views.short.${view}`),
              reason: need === undefined ? undefined : t(`needs.${need}`),
            }
          })}
          onChange={(music) => setScoreView(settings, { music })}
        />
        {greyed.length > 0 ? (
          <p className="text-sm text-pretty text-muted-foreground">
            {greyed
              .map(([view, need]) => `${t(`views.short.${view}`)}: ${t(`needs.${need}`)}`)
              .join(' · ')}
          </p>
        ) : null}
        <div
          data-view-picture={shown}
          className="grid w-full place-items-center rounded-card bg-muted p-4 [&_svg]:h-24 [&_svg]:w-40"
        >
          <ViewPicture view={shown} />
        </div>
        <Button className="self-stretch" onClick={() => setOpen(false)}>
          {t('views.done')}
        </Button>
      </PopoverContent>
    </Popover>
  )
}
