// 'use client'
import ErrorBoundary from '@/error-boundary'
import { ManageHighlightResponse, ProductResponse } from '@/types'
// import BookReader from './book-reader'
import dynamic from 'next/dynamic'
import RecoilProvider from './models/recoil'
// import { Layout, Theme } from './components'

const Theme = dynamic(() => import('./components').then((mod) => mod.Theme), {
  ssr: false,
  loading: () => <h2>Loading...</h2>,
})

const Layout = dynamic(() => import('./components').then((mod) => mod.Layout), {
  ssr: false,
  loading: () => <h2>Loading...</h2>,
})

const BookReader = dynamic(() => import('./book-reader'), {
  ssr: false,
  loading: () => <h2>Loading...</h2>,
})

type Props = {
  book: string
  bookData: ProductResponse
  hightLights: ManageHighlightResponse[]
}

const Render = (props: Props) => {
  // console.log(`\n\n ~ Render ~ props:`, props)
  return (
    <ErrorBoundary message="Something went wrong ">
      {/* <LiteralProvider> */}
      <RecoilProvider>
        <Theme />
        <Layout>
          <BookReader data={JSON.stringify(props)} />
        </Layout>
      </RecoilProvider>
      {/* </LiteralProvider> */}
    </ErrorBoundary>
  )
}

export default Render
