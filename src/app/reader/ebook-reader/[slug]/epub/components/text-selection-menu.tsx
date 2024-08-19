'use client'
import { cn } from '@/lib/utils'
import { Copy, Pencil, Search, SquareMinus, SquarePlus } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import FocusLock from 'react-focus-lock'
import { useSnapshot } from 'valtio'
import { colorMap, typeMap } from '../annotation'
import {
  isForwardSelection,
  useMobile,
  useSetAction,
  useTextSelection,
  useTypography,
} from '../hooks'
import { BookTab } from '../models'
import { isTouchScreen, scale } from '../platform'
import { copy, keys, last } from '../utils'
import { layout, LayoutAnchorMode, LayoutAnchorPosition } from './base'
import { Button, IconButton } from './button'
import { TextField } from './form'

interface TextSelectionMenuProps {
  tab: BookTab
}
export const TextSelectionMenu: React.FC<TextSelectionMenuProps> = ({
  tab,
}) => {
  const { rendition, annotationRange } = useSnapshot(tab)
  // `manager` is not reactive, so we need to use getter
  const view = useCallback(() => {
    return rendition?.manager?.views._views[0]
  }, [rendition])

  const win = view()?.window
  const [selection, setSelection] = useTextSelection(win)

  const el = view()?.element as HTMLElement
  if (!el) return null

  // it is possible that both `selection` and `tab.annotationRange`
  // are set when select end within an annotation
  const range = selection?.getRangeAt(0) ?? annotationRange
  if (!range) return null

  const forward = isTouchScreen
    ? false
    : selection
      ? isForwardSelection(selection)
      : true

  const rects = [...range.getClientRects()].filter((r) => Math.round(r.width))
  const anchorRect = rects && (forward ? last(rects) : rects[0])
  if (!anchorRect) return null

  const contents = range.cloneContents()
  const text = contents.textContent?.trim()
  if (!text) return null

  return (
    // to reset inner state
    <TextSelectionMenuRenderer
      tab={tab}
      range={range as Range}
      anchorRect={anchorRect}
      containerRect={el.parentElement!.getBoundingClientRect()}
      viewRect={el.getBoundingClientRect()}
      text={text}
      forward={forward}
      hide={() => {
        if (selection) {
          selection.removeAllRanges()
          setSelection(undefined)
        }
        if (tab.annotationRange) {
          tab.annotationRange = undefined
        }
      }}
    />
  )
}

const ICON_SIZE = scale(22, 28)
const ANNOTATION_SIZE = scale(24, 30)

