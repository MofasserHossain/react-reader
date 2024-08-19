'use client'
import { cn } from '@/lib/utils'
import { ComponentProps } from 'react'

interface PageProps extends ComponentProps<'div'> {
  headline: string
}
export const Page: React.FC<PageProps> = ({
  className,
  children,
  headline,
  ...props
}) => {
  return (
    <div className={cn('p-4', className)} {...props}>
      <h1
        className={cn(
          'typescale-title-large text-surface-variant mb-4',
          className,
        )}
        {...props}
      >
        {headline}
      </h1>
      {children}
    </div>
  )
}
