// components
import { SiteLogo } from '@/components/sections/site-logo'
import { Button } from '@/components/ui/button'
import zIndex from '@/constants/zIndex'

const Header = ({
  onNavToggle,
  onOptionToggle,
  onLearningToggle,
  saveEpub,
}: Props) => {
  return (
    <div
      className={`sticky left-0 top-0 z-[${zIndex.header}] h-auto w-full border-b`}
    >
      <div className="container-1400 mx-auto flex h-16 w-full items-center justify-center sm:justify-between">
        <SiteLogo className="h-6 w-36" />
        <div className="hidden items-center gap-2 sm:flex">
          {/* <Button variant={'ghost'} onClick={() => onNavToggle()}>
            Contents
          </Button> */}
          <Button variant={'ghost'} onClick={() => onOptionToggle()}>
            Setting
          </Button>
          <Button variant={'ghost'} onClick={() => onLearningToggle()}>
            Highlights
          </Button>
          {/* <Button variant={'ghost'} onClick={() => saveEpub()}>
            Save
          </Button> */}
        </div>
      </div>
    </div>
  )
}

interface Props {
  onNavToggle: (value?: boolean) => void
  onOptionToggle: (value?: boolean) => void
  onLearningToggle: (value?: boolean) => void
  saveEpub: () => void
}

export default Header
