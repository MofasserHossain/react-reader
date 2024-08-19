import React, { useMemo, useState } from 'react'
// containers
import Highlight from './highlight'
// components
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetHeader } from '@/components/ui/sheet'
import { MenuControl } from '@/hooks/useMenu'
import { cn } from '@/lib/utils'
import { ManageHighlightResponse } from '@/types'
import { AddHighlight } from '@/types/epub/epub'
import { useAppStore } from '@/zustand/state'
import Badge from './badge'

const items = ['highlight', 'comment', 'define']

const Note = (
  {
    control,
    onToggle,
    onClickHighlight,
    emitEvent,
    viewerRef,
    onRemoveHighlight,
  }: Props,
  ref: any,
) => {
  const [selectedTab, setSelectedTab] = useState('highlight')
  const [selectedColor, setSelectedColor] = useState('')
  const highlights = useAppStore((state) => state.highlights)
  const colors = useAppStore((state) => state.colorList)

  const getMainCount = (type: string) => {
    return highlights.filter((item) => item.type === type).length
  }

  const highlightList = useMemo(() => {
    let item = [...highlights]
    if (selectedTab) {
      item = item.filter((i) => i.type === selectedTab)
    }
    if (selectedColor && selectedTab !== 'define') {
      item = item.filter((item) => item?.color === selectedColor)
    }
    return item
  }, [selectedTab, selectedColor, highlights])

  return (
    <>
      <Sheet open={control.display} onOpenChange={(open) => onToggle()}>
        <SheetContent side={'right'} className="" ref={ref}>
          <SheetHeader className="mb-4">
            <h3 className="text-xl font-bold">Contents</h3>
            <div className="flex items-center gap-4 pt-3">
              {items.map((item, index) => (
                <Badge key={index} count={getMainCount(item)}>
                  <div
                    onClick={() => setSelectedTab(item)}
                    className={cn(
                      'cursor-pointer border-b text-sm capitalize',
                      selectedTab === item
                        ? 'border-primary font-semibold text-primary'
                        : 'border-transparent',
                    )}
                  >
                    {item}
                  </div>
                </Badge>
              ))}
            </div>
            {selectedTab !== 'define' && (
              <div className="flex items-center gap-4 pt-3">
                {colors.map((color, index) => (
                  <div
                    onClick={() => setSelectedColor(color?.code)}
                    title={color.name}
                    className={cn(
                      'flex h-6 w-6 cursor-pointer items-center justify-center rounded-md text-xs text-white ring-2 transition-all duration-200',
                      selectedColor === color.code
                        ? 'scale-110 ring-primary'
                        : 'ring-transparent',
                    )}
                    style={{ backgroundColor: color?.code }}
                    key={index}
                  >
                    A
                  </div>
                ))}
              </div>
            )}
          </SheetHeader>
          <ScrollArea className="h-[85vh]">
            {highlightList.length > 0 ? (
              highlightList.map((h) => (
                <Highlight
                  key={h?.Bookkey}
                  highlight={h}
                  onClick={onClickHighlight}
                  emitEvent={emitEvent}
                  viewerRef={viewerRef}
                  handleRemove={() => onRemoveHighlight(h as AddHighlight)}
                />
              ))
            ) : (
              <div className="flex-grow-1 flex items-center justify-center text-sm text-blue-400">
                Empty highlight!
              </div>
            )}
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  )
}

interface Props {
  control: MenuControl
  onToggle: () => void
  onClickHighlight: (highlightNode: any) => void
  onRemoveHighlight: (payload: AddHighlight | ManageHighlightResponse) => void
  emitEvent: () => void
  viewerRef: any
}

export default React.forwardRef(Note)
