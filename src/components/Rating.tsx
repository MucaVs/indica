import { Star } from 'lucide-react'
import { formatRating } from '../lib/services'

export function Rating({
  value,
  count,
}: {
  value: number | null
  count?: number
}) {
  if (value === null)
    return <span className="no-reviews">Ainda sem avaliações</span>
  return (
    <span
      className="rating"
      aria-label={`${formatRating(value)} de 5 estrelas${count === undefined ? '' : `, ${count} avaliações`}`}
    >
      <span className="stars" aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => (
          <span className="star" key={index}>
            <Star className="star-base" size={14} />
            <span
              className="star-fill"
              style={{
                width: `${Math.max(0, Math.min(1, value - index)) * 100}%`,
              }}
            >
              <Star size={14} />
            </span>
          </span>
        ))}
      </span>
      <strong>{formatRating(value)}</strong>
      {count !== undefined && (
        <span className="review-count">
          ({count} {count === 1 ? 'avaliação' : 'avaliações'})
        </span>
      )}
    </span>
  )
}
