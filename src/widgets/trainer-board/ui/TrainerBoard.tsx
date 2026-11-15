import { Check, Eye, ListChecks, SkipForward, Square, Volume2, X } from 'lucide-react'
import { useId, useLayoutEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMidiKeyDown } from '@/features/connect-midi'
import { LiveKeyboard } from '@/features/live-keyboard'
import {
  answerKeys,
  answerMarks,
  choiceAnswer,
  choosesKeys,
  isCard,
  isChoice,
  pressesKeys,
  roundRange,
  targetKeys,
  type Asks,
  type Question,
  type TrainerRun,
} from '@/features/trainer'
import { cn, useWakeLock } from '@/shared/lib'
import { type Midi, printedNote, type Tone } from '@/shared/lib/music'
import { RoundButton, type KeyMark } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { AnsweredChoices } from './AnsweredChoices'
import { DegreeSlots } from './DegreeSlots'
import { RoundStaff } from './RoundStaff'
import { showsStaff } from './staff-question'
import { useRoundShortcuts } from './use-round-shortcuts'
import { useRoundWords } from './use-round-words'

/** A pill of the round's foot, as the Check board's: 50 tall, sharing the row, 15 bold. */
const FOOT =
  'h-12.5 min-w-0 flex-1 rounded-full px-2 text-[0.9375rem] leading-tight font-bold text-balance whitespace-normal'
/** The foot's quiet pills, on the sand. */
const QUIET = 'bg-muted text-foreground hover:bg-foreground/10'

/** Whether a round asked by ear, or a card, hides this side until it is answered or turned over. */
function hides(question: Question, side: 'name' | 'keys' | 'staff'): boolean {
  if (isCard(question)) return question.show !== side
  if (
    question.mode === 'name-chord' ||
    question.mode === 'name-interval' ||
    question.mode === 'name-cadence'
  )
    return question.heard && side !== 'name'
  return false
}

/**
 * A chord to build's Hint (A41): its notes as chips, kept out of sight until asked, a round at a time.
 */
function ChordHint({ tones }: { tones: readonly Tone[] }) {
  const { t } = useTranslation('quiz')
  const [shown, setShown] = useState(false)
  return shown ? (
    <ul aria-label={t('hintNotes')} className="flex flex-wrap gap-2">
      {tones.map((tone) => (
        <li
          key={tone.degree}
          className="rounded-pill bg-muted px-3 py-1 font-display text-lg font-semibold"
        >
          {printedNote(tone.note)}
        </li>
      ))}
    </ul>
  ) : (
    <Button variant="link" className="self-center px-2" onClick={() => setShown(true)}>
      {t('hint')}
    </Button>
  )
}

/**
 * One round at a time, in one screen: what it asks (its words, a staff, a sound to hear again), the
 * keyboard, the answer, and its one primary action floating in the capsule: Reveal on a card, Check
 * on a build, and Next, waiting for the answer, once answered or turned over (Results after the
 * last). Once answered it says Right or Not quite, lights the answer and says why (`whyAnswer`). A
 * round played on the keys hides their names, which would be its answer. A keyboard user keeps their
 * place: an answer moves them to the button, and Next to the new round's prompt; the computer's keys
 * answer too (`useRoundShortcuts`).
 */
