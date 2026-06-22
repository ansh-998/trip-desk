import type { PipelineStage, GroupType } from '@/lib/constants'

export interface Trip {
  id: string
  name: string
  destination: string
  start_date: string
  end_date: string
  price_inr: number
  total_seats: number
  seats_booked: number
  status: 'open' | 'closed'
  description: string
  cover_image?: string | null
  gallery_images?: string[] | null
  created_at: string
  updated_at: string
}

export interface Property {
  id: string
  name: string
  location: string
  description: string
  property_type: string
  price_per_night: number
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

export interface Lead {
  id: string
  trip_id: string | null
  traveller_id: string | null
  name: string
  phone: string
  email: string | null
  group_type: GroupType
  preferred_month: string | null
  trip_feel: string | null
  status: PipelineStage
  owner_id: string | null
  created_at: string
  updated_at: string
}

export interface CallLog {
  id: string
  lead_id: string
  author_id: string | null
  note: string
  next_action: string | null
  created_at: string
}

export interface Profile {
  id: string
  full_name: string
  role: 'associate' | 'lead' | 'traveller'
  created_at: string
}
