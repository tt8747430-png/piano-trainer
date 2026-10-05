import { useTranslation } from 'react-i18next'
import { readProgression, type LessonBlock as Block, type LessonLink } from '@/entities/lesson'
import { pieceById } from '@/entities/piece'
import {
  IntervalCard,
  NotesExample,
  ChordRow,
  progressionRow,
  RowChords,
  RowPlay,
  ScaleExample,
} from '@/features/play-example'
import { localText, useLocale } from '@/shared/i18n'
import { keyParam, note, noteParam } from '@/shared/lib/music'
import { gridSymbols } from '../model/chord-grid'
import { ChordExamples } from './ChordExamples'
import { LessonLinkRow } from './LessonLinkRow'
import { PatternExample } from './PatternExample'
import type { ShownKeys } from '@/shared/ui'

const C_MAJOR = { tonic: note('C'), minor: false }

/** One link on its card, as a lesson's rows are. */
function LinkCard({ title, target }: { title: string; target: LessonLink }) {
  return (
    <ul className="card px-2">
      <li>
        <LessonLinkRow title={title} target={target} />
      </li>
    </ul>
  )
}

/**
 * One block of a lesson: prose with its bold lead, numbered steps, a note on sand, an example that
 * plays on the lesson's keys (a pattern over its piece, a progression as the tool's row), or a link
 * into an explorer or the Player. A quiz is the view's, which keeps its state.
 */
export function LessonBlock({
  block,
  onShow,
}: {
  block: Exclude<Block, { kind: 'quiz' }>
  onShow: (shown: ShownKeys) => void
}) {
  const { t } = useTranslation('learn')
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
    case 'pattern': {
      const piece = pieceById(block.piece)
      if (!piece) throw new RangeError(`A lesson plays a pattern over "${block.piece}": no piece`)
      return <PatternExample pattern={block.pattern} piece={piece} onShow={onShow} />
    }
    case 'progression': {
      const { numerals, key, size } = readProgression(block)
      return (
        <div className="flex flex-col gap-3">
          <ChordRow chords={progressionRow(numerals, key, size)} onShow={onShow}>
            <RowChords />
            <RowPlay variant="soft" />
          </ChordRow>
          <LinkCard
            title={t('example.inProgressions')}
            target={{ place: 'progressions', numerals: block.numerals, key, size }}
          />
        </div>
      )
    }
    case 'link':
      return <LinkCard title={localText(block.title, locale)} target={block.target} />
  }
}
