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
import { MenuPicker, NotePicker, Sheet, SheetContent, Stepper, TypedField } from '@/shared/ui'
import { likeliestChords } from '../model/key-chords'
import { ChordName } from './ChordName'

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
const SUGGESTED = 8

const sameChord = (a: Chord, b: Chord) =>
  sameNote(a.root, b.root) && a.quality === b.quality && a.bass === undefined

/**
 * A chord's sheet as Musicca's dialog (canvas 173), opened by a double tap on it, its bar's !, or a
 * letter typed on it (the symbol then typed): titled by its name; Chord (its root ⌄ and quality ⌄),
 * Bass note ⌄, Duration − n beats +; Suggested chords four across (the key's, a tap takes one); then
 * Delete, Duplicate and Play from here at its foot.
 */
export function ChordDialog({
  open,
  onOpenChange,
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
      <SheetContent title={printedChord(chord)}>
        <div className="flex flex-col gap-4">
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
          {/* Musicca's rows (canvas 173): Chord root ⌄ quality ⌄, Bass note ⌄, Duration − n beats +. */}
          <div className="flex flex-col overflow-hidden rounded-[12px] bg-muted">
            <DialogRow label={t('chordPlayer.chord.quality')}>
              <NotePicker
                label={t('chordPlayer.chord.root')}
                bare
                className={POP}
                value={chord.root}
                onChange={(root) => take({ root, quality: chord.quality })}
              />
              <MenuPicker
                label={t('chordPlayer.chord.quality')}
                bare
                className={cn(POP, 'min-w-28')}
                value={chord.quality}
                options={qualities.map((quality) => ({
                  value: quality,
                  label:
                    quality === 'maj'
                      ? t('chordPlayer.chord.major')
                      : quality === 'min'
                        ? t('chordPlayer.chord.minor')
                        : printedSymbol(qualitySuffix(quality)),
                }))}
                onChange={(quality) => take({ root: chord.root, quality })}
              />
            </DialogRow>
            <DialogRow label={t('chordPlayer.chord.bass')}>
              <MenuPicker
                label={t('chordPlayer.chord.bass')}
                bare
                className={cn(POP, 'min-w-32')}
                value={bassRole}
                options={BASS_ROLES.flatMap((role) => {
                  const tone = tones.find((each) => each.role === role)
                  if (!tone && role !== 'root') return []
                  return [
                    {
                      value: role,
                      label:
                        role === 'root' || !tone
                          ? t('chordPlayer.chord.bassRoot', { note: printedNote(chord.root) })
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
            </DialogRow>
            <DialogRow label={t('chordPlayer.chord.length')}>
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
            </DialogRow>
          </div>
          <section className="flex flex-col gap-2">
            <h3 className="px-1 font-sans text-[13px] font-semibold tracking-[.04em] text-muted-foreground uppercase">
              {t('chordPlayer.chord.suggested')}
            </h3>
            <ul className="grid grid-cols-4 gap-2">
              {suggested.map((each) => (
                <li key={chordSymbol(each)} className="flex min-w-0">
                  <button
                    type="button"
                    onClick={() => take(each)}
                    className="h-11 min-w-0 flex-1 rounded-[10px] bg-card text-[17px] font-medium shadow-[0_0_0_1px_var(--color-border)] transition-colors duration-150 ease-out hover:bg-muted"
                  >
                    <ChordName text={printedChord(each)} />
                  </button>
                </li>
              ))}
            </ul>
          </section>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onRemove}
              aria-label={t('chordPlayer.chord.remove')}
              title={t('chordPlayer.chord.remove')}
              className="grid size-11 shrink-0 place-items-center rounded-[10px] bg-destructive/12 text-destructive transition-colors duration-150 ease-out hover:bg-destructive/20"
            >
              <Trash2 aria-hidden className="size-5" />
            </button>
            <SheetAct icon={<Copy aria-hidden className="size-5" />} onClick={onDuplicate}>
              {t('chordPlayer.chord.duplicate')}
            </SheetAct>
            <SheetAct
              icon={<Play aria-hidden className="size-5 fill-current" />}
              onClick={onPlayFrom}
            >
              {t('chordPlayer.chord.playFrom')}
            </SheetAct>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

/** A pop-up's look in the sheet's rows, Musicca's select: white, ringed, its value and ⌄. */
const POP =
  'h-11 rounded-[10px] border-0 bg-card px-3 font-normal shadow-[0_0_0_1px_var(--color-border)] [&_span]:font-normal'

/** One of the sheet's rows (canvas 173): its name, its controls at its end. */
function DialogRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex min-h-14 items-center gap-2 py-1.5 pr-3 pl-4 not-last:shadow-[inset_0_-1px_0_var(--color-border)]">
      <span className="min-w-0 flex-1 text-base">{label}</span>
      {children}
    </div>
  )
}

/** One of the sheet's acts at its foot (canvas 173): its icon and name on the quiet fill, sharing the row. */
function SheetAct({
  icon,
  onClick,
  children,
}: {
  icon: ReactNode
  onClick(): void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-11 min-w-0 flex-[1_1_auto] items-center justify-center gap-2 rounded-[10px] bg-muted px-3 text-[15px] font-semibold whitespace-nowrap transition-colors duration-150 ease-out hover:brightness-95"
    >
      {icon}
      <span className="truncate">{children}</span>
    </button>
  )
}
