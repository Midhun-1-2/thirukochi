import type { ActivityItem } from './types'

/**
 * DEMO DATA — the informational/promotional entries in the feed
 * (announcements, rate refreshes, offers). Scheme joins, instalments
 * and referral credits are real, generated from live app state by
 * `useActivityFeed` — see src/hooks/useActivityFeed.ts.
 */
export const mockStaticActivity: ActivityItem[] = [
  {
    id: 'a1',
    type: 'scheme',
    title: 'New scheme launched',
    description: 'Join now and get exclusive benefits on the Gold Savings Scheme.',
    time: '2h ago',
    unread: true,
  },
  {
    id: 'a2',
    type: 'rate',
    title: 'Gold rate updated',
    description: "Today's 22K rate has been refreshed.",
    time: '4h ago',
    unread: true,
  },
  {
    id: 'a5',
    type: 'offer',
    title: 'Festive collection preview',
    description: 'A curated preview of the new season is now available in store.',
    time: '1 week ago',
  },
]

export const activityMockConfig = {
  /** Flip to `true` to preview the empty state. */
  simulateEmpty: false,
}
