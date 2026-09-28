import { useEffect, useState } from 'react'
import { publicFetch, type PublishedContentEntry, type PublicSitePayload } from '../lib/publicApi'
import snapshot from './cms-snapshot.json'

export const publicSnapshot = snapshot as PublicSitePayload
export function snapshotEntry(entryType: string, slug: string) {
  return publicSnapshot.entries.find((entry) => entry.entryType === entryType && entry.slug === slug)
}
export function snapshotPublicPath(entry: PublishedContentEntry) {
  const prefix: Record<string, string> = {
    news: '/news/', blog: '/blog/', 'event-story': '/campus/events/',
    gallery: '/gallery/', magazine: '/magazine/', testimonial: '/testimonials/',
    'success-story': '/success-stories/',
  }
  return prefix[entry.entryType] ? prefix[entry.entryType] + entry.slug : null
}
export function snapshotRoute(pathname: string) {
  return publicSnapshot.entries.find((entry) => snapshotPublicPath(entry) === pathname.replace(/\/+$/, ''))
}
function mergeSnapshot(payload: PublicSitePayload): PublicSitePayload {
  if (!payload || !Array.isArray(payload.entries)) return publicSnapshot
  const entries = new Map(publicSnapshot.entries.map((entry) => [`${entry.entryType}:${entry.slug}`, entry]))
  for (const entry of payload.entries) {
    if (entry && typeof entry.entryType === 'string' && typeof entry.slug === 'string') {
      entries.set(`${entry.entryType}:${entry.slug}`, entry)
    }
  }
  return { settings: payload.settings ?? {}, entries: [...entries.values()] }
}

export const PUBLIC_CONTENT_MODE = import.meta.env.VITE_PUBLIC_CONTENT_MODE === 'api' ? 'api' : 'fixture'

interface PublicRequestState<T> {
  data: T | null
  error: string | null
  loading: boolean
}

export function usePublishedSite(enabled = PUBLIC_CONTENT_MODE === 'api'): PublicRequestState<PublicSitePayload> {
  return usePublicRequest<PublicSitePayload>(enabled ? '/public/site' : null, publicSnapshot)
}

export function usePublishedEntry(
  entryType: string | null,
  slug: string | null,
): PublicRequestState<PublishedContentEntry> {
  const path = entryType && slug
    ? '/public/content/' + encodeURIComponent(entryType) + '/' + encodeURIComponent(slug)
    : null
  return usePublicRequest<PublishedContentEntry>(path, entryType && slug ? snapshotEntry(entryType, slug) ?? null : null)
}

function usePublicRequest<T>(path: string | null, initialData: T | null): PublicRequestState<T> {
  const [state, setState] = useState<PublicRequestState<T>>({
    data: initialData,
    error: null,
    loading: path !== null,
  })

  useEffect(() => {
    if (!path) {
      setState({ data: initialData, error: null, loading: false })
      return
    }
    let cancelled = false
    setState({ data: initialData, error: null, loading: true })
    publicFetch<T>(path)
      .then((data) => {
        if (!cancelled) setState({ data: (path === '/public/site' ? mergeSnapshot(data as PublicSitePayload) : data) as T, error: null, loading: false })
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setState({
            data: initialData,
            error: error instanceof Error ? error.message : 'Published content could not be loaded.',
            loading: false,
          })
        }
      })
    return () => {
      cancelled = true
    }
  }, [path, initialData])

  return state
}
