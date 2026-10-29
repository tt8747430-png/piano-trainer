import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { ButtonLink } from '@/shared/ui'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/primitives/alert-dialog'
import { Button } from '@/shared/ui/primitives/button'

/**
 * Publishing asked first: signed in, what publishing means and the rights it takes (only music the
 * learner wrote or may share); signed out, Sign in.
 */
export function PublishDialog({
  open,
  onOpenChange,
  title,
  authorName,
  signedIn,
  busy,
  onPublish,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  authorName: string
  signedIn: boolean
  busy: boolean
  onPublish: () => void
}) {
  const { t } = useTranslation('songs')
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {signedIn ? t('public.publishTitle', { title }) : t('public.publish')}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {signedIn ? t('public.publishBody', { name: authorName }) : t('public.publishSignIn')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('public.cancel')}</AlertDialogCancel>
          {signedIn ? (
            <Button disabled={busy} onClick={onPublish}>
              {t('public.publishConfirm')}
            </Button>
          ) : (
            <ButtonLink render={<Link to="/account/sign-in" />}>{t('public.signIn')}</ButtonLink>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
