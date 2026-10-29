/**
 * A name as text: without the NUL bytes and control characters a file may pad it with (a MIDI track's
 * name), which nobody typed and the database's JSON cannot hold, and without the spaces round it.
 */
export const plainText = (text: string): string =>
  // eslint-disable-next-line no-control-regex -- the control characters are what it removes
  text.replace(/[\u0000-\u001f\u007f]/g, '').trim()
