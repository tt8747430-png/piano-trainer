/** A chord symbol's parts as a lead sheet sets them: its root (and minor's m), its extension, its bass. */
const PARTS = /^([A-G][♭♯]?m?(?!aj))([^/]*)(\/.+)?$/

/**
 * A chord's name as Musicca and a lead sheet set it (canvas 173): its root and minor's m on the line,
 * the rest of its quality raised and smaller (Cm⁷, B♭sus2, F⁷/A), its bass after the slash on the line.
 * A numeral or a Nashville number is set as it is.
 */
export function ChordName({ text }: { text: string }) {
  const parts = PARTS.exec(text)
  if (!parts) return <>{text}</>
  const [, root, raised, bass] = parts
  return (
    <>
      {root}
      {raised ? <span className="relative -top-[0.55em] ml-px text-[0.58em]">{raised}</span> : null}
      {bass}
    </>
  )
}
