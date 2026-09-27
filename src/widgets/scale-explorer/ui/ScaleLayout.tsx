import type { ReactNode } from 'react'

/** The Scales reference's two columns from a laptop's width: the choices, then the content, the keyboard across both on top. */
export function ScaleLayout({
  controls,
  keyboard,
  children,
}: {
  controls: ReactNode
  keyboard: ReactNode
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-6 lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-10">
      <div className="flex flex-col gap-4">{controls}</div>
      {keyboard}
      <div className="flex flex-col gap-6">{children}</div>
    </div>
  )
}
