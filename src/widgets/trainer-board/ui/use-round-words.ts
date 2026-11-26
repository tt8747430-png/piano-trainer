import { useTranslation } from 'react-i18next'
import {
  CADENCES,
  cadenceNumerals,
  signatureOption,
  whyAnswer,
  type ChoiceQuestion,
  type Question,
} from '@/features/trainer'
import { useKeyName, useScaleName } from '@/shared/i18n'
import {
  CHORD_QUALITIES,
  INTERVAL_GROUPS,
  printedNote,
  parseKey,
  printedSymbol,
  SCALE_KINDS,
  writtenName,
} from '@/shared/lib/music'
import { INVERSION_NAMES } from '@/shared/ui'

/** The steps of a scale the reasons name: a half step, a whole, a step and a half, two. */
const STEPS = ['1', '2', '3', '4'] as const
/** Where a note stands on the staff, as the reasons name it. */
const PLACES = [
  'line',
  'space',
  'under',
  'over',
  'ledgerBelow',
  'byLedgerBelow',
  'ledgerAbove',
  'byLedgerAbove',
] as const
const CLEFS = ['treble', 'bass'] as const
const SIGNS = ['sharps', 'flats'] as const
const REFERENCE_INTERVALS = [...INTERVAL_GROUPS.simple, ...INTERVAL_GROUPS.compound]

/** An id the reasons give, read as one of its list's; `none` where it is none of them. */
const idOf = <T extends string>(values: readonly T[], raw: string, none: T): T =>
  values.find((value) => value === raw) ?? none

/** A key signature's count as the options write it (`3♯`, `2♭`, `0`), read back. */
const COUNT = /^(\d)(♯|♭)$/

/** A progression's numerals as a line to read: `I–V–vi–IV`. */
const progressionLine = (line: string) => line.split(' ').join('–')

/**
 * A round's words: what it asks, how each option reads, and what its answer is called; a chord's
 * symbol printed as the sheets print it (`C♯m7`), its option's value kept as it is compared.
 */
