import type { Review, Service } from '../types/service'

export function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .trim()
}

export function filterServices(
  services: Service[],
  query: string,
  category: string,
): Service[] {
  const terms = normalizeText(query).split(/\s+/).filter(Boolean)
  return services.filter((service) => {
    const text = normalizeText(
      [
        service.title,
        service.category,
        service.professional,
        service.description,
        service.neighborhood ?? '',
        ...(service.keywords ?? []),
      ].join(' '),
    )
    return (
      (category === 'Todos' || service.category === category) &&
      terms.every((term) => text.includes(term))
    )
  })
}

export function averageRating(reviews: Review[]): number | null {
  if (reviews.length === 0) return null
  return (
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
  )
}

export const formatPrice = (price: number | null): string =>
  price === null
    ? 'A combinar'
    : new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(price)

export const formatRating = (rating: number): string =>
  rating.toLocaleString('pt-BR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })

export const formatDate = (date: string): string =>
  new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Sao_Paulo',
  }).format(new Date(date.length === 10 ? `${date}T12:00:00Z` : date))
