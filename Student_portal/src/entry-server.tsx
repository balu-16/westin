import { renderToString } from 'react-dom/server'
import { Suspense } from 'react'
import { Route, Routes, StaticRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { PublicHome } from './public/PublicHome'
import { PublicLayout } from './public/PublicLayout'
import { NotFound, PublicPage, PublicSearch } from './public/PublicPage'
import { fixturePrograms, publicRecords, publicSections } from './public/content'
import { archivePath, officialArchive } from './public/officialArchive'
import { publicSnapshot, snapshotPublicPath } from './public/usePublicContent'

/** Minimal SSR entry used to prove the public route boundary.
 * The authenticated app remains client-rendered and is intentionally not
 * imported into this server entry. */
export function render(url: string) {
  return renderToString(
    <StaticRouter location={url}>
      <AuthProvider>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<PublicHome />} />
            <Route path="/search" element={<Suspense fallback={null}><PublicSearch /></Suspense>} />
            <Route path="*" element={<PublicRoute />} />
          </Route>
        </Routes>
      </AuthProvider>
    </StaticRouter>,
  )
}

function PublicRoute() {
  return <Suspense fallback={null}><PublicPage /></Suspense>
}

export { NotFound }

/** All locally migrated public routes; used by the official build's prerenderer. */
export function staticPublicPaths() {
  const indexes = [
    '/', '/about', '/partners', '/partners/bineid', '/why-westin', '/programs',
    '/campus', '/campus/infrastructure', '/campus/events', '/placements',
    '/career-planner', '/news', '/blog', '/gallery', '/magazine', '/testimonials',
    '/success-stories', '/publishing-house', '/admissions', '/contact', '/search',
  ]
  const olderDetails = publicRecords.filter((record) => record.kind !== 'magazine').map((record) =>
    record.kind === 'campus-events' ? `/campus/events/${record.id}` : `/${record.kind}/${record.id}`)
  return [...new Set([
    ...indexes, ...Object.keys(publicSections),
    ...fixturePrograms.map((program) => `/programs/${program.slug}`),
    ...officialArchive.map(archivePath), ...olderDetails,
    ...publicSnapshot.entries.map(snapshotPublicPath).filter((path): path is string => !!path),
  ])].sort()
}
