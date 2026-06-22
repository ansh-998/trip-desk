// Guard for admin-only API routes. Returns a 401 if the user is not
// authenticated, or a 403 if they are authenticated but hold the 'traveller'
// role rather than 'associate' or 'lead'.
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function requireAdminSession() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      supabase,
      user: null,
      unauthorized: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role === 'traveller') {
    return {
      supabase,
      user,
      unauthorized: NextResponse.json({ error: 'Forbidden' }, { status: 403 }),
    }
  }

  return { supabase, user, unauthorized: null }
}
