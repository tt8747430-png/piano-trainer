import { Eye, Hash, Piano, WholeWord } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useStaffNames, useStaffTitle, type StaffName } from '@/entities/piece'
import {
  selectPractice,
  selectScoreView,
  useSettings,
  useSettingsStoreApi,
} from '@/entities/settings'
import { setPracticeToggle, setScoreView, setStaffShown } from '@/features/set-preference'
import type { Clef } from '@/shared/lib/music'
import { singleStaff, type StaffId } from '@/shared/lib/notation'
import { MenuSection, SheetLayoutField, SwitchRow } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/primitives/popover'
import { SCORE_PARTS, type ScorePart } from '../model/score-parts'

/** A group's switches, one under the other, the last with no line under it. */
const SWITCHES = 'gap-0 [&>[data-slot=switch-row]:last-child]:border-b-0'

/** Each clef as the music font draws it. */
const CLEF_GLYPH: Readonly<Record<Clef, string>> = { treble: '\u{1D11E}', bass: '\u{1D122}' }

/** A staff's clef, as the music font draws it, for its switch's picture. */
function ClefGlyph({ clef }: { clef: Clef }) {
  return <span className="font-music text-2xl leading-none">{CLEF_GLYPH[clef]}</span>
}

/**
 * How a score is shown (ADR 0064, 0094, Soundslice's view settings): one menu, the Player's and the
 * score editor's, behind the eye in each bar, remembered for every piece. A screen's own views of the
 * music first (`views`: the Player's tiles, ADR 0099); the layout (across, down the screen or on A4
 * pages); the score's staves, each switched by its name (ADR 0097: a single staff's own, else its
 * place's, then the piano's upper and lower), the last in sight kept; then what is shown: the chord
 * symbols, the words (ADR 0093), the notes' fingers (the editor's fingering field types them where
 * they print, ADR 0096) and the keys (`keys`, each screen's own), then a screen's own switches
 * (`children`: the Player's, what only practice has). Of the score's parts, those the view shown has
 * (`parts`). What the score holds is edited on it, and how it plays is the Setup's: nothing is here
 * twice.
 */
export function ScoreViewMenu({
  keys,
  staves,
  piano,
  disabled = false,
  views,
  parts = SCORE_PARTS,
  children,
}: {
  /** The keys under the score: whether they are out, and putting them away or back. */
  keys: { readonly shown: boolean; readonly show: (shown: boolean) => void }
  /** The score's single staves, top down: each its own switch. */
  staves: readonly { readonly name?: StaffName; readonly clef: Clef }[]
  /** Whether the score writes the piano's staves: a lead sheet does not (ADR 0083). */
  piano: boolean
  /** Waiting on something else first: the editor's while a take records. */
  disabled?: boolean
  /** A screen's own views of the music, at the menu's top: the Player's. */
  views?: ReactNode
  /** The score's parts the view shown has: the sheet's, every one. */
  parts?: readonly ScorePart[]
  /** A screen's own switches, after the keys. */
  children?: ReactNode
}) {
  const { t } = useTranslation('music')
  const store = useSettingsStoreApi()
  const view = useSettings(selectScoreView)
  const fingers = useSettings((state) => selectPractice(state).fingerNumbers)
  const names = useStaffNames(staves)
  const title = useStaffTitle()
  const switches: readonly { staff: StaffId; label: string; clef: Clef }[] = [
    ...staves.map(({ clef }, place) => ({
      staff: singleStaff(place),
      label: title(names[place], place),
      clef,
    })),
    ...(piano
      ? [
          { staff: 'treble' as const, label: t('view.upper'), clef: 'treble' as const },
          { staff: 'bass' as const, label: t('view.lower'), clef: 'bass' as const },
        ]
      : []),
  ]
  const shown = (staff: StaffId) => !view.hidden.includes(staff)
  // The score is never left with no staff in sight.
  const inSight = switches.filter(({ staff }) => shown(staff)).length
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
        {views}
        {parts.includes('layout') ? (
          <SheetLayoutField
            value={view.layout}
            onChange={(layout) => setScoreView(store, { layout })}
          />
        ) : null}
        {parts.includes('staves') ? (
          <MenuSection title={t('view.staves')} className={SWITCHES}>
            {switches.map(({ staff, label, clef }) => (
              <SwitchRow
                key={staff}
                icon={<ClefGlyph clef={clef} />}
                label={label}
                checked={shown(staff)}
                disabled={shown(staff) && inSight === 1}
                onCheckedChange={(on) => setStaffShown(store, staff, on)}
              />
            ))}
          </MenuSection>
        ) : null}
        <MenuSection title={t('view.show')} className={SWITCHES}>
          {parts.includes('chordNames') ? (
            <SwitchRow
              icon={<span className="font-display text-base font-semibold">C⁷</span>}
              label={t('sheet.chordNames')}
              checked={view.chordNames}
              onCheckedChange={(on) => setScoreView(store, { chordNames: on })}
            />
          ) : null}
          {parts.includes('lyrics') ? (
            <SwitchRow
              icon={<WholeWord />}
              label={t('view.lyrics')}
              checked={view.lyrics}
              onCheckedChange={(on) => setScoreView(store, { lyrics: on })}
            />
          ) : null}
          {parts.includes('fingers') ? (
            <SwitchRow
              icon={<Hash />}
              label={t('view.fingers')}
              checked={fingers}
              onCheckedChange={(on) => setPracticeToggle(store, 'fingerNumbers', on)}
            />
          ) : null}
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
