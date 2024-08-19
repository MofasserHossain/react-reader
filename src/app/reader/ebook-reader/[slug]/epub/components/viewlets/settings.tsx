'use client'
import Dexie from 'dexie'
import { PropsWithChildren } from 'react'
import { ColorScheme, useColorScheme } from '../../hooks'
import { Button } from '../button'
import { Select } from '../form'
import { Page } from '../main-page'

export const Settings: React.FC = () => {
  const { scheme, setScheme } = useColorScheme()

  return (
    <Page headline={'Settings'}>
      <div className="space-y-6">
        <Item title={'Color Scheme'}>
          <Select
            value={scheme}
            onChange={(e) => {
              setScheme(e.target.value as ColorScheme)
            }}
          >
            <option value="system">{'System'}</option>
            <option value="light">{'Light'}</option>
            <option value="dark">{'Dark'}</option>
          </Select>
        </Item>
        {/* <Synchronization /> */}
        <Item title={'Cache'}>
          <Button
            variant="secondary"
            onClick={() => {
              window.localStorage.clear()
              Dexie.getDatabaseNames().then((names) => {
                names.forEach((n) => Dexie.delete(n))
              })
            }}
          >
            {'Clear Cache'}
          </Button>
        </Item>
      </div>
    </Page>
  )
}

interface PartProps {
  title: string
}
const Item: React.FC<PropsWithChildren<PartProps>> = ({ title, children }) => {
  return (
    <div>
      <h3 className="typescale-title-small text-surface-variant">{title}</h3>
      <div className="mt-2">{children}</div>
    </div>
  )
}

Settings.displayName = 'settings'
