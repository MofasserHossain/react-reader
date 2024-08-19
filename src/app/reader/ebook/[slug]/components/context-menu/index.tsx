import { Button } from '@/components/ui/button'
import palette from '@/constants/palette'
import { getParagraphCfi } from '@/lib/commonUtil'
import { cn, copy } from '@/lib/utils'
import { contextmenuWidth } from '@/styles/viewerLayout'
import { AddHighlight, HighlightComment } from '@/types/epub/epub'
import Highlight, { ManageHighlightResponse } from '@/types/epub/highlight'
import { useAppStore } from '@/zustand/state'
import { CopyIcon, Pencil, SquarePlus } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import Item from './item'
import Wrapper from './wrapper'

const actions = [
  {
    label: 'Copy',
    icon: CopyIcon,
    type: 'copy',
  },
  // {
  //   label: 'Search',
  //   icon: SearchIcon,
  //   type: 'search',
  // },
  {
    label: 'Annotation',
    icon: Pencil,
    type: 'annotation',
  },
  {
    label: 'Define',
    icon: SquarePlus,
    type: 'define',
  },
]

interface Props {
  active: boolean
  viewerRef: any
  // selection: Selection
  onAddHighlight: (payload: AddHighlight) => void
  onRemoveHighlight: (payload: AddHighlight | ManageHighlightResponse) => void
  onUpdateHighlight: (
    highlight: Highlight | ManageHighlightResponse | null,
    payload: AddHighlight,
  ) => void
  onContextmMenuRemove: () => void
}

