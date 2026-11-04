/** A profile picture's side, in pixels, and the most it weighs. */
export const AVATAR_SIDE = 256
export const AVATAR_BYTES = 200 * 1024

/** The square at the middle of a picture `width` by `height`: what a profile picture keeps. */
export function centreSquare(
  width: number,
  height: number,
): { x: number; y: number; side: number } {
  const side = Math.min(width, height)
  return { x: Math.floor((width - side) / 2), y: Math.floor((height - side) / 2), side }
}

/** The qualities a picture is tried at, best first, until it is light enough. */
export const AVATAR_QUALITIES = [0.9, 0.8, 0.7, 0.55, 0.4] as const

/**
 * A picture the learner chose, as a profile keeps it (B1): its middle square, 256 by 256, a WebP of
 * 200 KB at most, made in the browser; null where it cannot be read as a picture.
 */
export async function avatarOf(file: Blob): Promise<Blob | null> {
  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(file)
  } catch {
    return null
  }
  const { x, y, side } = centreSquare(bitmap.width, bitmap.height)
  const canvas = document.createElement('canvas')
  canvas.width = AVATAR_SIDE
  canvas.height = AVATAR_SIDE
  canvas.getContext('2d')?.drawImage(bitmap, x, y, side, side, 0, 0, AVATAR_SIDE, AVATAR_SIDE)
  bitmap.close()
  for (const quality of AVATAR_QUALITIES) {
    const blob = await new Promise<Blob | null>((done) =>
      canvas.toBlob(done, 'image/webp', quality),
    )
    if (blob && blob.size <= AVATAR_BYTES) return blob
  }
  return null
}
