import { contextmenuWidth } from '@/constants/viewerLayout'
import zIndex from '@/constants/zIndex'
import { cn } from '@/lib/utils'
import React, { forwardRef } from 'react'

interface Props {
  x: number
  y: number
  width: number
  height: number | string
  isReverse: boolean
  children: React.ReactNode
}
const Wrapper = forwardRef<HTMLDivElement, Props>(
  ({ x, y, width, height, isReverse, children }, ref) => {
    const left =
      window.innerWidth < x + contextmenuWidth
        ? window.innerWidth - contextmenuWidth
        : x
    const top = window.innerHeight < y + 40 ? window.innerHeight - 40 : y
    const arrowPosition = isReverse ? 'bottom-[-16px]' : 'top-[-16px]'
    const arrowDirection = isReverse ? 'border-t-gray-500' : 'border-b-gray-500'

    return (
      <div
        className={`absolute z-[${zIndex.tooltip}] duration-400 box-border rounded-lg border bg-white transition-all ease-in`}
        style={{
          left: `${left}px`,
          top: `${top}px`,
          width: `${width}px`,
          height: typeof height === 'number' ? `${height}px` : height,
        }}
        ref={ref}
      >
        <div className="h-full overflow-y-auto">{children}</div>
        <div
          className={cn(
            'absolute left-20 h-0 w-0 -translate-x-2 transform border-8 border-transparent',
            arrowPosition,
            arrowDirection,
          )}
        />
      </div>
    )
  },
)

Wrapper.displayName = 'ContextMenuWrapper'

export default Wrapper
