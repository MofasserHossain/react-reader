// types
import palette from '@/styles/palette'
import { ProductResponse } from '@/types'
import Book, { BookOption, BookStyle } from '@/types/epub/book'
import Highlight, {
  Color,
  ManageHighlightResponse,
} from '@/types/epub/highlight'
import Page from '@/types/epub/page'
import Selection from '@/types/epub/selection'
import Toc from '@/types/epub/toc'
import { StateCreator } from 'zustand'
import { immer } from 'zustand/middleware/immer'

const initialBook: Book = {
  coverURL: '',
  title: '',
  description: '',
  published_date: '',
  modified_date: '',
  author: '',
  publisher: '',
  language: '',
}

const initialCurrentLocation: Page = {
  chapterName: '-',
  currentPage: 0,
  totalPage: 0,
  startCfi: '',
  endCfi: '',
  base: '',
}

const initialColorList: Color[] = [
  { name: 'Red', code: palette.red4 },
  { name: 'Orange', code: palette.orange4 },
  { name: 'Yellow', code: palette.yellow4 },
  { name: 'Green', code: palette.green4 },
  { name: 'Blue', code: palette.blue4 },
  { name: 'Gray', code: palette.gray4 },
  { name: 'Purple', code: palette.purple4 },
  { name: 'Pink', code: palette.pink4 },
]

export interface BookState {
  book: Book
  currentLocation: Page
  toc: Toc[]
  highlights: Highlight[]
  colorList: Color[]
  drawer: boolean
  type: string
  bookStyle: BookStyle
  bookOption: BookOption
  isContextMenu: boolean
  isComment: boolean
  selection: Selection
  selectedBook: ProductResponse | null
  submitting: boolean
  setSubmitting: (submitting: boolean) => void
  setSelection: (selection: Selection) => void
  setIsComment: (isComment: boolean) => void
  updateBook: (book: Book) => void
  updateCurrentPage: (page: Page) => void
  clearBook: () => void
  updateToc: (toc: Toc[]) => void
  clearToc: () => void
  pushHighlight: (highlight: Highlight) => void
  updateHighlight: (highlight: Highlight) => void
  popHighlight: (key: string) => void
  openDrawer: (type?: string) => void
  closeDrawer: () => void
  updateBookStyle: (style: BookStyle) => void
  updateBookOption: (option: BookOption) => void
  setIsContextMenu: (isContextMenu: boolean) => void
  setSelectedBook: (book: ProductResponse | null) => void
  storeHighlight: (highlight: ManageHighlightResponse[]) => void
}

const bookSlice: StateCreator<
  BookState,
  [],
  [['zustand/immer', never]],
  BookState
> = immer((set) => ({
  book: initialBook,
  currentLocation: initialCurrentLocation,
  toc: [],
  highlights: [],
  colorList: initialColorList,
  drawer: false,
  type: '',
  selectedBook: null,
  selection: {
    update: false,
    x: 0,
    y: 0,
    height: 0,
    cfiRange: '',
    content: '',
  },
  bookStyle: {
    fontFamily: 'Origin',
    fontSize: 18,
    fontWeight: 400,
    lineHeight: 1.4,
    marginHorizontal: 15,
    marginVertical: 5,
  },
  bookOption: {
    flow: 'paginated',
    resizeOnOrientationChange: true,
    spread: 'auto',
  },
  isContextMenu: false,
  isComment: false,
  submitting: false,
  storeHighlight: (highlight: ManageHighlightResponse[]) =>
    set((state) => {
      state.highlights = highlight
    }),
  setSubmitting: (submitting: boolean) =>
    set((state) => {
      state.submitting = submitting
    }),
  setSelectedBook: (book: ProductResponse | null) =>
    set((state) => {
      state.selectedBook = book
    }),
  setIsComment: (isComment: boolean) =>
    set((state) => {
      state.isComment = isComment
    }),
  setSelection: (selection: Selection) =>
    set((state) => {
      state.selection = selection
    }),
  updateBook: (book: Book) => set({ book }),
  updateCurrentPage: (page: Page) => set({ currentLocation: page }),
  clearBook: () => set({ book: initialBook }),
  updateToc: (toc: Toc[]) => set({ toc }),
  clearToc: () => set({ toc: [] }),
  pushHighlight: (highlight: Highlight) =>
    set((state) => {
      const exists = state.highlights.some(
        (h) => h.Bookkey === highlight.Bookkey,
      )
      if (exists) return state
      state.highlights = [...state.highlights, highlight]
      //   return { highlights: [...state.highlights, highlight] }
    }),
  updateHighlight: (highlight: Highlight) =>
    set((state) => {
      const highlights = state.highlights.map((h) =>
        h.Bookkey === highlight.Bookkey ? highlight : h,
      )
      state.highlights = highlights
      //   return { highlights }
    }),
  popHighlight: (key: string) =>
    set((state) => {
      const highlights = state.highlights.filter((h) => h.Bookkey !== key)
      //   return { highlights }
      state.highlights = highlights
    }),
  openDrawer: (type?: string) =>
    set((state) => {
      state.drawer = true
      state.type = type || ''
    }),
  closeDrawer: () =>
    set((state) => {
      state.drawer = false
      state.type = ''
    }),

  updateBookStyle: (style: BookStyle) =>
    set((state) => {
      state.bookStyle = style
    }),

  updateBookOption: (option: BookOption) =>
    set((state) => {
      state.bookOption = option
    }),

  setIsContextMenu: (isContextMenu: boolean) =>
    set((state) => {
      state.isContextMenu = isContextMenu
    }),
}))

export default bookSlice
