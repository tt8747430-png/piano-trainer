import { Hand, Hash, Music, Piano, SlidersHorizontal, Type } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  selectPractice,
  selectScoreView,
  useSettings,
  useSettingsStoreApi,
} from '@/entities/settings'
import { setPracticeToggle, setScoreView, setStaffShown } from '@/features/set-preference'
import { SHEET_VIEWS } from '@/shared/lib'
import { Labelled, Segmented, SheetViewIcon, SwitchRow } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/primitives/popover'

/** The layouts in the order the menu offers them: the Player's own first. */
const LAYOUTS = ['horizontal', ...SHEET_VIEWS.filter((each) => each !== 'horizontal')] as const

/**
 * How the Player shows the score (ADR 0064, Soundslice's view settings), from its bar, remembered for
 * every piece: the staves (the tune's own over the piano while it plays, each hand's shown or hidden),
 * what is shown (the notation, chord names, finger numbers, note names, the keys) and the layout,
 * across, down the screen or on A4 pages.
 */
export function PlayerViewMenu() {
  const { t } = useTranslation('player')
  const store = useSettingsStoreApi()
  const view = useSettings(selectScoreView)
  const practice = useSettings(selectPractice)
  const shown = (staff: 'treble' | 'bass') => !view.hidden.includes(staff)
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="surface"
            size="icon"
            aria-label={t('view.open')}
            title={t('view.open')}
            className="lg:w-auto lg:gap-2 lg:px-4"
          />
        }
      >
        <SlidersHorizontal aria-hidden />
        <span className="max-lg:sr-only">{t('view.open')}</span>
      </PopoverTrigger>
      <PopoverContent
        aria-label={t('view.open')}
        align="end"
        className="max-h-[80dvh] w-80 gap-4 overflow-y-auto p-4"
      >
        <section aria-label={t('view.staves')} className="flex flex-col">
          <h2 className="text-sm font-semibold text-muted-foreground">{t('view.staves')}</h2>
          <SwitchRow
            icon={<Music />}
            label={t('view.melody')}
            detail={t('view.melodyDetail')}
            checked={view.melodyStaff}
            onCheckedChange={(on) => setScoreView(store, { melodyStaff: on })}
          />
          <SwitchRow
            icon={<Hand className="-scale-x-100" />}
            label={t('view.rh')}
            checked={shown('treble')}
            onCheckedChange={(on) => setStaffShown(store, 'treble', on)}
          />
          <SwitchRow
            icon={<Hand />}
            label={t('view.lh')}
            checked={shown('bass')}
            onCheckedChange={(on) => setStaffShown(store, 'bass', on)}
            className="border-b-0"
          />
        </section>
        <section aria-label={t('view.show')} className="flex flex-col">
          <h2 className="text-sm font-semibold text-muted-foreground">{t('view.show')}</h2>
          <SwitchRow
            icon={<span className="font-music text-2xl leading-none">𝄞</span>}
            label={t('view.notation')}
            checked={view.notation}
            onCheckedChange={(on) => setScoreView(store, { notation: on })}
          />
          <SwitchRow
            icon={<span className="font-display text-base font-semibold">C⁷</span>}
            label={t('view.chordNames')}
            checked={view.chordNames}
            onCheckedChange={(on) => setScoreView(store, { chordNames: on })}
          />
          <SwitchRow
            icon={<Hash />}
            label={t('toggles.fingerNumbers')}
            checked={practice.fingerNumbers}
            onCheckedChange={(on) => setPracticeToggle(store, 'fingerNumbers', on)}
          />
          <SwitchRow
            icon={<Type />}
            label={t('toggles.namedNotes')}
            checked={practice.namedNotes}
            onCheckedChange={(on) => setPracticeToggle(store, 'namedNotes', on)}
          />
          <SwitchRow
            icon={<Piano />}
            label={t('view.keys')}
            checked={view.keys}
            onCheckedChange={(on) => setScoreView(store, { keys: on })}
            className="border-b-0"
          />
        </section>
        <Labelled label={t('view.layout')}>
          <Segmented
            label={t('view.layout')}
            value={view.layout}
            options={LAYOUTS.map((each) => ({
              value: each,
              label: t(`view.layouts.${each}`),
              icon: <SheetViewIcon view={each} />,
            }))}
            onChange={(layout) => setScoreView(store, { layout })}
          />
        </Labelled>
      </PopoverContent>
    </Popover>
  )
}
