import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useChordSheetsStoreApi, type SavedChordSheet } from '@/entities/chord-sheet'
import { shareLink } from '@/shared/lib'
import { useAccount } from '@/shared/lib/account'
import { useChordShare } from '@/shared/lib/chord-share'
import { ButtonLink, Segmented, Sheet, SheetContent, say } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/shared/ui/primitives/empty'
import { shareSheet } from '../model/online-sheet'

type Access = 'view' | 'edit'

/** A shared sheet's link, opened in the Chord player. */
export const onlineSheetPath = (id: string) => `/practice/chord-player?link=${id}`

/**
 * Share (R39-10, canvas v173's CP_SHARE): one line on what sharing does, People with the link View only
 * or Can edit (set at once where it is shared already), and Copy link, which shares it. Signed out, it
 * says sharing needs an account; a sheet opened from someone's link copies that link.
 */
export function ShareChordSheet({
  open,
  onOpenChange,
  sheet,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  sheet: SavedChordSheet
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {open ? <ShareForm sheet={sheet} onDone={() => onOpenChange(false)} /> : null}
    </Sheet>
  )
}

function ShareForm({ sheet, onDone }: { sheet: SavedChordSheet; onDone: () => void }) {
  const { t } = useTranslation('practice')
  const port = useChordShare()
  const store = useChordSheetsStoreApi()
  const { account, ready } = useAccount()
  const theirs = sheet.online !== null && !sheet.online.mine
  const [access, setAccess] = useState<Access>(sheet.online?.canEdit ? 'edit' : 'view')
  const [busy, setBusy] = useState(false)
  const [problem, setProblem] = useState<string | null>(null)

  const share = async (chosen: Access) => {
    setBusy(true)
    setProblem(null)
    const shared = await shareSheet(port, store, sheet.id, chosen === 'edit')
    setBusy(false)
    if (!shared.ok) {
      setProblem(
        t(shared.reason === 'offline' ? 'chordPlayer.online.offline' : 'chordPlayer.online.failed'),
      )
      return null
    }
    return shared.value
  }
  const copy = async () => {
    const id = theirs ? (sheet.online?.id ?? null) : await share(access)
    if (!id) return
    const done = await shareLink({ title: sheet.name, path: onlineSheetPath(id) })
    if (done === 'copied') say(t('chordPlayer.shared'))
    if (done === 'failed') return setProblem(t('chordPlayer.shareFailed'))
    onDone()
  }
  const guest = ready && !account && !theirs

  return (
    <SheetContent
      title={t('chordPlayer.online.share')}
      footer={
        guest ? null : (
          <div className="flex flex-col gap-2">
            {problem ? (
              <p role="alert" className="text-pretty text-sm text-destructive">
                {problem}
              </p>
            ) : null}
            <Button
              size="lg"
              className="h-[50px] w-full"
              disabled={busy || !ready}
              onClick={() => void copy()}
            >
              {t('chordPlayer.online.copy')}
            </Button>
          </div>
        )
      }
    >
      {guest ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>{t('chordPlayer.online.guestTitle')}</EmptyTitle>
            <EmptyDescription>{t('chordPlayer.online.guestLine')}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <ButtonLink render={<Link to="/account/sign-in" />}>
              {t('chordPlayer.online.signIn')}
            </ButtonLink>
          </EmptyContent>
        </Empty>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="mx-1 text-pretty text-[15px] text-muted-foreground">
            {t('chordPlayer.online.line')}
          </p>
          {theirs ? null : (
            <Segmented<Access>
              label={t('chordPlayer.online.people')}
              value={access}
              options={[
                { value: 'view', label: t('chordPlayer.online.viewOnly') },
                { value: 'edit', label: t('chordPlayer.online.canEdit') },
              ]}
              onChange={(next) => {
                setAccess(next)
                // Shared already: the new access holds at once.
                if (sheet.online) void share(next)
              }}
            />
          )}
        </div>
      )}
    </SheetContent>
  )
}
