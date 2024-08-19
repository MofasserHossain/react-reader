import { useBoolean } from '@literal-ui/hooks'
import Image from 'next/image'
import { useMemo } from 'react'
import { ISection, reader, useReaderSnapshot } from '../../models'
import { PaneView, PaneViewProps } from '../base'
import { Row } from '../row'

export const ImageView: React.FC<PaneViewProps> = (props) => {
  const { focusedBookTab } = useReaderSnapshot()

  const sections = useMemo(() => {
    let data = focusedBookTab?.sections as ISection[]
    return data?.filter((s) => s?.images?.length)
  }, [focusedBookTab?.sections])

  if ((sections?.length ?? 0) > 500) return null

  return (
    <PaneView {...props}>
      <div className="scroll">
        {sections?.map((s) => <Block key={s.href} section={s} />)}
      </div>
    </PaneView>
  )
}

interface BlockProps {
  section: ISection
}
const Block: React.FC<BlockProps> = ({ section }) => {
  const { focusedBookTab } = useReaderSnapshot()
  const [expanded, toggle] = useBoolean(false)
  const resources = focusedBookTab?.epub?.resources as any
  if (!resources) return null
  const blobs = resources?.replacementUrls
  const assets = resources?.assets

  return (
    <div>
      <Row badge expanded={expanded} toggle={toggle} subitems={section.images}>
        {section.navitem?.label}
      </Row>
      {expanded && (
        <div>
          {section.images.map((src) => {
            const i = assets.findIndex((a: any) => src.includes(a.href))
            const asset = assets[i]
            const blob = blobs[i]

            if (!blob) return null
            return (
              <Image
                className="w-full cursor-pointer px-5 py-2"
                width={200}
                height={200}
                key={i}
                src={blob}
                alt={asset.href}
                onClick={() => {
                  reader.focusedBookTab?.displayFromSelector(
                    `img[src*="${asset.href}"]`,
                    section,
                  )
                }}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
