import clsx from 'clsx'
import { ComponentProps } from 'react'

import { range } from '@/lib/utils'
import { useBackground, useColorScheme, useSourceColor } from '../../hooks'
import { Pane, PaneView, PaneViewProps } from '../base'
import { ColorPicker, Label } from '../form'

export const ThemeView: React.FC<PaneViewProps> = (props) => {
  const { setScheme } = useColorScheme()
  const { sourceColor, setSourceColor } = useSourceColor()
  const [, setBackground] = useBackground()

  return (
    <PaneView {...props}>
      <Pane headline={'Theme'} className="space-y-3 px-5 pb-4 pt-2">
        <div>
          <ColorPicker
            name={'Source Color'}
            defaultValue={sourceColor}
            onChange={(e) => {
              setSourceColor(e.target.value)
            }}
          />
        </div>
        <div>
          <Label name={'Background Color'}></Label>
          <div className="flex gap-2">
            {range(7)
              .filter((i) => !(i % 2))
              .map((i) => i - 1)
              .map((i) => (
                <Background
                  key={i}
                  className={i > 0 ? `bg-background${i}` : 'bg-white'}
                  onClick={() => {
                    setScheme('light')
                    setBackground(i)
                  }}
                />
              ))}
            <Background
              className="bg-black"
              onClick={() => {
                setScheme('dark')
              }}
            />
          </div>
        </div>
      </Pane>
    </PaneView>
  )
}

interface BackgroundProps extends ComponentProps<'div'> {}
const Background: React.FC<BackgroundProps> = ({ className, ...props }) => {
  return (
    <div
      className={clsx('border-outline-variant light h-6 w-6 border', className)}
      {...props}
    ></div>
  )
}
