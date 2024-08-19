import { ChevronLeft, ChevronRight } from 'lucide-react'

const MoveBtn = ({ type, onClick }: Props) => {
  const Icon = type === 'PREV' ? ChevronLeft : ChevronRight
  const msg = type === 'PREV' ? '이전 페이지' : '다음 페이지'
  return (
    <div
      className="flex h-full min-w-16 cursor-pointer items-center justify-center outline-none"
      onClick={onClick}
      title={msg}
    >
      <div className="flex items-center justify-center transition-colors duration-200">
        <Icon />
      </div>
    </div>
  )
}

interface Props {
  type: 'PREV' | 'NEXT'
  onClick: () => void
}

export default MoveBtn
