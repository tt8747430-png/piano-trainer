import type { LessonBlock as Block } from '@/entities/lesson'
import { localText, useLocale } from '@/shared/i18n'
import { ChordExamples } from './ChordExamples'

/** One block of a lesson: prose with its bold lead, numbered steps, a note on sand, or chords that play. */
export function LessonBlock({ block, onShow }: { block: Block; onShow: (symbol: string) => void }) {
  const locale = useLocale()
  switch (block.kind) {
    case 'text':
      return (
        <p>
          {block.lead ? <strong>{localText(block.lead, locale)} </strong> : null}
          {localText(block.text, locale)}
        </p>
      )
    case 'steps':
      return (
        <ol className="flex list-decimal flex-col gap-1 pl-5">
          {block.steps.map((step) => (
            <li key={step.en}>{localText(step, locale)}</li>
          ))}
        </ol>
      )
    case 'note':
      return <p className="rounded-3xl bg-muted p-4">{localText(block.text, locale)}</p>
    case 'chords':
      return <ChordExamples symbols={block.symbols} onShow={onShow} />
  }
}
