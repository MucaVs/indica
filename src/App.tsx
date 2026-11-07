import { useState } from 'react'
import {
  ArrowDown,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronRight,
  House,
  LayoutGrid,
  MapPin,
  PawPrint,
  Search,
  SearchX,
  ShieldCheck,
  Sparkles,
  UsersRound,
  Wrench,
  X,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { services } from './data/services'
import type { Service } from './data/services'
import { averageRating, filterServices, formatPrice } from './lib/services'
import { Rating } from './components/Rating'
import { ServiceDetails } from './components/ServiceDetails'
import './App.css'

const categories: { name: string; icon: LucideIcon; caption: string }[] = [
  { name: 'Todos', icon: LayoutGrid, caption: 'Um pouco de tudo' },
  { name: 'Reparos', icon: Wrench, caption: 'Sua casa em dia' },
  { name: 'Aulas', icon: BookOpen, caption: 'Aprenda algo novo' },
  { name: 'Limpeza', icon: Sparkles, caption: 'Mais tempo pra você' },
  { name: 'Pets', icon: PawPrint, caption: 'Cuidado e carinho' },
]

function App() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Todos')
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const visibleServices = filterServices(services, query, category)

  function clearFilters() {
    setQuery('')
    setCategory('Todos')
  }

  return (
    <>
      <a className="skip-link" href="#servicos">
        Pular para serviços
      </a>
      <header className="site-header">
        <div className="container header-inner">
          <a className="brand" href="/" aria-label="Indica, início">
            <span className="brand-icon">
              <House size={23} strokeWidth={2.5} />
            </span>
            indica<span className="brand-dot">.</span>
          </a>
          <span className="header-caption">Gente boa, pertinho de você.</span>
          <a className="header-link" href="#servicos">
            Explorar serviços <ArrowUpRight size={16} />
          </a>
        </div>
      </header>
      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-pattern" aria-hidden="true" />
          <div className="container hero-inner">
            <div className="community-label">
              <span className="community-dot" /> DE VIZINHO PARA VIZINHO
            </div>
            <h1 id="hero-title">
              Um bom serviço começa
              <br />
              com uma boa <span>indicação.</span>
            </h1>
            <p>Encontre quem sabe fazer, com a confiança de quem mora perto.</p>
            <form
              className="search-form"
              role="search"
              onSubmit={(event) => {
                event.preventDefault()
                document
                  .getElementById('servicos')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              <Search size={22} aria-hidden="true" />
              <label className="sr-only" htmlFor="service-search">
                Qual serviço você procura?
              </label>
              <input
                id="service-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="O que você está procurando? Ex.: eletricista, inglês..."
              />
              {query && (
                <button
                  type="button"
                  className="clear-search"
                  onClick={() => setQuery('')}
                  aria-label="Limpar pesquisa"
                >
                  <X size={17} />
                </button>
              )}
              <button className="search-button" type="submit">
                Buscar <ArrowUpRight size={17} />
              </button>
            </form>
            <div className="hero-proof">
              <span>
                <ShieldCheck size={16} /> Avaliações de vizinhos
              </span>
              <span className="proof-divider" />
              <span>
                <UsersRound size={16} /> Talentos do seu bairro
              </span>
            </div>
          </div>
        </section>
        <section
          className="categories-section container"
          aria-label="Filtrar por categoria"
        >
          <div className="category-grid">
            {categories.map(({ name, icon: Icon, caption }) => (
              <button
                key={name}
                className={`category-button ${category === name ? 'active' : ''}`}
                aria-pressed={category === name}
                onClick={() => setCategory(name)}
              >
                <span className="category-icon">
                  <Icon size={23} strokeWidth={1.7} />
                </span>
                <span>
                  <strong>
                    {name === 'Todos' ? 'Todos os serviços' : name}
                  </strong>
                  <small>{caption}</small>
                </span>
                {category === name && (
                  <Check className="category-check" size={14} />
                )}
              </button>
            ))}
          </div>
        </section>
        <section
          id="servicos"
          className="container services-section"
          aria-labelledby="services-title"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">BONS PROFISSIONAIS. BOAS CONEXÕES.</p>
              <h2 id="services-title">
                Encontre seu próximo <span>vizinho de confiança</span>
              </h2>
            </div>
            <span className="local-label">
              <MapPin size={15} /> São Paulo, SP
            </span>
          </div>
          <div className="results-bar">
            <p role="status" aria-live="polite">
              <strong>{visibleServices.length}</strong>{' '}
              {visibleServices.length === 1
                ? 'serviço encontrado'
                : 'serviços encontrados'}
              {category !== 'Todos' && ` em ${category}`}
              {query.trim() && <> para “{query.trim()}”</>}
            </p>
            {query || category !== 'Todos' ? (
              <button className="text-button" onClick={clearFilters}>
                Limpar filtros <X size={14} />
              </button>
            ) : (
              <span className="results-hint">
                Uma boa indicação faz toda a diferença <ArrowDown size={13} />
              </span>
            )}
          </div>
          {visibleServices.length > 0 ? (
            <div className="services-grid">
              {visibleServices.map((service) => (
                <button
                  key={service.id}
                  className="service-card"
                  onClick={() => setSelectedService(service)}
                  aria-label={`Ver detalhes de ${service.title}`}
                >
                  <div className="card-image">
                    <img src={service.image} alt="" loading="lazy" />
                    <span className="image-category">{service.category}</span>
                    <span className="card-open" aria-hidden="true">
                      <ArrowUpRight size={19} />
                    </span>
                  </div>
                  <div className="card-content">
                    <p className="card-professional">
                      <span className="mini-avatar">
                        {service.professional[0]}
                      </span>
                      {service.professional}
                    </p>
                    <h3>{service.title}</h3>
                    <p className="location">
                      <MapPin size={13} /> {service.neighborhood}
                    </p>
                    <Rating
                      value={averageRating(service.reviews)}
                      count={service.reviews.length}
                    />
                    <div className="card-bottom">
                      <div>
                        <span className="price-label">A partir de</span>
                        <p>
                          <strong>{formatPrice(service.price)}</strong>
                          <span> / {service.unit}</span>
                        </p>
                      </div>
                      <span className="details-label">
                        Ver serviço <ChevronRight size={15} />
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span>
                <SearchX size={30} />
              </span>
              <h3>Nenhum serviço por aqui ainda</h3>
              <p>
                Tente outro termo, como “eletricista” ou “inglês”,
                <br />
                ou explore todas as categorias.
              </p>
              <button className="search-button" onClick={clearFilters}>
                Ver todos os serviços <ArrowUpRight size={17} />
              </button>
            </div>
          )}
        </section>
        <aside className="container neighborhood-note">
          <span className="note-icon">
            <House size={25} strokeWidth={1.6} />
          </span>
          <div>
            <h2>O melhor do bairro é quem faz parte dele.</h2>
            <p>Por trás de cada serviço, tem um vizinho pronto para ajudar.</p>
          </div>
          <span className="note-sparkle" aria-hidden="true">
            <Sparkles size={27} />
          </span>
        </aside>
      </main>
      <footer className="site-footer container">
        <a className="brand footer-brand" href="/">
          indica<span className="brand-dot">.</span>
        </a>
        <p>Feito para conectar vizinhos.</p>
        <span>Projeto de estudo · Dados de demonstração</span>
      </footer>
      {selectedService && (
        <ServiceDetails
          service={selectedService}
          onClose={() => setSelectedService(null)}
        />
      )}
    </>
  )
}

export default App
