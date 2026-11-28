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
 * How many letters wide a name sets, its raised part at its 0.6 (Cm⁷ is 2.6): what a tile reads to
 * set the name small enough to fit whole (`chord-fit`).
 */
export function symbolLetters(text: string) {
  const parts = PARTS.exec(text)
  if (!parts) return text.length
  const [, root = '', raised = '', bass = ''] = parts
  return root.length + raised.length * 0.6 + bass.length
}
