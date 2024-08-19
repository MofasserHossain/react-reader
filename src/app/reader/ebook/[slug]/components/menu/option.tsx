import React, { useEffect, useState } from 'react'
// components
import ControlIconBtn from '../option/controlIcon-btn'
import ControlIconBtnWrapper from '../option/controlIcon-btn-wrapper'
import OptionSlider from '../option/slider-main'
// types
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader } from '@/components/ui/sheet'
import { MenuControl } from '@/hooks/useMenu'
import {
  BookFlow,
  BookFontFamily,
  BookOption,
  BookStyle,
} from '@/types/epub/book'

const Option = (
  {
    control,
    bookStyle,
    bookOption,
    bookFlow,
    onToggle,
    emitEvent,
    onBookStyleChange,
    onBookOptionChange,
  }: Props,
  ref: any,
) => {
  const [fontFamily, setFontFamily] = useState<BookFontFamily>(
    bookStyle.fontFamily,
  )
  const [fontWeight, setFontWeight] = useState<number>(bookStyle.fontWeight)
  const [fontSize, setFontSize] = useState<number>(bookStyle.fontSize)
  const [lineHeight, setLineHeight] = useState<number>(bookStyle.lineHeight)
  const [marginHorizontal, setMarginHorizontal] = useState<number>(
    bookStyle.marginHorizontal,
  )
  const [marginVertical, setMarginVertical] = useState<number>(
    bookStyle.marginVertical,
  )
  const [isScrollHorizontal, setIsScrollHorizontal] = useState<boolean>(true)
  const [viewType, setViewType] = useState<ViewType>({
    active: true,
    spread: true,
  })

  /** Change font family */
  const onSelectFontFamily = (font: BookFontFamily) => {
    setFontFamily(font)
  }

  /** Change font style and layout */
  const onChangeSlider = (type: SliderType, value: number) => {
    if (!value) return
    switch (type) {
      case 'FontSize':
        setFontSize(value)
        break
      case 'LineHeight':
        setLineHeight(value)
        break
      case 'MarginHorizontal':
        setMarginHorizontal(value)
        break
      case 'MarginVertical':
        setMarginVertical(value)
        break
      default:
        break
    }
  }

  const onClickDirection = (type: 'Horizontal' | 'Vertical') => {
    if (type === 'Horizontal') {
      setIsScrollHorizontal(true)
      setViewType({ ...viewType, active: true })
      onBookOptionChange({
        ...bookOption,
        flow: 'paginated',
      })
    } else {
      setIsScrollHorizontal(false)
      setViewType({ ...viewType, active: false })
      onBookOptionChange({
        ...bookOption,
        flow: 'scrolled-doc',
      })
    }
    // onToggle()
  }

  const onClickViewType = (isSpread: boolean) => {
    if (isSpread) {
      setViewType({ ...viewType, spread: true })
      onBookOptionChange({
        ...bookOption,
        spread: 'auto',
      })
    } else {
      setViewType({ ...viewType, spread: false })
      onBookOptionChange({
        ...bookOption,
        spread: 'none',
      })
    }
    // onToggle()
  }

  /* eslint-disable */
  useEffect(() => {
    const timer = window.setTimeout(() => {
      onBookStyleChange({
        fontFamily,
        fontSize,
        lineHeight,
        marginHorizontal,
        marginVertical,
        fontWeight,
      })
    }, 500)
    return () => window.clearTimeout(timer)
  }, [
    fontFamily,
    fontSize,
    lineHeight,
    marginHorizontal,
    marginVertical,
    viewType,
    fontWeight,
  ])
  /* eslint-enable */

  /** Re-register close event, when after set */
  useEffect(() => emitEvent(), [bookStyle, emitEvent])

  return (
    <>
      <Sheet open={control.display} onOpenChange={(open) => onToggle()}>
        <SheetContent side={'right'} className="">
          <SheetHeader className="mb-4">
            <h3 className="text-xl font-bold">Highlights</h3>
          </SheetHeader>
          <div className="box-border p-6">
            <ControlIconBtnWrapper title="View Direction">
              <ControlIconBtn
                type="ScrollHorizontal"
                alt="Horizontal View"
                active={true}
                isSelected={isScrollHorizontal}
                onClick={() => onClickDirection('Horizontal')}
              />
              <ControlIconBtn
                type="ScrollVertical"
                alt="Vertical View"
                active={true}
                isSelected={!isScrollHorizontal}
                onClick={() => onClickDirection('Vertical')}
              />
            </ControlIconBtnWrapper>
            <ControlIconBtnWrapper title="View Spread">
              <ControlIconBtn
                type="BookOpen"
                alt="Two Page View"
                active={viewType.active}
                isSelected={viewType.spread}
                onClick={() => onClickViewType(true)}
              />
              <ControlIconBtn
                type="BookClose"
                alt="One Page View"
                active={viewType.active}
                isSelected={!viewType.spread}
                onClick={() => onClickViewType(false)}
              />
            </ControlIconBtnWrapper>
            <div className="mb-4">
              <h1 className="mb-4 text-sm font-medium">Font</h1>
              <Select
                defaultValue={fontFamily}
                onValueChange={onSelectFontFamily}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a fruit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Fonts</SelectLabel>
                    {['Origin', 'Roboto']?.map((font, index) => (
                      <SelectItem value={font} key={index}>
                        {font}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <OptionSlider
              active={true}
              title="Size"
              minValue={8}
              maxValue={36}
              defaultValue={fontSize}
              step={1}
              onChange={(e) => onChangeSlider('FontSize', e)}
            />
            <OptionSlider
              active={true}
              title="Weight"
              minValue={100}
              maxValue={900}
              defaultValue={fontWeight}
              step={100}
              onChange={(e) => setFontWeight(e)}
            />
            <OptionSlider
              active={true}
              title="Line height"
              minValue={1}
              maxValue={3}
              defaultValue={lineHeight}
              step={0.1}
              onChange={(e) => onChangeSlider('LineHeight', e)}
            />
            <OptionSlider
              active={true}
              title="Horizontal margin"
              minValue={0}
              maxValue={100}
              defaultValue={marginHorizontal}
              step={1}
              onChange={(e) => onChangeSlider('MarginHorizontal', e)}
            />
            <OptionSlider
              active={bookFlow === 'paginated'}
              title="Vertical margin"
              minValue={0}
              maxValue={100}
              defaultValue={marginVertical}
              step={1}
              onChange={(e) => onChangeSlider('MarginVertical', e)}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

interface Props {
  control: MenuControl
  bookStyle: BookStyle
  bookOption: BookOption
  bookFlow: BookFlow
  onToggle: () => void
  emitEvent: () => void
  onBookStyleChange: (bookStyle: BookStyle) => void
  onBookOptionChange: (bookOption: BookOption) => void
}

type SliderType =
  | 'FontSize'
  | 'LineHeight'
  | 'MarginHorizontal'
  | 'MarginVertical'

type ViewType = {
  active: boolean
  spread: boolean
}

export default React.forwardRef(Option)
