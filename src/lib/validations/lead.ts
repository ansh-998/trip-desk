import { z } from 'zod'

// India-first phone validation: optional +91 / 0 prefix, then 10 digits starting 6-9.
const indianPhone = z
  .string()
  .trim()
  .regex(/^(?:\+91|0)?[6-9]\d{9}$/, 'Enter a valid 10-digit phone number')

export const enquirySchema = z.object({
  name: z.string().trim().min(2, 'Name is too short').max(80),
  phone: indianPhone,
  email: z.string().trim().email('Enter a valid email').optional().or(z.literal('')),
  tripId: z.string().uuid(),
  travellerId: z.string().uuid().optional().nullable(),
  groupType: z.enum(['solo', 'friends', 'couple', 'family']),
  preferredMonth: z.string().trim().min(1, 'Pick a month'),
  tripFeel: z.string().trim().max(500).optional().or(z.literal('')),
})

export type EnquiryInput = z.infer<typeof enquirySchema>