interface TextSelectionMenuRendererProps {
  tab: BookTab
  range: Range
  anchorRect: DOMRect
  containerRect: DOMRect
  viewRect: DOMRect
  text: string
  forward: boolean
  hide: () => void
}
const TextSelectionMenuRenderer: React.FC<TextSelectionMenuRendererProps> = ({
  tab,
  range,
  anchorRect,
  containerRect,
  viewRect,
  forward,
  text,
  hide,
}) => {
  const setAction = useSetAction()
  const ref = useRef<HTMLInputElement>(null)
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const mobile = useMobile()
  // const t = useTranslation('menu')

  const cfi = tab.rangeToCfi(range)
  const annotation = tab.book.annotations.find((a) => a.cfi === cfi)
  const [annotate, setAnnotate] = useState(!!annotation)

  const position = forward
    ? LayoutAnchorPosition.Before
    : LayoutAnchorPosition.After

  const { zoom } = useTypography(tab)
  const endContainer = forward ? range.endContainer : range.startContainer
  const _lineHeight = parseFloat(
    getComputedStyle(endContainer.parentElement!).lineHeight,
  )
  // no custom line height and the origin is keyword, e.g. 'normal'.
  const lineHeight = isNaN(_lineHeight)
    ? anchorRect.height
    : _lineHeight * (zoom ?? 1)

  return (
    <FocusLock disabled={mobile}>
      <div
        // cover `sash`
        className="fixed left-0 top-0 !z-50 h-screen w-full !bg-transparent"
        onMouseDown={hide}
      />
      <div
        ref={(el) => {
          if (!el) return
          setWidth(el.clientWidth)
          setHeight(el.clientHeight)
          if (!mobile) {
            el.focus()
          }
        }}
        className={cn(
          'shadow-1 absolute z-50 bg-background p-2 text-surface-variant focus:outline-none',
        )}
        style={{
          left: layout(containerRect.width, width, {
            offset: anchorRect.left + viewRect.left - containerRect.left,
            size: anchorRect.width,
            mode: LayoutAnchorMode.ALIGN,
            position,
          }),
          top: layout(containerRect.height, height, {
            offset: anchorRect.top - (lineHeight - anchorRect.height) / 2,
            size: lineHeight,
            position,
          }),
        }}
        tabIndex={-1}
        onKeyDown={(e) => {
          e.stopPropagation()
          if (e.key === 'c' && e.ctrlKey) {
            copy(text)
          }
        }}
      >
        {annotate ? (
          <div className="mb-3">
            <TextField
              mRef={ref}
              as="textarea"
              name="notes"
              defaultValue={annotation?.notes}
              hideLabel
              className="h-40 w-72"
              autoFocus
            />
          </div>
        ) : (
          <div className="-mx- mb-3 flex gap-1 text-surface-variant">
            <IconButton
              title={'Copy'}
              Icon={(props) => <Copy {...props} />}
              size={ICON_SIZE}
              onClick={() => {
                hide()
                copy(text)
              }}
            />
            <IconButton
              title={'Search in book'}
              Icon={(props) => <Search {...props} />}
              size={ICON_SIZE}
              onClick={() => {
                hide()
                setAction('search')
                tab.setKeyword(text)
              }}
            />
            <IconButton
              title={'Annotate'}
              Icon={(props) => <Pencil {...props} />}
              size={ICON_SIZE}
              onClick={() => {
                setAnnotate(true)
              }}
            />
            {tab.isDefined(text) ? (
              <IconButton
                title={'Undefine'}
                Icon={(props) => <SquareMinus {...props} />}
                size={ICON_SIZE}
                onClick={() => {
                  hide()
                  tab.undefine(text)
                }}
              />
            ) : (
              <IconButton
                title={'Define'}
                Icon={(props) => <SquarePlus {...props} />}
                size={ICON_SIZE}
                onClick={() => {
                  hide()
                  tab.define([text])
                }}
              />
            )}
          </div>
        )}
        <div className="space-y-2">
          {keys(typeMap).map((type) => (
            <div key={type} className="flex gap-2">
              {keys(colorMap).map((color) => (
                <div
                  key={color}
                  style={{
                    [typeMap[type].style]: colorMap[color],
                    width: ANNOTATION_SIZE,
                    height: ANNOTATION_SIZE,
                    fontSize: scale(16, 20),
                  }}
                  className={cn(
                    'flex cursor-pointer items-center justify-center text-surface-variant',
                    typeMap[type].class,
                  )}
                  onClick={() => {
                    tab.putAnnotation(
                      type,
                      cfi,
                      color,
                      text,
                      ref.current?.value,
                    )
                    hide()
                  }}
                >
                  A
                </div>
              ))}
            </div>
          ))}
        </div>
        {annotate && (
          <div className="mt-3 flex">
            {annotation && (
              <Button
                compact
                variant="secondary"
                onClick={() => {
                  tab.removeAnnotation(cfi)
                  hide()
                }}
              >
                {'Delete'}
              </Button>
            )}
            <Button
              className="ml-auto"
              compact
              onClick={() => {
                tab.putAnnotation(
                  annotation?.type ?? 'highlight',
                  cfi,
                  annotation?.color ?? 'yellow',
                  text,
                  ref.current?.value,
                )
                hide()
              }}
            >
              {annotation ? 'Update' : 'Create'}
            </Button>
          </div>
        )}
      </div>
    </FocusLock>
  )
}
