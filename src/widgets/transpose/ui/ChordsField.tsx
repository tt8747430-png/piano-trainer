import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { chordsOfLine, readChordLine } from '@/shared/lib/music'
import { TypedField } from '@/shared/ui'

/**
 * A line of chords typed: each change that reads whole sets the chords; what the learner typed stays
 * while it means the chords shown, so a word half typed keeps the last line read, and a line names the
 * words that cannot be read.
 */
export function ChordsField({
  chords,
  onChange,
}: {
  /** The chords as the URL holds them: typed, and read. */
  chords: string
  onChange: (chords: string) => void
}) {
  const { t } = useTranslation('practice')
  const [typed, setTyped] = useState<{ text: string; for: string } | null>(null)
  const text = typed && typed.for === chords ? typed.text : chords
  const { unread } = readChordLine(text)
  return (
    <TypedField
      label={t('transpose.field')}
      value={text}
      error={unread.length > 0 ? t('transpose.unread', { words: unread.join(' ') }) : null}
      onChange={(next) => {
        const reads = chordsOfLine(next) !== null
        setTyped({ text: next, for: reads ? next : chords })
        if (reads && next !== chords) onChange(next)
      }}
    />
  )
}
