const Loading = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="relative my-8 h-7 w-full text-center">
        <div className="inline-block h-7 w-7 animate-spin rounded-full border border-solid border-[#ebf1ff] border-t-[#3972ff]"></div>
      </div>
    </div>
  )
}

export default Loading
