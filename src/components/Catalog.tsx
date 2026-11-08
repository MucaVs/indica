import { useEffect, useState } from 'react'
import App from '../App'
import type { Service } from '../types/service'
import { loadServices } from '../lib/serviceRepository'
import { CatalogConfigurationError } from '../lib/supabase'

export type CatalogStatus = 'loading' | 'ready' | 'error' | 'unconfigured'

export function Catalog() {
  const [services, setServices] = useState<Service[]>([])
  const [status, setStatus] = useState<CatalogStatus>('loading')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    loadServices(controller.signal)
      .then((result) => {
        if (controller.signal.aborted) return
        setServices(result)
        setStatus('ready')
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        setServices([])
        setStatus(
          error instanceof CatalogConfigurationError ? 'unconfigured' : 'error',
        )
      })
    return () => controller.abort()
  }, [attempt])

  return (
    <App
      services={services}
      status={status}
      onRetry={() => {
        setStatus('loading')
        setAttempt((value) => value + 1)
      }}
    />
  )
}
