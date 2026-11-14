import { Copy, Play, Trash2 } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'
import { CHORD_BEATS } from '@/shared/lib/arrangement'
import {
  chordBass,
  chordSymbol,
  printedChord,
  printedNote,
  printedSymbol,
  qualitySuffix,
  readChordSymbol,
  sameNote,
  spellChord,
  type Chord,
  type ChordQuality,
  type Key,
} from '@/shared/lib/music'
import {
  ChoiceChips,
  Labelled,
  MenuPicker,
  NotePicker,
  Sheet,
  SheetContent,
  Stepper,
  TypedField,
} from '@/shared/ui'
import { likeliestChords } from '../model/key-chords'

/** The bass a chord's choices offer: its root, or one of its other tones under it. */
const BASS_ROLES = ['root', '3rd', '5th', '7th'] as const
/** The chords Musicca's sheet offers by name, as the board draws them (maj m 7 maj7 m7 sus4 sus2 dim add9 6). */
const QUALITIES: readonly ChordQuality[] = [
  'maj',
  'min',
  'd7',
  'maj7',
  'm7',
  'sus4',
  'sus2',
  'dim',
  'add9',
  'six',
]
/** The key's chords suggested, its own seven triads and V7, the chord in hand left out. */
const SUGGESTED = 6

const sameChord = (a: Chord, b: Chord) =>
  sameNote(a.root, b.root) && a.quality === b.quality && a.bass === undefined

/**
 * A chord's sheet as Musicca's (canvas 171), opened by a tap on it, its bar's !, or a letter typed on
 * it (the symbol then typed): titled by its bar and name; Root, Chord, Bass note, Duration − n beats
 * +, Suggested chords (the key's, a tap takes one); then Play from here and Duplicate, and Delete
 * chord apart.
 */
