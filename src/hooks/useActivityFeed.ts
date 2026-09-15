import { useMemo } from 'react'
import { useSchemeFlow } from '@/context/SchemeContext'
import { activityMockConfig, getPaymentMethod, getScheme, mockPayments, mockReferralCredits, mockStaticActivity, paymentsMockConfig, type ActivityItem } from '@/data'
import { formatDueIn, formatINR, formatRelativeTime } from '@/lib/format'

/* ------------------------------------------------------------------
   useActivityFeed — merges the member's real history (scheme joins,
   instalments, referral credits) with the static promotional entries
   into one time-ordered feed, newest first.
------------------------------------------------------------------- */

/** Fixed notional timestamps for the static/promotional entries, so they interleave sensibly with real history. */
const staticSortAt: Record<string, string> = {
  a1: '2026-09-15T10:00:00',
  a2: '2026-09-15T08:00:00',
  a5: '2026-09-08T09:00:00',
}

export function useActivityFeed(): ActivityItem[] {
  const { joined } = useSchemeFlow()

  return useMemo(() => {
    if (activityMockConfig.simulateEmpty) return []
    const rows: { item: ActivityItem; sortAt: number }[] = []

    joined.forEach((j, i) => {
      const scheme = getScheme(j.schemeId)
      rows.push({
        sortAt: new Date(j.joinedAt).getTime(),
        item: {
          id: `scheme-${j.id}`,
          type: 'scheme',
          title: `Joined ${scheme?.name ?? 'Scheme'}`,
          description: `${j.tenure} months · ${formatINR(j.amount, { whole: true })}/month · Ref ${j.referenceNo}`,
          time: formatRelativeTime(j.joinedAt),
          unread: i === 0,
        },
      })
    })

    const payments = paymentsMockConfig.simulateEmpty ? [] : mockPayments
    payments.forEach((p) => {
      const scheme = getScheme(p.schemeId)
      const method = getPaymentMethod(p.paymentMethodId)?.label ?? 'payment'
      if (p.status === 'paid') {
        rows.push({
          sortAt: new Date(p.date).getTime(),
          item: {
            id: `pay-${p.id}`,
            type: 'payment',
            title: `Instalment ${p.installmentNo} of ${p.ofInstallments} paid`,
            description: `${scheme?.name ?? 'Scheme'} · ${formatINR(p.amount, { whole: true })} via ${method}`,
            time: formatRelativeTime(p.date),
          },
        })
      } else if (p.status === 'upcoming') {
        rows.push({
          sortAt: new Date(p.date).getTime(),
          item: {
            id: `due-${p.id}`,
            type: 'reminder',
            title: `Instalment due · ${scheme?.name ?? 'Scheme'}`,
            description: `${formatINR(p.amount, { whole: true })} · Instalment ${p.installmentNo} of ${p.ofInstallments}`,
            time: formatDueIn(p.date),
            unread: true,
          },
        })
      } else {
        rows.push({
          sortAt: new Date(p.date).getTime(),
          item: {
            id: `fail-${p.id}`,
            type: 'payment',
            title: `Instalment ${p.installmentNo} of ${p.ofInstallments} failed`,
            description: `${scheme?.name ?? 'Scheme'} · ${formatINR(p.amount, { whole: true })} via ${method}`,
            time: formatRelativeTime(p.date),
            unread: true,
          },
        })
      }
    })

    mockReferralCredits.forEach((c) => {
      const credited = c.status === 'credited'
      rows.push({
        sortAt: new Date(c.date).getTime(),
        item: {
          id: `ref-${c.id}`,
          type: 'referral',
          title: credited ? 'Referral bonus credited' : 'Referral bonus pending',
          description: credited
            ? `${c.friendName} joined using your code · +${formatINR(c.amount, { whole: true })}`
            : `${c.friendName} joined using your code · credits once their first instalment clears`,
          time: formatRelativeTime(c.date),
          unread: !credited,
        },
      })
    })

    mockStaticActivity.forEach((a) => rows.push({ item: a, sortAt: new Date(staticSortAt[a.id] ?? 0).getTime() }))

    return rows.sort((a, b) => b.sortAt - a.sortAt).map((r) => r.item)
  }, [joined])
}
