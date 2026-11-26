import type { ReactNode } from 'react'

/**
 * A place's icon in the phone's tab bar, filled as the canvas's tab bar draws it (Apple's HIG, "Tab
 * bars": prefer filled symbols): 25px, a 1.6 stroke, `currentColor`; a cut drawn in the bar's ground.
 */
function TabIcon({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={className}
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  )
}

const CUT = 'var(--color-background)'

export function LearnTabIcon({ className }: { className?: string }) {
  return (
    <TabIcon className={className}>
      <path
        fill="currentColor"
        d="M21.42 10.92a1 1 0 0 0-.02-1.84L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.83l8.57 3.91a2 2 0 0 0 1.66 0z"
      />
      <path fill="none" d="M22 10v6" />
      <path
        fill="currentColor"
        stroke="none"
        d="M6 12.9V16a6 3 0 0 0 12 0v-3.1l-4.4 2a3.8 3.8 0 0 1-3.2 0z"
      />
    </TabIcon>
  )
}

export function SongsTabIcon({ className }: { className?: string }) {
  return (
    <TabIcon className={className}>
      <path fill="none" strokeWidth={2} d="M9 18V5l12-2v13" />
      <circle fill="currentColor" cx="6" cy="18" r="3" />
      <circle fill="currentColor" cx="18" cy="16" r="3" />
    </TabIcon>
  )
}

export function PracticeTabIcon({ className }: { className?: string }) {
  return (
    <TabIcon className={className}>
      <path
        fill="currentColor"
        d="M9.17 5.01a3 3 0 0 1 5.66 0L19.58 19.7A1 1 0 0 1 18.62 21H5.37a1 1 0 0 1-.95-1.3z"
      />
      <path fill="none" stroke={CUT} strokeWidth={1.7} d="M12 17 15.5 13.5" />
      <path fill="none" strokeWidth={1.7} d="m15.5 13.5 3.1-3.1" />
      <circle fill="currentColor" stroke="none" cx="20" cy="9" r="2.1" />
      <path fill="none" stroke={CUT} strokeWidth={1.6} d="M8.2 18h7.6" />
    </TabIcon>
  )
}

export function ProfileTabIcon({ className }: { className?: string }) {
  return (
    <TabIcon className={className}>
      <circle fill="currentColor" stroke="none" cx="12" cy="8" r="5" />
      <path fill="currentColor" stroke="none" d="M3.5 21a8.5 7.5 0 0 1 17 0z" />
    </TabIcon>
  )
}
