// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest'

// Made beside the tests, so they live across them, as a worker keeps every mock and the page
// (`isolate: false`): the tests below run in order, each looking at what the one before left.
const heard = vi.fn()
const left: { section?: HTMLElement; bold?: Element | null } = {}
// The project this machine's environment names, if any, as the tests found it.
const project = import.meta.env.VITE_SUPABASE_URL

describe('test setup', () => {
  it('installs the jest-dom matchers', () => {
    const paragraph = document.createElement('p')
    document.body.append(paragraph)
    expect(paragraph).toBeInTheDocument()
  })

  it('answers prefers-color-scheme with light until a test says otherwise', () => {
    expect(window.matchMedia('(prefers-color-scheme: dark)').matches).toBe(false)
  })

  it('lets a test draw a page and call a mock with it', () => {
    left.section = document.createElement('section')
    left.section.innerHTML = '<p>A <b>bold</b> word</p>'
    document.body.append(left.section)
    left.bold = left.section.querySelector('b')
    heard(left.section)
    expect(heard).toHaveBeenCalledWith(left.section)
  })

  it('leaves no trace of it for the next: the mock’s calls forgotten, the page taken apart', () => {
    expect(heard).not.toHaveBeenCalled()
    expect(left.section?.isConnected).toBe(false)
    expect(left.section?.childNodes).toHaveLength(0)
    expect(left.bold?.parentNode).toBeNull()
  })

  it('lets a test name a project of its own', () => {
    vi.stubEnv('VITE_SUPABASE_URL', 'https://example.supabase.co')
    expect(import.meta.env.VITE_SUPABASE_URL).toBe('https://example.supabase.co')
  })

  it('gives the next test the machine’s environment back', () => {
    expect(import.meta.env.VITE_SUPABASE_URL).toBe(project)
  })
})
