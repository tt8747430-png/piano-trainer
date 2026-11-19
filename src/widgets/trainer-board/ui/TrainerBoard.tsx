import { Square, Volume2 } from 'lucide-react'
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
import { cn, LAPTOP, useMediaQuery, useWakeLock } from '@/shared/lib'
import { type KeyRange, midi, type Midi, printedNote, rangeOf, type Tone } from '@/shared/lib/music'
import { RoundButton, type KeyMark } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { AnsweredChoices } from './AnsweredChoices'
import { DegreeSlots } from './DegreeSlots'
import { RoundStaff } from './RoundStaff'
import { showsStaff } from './staff-question'
import { useRoundShortcuts } from './use-round-shortcuts'
import { useRoundWords } from './use-round-words'

/** A pill of the round's foot, as the Check board's: 50 tall, sharing the row, 15 bold. */
/** The foot's pills as the Check board's BTN: 50 tall at 16 bold, 20 a side, shared from a zero basis. */
const FOOT =
  'h-12.5 min-w-0 flex-1 basis-0 rounded-full px-5 text-base leading-tight font-bold whitespace-nowrap'
/** The foot's quiet pills, on the sand. */
const QUIET = 'bg-muted text-foreground hover:bg-foreground/10'
/** Check, 1.4 of a quiet pill's share, 6 a side, on the sand with soft ink until a key is chosen. */
const WAITING =
  'flex-[1.4] px-1.5 disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100'

/**
 * The keys as the Check board draws them, widened to a round's keys: C3 to C5 on a phone (15 white keys
 * across 402, the keys' least width) and C2 to C7 at 170 on a laptop.
 */
const KEYS: Readonly<Record<'phone' | 'laptop', KeyRange>> = {
  phone: { from: midi(48), to: midi(72) },
  laptop: { from: midi(36), to: midi(96) },
}
const LAPTOP_KEYS_PX = 170

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
 * A chord to build's Hint (the Check board's): a 44-tall link under the prompt that turns into its
 * notes when tapped ("Its notes: C E G"), and back, a round at a time.
 */
function ChordHint({ tones }: { tones: readonly Tone[] }) {
  const { t } = useTranslation('quiz')
  const [shown, setShown] = useState(false)
  return (
    <Button
      variant="link"
      className="min-h-11 px-2 text-[0.9375rem] font-semibold"
      aria-expanded={shown}
      onClick={() => setShown((was) => !was)}
    >
      {shown
        ? t('hintNotes', { notes: tones.map((tone) => printedNote(tone.note)).join(' ') })
        : t('hint')}
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
  const laptop = useMediaQuery(LAPTOP)
  const { t } = useTranslation(['quiz', 'common', 'music'])
  const words = useRoundWords()
  const { question, selected, result } = trainer.round
  const round = roundRange(asks, question, laptop ? KEYS.laptop : KEYS.phone)
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
  // A build is answered on the keys, which then show it painted: its verdict names its notes, as the
  // Check board says it ("The answer: G B D"), with no line of reasons under it.
  const builds = choosesKeys(question)
  const answerSaid = builds ? words.notes(question) : words.answer(question)
  const verdict = !result
    ? null
    : result.kind === 'revealed'
      ? null
      : result.correct
        ? t('quiz:right')
        : result.kind === 'shown'
          ? t('quiz:itIs', { answer: answerSaid })
          : result.kind === 'keys' && result.wrongBass && question.mode === 'build-chord'
            ? t('quiz:wrongBass', {
                answer: answerSaid,
                bass: printedNote(question.tones[question.inversion ?? 0]?.note ?? question.root),
              })
            : t('quiz:itWas', { answer: answerSaid })
  // A card's name, once turned over, is its prompt.
  const heading = card && result ? words.answer(question) : words.prompt(question)
  // A chord to build is named large, its notes a Hint away.
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

  return (
    <section ref={board} className="flex min-h-0 flex-1 flex-col gap-3 landscape-phone:gap-2">
      {/* As the Check board: the question stands centred in the room over the keys, its Hint under
          it while it waits and its verdict there once answered, in its colour (grass right, crimson
          wrong, ink for an answer shown), so nothing at the foot moves and the keys stay put. On a
          laptop it is one 760 column, as the board's. */}
      <div className="mx-auto flex w-full max-w-190 flex-1 flex-col">
        <div className="my-auto flex flex-col gap-3 py-2 landscape-phone:py-0">
          <div className="flex items-start gap-3">
            <div className="flex min-w-0 flex-1 flex-col items-center gap-2 text-center">
              <h2
                ref={prompt}
                tabIndex={-1}
                className={cn(
                  'text-balance hyphens-auto wrap-break-word outline-none',
                  building
                    ? 'text-[2.75rem] leading-tight landscape-phone:text-3xl'
                    : 'text-3xl sm:text-4xl landscape-phone:text-2xl',
                )}
              >
                {heading}
              </h2>
              {building && !result ? (
                <ChordHint key={trainer.number} tones={building.tones} />
              ) : null}
              <div aria-live="polite" className="flex flex-col items-center gap-2">
                {verdict ? (
                  <p
                    className={cn(
                      'flex min-h-11 items-center text-lg font-bold landscape-phone:min-h-0 landscape-phone:text-base',
                      result?.correct
                        ? 'text-learned'
                        : result?.kind === 'shown'
                          ? 'text-foreground'
                          : 'text-destructive',
                    )}
                  >
                    {verdict}
                  </p>
                ) : null}
                {result && !builds ? (
                  <p className="text-balance text-muted-foreground">{words.why(question)}</p>
                ) : null}
              </div>
            </div>
            {hears ? (
              <RoundButton
                label={trainer.hearing ? t('common:stop') : t('quiz:playAgain')}
                icon={trainer.hearing ? Square : Volume2}
                onClick={trainer.hear}
              />
            ) : null}
          </div>

          {showsStaff(question) ? (
            <RoundStaff question={question} hidden={!result && hides(question, 'staff')} />
          ) : null}
          {question.mode === 'key-degrees' ? (
            <DegreeSlots question={question} played={selected} answered={result !== null} />
          ) : null}

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
        </div>
      </div>

      {choosing && selected.length === 0 ? (
        <span id={checkHint} className="sr-only">
          {t('quiz:checkHint')}
        </span>
      ) : null}

      {/* At the foot, as the Check board: on a phone the keys, then the round's acts in one row of
          50-tall pills, Show answer, Clear and the one primary (Check, Reveal, Next), each a word;
          on a laptop the acts in the 760 column over the keys. Next takes the acts' slot at their
          height, so the keys never move. A round answered by its buttons has no primary until it is
          answered, its buttons being its act. */}
      <div className="mt-auto flex flex-col gap-3 pt-2 lg:flex-col-reverse lg:gap-4">
        {/* The keys run edge to edge, across the screen's gutter. */}
        <div className="-mx-gutter">
          <LiveKeyboard
            range={round}
            // Answered, the keys turn to the answer, all of it in sight (a scale reaching F♯5 on a phone).
            inView={result ? rangeOf(targetKeys(question)) : undefined}
            height={laptop ? LAPTOP_KEYS_PX : undefined}
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
        </div>
        <div className="mx-auto flex w-full max-w-190 gap-2">
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
              // Check is the widest of the three, honey once a key is chosen and sand until then.
              className={cn(FOOT, choosing && WAITING)}
              disabled={act === null}
              aria-describedby={choosing && selected.length === 0 ? checkHint : undefined}
              onClick={act ?? undefined}
            >
              {primaryLabel}
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}
