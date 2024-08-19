// 'use client'
// import config from '@/config/config'
// import { useBoolean } from '@literal-ui/hooks'
// import { useLiveQuery } from 'dexie-react-hooks'
// import Head from 'next/head'
// import React, { useEffect, useState } from 'react'
// import { MdOutlineFileDownload, MdOutlineShare } from 'react-icons/md'
// import { usePrevious, useSet } from 'react-use'
// import 'regenerator-runtime/runtime'
// import { Button, DropZone, ReaderGridView, TextField } from './components'
// import Book from './components/books/book-card'
// import { BookRecord, db } from './db'
// import { addFile, fetchBook, handleFiles } from './file'
// import {
//   useDisablePinchZooming,
//   useLibrary,
//   useRemoteBooks,
//   useRemoteFiles,
// } from './hooks'
// import { reader, useReaderSnapshot } from './models'
// import { lock } from './styles'
// import { dbx, pack, uploadData } from './sync'
// import { copy } from './utils'

// const SOURCE = 'src'

// export default function Reader() {
//   const { focusedTab } = useReaderSnapshot()
//   useDisablePinchZooming()

//   useEffect(() => {
//     return () => {
//       reader.clear()
//     }
//   }, [])

//   return (
//     <>
//       <Head>
//         <meta
//           name="viewport"
//           content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no"
//         />
//         <title>{focusedTab?.title ?? config.name}</title>
//       </Head>
//       <ReaderGridView />
//       <Library />
//     </>
//   )
// }

// const Library: React.FC = () => {
//   const books = useLibrary()
//   const covers = useLiveQuery(() => db?.covers.toArray() ?? [])

//   const { data: remoteBooks, mutate: mutateRemoteBooks } = useRemoteBooks()
//   const { data: remoteFiles, mutate: mutateRemoteFiles } = useRemoteFiles()
//   const previousRemoteBooks = usePrevious(remoteBooks)
//   const previousRemoteFiles = usePrevious(remoteFiles)

//   const [select, toggleSelect] = useBoolean(false)
//   const [selectedBookIds, { add, has, toggle, reset }] = useSet<string>()

//   const [loading, setLoading] = useState<string | undefined>()
//   const [readyToSync, setReadyToSync] = useState(false)

//   const { groups } = useReaderSnapshot()

//   useEffect(() => {
//     if (previousRemoteFiles && remoteFiles) {
//       // to remove effect dependency `books`
//       db?.books.toArray().then((books) => {
//         if (books.length === 0) return

//         const newRemoteBooks = remoteFiles.map((f) =>
//           books.find((b) => b.name === f.name),
//         ) as BookRecord[]

//         uploadData(newRemoteBooks)
//         mutateRemoteBooks(newRemoteBooks, { revalidate: false })
//       })
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [mutateRemoteBooks, remoteFiles])

//   useEffect(() => {
//     if (!previousRemoteBooks && remoteBooks) {
//       db?.books.bulkPut(remoteBooks).then(() => setReadyToSync(true))
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [remoteBooks])

//   useEffect(() => {
//     if (!remoteFiles || !readyToSync) return
//     db?.books.toArray().then(async (books) => {
//       for (const remoteFile of remoteFiles) {
//         const book = books.find((b) => b.name === remoteFile.name)
//         if (!book) continue

//         const file = await db?.files.get(book.id)
//         if (file) continue
//         setLoading(book.id)
//         await dbx
//           .filesDownload({ path: `/files/${remoteFile.name}` })
//           .then((d) => {
//             const blob: Blob = (d.result as any).fileBlob
//             return addFile(book.id, new File([blob], book.name))
//           })
//         setLoading(undefined)
//       }
//     })
//   }, [readyToSync, remoteFiles])

//   useEffect(() => {
//     if (!select) reset()
//   }, [reset, select])

//   if (groups.length) return null
//   if (!books) return null

//   const selectedBooks = [...selectedBookIds].map(
//     (id) => books.find((b) => b.id === id)!,
//   )
//   const allSelected = selectedBookIds.size === books.length

