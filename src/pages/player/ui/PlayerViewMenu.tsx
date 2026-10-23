import { Eye, Hand, Hash, Layers, Music, Piano, Type } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  selectPractice,
  selectScoreView,
  useSettings,
  useSettingsStoreApi,
} from '@/entities/settings'
import { setPracticeToggle, setScoreView, setStaffShown } from '@/features/set-preference'
import { MenuSection, SheetLayoutField, SwitchRow } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/primitives/popover'

/**
 * How the Player shows the score (ADR 0064, Soundslice's view settings), from its bar, remembered for
 * every piece, in the editor's View menu's order and headings (ADR 0085): the layout, across, down
 * the screen or on A4 pages; the staves (the tune's own over the piano while it plays, each hand's
 * shown or hidden); and what is shown (the notation, chord names and the chord positions written
 * under them, finger numbers, note names, the keys). How it plays is the Setup's.
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
        {/* An eye, so it never reads as the Setup's sliders beside it. */}
        <Eye aria-hidden />
        <span className="max-lg:sr-only">{t('view.open')}</span>
      </PopoverTrigger>
      <PopoverContent
        aria-label={t('view.open')}
        align="end"
        className="max-h-[80dvh] w-80 gap-4 overflow-y-auto p-4"
      >
        <SheetLayoutField
          value={view.layout}
          onChange={(layout) => setScoreView(store, { layout })}
        />
        <MenuSection title={t('view.staves')} className="gap-0">
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
        </MenuSection>
        <MenuSection title={t('view.show')} className="gap-0">
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
            icon={<Layers />}
            label={t('toggles.positions')}
            detail={t('view.positionsDetail')}
            checked={practice.positions}
            onCheckedChange={(on) => setPracticeToggle(store, 'positions', on)}
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
        </MenuSection>
      </PopoverContent>
    </Popover>
  )
}
