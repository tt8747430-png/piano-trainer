import type { TimedMusic } from './types'

/**
 * Timed music cut to its first `bars` bars, what an opening needs notated (a song's cover, its
 * page's first lines): every bar after goes, with the notes, chord symbols and pedal marks in them,
 * and a note held past the cut ends there. Notating the whole song to show two bars of it cost a
 * library of covers most of a second.
 */
export function openingOf(music: TimedMusic, bars: number): TimedMusic {
  const end = music.bars[bars]?.startTick
  if (end === undefined) return music
  return {
    ...music,
    bars: music.bars.slice(0, bars),
    notes: music.notes
      .filter((note) => note.startTick < end)
      .map((note) =>
        note.startTick + note.durationTicks > end
          ? { ...note, durationTicks: end - note.startTick }
          : note,
      ),
    chords: music.chords.filter((chord) => chord.startTick < end),
    ...(music.pedal ? { pedal: music.pedal.filter((event) => event.tick < end) } : {}),
  }
}
