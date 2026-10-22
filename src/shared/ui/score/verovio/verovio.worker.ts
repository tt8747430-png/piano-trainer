import { engraveMei, loadToolkit, type EngraveOptions } from './toolkit'

type Request = { id: number; mei: string; options: EngraveOptions } | { warm: true }

/**
 * The engraver off the page's thread: a score's MEI in, its pages' SVG out, one at a time; asked to
 * warm, it loads Verovio and says nothing.
 */
self.onmessage = async (event: MessageEvent<Request>) => {
  if ('warm' in event.data) return void loadToolkit()
  const { id, mei, options } = event.data
  try {
    self.postMessage({ id, pages: await engraveMei(mei, options) })
  } catch (error) {
    self.postMessage({ id, error: String(error) })
  }
}
