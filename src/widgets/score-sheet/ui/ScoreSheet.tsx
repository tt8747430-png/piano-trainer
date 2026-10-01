import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { barAt, type BarRange, type Draft, type Layer } from '@/features/score-editor'
import type { Tick } from '@/shared/lib/music'
import { createLineScores } from '../model/line-scores'
import { lineMusic, linesOf, timeBeforeLine } from '../model/line-music'
import { SheetLine } from './SheetLine'

/**
 * The editor's sheet (spec §6.1): the piece by section, each heading the page's, and each chart line a
 * line of grand staff with its bars numbered and its chord symbols, the caret on its layer's staff.
 */
export function ScoreSheet({
  draft,
  caret,
  layer,
  caretTicks,
  selection,
  onPlace,
  heading,
}: {
  draft: Draft
  caret: Tick
  layer: Layer
  /** How long the next note is: the caret's width. */
  caretTicks: Tick
  selection: BarRange | null
  onPlace: (tick: Tick, layer: Layer, extend: boolean) => void
  /** A section's heading. */
  heading: (section: number) => ReactNode
}) {
  const { t } = useTranslation('editor')
  const [scoreOf] = useState(createLineScores)
  const lines = linesOf(draft)
  const caretBar = barAt(draft, caret).index
  return (
    <section aria-label={t('sheet.label')} className="flex flex-col gap-8">
      {draft.sections.map((_, section) => (
        <section key={section} className="flex flex-col gap-2">
          {heading(section)}
          {lines
            .filter((line) => line.section === section)
            .map((line) => {
              const music = lineMusic(draft, line)
              const holds = line.bars.some((placed) => placed.index === caretBar)
              return (
                <SheetLine
                  key={line.line}
                  draft={draft}
                  line={line}
                  music={music}
                  score={scoreOf(music)}
                  timeBefore={timeBeforeLine(draft, line)}
                  layer={layer}
                  caret={holds ? caret - line.start : null}
                  caretTicks={caretTicks}
                  selection={selection}
                  onPlace={onPlace}
                />
              )
            })}
        </section>
      ))}
    </section>
  )
}
