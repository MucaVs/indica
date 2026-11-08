import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

export class CatalogConfigurationError extends Error {
  constructor() {
    super(
      'Configure VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY no .env.local.',
    )
    this.name = 'CatalogConfigurationError'
  }
}

let client: SupabaseClient<Database> | undefined

export function getSupabaseClient(): SupabaseClient<Database> {
  if (client) return client
  const url = import.meta.env.VITE_SUPABASE_URL?.trim()
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim()

  // Este cliente só aceita a chave publicável; chaves administrativas nunca
  // devem ser usadas em variáveis VITE_, que são enviadas ao navegador.
  if (!url || !key?.startsWith('sb_publishable_')) {
    throw new CatalogConfigurationError()
  }

  client = createClient<Database>(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })
  return client
}
