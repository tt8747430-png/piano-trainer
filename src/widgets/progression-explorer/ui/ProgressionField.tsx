import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  keyParam,
  numeralsParam,
  numeralText,
  parseNumerals,
  type Key,
  type Numeral,
} from '@/shared/lib/music'
import { TypedField } from '@/shared/ui'
import { readProgression } from '../model/typed-progression'

const written = (numerals: readonly Numeral[]): string => numerals.map(numeralText).join(' ')

/**
 * Numerals or a song's chords typed (ADR 0052): each change that reads sets the progression, chords
 * in the key they are read in; what the learner typed stays while it means the progression shown in
 * the key it was typed in, and a line says when it cannot be read.
 */
export function ProgressionField({
  progression,
  musicKey,
  onChange,
}: {
  /** The progression's numerals as the URL holds them. */
  progression: string
  musicKey: Key
  onChange: (progression: string, key: Key) => void
}) {
  const { t } = useTranslation('practice')
  // What was typed, what it means, and the key the typing began in: each keystroke is read from that
  // key, so a key the line chose part-way does not hold the rest of the line to it.
  const [typed, setTyped] = useState<{ text: string; for: string; from: Key } | null>(null)
  // Chords mean their numerals in one key: in another, the field writes the numerals the row plays.
  const meaning = (numerals: string) => `${numerals} ${keyParam(musicKey)}`
  const typing = typed !== null && typed.for === meaning(progression)
  const text = typing ? typed.text : written(parseNumerals(progression) ?? [])
  const from = typing ? typed.from : musicKey
  return (
    <TypedField
      label={t('progressions.field')}
      value={text}
      error={readProgression(text, from) === null ? t('progressions.unread') : null}
      onChange={(next) => {
        const read = readProgression(next, from)
        const param = read ? numeralsParam(read.numerals) : progression
        const key = read?.key ?? musicKey
        setTyped({ text: next, for: `${param} ${keyParam(key)}`, from })
        if (read && (param !== progression || keyParam(key) !== keyParam(musicKey)))
          onChange(param, key)
      }}
    />
  )
}
