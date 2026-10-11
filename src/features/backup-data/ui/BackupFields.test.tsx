import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderWithSettings } from '@/app/testing/render-with-settings'
import { createMemoryStorage } from '@/shared/lib'
import { BackupFields } from './BackupFields'

const SETTINGS = { state: { theme: 'dark' }, version: 1 }

const fileInput = () => {
  const input = document.querySelector<HTMLInputElement>('input[type="file"]')
  if (!input) throw new Error('no file input')
  return input
}

const backupFile = (content: unknown) =>
  new File([JSON.stringify(content)], 'backup.json', { type: 'application/json' })

describe('BackupFields', () => {
  it('saves every store as one file', async () => {
    const user = userEvent.setup()
    const storage = createMemoryStorage()
    storage.setItem('pt-settings', JSON.stringify(SETTINGS))
    const made = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:backup')
    renderWithSettings(<BackupFields storage={storage} />)
    await user.click(screen.getByRole('button', { name: 'Save a backup' }))
    const blob = made.mock.calls[0]?.[0]
    expect(blob).toBeInstanceOf(Blob)
    expect(JSON.parse(await (blob as Blob).text())).toMatchObject({
      kind: 'piano-trainer-backup',
      saves: { 'pt-settings': SETTINGS },
    })
  })

  it('restores a backup once the learner says so, then opens the app again', async () => {
    const user = userEvent.setup()
    const storage = createMemoryStorage()
    const onRestored = vi.fn()
    renderWithSettings(<BackupFields storage={storage} onRestored={onRestored} />)
    await user.upload(
      fileInput(),
      backupFile({
        kind: 'piano-trainer-backup',
        format: 1,
        made: '2026-10-11T09:30:00Z',
        saves: { 'pt-settings': SETTINGS },
      }),
    )
    expect(await screen.findByRole('alertdialog')).toHaveTextContent('October 11, 2026')
    await user.click(screen.getByRole('button', { name: 'Restore' }))
    expect(JSON.parse(storage.getItem('pt-settings') ?? 'null')).toEqual(SETTINGS)
    expect(onRestored).toHaveBeenCalledOnce()
  })

  it('says so when the file is not a backup, and changes nothing', async () => {
    const user = userEvent.setup()
    const storage = createMemoryStorage()
    storage.setItem('pt-settings', JSON.stringify(SETTINGS))
    renderWithSettings(<BackupFields storage={storage} onRestored={vi.fn()} />)
    await user.upload(fileInput(), backupFile({ songs: [] }))
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'This file is not a Piano Trainer backup.',
    )
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    expect(JSON.parse(storage.getItem('pt-settings') ?? 'null')).toEqual(SETTINGS)
  })

  it('warns before restoring a save of another version, which starts afresh', async () => {
    const user = userEvent.setup()
    renderWithSettings(<BackupFields storage={createMemoryStorage()} onRestored={vi.fn()} />)
    await user.upload(
      fileInput(),
      backupFile({
        kind: 'piano-trainer-backup',
        format: 1,
        made: '2026-10-11T09:30:00Z',
        saves: { 'pt-settings': { ...SETTINGS, version: 99 } },
      }),
    )
    expect(await screen.findByRole('alertdialog')).toHaveTextContent(
      'Some of it was saved by another version of the app',
    )
  })

  it('puts everything back and says so when the device has no room for the backup', async () => {
    const user = userEvent.setup()
    const storage = createMemoryStorage()
    storage.setItem('pt-settings', JSON.stringify(SETTINGS))
    const full: Storage = {
      ...storage,
      getItem: (key) => storage.getItem(key),
      removeItem: (key) => storage.removeItem(key),
      setItem: (key, value) => (key === 'pt-takes' ? undefined : storage.setItem(key, value)),
    }
    const onRestored = vi.fn()
    renderWithSettings(<BackupFields storage={full} onRestored={onRestored} />)
    await user.upload(
      fileInput(),
      backupFile({
        kind: 'piano-trainer-backup',
        format: 1,
        saves: {
          'pt-settings': { state: { theme: 'light' }, version: 1 },
          'pt-takes': { state: { takes: [] }, version: 2 },
        },
      }),
    )
    await user.click(await screen.findByRole('button', { name: 'Restore' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('this device has no room for it')
    expect(JSON.parse(storage.getItem('pt-settings') ?? 'null')).toEqual(SETTINGS)
    expect(onRestored).not.toHaveBeenCalled()
  })
})
