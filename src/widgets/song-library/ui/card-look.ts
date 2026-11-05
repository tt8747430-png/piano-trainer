import { createContext, use, type CSSProperties } from 'react'
import { DEFAULT_CARD_LOOK, type CardLook } from '@/entities/library'
import { styleVars } from '@/shared/lib/style'

const CardLookContext = createContext<CardLook>(DEFAULT_CARD_LOOK)

/** The look of the place a row is drawn in (R29 B9): Default where the place has none. */
export const CardLookProvider = CardLookContext.Provider

/** What a row of this place shows (key, chords, progress). */
export const useCardLook = () => use(CardLookContext)

/**
 * A list's attributes for a place's look: its custom properties, spacing and layout, read by the
 * theme's `[data-card-look]` rules; nothing for a place that keeps the default.
 */
export function cardLookProps(look: CardLook | undefined): {
  'data-card-look'?: ''
  'data-spacing'?: string
  'data-layout'?: string
  style?: CSSProperties
} {
  if (!look) return {}
  return {
    'data-card-look': '',
    'data-spacing': look.style.padding,
    'data-layout': look.style.layout,
    style: styleVars(look.style) as CSSProperties,
  }
}
