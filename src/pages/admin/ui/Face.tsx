const initial = (name: string) => (Array.from(name)[0] ?? '?').toLocaleUpperCase()

/** A person's initial on the sand, as the Admin board's faces: 32 in a group's stack, 36 in a row. */
export function Face({ name, size }: { name: string; size: 'stack' | 'row' }) {
  return (
    <span
      aria-hidden
      className={
        size === 'stack'
          ? '-me-1.5 grid size-8 shrink-0 place-items-center rounded-pill bg-paint-sand text-sm ring-2 ring-card'
          : 'grid size-9 shrink-0 place-items-center rounded-pill bg-paint-sand text-[0.9375rem]'
      }
    >
      {initial(name)}
    </span>
  )
}
