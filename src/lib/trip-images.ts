// Curated Unsplash images keyed by the trip name used in seed.sql.
// These act as a visual fallback when a trip doesn't yet have a cover image
// uploaded to Supabase Storage.

const TRIP_IMAGES: Record<string, string[]> = {
  'Spiti in Winter': [
    'https://images.unsplash.com/photo-1626621341545-bf374cc547ad?w=1200&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80',
  ],
  'Coffee Country': [
    'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1200&q=80',
    'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&q=80',
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
    'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800&q=80',
  ],
  'Northeast Backroads': [
    'https://images.unsplash.com/photo-1587893432596-462c8650b698?w=1200&q=80',
    'https://images.unsplash.com/photo-1524492412937-280785a85483?w=800&q=80',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80',
    'https://images.unsplash.com/photo-1439068799847-9383d6a8f271?w=800&q=80',
  ],
  'Desert Light': [
    'https://images.unsplash.com/photo-1473580044385-0ba394a4a935?w=1200&q=80',
    'https://images.unsplash.com/photo-1509316785289-025f5b846b8e?w=800&q=80',
    'https://images.unsplash.com/photo-1451337516015-6b5e72a676ae?w=800&q=80',
    'https://images.unsplash.com/photo-1504196606676-a8e059f6a856?w=800&q=80',
  ],
}

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80',
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80',
]

export function getTripImages(tripName: string): string[] {
  return TRIP_IMAGES[tripName] ?? FALLBACK_IMAGES
}

export function getTripCoverImage(tripName: string): string {
  return getTripImages(tripName)[0]
}
