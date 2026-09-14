import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export function PageContainer({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 2xl:px-10', className)}>{children}</div>
}
