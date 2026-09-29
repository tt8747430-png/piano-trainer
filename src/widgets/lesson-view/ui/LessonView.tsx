import { useMemo, useReducer, useState } from 'react'
import type { Lesson } from '@/entities/lesson'
import { ExplorerKeyboard } from '@/features/live-keyboard'
import type { ShownKeys } from '@/features/play-example'
import { localText, useLocale } from '@/shared/i18n'
import { chordSounds } from '@/shared/lib/schedule'
import { usePlay } from '@/shared/lib/services'
import { isRight, quizAnswer, quizKeys, quizReducer, type QuizKeys } from '../model/lesson-quiz'
import { LessonBlock } from './LessonBlock'
import { QuizBlock } from './QuizBlock'

const NOTHING: ShownKeys = { keys: [], marks: new Map() }

/** Each quiz of a lesson by its place, `section.block`, with its answer on the keys. */
const answersOf = (lesson: Lesson): ReadonlyMap<string, ShownKeys> =>
  new Map(
    lesson.sections.flatMap((section, s) =>
      section.blocks.flatMap((block, b) =>
        block.kind === 'quiz' ? [[`${s}.${b}`, quizAnswer(block.answer)] as const] : [],
      ),
    ),
  )

/**
 * A lesson read top to bottom under a pinned keyboard: it shows the example played last, or the open
 * quiz, whose answer the learner chooses on it.
 */
export function LessonView({ lesson }: { lesson: Lesson }) {
  const locale = useLocale()
  const play = usePlay()
  const [shown, setShown] = useState<ShownKeys>(NOTHING)
  const [quiz, dispatch] = useReducer(quizReducer, null)
  const answers = useMemo(() => answersOf(lesson), [lesson])
  const answer = quiz ? answers.get(quiz.id) : undefined
  const keys: QuizKeys = quiz && answer ? quizKeys(quiz, answer) : shown
  const choosing = quiz !== null && quiz.stage !== 'answer'
  // An example played closes the open quiz: the keys show the example.
  const show = (next: ShownKeys) => {
    dispatch({ type: 'close' })
    setShown(next)
  }
  return (
    <div className="flex flex-col gap-8">
      <ExplorerKeyboard
        keys={keys.keys}
        marks={keys.marks}
        selected={keys.selected}
        wrong={keys.wrong}
        outlined={keys.outlined}
        onKeyPress={choosing ? (key) => dispatch({ type: 'toggle', key }) : undefined}
      />
      {lesson.sections.map((section, s) => (
        <section
          key={section.heading.en}
          className="flex max-w-prose flex-col gap-3 text-lg leading-relaxed"
        >
          <h2 className="text-2xl">{localText(section.heading, locale)}</h2>
          {section.blocks.map((block, b) => {
            const id = `${s}.${b}`
            if (block.kind !== 'quiz') return <LessonBlock key={id} block={block} onShow={show} />
            const open = quiz?.id === id ? quiz : null
            const answerKeys = answers.get(id) ?? NOTHING
            return (
              <QuizBlock
                key={id}
                ask={block.ask}
                stage={open ? open.stage : 'closed'}
                canCheck={(open?.chosen.length ?? 0) > 0}
                onOpen={() => dispatch({ type: 'open', id })}
                onCheck={() => {
                  const right = open !== null && isRight(open.chosen, answerKeys)
                  dispatch({ type: 'check', right })
                  if (open && right) play(chordSounds(open.chosen, { arpeggio: false }))
                }}
                onReveal={() => {
                  dispatch({ type: 'reveal' })
                  play(chordSounds(answerKeys.keys, { arpeggio: false }))
                }}
                onRetry={() => dispatch({ type: 'retry' })}
              />
            )
          })}
        </section>
      ))}
    </div>
  )
}