//   return (
//     <DropZone
//       className="scroll-parent h-full p-4"
//       onDrop={(e) => {
//         const bookId = e.dataTransfer.getData('text/plain')
//         const book = books.find((b) => b.id === bookId)
//         if (book) reader.addTab(book)
//         handleFiles(e.dataTransfer.files)
//       }}
//     >
//       <>
//         <div className="mb-4 space-y-2.5">
//           <div>
//             <TextField
//               name={SOURCE}
//               placeholder="https://link.to/remote.epub"
//               type="url"
//               hideLabel
//               actions={[
//                 {
//                   title: 'Share',
//                   Icon: MdOutlineShare,
//                   onClick(el: any) {
//                     if (el?.reportValidity()) {
//                       copy(`${window.location.origin}/?${SOURCE}=${el.value}`)
//                     }
//                   },
//                 },
//                 {
//                   title: 'Download',
//                   Icon: MdOutlineFileDownload,
//                   onClick(el: any) {
//                     if (el?.reportValidity()) fetchBook(el.value)
//                   },
//                 },
//               ]}
//             />
//           </div>
//           <div className="flex items-center justify-between gap-4">
//             <div className="space-x-2">
//               {books.length ? (
//                 <Button variant="secondary" onClick={toggleSelect}>
//                   {select ? 'Cancel' : 'Select'}
//                 </Button>
//               ) : (
//                 <Button
//                   variant="secondary"
//                   disabled={!books}
//                   onClick={() => {
//                     fetchBook(
//                       'https://epubtest.org/books/Fundamental-Accessibility-Tests-Basic-Functionality-v1.0.0.epub',
//                     )
//                   }}
//                 >
//                   {'Download sample book'}
//                 </Button>
//               )}
//               {select &&
//                 (allSelected ? (
//                   <Button variant="secondary" onClick={reset}>
//                     {'Deselect all'}
//                   </Button>
//                 ) : (
//                   <Button
//                     variant="secondary"
//                     onClick={() => books.forEach((b) => add(b.id))}
//                   >
//                     {'Select All'}
//                   </Button>
//                 ))}
//             </div>

//             <div className="space-x-2">
//               {select ? (
//                 <>
//                   <Button
//                     onClick={async () => {
//                       toggleSelect()

//                       for (const book of selectedBooks) {
//                         const remoteFile = remoteFiles?.find(
//                           (f) => f.name === book.name,
//                         )
//                         if (remoteFile) continue

//                         const file = await db?.files.get(book.id)
//                         if (!file) continue

//                         setLoading(book.id)
//                         await dbx.filesUpload({
//                           path: `/files/${book.name}`,
//                           contents: file.file,
//                         })
//                         setLoading(undefined)

//                         mutateRemoteFiles()
//                       }
//                     }}
//                   >
//                     {'Upload'}
//                   </Button>
//                   <Button
//                     onClick={async () => {
//                       toggleSelect()
//                       const bookIds = [...selectedBookIds]

//                       db?.books.bulkDelete(bookIds)
//                       db?.covers.bulkDelete(bookIds)
//                       db?.files.bulkDelete(bookIds)

//                       // folder data is not updated after `filesDeleteBatch`
//                       mutateRemoteFiles(
//                         async (data) => {
//                           await dbx.filesDeleteBatch({
//                             entries: selectedBooks.map((b) => ({
//                               path: `/files/${b.name}`,
//                             })),
//                           })
//                           return data?.filter(
//                             (f) =>
//                               !selectedBooks.find((b) => b.name === f.name),
//                           )
//                         },
//                         { revalidate: false },
//                       )
//                     }}
//                   >
//                     {'Delete'}
//                   </Button>
//                 </>
//               ) : (
//                 <>
//                   <Button
//                     variant="secondary"
//                     disabled={!books.length}
//                     onClick={pack}
//                   >
//                     {'Export'}
//                   </Button>
//                   <Button className="relative">
//                     <input
//                       type="file"
//                       accept="application/epub+zip,application/epub,application/zip"
//                       className="absolute inset-0 cursor-pointer opacity-0"
//                       onChange={(e) => {
//                         const files = e.target.files
//                         if (files) handleFiles(files)
//                       }}
//                     />
//                     {'Import'}
//                   </Button>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//         <div className="scroll h-full">
//           <ul
//             className="grid"
//             style={{
//               gridTemplateColumns: `repeat(auto-fill, minmax(calc(80px + 3vw), 1fr))`,
//               columnGap: lock(16, 32),
//               rowGap: lock(24, 40),
//             }}
//           >
//             {books.map((book) => (
//               <Book
//                 key={book.id}
//                 book={book}
//                 covers={covers}
//                 select={select}
//                 selected={has(book.id)}
//                 loading={loading === book.id}
//                 toggle={toggle}
//               />
//             ))}
//           </ul>
//         </div>
//       </>
//     </DropZone>
//   )
// }
