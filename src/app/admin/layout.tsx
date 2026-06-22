import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminNav } from '@/components/admin/AdminNav'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect('/login?error=profile_missing')
  }

  if (profile.role !== 'associate' && profile.role !== 'lead') {
    redirect('/dashboard')
  }

  return (
    <div className="flex min-h-screen bg-cream">
      <AdminNav />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-sand/20 flex items-center justify-between px-8 bg-white/50 backdrop-blur-sm lg:hidden">
          <span className="font-display font-bold text-rust tracking-tighter">NOMICHI</span>
          {/* Mobile menu button could go here if needed, but keeping it simple for now */}
        </header>
        <main className="flex-1 overflow-y-auto px-4 py-8 lg:px-12 lg:py-10">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
