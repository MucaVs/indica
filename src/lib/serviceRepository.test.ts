import { describe, expect, it } from 'vitest'
import { mapCatalogRows } from './serviceRepository'
import type { CatalogRows } from './serviceRepository'
import {
  averageRating,
  filterServices,
  formatDate,
  formatPrice,
} from './services'

function catalogRows(): CatalogRows {
  return {
    services: [
      {
        id: 42,
        titulo: 'Eletricista',
        descricao: 'Reparos de eletricidade',
        categoria: 10,
        preco_estimado: 130,
        foto_url: null,
        criado_por: 77,
        preco_detalhe: 'por visita',
      },
    ],
    categories: [{ id: 10, categoria: 'Reparos' }],
    users: [
      { id: 77, nome_completo: 'Pessoa prestadora' },
      { id: 81, nome_completo: 'Pessoa avaliadora' },
    ],
    reviews: [
      {
        id: 1,
        servico_id: 42,
        autor_id: 81,
        nota: 5,
        comentario: 'Bom atendimento',
        created_at: '2026-11-07T15:00:00Z',
      },
      {
        id: 2,
        servico_id: 42,
        autor_id: 81,
        nota: 4,
        comentario: null,
        created_at: '2026-11-06T15:00:00Z',
      },
      {
        id: 3,
        servico_id: 99,
        autor_id: 81,
        nota: 1,
        comentario: 'Outro serviço',
        created_at: '2026-11-05T15:00:00Z',
      },
    ],
  }
}

describe('registros do Supabase', () => {
  it('liga categoria, prestador e avaliações usando os IDs reais', () => {
    const [service] = mapCatalogRows(catalogRows())
    expect(service).toMatchObject({
      id: 42,
      category: 'Reparos',
      professional: 'Pessoa prestadora',
      price: 130,
      priceDetail: 'por visita',
    })
    expect(service.reviews).toHaveLength(2)
    expect(service.reviews[0]).toMatchObject({
      author: 'Pessoa avaliadora',
      comment: 'Bom atendimento',
    })
    expect(averageRating(service.reviews)).toBe(4.5)
    expect(formatDate(service.reviews[0].date)).toBe('7 de novembro de 2026')
    expect(filterServices([service], 'eletricidade', 'Todos')).toHaveLength(1)
  })

  it('não transforma preço ausente em zero nem inventa dados de localização', () => {
    const rows = catalogRows()
    rows.services[0].preco_estimado = null
    rows.services[0].criado_por = null
    rows.services[0].categoria = null
    rows.reviews = []
    const [service] = mapCatalogRows(rows)
    expect(service.price).toBeNull()
    expect(formatPrice(service.price)).toBe('A combinar')
    expect(service.professional).toBe('Vizinho')
    expect(service.category).toBe('Sem categoria')
    expect(service.neighborhood).toBeUndefined()
    expect(service.image).toBeNull()
    expect(averageRating(service.reviews)).toBeNull()
  })

  it('ignora notas nulas ou fora de 1 a 5 em vez de distorcer a média', () => {
    const rows = catalogRows()
    rows.reviews[0].nota = null
    rows.reviews[1].nota = 9
    expect(mapCatalogRows(rows)[0].reviews).toEqual([])
  })
})
