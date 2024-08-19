const Item = ({ text, onClick }: Props) => {
  return (
    <button
      className="h-8 w-full cursor-pointer rounded-md bg-transparent text-center text-sm leading-8 text-gray-400 outline-none transition duration-100 hover:bg-red-300 hover:text-white focus:bg-red-300 focus:text-white"
      onClick={onClick}
    >
      {text}
    </button>
  )
}

interface Props {
  text: string
  onClick: (e?: any) => void
}

export default Item
