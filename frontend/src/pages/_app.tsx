import type { AppProps } from 'next/app'
import { AppShell } from '../components/layout/AppShell'
import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppShell>
      <Component {...pageProps} />
    </AppShell>
  )
}