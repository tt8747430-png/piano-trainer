/**
 * Joins class names and resolves conflicting Tailwind utilities (the later wins). shadcn
 * primitives import the same `cn` package. A custom theme name its default tables do not know
 * (a new text size, radius or shadow) must be registered with `createCn` from `cn/config`, with a
 * test, or cn() will drop classes it misfiles.
 */
export { cn } from 'cn'
