import { cn } from '@/shared/lib'
import { lineWords, type Span } from '../model/lyric-lines'
import type { SungPlace } from '../model/sung-place'

/**
 * The wait for the next line sung, in a line's place (ADR 0101, Chordify's): a dash whose dot runs
 * along it to the next line's first word, the way behind it in ink.
 */
function Wait({ progress }: { progress: number }) {
  return (
    <div data-slot="wait" aria-hidden className="flex h-7 items-center justify-center">
      <div className="relative h-1 w-16 rounded-full bg-muted">
        <div
          className="absolute inset-0 origin-left rounded-full bg-foreground transition-transform duration-200 ease-out motion-reduce:transition-none"
          style={{ transform: `scaleX(${progress})` }}
        />
        <div
          className="absolute inset-0 transition-transform duration-200 ease-out motion-reduce:transition-none"
          style={{ transform: `translateX(${progress * 100}%)` }}
        >
          <span className="absolute top-1/2 left-0 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground" />
        </div>
      </div>
    </div>
  )
}

/**
 * The words under the Diagrams view's strip (ADR 0099, 0101, Chordify's karaoke): the line being
 * sung in the body face, bold, each word in ink once the music reaches it (its first syllable's
 * beat, as written) and muted before; between lines that sing, the wait in its place; the next line
 * sung muted under either. A room too short for both shows the first alone (`diagrams-view`); on a
 * phone on its side, beside the chords, each on one line.
 */
export function SungLines({
  place,
  written,
}: {
  place: SungPlace
  /** The beat sounding, as its bar is written: the words sung up to its end are in ink. */
  written: Span
}) {
  return (
    <div
      data-area="words"
      className="flex flex-col gap-2 text-center text-lg sm:text-xl landscape-phone:gap-1 landscape-phone:text-base landscape-phone:leading-snug"
    >
      {place.kind === 'line' ? (
        <p data-slot="sung-line" className="font-semibold landscape-phone:truncate">
          {(place.line.words[0] ?? []).map(({ text, at }, i) => {
            const sung = at < written.to
            return (
              <span
                key={i}
                data-sung={sung ? '' : undefined}
                className={cn(
                  'transition-colors duration-200 ease-out',
                  sung ? 'text-foreground' : 'text-muted-foreground',
                )}
              >
                {i > 0 ? ' ' : ''}
                {text}
              </span>
            )
          })}
        </p>
      ) : (
        <Wait progress={place.progress} />
      )}
      {place.coming ? (
        <p data-slot="coming-line" className="text-muted-foreground landscape-phone:truncate">
          {lineWords(place.coming)}
        </p>
      ) : null}
    </div>
  )
}
