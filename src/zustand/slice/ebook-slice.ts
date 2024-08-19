import { AnnotationColor, AnnotationType } from '@/lib/epub/annotation'
import { BookRecord, db } from '@/lib/epub/db'
import { fileToEpub } from '@/lib/epub/file'
import { defaultStyle } from '@/lib/epub/styles'
import { INode } from '@/lib/epub/tree'
import Navigation, { NavItem } from '@/types/epub/navigation'
import type { Book, Location, Rendition } from 'epubjs'
import Section from 'epubjs/types/section'
import { v4 as uuidv4 } from 'uuid'
import { create } from 'zustand'

interface ISection extends Section {
  length: number
  images: string[]
  navitem?: NavItem
}

interface IMatch {
  id: string
  excerpt: string
  description: string
  subitems: { id: string; excerpt: string }[]
  expanded: boolean
  cfi?: string
}

export interface INavItem extends NavItem, INode {
  subitems?: INavItem[]
}

interface Annotation {
  id: string
  bookId: string
  cfi: string
  spine: {
    index: number
    title: string
  }
  createAt: number
  updatedAt: number
  type: AnnotationType
  color: AnnotationColor
  notes?: string
  text: string
}

interface ReaderState {
  book: BookRecord | null
  epub: Book | null
  rendition: (Rendition & { manager?: any }) | null
  nav: Navigation | null
  sections: ISection[] | null
  section: ISection | null
  location: Location | null
  iframe?: Window
  keyword: string
  results: IMatch[] | null
  rendered: boolean
  annotationRange?: Range
  timeline: { location: Location; timestamp: number }[]
  locationToReturn: Location | null
  setBook: (book: BookRecord) => void
  loadBook: (el: HTMLDivElement) => Promise<void>
  display: (target?: string, returnable?: boolean) => void
  next: () => void
  prev: () => void
  setKeyword: (keyword: string) => void
  search: () => Promise<void>
  putAnnotation: (
    type: AnnotationType,
    cfi: string,
    color: AnnotationColor,
    text: string,
    notes?: string,
  ) => void
  removeAnnotation: (cfi: string) => void
  updateBook: (changes: Partial<BookRecord>) => void
  setAnnotationRange: (cfi: string) => void
  container(): HTMLDivElement | undefined
  showPrevLocation: () => void
  hidePrevLocation: () => void
  getNavPath(navItem: NavItem | undefined): INavItem[]
}

