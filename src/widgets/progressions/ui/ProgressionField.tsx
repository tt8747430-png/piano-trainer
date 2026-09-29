import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  numeralsParam,
  numeralText,
  parseNumerals,
  type Key,
  type Numeral,
} from '@/shared/lib/music'
import { InputGroup, InputGroupInput } from '@/shared/ui/primitives/input-group'
import { readProgression } from '../model/typed-progression'

const written = (numerals: readonly Numeral[]): string => numerals.map(numeralText).join(' ')

/**
 * Numerals or chords typed: each change that reads sets the progression; what the learner typed
 * stays while it means the progression shown, and a line says when it cannot be read.
 */
export function ProgressionField({
  progression,
  musicKey,
  onChange,
}: {
  /** The progression's numerals as the URL holds them. */
  progression: string
  musicKey: Key
  onChange: (progression: string) => void
}) {
  const { t } = useTranslation('learn')
  const errorId = useId()
  const [typed, setTyped] = useState<{ text: string; for: string } | null>(null)
  const text =
    typed && typed.for === progression ? typed.text : written(parseNumerals(progression) ?? [])
  const readable = readProgression(text, musicKey) !== null
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm text-muted-foreground">{t('progressions.field')}</span>
      <InputGroup className="h-12 rounded-2xl bg-card">
        <InputGroupInput
          value={text}
          aria-invalid={!readable}
          aria-describedby={readable ? undefined : errorId}
          autoCapitalize="off"
          autoComplete="off"
          spellCheck={false}
          onChange={(event) => {
            const next = event.target.value
            const numerals = readProgression(next, musicKey)
            const param = numerals ? numeralsParam(numerals) : progression
            setTyped({ text: next, for: param })
            if (numerals && param !== progression) onChange(param)
          }}
          className="font-display text-xl font-semibold md:text-xl"
        />
      </InputGroup>
      {readable ? null : (
        <span id={errorId} className="text-sm text-destructive">
          {t('progressions.unread')}
        </span>
      )}
    </label>
  )
}
