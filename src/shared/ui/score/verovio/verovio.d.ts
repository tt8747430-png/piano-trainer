// Verovio ships no types: what the app calls of its toolkit.
declare module 'verovio/wasm' {
  const createVerovioModule: () => Promise<unknown>
  export default createVerovioModule
}

declare module 'verovio/esm' {
  export class VerovioToolkit {
    /** Every toolkit made and not destroyed, which Verovio keeps for the page's life. */
    static readonly instances: readonly VerovioToolkit[]
    constructor(module: unknown)
    setOptions(options: Record<string, unknown>): void
    loadData(data: string): boolean
    getPageCount(): number
    renderToSVG(page?: number, xmlDeclaration?: boolean): string
    getLog(): string
  }
}