export function useRoundWords() {
  const { t } = useTranslation(['quiz', 'music'])
  const scaleName = useScaleName()
  const keyName = useKeyName()

  const signatureCount = (option: string) => {
    const match = COUNT.exec(option)
    if (!match) return t('quiz:signature.none')
    const count = Number(match[1])
    return match[2] === '♯'
      ? t('quiz:signature.sharps', { count })
      : t('quiz:signature.flats', { count })
  }

  const prompt = (question: Question): string => {
    switch (question.mode) {
      case 'build-chord':
        if (question.cadence) {
          const { cadence, key, at } = question.cadence
          const words = {
            cadence: t(`quiz:cadence.${cadence}`),
            key: keyName(key),
          }
          const chord =
            at === 0
              ? t('quiz:prompt.playCadenceBefore', words)
              : t('quiz:prompt.playCadenceLast', words)
          return question.inversion === null
            ? chord
            : `${chord}, ${t(`music:inversionName.${INVERSION_NAMES[question.inversion] ?? 'root'}`).toLowerCase()}`
        }
        return question.inversion === null
          ? t('quiz:prompt.buildChord', { symbol: printedSymbol(question.symbol) })
          : t('quiz:prompt.buildChordIn', {
              symbol: printedSymbol(question.symbol),
              position: t(`music:inversionName.${INVERSION_NAMES[question.inversion] ?? 'root'}`),
            })
      case 'name-chord':
        return question.heard ? t('quiz:prompt.hearChord') : t('quiz:prompt.nameChord')
      case 'chord-card':
        return question.show === 'name' ? answer(question) : t('quiz:prompt.nameChord')
      case 'build-scale':
        return t('quiz:prompt.buildScale', { scale: scaleName(question.root, question.kind) })
      case 'name-interval':
        return question.heard ? t('quiz:prompt.hearInterval') : t('quiz:prompt.nameInterval')
      case 'interval-card':
        return question.show === 'name' ? answer(question) : t('quiz:prompt.nameInterval')
      case 'build-interval':
        return t('quiz:prompt.buildInterval', {
          interval: t(`music:interval.${question.interval}.name`).toLowerCase(),
          note: printedNote(question.lowNote),
        })
      case 'name-scale':
        return t('quiz:prompt.nameScale')
      case 'read-note':
        return t('quiz:prompt.readNote')
      case 'key-signature':
        return question.ask === 'count'
          ? t('quiz:prompt.signatureCount', { key: keyName(question.key) })
          : question.key.minor
            ? t('quiz:prompt.signatureMinor')
            : t('quiz:prompt.signatureMajor')
      case 'key-degrees':
        return t('quiz:prompt.keyDegrees', { key: keyName(question.key) })
      case 'chord-role':
        return t('quiz:prompt.chordRole', { key: keyName(question.key) })
      case 'name-progression':
        return t('quiz:prompt.nameProgression', { key: keyName(question.key) })
      case 'name-cadence':
        return question.heard
          ? t('quiz:prompt.hearCadence', { key: keyName(question.key) })
          : t('quiz:prompt.nameCadence', { key: keyName(question.key) })
      case 'cadence-card':
        return question.show === 'name'
          ? answer(question)
          : t('quiz:prompt.nameCadence', { key: keyName(question.key) })
    }
  }

  /** A choice round's options, each with the words it reads as. */
  const options = (question: ChoiceQuestion): { value: string; label: string }[] => {
    switch (question.mode) {
      case 'name-interval':
        return question.options.map((value) => ({
          value,
          label: t(`music:interval.${value}.name`),
        }))
      case 'name-scale':
        return question.options.map((value) => ({ value, label: t(`music:scaleKind.${value}`) }))
      case 'key-signature':
        return question.options.map((value) => {
          const key = question.ask === 'name' ? parseKey(value) : null
          return { value, label: key ? keyName(key) : signatureCount(value) }
        })
      case 'name-chord':
        return question.options.map((value) => ({ value, label: printedSymbol(value) }))
      case 'chord-role':
        return question.options.map((value) => ({ value, label: value }))
      case 'name-progression':
        return question.options.map((value) => ({ value, label: progressionLine(value) }))
      case 'name-cadence':
        return question.options.map((value) => ({ value, label: t(`quiz:cadence.${value}`) }))
    }
  }

  /** What the round's answer is called: `C♯m7 · Minor 7th`, `Perfect fifth`, `E4`. */
  function answer(question: Question): string {
    switch (question.mode) {
      case 'name-cadence':
      case 'cadence-card':
        return `${t(`quiz:cadence.${question.cadence}`)} · ${cadenceNumerals(question.voicing)} · ${keyName(question.key)}`
      case 'build-chord':
        if (question.cadence)
          return `${printedSymbol(question.symbol)} · ${cadenceNumerals(question.cadence.voicing)}`
        return `${printedSymbol(question.symbol)} · ${t(`music:quality.${question.quality}`)}`
      case 'name-chord':
      case 'chord-card':
        return `${printedSymbol(question.symbol)} · ${t(`music:quality.${question.quality}`)}`
      case 'build-scale':
      case 'name-scale':
        return scaleName(question.root, question.kind)
      case 'read-note':
        return printedSymbol(writtenName(question.key, question.spelled))
      case 'key-degrees':
        return question.notes.map((tone) => printedNote(tone.note)).join(' ')
      case 'key-signature':
        return `${keyName(question.key)}: ${signatureCount(signatureOption(question.key))}`
      case 'chord-role':
        return `${question.numeral} · ${keyName(question.key)}`
      case 'name-progression':
        return `${progressionLine(question.line)} · ${keyName(question.key)}`
      case 'name-interval':
      case 'build-interval':
      case 'interval-card':
        return t('quiz:intervalAnswer', {
          interval: t(`music:interval.${question.interval}.name`),
          low: printedNote(question.lowNote),
          high: printedNote(question.highNote),
        })
    }
  }

  /** A build's answer as its notes, as the Check board says it ("The answer: G B D"); else its name. */
  function notes(question: Question): string {
    const said = whyAnswer(question).values.notes
    return typeof said === 'string' && said !== '' ? said : answer(question)
  }

  /**
   * Why the round's answer is its answer, in words (A41): the kernel's reasons, each id it gives
   * named in the learner's language.
   */
  function why(question: Question): string {
    const { key: kind, values } = whyAnswer(question)
    const text = (name: string) => String(values[name] ?? '')
    const count = Number(values.count ?? 0)
    const chord = {
      notes: text('notes'),
      formula: text('formula'),
      root: text('root'),
      quality: t(`music:quality.${idOf(CHORD_QUALITIES, text('quality'), 'maj')}`).toLowerCase(),
    }
    const key = () => {
      const read = parseKey(text('key'))
      return read ? keyName(read) : text('key')
    }
    switch (kind) {
      case 'chord':
        return t('quiz:why.chord', chord)
      case 'inversion':
        return t('quiz:why.inversion', {
          ...chord,
          bass: text('bass'),
          position: t(
            `music:inversionName.${INVERSION_NAMES[Number(values.position ?? 0)] ?? 'root'}`,
          ).toLowerCase(),
        })
      case 'interval':
        return t('quiz:why.interval', {
          count,
          low: text('low'),
          high: text('high'),
          number: text('number'),
          interval: t(`music:interval.${idOf(REFERENCE_INTERVALS, text('interval'), 'r')}.name`),
        })
      case 'scale':
        return t('quiz:why.scale', {
          scale: `${text('root')} ${t(`music:scaleName.${idOf(SCALE_KINDS, text('kind'), 'major')}`)}`,
          notes: text('notes'),
          steps: text('steps')
            .split(' ')
            .map((step) => t(`quiz:why.step.${idOf(STEPS, step, '2')}`))
            .join('–'),
        })
      case 'note': {
        const [place = 'line', n = ''] = text('place').split(/(?<=[a-z])(?=\d)|:/)
        return t('quiz:why.note', {
          note: text('note'),
          clef: t(`quiz:why.clef.${idOf(CLEFS, text('clef'), 'treble')}`),
          place: t(`quiz:why.place.${idOf(PLACES, place, 'line')}`, { n }),
        })
      }
      case 'signature':
        return t(`quiz:why.${idOf(SIGNS, text('sign'), 'sharps')}`, {
          key: key(),
          count,
          notes: text('notes'),
        })
      case 'noSignature':
        return t('quiz:why.noSignature', { key: key() })
      case 'degrees':
        return t('quiz:why.degrees', { key: key(), notes: text('notes') })
      case 'role':
        return t('quiz:why.role', {
          key: key(),
          numeral: text('numeral'),
          degree: text('degree'),
          root: text('root'),
          notes: text('notes'),
        })
      case 'progression':
        return t('quiz:why.progression', {
          key: key(),
          numerals: text('numerals'),
          chords: text('chords'),
        })
      case 'cadence':
        return t(`quiz:why.cadence.${idOf(CADENCES, text('cadence'), 'authentic')}`, {
          numerals: text('numerals'),
        })
    }
  }

  return { prompt, options, answer, notes, why }
}
