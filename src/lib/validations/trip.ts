import { z } from 'zod'

export const tripSchema = z
  .object({
    name: z.string().trim().min(2).max(100),
    destination: z.string().trim().min(2).max(100),
    startDate: z.string(), // ISO date, validated against endDate below
    endDate: z.string(),
    priceInr: z.coerce.number().int().positive('Price must be greater than zero'),
    totalSeats: z.coerce.number().int().positive('Needs at least one seat'),
    status: z.enum(['open', 'closed']),
    description: z.string().trim().max(600),
    coverImage: z.string().url('Must be a valid URL').or(z.string().length(0)).optional().nullable(),
    galleryImages: z.string().optional().nullable(),
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: 'End date cannot be before the start date',
    path: ['endDate'],
  })

export type TripInput = z.infer<typeof tripSchema>
