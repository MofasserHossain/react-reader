'use client'
import ScreenLoader from '@/components/ui/screen-loader'
import { ManageHighlightResponse, ProductResponse } from '@/types'
import { useAppStore } from '@/zustand/state'
import { useEffect, useState } from 'react'
import 'regenerator-runtime/runtime'
import Loading from './loading'
import Render from './render'

type Props = {
  url: string
  bookData: ProductResponse
  hightLights: ManageHighlightResponse[]
}

const EbookReader = (props: Props) => {
  console.log(`\n\n ~ EbookReader ~ props:`, props)
  let [file, setFile] = useState('')
  const setSelectedBook = useAppStore((state) => state.setSelectedBook)
  const storeBookHighlights = useAppStore((state) => state.storeHighlight)
  const submitting = useAppStore((state) => state.submitting)
  useEffect(() => {
    setSelectedBook(props.bookData)
    storeBookHighlights(props.hightLights)
  }, [props.bookData, setSelectedBook, storeBookHighlights, props.hightLights])

  // useEffect(() => {
  //   fetch('https://file.io/Nfawmrxb8xGo')
  //     .then((res) => res.blob())
  //     .then(async (blob) => {
  //       console.log(`\n\n ~ EbookReader ~ blob:`, blob)
  //       let file = new File([blob], 'test.epub', {
  //         type: 'application/epub+zip',
  //       })
  //       const data = await file.arrayBuffer()
  //       // let epub = Epub('https://easyupload.io/rbpzai')
  //       // console.log(`\n\n ~ .then ~ epub:`, epub)
  //       let reader = new FileReader()
  //       reader.readAsDataURL(file)
  //       reader.onload = () => {
  //         console.log(`\n\n ~ EbookReader ~ reader.result:`, reader.result)
  //         if (!reader.result) return
  //         setFile(reader?.result as string)
  //       }
  //       console.log(`\n\n ~ EbookReader ~ file:`, file)
  //     })
  //     .catch((e) => console.log('error', e))
  //   // const convertBlobToArrayBuffer = async (blob: Blob) => {
  //   //   const file = new File([blob], `${props?.bookData?.book_title}.epub`, {
  //   //     type: 'application/epub+zip',
  //   //   })
  //   //   const arrayBuffer = await file.arrayBuffer()
  //   //   console.log(`\n\n ~ convertBlobToArrayBuffer ~ arrayBuffer:`, arrayBuffer)
  //   //   setFile(arrayBuffer as any)
  //   //   return arrayBuffer
  //   // }
  //   // convertBlobToArrayBuffer(props?.url as any)
  //   return () => {
  //     invalidateEbookHighlights()
  //   }
  // }, [])

  return (
    <div className="ebook" style={{ position: 'relative', height: '100%' }}>
      {submitting && <ScreenLoader />}
      <Render url={props?.url} loadingView={<Loading />} />
    </div>
  )
}

export default EbookReader
