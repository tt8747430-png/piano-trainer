import { useTranslation } from 'react-i18next'
import type { StaffName } from '@/entities/piece'
import type { MusicView } from '@/entities/settings'
import type { Clef } from '@/shared/lib/music'
import { MenuSection } from '@/shared/ui'
import { DiagramsFields } from './DiagramsFields'
import { GridFields } from './GridFields'
import { LyricsFields } from './LyricsFields'
import { SheetViewFields } from './SheetViewFields'

/**
 * The view shown's own part of the Player's View (ADR 0108), headed by its name and holding nothing
 * of another view's: the sheet music's layout, staves and what it shows (`SheetViewFields`);
 * Diagrams' mode and words (`DiagramsFields`); Chords over lyrics' diagrams pinned and text size
 * (`LyricsFields`, ADR 0108); the Grid's words (`GridFields`). The words' switches are greyed where
 * the music has none (`words`), saying why.
 */
export function ViewSection({
  view,
  staves,
  piano,
  words,
}: {
  view: MusicView
  /** The score's single staves, top down: the sheet music's switches. */
  staves: readonly { readonly name?: StaffName; readonly clef: Clef }[]
  /** Whether the score writes the piano's staves: a lead sheet does not (ADR 0114). */
  piano: boolean
  /** Whether the music has words, sung on some note. */
  words: boolean
}) {
  const { t } = useTranslation('player')
  const noWords = words ? undefined : t('views.noWords')
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
          <DiagramsFields noWords={noWords} />
        </MenuSection>
      )
    case 'lyrics':
      return (
        <MenuSection title={t('views.lyrics')}>
          <LyricsFields />
        </MenuSection>
      )
    case 'grid':
      return (
        <MenuSection title={t('views.grid')}>
          <GridFields noWords={noWords} />
        </MenuSection>
      )
  }
}
