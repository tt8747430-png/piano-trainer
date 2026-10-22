import { engraveMei, type EngraveOptions } from './toolkit'

/** The engraver off the page's thread: a score's MEI in, its pages' SVG out, one at a time. */
self.onmessage = async (
  event: MessageEvent<{ id: number; mei: string; options: EngraveOptions }>,
) => {
  const { id, mei, options } = event.data
  try {
    self.postMessage({ id, pages: await engraveMei(mei, options) })
  } catch (error) {
    self.postMessage({ id, error: String(error) })
  }
}
