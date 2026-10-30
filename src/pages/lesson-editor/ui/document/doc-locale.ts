import { createContext } from 'react'
import type { Locale } from '@/shared/i18n'

/** The language the document is written in: an example's words are written in it. */
export const DocLocale = createContext<Locale>('en')
