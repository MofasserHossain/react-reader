import { cn } from '@/lib/utils'
import React, { forwardRef } from 'react'

interface PostProps {
  color: string
  children: React.ReactNode
}

const Post = forwardRef<HTMLDivElement, PostProps>(
  ({ color, children }, ref) => {
    return (
      <div
        ref={ref}
        className="relative mt-4 box-border overflow-hidden rounded-lg p-2 text-sm"
      >
        <div
          className={cn('absolute inset-0 rounded-lg bg-opacity-30', '')}
          style={{ backgroundColor: color }}
        />
        <div className="relative">{children}</div>
      </div>
    )
  },
)

Post.displayName = 'Post'

export default Post
