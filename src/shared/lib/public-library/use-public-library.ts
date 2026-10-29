import { use } from 'react'
import type { PublicLibrary } from '@/shared/api/public-library'
import { Context } from './context'

export function usePublicLibrary(): PublicLibrary {
  const library = use(Context)
  if (!library) throw new Error('usePublicLibrary needs a PublicLibraryProvider')
  return library
}
