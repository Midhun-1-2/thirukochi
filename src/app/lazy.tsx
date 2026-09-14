import { use, type ComponentType } from 'react'

/* ------------------------------------------------------------------
   lazyWithPreload
   Code-split like React.lazy, but:
   - the loader promise carries React's thenable status fields, so once
     a chunk has loaded `use()` reads it synchronously — route changes
     never suspend (no fallback flash mid-transition);
   - the rendered element type never changes (no remount when the
     chunk arrives);
   - every route chunk is warmed shortly after first paint via
     `preloadAll()`, so navigation never waits on the network.
------------------------------------------------------------------- */

type Loader<P> = () => Promise<{ default: ComponentType<P> }>

/** A promise annotated the way React's `use()` reads settled thenables. */
type TrackedPromise<T> = Promise<T> & {
  status?: 'pending' | 'fulfilled' | 'rejected'
  value?: T
  reason?: unknown
}

export interface PreloadableComponent<P> {
  (props: P): React.ReactElement | null
  preload: () => Promise<void>
  displayName?: string
}

const registry: Array<() => Promise<void>> = []

export function lazyWithPreload<P extends object>(loader: Loader<P>): PreloadableComponent<P> {
  let pending: TrackedPromise<ComponentType<P>> | null = null

  const load = () => {
    if (!pending) {
      const p: TrackedPromise<ComponentType<P>> = loader().then(
        (m) => {
          p.status = 'fulfilled'
          p.value = m.default
          return m.default
        },
        (err: unknown) => {
          p.status = 'rejected'
          p.reason = err
          throw err
        },
      )
      p.status = 'pending'
      pending = p
    }
    return pending
  }

  const Component = ((props: P) => {
    // React reads the `status` / `value` fields off the promise; typed as a plain promise for `use`.
    const Resolved = use(load() as Promise<ComponentType<P>>)
    return <Resolved {...props} />
  }) as PreloadableComponent<P>

  Component.displayName = 'LazyRoute'
  Component.preload = () => load().then(() => undefined)
  registry.push(Component.preload)
  return Component
}

/** Warm every registered route chunk (call once, after first paint). */
export function preloadAll(): void {
  const run = () => registry.forEach((load) => void load().catch(() => {}))
  const idle = (window as Window & { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback
  if (idle) idle(run, { timeout: 1500 })
  else window.setTimeout(run, 400)
}
