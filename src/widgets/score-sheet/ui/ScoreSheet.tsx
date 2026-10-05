import { useMemo, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { barAt, type BarRange, type Draft, type Layer } from '@/features/score-editor'
import type { Tick } from '@/shared/lib/music'
import { createLineSheets } from '../model/line-sheets'
import { SheetLine } from './SheetLine'

/**
 * The editor's sheet (spec §6.1): the piece by section, each heading the page's, and each chart line a
 * line of grand staff with its bars numbered and its chord symbols, the caret on its layer's staff. A
 * line drawn again only when what it shows changes.
 */
export function ScoreSheet({
  draft,
  caret,
  layer,
  caretTicks,
  selection,
  onPlace,
  placesOf,
  heading,
  chordNames,
  onSignature,
}: {
  draft: Draft
  caret: Tick
  layer: Layer
  /** How long the next note is: the caret's width. */
  caretTicks: Tick
  selection: BarRange | null
  onPlace: (tick: Tick, layer: Layer, extend: boolean) => void
  /** Where the caret may stand in a layer, asked when a bar is clicked. */
  placesOf: (layer: Layer) => readonly Tick[]
  /** A section's heading. */
  heading: (section: number) => ReactNode
  /** Chord names over the staff, written in their row; without them a click there writes the tune. */
  chordNames: boolean
  /** The clef, key and time signature clicked: what changes them. */
  onSignature: () => void
}) {
  const { t } = useTranslation('editor')
  const [sheetsOf] = useState(createLineSheets)
  const sheets = useMemo(() => sheetsOf(draft), [sheetsOf, draft])
  const caretBar = barAt(draft, caret).index
  return (
    <section aria-label={t('sheet.label')} className="flex flex-col gap-8">
      {draft.sections.map((_, section) => (
        <section key={section} className="flex flex-col gap-2">
          {heading(section)}
          {sheets
            .filter((sheet) => sheet.line.section === section)
            .map((sheet) => (
              <SheetLine
                key={sheet.line.line}
                sheet={sheet}
                layer={layer}
                caret={
                  sheet.line.bars.some((placed) => placed.index === caretBar)
                    ? caret - sheet.line.start
                    : null
                }
                caretTicks={caretTicks}
                selection={selection}
                onPlace={onPlace}
                placesOf={placesOf}
                chordNames={chordNames}
                onSignature={onSignature}
              />
            ))}
        </section>
      ))}
    </section>
  )
}
