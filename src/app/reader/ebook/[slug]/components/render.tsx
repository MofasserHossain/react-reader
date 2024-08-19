'use client'
import useHighlight from '@/hooks/useHighlight'
import useMenu from '@/hooks/useMenu'
// import epubjs from 'epubjs'
import useEventListener from '@/hooks/useEventListener'
import ReactEpubViewer from '@/package/ebook/react-epub-viewer'
import viewerLayout from '@/styles/viewerLayout'
import { BookOption, BookStyle, ViewerRef } from '@/types'
import Book from '@/types/epub/book'
import Page from '@/types/epub/page'
import Toc from '@/types/epub/toc'
import { useAppStore } from '@/zustand/state'
import { useRef } from 'react'
import ContextMenu from './context-menu'
import Footer from './footer'
import Header from './header'
import Learning from './menu/note'
import Option from './menu/option'

type Props = {
  url: string
  loadingView?: React.ReactNode
}

const Render = ({ url, loadingView }: Props) => {
  const currentLocation = useAppStore((state) => state.currentLocation)
  const updateBook = useAppStore((state) => state.updateBook)
  const updateCurrentPage = useAppStore((state) => state.updateCurrentPage)
  const updateToc = useAppStore((state) => state.updateToc)
  const bookStyle = useAppStore((state) => state.bookStyle)
  const setBookStyle = useAppStore((state) => state.updateBookStyle)
  const bookOption = useAppStore((state) => state.bookOption)
  const isContextMenu = useAppStore((state) => state.isContextMenu)
  const setIsContextMenu = useAppStore((state) => state.setIsContextMenu)
  const setBookOption = useAppStore((state) => state.updateBookOption)
  const viewerRef = useRef<ViewerRef | any>(null)
  // console.log(`\n\n ~ Render ~ viewerRef:`, viewerRef)
  const navRef = useRef<HTMLDivElement | null>(null)
  const optionRef = useRef<HTMLDivElement | null>(null)
  const learningRef = useRef<HTMLDivElement | null>(null)
  // const [isContextMenu, setIsContextMenu] = useState<boolean>(false)
  const [navControl, onNavToggle] = useMenu(navRef, 300)
  const [optionControl, onOptionToggle, emitEvent] = useMenu(optionRef, 300)
  const [learningControl, onLearningToggle] = useMenu(learningRef, 300)

  const {
    onSelection,
    onClickHighlight,
    onAddHighlight,
    onRemoveHighlight,
    onUpdateHighlight,
    resetSelection,
  } = useHighlight(viewerRef, setIsContextMenu, bookStyle, bookOption.flow)
  // console.log(`\n\n ~ Render ~ selection:`, selection)

  /**
   * Change Epub book information
   * @param book Epub Book Info
   */
  const onBookInfoChange = (book: Book) => updateBook(book)

  /**
   * Change Epub location
   * @param loc epubCFI or href
   */
  const onLocationChange = (loc: string) => {
    if (!viewerRef.current) return
    viewerRef.current.setLocation(loc)
  }

  /**
   * Move page
   * @param type Direction
   */
  const onPageMove = (type: 'PREV' | 'NEXT') => {
    const node = viewerRef.current
    if (!node || !node.prevPage || !node.nextPage) return

    type === 'PREV' && node.prevPage()
    type === 'NEXT' && node.nextPage()
  }

  /**
   * Set toc
   * @param toc Table of Epub contents
   */
  const onTocChange = (toc: Toc[]) => {
    // console.log(`\n\n ~ Render ~ toc:`, toc)
    updateToc(toc)
  }

  /**
   * Set Epub viewer styles
   * @param bokkStyle_ viewer style
   */
  const onBookStyleChange = (bookStyle_: BookStyle) => setBookStyle(bookStyle_)

  /**
   * Set Epub viewer options
   * @param bookOption_ viewer option
   */
  const onBookOptionChange = (bookOption_: BookOption) =>
    setBookOption(bookOption_)

  /**
   * Change current page
   * @param page Epub page
   */
  const onPageChange = (page: Page) => updateCurrentPage(page)

  /**
   * ContextMenu on
   * @param cfiRange CfiRange
   */
  const onContextMenu = (cfiRange: string) => {
    // console.log(`\n\n ~ Render ~ cfiRange:`, cfiRange)
    const result = onSelection(cfiRange)
    setIsContextMenu(result)
  }

  /** ContextMenu off */
  const onContextMenuRemove = () => {
    resetSelection()
    setIsContextMenu(false)
  }

  const getModifiedContent = async () => {}

  /**
   * Handle keydown event
   * @param e KeyboardEvent
   */
  function handleKeyDown(e: KeyboardEvent) {
    if (isContextMenu) return
    const node = viewerRef.current
    if (!node || !node.prevPage || !node.nextPage) return

    try {
      switch (e.code) {
        case 'ArrowLeft':
        case 'ArrowUp':
          node?.prevPage()
          break
        case 'ArrowRight':
        case 'ArrowDown':
          node?.nextPage()
          break
        case 'Space':
          e.shiftKey ? node?.prevPage() : node?.nextPage()
      }
    } catch (error) {
      // ignore `rendition is undefined` error
    }
  }

  useEventListener('keyup', (e) => handleKeyDown(e))

  return (
    <>
      <div className="scrollbar-hide relative flex h-screen w-screen flex-col overflow-x-hidden">
        <Header
          onNavToggle={onNavToggle}
          onOptionToggle={onOptionToggle}
          onLearningToggle={onLearningToggle}
          saveEpub={getModifiedContent}
        />

        <ReactEpubViewer
          url={url}
          viewerLayout={viewerLayout}
          viewerStyle={bookStyle}
          viewerOption={bookOption}
          onBookInfoChange={onBookInfoChange}
          onPageChange={onPageChange}
          onTocChange={onTocChange}
          onSelection={onContextMenu}
          loadingView={loadingView || <div>Loading...</div>}
          ref={viewerRef}
        />
        <Footer
          title={currentLocation.chapterName}
          nowPage={currentLocation.currentPage}
          totalPage={currentLocation.totalPage}
          onPageMove={onPageMove}
          onOptionToggle={onOptionToggle}
          onLearningToggle={onLearningToggle}
        />
      </div>

      {/* Content */}
      {/* <Nav
        control={navControl}
        onToggle={onNavToggle}
        onLocation={onLocationChange}
        ref={navRef}
      /> */}

      {/* Settings */}
      <Option
        control={optionControl}
        bookStyle={bookStyle}
        bookOption={bookOption}
        bookFlow={bookOption.flow}
        onToggle={onOptionToggle}
        emitEvent={emitEvent}
        onBookStyleChange={onBookStyleChange}
        onBookOptionChange={onBookOptionChange}
        ref={optionRef}
      />

      {/* Highlight */}
      <Learning
        control={learningControl}
        onToggle={onLearningToggle}
        onClickHighlight={onClickHighlight}
        emitEvent={onLearningToggle}
        onRemoveHighlight={onRemoveHighlight}
        viewerRef={viewerRef}
        ref={learningRef}
      />

      {/* Context Menu */}
      <ContextMenu
        active={isContextMenu}
        viewerRef={viewerRef}
        // selection={selection}
        onAddHighlight={onAddHighlight}
        onRemoveHighlight={onRemoveHighlight}
        onUpdateHighlight={onUpdateHighlight}
        onContextmMenuRemove={onContextMenuRemove}
      />
    </>
  )
}

export default Render
