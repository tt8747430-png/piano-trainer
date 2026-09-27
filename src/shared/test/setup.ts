import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'
import { i18n } from '@/shared/i18n'
import { stubFonts } from './fonts'
import { stubMatchMedia } from './match-media'
import { stubServiceWorker } from './pwa-register'

beforeEach(() => {
  stubMatchMedia({ dark: false })
  stubServiceWorker({ waiting: false })
  // Tests in the node environment have no document to give fonts to.
  if (typeof document !== 'undefined') stubFonts()
})

// `globals: false` means Testing Library cannot register its own cleanup.
afterEach(async () => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  await i18n.changeLanguage('en')
  // Tests in the node environment (`@vitest-environment node`) have no DOM to reset.
  if (typeof document === 'undefined') return
  localStorage.clear()
  delete document.documentElement.dataset.theme
  document.documentElement.lang = 'en'
})
