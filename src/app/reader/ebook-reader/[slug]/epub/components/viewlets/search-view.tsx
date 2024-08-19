import { CopyMinus, CopyPlus } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import Highlighter from 'react-highlight-words'
import { useAction, useList, useTranslation } from '../../hooks'
import { flatTree, IMatch, reader, useReaderSnapshot } from '../../models'
import { PaneView, PaneViewProps } from '../base'
import { TextField } from '../form'
import { Row } from '../row'

function useIntermediateKeyword() {
  const [keyword, setKeyword] = useState('')
  const { focusedBookTab } = useReaderSnapshot()

  useEffect(() => {
    setKeyword(focusedBookTab?.keyword ?? '')
  }, [focusedBookTab?.keyword])

  useEffect(() => {
    reader.focusedBookTab?.setKeyword(keyword)
  }, [keyword])

  return [keyword, setKeyword] as const
}

export const SearchView: React.FC<PaneViewProps> = (props) => {
  const [action] = useAction()
  const { focusedBookTab } = useReaderSnapshot()

  const [keyword, setKeyword] = useIntermediateKeyword()

  const results = focusedBookTab?.results
  const expanded = results?.some((r) => r.expanded)

  return (
    <PaneView
      actions={[
        {
          id: expanded ? 'collapse-all' : 'expand-all',
          title: expanded ? 'Collapse all' : 'Expand all',
          Icon: expanded
            ? (props) => <CopyMinus {...props} />
            : (props) => <CopyPlus {...props} />,
          handle() {
            reader.focusedBookTab?.results?.forEach(
              (r) => (r.expanded = !expanded),
            )
          },
        },
      ]}
      {...props}
    >
      <div className="scroll-parent">
        <div className="px-5 py-px">
          <TextField
            as="input"
            name="keyword"
            autoFocus={action === 'search'}
            hideLabel
            value={keyword}
            placeholder={'Search'}
            onChange={(e: any) => setKeyword(e.target.value)}
            onClear={() => setKeyword('')}
          />
        </div>
        {keyword && results && (
          <ResultList results={results as IMatch[]} keyword={keyword} />
        )}
      </div>
    </PaneView>
  )
}

interface ResultListProps {
  results: IMatch[]
  keyword: string
}
const ResultList: React.FC<ResultListProps> = ({ results, keyword }) => {
  const rows = useMemo(
    () => results.flatMap((r) => flatTree(r)) ?? [],
    [results],
  )
  const { outerRef, innerRef, items } = useList(rows)
  const t = useTranslation('search')

  const sectionCount = results.length
  const resultCount = results.reduce((a, r) => r.subitems!.length + a, 0)

  return (
    <>
      <div className="text-outline px-5 py-2 text-xs">
        {t('files.result')
          .replace('{n}', '' + resultCount)
          .replace('{m}', '' + sectionCount)}
      </div>
      <div ref={outerRef} className="scroll">
        <div ref={innerRef}>
          {items.map(({ index }) => (
            <ResultRow key={index} result={rows[index]} keyword={keyword} />
          ))}
        </div>
      </div>
    </>
  )
}

interface ResultRowProps {
  result?: IMatch
  keyword: string
}
const ResultRow: React.FC<ResultRowProps> = ({ result, keyword }) => {
  if (!result) return null
  const { cfi, depth, expanded, subitems, id } = result
  let { excerpt, description } = result
  const tab = reader.focusedBookTab
  const isResult = depth === 1

  excerpt = excerpt.trim()
  description = description?.trim()

  return (
    <Row
      title={description ? `${description} / ${excerpt}` : excerpt}
      label={excerpt}
      description={description}
      depth={depth}
      active={tab?.activeResultID === id}
      expanded={expanded}
      subitems={subitems}
      badge={isResult}
      {...(!isResult && {
        onClick: () => {
          if (tab) {
            tab.activeResultID = id
            tab.display(cfi)
          }
        },
      })}
      toggle={() => tab?.toggleResult(id)}
    >
      {!isResult && (
        <Highlighter
          highlightClassName="match-highlight"
          searchWords={[keyword]}
          textToHighlight={excerpt}
          autoEscape
        />
      )}
    </Row>
  )
}
