import type { ReactNode } from 'react'

/**
 * The chord's head card (R29-P6): what it is, what notes, how it is written, as one card with no
 * empty band in it. From 48rem two columns (equal; 5 to 7 from 64rem), the name, its other spellings
 * and the choices at the left, the staff filling the right; on a phone one column, the staff the
 * column's width between the name and the choices. Its staff column keeps its height whatever the
 * chord, so nothing under it jumps.
 */
export function ChordHead({
  name,
  staff,
  choices,
}: {
  name: ReactNode
  staff: ReactNode
  choices: ReactNode
}) {
  return (
    <section className="card grid gap-x-8 gap-y-5 p-4 sm:p-5 md:grid-cols-2 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <div className="flex min-w-0 flex-col gap-3">{name}</div>
      <div className="flex min-h-40 min-w-0 items-center justify-center md:row-span-2">{staff}</div>
      <div className="flex min-w-0 flex-col gap-5 self-end">{choices}</div>
    </section>
  )
}
