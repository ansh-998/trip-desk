import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// POST /api/auth/signout — signs out the current session and redirects to
// the login page. Handles both admin and traveller users.
export async function POST(request: Request) {
  const supabase = await createClient()

  // Sign out only if an active session exists to avoid an unnecessary request.
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    await supabase.auth.signOut()
  }

  return NextResponse.redirect(new URL('/login', request.url), {
    status: 302,
  })
}
