import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCreateProgression } from '@/features/edit-original'
import { NewSheet } from '@/shared/ui'

/**
 * An editor's New progression (content as data, ADR 0116, round 25), the app's New sheet: its name;
 * Create progression makes it on the server unpublished and opens the progression editor on it, where
 * its chords and key are written.
 */
export function NewProgressionSheet({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { t } = useTranslation('practice')
  const create = useCreateProgression()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [creating, setCreating] = useState(false)
  const [failed, setFailed] = useState(false)
  const make = async () => {
    setCreating(true)
    setFailed(false)
    const made = await create(name)
    setCreating(false)
    if (!made.ok) return setFailed(true)
    onOpenChange(false)
    await navigate({
      to: '/practice/progressions/$progressionId/edit',
      params: { progressionId: made.value },
    })
  }
  return (
    <NewSheet
      open={open}
      onOpenChange={onOpenChange}
      title={t('progressions.edit.new')}
      nameLabel={t('progressions.edit.name')}
      name={name}
      onName={setName}
      hint={t('progressions.edit.newInfo')}
      createLabel={t('progressions.edit.create')}
      creatingLabel={t('progressions.edit.creating')}
      creating={creating}
      failed={failed ? t('progressions.edit.createFailed') : null}
      onCreate={() => void make()}
    />
  )
}
