// components
import palette from '@/constants/palette'
import Post from '../note/content'
// types
import { cfiRangeSpliter } from '@/lib/commonUtil'
import { cn, truncate } from '@/lib/utils'
import HighlightType from '@/types/epub/highlight'
import { useAppStore } from '@/zustand/state'
import { X } from 'lucide-react'

const Highlight = ({
  highlight,
  onClick,
  emitEvent,
  viewerRef,
  handleRemove,
}: Props) => {
  // console.log(`\n\n ~ Highlight ~ highlight:`, viewerRef?.current)
  const updateHighlight = useAppStore((state) => state.updateHighlight)

  const onClickHighlight = () => {
    if (!viewerRef?.current) return
    const now = new Date().toISOString()
    updateHighlight({
      ...highlight,
      accessTime: now,
    })
    const splitCfi = cfiRangeSpliter(highlight.cfiRange)
    // console.log(`\n\n ~ onClickHighlight ~ splitCfi:`, splitCfi)
    if (!splitCfi) return
    const { startCfi } = splitCfi
    viewerRef?.current?.setLocation(startCfi)
    emitEvent()
    const svgContainer = viewerRef.current.querySelector('svg')
    if (!svgContainer) return
    const targetSvg = svgContainer.querySelector(
      `g[data-epubcfi="${highlight.cfiRange}"]`,
    )
    if (!targetSvg) return

    onClick(targetSvg.childNodes[0])
  }

  return (
    <button
      // ref={ref}
      className={cn(
        'relative flex w-full cursor-pointer items-start justify-start border-b border-gray-200 bg-gray-50 p-4 pl-6 text-left outline-none transition-all duration-100',
        '',
      )}
      onClick={onClickHighlight}
    >
      {/* Delete Cross */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          handleRemove()
        }}
        className="absolute right-2 top-2"
      >
        <X size={16} />
      </button>
      <div className="flex-grow text-inherit">
        <div>
          <div className="text-sm font-bold text-inherit">
            {highlight.chapterName}
          </div>
          <Post color={highlight.color}>
            {truncate(highlight.content, 150)}
          </Post>
          {highlight.note && (
            <Post color={palette.gray1}>{truncate(highlight.note, 110)}</Post>
          )}
        </div>
      </div>
    </button>
  )
}

interface Props {
  highlight: HighlightType
  onClick: (highlightNode: any) => void
  emitEvent: () => void
  handleRemove: () => void
  viewerRef: any
}

export default Highlight
