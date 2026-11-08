import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'
import { services } from './test/services.fixture'

describe('experiência do vizinho', () => {
  it('não exibe exemplos locais nem inventa localização quando não recebe dados', () => {
    render(<App />)
    expect(screen.getByText('Nenhum serviço disponível')).toBeVisible()
    expect(
      screen.queryByRole('button', { name: /Ver detalhes de/ }),
    ).not.toBeInTheDocument()
    expect(screen.queryByText('Carlos Oliveira')).not.toBeInTheDocument()
    expect(screen.queryByText('São Paulo, SP')).not.toBeInTheDocument()
    expect(screen.queryByText('Dados de demonstração')).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /Reparos/ }),
    ).not.toBeInTheDocument()
  })
  it('mostra serviços e permite pesquisar inglês sem acento', async () => {
    const user = userEvent.setup()
    render(<App services={services} />)
    expect(
      screen.getAllByRole('button', { name: /Ver detalhes de/ }),
    ).toHaveLength(6)
    await user.type(screen.getByRole('searchbox'), 'ingles')
    expect(
      screen.getAllByRole('button', { name: /Ver detalhes de/ }),
    ).toHaveLength(1)
    expect(
      screen.getByRole('button', {
        name: 'Ver detalhes de Aulas de inglês para você',
      }),
    ).toBeVisible()
    await user.click(screen.getByRole('button', { name: 'Limpar pesquisa' }))
    expect(
      screen.getAllByRole('button', { name: /Ver detalhes de/ }),
    ).toHaveLength(6)
  })

  it('filtra por categoria e recupera a busca sem resultados', async () => {
    const user = userEvent.setup()
    render(<App services={services} />)
    await user.click(screen.getByRole('button', { name: /Reparos/ }))
    expect(
      screen.getAllByRole('button', { name: /Ver detalhes de/ }),
    ).toHaveLength(3)
    await user.type(screen.getByRole('searchbox'), 'astronauta')
    expect(screen.getByText('Nenhum serviço por aqui ainda')).toBeVisible()
    await user.click(
      screen.getByRole('button', { name: 'Ver todos os serviços' }),
    )
    expect(screen.getByRole('searchbox')).toHaveValue('')
    expect(
      screen.getAllByRole('button', { name: /Ver detalhes de/ }),
    ).toHaveLength(6)
  })

  it('abre preço, média real e comentários de cada vizinho; fecha pelo botão', async () => {
    const user = userEvent.setup()
    render(<App services={services} />)
    await user.click(
      screen.getByRole('button', {
        name: 'Ver detalhes de Eletricista residencial',
      }),
    )
    const dialog = screen.getByRole('dialog', {
      name: 'Eletricista residencial',
    })
    expect(within(dialog).getByText('R$ 120,00')).toBeVisible()
    expect(
      within(dialog).getByText(/de 5 · média de 3 avaliações/),
    ).toHaveTextContent('4,7')
    expect(within(dialog).getByText('Mariana Costa')).toBeVisible()
    expect(within(dialog).getByLabelText('4,0 de 5 estrelas')).toBeVisible()
    expect(within(dialog).getByText(/Trocou meu chuveiro/)).toBeVisible()
    await user.click(
      within(dialog).getByRole('button', { name: 'Fechar detalhes' }),
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(
      screen.getByRole('button', {
        name: 'Ver detalhes de Eletricista residencial',
      }),
    ).toHaveFocus()
  })

  it('fecha os detalhes ao receber o cancelamento nativo (Escape)', async () => {
    const user = userEvent.setup()
    render(<App services={services} />)
    await user.click(
      screen.getByRole('button', {
        name: 'Ver detalhes de Aulas de inglês para você',
      }),
    )
    fireEvent(
      screen.getByRole('dialog'),
      new Event('cancel', { bubbles: false }),
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
