export interface Highlight {
  Bookkey: string
  accessTime: string
  createTime: string
  color: string
  paragraphCfi: string
  cfiRange: string
  chapterName: string
  pageNum: number
  content: string
  modifyTime: string
  type: string
  note: string
}

export interface Color {
  name: string
  code: string
}

export interface ManageHighlightPayload extends Highlight {}

export interface ManageHighlightResponse extends Highlight {
  Id: string
  bookId: string
  userId: string
}

export interface ManageHighlightQuery {
  bookId: string | number
  HighlightId: string
}

export default Highlight
