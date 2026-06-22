'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export function SiteHeader() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark') || localStorage.getItem('theme') === 'dark'
    setDarkMode(isDark)
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    const nextDark = !darkMode
    setDarkMode(nextDark)
    if (nextDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white/80 backdrop-blur-md dark:bg-surface/80 transition-colors">
      <div className="mx-auto flex h-[72px] max-w-[1760px] items-center justify-between px-6 md:px-10 lg:px-20">
        <Link
          href="/"
          className="flex items-center gap-2 text-brand transition-opacity hover:opacity-80"
        >
          <svg
            viewBox="0 0 32 32"
            className="h-8 w-8 fill-current"
            aria-hidden
          >
            <path d="M16 2C9.373 2 4 7.373 4 14c0 7.5 12 16 12 16s12-8.5 12-16c0-6.627-5.373-12-12-12zm0 16a4 4 0 110-8 4 4 0 010 8z" />
          </svg>
          <span className="hidden text-xl font-bold tracking-tight text-brand sm:block font-display">
            nomichi
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <Link
            href="/"
            className="rounded-full px-4 py-2 text-sm font-medium text-ink hover:bg-surface-muted transition-colors"
          >
            Journeys
          </Link>
          <span className="rounded-full px-4 py-2 text-sm font-medium text-ink-muted cursor-default">
            About
          </span>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden rounded-full px-4 py-2.5 text-sm font-medium text-ink hover:bg-surface-muted transition-colors sm:block"
          >
            Team login
          </Link>
          <button
            type="button"
            onClick={toggleDarkMode}
            className="flex items-center gap-2 rounded-full border border-border py-1.5 pl-3 pr-1.5 shadow-sm hover:shadow-md transition-shadow bg-surface"
            aria-label="Toggle Dark Mode"
          >
            <span className="text-xs font-semibold text-ink-muted hidden sm:inline">
              {darkMode ? 'Dark Mode' : 'Light Mode'}
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-muted text-white">
              {darkMode ? (
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3c.132 0 .263 0 .393.007a7.5 7.5 0 007.92 12.446A9 9 0 1112 3z" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 7a5 5 0 100 10 5 5 0 000-10zM2 12h2m16 0h2M12 2v2m0 16v2m-6.364-16.364l1.414 1.414m10.607 10.607l1.414 1.414M3.636 20.364l1.414-1.414m10.607-10.607l1.414-1.414" />
                </svg>
              )}
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}
