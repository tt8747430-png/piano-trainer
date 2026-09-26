import { useEffect, useRef, useState } from 'react'
import { useProgressStoreApi } from '@/entities/progress'
import { recordAnswer } from '@/features/record-answer'
import type { Midi } from '@/shared/lib/music'
import { usePlay, usePlayback } from '@/shared/lib/services'
import { questionSounds } from './quiz-keys'
import {
  answerOf,
  createQuestion,
  INITIAL_QUIZ,
  isFinished,
  quizReducer,
  type QuizConfig,
  type QuizEvent,
  type QuizState,
} from './quiz-machine'

export interface Quiz {
  readonly state: QuizState
  readonly finished: boolean
  toggleKey(key: Midi): void
  clear(): void
  check(): void
  choose(symbol: string): void
  next(): void
  /** Name chord's "Play again": sounds the question's chord, or stops it while it sounds. */
  hear(): void
  /** Play again's sound is playing. */
  readonly hearing: boolean
}

/**
 * Drives the quiz machine: draws questions, records each answer once as evidence, sounds Name
 * chord questions as they are shown and every answer once given. A new config needs a new `key`
 * on the caller.
 */
export function useQuiz(config: QuizConfig, options: { random?: () => number } = {}): Quiz {
  const random = options.random ?? Math.random
  const store = useProgressStoreApi()
  const play = usePlay()
  const playback = usePlayback<'question'>()
  const [state, setState] = useState(() =>
    quizReducer(INITIAL_QUIZ, {
      type: 'ask',
      question: createQuestion(config, { index: 0, random }),
    }),
  )
  const machine = useRef(state)
  const { question } = state

  // Name chord is asked by ear: a question sounds when it is shown.
  useEffect(() => {
    if (question?.mode === 'name-chord') play(questionSounds(question))
  }, [question, play])

  const send = (event: QuizEvent) => {
    const before = machine.current
    const after = quizReducer(before, event)
    if (after === before) return
    machine.current = after
    setState(after)
    const answer = before.result ? null : answerOf(after)
    if (!answer || !after.question) return
    recordAnswer(store, answer, new Date())
    if (after.question.mode !== 'name-chord') play(questionSounds(after.question))
  }

  return {
    state,
    finished: isFinished(state, config.scope),
    toggleKey: (key) => send({ type: 'toggleKey', midi: key }),
    clear: () => send({ type: 'clear' }),
    check: () => send({ type: 'check' }),
    choose: (symbol) => send({ type: 'choose', symbol }),
    next() {
      const current = machine.current
      if (!current.result || isFinished(current, config.scope)) return
      send({
        type: 'ask',
        question: createQuestion(config, {
          index: current.asked,
          random,
          previous: current.question,
        }),
      })
    },
    hear() {
      const current = machine.current.question
      if (current) playback.toggle('question', questionSounds(current))
    },
    hearing: playback.playing === 'question',
  }
}
