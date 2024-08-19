import Image from 'next/image'

const BookInfo = ({ src = '', title, publisher, author }: Props) => {
  return (
    <div className="flex p-6">
      <Image
        width={100}
        height={200}
        className="mr-3 w-[44%] min-w-[120px] rounded-sm bg-slate-400"
        src={src}
        alt={title}
      />
      <div className="flex-grow-1">
        <div className="mb-1 font-medium">{title}</div>
        <div className="mb-1 text-sm">{publisher}</div>
        <div className="mb-1 text-sm">{author}</div>
      </div>
    </div>
  )
}

interface Props {
  src: string
  title: string
  publisher: string
  author: string
}

export default BookInfo
