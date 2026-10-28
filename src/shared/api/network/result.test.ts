import { describe, expect, it } from 'vitest'
import { failureOf, netResult } from './result'

const online = { online: () => true }
const offline = { online: () => false }

describe('netResult', () => {
  it('gives the value of a call that answers', async () => {
    expect(await netResult(async () => 42, online)).toEqual({ ok: true, value: 42 })
  })

  it('says offline before any request when the device has no connection', async () => {
    let asked = false
    const result = await netResult(async () => {
      asked = true
      return 1
    }, offline)
    expect(result).toEqual({ ok: false, reason: 'offline' })
    expect(asked).toBe(false)
  })

  it('reads a refusal from the server, a 4xx, as refused with its message', async () => {
    const refusal = Object.assign(new Error('Invalid login credentials'), { status: 400 })
    expect(
      await netResult(async () => {
        throw refusal
      }, online),
    ).toEqual({ ok: false, reason: 'refused', detail: 'Invalid login credentials' })
  })

  it('reads anything else thrown as failed', async () => {
    expect(
      await netResult(async () => {
        throw Object.assign(new Error('Internal error'), { status: 500 })
      }, online),
    ).toEqual({ ok: false, reason: 'failed', detail: 'Internal error' })
  })

  it('reads a request that never reached the server as offline when the connection went meanwhile', async () => {
    let connected = true
    const result = await netResult(
      async () => {
        connected = false
        throw new TypeError('Failed to fetch')
      },
      { online: () => connected },
    )
    expect(result).toEqual({ ok: false, reason: 'offline' })
  })
})

describe('failureOf', () => {
  it('reads a status-0 error, a fetch that never got an answer, as failed while online', () => {
    expect(failureOf(Object.assign(new Error('fetch failed'), { status: 0 }), () => true)).toEqual({
      ok: false,
      reason: 'failed',
      detail: 'fetch failed',
    })
  })

  it('reads a value that is no error at all as failed with no detail', () => {
    expect(failureOf('nope', () => true)).toEqual({ ok: false, reason: 'failed' })
  })
})