const ContextMenu = ({
  active,
  viewerRef,
  // selection,
  onAddHighlight,
  onRemoveHighlight,
  onUpdateHighlight,
  onContextmMenuRemove,
}: Props) => {
  const [comment, setComment] = useState<HighlightComment | null>(null)
  const [defaultSection, setDefaultSection] = useState<number[]>([
    contextmenuWidth,
    170,
  ])
  const selection = useAppStore((state) => state.selection)
  // console.log(`\n\n ~ selection:`, selection)
  const highlights = useAppStore((state) => state.highlights)
  // console.log(`\n\n ~ highlights:`, highlights)
  const colorList = useAppStore((state) => state.colorList)

  const menuRef = useRef<HTMLDivElement | null>(null)

  const [highlight, setHighlight] = useState<Highlight | null>(null)
  // console.log(`\n\n ~ highlight:`, highlight)

  const [display, setDisplay] = useState<boolean>(false)
  const [isEraseBtn, setIsEraseBtn] = useState<boolean>(false)
  const [isReverse, setIsReverse] = useState<boolean>(false)

  const [height, setHeight] = useState<number>(0)
  const [y, setY] = useState<number>(selection.y)

  /** Remove highlight */
  const onRemoveHighlight_ = useCallback(() => {
    if (!highlight) return
    onRemoveHighlight(highlight as AddHighlight)
    onContextmMenuRemove()
    setIsEraseBtn(false)
  }, [highlight, onRemoveHighlight, onContextmMenuRemove])

  const reset = () => {
    setDefaultSection([contextmenuWidth, 170])
    setIsEraseBtn(false)
    setComment(null)
    setHighlight(null)
  }

  const resetWithContext = useCallback(() => {
    reset()
    onContextmMenuRemove()
  }, [onContextmMenuRemove])

  /**
   * Remove contextmenu
   * @param e Mouse Event
   * @param e.path
   */
  const onRemove = useCallback(
    ({ path, target }: any) => {
      if (!menuRef.current) return
      if (!menuRef.current.contains(target as Node)) {
        console.log(`\n\n ~ path:`, path, target)
        reset()
        return onContextmMenuRemove()
      }
      // if ([...path].includes(menuRef.current)) return
      // onContextmMenuRemove()
    },
    [menuRef, onContextmMenuRemove],
  )

  const resetComment = useCallback(() => {
    setComment(null)
    setDefaultSection([contextmenuWidth, 170])
  }, [])

  /**
   * Arrow event
   * @param e Keyboard Event
   * @param e.key
   */
  const onKeyPress = useCallback(
    ({ key }: any) => {
      if (comment) return
      key && key === 'ArrowLeft' && resetWithContext()
      key && key === 'ArrowRight' && resetWithContext()
    },
    [resetWithContext, comment],
  )

  /** Check whether the menu button is visible */
  useEffect(() => {
    if (!active) setIsEraseBtn(false)
    const paragraphCfi = getParagraphCfi(selection.cfiRange)
    if (!paragraphCfi) return
    const filtered = highlights.filter(
      (highlight) => highlight.Bookkey === paragraphCfi + selection.cfiRange,
    )
    if (!filtered.length) return
    const highlight_ = filtered[0]
    // console.log(`\n\n ~ useEffect ~ highlight_:`, highlight_)
    if (highlight?.type === 'comment') {
      setComment({
        text: highlight?.note,
        color: highlight.color,
      })
    }
    setHighlight(highlight_)
    if (selection.update) {
      setIsEraseBtn(true)
    } else {
      setIsEraseBtn(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, highlights, selection.cfiRange, selection.update, setComment])

  /** Register contextmenu events */
  useEffect(() => {
    if (!viewerRef.current) return
    const iframe = document.querySelector('iframe')
    const node = iframe && iframe.contentWindow && iframe.contentWindow.document
    const scrolledTarget = viewerRef.current.querySelector('div')
    if (active) {
      setDisplay(true)
      scrolledTarget &&
        scrolledTarget.addEventListener('scroll', onContextmMenuRemove)
      node && node.addEventListener('mousedown', onRemove)
      node && node.addEventListener('keyup', onKeyPress)
      document.addEventListener('mousedown', onRemove)
      document.addEventListener('keyup', onKeyPress)
    } else {
      setDisplay(false)
      scrolledTarget &&
        scrolledTarget.removeEventListener('scroll', onContextmMenuRemove)
      node && node.removeEventListener('mousedown', onRemove)
      node && node.removeEventListener('keyup', onKeyPress)
      document.removeEventListener('mousedown', onRemove)
      document.removeEventListener('keyup', onKeyPress)
    }

    return () => {
      node && node.removeEventListener('mousedown', onContextmMenuRemove)
      node && node.removeEventListener('keyup', onKeyPress)
      document.removeEventListener('keyup', onKeyPress)
    }
  }, [viewerRef, active, onRemove, onContextmMenuRemove, onKeyPress])

  /** Set modified contextmenu height & whether menu is reverse */
  useEffect(() => {
    let y_ = selection.y
    const { innerHeight } = window
    let height_ = defaultSection[1]
    if (!isEraseBtn) height_ -= 30
    if (selection.y + height_ > innerHeight) {
      y_ = selection.y - selection.height - height_
      if (y_ < 0) {
        setHeight(height_ + y_ - 8)
        y_ = 8
      } else {
        setHeight(height_)
      }
      setIsReverse(true)
    } else {
      setHeight(height_)
      setIsReverse(false)
    }
    setY(y_)
  }, [
    selection.y,
    selection.height,
    colorList,
    isEraseBtn,
    setHeight,
    defaultSection,
  ])

  // const activeSelection = highlights?.find((el) => el?.key === highlight?.key)
  // console.log(`\n\n ~ highlight:`, height, selection)
  return (
    <>
      {display && (
        <Wrapper
          x={selection.x}
          y={y}
          width={defaultSection[0]}
          height={'auto'}
          isReverse={isReverse}
          ref={menuRef}
        >
          <div
            className={cn(
              'h-full space-y-2 rounded-md bg-white p-4 shadow-lg',
              comment ? 'flex flex-col' : '',
            )}
          >
            {comment ? (
              <>
                <textarea
                  value={comment.text}
                  onChange={(e) =>
                    setComment({ ...comment, text: e.target.value })
                  }
                  placeholder="Add a note..."
                  className="w-full flex-1 rounded-md border border-gray-200 p-2 focus-visible:outline-0"
                />
                <div className="flex flex-wrap gap-2">
                  {colorList.map((color) => (
                    <button
                      onClick={() =>
                        setComment({ ...comment, color: color.code })
                      }
                      title={color.name}
                      className={cn(
                        'relative flex h-6 w-[19%] flex-1 items-center justify-center rounded-md transition-all duration-200',
                        comment?.color === color?.code &&
                          `ring-2 ring-[${comment?.color}] scale-105 ring-opacity-50`,
                      )}
                      key={color.code}
                      style={{ backgroundColor: color?.code }}
                    >
                      <span className="text-xs font-medium text-white">A</span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex space-x-1">
                {actions.map((action) => (
                  <Button
                    key={action.label}
                    title={action.label}
                    onClick={() => {
                      if (action?.type === 'copy') {
                        copy(selection?.content)
                      } else if (action?.type === 'annotation') {
                        setDefaultSection([400, 300])
                        setComment({
                          text: '',
                          color: palette.yellow4,
                        })
                      } else {
                        // console.log(`\n\n ~ action:`, action?.type)
                        if (selection.update)
                          onUpdateHighlight(highlight, {
                            color: palette.gray4,
                            type: 'define',
                            note: '',
                          })
                        else
                          onAddHighlight({
                            color: palette.gray4,
                            type: 'define',
                            note: '',
                          })
                        // console.log(`\n\n ~ action:`, action)
                      }
                    }}
                    variant={'ghost'}
                    // className="rounded p-2 hover:bg-gray-200"
                  >
                    <action.icon className="h-5 w-5 text-gray-600" />
                  </Button>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {comment ? (
                <>
                  <div className="flex w-full items-center justify-between gap-2">
                    <Button
                      onClick={(e) => {
                        if (comment.text && selection.update) {
                          onRemove(e)
                        }
                        resetComment()
                      }}
                      variant={'outline'}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        if (!comment.text)
                          return toast.error('Please add a note')
                        if (selection.update) {
                          onUpdateHighlight(highlight, {
                            color: comment.color,
                            type: 'comment',
                            note: comment.text,
                          })
                        } else {
                          onAddHighlight({
                            color: comment.color,
                            type: 'comment',
                            note: comment.text,
                          })
                        }
                        reset()
                      }}
                    >
                      {selection?.update ? 'Update' : 'Create'}
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  {colorList.map((color) => (
                    <button
                      onClick={
                        selection.update
                          ? () =>
                              onUpdateHighlight(highlight, {
                                color: color.code,
                                type: 'highlight',
                                note: '',
                              })
                          : () =>
                              onAddHighlight({
                                color: color.code,
                                type: 'highlight',
                                note: '',
                              })
                      }
                      title={color.name}
                      className={cn(
                        'relative flex h-6 w-[21%] items-center justify-center rounded-md',
                        highlight?.color === color?.code &&
                          `ring-2 ring-[${highlight?.color}] ring-opacity-50`,
                      )}
                      key={color.code}
                      style={{ backgroundColor: color?.code }}
                    >
                      <span className="text-xs font-medium text-white">A</span>
                    </button>
                  ))}
                  {isEraseBtn && (
                    <Item text="Remove" onClick={onRemoveHighlight_} />
                  )}
                </>
              )}
            </div>
          </div>
          {/* <div>
            {ColorList}
            </div> */}
        </Wrapper>
      )}
    </>
  )
}

export default ContextMenu
