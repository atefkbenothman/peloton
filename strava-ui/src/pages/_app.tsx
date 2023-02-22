import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from "@/components/layout"
import { useEffect, useRef } from "react"

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const use = async () => {
      (await import('tw-elements')).default
    }
    use()
  }, [])
  return (
    <Layout>
      <div className="">
        <Component {...pageProps} />
      </div>
    </Layout>
  )
}
