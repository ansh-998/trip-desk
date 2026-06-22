'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'

export default function SignupPage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: 'traveller',
        },
      },
    })
    
    setSubmitting(false)

    if (error) {
      setError(error.message)
      return
    }
    
    setSuccess(true)
  }

  if (success) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-cream px-4">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <h1 className="text-3xl font-display font-bold text-ink">Check your email</h1>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-ink/60">
              We've sent a verification link to <strong>{email}</strong>. 
              Please confirm your email to start tracking your journeys.
            </p>
            <Link href="/login" className="block">
              <Button variant="outline" className="w-full">Back to Login</Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-cream px-4 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="font-display font-bold text-2xl text-rust tracking-tighter mb-8 block text-center">
          NOMICHI
        </Link>
        
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-display font-bold text-ink text-center">Join Nomichi</h1>
            <p className="text-sm text-ink/50 text-center">Create an account to track your journey enquiries.</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                label="Full Name"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <Input
                label="Email"
                type="email"
                placeholder="john@example.com"
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
              
              {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-md">
                  <p className="text-red-600 text-sm font-medium">{error}</p>
                </div>
              )}
              
              <Button type="submit" className="w-full" size="lg" disabled={submitting}>
                {submitting ? 'Creating account...' : 'Sign Up'}
              </Button>
            </form>
            
            <div className="mt-6 text-center text-sm">
              <span className="text-ink/50">Already have an account? </span>
              <Link href="/login" className="font-bold text-rust hover:underline">
                Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
