import { z } from 'zod'

export const propertySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  location: z.string().min(2, 'Location is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  propertyType: z.string().min(1, 'Please select a property type'),
  pricePerNight: z.coerce.number().min(0, 'Price must be 0 or more'),
  status: z.enum(['active', 'inactive']),
})

export type PropertyInput = z.infer<typeof propertySchema>
