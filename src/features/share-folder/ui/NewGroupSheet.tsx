import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { GROUP_NAME_MAX, type LearnerGroup } from '@/shared/api/groups'
import { useGroups } from '@/shared/lib/groups'
import { NameField, Sheet, SheetContent } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'

/**
 * New group (R30 S6): its name, one Create at the foot. Made on the server (a group is shared), so it
 * waits for the answer and says what went wrong.
 */
export function NewGroupSheet({
  open,
  onOpenChange,
  onMade,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onMade: (group: LearnerGroup) => void
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {open ? <NewGroupForm onMade={onMade} /> : null}
    </Sheet>
  )
}

function NewGroupForm({ onMade }: { onMade: (group: LearnerGroup) => void }) {
  const { t } = useTranslation('songs')
  const port = useGroups()
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)
  const [problem, setProblem] = useState<string | null>(null)
  const typed = name.trim()
  const submit = async (event?: FormEvent) => {
    event?.preventDefault()
    if (!typed || busy) return
    setBusy(true)
    const made = await port.create(typed)
    setBusy(false)
    if (made.ok) onMade(made.value)
    else setProblem(t(made.reason === 'offline' ? 'groups.offline' : 'groups.failed'))
  }
  return (
    <SheetContent
      title={t('groups.new')}
      footer={
        <Button
          size="lg"
          className="w-full"
          disabled={!typed || busy}
          onClick={() => void submit()}
        >
          {t('groups.create')}
        </Button>
      }
    >
      <form onSubmit={(event) => void submit(event)} className="flex flex-col gap-4">
        <NameField
          label={t('groups.name')}
          value={name}
          placeholder={t('groups.namePlaceholder')}
          enterKeyHint="done"
          maxLength={GROUP_NAME_MAX}
          onChange={(event) => setName(event.target.value)}
        />
        {problem ? (
          <p role="alert" className="text-sm text-destructive">
            {problem}
          </p>
        ) : null}
      </form>
    </SheetContent>
  )
}
