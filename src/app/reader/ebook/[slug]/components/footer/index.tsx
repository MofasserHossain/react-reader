// components
import { Button } from '@/components/ui/button'
import { BookMarked, Settings } from 'lucide-react'
import Item from './footer-item'
import MoveBtn from './move-btn'

const Footer = ({
  title,
  nowPage,
  totalPage,
  onPageMove,
  onLearningToggle,
  onOptionToggle,
}: Props) => {
  return (
    <div className="fixed bottom-0 left-0 w-full">
      <div className="flex h-16 items-center justify-between">
        <MoveBtn type="PREV" onClick={() => onPageMove('PREV')} />
        {title && <Item text={title} />}
        <div>
          <Item text={`${nowPage} / ${totalPage}`} />
        </div>
        <MoveBtn type="NEXT" onClick={() => onPageMove('NEXT')} />
      </div>
      <div className="flex items-center justify-center gap-2 border-t py-2 sm:hidden">
        <Button
          onClick={() => onOptionToggle()}
          variant={'ghost'}
          className="text-lg text-primary"
        >
          <Settings />
        </Button>
        <Button
          onClick={() => onLearningToggle()}
          variant={'ghost'}
          className="text-lg text-primary"
        >
          <BookMarked />
        </Button>
      </div>
    </div>
  )
}

interface Props {
  title: string
  nowPage: number
  totalPage: number
  onPageMove: (type: 'PREV' | 'NEXT') => void
  onOptionToggle: (value?: boolean) => void
  onLearningToggle: (value?: boolean) => void
}

export default Footer
