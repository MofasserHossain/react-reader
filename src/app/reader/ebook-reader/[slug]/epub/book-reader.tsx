'use client'
import config from '@/config/config'
import { ManageHighlightResponse, ProductResponse } from '@/types'
import { useLiveQuery } from 'dexie-react-hooks'
import Head from 'next/head'
import { useEffect, useRef, useState } from 'react'
import { useBoolean, useSet } from 'react-use'
import { ReaderGridView } from './components'
import Book from './components/books/book-card'
import { db } from './db'
import { addBook } from './file'
import { useDisablePinchZooming, useLibrary } from './hooks'
import { reader, useReaderSnapshot } from './models'
import { lock } from './styles'

type Props = {
  book: string
  bookData: ProductResponse
  hightLights: ManageHighlightResponse[]
}

function base64ToArrayBuffer(base64: string) {
  const binaryString = atob(base64)
  const len = binaryString.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes.buffer
}

export default function BookReader(props: { data: string }) {
  let data = JSON.parse(props.data) as Props
  // console.log(`\n\n ~ BookReader ~ props:`, props, data)
  const books = useLibrary()
  const { focusedTab } = useReaderSnapshot()
  useDisablePinchZooming()
  let ref = useRef<boolean>(false)

  const getBook = async () => {
    const getName = data?.bookData?.File_URL?.split('/')?.pop() ?? 'book1.epub'
    const arrayBuffer = base64ToArrayBuffer(data?.book)
    const blob = new Blob([arrayBuffer], { type: 'application/epub+zip' })
    const file = new File([blob], getName, {
      type: 'application/epub+zip',
    })
    const findBook = books?.find((b) => b.id === data?.bookData?.id)
    if (!findBook) {
      addBook(file, data?.bookData?.id as number)
    }
    ref.current = true
  }

  useEffect(() => {
    if (ref.current) return
    getBook()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // This could be useState, useOptimistic, or other state
  let pending = books && books?.length > 0

  useEffect(() => {
    if (!pending) return
    function beforeUnload(e: BeforeUnloadEvent) {
      // e.preventDefault()
      console.log('beforeUnload')
      // e.returnValue = ''
      const bookIds = books ? books.map((b) => b.id) : []
      db?.books.bulkDelete(bookIds)
      db?.covers.bulkDelete(bookIds)
      db?.files.bulkDelete(bookIds)
    }
    window.addEventListener('beforeunload', beforeUnload)
    return () => {
      window.removeEventListener('beforeunload', beforeUnload)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending])

  useEffect(() => {
    return () => {
      //  db?.books.bulkDelete(bookIds)
      //  db?.covers.bulkDelete(bookIds)
      //  db?.files.bulkDelete(bookIds)
      reader.clear()
    }
  }, [])

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no"
        />
        <title>{focusedTab?.title ?? config.name}</title>
      </Head>
      <ReaderGridView />
      <Library />
    </>
  )
}

const Library: React.FC = () => {
  const books = useLibrary()
  const covers = useLiveQuery(() => db?.covers.toArray() ?? [])
  const [select, toggleSelect] = useBoolean(false)
  const [selectedBookIds, { add, has, toggle, reset }] = useSet<string>()

  const [loading, setLoading] = useState<string | undefined>()
  // const [readyToSync, setReadyToSync] = useState(false)

  const { groups } = useReaderSnapshot()

  useEffect(() => {
    if (!select) reset()
  }, [reset, select])

  if (groups.length) return null
  if (!books) return null

  return (
    <div className="scroll-parent h-full p-4">
      <>
        <div className="scroll h-full">
          <ul
            className="grid"
            style={{
              gridTemplateColumns: `repeat(auto-fill, minmax(calc(80px + 3vw), 1fr))`,
              columnGap: lock(16, 32),
              rowGap: lock(24, 40),
            }}
          >
            {books.map((book) => (
              <Book
                key={book.id}
                book={book}
                covers={covers}
                select={select}
                selected={has(book.id)}
                loading={loading === book.id}
                toggle={toggle}
              />
            ))}
          </ul>
        </div>
      </>
    </div>
  )
}
