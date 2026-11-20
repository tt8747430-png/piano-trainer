import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { GROUP_NAME_MAX, type LearnerGroup } from '@/shared/api/groups'
import { useGroups } from '@/shared/lib/groups'
import { MakeSheet, NameField, Problem } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'

/**
 * New group (R30 S6, the canvas's NEWNAME): its name, Cancel in its header, one Create at the foot; a
 * centred dialog on a laptop (`MakeSheet`). Made on the server (a group is shared), so it waits for
 * the answer and says what went wrong. Each opening starts empty.
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
  return <NewGroupForm key={String(open)} open={open} onOpenChange={onOpenChange} onMade={onMade} />
}

function NewGroupForm({
  open,
  onOpenChange,
  onMade,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onMade: (group: LearnerGroup) => void
}) {
  const { t } = useTranslation('songs')
  const port = useGroups()
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)
  const [problem, setProblem] = useState<string | null>(null)
  const typed = name.trim()
  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!typed || busy) return
    setBusy(true)
    const made = await port.create(typed)
    setBusy(false)
    if (made.ok) onMade(made.value)
    else setProblem(t(made.reason === 'offline' ? 'groups.offline' : 'groups.failed'))
  }
  return (
    <MakeSheet
      open={open}
      onOpenChange={onOpenChange}
      title={t('groups.new')}
      footer={
        <Button
          type="submit"
          form="new-group"
          size="lg"
          className="w-full"
          disabled={!typed || busy}
        >
          {t('groups.create')}
        </Button>
      }
    >
      <form id="new-group" onSubmit={(event) => void submit(event)} className="flex flex-col gap-4">
        <NameField
          label={t('groups.name')}
          autoFocus
          value={name}
          placeholder={t('groups.namePlaceholder')}
          enterKeyHint="done"
          maxLength={GROUP_NAME_MAX}
          onChange={(event) => setName(event.target.value)}
        />
        {problem ? <Problem>{problem}</Problem> : null}
      </form>
    </MakeSheet>
  )
}
