import { AxiosResponse } from 'axios'
import { FormikHelpers } from 'formik'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
// import { Reader } from '../../package/ebook-reader/[slug]/epub/models'

interface JQuery {
  radiojar(action: string, options: any): void
  on(event: string, handler: (event: any, data: any) => void): void
  off(event: string): void
  show(): void
  hide(): void
  html(content: string): void
}

interface RJQ extends JQuery {}

declare global {
  interface Window {
    rjq: (selector: string) => RJQ
    // reader: Reader
    // gtag: typeof gtag
  }
}

export interface RouterQuery {
  ref: string
}

export interface ListResponse<T> {
  limit: number
  current_page: number
  items: T[]
  data: T[]
  per_page: number
  total: number
  last_page: number
}

export interface ApiResponse<T> extends AxiosResponse<T> {
  profile: T
  OrderData: T
  error?: never
  count: number
  status: number
  message: string
}

export interface RouterPush {
  pathname: string
  // state?: SampleObject;
  // query: SampleObject;
}

export interface AxiosError {
  response?: string
  status?: number
  statusText?: string
}

export interface SubmitOption {
  router?: HistoryType
  id?: string
}

/** @type {next router history} */

export interface HistoryType {
  pathname: string
  asPath: string
  push: (p: string | RouterPush) => void
  back: () => void
  route: string
}

/** @type {formik form submit prop} */

export interface FormikSubmitOption<T = unknown, C = unknown>
  extends Partial<FormikHelpers<T>> {
  router?: AppRouterInstance
  conditions?: Record<string, C>
}

export interface FormDataPayload<T> {
  formData: T
  id: string
}

export interface ReqQuery {
  page: number
  limit: number
  status: string
  id: string
  isActive: string
  order: string
}

/**
 * @type {Omit by key}
 */
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

/**
 * @type { Manage Update or create module Base Payload }
 */
export interface ManagePayload<T, Q = unknown, P = unknown, C = unknown> {
  data: T
  query?: Q
  urlParams?: Q | P
  options?: FormikSubmitOption<T, C>
  id?: string | number
}

/**
 * @type { Manage Get module Base Payload }
 */
export interface ManageQuery<Q = unknown, U = unknown, T = unknown> {
  query?: Q
  urlParams?: Q | U
  options?: Record<string, T>
}

/**
 * @type { Dynamic module access object }
 * @module { Multi Select Filter, Table capsule }
 */
export type AccessObject = {
  name: string
  courseName: string
  programName: string
  batchName: string
  id: string
  Title: string
  image: string
}

export type AccessObjectKey = keyof AccessObject

/**
 * @type { Update status payload for all apis }
 */
export interface UpdateStatusPayload {
  status: StatusEnum
}

export type StatusEnum = 'Active' | 'Inactive'

/**
 * @type { Bulk Upload Return type }
 */
export interface BulkUploadReturn<T = {}> {
  failed: string
  message: string
  result: T[]
  isSuccess: boolean
  errors?: string[]
}

export interface PageProps {
  params: { slug: string | number }
}
