import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useStaffNames, useStaffTitle, type StaffName } from '@/entities/piece'
import { selectScoreView, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setScoreView, setStaffShown } from '@/features/set-preference'
import { clefGlyph, type Clef } from '@/shared/lib/music'
import { singleStaff, type StaffId } from '@/shared/lib/notation'
import { SheetLayoutField, SwitchRow } from '@/shared/ui'
import { SHEET_PARTS, type SheetPart } from '../model/score-parts'
import { ViewSwitch } from './ViewSwitch'

/** A staff's clef, as the music font draws it, for its switch's picture. */
function ClefGlyph({ clef }: { clef: Clef }) {
  return <span className="font-music text-2xl leading-none">{clefGlyph(clef)}</span>
}

/**
 * Switches under their name, one under the other, the last with no line under it: a group named for
 * a screen reader by the name it prints.
 */
function SwitchGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div
      role="group"
      aria-label={label}
      className="flex flex-col [&>[data-slot=switch-row]:last-child]:border-b-0"
    >
      <span aria-hidden className="text-sm text-muted-foreground">
        {label}
      </span>
      {children}
    </div>
  )
}

/**
 * The sheet music's own part of the View (ADR 0064, 0097, 0102): its layout first; its staves, each
 * switched by its name (a single staff's own, else its place's, then the piano's upper and lower), the
 * last in sight kept; then what it shows (`parts`: the Player's every one, the editor's what a score
 * prints), and after them a screen's own (`children`: the editor's Keys).
 */
export function SheetViewFields({
  staves,
  piano,
  parts = SHEET_PARTS,
  children,
}: {
  /** The score's single staves, top down: each its own switch. */
  staves: readonly { readonly name?: StaffName; readonly clef: Clef }[]
  /** Whether the score writes the piano's staves: a lead sheet does not (ADR 0083). */
  piano: boolean
  parts?: readonly SheetPart[]
  children?: ReactNode
}) {
  const { t } = useTranslation('music')
  const store = useSettingsStoreApi()
  const layout = useSettings((state) => selectScoreView(state).layout)
  const hidden = useSettings((state) => selectScoreView(state).hidden)
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
  const shown = (staff: StaffId) => !hidden.includes(staff)
  // The score is never left with no staff in sight.
  const inSight = switches.filter(({ staff }) => shown(staff)).length
  return (
    <>
      <SheetLayoutField
        value={layout}
        onChange={(chosen) => setScoreView(store, { layout: chosen })}
      />
      <SwitchGroup label={t('view.staves')}>
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
      </SwitchGroup>
      <SwitchGroup label={t('view.show')}>
        {SHEET_PARTS.filter((part) => parts.includes(part)).map((part) => (
          <ViewSwitch key={part} part={part} />
        ))}
        {children}
      </SwitchGroup>
    </>
  )
}
