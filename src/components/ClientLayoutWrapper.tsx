'use client'

import { usePathname } from 'next/navigation'
import Sidebar from '@/components/Sidebar'

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const showSidebar = pathname !== '/' 

  return (
    <main className={!showSidebar ? '' : 'px-2 md:px-16 md:py-2 text-textPrimary'}>
      {showSidebar ? (
        <section className="flex space-x-4">
          <Sidebar />
          {children}
        </section>
      ) : (
        children
      )}
    </main>
  )
}