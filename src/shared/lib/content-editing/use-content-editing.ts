import { use } from 'react'
import type { ContentEditingPort } from '@/shared/api/content-editing'
import { Context } from './context'

export function useContentEditing(): ContentEditingPort {
  const editing = use(Context)
  if (!editing) throw new Error('useContentEditing needs a ContentEditingProvider')
  return editing
}
