import ePub, { Book } from 'epubjs'

import { BookRecord, db } from './db'

export async function fileToEpub(file: File) {
  const data = await file.arrayBuffer()
  return ePub(data)
}

export async function addBook(file: File, bookId: number) {
  const epub = await fileToEpub(file)
  // console.log(`\n\n ~ addBook ~ epub:`, epub)
  const metadata = await epub.loaded.metadata
  const book: BookRecord = {
    id: bookId.toString(),
    name: file.name || `${metadata.title}.epub`,
    size: file.size,
    metadata,
    createdAt: Date.now(),
    definitions: [],
    annotations: [],
  }
  db?.books.add(book)
  addFile(book.id, file, epub)
  return book
}

export async function addFile(id: string, file: File, epub?: Book) {
  db?.files.add({ id, file })

  if (!epub) {
    epub = await fileToEpub(file)
  }

  const url = await epub.coverUrl()
  const cover = url && (await toDataUrl(url))
  db?.covers.add({ id, cover })
}

export function readBlob(fn: (reader: FileReader) => void) {
  return new Promise<string>((resolve) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => {
      resolve(reader.result as string)
    })
    fn(reader)
  })
}

async function toDataUrl(url: string) {
  const res = await fetch(url)
  const buffer = await res.blob()
  return readBlob((r) => r.readAsDataURL(buffer))
}

export async function fetchBook(url: string) {
  const filename = decodeURIComponent(/\/([^/]*\.epub)$/i.exec(url)?.[1] ?? '')
  const books = await db?.books.toArray()
  const book = books?.find((b) => b.name === filename)

  return book
  // ?? fetch(url)
  //   .then((res) => res.blob())
  //   .then((blob) => addBook(new File([blob], filename)), 1)
}
