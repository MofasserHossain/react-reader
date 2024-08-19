// import { StateLayer } from '@literal-ui/core'
import { useMemo } from 'react'
import { useLibrary, useList, useTranslation } from '../../hooks'
import {
  compareHref,
  dfs,
  flatTree,
  INavItem,
  reader,
  useReaderSnapshot,
} from '../../models'

import { CopyMinus, CopyPlus } from 'lucide-react'
import { Pane, PaneView, PaneViewProps } from '../base'
import { Row } from '../row'

export const TocView: React.FC<PaneViewProps> = (props) => {
  return (
    <PaneView {...props}>
      <TocPane />
    </PaneView>
  )
}

const LibraryPane: React.FC = () => {
  const books = useLibrary()
  const t = useTranslation('toc')
  return (
    <Pane headline={t('library')} preferredSize={240}>
      {books?.map((book) => (
        <button
          key={book.id}
          className="relative w-full truncate py-1 pl-5 pr-3 text-left"
          title={book.name}
          draggable
          onClick={() => reader.addTab(book)}
          onDragStart={(e) => {
            e.dataTransfer.setData('text/plain', book.id)
          }}
        >
          {/* <StateLayer /> */}
          {book.name}
        </button>
      ))}
    </Pane>
  )
}

const TocPane: React.FC = () => {
  // const t = useTranslation()
  const { focusedBookTab } = useReaderSnapshot()
  const toc = focusedBookTab?.nav?.toc as INavItem[] | undefined
  const rows = useMemo(() => toc?.flatMap((i) => flatTree(i)), [toc])
  const expanded = toc?.some((r) => r.expanded)
  const currentNavItem = focusedBookTab?.currentNavItem
  const { outerRef, innerRef, items, scrollToItem } = useList(rows)
  console.log(`\n\n ~ items:`, items, currentNavItem, toc)
  return (
    <Pane
      headline={'TOC'}
      ref={outerRef}
      actions={[
        {
          id: expanded ? 'collapse-all' : 'expand-all',
          title: expanded ? 'Expand All' : 'Collapse All',
          Icon: expanded
            ? (props) => <CopyMinus {...props} />
            : (props) => <CopyPlus {...props} />,
          handle() {
            reader.focusedBookTab?.nav?.toc?.forEach((r) =>
              dfs(r as INavItem, (i) => (i.expanded = !expanded)),
            )
          },
        },
      ]}
    >
      {rows && (
        <div ref={innerRef}>
          {items.map(({ index }) => (
            <TocRow
              key={index}
              currentNavItem={currentNavItem as INavItem}
              item={rows[index]}
              onActivate={() => scrollToItem(index)}
            />
          ))}
        </div>
      )}
    </Pane>
  )
}

interface TocRowProps {
  currentNavItem?: INavItem
  item?: INavItem
  onActivate: () => void
}
const TocRow: React.FC<TocRowProps> = ({
  currentNavItem,
  item,
  onActivate,
}) => {
  if (!item) return null
  const { label, subitems, depth, expanded, id, href } = item
  const tab = reader.focusedBookTab
  return (
    <Row
      title={label.trim()}
      depth={depth}
      active={href === currentNavItem?.href}
      expanded={expanded}
      subitems={subitems}
      onClick={() => {
        const [, id] = href.split('#')
        const section = tab?.sections?.find((s) => compareHref(s.href, href))
        if (!section) return
        if (id) {
          tab?.displayFromSelector(`#${id}`, section, false)
        } else {
          tab?.display(section.href, false)
        }
      }}
      // `tab` can not be proxy here
      toggle={() => tab?.toggle(id)}
      onActivate={onActivate}
    />
  )
}
