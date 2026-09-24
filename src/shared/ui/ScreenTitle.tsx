import type { ReactNode } from 'react'

export function ScreenTitle({ children }: { children: ReactNode }) {
  return <h1 className="mb-4 text-2xl font-extrabold tracking-tight text-balance">{children}</h1>
}
