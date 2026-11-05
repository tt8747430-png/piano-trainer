import { useNavigate } from '@tanstack/react-router'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { inviteCodeOf } from '@/features/share-folder'
import { NameField, Sheet, SheetContent } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'

/**
 * Join with a link (R32-C): the invite link someone sent, pasted whole or as its code, and Open,
 * which opens the invite's page (its group, Join). A text that is no invite link says so.
 */
export function JoinLinkSheet({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { t } = useTranslation('songs')
  const navigate = useNavigate()
  const field = useRef<HTMLInputElement>(null)
  const [link, setLink] = useState('')
  const [wrong, setWrong] = useState(false)
  const openInvite = () => {
    const code = inviteCodeOf(link)
    if (!code) return setWrong(true)
    onOpenChange(false)
    setLink('')
    void navigate({ to: '/songs/groups/join', search: { code } })
  }
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        title={t('groups.joinLink')}
        initialFocus={() => field.current ?? true}
        footer={
          <Button size="lg" className="w-full" disabled={link.trim() === ''} onClick={openInvite}>
            {t('groups.joinLinkOpen')}
          </Button>
        }
      >
        <form
          onSubmit={(event) => {
            event.preventDefault()
            openInvite()
          }}
          className="flex flex-col gap-2"
        >
          <NameField
            ref={field}
            label={t('groups.joinLinkField')}
            placeholder={t('groups.joinLinkPlaceholder')}
            value={link}
            inputMode="url"
            enterKeyHint="go"
            aria-invalid={wrong}
            onChange={(event) => {
              setLink(event.target.value)
              setWrong(false)
            }}
          />
          {wrong ? (
            <p role="alert" className="text-sm text-destructive">
              {t('groups.joinLinkWrong')}
            </p>
          ) : null}
        </form>
      </SheetContent>
    </Sheet>
  )
}
