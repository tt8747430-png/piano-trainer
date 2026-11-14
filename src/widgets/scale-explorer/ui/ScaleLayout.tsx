import type { ReactNode } from 'react'

/**
 * A view of a scale, as the Chords page reads (canvas 174): the keys at the top, edge to edge; then,
 * 820 wide at most on a laptop, its name, line and views; its music; its choices where the view has
 * them; then its sections. The view's floating bar is its own.
 */
export function ScaleLayout({
  keyboard,
  heading,
  music,
  fields,
  bar,
  children,
}: {
  keyboard: ReactNode
  heading: ReactNode
  /** The view's music, before its choices: the score first (R34). */
  music?: ReactNode
  fields?: ReactNode
  /** The view's floating bar. */
  bar?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-4">
      {keyboard}
      <div className="flex flex-col gap-4 md:mx-auto md:w-full md:max-w-[51.25rem]">
        {heading}
        {music}
        {fields ? <div className="grid-fields gap-x-10 gap-y-5">{fields}</div> : null}
        {children}
      </div>
      {bar}
    </div>
  )
}
