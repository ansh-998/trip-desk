'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const errorParam = searchParams.get('error')
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    
    if (error) {
      setError(error.message)
      setSubmitting(false)
      return
    }

    // Fetch user profile to determine role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    setSubmitting(false)

    if (profile?.role === 'traveller') {
      router.push('/dashboard')
    } else {
      router.push('/admin')
    }
    
    router.refresh()
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-cream px-4 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="font-display font-bold text-2xl text-rust tracking-tighter mb-8 block text-center">
          NOMICHI
        </Link>
        
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-display font-bold text-ink text-center">Welcome back</h1>
            <p className="text-sm text-ink/50 text-center">Sign in to your account</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              
              {errorParam === 'profile_missing' && (
                <div className="p-3 bg-amber-50 border border-amber-100 rounded-md">
                  <p className="text-amber-800 text-sm font-medium">
                    Your account exists, but no user profile was found in the database. Please verify migrations and seed data have been run on Supabase.
                  </p>
                </div>
              )}
              
              {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-md">
                  <p className="text-red-600 text-sm font-medium">{error}</p>
                </div>
              )}
              
              <Button type="submit" className="w-full" size="lg" disabled={submitting}>
                {submitting ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
            
            <div className="mt-6 text-center text-sm">
              <span className="text-ink/50">Don't have an account? </span>
              <Link href="/signup" className="font-bold text-rust hover:underline">
                Sign Up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<p className="text-center py-20 text-ink/50">Loading...</p>}>
      <LoginForm />
    </Suspense>
  )
}
