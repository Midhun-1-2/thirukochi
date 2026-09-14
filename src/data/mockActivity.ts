import type { ActivityItem } from './types'

/** DEMO DATA — activity feed placeholders. */
export const mockActivity: ActivityItem[] = [
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
    id: 'a3',
    type: 'payment',
    title: 'Scheme payment received',
    description: 'Your monthly instalment was received successfully.',
    time: 'Yesterday',
  },
  {
    id: 'a4',
    type: 'reminder',
    title: 'Reminder: Monthly instalment due',
    description: 'Your next instalment is due in 5 days.',
    time: '2 days ago',
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
