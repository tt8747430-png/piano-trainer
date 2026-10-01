import { useTranslation } from 'react-i18next'
import { signatureOption, type ChoiceQuestion, type Question } from '@/features/trainer'
import { useKeyName, useScaleName } from '@/shared/i18n'
import { noteName, parseKey, writtenOctave } from '@/shared/lib/music'

/** Where a chord asked in an inversion has its lowest note, by inversion. */
const POSITION = ['root', 'first', 'second', 'third'] as const

/** A key signature's count as the options write it (`3♯`, `2♭`, `0`), read back. */
const COUNT = /^(\d)(♯|♭)$/

/** A round's words: what it asks, how each option reads, and what its answer is called. */
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
        return question.inversion === null
          ? t('quiz:prompt.buildChord', { symbol: question.symbol })
          : t('quiz:prompt.buildChordIn', {
              symbol: question.symbol,
              position: t(`quiz:position.${POSITION[question.inversion] ?? 'root'}`),
            })
      case 'name-chord':
        return t('quiz:prompt.nameChord')
      case 'build-scale':
        return t('quiz:prompt.buildScale', { scale: scaleName(question.root, question.kind) })
      case 'name-interval':
        return t('quiz:prompt.nameInterval')
      case 'name-quality':
        return t('quiz:prompt.nameQuality')
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
      case 'name-quality':
        return question.options.map((value) => ({ value, label: t(`music:quality.${value}`) }))
      case 'name-scale':
        return question.options.map((value) => ({ value, label: t(`music:scaleKind.${value}`) }))
      case 'key-signature':
        return question.options.map((value) => {
          const key = question.ask === 'name' ? parseKey(value) : null
          return { value, label: key ? keyName(key) : signatureCount(value) }
        })
      case 'name-chord':
      case 'chord-role':
        return question.options.map((value) => ({ value, label: value }))
    }
  }

  /** What the round's answer is called: `Cm7 · Minor 7th`, `Perfect fifth`, `E4`. */
  const answer = (question: Question): string => {
    switch (question.mode) {
      case 'build-chord':
      case 'name-chord':
        return `${question.symbol} · ${t(`music:quality.${question.quality}`)}`
      case 'build-scale':
      case 'name-scale':
        return scaleName(question.root, question.kind)
      case 'read-note':
        return `${noteName(question.spelled)}${writtenOctave(question.key, question.spelled)}`
      case 'key-degrees':
        return question.notes.map((tone) => noteName(tone.note)).join(' ')
      case 'key-signature':
        return `${keyName(question.key)}: ${signatureCount(signatureOption(question.key))}`
      case 'chord-role':
        return `${question.numeral} · ${keyName(question.key)}`
      case 'name-interval':
        return t(`music:interval.${question.interval}.name`)
      case 'name-quality':
        return t(`music:quality.${question.quality}`)
    }
  }

  return { prompt, options, answer }
}
