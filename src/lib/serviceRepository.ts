import type { Database } from '../types/database'
import type { Review, Service } from '../types/service'
import { getSupabaseClient } from './supabase'

type Tables = Database['public']['Tables']
export interface CatalogRows {
  services: Pick<
    Tables['servicos']['Row'],
    | 'id'
    | 'titulo'
    | 'descricao'
    | 'categoria'
    | 'preco_estimado'
    | 'foto_url'
    | 'criado_por'
    | 'preco_detalhe'
  >[]
  categories: Pick<Tables['categorias']['Row'], 'id' | 'categoria'>[]
  users: Pick<Tables['usuarios']['Row'], 'id' | 'nome_completo'>[]
  reviews: Tables['avaliacoes']['Row'][]
}

export function mapCatalogRows(rows: CatalogRows): Service[] {
  const categories = new Map(
    rows.categories.map((row) => [row.id, row.categoria]),
  )
  const users = new Map(
    rows.users.map((row) => [row.id, row.nome_completo?.trim()]),
  )
  const reviews = new Map<number, Review[]>()

  for (const row of rows.reviews) {
    if (
      row.servico_id === null ||
      row.nota === null ||
      !Number.isInteger(row.nota) ||
      row.nota < 1 ||
      row.nota > 5
    )
      continue
    const serviceReviews = reviews.get(row.servico_id) ?? []
    serviceReviews.push({
      id: row.id,
      author:
        (row.autor_id === null ? undefined : users.get(row.autor_id)) ||
        'Vizinho',
      rating: row.nota,
      comment: row.comentario?.trim() ?? '',
      date: row.created_at,
    })
    reviews.set(row.servico_id, serviceReviews)
  }

  return rows.services.map((row) => ({
    id: row.id,
    title: row.titulo?.trim() || 'Serviço sem título',
    category:
      (row.categoria === null ? undefined : categories.get(row.categoria)) ||
      'Sem categoria',
    professional:
      (row.criado_por === null ? undefined : users.get(row.criado_por)) ||
      'Vizinho',
    description: row.descricao?.trim() || 'Descrição não informada.',
    price:
      row.preco_estimado !== null &&
      Number.isFinite(row.preco_estimado) &&
      row.preco_estimado >= 0
        ? row.preco_estimado
        : null,
    priceDetail: row.preco_detalhe.trim(),
    image: row.foto_url,
    reviews: reviews.get(row.id) ?? [],
  }))
}

export async function loadServices(signal: AbortSignal): Promise<Service[]> {
  const supabase = getSupabaseClient()
  const [services, categories, users, reviews] = await Promise.all([
    supabase
      .from('servicos')
      .select(
        'id, titulo, descricao, categoria, preco_estimado, foto_url, criado_por, preco_detalhe',
      )
      .order('id')
      .abortSignal(signal),
    supabase
      .from('categorias')
      .select('id, categoria')
      .order('id')
      .abortSignal(signal),
    supabase
      .from('usuarios')
      .select('id, nome_completo')
      .order('id')
      .abortSignal(signal),
    supabase
      .from('avaliacoes')
      .select('*')
      .order('created_at', { ascending: false })
      .abortSignal(signal),
  ])
  const error =
    services.error ?? categories.error ?? users.error ?? reviews.error
  if (error)
    throw new Error('Não foi possível consultar o catálogo do Supabase.', {
      cause: error,
    })

  return mapCatalogRows({
    services: services.data ?? [],
    categories: categories.data ?? [],
    users: users.data ?? [],
    reviews: reviews.data ?? [],
  })
}
