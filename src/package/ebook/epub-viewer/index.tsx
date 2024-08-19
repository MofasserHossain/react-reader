import Epub, { Book, Rendition } from 'epubjs'
import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
// style
import styles from './styles'
// types
import { getImageFromUrl } from '@/app/_api/ebook.api'
import { base64ToArrayBuffer } from '@/lib/utils'
import { EpubViewerProps, ViewerRef } from '@/types/epub'
import Loc from '@/types/epub/loc'
import Toc from '@/types/epub/toc'

/**
 * EpubViewer Module
 * @class
 * @param props
 * @param props.url Epub path
 * @param props.epubFileOptions Epub file option
 * @param props.epubOptions Epub viewer option
 * @param props.style Epub Wrapper style
 * @param props.location Epub CFI or href
 * @param props.bookChanged Run when book changed
 * @param props.rendtionChanged Run when rendition changed
 * @param props.pageChanged Run when page changed
 * @param props.tocChanged Run when toc changed
 * @param props.selectionChanged Run when selected
 * @param props.loadingView Loading Component
 * @param ref Viewer ref
 */
const EpubViewer = (
  {
    url,
    epubFileOptions,
    epubOptions,
    style,
    location,
    bookChanged,
    rendtionChanged,
    pageChanged,
    tocChanged,
    selectionChanged,
    loadingView,
  }: EpubViewerProps,
  ref: React.RefObject<ViewerRef> | any,
) => {
  // TODO Fix the ref type correctly instead 'any' type.
  const viewerStyle: CSSProperties = style ? { ...styles, ...style } : styles

  const [isLoaded, setIsLoaded] = useState(false)

  const [book, setBook] = useState<Book | null>(null)

  const [rendition, setRendition] = useState<Rendition | null>(null)

  const currentCfi = useRef<string>('')

  /**
   * Move page
   * @method
   * @param type direction
   */
  const movePage = useCallback(
    (type: 'PREV' | 'NEXT') => {
      if (!rendition) return
      if (type === 'PREV') rendition.prev()
      else rendition.next()
    },
    [rendition],
  )

  /**
   * Move page by arrow key
   * @method
   * @param props Keyboard Event
   * @param props.key
   */
  const handleKeyPress = useCallback(
    ({ key }: any) => {
      key && key === 'ArrowLeft' && movePage('PREV')
      key && key === 'ArrowRight' && movePage('NEXT')
    },
    [movePage],
  )

  /**
   * Run when location changed
   * @method
   * @param loc
   * - Set location state
   * - Run 'locationChanged()' through startCFI
   */
  const onLocationChange = useCallback(
    (loc: Loc) => {
      const startCfi = loc && loc.start
      const endCfi = loc && loc.end
      const base = loc && loc.start.slice(8).split('!')[0]

      if (!book) return

      const spineItem = book.spine.get(startCfi)
      const navItem = book.navigation.get(spineItem.href)
      const chapterName = navItem && navItem.label.trim()

      const locations: any = book.locations
      const currentPage = locations.locationFromCfi(startCfi)
      const totalPage = locations.total

      pageChanged &&
        pageChanged({
          chapterName,
          currentPage,
          totalPage,
          startCfi,
          endCfi,
          base,
        })

      currentCfi.current = startCfi
    },
    [book, pageChanged],
  )

  /**
   * Highlight function
   * @param cfiRange Selected CFIRange
   * @param callback Highlight callback function when click it
   * @param color Highlight color
   */
  const onHighlight = useCallback(
    (cfiRange: string, callback?: (e: any) => void, color?: string) => {
      if (!rendition) return
      rendition.annotations.remove(cfiRange, 'highlight')
      rendition.annotations.highlight(
        cfiRange,
        {},
        callback,
        'epub-highlight',
        {
          fill: color || '#fdf183',
        },
      )
    },
    [rendition],
  )

  /**
   * Highlight remove function
   * @param cfiRange Selected CFIRange
   */
  const onRemoveHighlight = useCallback(
    (cfiRange: string) => {
      if (!rendition) return
      rendition.annotations.remove(cfiRange, 'highlight')
    },
    [rendition],
  )

  const registerGlobalFunc = useCallback(() => {
    if (!ref.current) return
    if (movePage) {
      ref.current.prevPage = () => movePage('PREV')
      ref.current.nextPage = () => movePage('NEXT')
    }
    ref.current.getCurrentCfi = () => currentCfi.current
    if (onHighlight) {
      ref.current.onHighlight = onHighlight
    }
    if (onRemoveHighlight) {
      ref.current.offHighlight = onRemoveHighlight
    }
    if (rendition) {
      ref.current.setLocation = (location: string) =>
        rendition.display(location)
    }
  }, [ref, rendition, movePage, onHighlight, onRemoveHighlight])

  /** Ref Checker */
  useEffect(() => {
    if (!ref) {
      throw new Error(
        '[React-Epub-Viewer] Put a ref argument that has a ViewerRef type.',
      )
    }
  }, [ref])

  /** Epub init options Changed */
  useEffect(() => {
    if (!url) return
    let mounted: boolean = true
    let book_: Book | any = null
    if (!mounted) return
    if (book_) {
      book_.destroy()
    }
    const getData = async () => {
      const base64String = await getImageFromUrl(url)
      const getName = url?.split('/')?.pop() ?? 'book1.epub'
      const arrayBuffer = base64ToArrayBuffer(base64String)
      const blob = new Blob([arrayBuffer], { type: 'application/epub+zip' })
      const file = new File([blob], getName, {
        type: 'application/epub+zip',
      })
      const data = await file.arrayBuffer()
      book_ = Epub(data, epubFileOptions)
      setBook(book_)
    }
    getData()
    return () => {
      mounted = false
    }
  }, [url, epubFileOptions, setBook, setIsLoaded])

  /** Book Changed */
  useEffect(() => {
    if (!book) return
    if (bookChanged) bookChanged(book)
    book.loaded.navigation.then(({ toc, ...rest }) => {
      const toc_: Toc[] = toc.map((t) => ({
        label: t.label,
        href: t.href,
      }))
      // console.log(`\n\n  ~ rest:`, rest, toc_)
      setIsLoaded(true)
      if (tocChanged) tocChanged(toc_)
    })
    book.ready
      .then(function () {
        if (!book) return
        const stored = localStorage.getItem(book.key() + '-locations')
        if (stored) {
          return book.locations.load(stored)
        } else {
          return book.locations.generate(1024)
        }
      })
      .then(() => {
        if (!book) return
        localStorage.setItem(book.key() + '-locations', book.locations.save())
      })
  }, [book, bookChanged, tocChanged])

  /** Rendition Changed */
  useEffect(() => {
    if (!rendition) return
    if (rendtionChanged) rendtionChanged(rendition)
  }, [rendition, rendtionChanged])

  /** Viewer Option Changed */
  useEffect(() => {
    let mounted = true
    if (!book) return

    const node = ref.current
    if (!node) return
    node.innerHTML = ''

    book.ready.then(function () {
      if (!mounted) return

      if (book.spine) {
        const loc = book.rendition?.location?.start?.cfi
        // if (book.rendition) book.rendition.destroy();
        const rendition_ = book.renderTo(node, {
          width: '100%',
          height: '100%',
          ...epubOptions,
        })
        setRendition(rendition_)

        if (loc) {
          rendition_.display(loc)
        } else {
          rendition_.display()
        }
      }
    })

    return () => {
      mounted = false
    }
  }, [ref, book, epubOptions, style, setRendition])

  /** Location Changed */
  useEffect(() => {
    if (!ref.current || !location) return
    if (ref.current.setLocation) ref.current.setLocation(location)
  }, [ref, location])

  /**
   * Emit Viewer Event
   * - Register move event
   * - Register location changed event
   * - Register selection event
   */
  /* eslint-disable */
  useEffect(() => {
    if (!rendition) return

    // Emit global control function
    registerGlobalFunc()

    document.addEventListener('keyup', handleKeyPress, false)
    rendition.on('keyup', handleKeyPress)
    rendition.on('locationChanged', onLocationChange)
    selectionChanged && rendition.on('selected', selectionChanged)

    return () => {
      document.removeEventListener('keyup', handleKeyPress, false)
      rendition.off('keyup', handleKeyPress)
      rendition.off('locationChanged', onLocationChange)
      selectionChanged && rendition.off('selected', selectionChanged)
    }
  }, [rendition, registerGlobalFunc, handleKeyPress])
  /* eslint-enable */

  return (
    <>
      {!isLoaded && loadingView}
      <div ref={ref} style={viewerStyle} />
    </>
  )
}

export default React.forwardRef(EpubViewer)
