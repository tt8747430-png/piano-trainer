/** A chord symbol's parts as a lead sheet sets them: its root (and minor's m), its extension, its bass. */
const PARTS = /^([A-G][♭♯]?m?(?!aj))([^/]*)(\/.+)?$/

/**
 * A chord's name as Musicca and a lead sheet set it (canvas 173): its root and minor's m on the line,
 * the rest of its quality raised and smaller (Cm⁷, B♭sus2, F⁷/A), its bass after the slash on the line.
 * A numeral or a Nashville number is set as it is. The Chord player's tiles and the Player's Diagrams
 * set their names with it.
 */
export function LeadSymbol({ text }: { text: string }) {
  const parts = PARTS.exec(text)
  if (!parts) return <>{text}</>
  const [, root, raised, bass] = parts
  return (
    <>
      {root}
      {raised ? (
        <span className="relative -top-[0.55em] ml-px text-[max(12px,0.6em)]">{raised}</span>
      ) : null}
      {bass}
    </>
  )
}

/**
 * A name's letters as a tile sets them (`chord-fit`): those on the line (its root, minor's m and bass)
 * and those raised (Cm⁷ is 2 and 1), the raised set at 0.6 of the name and never under 12px.
 */
export function symbolLetters(text: string): { readonly line: number; readonly raised: number } {
  const parts = PARTS.exec(text)
  if (!parts) return { line: text.length, raised: 0 }
  const [, root = '', raised = '', bass = ''] = parts
  return { line: root.length + bass.length, raised: raised.length }
}