export function ChordDialog({
  open,
  onOpenChange,
  bar,
  chord,
  beats,
  musicKey,
  typed: started,
  onChord,
  onBeats,
  onPlayFrom,
  onDuplicate,
  onRemove,
}: {
  open: boolean
  onOpenChange(open: boolean): void
  /** Its bar in its section, from 1. */
  bar: number
  chord: Chord
  beats: number
  musicKey: Key
  /** A letter typed on the chord: the symbol starts from it. */
  typed?: string | undefined
  onChord(chord: Chord): void
  onBeats(beats: number): void
  onPlayFrom(): void
  onDuplicate(): void
  onRemove(): void
}) {
  const { t } = useTranslation('practice')
  const [typed, setTyped] = useState<string | null>(started ?? null)
  const read = typed === null ? chord : readChordSymbol(typed)
  const tones = spellChord(chord.root, chord.quality)
  const bassRole =
    chord.bass === undefined
      ? 'root'
      : (tones.find((tone) => tone.note.letter === chord.bass?.letter)?.role ?? 'root')
  const qualities = QUALITIES.includes(chord.quality) ? QUALITIES : [...QUALITIES, chord.quality]
  const suggested = likeliestChords(musicKey)
    .filter((each) => !sameChord(each, chord))
    .slice(0, SUGGESTED)
  /** The chord changed: its bass kept where the new chord holds it. */
  const take = (next: Chord) => {
    setTyped(null)
    onChord(next)
  }
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent title={t('chordPlayer.chord.title', { bar, chord: printedChord(chord) })}>
        <div className="flex flex-col gap-5">
          {typed !== null ? (
            <TypedField
              label={t('chordPlayer.chord.symbol')}
              value={typed}
              error={read ? null : t('chordPlayer.unread', { text: typed })}
              onChange={(text) => {
                setTyped(text)
                const chosen = readChordSymbol(text)
                if (chosen) onChord(chosen)
              }}
            />
          ) : null}
          <Labelled label={t('chordPlayer.chord.root')}>
            <NotePicker
              label={t('chordPlayer.chord.root')}
              bare
              value={chord.root}
              onChange={(root) => take({ root, quality: chord.quality })}
            />
          </Labelled>
          <Labelled label={t('chordPlayer.chord.quality')}>
            <ChoiceChips
              label={t('chordPlayer.chord.quality')}
              value={chord.quality}
              options={qualities.map((quality) => ({
                value: quality,
                label:
                  quality === 'maj'
                    ? t('chordPlayer.chord.major')
                    : printedSymbol(qualitySuffix(quality)),
              }))}
              onChange={(quality) => take({ root: chord.root, quality })}
            />
          </Labelled>
          <Labelled label={t('chordPlayer.chord.bass')}>
            <MenuPicker
              label={t('chordPlayer.chord.bass')}
              bare
              value={bassRole}
              options={BASS_ROLES.flatMap((role) => {
                const tone = tones.find((each) => each.role === role)
                if (!tone && role !== 'root') return []
                return [
                  {
                    value: role,
                    label:
                      role === 'root' || !tone
                        ? t('chordPlayer.chord.bassRoot')
                        : printedNote(tone.note),
                  },
                ]
              })}
              onChange={(role) => {
                const tone = tones.find((each) => each.role === role)
                const { bass: _bass, ...plain } = chord
                take(
                  role === 'root' || !tone
                    ? plain
                    : { ...plain, bass: chordBass(chord.root, chord.quality, tone.note) },
                )
              }}
            />
          </Labelled>
          <Labelled label={t('chordPlayer.chord.length')}>
            <Stepper
              label={t('chordPlayer.chord.length')}
              value={beats}
              min={CHORD_BEATS.min}
              max={CHORD_BEATS.max}
              format={(count) => t('chordPlayer.chord.beats', { count })}
              decrease={t('chordPlayer.chord.shorter')}
              increase={t('chordPlayer.chord.longer')}
              onChange={onBeats}
            />
          </Labelled>
          <section className="flex flex-col gap-2">
            <h3 className="font-sans text-sm text-muted-foreground">
              {t('chordPlayer.chord.suggested')}
            </h3>
            <ul className="grid grid-cols-3 gap-2">
              {suggested.map((each) => (
                <li key={chordSymbol(each)} className="flex">
                  <button
                    type="button"
                    onClick={() => take(each)}
                    className="h-13 flex-1 rounded-[12px] bg-card font-display text-xl font-bold shadow-[0_0_0_1px_var(--color-border)] transition-colors duration-150 ease-out hover:bg-muted"
                  >
                    {printedChord(each)}
                  </button>
                </li>
              ))}
            </ul>
          </section>
          <div className="overflow-hidden rounded-[12px] bg-muted">
            <SheetAct
              icon={<Play aria-hidden className="size-5 fill-current" />}
              onClick={onPlayFrom}
            >
              {t('chordPlayer.chord.playFrom')}
            </SheetAct>
            <div className="ml-12 h-px bg-border" />
            <SheetAct icon={<Copy aria-hidden className="size-5" />} onClick={onDuplicate}>
              {t('chordPlayer.chord.duplicate')}
            </SheetAct>
          </div>
          <div className="overflow-hidden rounded-[12px] bg-muted">
            <SheetAct
              icon={<Trash2 aria-hidden className="size-5" />}
              onClick={onRemove}
              destructive
            >
              {t('chordPlayer.chord.remove')}
            </SheetAct>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

/** One of the sheet's acts, the board's ACTROW: its icon and name, 48 tall, in a grouped card. */
function SheetAct({
  icon,
  destructive = false,
  onClick,
  children,
}: {
  icon: ReactNode
  destructive?: boolean
  onClick(): void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex min-h-12 w-full items-center gap-3 px-4 text-left text-base font-semibold transition-colors duration-150 ease-out hover:brightness-95',
        destructive ? 'text-destructive' : 'text-foreground',
      )}
    >
      {icon}
      {children}
    </button>
  )
}
