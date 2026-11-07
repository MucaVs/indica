import { describe, expect, it } from 'vitest'
import { services } from '../data/services'
import {
  averageRating,
  filterServices,
  formatDate,
  formatPrice,
  formatRating,
} from './services'

describe('busca de serviços', () => {
  it('aceita acentos, maiúsculas e espaços extras', () => {
    expect(
      filterServices(services, '  INGLÊS  ', 'Todos').map(
        (service) => service.id,
      ),
    ).toEqual([2])
    expect(
      filterServices(services, 'ingles', 'Todos').map((service) => service.id),
    ).toEqual([2])
  })
  it('encontra eletricidade e professor pelos termos relacionados', () => {
    expect(
      filterServices(services, 'eletricidade', 'Todos').map(
        (service) => service.id,
      ),
    ).toEqual([1])
    expect(
      filterServices(services, 'professor ingles', 'Todos').map(
        (service) => service.id,
      ),
    ).toEqual([2])
  })
  it('combina categoria e busca, e permite voltar à lista completa', () => {
    expect(filterServices(services, '', 'Reparos')).toHaveLength(3)
    expect(filterServices(services, 'ingles', 'Reparos')).toHaveLength(0)
    expect(filterServices(services, '', 'Todos')).toHaveLength(6)
  })
  it('retorna uma lista vazia para um serviço desconhecido', () => {
    expect(filterServices(services, 'astronauta', 'Todos')).toEqual([])
  })
})

describe('avaliações e formatos', () => {
  it('calcula a média das avaliações, sem arredondar antes de exibir', () => {
    expect(averageRating(services[0].reviews)).toBeCloseTo(14 / 3)
    expect(formatRating(averageRating(services[0].reviews)!)).toBe('4,7')
  })
  it('não inventa nota quando não há avaliações', () => {
    expect(averageRating([])).toBeNull()
  })
  it('exibe reais e datas no formato brasileiro sem alterar o dia', () => {
    expect(formatPrice(120).replace(/\s/g, ' ')).toBe('R$ 120,00')
    expect(formatDate('2026-10-28')).toBe('28 de outubro de 2026')
  })
})
