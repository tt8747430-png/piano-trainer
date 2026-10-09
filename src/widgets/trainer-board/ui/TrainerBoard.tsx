import { Check, Square, Volume2, X } from 'lucide-react'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useMidiKeyDown } from '@/features/connect-midi'
import { LiveKeyboard } from '@/features/live-keyboard'
import {
  answerKeys,
  choiceAnswer,
  choosesKeys,
  isChoice,
  pressesKeys,
  roundRange,
  targetKeys,
  type Asks,
  type TrainerRun,
} from '@/features/trainer'
import { noteName } from '@/shared/lib/music'
import { RoundButton } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { AnsweredChoices } from './AnsweredChoices'
import { DegreeSlots } from './DegreeSlots'
import { RoundStaff } from './RoundStaff'
import { useRoundShortcuts } from './use-round-shortcuts'
import { useRoundWords } from './use-round-words'

/**
 * One round at a time: what it asks (its words, a staff, a sound to hear again), the keyboard, the
 * answer, and one action. A keyboard user keeps their place: an answer moves them to Next, and Next
 * to the new round's prompt; the computer's keys answer too (`useRoundShortcuts`).
 */
export function TrainerBoard({ trainer, asks }: { trainer: TrainerRun; asks: Asks }) {
  const { t } = useTranslation(['quiz', 'common'])
  const words = useRoundWords()
  const { question, selected, result } = trainer.round
  const prompt = useRef<HTMLHeadingElement>(null)

  // Building a chord or scale: keys are chosen until checked. Reading a note or a key's degrees:
  // each key pressed is answered at once.
  const choosing = choosesKeys(question) && !result
  const pressing = pressesKeys(question) && !result
  // A key played on the MIDI keyboard answers like a tap.
  useMidiKeyDown((key) => {
    if (choosing) trainer.toggleKey(key)
    else if (pressing) trainer.pressKey(key)
  })
  const choices = isChoice(question) ? words.options(question) : null
  const hears = isChoice(question) && question.mode !== 'key-signature'
  const goOn = () => {
    trainer.next()
    prompt.current?.focus()
  }
  useRoundShortcuts({
    act: result ? goOn : choosing && selected.length > 0 ? trainer.check : null,
    answers:
      choices && !result
        ? choices.map(
            ({ value }) =>
              () =>
                trainer.choose(value),
          )
        : [],
    hear: hears ? trainer.hear : null,
  })
  // On the keys, answered: a build's or a press's keys against the answer; a round heard, what played.
  const checked =
    result && (choosesKeys(question) || pressesKeys(question))
      ? answerKeys(question, selected)
      : null
  const lit =
    question.mode === 'name-chord' || (result && isChoice(question))
      ? new Set(targetKeys(question))
      : undefined
  const verdict = !result
    ? null
    : result.correct
      ? t('quiz:right')
      : result.kind === 'keys' && result.wrongBass && question.mode === 'build-chord'
        ? t('quiz:wrongBass', {
            answer: words.answer(question),
            bass: noteName(question.tones[question.inversion ?? 0]?.note ?? question.root),
          })
        : t('quiz:itWas', { answer: words.answer(question) })

  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <h2
          ref={prompt}
          tabIndex={-1}
          className="min-w-0 flex-1 text-4xl text-balance outline-none"
        >
          {words.prompt(question)}
        </h2>
        {hears ? (
          <RoundButton
            label={trainer.hearing ? t('common:stop') : t('quiz:playAgain')}
            icon={trainer.hearing ? Square : Volume2}
            onClick={trainer.hear}
          />
        ) : null}
      </div>

      {question.mode === 'read-note' ||
      (question.mode === 'key-signature' && question.ask === 'name') ? (
        <RoundStaff question={question} />
      ) : null}
      {question.mode === 'key-degrees' ? (
        <DegreeSlots question={question} played={selected} answered={result !== null} />
      ) : null}

      <LiveKeyboard
        range={roundRange(asks, question)}
        selected={
          choosing || (pressing && question.mode === 'key-degrees') ? new Set(selected) : undefined
        }
        lit={lit}
        marks={checked?.marks}
        outlined={checked?.outlined}
        wrong={checked?.wrong}
        onKeyPress={choosing ? trainer.toggleKey : pressing ? trainer.pressKey : undefined}
        // A round asks for a chord or its name: the rail does not say it.
        namesChords={false}
      />

      <p aria-live="polite" className="flex min-h-7 items-center gap-2 text-lg font-semibold">
        {result ? (
          result.correct ? (
            <Check aria-hidden className="size-5 text-learned" />
          ) : (
            <X aria-hidden className="size-5 text-destructive" />
          )
        ) : null}
        {verdict}
      </p>

      {choices && isChoice(question) ? (
        result?.kind === 'choice' ? (
          <AnsweredChoices
            choices={choices}
            answer={choiceAnswer(question)}
            chosen={result.chosen}
          />
        ) : (
          <div
            role="group"
            aria-label={t('quiz:answers')}
            className="grid grid-cols-2 gap-3 lg:grid-cols-4"
          >
            {choices.map(({ value, label }) => (
              <Button key={value} variant="outline" size="lg" onClick={() => trainer.choose(value)}>
                {label}
              </Button>
            ))}
          </div>
        )
      ) : null}

      {choosing ? (
        <div className="flex gap-3">
          {selected.length > 0 ? (
            <Button variant="soft" size="pill" onClick={trainer.clear}>
              {t('quiz:clear')}
            </Button>
          ) : null}
          <Button
            size="pill"
            className="flex-1 sm:min-w-56 sm:flex-none"
            disabled={selected.length === 0}
            onClick={trainer.check}
          >
            {t('quiz:check')}
          </Button>
        </div>
      ) : null}

      {result ? (
        // Shown in place of what was just pressed, so the answer hands it the focus.
        <Button size="pill" autoFocus className="sm:min-w-56 sm:self-start" onClick={goOn}>
          {trainer.run.over ? t('quiz:results') : t('quiz:next')}
        </Button>
      ) : null}
    </section>
  )
}
