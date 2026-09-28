import type { ReactNode } from 'react'

/** Short editorial line for the open space in an image-led card. */
export function EditorialNote({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`ed-card-note${className ? ` ${className}` : ''}`}>{children}<span aria-hidden="true" /></p>
}
