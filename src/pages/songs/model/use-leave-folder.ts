import { useNavigate } from '@tanstack/react-router'
import { useForgetScreens } from '@/shared/lib'

/**
 * Out of a folder that has left the library (archived or deleted): its screens forgotten for Back (its
 * page and its Settings), then to where it stood, the folder above it or Home.
 */
export function useLeaveFolder() {
  const navigate = useNavigate()
  const forget = useForgetScreens()
  return (folderId: string, above: { readonly id: string } | undefined) => {
    forget(`/songs/folders/${folderId}`)
    return above
      ? navigate({ to: '/songs/folders/$folderId', params: { folderId: above.id }, replace: true })
      : navigate({ to: '/songs', replace: true })
  }
}
