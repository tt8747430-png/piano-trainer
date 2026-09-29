import type { LessonBlock as Block } from '@/entities/lesson'
import { IntervalCard, NotesExample, ScaleExample, type ShownKeys } from '@/features/play-example'
import { localText, useLocale } from '@/shared/i18n'
import { keyParam, note, noteParam } from '@/shared/lib/music'
import { gridSymbols } from '../model/chord-grid'
import { ChordExamples } from './ChordExamples'
import { LessonLinkRow } from './LessonLinkRow'

const C_MAJOR = { tonic: note('C'), minor: false }

/**
 * One block of a lesson: prose with its bold lead, numbered steps, a note on sand, an example that
 * plays on the lesson's keys, or a link into a reference. A quiz is the view's, which keeps its state.
 */
export function LessonBlock({
  block,
  onShow,
}: {
  block: Exclude<Block, { kind: 'quiz' }>
  onShow: (shown: ShownKeys) => void
}) {
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
    case 'grid':
      return <ChordExamples symbols={gridSymbols(block.quality)} onShow={onShow} />
    case 'scale':
      return <ScaleExample root={noteParam(block.root)} kind={block.scale} onShow={onShow} />
    case 'interval':
      return <IntervalCard root={noteParam(block.root)} name={block.interval} onShow={onShow} />
    case 'notes':
      return (
        <NotesExample
          notes={block.notes}
          clef={block.clef}
          meter={block.meter ?? '4/4'}
          keyParam={keyParam(block.key ?? C_MAJOR)}
          onShow={onShow}
        />
      )
    case 'link':
      return (
        <ul className="rounded-3xl border border-border bg-card px-2">
          <li>
            <LessonLinkRow title={block.title} target={block.target} />
          </li>
        </ul>
      )
  }
}
