'use client'
import clsx from 'clsx'
import { X } from 'lucide-react'
import { ComponentProps } from 'react'
import { activeClass } from '../styles'
import { IconButton } from './button'

interface TabProps extends ComponentProps<'div'> {
  onDelete?: () => void
  selected?: boolean
  focused?: boolean
  Icon: (props: any) => JSX.Element
  children?: string
}

export function Tab({
  selected,
  focused,
  Icon,
  className,
  children,
  onDelete,
  ...props
}: TabProps) {
  // const [bg] = useBackground()
  if (!children) return null
  return (
    <div
      role="tab"
      className={clsx(
        'relative flex cursor-pointer items-center gap-1 p-2 pr-1 text-xs',
        selected
          ? `text-[rgb(113 120 126)] bg-background`
          : `text-[rgb(113 120 126)] hover:bg-background`,
        focused && '!text-[rgb(25 28 30)]',
        className,
      )}
      title={children}
      {...props}
    >
      {focused && (
        <div className={clsx('absolute inset-x-0 top-0 h-px', activeClass)} />
      )}
      <Icon size={16} className="text-outline" />
      <span className="max-w-[200px] truncate">{children}</span>
      <IconButton
        title={'Close'}
        Icon={(props) => <X {...props} />}
        onClick={(e) => {
          e.stopPropagation()
          onDelete?.()
        }}
      />
    </div>
  )
}

interface ListProps extends ComponentProps<'ul'> {
  onDelete?: () => void
}
const List: React.FC<ListProps> = ({ className, onDelete, ...props }) => {
  return (
    <div
      className={clsx(
        'flex items-center justify-between bg-[#0065910d]',
        className,
      )}
    >
      <ul className={clsx('scroll-h flex')} {...props} />
      <IconButton
        className="mx-2"
        title={'Close'}
        Icon={(props) => <X {...props} />}
        onClick={(e) => {
          e.stopPropagation()
          onDelete?.()
        }}
      />
    </div>
  )
}

Tab.List = List
