import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { PipelineStatusBadge } from '@/components/admin/PipelineStatusBadge'
import { Button } from '@/components/ui/Button'

export default async function TravellerDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  // Verify role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile) {
    return redirect('/login?error=profile_missing')
  }

  if (profile.role !== 'traveller') {
    return redirect('/admin')
  }

  const { data: enquiries } = await supabase
    .from('leads')
    .select('*, trips(name, destination)')
    .eq('traveller_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-50 w-full border-b border-sand/20 bg-cream/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-display font-bold text-xl text-rust tracking-tighter">
            NOMICHI
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-xs text-ink/50 hidden sm:block">Welcome, {user.email}</span>
            <form action="/api/auth/signout" method="post">
              <Button variant="ghost" size="sm" type="submit">Sign Out</Button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-display font-bold text-ink tracking-tight">Your Enquiries</h1>
          <p className="text-ink/50 mt-1">Track the status of your journey requests.</p>
        </div>

        {!enquiries?.length ? (
          <Card variant="outline" className="border-dashed">
            <CardContent className="py-20 text-center">
              <p className="text-ink/40 italic mb-6">You haven't submitted any enquiries yet.</p>
              <Link href="/">
                <Button>Explore Journeys</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {enquiries.map((enquiry) => (
              <Card key={enquiry.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-display font-bold text-ink">
                          {enquiry.trips?.name ?? 'General Enquiry'}
                        </h3>
                        <PipelineStatusBadge status={enquiry.status} />
                      </div>
                      <p className="text-sm text-ink/60">
                        Submitted on {new Date(enquiry.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/trips/${enquiry.trip_id}`}>
                        <Button variant="outline" size="sm">View Journey</Button>
                      </Link>
                    </div>
                  </div>
                  
                  {enquiry.trip_feel && (
                    <div className="mt-6 pt-6 border-t border-sand/10">
                      <p className="text-xs font-bold uppercase tracking-widest text-ink/30 mb-2">Your Vibe</p>
                      <p className="text-sm text-ink/70 italic leading-relaxed">
                        "{enquiry.trip_feel}"
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
