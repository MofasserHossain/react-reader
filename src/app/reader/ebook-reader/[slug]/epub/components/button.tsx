'use client'
import { cn } from '@/lib/utils'
import { ComponentProps } from 'react'

interface IconButtonProps extends ComponentProps<'button'> {
  Icon: (props: any) => JSX.Element
  size?: number
}
export function IconButton({
  className,
  Icon,
  size = 16,
  ...props
}: IconButtonProps) {
  return (
    <button className={cn('relative block p-0.5', className)} {...props}>
      {/* <StateLayer /> */}
      <Icon size={size} />
    </button>
  )
}

const variantMap = {
  primary: 'bg-primary-container text-on-primary-container',
  secondary: 'bg-outline/10 text-surface-variant',
}

export interface ButtonProps extends ComponentProps<'button'> {
  variant?: keyof typeof variantMap
  compact?: boolean
}
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  compact = false,
  className,
  ...props
}) => {
  return (
    <button
      className={cn(
        'disabled:bg-disabled disabled:text-on-disabled text-sm',
        variantMap[variant],
        compact ? 'px-2 py-1' : 'px-3 py-1.5',
        className,
      )}
      {...props}
    />
  )
}
