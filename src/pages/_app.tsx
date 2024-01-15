import { ErrorBoundary } from "@blitzjs/next"
import type { AppProps } from "next/app"
import RootErrorFallback from "../app/errors/RootErrorFallback"

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary FallbackComponent={RootErrorFallback}>
      <Component {...pageProps} />
    </ErrorBoundary>
  )
}
