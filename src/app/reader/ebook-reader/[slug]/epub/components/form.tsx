'use client'
import { cn } from '@/lib/utils'
import { Check, X } from 'lucide-react'
import {
  ComponentProps,
  ElementType,
  RefObject,
  useEffect,
  useRef,
} from 'react'
import { useMobile } from '../hooks'
import { IconButton } from './button'

type Action = {
  title: string
  Icon: (props: any) => JSX.Element
  onClick: (el: HTMLInputElement | null) => void
}

export type TextFieldProps<T extends ElementType> = {
  name: string
  hideLabel?: boolean
  autoFocus?: boolean
  actions?: Action[]
  onClear?: () => void
  // https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/forward_and_create_ref/#generic-forwardrefs
  mRef?: RefObject<HTMLInputElement> | null
} & any

export function TextField<T extends ElementType = 'input'>({
  name,
  as,
  className,
  hideLabel = false,
  autoFocus,
  actions = [],
  onClear,
  mRef: outerRef,
  ...props
}: TextFieldProps<T>) {
  const Component = as || 'input'
  const isInput = Component === 'input'
  const innerRef = useRef<HTMLInputElement>(null)
  const ref = outerRef || innerRef
  const mobile = useMobile()
  // const t = useTranslation()

  if (onClear) {
    actions = [
      ...actions,
      {
        title: 'Clear',
        Icon: X,
        onClick: onClear,
      },
    ]
  }

  useEffect(() => {
    if (mobile === false && autoFocus) {
      setTimeout(() => {
        ref.current?.focus()
      })
    }
  }, [autoFocus, mobile, ref])

  return (
    <div className={cn('flex flex-col', className)}>
      <Label name={name} hide={hideLabel}>
        {name}
      </Label>
      <div className="bg-default textfield flex grow items-center">
        <Component
          ref={ref}
          name={name}
          id={name}
          className={cn(
            'placeholder:text-outline/60 w-0 flex-1 bg-transparent px-1.5 py-1 !text-[13px] text-sm text-surface-variant',
            isInput || 'scroll h-full resize-none',
          )}
          {...props}
        />
        {!!actions.length && (
          <div className="mx-1 flex gap-0.5">
            {actions.map(({ onClick, ...a }: any) => (
              <IconButton
                className="text-outline !p-px"
                key={a.title}
                onClick={() => {
                  onClick(ref.current)
                }}
                {...a}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

interface CheckboxProps extends ComponentProps<'input'> {
  name: string
}
export const Checkbox: React.FC<CheckboxProps> = ({ name, ...props }) => {
  return (
    <div className="flex items-center">
      <Label name={name} />
      <div className="checkbox bg-default relative ml-auto rounded-sm">
        <input
          type="checkbox"
          name={name}
          id={name}
          className="peer block h-4 w-4 appearance-none"
          {...props}
        />
        <Check className="pointer-events-none invisible absolute top-0 text-surface-variant peer-checked:visible" />
      </div>
    </div>
  )
}

interface SelectProps extends ComponentProps<'select'> {
  name?: string
}
export const Select: React.FC<SelectProps> = ({
  name,
  className,
  ...props
}) => {
  return (
    <div className={cn('flex flex-col', className)}>
      {name && <Label name={name} />}
      <select
        name={name}
        id={name}
        className={cn(
          'bg-default max-w-xs px-0.5 py-1 !text-[13px] text-sm text-surface-variant',
        )}
        {...props}
      ></select>
    </div>
  )
}

interface ColorPickerProps extends ComponentProps<'input'> {
  name?: string
}
export const ColorPicker: React.FC<ColorPickerProps> = ({
  name,
  className,
  ...props
}) => {
  return (
    <div className={cn('flex flex-col', className)}>
      {name && <Label name={name} />}
      <input
        type="color"
        name={name}
        id={name}
        className="h-6 w-12"
        {...props}
      />
    </div>
  )
}

interface LabelProps extends ComponentProps<'label'> {
  name: string
  hide?: boolean
}
export const Label: React.FC<LabelProps> = ({
  name,
  hide = false,
  className,
}) => {
  return (
    <label
      htmlFor={name}
      className={cn(
        'mb-1 block text-sm text-surface-variant',
        hide && 'hidden',
        className,
      )}
    >
      {name}
    </label>
  )
}
