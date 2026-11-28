import { UserRound } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useChordSheetsStoreApi, type SavedChordSheet } from '@/entities/chord-sheet'
import { shareLink } from '@/shared/lib'
import { useAccount } from '@/shared/lib/account'
import { useChordShare } from '@/shared/lib/chord-share'
import { ButtonLink, Problem, Said, say, Segmented, Sheet, SheetContent } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { setSheetAccess, shareSheet } from '../model/online-sheet'
import { onlineSheetPath } from '../model/online-sheet-path'

type Access = 'view' | 'edit'

/**
 * Share (the board's CP_SHARE): People with the link, View only or Can edit (set at once where it is
 * shared already), its head over it, then Copy link 24 under it, which shares it. Signed out, it
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
    <Sheet at={{ width: 'w-115' }} open={open} onOpenChange={onOpenChange}>
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
    // Shared already: only its access changes; its chords online are everyone's, never overwritten here.
    const shared = sheet.online
      ? await setSheetAccess(port, store, sheet.id, chosen === 'edit')
      : await shareSheet(port, store, sheet.id, chosen === 'edit')
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
    const id = sheet.online?.id ?? (await share(access))
    if (!id) return
    const done = await shareLink({ title: sheet.name, path: onlineSheetPath(id) })
    if (done === 'copied') say(t('chordPlayer.shared'))
    if (done === 'failed') return setProblem(t('chordPlayer.shareFailed'))
    onDone()
  }
  const guest = ready && !account && !theirs

  return (
    <SheetContent title={t('chordPlayer.online.share')}>
      {guest ? (
        <Said
          icon={UserRound}
          title={t('chordPlayer.online.guestTitle')}
          description={t('chordPlayer.online.guestLine')}
          primary
          action={
            <ButtonLink render={<Link to="/account/sign-in" />}>
              {t('chordPlayer.online.signIn')}
            </ButtonLink>
          }
        />
      ) : (
        <div className="flex flex-col gap-6">
          {theirs ? null : (
            <section aria-label={t('chordPlayer.online.people')} className="flex flex-col gap-2">
              <h3 className="font-sans text-[0.9375rem]/[normal] font-semibold">
                {t('chordPlayer.online.people')}
              </h3>
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
            </section>
          )}
          <div className="flex flex-col gap-2">
            {problem ? <Problem>{problem}</Problem> : null}
            <Button
              size="lg"
              className="w-full"
              disabled={busy || !ready}
              onClick={() => void copy()}
            >
              {t('chordPlayer.online.copy')}
            </Button>
          </div>
        </div>
      )}
    </SheetContent>
  )
}
