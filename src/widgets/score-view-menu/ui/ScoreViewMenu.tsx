import { Eye, Hash, Music, Piano, WholeWord } from 'lucide-react'
import type { ReactNode } from 'react'
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

/** A group's switches, one under the other, the last with no line under it. */
const SWITCHES = 'gap-0 [&>[data-slot=switch-row]:last-child]:border-b-0'

/** A staff's clef, as the music font draws it, for its switch's picture. */
function Clef({ glyph }: { glyph: string }) {
  return <span className="font-music text-2xl leading-none">{glyph}</span>
}

/**
 * How a score is shown (ADR 0064, 0094, Soundslice's view settings): one menu, the Player's and the
 * score editor's, behind the eye in each bar, remembered for every piece. The layout (across, down
 * the screen or on A4 pages); the staves (the tune's own over the piano, the upper and the lower);
 * then what is shown: the chord symbols, the words under the tune (ADR 0093), the notes' fingers (the
 * editor's fingering field types them where they print, ADR 0096) and the keys (`keys`, each
 * screen's own), then a screen's own switches (`children`: the Player's, what only practice
 * has). What the score holds is edited on it, and how it plays is the Setup's: nothing is here twice.
 */
export function ScoreViewMenu({
  keys,
  disabled = false,
  children,
}: {
  /** The keys under the score: whether they are out, and putting them away or back. */
  keys: { readonly shown: boolean; readonly show: (shown: boolean) => void }
  /** Waiting on something else first: the editor's while a take records. */
  disabled?: boolean
  /** A screen's own switches, after the keys. */
  children?: ReactNode
}) {
  const { t } = useTranslation('music')
  const store = useSettingsStoreApi()
  const view = useSettings(selectScoreView)
  const fingers = useSettings((state) => selectPractice(state).fingerNumbers)
  const shown = (staff: 'treble' | 'bass') => !view.hidden.includes(staff)
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="surface"
            size="icon"
            aria-label={t('view.label')}
            title={t('view.label')}
            disabled={disabled}
          />
        }
      >
        {/* An eye, so it never reads as the Setup's sliders beside it. */}
        <Eye aria-hidden />
      </PopoverTrigger>
      <PopoverContent
        aria-label={t('view.label')}
        align="end"
        className="max-h-[80dvh] w-80 max-w-[calc(100vw-2rem)] gap-4 overflow-y-auto p-4"
      >
        <SheetLayoutField
          value={view.layout}
          onChange={(layout) => setScoreView(store, { layout })}
        />
        <MenuSection title={t('view.staves')} className={SWITCHES}>
          <SwitchRow
            icon={<Music />}
            label={t('view.melody')}
            checked={view.melodyStaff}
            onCheckedChange={(on) => setScoreView(store, { melodyStaff: on })}
          />
          <SwitchRow
            icon={<Clef glyph={'\u{1D11E}'} />}
            label={t('view.upper')}
            checked={shown('treble')}
            onCheckedChange={(on) => setStaffShown(store, 'treble', on)}
          />
          <SwitchRow
            icon={<Clef glyph={'\u{1D122}'} />}
            label={t('view.lower')}
            checked={shown('bass')}
            onCheckedChange={(on) => setStaffShown(store, 'bass', on)}
          />
        </MenuSection>
        <MenuSection title={t('view.show')} className={SWITCHES}>
          <SwitchRow
            icon={<span className="font-display text-base font-semibold">C⁷</span>}
            label={t('sheet.chordNames')}
            checked={view.chordNames}
            onCheckedChange={(on) => setScoreView(store, { chordNames: on })}
          />
          <SwitchRow
            icon={<WholeWord />}
            label={t('view.lyrics')}
            checked={view.lyrics}
            onCheckedChange={(on) => setScoreView(store, { lyrics: on })}
          />
          <SwitchRow
            icon={<Hash />}
            label={t('view.fingers')}
            checked={fingers}
            onCheckedChange={(on) => setPracticeToggle(store, 'fingerNumbers', on)}
          />
          <SwitchRow
            icon={<Piano />}
            label={t('view.keys')}
            checked={keys.shown}
            onCheckedChange={keys.show}
          />
          {children}
        </MenuSection>
      </PopoverContent>
    </Popover>
  )
}
