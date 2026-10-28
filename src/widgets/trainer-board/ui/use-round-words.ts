import { useTranslation } from 'react-i18next'
import {
  cadenceNumerals,
  signatureOption,
  type ChoiceQuestion,
  type Question,
} from '@/features/trainer'
import { useKeyName, useScaleName } from '@/shared/i18n'
import { noteName, parseKey, printedSymbol, writtenName } from '@/shared/lib/music'
import { INVERSION_NAMES } from '@/shared/ui'

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
            : `${chord}, ${t(`music:inversionName.${INVERSION_NAMES[question.inversion] ?? 'root'}`)}`
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
          note: noteName(question.lowNote),
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
        return writtenName(question.key, question.spelled)
      case 'key-degrees':
        return question.notes.map((tone) => noteName(tone.note)).join(' ')
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
          low: noteName(question.lowNote),
          high: noteName(question.highNote),
        })
    }
  }

  return { prompt, options, answer }
}
