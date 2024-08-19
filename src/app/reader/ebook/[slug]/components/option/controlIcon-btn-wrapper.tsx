const ControlIconBtnWrapper = ({ title, children }: Props) => {
  return (
    <div className="mb-6">
      <h1 className="mb-4 text-sm font-medium">{title}</h1>
      <div className="flex items-center justify-around px-2">{children}</div>
    </div>
  )
}

interface Props {
  title: string
  children: any[]
}

export default ControlIconBtnWrapper
