'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PageBackground } from '@/components/PageBackground'

export default function AdminRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    // Immediately redirect to admin dashboard
    router.push('/admin/dashboard')
  }, [router])

  return (
    <PageBackground>
      <div className="min-h-screen flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lab-highlight mx-auto mb-4"></div>
          <p className="text-white">Redirecting to admin dashboard...</p>
        </div>
      </div>
    </PageBackground>
  )
}
