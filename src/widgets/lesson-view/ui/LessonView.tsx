import { useMemo, useReducer, useState } from 'react'
import type { Lesson } from '@/entities/lesson'
import { useMidiKeyDown } from '@/features/connect-midi'
import { ExplorerKeyboard } from '@/features/live-keyboard'
import { localText, useLocale } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import { usePlay } from '@/shared/lib/services'
import {
  answerSounds,
  isRight,
  quizAnswers,
  quizKeys,
  quizReducer,
  type QuizKeys,
} from '../model/lesson-quiz'
import { LessonBlock } from './LessonBlock'
import { QuizBlock } from './QuizBlock'
import { NO_KEYS, type ShownKeys } from '@/shared/ui'

/**
 * A lesson read top to bottom under a pinned keyboard: it shows the example played last, or the open
 * quiz, whose answer the learner chooses on it.
 */
export function LessonView({ lesson }: { lesson: Lesson }) {
  const locale = useLocale()
  const play = usePlay()
  const [shown, setShown] = useState<ShownKeys>(NO_KEYS)
  const [quiz, dispatch] = useReducer(quizReducer, null)
  const answers = useMemo(() => quizAnswers(lesson), [lesson])
  const answer = quiz ? answers.get(quiz.id) : undefined
  const keys: QuizKeys = quiz && answer ? quizKeys(quiz, answer) : shown
  const choosing = quiz !== null && quiz.stage !== 'answer'
  // The open quiz is answered on the MIDI keyboard as on the screen's keys.
  useMidiKeyDown((key) => {
    if (choosing) dispatch({ type: 'toggle', key })
  })
  // An example played closes the open quiz: the keys show the example.
  const show = (next: ShownKeys) => {
    dispatch({ type: 'close' })
    setShown(next)
  }
  return (
    <div className="flex flex-col gap-10">
      <ExplorerKeyboard
        shown={keys}
        selected={keys.selected}
        wrong={keys.wrong}
        outlined={keys.outlined}
        onKeyPress={choosing ? (key) => dispatch({ type: 'toggle', key }) : undefined}
      />
      {lesson.sections.map((section, s) => (
        <section
          key={section.heading.en}
          // Sections apart by a line and room; a section's text and its examples close together.
          className={cn(
            'flex max-w-prose flex-col gap-4 text-lg leading-relaxed',
            s > 0 && 'border-t border-border pt-8',
          )}
        >
          <h2 className="text-2xl text-balance">{localText(section.heading, locale)}</h2>
          {section.blocks.map((block, b) => {
            const id = `${s}.${b}`
            if (block.kind !== 'quiz') return <LessonBlock key={id} block={block} onShow={show} />
            const open = quiz?.id === id ? quiz : null
            const answerKeys = answers.get(id) ?? { ...NO_KEYS, rising: false }
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
                  if (open && right) play(answerSounds(block.answer, open.chosen))
                }}
                onReveal={() => {
                  dispatch({ type: 'reveal' })
                  play(answerSounds(block.answer, answerKeys.keys))
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
