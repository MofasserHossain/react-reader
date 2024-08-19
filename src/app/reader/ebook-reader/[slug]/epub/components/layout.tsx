'use client'
// import { Overlay } from '@literal-ui/core'
import {
  ComponentProps,
  PropsWithChildren,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useRecoilState } from 'recoil'
import type { Action } from '../hooks'

import {
  Env,
  useAction,
  useColorScheme,
  useMobile,
  useSetAction,
} from '../hooks'
import { reader, useReaderSnapshot } from '../models'
import { navbarState } from '../state'
import { activeClass } from '../styles'

import { cn } from '@/lib/utils'
import {
  CaseSensitive,
  Home,
  ImageIcon,
  Search,
  SettingsIcon,
  TableOfContents,
  Underline,
  Waypoints,
} from 'lucide-react'
import { SplitView, useSplitViewItem } from './base'
import { AnnotationView } from './viewlets/annotation-view'
import { ImageView } from './viewlets/image-view'
import { SearchView } from './viewlets/search-view'
import { Settings } from './viewlets/settings'
import { TimelineView } from './viewlets/timeline-view'
import { TocView } from './viewlets/toc-view'
import { TypographyView } from './viewlets/typography-view'

export const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  useColorScheme()

  const [ready, setReady] = useState(false)
  const setAction = useSetAction()
  const mobile = useMobile()

  useEffect(() => {
    if (mobile === undefined) return
    setAction(mobile ? undefined : 'toc')
    setReady(true)
  }, [mobile, setAction])

  return (
    <div id="layout" className="h-full min-h-screen select-none">
      <SplitView>
        {mobile === false && <ActivityBar />}
        {mobile === true && <NavigationBar />}
        {ready && <SideBar />}
        {ready && <Reader>{children}</Reader>}
      </SplitView>
    </div>
  )
}

interface IAction {
  name: string
  title: string
  Icon: (props: any) => JSX.Element
  env: number
}
interface IViewAction extends IAction {
  name: Action
  View: React.FC<any>
}

const viewActions: IViewAction[] = [
  {
    name: 'toc',
    title: 'toc',
    Icon: () => <TableOfContents />,
    View: TocView,
    env: Env.Desktop | Env.Mobile,
  },
  {
    name: 'search',
    title: 'search',
    Icon: () => <Search />,
    View: SearchView,
    env: Env.Desktop | Env.Mobile,
  },
  {
    name: 'annotation',
    title: 'annotation',
    Icon: () => <Underline />,
    View: AnnotationView,
    env: Env.Desktop | Env.Mobile,
  },
  {
    name: 'image',
    title: 'image',
    Icon: () => <ImageIcon />,
    View: ImageView,
    env: Env.Desktop,
  },
  {
    name: 'timeline',
    title: 'timeline',
    Icon: () => <Waypoints />,
    View: TimelineView,
    env: Env.Desktop,
  },
  {
    name: 'typography',
    title: 'typography',
    Icon: () => <CaseSensitive />,
    View: TypographyView,
    env: Env.Desktop | Env.Mobile,
  },
]

const ActivityBar: React.FC = () => {
  useSplitViewItem(ActivityBar, {
    preferredSize: 48,
    minSize: 48,
    maxSize: 48,
  })
  return (
    <div className="ActivityBar flex flex-col justify-between">
      <ViewActionBar env={Env.Desktop} />
      <PageActionBar env={Env.Desktop} />
    </div>
  )
}

interface EnvActionBarProps extends ComponentProps<'div'> {
  env: Env
}

function ViewActionBar({ className, env }: EnvActionBarProps) {
  const [action, setAction] = useAction()

  return (
    <ActionBar className={className}>
      {viewActions
        .filter((a) => a.env & env)
        .map(({ name, title, Icon }) => {
          const active = action === name
          return (
            <Action
              title={title}
              Icon={Icon}
              active={active}
              onClick={() => setAction(active ? undefined : name)}
              key={name}
            />
          )
        })}
    </ActionBar>
  )
}