export const useReaderStore = create<ReaderState>((set, get) => ({
  book: null,
  epub: null,
  rendition: null,
  nav: null,
  sections: null,
  section: null,
  location: null,
  keyword: '',
  results: null,
  rendered: false,
  timeline: [],
  locationToReturn: null,
  container: () => {
    const { rendition } = get()
    return rendition?.manager?.container as HTMLDivElement | undefined
  },
  showPrevLocation() {
    const { location } = get()
    if (!location) return
    set({ locationToReturn: location })
  },
  hidePrevLocation() {
    set({ locationToReturn: null })
  },
  getNavPath(navItem: NavItem | undefined) {
    const path: INavItem[] = []
    if (this.nav) {
      while (navItem) {
        path.unshift(navItem)
        const parentId = navItem.parent
        if (!parentId) {
          navItem = undefined
        } else {
          const index = this?.nav?.tocById[parentId]!
          navItem = this.nav?.getByIndex(parentId, index, this.nav.toc)
        }
      }
    }
    return path
  },
  setBook: (book) => set({ book }),
  loadBook: async (el: HTMLDivElement) => {
    const { book } = get()
    if (!book) return

    const file = await db?.files.get(book.id)
    if (!file) return

    const epub = await fileToEpub(file.file)
    const sections = await epub.loaded.spine.then((spine: any) =>
      Promise.all(
        spine?.spineItems?.map(async (section: ISection) => {
          await section.load(epub.load.bind(epub))
          section.length = section.document.body.textContent?.length ?? 0
          section.images = [...section.document.querySelectorAll('img')].map(
            (el) => el.src,
          )
          return section
        }),
      ),
    )
    const nav = (await epub?.loaded?.navigation) as any
    const rendition = epub.renderTo(el, {
      width: '100%',
      height: '100%',
      allowScriptedContent: true,
    })
    set({ epub, sections, rendition, nav })
    rendition.themes.default(defaultStyle)
    rendition.display(book.cfi ?? undefined)

    rendition.on('relocated', (location: Location) => {
      //   set((state) => ({
      //     rendered: true,
      //     timeline: [{ location, timestamp: Date.now() }, ...state.timeline],
      //   }))
      const start = location.start
      const { sections } = get()
      const section = sections?.find((s) => s.href === start.href)
      if (section && sections) {
        const previousSectionsLength = sections
          .slice(0, sections.indexOf(section))
          .reduce((acc, s) => acc + s.length, 0)
        const currentSectionPercentage =
          section.length / sections.reduce((acc, s) => acc + s.length, 0)
        const displayedPercentage = start.displayed.page / start.displayed.total

        const percentage =
          previousSectionsLength +
          currentSectionPercentage * displayedPercentage

        get().updateBook({ cfi: start.cfi, percentage })
      }
    })
    // this.rendition.on('rendered', (section: ISection, view: any) => {
    //   console.log('rendered', [section, view])
    //   this.section = ref(section)
    //   this.iframe = ref(view.window as any)
    // })
    rendition.on('rendered', (section: ISection, view: any) => {
      set({ section, iframe: view?.window as any })
    })
  },
  display: (target, returnable = true) => {
    const { rendition } = get()
    rendition?.display(target)
    if (returnable) get()?.showPrevLocation()
  },
  next: () => {
    const { rendition } = get()
    rendition?.next()
  },
  prev: () => {
    const { rendition, container } = get()
    rendition?.prev()
    if (container()?.scrollLeft === 0 && !get().location?.atStart) {
      set({ rendered: false })
    }
  },
  setKeyword: (keyword) => {
    set({ keyword })
    get().search()
  },
  search: async () => {
    const { keyword, sections } = get()
    if (!keyword || !sections) return

    const results: IMatch[] = []

    sections.forEach((s) => {
      const subitems = s.find(keyword) as unknown as IMatch[]
      if (subitems.length) {
        const navItem = s.navitem
        const path = navItem ? get().getNavPath(navItem) : []
        path.pop()
        results.push({
          id: navItem?.href ?? '',
          excerpt: navItem?.label ?? '',
          description: path.map((i) => i.label).join(' / '),
          subitems: subitems.map((i) => ({ ...i, id: i?.cfi! })),
          expanded: true,
        })
      }
    })

    set({ results })
  },
  putAnnotation: (type, cfi, color, text, notes) => {
    const { book, section } = get()
    if (!section) return

    const now = Date.now()
    const annotation = {
      id: uuidv4(),
      bookId: book!.id,
      cfi,
      spine: {
        index: section.index,
        title: section.navitem?.label ?? '',
      },
      createAt: now,
      updatedAt: now,
      type,
      color,
      notes,
      text,
    }

    get().updateBook({
      annotations: [...book!.annotations, annotation],
    })
  },
  removeAnnotation: (cfi) => {
    get().updateBook({
      annotations: get().book!.annotations.filter((a) => a.cfi !== cfi),
    })
  },
  updateBook: (changes) => {
    const { book } = get()
    if (!book) return

    changes = { ...changes, updatedAt: Date.now() }
    set({ book: { ...book, ...changes } })
    db?.books.update(book.id, changes)
  },
  setAnnotationRange: (cfi) => {
    const { rendition } = get()
    const range = rendition?.manager?.views._views[0]?.contents.range(cfi)
    if (range) set({ annotationRange: range })
  },
}))
