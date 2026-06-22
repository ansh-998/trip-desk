'use client'

import { useState, useEffect } from 'react'
import { getTripImages } from '@/lib/trip-images'
import type { Trip } from '@/types'

export function TripGallery({ trip }: { trip: Trip }) {
  const fallback = getTripImages(trip.name)
  const cover = trip.cover_image || fallback[0]
  let gallery = trip.gallery_images || []

  if (gallery.length === 0) {
    gallery = fallback.slice(1)
  }

  const images = [cover, ...gallery]

  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
      else if (e.key === 'ArrowRight') setActiveIndex((prev) => (prev + 1) % images.length)
      else if (e.key === 'ArrowLeft') setActiveIndex((prev) => (prev - 1 + images.length) % images.length)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, images.length])

  return (
    <>
      <div className="grid h-[300px] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-xl sm:h-[400px] lg:h-[480px]">
        <div className="relative col-span-2 row-span-2 h-full w-full">
          <img
            src={images[0]}
            alt={`${trip.name} — main`}
            onClick={() => { setIsOpen(true); setActiveIndex(0); }}
            className="h-full w-full object-cover hover:brightness-90 transition-all cursor-pointer"
          />
        </div>
        {images.slice(1, 5).map((src, i) => (
          <div key={src} className="relative hidden sm:block h-full w-full">
            <img
              src={src}
              alt={`${trip.name} — photo ${i + 2}`}
              onClick={() => { setIsOpen(true); setActiveIndex(i + 1); }}
              className="h-full w-full object-cover hover:brightness-90 transition-all cursor-pointer"
            />
            {i === 2 && (
              <button
                type="button"
                onClick={() => { setIsOpen(true); setActiveIndex(0); }}
                className="absolute bottom-4 right-4 flex items-center gap-2 rounded-lg border border-border bg-white/90 px-4 py-2 text-sm font-semibold shadow-sm hover:bg-white transition-colors text-ink dark:bg-surface/90 dark:text-ink"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Show all photos
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Full-Screen Lightbox Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm select-none">
          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 text-white/85 hover:text-white hover:scale-105 transition-all h-12 w-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
            aria-label="Close Gallery"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Left Arrow */}
          <button
            onClick={() => setActiveIndex((prev) => (prev - 1 + images.length) % images.length)}
            className="absolute left-6 text-white/85 hover:text-white hover:scale-105 transition-all h-12 w-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
            aria-label="Previous Photo"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Image Display */}
          <div className="max-w-5xl max-h-[80vh] px-4 flex flex-col items-center">
            <img
              src={images[activeIndex]}
              alt={`${trip.name} — photo ${activeIndex + 1}`}
              className="max-w-full max-h-[75vh] rounded-lg object-contain shadow-2xl transition-all duration-300"
            />
            <p className="text-white/60 text-sm mt-4 font-medium font-sans">
              {activeIndex + 1} / {images.length} — {trip.name}
            </p>
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => setActiveIndex((prev) => (prev + 1) % images.length)}
            className="absolute right-6 text-white/85 hover:text-white hover:scale-105 transition-all h-12 w-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
            aria-label="Next Photo"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </>
  )
}
