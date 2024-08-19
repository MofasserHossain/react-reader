import { cn } from '@/lib/utils'
import Image from 'next/image'
import { BookRecord, CoverRecord } from '../../db'
import { reader } from '../../models'

interface BookProps {
  book: BookRecord
  covers?: CoverRecord[]
  select?: boolean
  selected?: boolean
  loading?: boolean
  toggle: (id: string) => void
}

const placeholder = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"><rect fill="gray" fill-opacity="0" width="1" height="1"/></svg>`

const Book: React.FC<BookProps> = ({
  book,
  covers,
  select,
  loading,
  toggle,
}) => {
  const cover = covers?.find((c) => c.id === book.id)?.cover
  return (
    <div className="relative flex flex-col">
      <div
        role="button"
        className="border-inverse-on-surface relative border"
        onClick={async () => {
          if (select) {
            toggle(book.id)
          } else {
            // if (mobile) await router.push('/_')
            reader.addTab(book)
          }
        }}
      >
        <div
          className={cn(
            'absolute bottom-0 h-1 bg-blue-500',
            loading && 'progress-bit w-[5%]',
          )}
        />
        {book.percentage !== undefined && (
          <div className="absolute right-0 bg-gray-500/60 px-2 text-gray-100">
            {(book.percentage * 100).toFixed()}%
          </div>
        )}
        <Image
          src={cover ?? placeholder}
          width={200}
          height={267}
          alt="Cover"
          className="mx-auto aspect-[9/12] object-cover"
          draggable={false}
        />
      </div>
      <div
        className="mt-2 line-clamp-2 w-full text-sm text-surface-variant lg:text-sm"
        title={book.name}
      >
        {book.name}
      </div>
    </div>
  )
}

export default Book
