'use client'
import clsx from 'clsx'
import { ComponentProps, useEffect, useRef } from 'react'

import { LIST_ITEM_SIZE, useTranslation } from '../hooks'
import { scale } from '../platform'

import { ChevronRight, ChevronUp, X } from 'lucide-react'
import { IconButton } from './button'

interface RowProps extends ComponentProps<'div'> {
  expanded?: boolean
  active?: boolean
  depth?: number
  label?: string
  description?: string | number
  info?: string
  subitems?: Readonly<any[]>
  toggle?: () => void
  onActivate?: () => void
  onDelete?: () => void
  badge?: boolean
}

export const Row: React.FC<RowProps> = ({
  title,
  label,
  description,
  info,
  expanded = false,
  active = false,
  depth = 0,
  subitems,
  toggle,
  onActivate,
  className,
  children,
  badge,
  onClick,
  onDelete,
  ...props
}) => {
  const trans = useTranslation()
  const onActivateRef = useRef(onActivate)
  onActivateRef.current = onActivate

  const childCount = subitems?.length
  const t = children || label || title

  useEffect(() => {
    if (active) onActivateRef.current?.()
  }, [active])

  return (
    <div
      className={clsx(
        'list-row relative flex cursor-pointer items-center text-left',
        active && 'bg-gray-100',
        className,
      )}
      style={{
        paddingLeft: depth * 8,
        paddingRight: 12,
        height: LIST_ITEM_SIZE,
      }}
      title={title}
      onClick={onClick ?? toggle}
      {...props}
    >
      {/* <StateLayer /> */}
      <Twisty
        expanded={expanded}
        className={clsx(!childCount && 'invisible')}
        onClick={(e) => {
          e.stopPropagation()
          toggle?.()
        }}
      />
      <div
        className={clsx(
          'truncate text-xs',
          t ? 'text-surface-variant' : 'text-outline/60',
        )}
        style={{
          fontSize: scale(12, 14),
          marginLeft: scale(0, 2),
        }}
      >
        {t || trans('untitled')}
        {description && (
          <span
            className="text-outline"
            style={{
              fontSize: scale(11, 12),
              marginLeft: scale(4, 6),
            }}
          >
            {description}
          </span>
        )}
      </div>
      <div className="ml-auto">
        {badge && childCount && (
          <div
            className="rounded-full bg-teal-200 px-1.5 py-px"
            style={{
              fontSize: scale(11, 12),
            }}
          >
            {childCount}
          </div>
        )}
        {onDelete && (
          <IconButton
            className="action hidden"
            Icon={(props) => <X {...props} />}
            onClick={(e) => {
              e.stopPropagation()
              onDelete?.()
            }}
          />
        )}
        <span className="text-outline">{info}</span>
      </div>
    </div>
  )
}

interface TwistyProps extends ComponentProps<'svg'> {
  expanded: boolean
}
export const Twisty: React.FC<TwistyProps> = ({
  expanded,
  className,
  ...props
}) => {
  const Icon = expanded ? ChevronUp : ChevronRight
  return (
    <Icon
      size={20}
      className={clsx('text-outline shrink-0', className)}
      style={{ padding: scale(2, 1) }}
      {...props}
    />
  )
}
