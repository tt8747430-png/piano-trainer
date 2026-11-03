import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { selectScoreView, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setScoreView } from '@/features/set-preference'
import { SheetLayoutField } from '@/shared/ui'
import { SHEET_PARTS, type SheetPart } from '../model/score-parts'
import { PartChips } from './PartChip'
import { ViewChip } from './ViewChip'

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
 * The sheet music's own part of the View (ADR 0096, 0108, 0115): its layout first, three tiles with
 * their miniatures; then what it shows as chips (`parts`: the Player's every one, the editor's what a
 * score prints), and after them a screen's own (`children`: the editor's Keys). Which staves play
 * and show is the Player's Setup's (A35).
 */
export function SheetViewFields({
  parts = SHEET_PARTS,
  children,
}: {
  parts?: readonly SheetPart[]
  children?: ReactNode
}) {
  const { t } = useTranslation('music')
  const store = useSettingsStoreApi()
  const layout = useSettings((state) => selectScoreView(state).layout)
  const listed = SHEET_PARTS.filter((part) => parts.includes(part))
  return (
    <>
      <SheetLayoutField
        value={layout}
        onChange={(chosen) => setScoreView(store, { layout: chosen })}
      />
      <PartChips label={t('view.show')} info={<PartsAbout parts={listed} />}>
        {listed.map((part) => (
          <ViewChip key={part} part={part} />
        ))}
        {children}
      </PartChips>
    </>
  )
}