export function TrainerBoard({ trainer, asks }: { trainer: TrainerRun; asks: Asks }) {
  // The screen stays on while a round is on the screen: a phone on the stand does not lock mid-song.
  useWakeLock()
  const { t } = useTranslation(['quiz', 'common', 'music'])
  const words = useRoundWords()
  const { question, selected, result } = trainer.round
  const prompt = useRef<HTMLHeadingElement>(null)
  const primary = useRef<HTMLButtonElement>(null)
  const checkHint = useId()
  const card = isCard(question)

  // Building a chord or scale: keys are chosen until checked. Reading a note, an interval's upper
  // note or a key's degrees: each key pressed is answered at once.
  const choosing = choosesKeys(question) && !result
  const pressing = pressesKeys(question) && !result
  // A key played on the MIDI keyboard answers like a tap.
  useMidiKeyDown((key) => {
    if (choosing) trainer.toggleKey(key)
    else if (pressing) trainer.pressKey(key)
  })
  const choices = isChoice(question) ? words.options(question) : null
  const heard =
    (question.mode === 'name-chord' ||
      question.mode === 'name-interval' ||
      question.mode === 'name-cadence') &&
    question.heard
  // Play again: a round asked by sound; a chord or interval read or turned over, once answered.
  const seenFirst =
    card ||
    question.mode === 'name-chord' ||
    question.mode === 'name-interval' ||
    question.mode === 'name-cadence' ||
    (question.mode === 'build-chord' && question.cadence !== undefined)
  const hears =
    heard ||
    (seenFirst && result !== null) ||
    (isChoice(question) && !seenFirst && question.mode !== 'key-signature')
  // A new round, by Next or by auto-next: a keyboard user's focus, on the board or lost with the
  // button that held it, moves to its prompt; an answer, to the one button.
  const board = useRef<HTMLElement>(null)
  const shown = useRef(question)
  const answered = useRef(result)
  useLayoutEffect(() => {
    const focused = document.activeElement
    // The board's own, or its primary floating in the capsule.
    const ours =
      focused === null ||
      focused === document.body ||
      focused === primary.current ||
      board.current?.contains(focused)
    if (shown.current !== question) {
      shown.current = question
      answered.current = result
      if (ours) prompt.current?.focus()
      return
    }
    if (answered.current === null && result !== null && ours) primary.current?.focus()
    answered.current = result
  }, [question, result])
  const goOn = trainer.next
  const act = result
    ? goOn
    : card
      ? trainer.reveal
      : choosing && selected.length > 0
        ? trainer.check
        : null
  useRoundShortcuts({
    act,
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
  // On the keys: a build's or a press's keys against the answer once answered; the answer itself,
  // each key named, once shown or turned over; the round's keys while they are what it shows.
  const revealed = result?.kind === 'revealed' || result?.kind === 'shown'
  const checked =
    result && !revealed && (choosesKeys(question) || pressesKeys(question))
      ? answerKeys(question, selected)
      : null
  const marks: ReadonlyMap<Midi, KeyMark> | undefined = revealed
    ? answerMarks(question)
    : question.mode === 'build-interval'
      ? new Map([[question.low, { tone: 'tonic', label: printedNote(question.lowNote) }]])
      : checked?.marks
  const lit =
    !revealed &&
    (result ? isChoice(question) : !hides(question, 'keys') && (card || isChoice(question)))
      ? new Set(targetKeys(question))
      : undefined
  const verdict = !result
    ? null
    : result.kind === 'revealed'
      ? null
      : result.correct
        ? t('quiz:right')
        : result.kind === 'shown'
          ? t('quiz:itIs', { answer: words.answer(question) })
          : result.kind === 'keys' && result.wrongBass && question.mode === 'build-chord'
            ? t('quiz:wrongBass', {
                answer: words.answer(question),
                bass: printedNote(question.tones[question.inversion ?? 0]?.note ?? question.root),
              })
            : t('quiz:itWas', { answer: words.answer(question) })
  // A card's name, once turned over, is its prompt.
  const heading = card && result ? words.answer(question) : words.prompt(question)
  // A chord to build is named large, its full name under it, its notes a Hint away.
  const building = question.mode === 'build-chord' && !question.cadence ? question : null
  const primaryLabel = result
    ? trainer.run.over
      ? t('quiz:results')
      : t('quiz:next')
    : card
      ? t('quiz:reveal')
      : choosesKeys(question)
        ? t('quiz:check')
        : t('quiz:next')
  const PrimaryIcon = result
    ? trainer.run.over
      ? ListChecks
      : SkipForward
    : card
      ? Eye
      : choosesKeys(question)
        ? Check
        : SkipForward

  return (
    <section ref={board} className="flex min-h-0 flex-1 flex-col gap-3 landscape-phone:gap-2">
      <div className="flex items-start gap-3">
        <div className="flex min-w-0 flex-1 flex-col items-center gap-1 text-center">
          <h2
            ref={prompt}
            tabIndex={-1}
            className={cn(
              'text-balance hyphens-auto wrap-break-word outline-none',
              building
                ? 'text-[2.5rem] leading-tight landscape-phone:text-3xl'
                : 'text-3xl sm:text-4xl landscape-phone:text-2xl',
            )}
          >
            {heading}
          </h2>
          {building ? (
            <p className="text-lg text-muted-foreground">
              {t(`music:quality.${building.quality}`)}
            </p>
          ) : null}
        </div>
        {hears ? (
          <RoundButton
            label={trainer.hearing ? t('common:stop') : t('quiz:playAgain')}
            icon={trainer.hearing ? Square : Volume2}
            onClick={trainer.hear}
          />
        ) : null}
      </div>

      {building && !result ? <ChordHint key={trainer.number} tones={building.tones} /> : null}

      {showsStaff(question) ? (
        <RoundStaff question={question} hidden={!result && hides(question, 'staff')} />
      ) : null}
      {question.mode === 'key-degrees' ? (
        <DegreeSlots question={question} played={selected} answered={result !== null} />
      ) : null}

      {/* Right or Not quite, in words and colour, then why. */}
      <div aria-live="polite" className="flex min-h-7 flex-col gap-1">
        {verdict ? (
          <p
            className={cn(
              'flex items-center gap-2 text-lg font-semibold',
              result?.correct ? 'text-learned' : 'text-destructive',
            )}
          >
            {result?.correct ? (
              <Check aria-hidden className="size-5" />
            ) : (
              <X aria-hidden className="size-5" />
            )}
            {verdict}
          </p>
        ) : null}
        {result ? <p className="text-muted-foreground">{words.why(question)}</p> : null}
      </div>

      {choices && isChoice(question) ? (
        result?.kind === 'choice' || result?.kind === 'shown' ? (
          <AnsweredChoices
            choices={choices}
            answer={choiceAnswer(question)}
            chosen={result.kind === 'choice' ? result.chosen : null}
          />
        ) : (
          <div
            role="group"
            aria-label={t('quiz:answers')}
            className="grid grid-cols-2 gap-3 lg:grid-cols-4"
          >
            {choices.map(({ value, label }) => (
              <Button
                key={value}
                variant="outline"
                size="lg"
                // A long answer (Imperfect authentic) wraps rather than run past the button.
                className="h-auto min-h-12 py-2 text-balance whitespace-normal"
                onClick={() => trainer.choose(value)}
              >
                {label}
              </Button>
            ))}
          </div>
        )
      ) : null}

      {choosing && selected.length === 0 ? (
        <span id={checkHint} className="sr-only">
          {t('quiz:checkHint')}
        </span>
      ) : null}

      {/* At the foot, as the Check board: the keys, then the round's acts in one row of pills,
          Show answer, Clear and the one primary (Check, Reveal, Next), each a word; a round
          answered by its buttons has no primary until it is answered, its buttons being its act. */}
      <div className="mt-auto flex flex-col gap-3 pt-2">
        <LiveKeyboard
          range={roundRange(asks, question)}
          selected={
            choosing || (pressing && question.mode === 'key-degrees')
              ? new Set(selected)
              : undefined
          }
          lit={lit}
          marks={marks}
          outlined={checked?.outlined}
          wrong={checked?.wrong}
          onKeyPress={choosing ? trainer.toggleKey : pressing ? trainer.pressKey : undefined}
          // A round asks for a chord or its name: the keys do not go down while a round asked by ear
          // sounds, and a round played on the keys hides their names.
          namesKeys={!choosesKeys(question) && !pressesKeys(question)}
          showsSound={!heard || result !== null}
        />
        <div className="mx-auto flex w-full max-w-xl gap-2">
          {!result && !card && !isChoice(question) ? (
            <Button variant="ghost" className={cn(FOOT, QUIET)} onClick={trainer.reveal}>
              {t('quiz:showAnswer')}
            </Button>
          ) : null}
          {choosing ? (
            <Button
              variant="ghost"
              className={cn(FOOT, QUIET)}
              disabled={selected.length === 0}
              onClick={trainer.clear}
            >
              {t('quiz:clear')}
            </Button>
          ) : null}
          {act === null && isChoice(question) ? null : (
            <Button
              ref={primary}
              className={FOOT}
              disabled={act === null}
              aria-describedby={choosing && selected.length === 0 ? checkHint : undefined}
              onClick={act ?? undefined}
            >
              <PrimaryIcon aria-hidden />
              {primaryLabel}
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}
