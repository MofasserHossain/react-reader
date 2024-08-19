// lib
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Book,
  BookOpenIcon,
  ChevronsLeftRight,
  ChevronsUpDown,
} from 'lucide-react'

const ControlIconBtn = ({ type, alt, active, isSelected, onClick }: Props) => {
  let HeaderIcon = null
  switch (type) {
    case 'ScrollVertical':
      HeaderIcon = ChevronsLeftRight
      break
    case 'ScrollHorizontal':
      HeaderIcon = ChevronsUpDown
      break
    case 'BookOpen':
      HeaderIcon = BookOpenIcon
      break
    case 'BookClose':
      HeaderIcon = Book
      break
  }

  const onClickBtn = () => {
    if (active) onClick()
  }

  return (
    <Button
      variant={active && isSelected ? 'default' : 'ghost'}
      disabled={!active}
      onClick={onClickBtn}
      className={!active ? 'cursor-not-allowed opacity-30' : ''}
      title={alt}
    >
      <HeaderIcon
        className={cn(
          'h-4 w-4',
          !active ? 'cursor-not-allowed opacity-30' : '',
        )}
      />
    </Button>
  )
}

type HeaderIcon =
  | 'ScrollHorizontal'
  | 'ScrollVertical'
  | 'BookOpen'
  | 'BookClose'

interface Props {
  type: HeaderIcon
  alt: string
  active: boolean
  isSelected: boolean
  onClick: () => void
}

export default ControlIconBtn
