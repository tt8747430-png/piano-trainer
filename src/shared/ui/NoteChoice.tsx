import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  accidentalSign,
  LETTERS,
  note,
  noteFromParam,
  noteName,
  noteParam,
  ROOT_ACCIDENTALS,
  type Letter,
  type NoteParam,
  type RootAccidental,
  type SpelledNote,
} from '@/shared/lib/music'
import { Segmented } from './Segmented'

/** Each accidental as the choice draws it, and its word for a screen reader. */
const ACCIDENTAL_FACES = {
  0: { sign: '♮', word: 'natural' },
  1: { sign: accidentalSign(1) ?? '', word: 'sharp' },
  [-1]: { sign: accidentalSign(-1) ?? '', word: 'flat' },
} as const satisfies Readonly<Record<RootAccidental, { sign: string; word: string }>>

/** Any accidental on any letter: a root's. */
const EVERY = (): readonly RootAccidental[] => ROOT_ACCIDENTALS

const isRootAccidental = (accidental: number): accidental is RootAccidental =>
  ROOT_ACCIDENTALS.some((each) => each === accidental)

/**
 * A note as it is written, chosen in two parts as a reference app does: its letter, then natural,
 * sharp or flat. What is chosen is what is written: D♭ stays D♭ whatever stands on it. `accidentals`
 * keeps a letter's choice to those it may take (a key's), natural where the one chosen is not.
 */
export function NoteChoice({
  label,
  value,
  onChange,
  accidentals = EVERY,
  name = noteName,
  children,
}: {
  label: string
  value: NoteParam
  onChange: (note: NoteParam) => void
  accidentals?: (letter: Letter) => readonly RootAccidental[]
  /** How the note chosen is named over the choice ("C♯ minor"). */
  name?: (note: SpelledNote) => string
  /** A part of the same choice after the accidental: a key's mode. */
  children?: ReactNode
}) {
  const { t } = useTranslation('music')
  const chosen = noteFromParam(value)
  const current: RootAccidental = isRootAccidental(chosen.accidental) ? chosen.accidental : 0
  const choose = (letter: Letter, accidental: RootAccidental) => {
    const next = note(letter, accidentals(letter).includes(accidental) ? accidental : 0)
    if (noteParam(next) !== value) onChange(noteParam(next))
  }
  return (
    <div role="group" aria-label={label} className="@container flex min-w-0 flex-col gap-2">
      <p aria-hidden className="flex items-baseline justify-between gap-3">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="font-semibold">{name(chosen)}</span>
      </p>
      <div className="flex flex-col gap-2 @2xl:flex-row">
        <div className="min-w-0 flex-1">
          <Segmented
            label={t('note.letter')}
            value={chosen.letter}
            options={LETTERS.map((letter) => ({ value: letter, label: letter }))}
            onChange={(letter) => choose(letter, current)}
          />
        </div>
        <div className="@2xl:w-40 @2xl:shrink-0">
          <Segmented
            label={t('note.accidental')}
            value={current}
            options={accidentals(chosen.letter).map((accidental) => ({
              value: accidental,
              // The sign drawn at a size that reads (the music font's ♮ and ♭ are small), named in words.
              label: '',
              icon: (
                <span aria-hidden className="text-3xl leading-none">
                  {ACCIDENTAL_FACES[accidental].sign}
                </span>
              ),
              title: t(`note.${ACCIDENTAL_FACES[accidental].word}`),
            }))}
            onChange={(accidental) => choose(chosen.letter, accidental)}
          />
        </div>
        {children}
      </div>
    </div>
  )
}
