export type Category = string

export interface Review {
  id: number
  author: string
  rating: number
  comment: string
  date: string
}

export interface Service {
  id: number
  title: string
  category: Category
  professional: string
  neighborhood?: string
  description: string
  price: number | null
  priceDetail: string
  image: string | null
  keywords?: string[]
  reviews: Review[]
}
