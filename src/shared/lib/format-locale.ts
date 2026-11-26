/**
 * The locale dates and times are written in: the interface's English is British (Practise, Favourites),
 * so its dates are too ("4 November 2026", 14:20), as every board writes them; other languages as they are.
 */
export const formatLocale = (locale: string): string => (locale === 'en' ? 'en-GB' : locale)
