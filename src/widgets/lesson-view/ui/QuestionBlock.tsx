import { useId, useReducer } from 'react'
import { useTranslation } from 'react-i18next'
import type { LessonAnswer } from '@/entities/lesson'
import { useMidiKeyDown } from '@/features/connect-midi'
import { ExampleKeys } from '@/features/live-keyboard'
import { localText, useLocale, type LocalText } from '@/shared/i18n'
import type { Midi } from '@/shared/lib/music'
import { usePlay } from '@/shared/lib/services'
import { Button } from '@/shared/ui/primitives/button'
import {
  answerSounds,
  chosenOf,
  FRESH_QUESTION,
  questionKeys,
  questionReducer,
  type QuestionAnswer,
} from '../model/lesson-question'

/**
 * A question on its own keys (the Lesson boards' question), open as it stands, on the paper as every
 * example: its ask 17 bold on a 44 row, "Choose on the keys" under it, the keys, then where it
 * stands ("3 of 7 notes", Correct) with Again and Show the answer. The keys tapped are judged as
 * soon as they are as many notes as the answer's; the answer heard once it is right. The section
 * being read takes the MIDI keyboard's keys (`listening`). Its verdict's region stays in the page,
 * so its words are heard when they come.
 */
export function QuestionBlock({
  ask,
  said,
  answer,
  listening,
}: {
  ask: LocalText
  /** The answer as the lesson says it. */
  said: LessonAnswer
  /** The answer on the keys. */
  answer: QuestionAnswer
  listening: boolean
}) {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const id = useId()
  const play = usePlay()
  const [state, dispatch] = useReducer(questionReducer, FRESH_QUESTION)
  const keys = questionKeys(state, answer)
  const count = chosenOf(state.chosen, answer)
  const choose = (key: Midi) => {
    if (state.stage === 'answer') return
    const event = { type: 'toggle', key, answer } as const
    const next = questionReducer(state, event)
    dispatch(event)
    if (next.stage === 'right') play(answerSounds(said, next.chosen))
  }
  useMidiKeyDown((key) => {
    if (listening) choose(key)
  })
  const line =
    state.stage === 'right'
      ? t('question.right')
      : state.stage === 'wrong'
        ? t('question.wrong')
        : state.stage === 'answer'
          ? t('question.shown')
          : t('question.chosen', count)
  return (
    <figure role="group" aria-labelledby={id} className="mt-2 flex flex-col gap-3">
      <div className="-mb-2 flex flex-col">
        <p id={id} className="flex min-h-11 items-center text-[1.0625rem] font-bold text-pretty">
          {localText(ask, locale)}
        </p>
        <p className="text-sm text-muted-foreground">{t('question.onKeys')}</p>
      </div>
      <ExampleKeys
        shown={keys}
        selected={keys.selected}
        wrong={keys.wrong}
        onKeyPress={state.stage === 'answer' ? undefined : choose}
      />
      <div className="flex items-center gap-2">
        <p
          role="status"
          data-stage={state.stage}
          className="flex-1 text-sm font-semibold text-muted-foreground data-[stage=right]:text-learned data-[stage=wrong]:text-destructive"
        >
          {line}
        </p>
        <Button
          variant="ghost"
          className="h-11 px-3 text-[0.9375rem] font-semibold text-link hover:bg-transparent"
          onClick={() => dispatch({ type: 'retry' })}
        >
          {t('question.again')}
        </Button>
        {state.stage === 'right' || state.stage === 'answer' ? null : (
          <Button
            variant="soft"
            className="h-11 rounded-pill px-4 text-[0.9375rem] font-bold"
            onClick={() => {
              dispatch({ type: 'reveal' })
              play(answerSounds(said, answer.keys))
            }}
          >
            {t('question.show')}
          </Button>
        )}
      </div>
    </figure>
  )
}
