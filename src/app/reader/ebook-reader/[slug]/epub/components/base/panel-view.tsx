'use client'
import { ComponentProps, forwardRef, useState } from 'react'

import { scale } from '../../platform'

import { Action, ActionBar } from '.'
import { Twisty } from '../row'

import { cn } from '@/lib/utils'
import { SplitView, useSplitViewItem } from './split-view'

interface PaneProps extends ComponentProps<'div'> {
  headline: string
  preferredSize?: number
  actions?: Action[]
}
export const Pane = forwardRef<HTMLDivElement, PaneProps>(function Pane(
  { className, headline, preferredSize, children, actions, ...props },
  ref,
) {
  const [expanded, setExpanded] = useState(true)
  const { size } = useSplitViewItem(headline, {
    preferredSize,
    visible: expanded,
  })
  return (
    <div
      className={cn('Pane scroll-parent group', size && 'shrink-0')}
      style={{
        height: expanded ? size : 24,
      }}
    >
      <div
        role="button"
        className="flex h-6 shrink-0 items-center"
        onClick={() => setExpanded((e) => !e)}
      >
        <Twisty expanded={expanded} />
        <div
          className="typescale-label-small text-surface-variant !font-bold"
          style={{ fontSize: scale(11, 12) }}
        >
          {headline.toUpperCase()}
        </div>
        {actions && (
          <ActionBar
            actions={actions}
            className="invisible ml-auto flex pr-1 group-hover:visible"
          />
        )}
      </div>
      <div
        ref={ref}
        className={cn(
          'scroll text-surface-variant text-xs',
          !expanded && 'hidden',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  )
})

export interface PaneViewProps extends ComponentProps<'div'> {
  name: string
  title: string
  actions?: Action[]
}
export function PaneView({
  className,
  name,
  title,
  actions,
  ...props
}: PaneViewProps) {
  return (
    <>
      <div
        className={cn(
          'flex items-center justify-between px-5 py-2.5',
          className,
        )}
      >
        <h2
          title={title}
          className="text-on-surface"
          style={{ fontSize: scale(11, 12) }}
        >
          {name?.toUpperCase()}
        </h2>
        {actions && <ActionBar actions={actions} className="-mr-1" />}
      </div>
      <SplitView
        vertical
        className={cn('scroll-parent', className)}
        {...props}
      />
    </>
  )
}
