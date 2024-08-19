const Item = ({ text }: Props) => {
  return (
    <div className="flex h-full items-center overflow-hidden text-ellipsis whitespace-nowrap">
      <span className="text-gray overflow-hidden text-ellipsis whitespace-nowrap">
        {text}
      </span>
    </div>
  )
}

interface Props {
  text: string
}

export default Item
