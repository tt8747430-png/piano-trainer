import { describe, expect, it } from 'vitest'
import { DELETE_CLOSED, deleteAccountMachine, type DeleteEvent } from './delete-account-machine'

const run = (...events: DeleteEvent[]) => events.reduce(deleteAccountMachine, DELETE_CLOSED)

describe('deleteAccountMachine', () => {
  it('confirm → deleting → done', () => {
    expect(run({ type: 'open' })).toEqual({ kind: 'confirm' })
    expect(run({ type: 'open' }, { type: 'confirm', online: true })).toEqual({ kind: 'deleting' })
    expect(
      run(
        { type: 'open' },
        { type: 'confirm', online: true },
        { type: 'deleted', purgeAfter: '2026-12-04' },
      ),
    ).toEqual({ kind: 'done', purgeAfter: '2026-12-04' })
  })

  it('confirm → deleting → failed, and again', () => {
    const failed = run(
      { type: 'open' },
      { type: 'confirm', online: true },
      { type: 'refused', reason: 'failed' },
    )
    expect(failed).toEqual({ kind: 'failed' })
    expect(deleteAccountMachine(failed, { type: 'confirm', online: true })).toEqual({
      kind: 'deleting',
    })
  })

  it('offline before asking, or when the server cannot be reached', () => {
    expect(run({ type: 'open' }, { type: 'confirm', online: false })).toEqual({ kind: 'offline' })
    expect(
      run(
        { type: 'open' },
        { type: 'confirm', online: true },
        { type: 'refused', reason: 'offline' },
      ),
    ).toEqual({ kind: 'offline' })
  })

  it('cancels while asked, never while deleting', () => {
    expect(run({ type: 'open' }, { type: 'cancel' })).toEqual(DELETE_CLOSED)
    expect(run({ type: 'open' }, { type: 'confirm', online: true }, { type: 'cancel' })).toEqual({
      kind: 'deleting',
    })
    // An answer for no request changes nothing.
    expect(run({ type: 'deleted', purgeAfter: 'x' })).toEqual(DELETE_CLOSED)
  })
})
