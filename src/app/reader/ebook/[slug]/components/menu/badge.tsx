import { PropsWithChildren } from 'react'

type Props = {
  count: number
}

export default function Badge({ count, children }: PropsWithChildren<Props>) {
  return (
    <div className="relative">
      {count > 0 && (
        <div className="absolute -right-4 -top-3 flex h-4 w-4 items-center justify-center rounded-full bg-gray-100 text-xs shadow-sm">
          {count}
        </div>
      )}
      {children}
    </div>
  )
}
