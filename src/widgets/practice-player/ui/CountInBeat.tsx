import { useTranslation } from 'react-i18next'

/**
 * The count-in's beat, large over the music while Listen counts its bar in (ADR 0105, Chordify's):
 * the beats left, 4 3 2 1, each as its click sounds; nothing once the music plays. A screen reader
 * hears each as Count-in and its number.
 */
export function CountInBeat({ count }: { count: number | null }) {
  const { t } = useTranslation('player')
  if (count === null) return null
  return (
    <div role="status" className="pointer-events-none fixed inset-0 z-30 grid place-items-center">
      <span className="sr-only">{t('counting', { count })}</span>
      <span
        key={count}
        aria-hidden
        className="text-[min(40vw,40vh,12rem)] leading-none font-bold text-foreground/85 tabular-nums drop-shadow-sm duration-150 motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-75"
      >
        {count}
      </span>
    </div>
  )
}
