/**
 * How long a file's address is kept after its save begins: a browser may read it after the click
 * returns (Safari does), so it is let go well after, as FileSaver.js does.
 */
const KEEP_ADDRESS_MS = 40_000

/** Saves bytes as a file named `name`, as the browser saves a download. */
export function downloadFile(bytes: Uint8Array<ArrayBuffer>, name: string, type: string): void {
  const address = URL.createObjectURL(new Blob([bytes], { type }))
  const link = document.createElement('a')
  link.href = address
  link.download = name
  document.body.append(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(address), KEEP_ADDRESS_MS)
}
