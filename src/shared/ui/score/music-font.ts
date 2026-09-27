/** The music font VexFlow engraves with (score.css's `@font-face`), and its face for text: fingering. */
export const MUSIC_FONT = 'Bravura'
export const TEXT_FONT = 'Onest Variable'

/**
 * Both faces, loaded: VexFlow measures every glyph with the canvas as it engraves, so it must not
 * engrave before them. Once loaded the browser answers at once, so nothing is kept here.
 */
export async function loadMusicFonts(): Promise<void> {
  const [music] = await Promise.all([
    document.fonts.load(`30px ${MUSIC_FONT}`),
    document.fonts.load(`12px "${TEXT_FONT}"`),
  ])
  if (music.length === 0) throw new Error(`${MUSIC_FONT} did not load`)
}
