import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useStaffNames, useStaffTitle, type StaffName } from '@/entities/piece'
import { selectScoreView, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setScoreView, setStaffShown } from '@/features/set-preference'
import { clefGlyph, type Clef } from '@/shared/lib/music'
import { singleStaff, type StaffId } from '@/shared/lib/notation'
import { SheetLayoutField } from '@/shared/ui'
import { SHEET_PARTS, type SheetPart } from '../model/score-parts'
import { PartChip, PartChips } from './PartChip'
import { ViewChip } from './ViewChip'

/** A staff's clef, as the music font draws it, for its chip's picture. */
function ClefGlyph({ clef }: { clef: Clef }) {
  return <span className="font-music text-xl leading-none">{clefGlyph(clef)}</span>
}

/** What each part shows, a line each, the ⓘ beside Show. */
function PartsAbout({ parts }: { parts: readonly SheetPart[] }) {
  const { t } = useTranslation('music')
  return (
    <ul className="flex flex-col gap-1.5">
      {parts.map((part) => (
        <li key={part}>
          <span className="font-semibold">{t(`view.parts.${part}`)}</span>:{' '}
          {t(`view.partsAbout.${part}`)}
        </li>
      ))}
    </ul>
  )
}

/**
 * The sheet music's own part of the View (ADR 0064, 0097, 0102, 0115): its layout first, three
 * tiles with their miniatures; its staves as chips, each by its name (a single staff's own, else its
 * place's, then the piano's upper and lower), the last in sight kept; then what it shows as chips
 * (`parts`: the Player's every one, the editor's what a score prints), and after them a screen's own
 * (`children`: the editor's Keys).
 */
export function SheetViewFields({
  staves,
  piano,
  parts = SHEET_PARTS,
  children,
}: {
  /** The score's single staves, top down: each its own chip. */
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
  const chips: readonly { staff: StaffId; label: string; clef: Clef }[] = [
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
  const inSight = chips.filter(({ staff }) => shown(staff)).length
  const listed = SHEET_PARTS.filter((part) => parts.includes(part))
  return (
    <>
      <SheetLayoutField
        value={layout}
        onChange={(chosen) => setScoreView(store, { layout: chosen })}
      />
      <PartChips label={t('view.staves')}>
        {chips.map(({ staff, label, clef }) => (
          <PartChip
            key={staff}
            icon={<ClefGlyph clef={clef} />}
            label={label}
            pressed={shown(staff)}
            reason={shown(staff) && inSight === 1 ? t('view.lastStaff') : undefined}
            onPressedChange={(on) => setStaffShown(store, staff, on)}
          />
        ))}
      </PartChips>
      <PartChips label={t('view.show')} info={<PartsAbout parts={listed} />}>
        {listed.map((part) => (
          <ViewChip key={part} part={part} />
        ))}
        {children}
      </PartChips>
    </>
  )
}
