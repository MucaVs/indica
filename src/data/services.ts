export type Category = 'Reparos' | 'Aulas' | 'Limpeza' | 'Pets'

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
  neighborhood: string
  description: string
  price: number
  unit: string
  image: string
  keywords: string[]
  reviews: Review[]
}

// Dados fictícios para estudar a interface antes de conectar o Supabase.
export const services: Service[] = [
  {
    id: 1,
    title: 'Eletricista residencial',
    category: 'Reparos',
    professional: 'Carlos Oliveira',
    neighborhood: 'Vila Mariana',
    description:
      'Instalação de tomadas, troca de chuveiros e pequenos reparos elétricos. Atendimento cuidadoso para deixar sua casa funcionando direitinho. O valor inicial é por visita; materiais e serviços adicionais são combinados à parte.',
    price: 120,
    unit: 'visita',
    image: '/images/eletricista.jpg',
    keywords: ['eletricidade', 'elétrica', 'eletricista', 'tomada', 'chuveiro'],
    reviews: [
      {
        id: 1,
        author: 'Mariana Costa',
        rating: 5,
        comment:
          'Trocou meu chuveiro e resolveu uma tomada que estava com problema. Pontual e muito caprichoso!',
        date: '2026-10-28',
      },
      {
        id: 2,
        author: 'Rafael Lima',
        rating: 5,
        comment:
          'Explicou tudo antes de começar e deixou o local organizado. Recomendo aos vizinhos.',
        date: '2026-10-20',
      },
      {
        id: 3,
        author: 'Ana Souza',
        rating: 4,
        comment:
          'Fez um ótimo trabalho na iluminação da sala. Combinamos o orçamento antes da visita.',
        date: '2026-10-12',
      },
    ],
  },
  {
    id: 2,
    title: 'Aulas de inglês para você',
    category: 'Aulas',
    professional: 'Juliana Martins',
    neighborhood: 'Vila Mariana',
    description:
      'Inglês do básico à conversação, com aulas adaptadas ao seu ritmo e aos seus objetivos. Encontros individuais online ou presenciais no bairro. Cada aula tem duração de uma hora.',
    price: 80,
    unit: 'hora',
    image: '/images/ingles.jpg',
    keywords: ['inglês', 'professora', 'professor', 'idiomas', 'conversação'],
    reviews: [
      {
        id: 4,
        author: 'Pedro Alves',
        rating: 5,
        comment:
          'As aulas são leves e práticas. Estou muito mais confiante para conversar em inglês.',
        date: '2026-10-30',
      },
      {
        id: 5,
        author: 'Beatriz Rocha',
        rating: 5,
        comment:
          'Muito paciente! Prepara as aulas de acordo com o que eu preciso no trabalho.',
        date: '2026-10-18',
      },
    ],
  },
  {
    id: 3,
    title: 'Sua casa limpa e bem cuidada',
    category: 'Limpeza',
    professional: 'Luciana Santos',
    neighborhood: 'Saúde',
    description:
      'Limpeza residencial com atenção aos detalhes, da cozinha aos quartos. Diária de até oito horas para apartamentos de até 70 m². Produtos de limpeza fornecidos pelo contratante.',
    price: 180,
    unit: 'diária',
    image: '/images/limpeza.jpg',
    keywords: ['diarista', 'faxina', 'limpeza', 'doméstica'],
    reviews: [
      {
        id: 6,
        author: 'Camila Dias',
        rating: 5,
        comment:
          'Minha casa ficou um brinco. Muito cuidadosa com os móveis e superatenciosa.',
        date: '2026-10-25',
      },
      {
        id: 7,
        author: 'Felipe Melo',
        rating: 4,
        comment:
          'Fez uma boa faxina, especialmente na cozinha. Vou chamar novamente.',
        date: '2026-10-15',
      },
    ],
  },
  {
    id: 4,
    title: 'Pintura que renova sua casa',
    category: 'Reparos',
    professional: 'Marcos Pereira',
    neighborhood: 'Aclimação',
    description:
      'Pintura de paredes e pequenos retoques com proteção dos móveis e do piso. O valor anunciado é a diária de mão de obra. Tintas e demais materiais são combinados conforme o ambiente.',
    price: 250,
    unit: 'diária',
    image: '/images/pintura.jpg',
    keywords: ['pintor', 'pintura', 'parede', 'reforma'],
    reviews: [
      {
        id: 8,
        author: 'Renata Nunes',
        rating: 5,
        comment: 'Pintou o quarto com muito cuidado. O acabamento ficou lindo!',
        date: '2026-10-22',
      },
      {
        id: 9,
        author: 'Bruno Castro',
        rating: 5,
        comment:
          'Cumpriu o prazo e protegeu todos os móveis. Serviço excelente.',
        date: '2026-10-10',
      },
    ],
  },
  {
    id: 5,
    title: 'Passeio e carinho para seu pet',
    category: 'Pets',
    professional: 'Fernanda Ribeiro',
    neighborhood: 'Paraíso',
    description:
      'Passeios individuais de 45 minutos com seu cachorro, respeitando o ritmo e as necessidades dele. Envio notícias do passeio e cuido de cada pet com atenção e carinho.',
    price: 40,
    unit: 'passeio',
    image: '/images/pets.jpg',
    keywords: ['cachorro', 'cão', 'dog walker', 'passeador', 'animais'],
    reviews: [
      {
        id: 10,
        author: 'Paula Gomes',
        rating: 5,
        comment:
          'O Bento adora os passeios! A Fernanda é carinhosa e sempre manda notícias.',
        date: '2026-10-29',
      },
      {
        id: 11,
        author: 'Diego Reis',
        rating: 4,
        comment:
          'Muito atenciosa com a Nina. Os passeios têm ajudado bastante na rotina.',
        date: '2026-10-19',
      },
    ],
  },
  {
    id: 6,
    title: 'Pequenos reparos hidráulicos',
    category: 'Reparos',
    professional: 'Roberto Almeida',
    neighborhood: 'Saúde',
    description:
      'Conserto de torneiras, troca de sifões e solução de pequenos vazamentos. O preço inicial cobre a visita e a avaliação. Peças e reparos são orçados antes da execução.',
    price: 100,
    unit: 'visita',
    image: '/images/reparos.jpg',
    keywords: ['encanador', 'hidráulica', 'vazamento', 'torneira', 'cano'],
    reviews: [
      {
        id: 12,
        author: 'Sofia Fernandes',
        rating: 5,
        comment:
          'Resolveu o vazamento da pia rapidamente e explicou como evitar o problema.',
        date: '2026-10-27',
      },
      {
        id: 13,
        author: 'Lucas Azevedo',
        rating: 4,
        comment:
          'Atendimento tranquilo e preço combinado antes do serviço. Recomendo.',
        date: '2026-10-16',
      },
    ],
  },
]
