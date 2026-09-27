/** The bar under an x on the sheet; the first or last for an x outside them. */
export function barAt(measures: readonly { x: number; width: number }[], x: number): number {
  const index = measures.findIndex((measure) => x < measure.x + measure.width)
  return index < 0 ? measures.length - 1 : index
}
