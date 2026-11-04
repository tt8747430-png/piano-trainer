import { useTranslation } from 'react-i18next'
import { localText, useLocale, type LocalText } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import type { BlockStyle } from '@/shared/lib/style'
import { StyledBlock } from './LessonBlock'

/** A section's heading, on a card of its own style where it has one (R29 B9). */
export function SectionHeading({ text, style }: { text: LocalText; style?: BlockStyle }) {
  const locale = useLocale()
  const heading = <h2 className="text-2xl text-balance">{localText(text, locale)}</h2>
  return style ? <StyledBlock style={style}>{heading}</StyledBlock> : heading
}

/**
 * A section's takeaway, its one sentence on lilac; on a card of its own style where it has one
 * (R29 B9), its label then in the card's own ink.
 */
export function Takeaway({ text, style }: { text: LocalText; style?: BlockStyle }) {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const words = (
    <div className="flex flex-col gap-1">
      <span
        aria-hidden
        className={cn('text-sm font-semibold', style ? 'opacity-80' : 'text-on-paint-lilac')}
      >
        {t('takeaway')}
      </span>
      <p className="font-display text-xl font-semibold text-balance">{localText(text, locale)}</p>
    </div>
  )
  return (
    <aside
      aria-label={t('takeaway')}
      className={style ? undefined : 'rounded-card bg-paint-lilac p-4'}
    >
      {style ? <StyledBlock style={style}>{words}</StyledBlock> : words}
    </aside>
  )
}
