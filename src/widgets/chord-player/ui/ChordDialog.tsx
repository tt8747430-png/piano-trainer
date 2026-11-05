import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CHORD_BEATS } from '@/shared/lib/arrangement'
import {
  chordBass,
  chordSymbol,
  passingChords,
  printedChord,
  printedNote,
  readChordSymbol,
  spellChord,
  type Chord,
  type Key,
} from '@/shared/lib/music'
import { Labelled, MenuPicker, Sheet, SheetContent, Stepper, TypedField } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'

/** The bass a chord's choices offer: its root, or one of its other tones under it. */
const BASS_ROLES = ['root', '3rd', '5th', '7th'] as const

/**
 * A chord's sheet (R29 CP2, P14 folded in, R32), opened by a tap or Enter on its tile, or a letter
 * typed on it (the symbol starting from that letter): its symbol typed, its length in beats, its bass
 * note, and the passing chords that lead from it to the next tile, each put before that tile at a
 * tap; Delete chord at the foot.
 */
export function ChordDialog({
  open,
  onOpenChange,
  chord,
  beats,
  next,
  musicKey,
  typed: started,
  onChord,
  onBeats,
  onInsert,
  onRemove,
}: {
  open: boolean
  onOpenChange(open: boolean): void
  chord: Chord
  beats: number
  /** The box after it, where there is one: what its passing chords lead to. */
  next: Chord | null
  musicKey: Key
  /** A letter typed on the chord's tile: the symbol starts from it. */
  typed?: string | undefined
  onChord(chord: Chord): void
  onBeats(beats: number): void
  onInsert(chords: readonly Chord[]): void
  onRemove(): void
}) {
  const { t } = useTranslation('practice')
  const [typed, setTyped] = useState<string | null>(started ?? null)
  const symbol = chordSymbol(chord)
  const read = typed === null ? chord : readChordSymbol(typed)
  const tones = spellChord(chord.root, chord.quality)
  const bassRole =
    chord.bass === undefined
      ? 'root'
      : (tones.find((tone) => tone.note.letter === chord.bass?.letter)?.role ?? 'root')
  const ways = next ? passingChords(chord, next, musicKey) : []
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        title={t('chordPlayer.chord.title')}
        description={printedChord(chord)}
        footer={
          <Button variant="destructive" size="lg" onClick={onRemove}>
            <Trash2 aria-hidden />
            {t('chordPlayer.chord.remove')}
          </Button>
        }
      >
        <div className="flex flex-col gap-5">
          <TypedField
            label={t('chordPlayer.chord.symbol')}
            value={typed ?? symbol}
            error={read ? null : t('chordPlayer.unread', { text: typed ?? '' })}
            onChange={(text) => {
              setTyped(text)
              const chosen = readChordSymbol(text)
              if (chosen) onChord(chosen)
            }}
          />
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
          <Labelled label={t('chordPlayer.chord.bass')}>
            <MenuPicker
              label={t('chordPlayer.chord.bass')}
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
                setTyped(null)
                const tone = tones.find((each) => each.role === role)
                const { bass: _bass, ...plain } = chord
                onChord(
                  role === 'root' || !tone
                    ? plain
                    : { ...plain, bass: chordBass(chord.root, chord.quality, tone.note) },
                )
              }}
            />
          </Labelled>
          {next && ways.length > 0 ? (
            <section className="flex flex-col gap-2">
              <h3 className="font-sans text-sm text-muted-foreground">
                {t('chordPlayer.chord.leading', { chord: printedChord(next) })}
              </h3>
              <ul className="flex flex-wrap gap-2">
                {ways.map((way) => {
                  const names = way.chords.map(printedChord).join(' ')
                  return (
                    <li key={`${way.kind}-${names}`}>
                      <Button
                        variant="outline"
                        className="min-h-11 font-display text-base"
                        aria-label={t('chordPlayer.chord.insert', {
                          chord: names,
                          next: printedChord(next),
                        })}
                        onClick={() => onInsert(way.chords)}
                      >
                        {names}
                      </Button>
                    </li>
                  )
                })}
              </ul>
            </section>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  )
}
