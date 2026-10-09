import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { readChordSymbol } from '@/shared/lib/music'
import { TypedField } from '@/shared/ui'

/**
 * A chord typed: each change that reads sets the chord; what the learner typed stays while it means
 * the chord shown, so a symbol half typed keeps the ways of the last one read, and a line says when
 * it cannot be read.
 */
export function ChordField({
  label,
  chord,
  onChange,
}: {
  label: string
  /** The chord as the URL holds it: typed, and read. */
  chord: string
  onChange: (chord: string) => void
}) {
  const { t } = useTranslation('learn')
  const [typed, setTyped] = useState<{ text: string; for: string } | null>(null)
  const text = typed && typed.for === chord ? typed.text : chord
  return (
    <TypedField
      label={label}
      value={text}
      error={readChordSymbol(text) === null ? t('passing.unread') : null}
      onChange={(next) => {
        const reads = readChordSymbol(next) !== null
        setTyped({ text: next, for: reads ? next : chord })
        if (reads && next !== chord) onChange(next)
      }}
    />
  )
}
