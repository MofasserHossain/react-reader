// components
import { SingleSlider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'

const SliderMain = ({
  active,
  title,
  minValue,
  maxValue,
  defaultValue,
  step,
  onChange,
}: Props) => {
  const onChangeValue = (e: any) => {
    if (!active) return
    onChange(e)
  }

  return (
    <div className="mb-6">
      <h1 className="mb-4 text-sm font-medium">{title}</h1>
      <div className="flex h-6 items-center">
        <div
          className={cn(
            'mr-2 inline-block w-10 text-right text-sm',
            active ? 'text-primary' : '',
          )}
        >
          {defaultValue}
        </div>
        <SingleSlider
          disabled={!active}
          onValueChange={(range) => {
            onChangeValue(range?.[0])
          }}
          value={[defaultValue]}
          min={minValue}
          defaultValue={[0, defaultValue]}
          max={maxValue}
          step={step}
        />
      </div>
    </div>
  )
}

interface Props {
  active: boolean
  title: string
  minValue: number
  maxValue: number
  defaultValue: number
  step: number
  onChange: (e: any) => void
}

export default SliderMain
