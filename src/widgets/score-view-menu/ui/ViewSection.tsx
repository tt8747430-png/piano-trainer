import { useTranslation } from 'react-i18next'
import type { StaffName } from '@/entities/piece'
import type { MusicView } from '@/entities/settings'
import type { Clef } from '@/shared/lib/music'
import { MenuSection } from '@/shared/ui'
import { DiagramsFields } from './DiagramsFields'
import { SheetViewFields } from './SheetViewFields'

/**
 * The view shown's own part of the Player's View (ADR 0102), headed by its name and holding nothing
 * of another view's: the sheet music's layout, staves and what it shows (`SheetViewFields`);
 * Diagrams' mode and words (`DiagramsFields`). Chords over lyrics and the Grid have nothing of their
 * own yet, so no part.
 */
export function ViewSection({
  view,
  staves,
  piano,
}: {
  view: MusicView
  /** The score's single staves, top down: the sheet music's switches. */
  staves: readonly { readonly name?: StaffName; readonly clef: Clef }[]
  /** Whether the score writes the piano's staves: a lead sheet does not (ADR 0083). */
  piano: boolean
}) {
  const { t } = useTranslation('player')
  switch (view) {
    case 'sheet':
      return (
        <MenuSection title={t('views.sheet')} className="gap-4">
          <SheetViewFields staves={staves} piano={piano} />
        </MenuSection>
      )
    case 'diagrams':
      return (
        <MenuSection title={t('views.diagrams')} className="gap-4">
          <DiagramsFields />
        </MenuSection>
      )
    case 'lyrics':
    case 'grid':
      return null
  }
}
