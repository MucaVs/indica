import { useEffect, useRef } from 'react'
import { MapPin, X, MessageCircle } from 'lucide-react'
import type { Service } from '../data/services'
import {
  averageRating,
  formatDate,
  formatPrice,
  formatRating,
} from '../lib/services'
import { Rating } from './Rating'

export function ServiceDetails({
  service,
  onClose,
}: {
  service: Service
  onClose: () => void
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const average = averageRating(service.reviews)

  useEffect(() => {
    const dialog = dialogRef.current
    const previousFocus = document.activeElement
    dialog?.showModal()
    return () => {
      dialog?.close()
      if (previousFocus instanceof HTMLElement) {
        previousFocus.focus({ preventScroll: true })
      }
    }
  }, [])

  return (
    <dialog
      ref={dialogRef}
      className="service-dialog"
      aria-labelledby="detail-title"
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          const rect = event.currentTarget.getBoundingClientRect()
          if (
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom
          )
            onClose()
        }
      }}
    >
      <div className="dialog-toolbar">
        <button
          className="close-button"
          onClick={onClose}
          aria-label="Fechar detalhes"
        >
          <X size={20} />
        </button>
      </div>
      <div className="detail-cover">
        <img src={service.image} alt="" />
        <span className="image-category">{service.category}</span>
      </div>
      <div className="detail-body">
        <p className="eyebrow">CONHEÇA QUEM FAZ</p>
        <h2 id="detail-title">{service.title}</h2>
        <p className="professional">com {service.professional}</p>
        <p className="location">
          <MapPin size={14} /> {service.neighborhood}, São Paulo
        </p>
        <Rating value={average} count={service.reviews.length} />
        <div className="detail-price">
          <span>A partir de</span>
          <p>
            <strong>{formatPrice(service.price)}</strong>
            <span> / {service.unit}</span>
          </p>
        </div>
        <h3>Sobre o serviço</h3>
        <p className="description">{service.description}</p>
        <section className="reviews-section" aria-labelledby="reviews-title">
          <div className="reviews-heading">
            <h3 id="reviews-title">
              <MessageCircle size={18} /> O que os vizinhos dizem
            </h3>
            <span>{service.reviews.length}</span>
          </div>
          {average !== null && (
            <p className="average-summary">
              <strong>{formatRating(average)}</strong> de 5 · média de{' '}
              {service.reviews.length} avaliações
            </p>
          )}
          {service.reviews.length === 0 && (
            <p className="description">
              Este serviço ainda não recebeu avaliações.
            </p>
          )}
          {service.reviews.map((review) => (
            <article className="review" key={review.id}>
              <div className="review-top">
                <span className="avatar">
                  {review.author
                    .split(' ')
                    .map((name) => name[0])
                    .slice(0, 2)
                    .join('')}
                </span>
                <div>
                  <h4>{review.author}</h4>
                  <time dateTime={review.date}>{formatDate(review.date)}</time>
                </div>
                <Rating value={review.rating} />
              </div>
              <p>{review.comment}</p>
            </article>
          ))}
        </section>
        <p className="demo-note">
          Serviço e avaliações fictícios, apenas para demonstração.
        </p>
      </div>
    </dialog>
  )
}
