import { CHORD_SYMBOL_FONT } from './chord-symbols'

/** The music font VexFlow engraves with (score.css's `@font-face`), and its face for text: fingering. */
export const MUSIC_FONT = 'Bravura'
export const TEXT_FONT = 'Onest Variable'

/**
 * The faces engraving measures, loaded: VexFlow measures every glyph with the canvas as it engraves,
 * and the engraver measures each chord symbol to leave it room, so neither may start before them.
 * Once loaded the browser answers at once, so nothing is kept here.
 */
export async function loadMusicFonts(): Promise<void> {
  const [music] = await Promise.all([
    document.fonts.load(`30px ${MUSIC_FONT}`),
    document.fonts.load(`12px "${TEXT_FONT}"`),
    document.fonts.load(CHORD_SYMBOL_FONT),
  ])
  if (music.length === 0) throw new Error(`${MUSIC_FONT} did not load`)
}
