import React from 'react'
// components
import BookInfo from '../nav/book-info'
import NavItem from '../nav/nav-item'
// types
import { Sheet, SheetContent, SheetHeader } from '@/components/ui/sheet'
import { MenuControl } from '@/hooks/useMenu'
import { useAppStore } from '@/zustand/state'

const Nav = ({ control, onToggle, onLocation }: Props, ref: any) => {
  const book = useAppStore((state) => state.book)
  const bookToc = useAppStore((state) => state.toc)

  /** Click nav item */
  const onClickItem = (loc: string) => {
    onLocation(loc)
    onToggle()
  }

  const Tocs = bookToc.map((t, idx) => (
    <NavItem key={idx} message={t.label} onClick={() => onClickItem(t.href)} />
  ))

  return (
    <>
      <Sheet open={control.display} onOpenChange={(open) => onToggle()}>
        <SheetContent side={'right'} className="" ref={ref}>
          <SheetHeader className="mb-4">
            <h3 className="text-xl font-bold">Book Info</h3>
          </SheetHeader>
          <BookInfo
            src={book.coverURL}
            title={book.title}
            publisher={book.publisher}
            author={book.author}
          />
          {Tocs}
        </SheetContent>
      </Sheet>
    </>
  )
}

interface Props {
  control: MenuControl
  onToggle: () => void
  onLocation: (loc: string) => void
}

export default React.forwardRef(Nav)