function PageActionBar({ env }: EnvActionBarProps) {
  const mobile = useMobile()
  const [action, setAction] = useState('Home')

  interface IPageAction extends IAction {
    Component?: React.FC
    disabled?: boolean
  }

  const pageActions: IPageAction[] = useMemo(
    () => [
      {
        name: 'home',
        title: 'home',
        Icon: () => <Home />,
        env: Env.Mobile,
      },
      {
        name: 'settings',
        title: 'settings',
        Icon: () => <SettingsIcon />,
        Component: Settings,
        env: Env.Desktop | Env.Mobile,
      },
    ],
    [],
  )

  return (
    <ActionBar>
      {pageActions
        .filter((a) => a.env & env)
        .map(({ name, title, Icon, Component, disabled }, i) => (
          <Action
            title={title}
            Icon={Icon}
            active={mobile ? action === name : undefined}
            disabled={disabled}
            onClick={() => {
              Component ? reader.addTab(Component) : reader.clear()
              setAction(name)
            }}
            key={i}
          />
        ))}
    </ActionBar>
  )
}

function NavigationBar() {
  const r = useReaderSnapshot()
  const readMode = r.focusedTab?.isBook
  const [visible, setVisible] = useRecoilState(navbarState)

  return (
    <>
      {/* {visible && (
        <Overlay
          className="!bg-transparent"
          onClick={() => setVisible(false)}
        />
      )} */}
      <div className="NavigationBar fixed inset-x-0 bottom-0 z-10 border-t border-surface-variant bg-background">
        {readMode ? (
          <ViewActionBar env={Env.Mobile} className={cn(visible || 'hidden')} />
        ) : (
          <PageActionBar env={Env.Mobile} />
        )}
      </div>
    </>
  )
}

interface ActionBarProps extends ComponentProps<'ul'> {}
function ActionBar({ className, ...props }: ActionBarProps) {
  return (
    <ul className={cn('ActionBar flex sm:flex-col', className)} {...props} />
  )
}

interface ActionProps extends ComponentProps<'button'> {
  Icon: (props: any) => JSX.Element
  active?: boolean
}
const Action: React.FC<ActionProps> = ({
  className,
  Icon,
  active,
  ...props
}) => {
  const mobile = useMobile()
  return (
    <button
      className={cn(
        'Action relative flex h-12 w-12 flex-1 items-center justify-center sm:flex-initial',
        active ? 'text-surface-variant' : 'text-surface-outline',
        props.disabled ? 'text-on-disabled' : 'hover:text-surface-variant',
        className,
      )}
      {...props}
    >
      {active &&
        (mobile || (
          <div
            className={cn('absolute', 'inset-y-0 left-0 w-0.5', activeClass)}
          />
        ))}
      <Icon size={28} />
    </button>
  )
}

const SideBar: React.FC = () => {
  const [action, setAction] = useAction()
  const mobile = useMobile()
  // const t = useTranslation()
  const { size } = useSplitViewItem(SideBar, {
    preferredSize: 240,
    minSize: 160,
    visible: !!action,
  })

  return (
    <>
      {/* {action && mobile && <Overlay onClick={() => setAction(undefined)} />} */}
      <div
        className={cn(
          'SideBar flex flex-col bg-background',
          !action && '!hidden',
          mobile ? 'absolute inset-y-0 right-0 z-10' : '',
        )}
        style={{ width: mobile ? '75%' : size }}
      >
        {viewActions.map(({ name, title, View }) => (
          <View
            key={name}
            name={name}
            title={title}
            className={cn(name !== action && '!hidden')}
          />
        ))}
      </div>
    </>
  )
}

interface ReaderProps extends ComponentProps<'div'> {}
const Reader: React.FC<PropsWithChildren> = ({
  className,
  ...props
}: ReaderProps) => {
  useSplitViewItem(Reader)
  // const [bg] = useBackground()
  const r = useReaderSnapshot()
  const readMode = r.focusedTab?.isBook

  return (
    <div
      className={cn(
        'Reader min-h-screen flex-1 overflow-hidden',
        readMode || 'mb-12 sm:mb-0',
        // bg,
      )}
      {...props}
    />
  )
}
