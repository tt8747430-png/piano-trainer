import type { TableColumns } from './LibraryTable'

/** How many columns a fold head spans. */
export const spanOf = (levels: boolean, columns: TableColumns) => (levels || columns.third ? 4 : 3)
