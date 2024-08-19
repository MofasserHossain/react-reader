import { useBoolean } from '@literal-ui/hooks'
import React, { Fragment, useMemo } from 'react'
import { Annotation } from '../../annotation'
import { reader, useReaderSnapshot } from '../../models'
import { copy, group, keys } from '../../utils'

import { Copy } from 'lucide-react'
import { Pane, PaneView, PaneViewProps } from '../base'
import { Row } from '../row'

export const AnnotationView: React.FC<PaneViewProps> = (props) => {
  return (
    <PaneView {...props}>
      <DefinitionPane />
      <AnnotationPane />
    </PaneView>
  )
}

const DefinitionPane: React.FC = () => {
  const { focusedBookTab } = useReaderSnapshot()
  console.log(
    'focusedBookTab?.book.definitions',
    focusedBookTab?.book.definitions,
  )

  return (
    <Pane headline={'Definitions'} preferredSize={120}>
      {focusedBookTab?.book.definitions.map((d) => {
        return (
          <Row
            key={d}
            onClick={() => {
              console.log('clicked', d)
              // reader.focusedBookTab?.display()
            }}
            onDelete={() => {
              reader.focusedBookTab?.undefine(d)
            }}
          >
            {d}
          </Row>
        )
      })}
    </Pane>
  )
}

const AnnotationPane: React.FC = () => {
  const { focusedBookTab } = useReaderSnapshot()
  // const t = useTranslation('annotation')

  const annotations = useMemo(
    () => (focusedBookTab?.book.annotations as Annotation[]) ?? [],
    [focusedBookTab?.book.annotations],
  )

  const groupedAnnotation = useMemo(() => {
    return group(annotations ?? [], (a) => a.spine.index)
  }, [annotations])

  // console.log(
  //   `\n\n ~ groupedAnnotation ~ groupedAnnotation:`,
  //   groupedAnnotation,
  //   keys(groupedAnnotation)?.map((k) => groupedAnnotation[k]!),
  // )
  const exportAnnotations = () => {
    // process annotations to be under each section
    // group annotations by title
    const grouped = group(annotations, (a) => a.spine.title)
    const exported: Record<string, any[]> = {}
    for (const chapter in grouped) {
      const annotations =
        grouped[chapter]?.map((a) => {
          const annotation: Record<string, any> = {}
          if (a.notes !== undefined) annotation.notes = a.notes
          if (a.text !== undefined) annotation.text = a.text
          return annotation
        }) ?? []
      exported[chapter] = annotations
    }

    // Copy to clipboard as markdown
    const exportedAnnotationsMd = Object.entries(exported)
      .map(([chapter, annotations]) => {
        return `## ${chapter}\n${annotations
          .map((a) => `- ${a.text} ${a.notes ? `(${a.notes})` : ''}`)
          .join('\n')}`
      })
      .join('\n\n')
    copy(exportedAnnotationsMd)
  }

  return (
    <Pane
      headline={'Annotations'}
      actions={
        annotations.length > 0
          ? [
              {
                id: 'copy-all',
                title: 'Copy as Markdown',
                Icon: (props) => <Copy {...props} />,
                handle() {
                  exportAnnotations()
                },
              },
            ]
          : undefined
      }
    >
      {keys(groupedAnnotation).map((k) => (
        <AnnotationBlock key={k} annotations={groupedAnnotation[k]!} />
      ))}
    </Pane>
  )
}

interface AnnotationBlockProps {
  annotations: Annotation[]
}
const AnnotationBlock: React.FC<AnnotationBlockProps> = ({ annotations }) => {
  const [expanded, toggle] = useBoolean(true)

  return (
    <div>
      <Row
        depth={1}
        badge
        expanded={expanded}
        toggle={toggle}
        subitems={annotations}
      >
        {annotations[0]?.spine.title}
      </Row>

      {expanded && (
        <div>
          {annotations.map((a) => (
            <Fragment key={a.id}>
              <Row
                depth={2}
                onClick={() => {
                  reader.focusedBookTab?.display(a.cfi)
                }}
                onDelete={() => {
                  reader.focusedBookTab?.removeAnnotation(a.cfi)
                }}
              >
                {a.text}
              </Row>
              {a.notes && (
                <Row
                  depth={3}
                  onClick={() => {
                    reader.focusedBookTab?.display(a.cfi)
                  }}
                >
                  <span className="text-outline">{a.notes}</span>
                </Row>
              )}
            </Fragment>
          ))}
        </div>
      )}
    </div>
  )
}
