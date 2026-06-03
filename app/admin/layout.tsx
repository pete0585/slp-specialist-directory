import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const adminEmail = process.env.ADMIN_EMAIL ?? 'adam@thestrategicveteran.com'
  if (user.email !== adminEmail) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-brand-slate text-white py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-brand-emerald font-bold text-xl">💬</span>
            <h1 className="font-bold text-lg">SLP Specialist Admin</h1>
          </div>
          <span className="text-gray-300 text-sm">{user.email}</span>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  )
}
