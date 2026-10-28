import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  CHORD_FAMILIES,
  chordFamily,
  LETTERS,
  note,
  noteName,
  printedChord,
  printedSymbol,
  qualitiesIn,
  type Chord,
  type ChordFamily,
} from '@/shared/lib/music'
import { bassesOf, WIZARD_ACCIDENTALS, wizardChord, type WizardChoice } from '../model/chord-wizard'

/** A wizard's chip: a 40px toggle, the one chosen on the sky wash, a tap leaving the field's cursor. */
function Chip({
  pressed,
  label,
  onChoose,
  children,
}: {
  pressed: boolean
  label?: string
  onChoose: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      aria-label={label}
      title={label}
      // A tap leaves the cursor in the field: a phone's own keyboard stays up.
      onPointerDown={(event) => event.preventDefault()}
      onClick={onChoose}
      className="h-10 min-w-10 shrink-0 rounded-lg border border-hairline bg-card px-2 font-display text-base font-semibold whitespace-nowrap text-card-foreground transition-colors duration-150 ease-out hover:bg-accent aria-pressed:border-transparent aria-pressed:bg-[color-mix(in_oklab,var(--color-link)_14%,var(--color-card))] aria-pressed:text-link focus-visible:-outline-offset-3 motion-reduce:transition-none"
    >
      {children}
    </button>
  )
}

/** One of the wizard's rows: its name for a screen reader, its chips scrolling sideways. */
function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div
      role="group"
      aria-label={label}
      className="fade-scroll-x flex gap-1 overflow-x-auto overscroll-x-contain scrollbar-none"
    >
      {children}
    </div>
  )
}

/** The accidentals' signs as the root prints them. */
const SIGNS = { [-1]: '♭', 0: '♮', 1: '♯' } as const

/**
 * The chord wizard (Flat's), under the chord-symbol field: the root's letter and accidental, the kind
 * of chord and the chord itself (each printed as it will be, Dm7), then the bass (the root, or a chord
 * tone: an inversion). Each tap builds the symbol into the field (`onChord`), where Enter or Add writes
 * it; what is typed starts it (`from`).
 */
export function ChordWizard({
  from,
  onChord,
  onAdd,
}: {
  from: WizardChoice
  onChord: (chord: Chord) => void
  onAdd: () => void
}) {
  const { t } = useTranslation(['editor', 'music'])
  const [family, setFamily] = useState<ChordFamily>(() => chordFamily(from.quality))
  const choose = (next: Partial<WizardChoice>) => {
    const choice = { ...from, ...next }
    // A new root or chord keeps an inversion only where it has that many chord tones over its root.
    const inversion = Math.min(choice.inversion, bassesOf(choice).length)
    onChord(wizardChord({ ...choice, inversion }))
  }
  const root = note(from.letter, from.accidental)
  return (
    <div className="flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-1.5">
      <Row label={t('chord.root')}>
        {LETTERS.map((letter) => (
          <Chip key={letter} pressed={from.letter === letter} onChoose={() => choose({ letter })}>
            {letter}
          </Chip>
        ))}
      </Row>
      <Row label={t('chord.accidental')}>
        {WIZARD_ACCIDENTALS.map((accidental) => (
          <Chip
            key={accidental}
            pressed={from.accidental === accidental}
            label={t(
              `accidentals.${accidental === 1 ? 'sharp' : accidental === -1 ? 'flat' : 'natural'}`,
            )}
            onChoose={() => choose({ accidental })}
          >
            {SIGNS[accidental]}
          </Chip>
        ))}
      </Row>
      <Row label={t('chord.kind')}>
        {CHORD_FAMILIES.map((each) => (
          <Chip key={each} pressed={family === each} onChoose={() => setFamily(each)}>
            <span className="font-sans text-sm font-medium">{t(`music:family.${each}`)}</span>
          </Chip>
        ))}
      </Row>
      <Row label={t('chord.quality')}>
        {qualitiesIn(family).map((quality) => (
          <Chip
            key={quality}
            pressed={from.quality === quality}
            label={t(`music:quality.${quality}`)}
            onChoose={() => choose({ quality })}
          >
            {printedChord({ root, quality })}
          </Chip>
        ))}
      </Row>
      <div className="flex items-end gap-1">
        <div className="min-w-0 flex-1">
          <Row label={t('chord.bass')}>
            <Chip pressed={from.inversion === 0} onChoose={() => choose({ inversion: 0 })}>
              <span className="font-sans text-sm font-medium">{t('chord.rootBass')}</span>
            </Chip>
            {bassesOf(from).map((bass, at) => (
              <Chip
                key={noteName(bass)}
                pressed={from.inversion === at + 1}
                onChoose={() => choose({ inversion: at + 1 })}
              >
                /{printedSymbol(noteName(bass))}
              </Chip>
            ))}
          </Row>
        </div>
        <button
          type="button"
          onPointerDown={(event) => event.preventDefault()}
          onClick={onAdd}
          className="h-10 shrink-0 rounded-lg bg-primary px-3 text-sm font-semibold text-primary-foreground transition-colors duration-150 hover:bg-primary/90"
        >
          {t('chord.add')}
        </button>
      </div>
    </div>
  )
}
