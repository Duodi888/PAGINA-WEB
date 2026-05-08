import type { AppProps } from 'next/app'

// Prevent SSR for Vite-only src/pages/* files (they're not actual Next.js pages)
export default function App({ Component, pageProps }: AppProps) {
  if (typeof window === 'undefined') return null
  return <Component {...pageProps} />
}
