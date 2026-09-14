import { createContext, useContext } from 'react'

/* ------------------------------------------------------------------
   Entrance choreography policy.

   The staggered "reveal" animations are a first-impression moment:
   they play when a layout group (auth / app) shows its first page.
   Every later route change inside that group renders its content
   fully visible straight away and relies on the layout's short
   cross-fade — so navigation never looks like a reload, and nothing
   is invisible while a slow device is still painting.
------------------------------------------------------------------- */

let mountedGroup: string | null = null

/** True until the first page of `group` has committed. */
export function shouldPlayEntrance(group: string): boolean {
  return mountedGroup !== group
}

export function markGroupMounted(group: string): void {
  mountedGroup = group
}

/** Provided by <PageTransition>; defaults to `true` outside a page (auth brand panel, etc.). */
export const EntranceContext = createContext<boolean>(true)

/** Whether mount-time entrance animations should run for this page. */
export function useEntrance(): boolean {
  return useContext(EntranceContext)
}
