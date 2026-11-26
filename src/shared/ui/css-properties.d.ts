import 'react'

declare module 'react' {
  /** A style may set the page's own custom properties (`--slot`, `--block-radius`) beside CSS's. */
  interface CSSProperties {
    [property: `--${string}`]: string | number | undefined
  }
}
