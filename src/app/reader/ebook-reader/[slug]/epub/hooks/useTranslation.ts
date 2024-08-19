'use client'
// import { useRouter } from 'next/router'
import { useCallback } from 'react'

export function useTranslation(scope?: string) {
  // const { locale } = useRouter()
  return useCallback((key: string) => {
    // @ts-ignore
    return key
  }, [])
}
